import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getUserIdFromCookie } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const userId = getUserIdFromCookie(cookieStore.get("sp_user")?.value);

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json().catch(() => null);
        const propertyIdRaw = body?.propertyId;
        const ratingRaw = body?.rating;

        const propertyId =
            typeof propertyIdRaw === "string"
                ? parseInt(propertyIdRaw, 10)
                : propertyIdRaw;

        const rating =
            typeof ratingRaw === "string" ? parseFloat(ratingRaw) : ratingRaw;

        if (!Number.isInteger(propertyId) || propertyId <= 0) {
            return NextResponse.json(
                { error: "Invalid propertyId" },
                { status: 400 }
            );
        }

        if (typeof rating !== "number" || Number.isNaN(rating)) {
            return NextResponse.json({ error: "Invalid rating" }, { status: 400 });
        }

        // Allow half-stars if you want later; for now clamp to 1..5
        const clamped = Math.max(1, Math.min(5, rating));

        const existing = await prisma.property.findUnique({
            where: { id: propertyId },
            select: { id: true, rating: true, ratingCount: true },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Property not found" },
                { status: 404 }
            );
        }

        const currentAvg = existing.rating ?? 0;
        const currentCount = existing.ratingCount ?? 0;

        const newCount = currentCount + 1;
        const newAvg =
            (currentAvg * currentCount + clamped) / (newCount === 0 ? 1 : newCount);

        const updated = await prisma.property.update({
            where: { id: propertyId },
            data: {
                rating: newAvg,
                ratingCount: newCount,
            },
            select: { rating: true, ratingCount: true },
        });

        return NextResponse.json(
            { ok: true, rating: updated.rating, ratingCount: updated.ratingCount },
            { status: 200 }
        );
    } catch (err) {
        console.error("Rate property error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
