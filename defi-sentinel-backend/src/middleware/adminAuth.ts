
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const ADMIN_SECRET = process.env.ADMIN_SECRET;

export const adminAuth = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['x-admin-secret'];

    if (!ADMIN_SECRET) {
        console.error("ADMIN_SECRET is not set in environment variables.");
        return res.status(500).json({ error: "Server configuration error" });
    }

    if (!authHeader || authHeader !== ADMIN_SECRET) {
        return res.status(401).json({ error: "Unauthorized: Invalid Admin Secret" });
    }

    next();
};
