
import { NextRequest, NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
import { logger } from "@/lib/logger";

function getSecretFromRequest(req: NextRequest) {
    return (
        req.headers.get("x-revalidate-secret") ||
        req.nextUrl.searchParams.get("secret") ||
        ""
    );
}

export async function POST(req: NextRequest) {
    logger.step("CRM cache revalidation started");

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

        // Global list caches - immediate expiration
        revalidateTag("crm-properties", { expire: 0 });
        revalidateTag("crm-properties-all", { expire: 0 });

        // Type-specific list caches - immediate expiration
        if (propertyType) {
            revalidateTag(`crm-properties-type-${propertyType}`, {
                expire: 0,
            });
        } else {
            // Fallback when CRM does not send property type
            revalidateTag("crm-properties-type-residential", { expire: 0 });
            revalidateTag("crm-properties-type-commercial", { expire: 0 });
            revalidateTag("crm-properties-type-industrial", { expire: 0 });
            revalidateTag("crm-properties-type-land", { expire: 0 });
        }

        // Single property detail cache - immediate expiration
        if (propertyId) {
            revalidateTag(`crm-property-${propertyId}`, {
                expire: 0,
            });

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
        logger.error("CRM cache revalidation failed", error);

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
