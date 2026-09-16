import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getUserIdFromCookie } from "@/lib/auth";
import { logger } from "@/lib/logger";

export async function POST(req: Request) {
    logger.step("Cart remove started");
    try {
        const cookieStore = await cookies();
        const userId = getUserIdFromCookie(cookieStore.get("sp_user")?.value);

        if (!userId) {
            return NextResponse.json({ error: "Not logged in" }, { status: 401 });
        }

        const { cartItemId } = await req.json();
        const id = Number(cartItemId);
        if (!Number.isFinite(id)) {
            return NextResponse.json({ error: "Invalid cartItemId" }, { status: 400 });
        }

        // Ensure user can only delete their own cart item
        await prisma.cartItem.deleteMany({
            where: { id, userId },
        });

        return NextResponse.json({ ok: true });
    } catch (error) {
        logger.error("Cart remove failed", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
