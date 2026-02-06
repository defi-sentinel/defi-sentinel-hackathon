import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import { verifyMessage } from 'viem';
import { db } from './db';
import { users } from './db/schema';
import { eq } from 'drizzle-orm';

const JWT_SECRET = process.env.JWT_SECRETwhat ;

// Generate a random nonce for the user to sign
export async function generateNonce(walletAddress: string): Promise<string> {
    const nonce = `Sign this message to verify your identity. Nonce: ${uuidv4()}`;

    // Store nonce in DB
    const wallet = walletAddress.toLowerCase();

    const existingUser = await db.select().from(users).where(eq(users.walletAddress, wallet)).limit(1);

    if (existingUser.length > 0) {
        await db.update(users).set({ nonce }).where(eq(users.walletAddress, wallet));
    } else {
        // Create skeleton user if not exists
        await db.insert(users).values({
            id: uuidv4(),
            walletAddress: wallet,
            nonce: nonce,
            memberSince: new Date(),
            tier: 'free'
        });
    }

    return nonce;
}

// Verify signature and issue JWT
export async function verifySignatureAndLogin(walletAddress: string, signature: string) {
    const wallet = walletAddress.toLowerCase();

    // 1. Get user and nonce
    const userResult = await db.select().from(users).where(eq(users.walletAddress, wallet)).limit(1);
    if (userResult.length === 0) {
        throw new Error('User not found');
    }

    const user = userResult[0];
    const nonce = user.nonce;

    if (!nonce) {
        throw new Error('No nonce generated for this user');
    }

    // 2. Verify signature
    const valid = await verifyMessage({
        address: wallet as `0x${string}`,
        message: nonce,
        signature: signature as `0x${string}`,
    });

    if (!valid) {
        throw new Error('Invalid signature');
    }

    // 3. Clear nonce (prevent replay)
    await db.update(users).set({ nonce: null }).where(eq(users.id, user.id));

    // 4. Issue JWT
    const token = jwt.sign(
        {
            id: user.id,
            address: wallet,
            tier: user.tier,
            expiryDate: user.expiryDate
        },
        JWT_SECRET,
        { expiresIn: '24h' }
    );

    return { token, user };
}

// Middleware helper to verify JWT
export function verifyToken(token: string) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (e) {
        return null;
    }
}
