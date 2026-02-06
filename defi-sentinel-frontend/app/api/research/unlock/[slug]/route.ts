import { NextRequest, NextResponse } from "next/server";
import { getPaidArticleContent } from "@/lib/cms";

import { API_BASE_URL } from "@/lib/constants";

const BACKEND_URL = API_BASE_URL;

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;

    // 1. Get Token from Header
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = authHeader.split(" ")[1];

    try {
        // 2. Validate Token with Backend
        const verifyRes = await fetch(`${BACKEND_URL}/user/me`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!verifyRes.ok) {
            return NextResponse.json({ error: "Invalid Session" }, { status: 403 });
        }

        const userData = await verifyRes.json();
        const user = userData.user;

        // 3. Check Membership (Simple Tier Check)
        // In production, you might check specific article permissions
        // For now: Any paid member (tier != free) can access
        if (!user || user.tier === "free") {
            // Double check if they bought a specific NFT/Badge if that's the logic
            // But for this "Research Hub", let's assume 'tier' or a badge is needed.
            // We will enable easier access: If they have PRO_MEMBER badge (3001) or SENTINEL_ELITE (3002).
            // Since backend check simplifies to 'tier', let's stick to that.
            // Or check badges from the user object if backend returned them.

            // Backend /user/me only returns the user table row currently.
            // If the user has 'monthly' or 'yearly', tier is not 'free'.

            return NextResponse.json(
                { error: "Membership Required" },
                { status: 402 } // Payment Required
            );
        }

        // 4. Retrieve Content
        const content = getPaidArticleContent(slug);

        if (!content) {
            return NextResponse.json({ error: "Article Not Found" }, { status: 404 });
        }

        // 5. Success
        return NextResponse.json({ content });

    } catch (error) {
        console.error("Unlock Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
