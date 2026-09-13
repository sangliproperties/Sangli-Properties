import { NextRequest, NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";

function getSecretFromRequest(req: NextRequest) {
    return (
        req.headers.get("x-revalidate-secret") ||
        req.nextUrl.searchParams.get("secret") ||
        ""
    );
}

export async function POST(req: NextRequest) {
    try {
        const expectedSecret = process.env.CRM_REVALIDATE_SECRET;

        if (!expectedSecret) {
            return NextResponse.json(
                { ok: false, error: "CRM_REVALIDATE_SECRET is not configured" },
                { status: 500 }
            );
        }

        const providedSecret = getSecretFromRequest(req);

        if (providedSecret !== expectedSecret) {
            return NextResponse.json(
                { ok: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await req.json().catch(() => ({}));

        const propertyId = String(
            body?.propertyId ?? body?.id ?? ""
        ).trim();

        const propertyType = String(
            body?.type ?? ""
        ).trim().toLowerCase();

        // Global list caches
        revalidateTag("crm-properties", "max");
        revalidateTag("crm-properties-all", "max");

        // Type-specific list caches
        if (propertyType) {
            revalidateTag(`crm-properties-type-${propertyType}`, "max");
        } else {
            // Safe fallback if CRM does not send type
            revalidateTag("crm-properties-type-residential", "max");
            revalidateTag("crm-properties-type-commercial", "max");
            revalidateTag("crm-properties-type-industrial", "max");
            revalidateTag("crm-properties-type-land", "max");
        }

        // Single property detail cache
        if (propertyId) {
            revalidateTag(`crm-property-${propertyId}`, "max");
            revalidatePath(`/properties/${propertyId}`);
        }

        // Optional belt-and-suspenders path revalidation
        revalidatePath("/");
        revalidatePath("/properties/residential");
        revalidatePath("/properties/commercial");
        revalidatePath("/properties/industrial");
        revalidatePath("/properties/land");

        return NextResponse.json({
            ok: true,
            revalidated: true,
            propertyId: propertyId || null,
            propertyType: propertyType || null,
        });
    } catch (error) {
        return NextResponse.json(
            {
                ok: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Unknown error during revalidation",
            },
            { status: 500 }
        );
    }
}