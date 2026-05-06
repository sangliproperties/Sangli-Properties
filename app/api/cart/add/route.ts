import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getUserIdFromCookie } from "@/lib/auth";


function fixMobileImageUrl(url: string) {
    const cleanUrl = String(url || "").trim();
    if (!cleanUrl) return "";

    const crmBaseUrl = process.env.CRM_BASE_URL?.replace(/\/+$/, "") || "";

    if (cleanUrl.startsWith("/")) {
        return crmBaseUrl ? `${crmBaseUrl}${cleanUrl}` : cleanUrl;
    }

    if (
        crmBaseUrl &&
        (cleanUrl.startsWith("http://localhost") ||
            cleanUrl.startsWith("http://127.0.0.1"))
    ) {
        const base = new URL(crmBaseUrl);
        const image = new URL(cleanUrl);

        return `${base.protocol}//${base.host}${image.pathname}${image.search}`;
    }

    return cleanUrl;
}

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const userId = getUserIdFromCookie(cookieStore.get("sp_user")?.value);

        if (!userId) {
            return NextResponse.json({ error: "Not logged in" }, { status: 401 });
        }

        const body = await req.json();
        const propertyId = body?.propertyId != null ? Number(body.propertyId) : null;
        const crmProperty = body?.crmProperty;

        // Local DB property flow
        if (propertyId && Number.isFinite(propertyId)) {
            const existingProperty = await prisma.property.findUnique({
                where: { id: propertyId },
                select: { id: true },
            });

            if (!existingProperty) {
                return NextResponse.json({ error: "Property not found" }, { status: 404 });
            }

            const existingCartItem = await prisma.cartItem.findFirst({
                where: {
                    userId,
                    propertyId,
                },
                select: { id: true },
            });

            if (existingCartItem) {
                return NextResponse.json(
                    { error: "Property is already saved" },
                    { status: 409 }
                );
            }

            const item = await prisma.cartItem.create({
                data: { userId, propertyId },
            });

            return NextResponse.json({ ok: true, item });
        }

        // CRM property flow
        if (crmProperty?.id) {
            const crmPropertyId = String(crmProperty.id).trim();

            if (!crmPropertyId) {
                return NextResponse.json({ error: "Invalid CRM property id" }, { status: 400 });
            }

            const existingCartItem = await prisma.cartItem.findFirst({
                where: {
                    userId,
                    crmPropertyId,
                },
                select: { id: true },
            });

            if (existingCartItem) {
                return NextResponse.json(
                    { error: "Property is already saved" },
                    { status: 409 }
                );
            }

            const item = await prisma.cartItem.create({
                data: {
                    userId,
                    crmPropertyId,
                    crmSlug: crmProperty.slug || null,
                    crmCodeNo: crmProperty.codeNo || null,
                    crmTitle: crmProperty.title || null,
                    crmLocation: crmProperty.location || null,
                    crmPrice:
                        crmProperty.price != null ? String(crmProperty.price) : null,
                    crmType: crmProperty.type || null,
                    crmTransactionType: crmProperty.transactionType || null,
                    crmImageUrl:
                        Array.isArray(crmProperty.images) && crmProperty.images.length > 0
                            ? fixMobileImageUrl(crmProperty.images[0])
                            : null,
                    crmImages: Array.isArray(crmProperty.images)
                        ? crmProperty.images.map((url: string) => fixMobileImageUrl(url)).filter(Boolean)
                        : [],
                },
            });

            return NextResponse.json({ ok: true, item });
        }

        return NextResponse.json(
            { error: "propertyId or crmProperty is required" },
            { status: 400 }
        );
    } catch (error) {
        console.error("Cart add error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}