import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getUserIdFromCookie } from "@/lib/auth";
import RemoveFromCartButton from "@/components/RemoveFromCartButton";
import PropertyCardCarousel from "@/components/PropertyCardCarousel";

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

export default async function CartPage() {
    const cookieStore = await cookies();
    const userId = getUserIdFromCookie(cookieStore.get("sp_user")?.value);

    if (!userId) {
        redirect(`/login?next=${encodeURIComponent("/cart")}`);
    }

    const items = await prisma.cartItem.findMany({
        where: { userId },
        include: {
            property: {
                include: { images: true },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="min-h-screen bg-white">
            <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-2xl font-bold text-[var(--color-header)]">My Saved Properties</h1>

                {items.length === 0 ? (
                    <p className="mt-4 text-sm text-[var(--color-muted)]">No properties saved yet.</p>
                ) : (
                    <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {items.map((item) => {
                            const p = item.property;

                            const isLocal = !!p;

                            const title = isLocal ? p.title : item.crmTitle || "Property";
                            const location = isLocal
                                ? `${p.locality}, ${p.city}`
                                : item.crmLocation || "-";

                            const priceText = isLocal
                                ? p.priceLabel?.trim()
                                    ? p.priceLabel
                                    : Number(p.price || 0).toLocaleString("en-IN")
                                : item.crmPrice || "-";

                            const detailsKey = isLocal
                                ? (p.slug && p.slug.trim())
                                    ? encodeURIComponent(p.slug.trim())
                                    : String(p.id)
                                : encodeURIComponent(String(item.crmPropertyId || ""));

                            const images = isLocal
                                ? (p.images?.length
                                    ? p.images.map((img) => ({
                                        ...img,
                                        url: fixMobileImageUrl(img.url),
                                    }))
                                    : [{ url: "/SP Placeholder Image2.png" }])
                                : Array.isArray(item.crmImages) && item.crmImages.length > 0
                                    ? item.crmImages.map((url) => ({
                                        url: fixMobileImageUrl(String(url)),
                                    }))
                                    : [{ url: fixMobileImageUrl(item.crmImageUrl || "/SP Placeholder Image2.png") }];

                            const purposeText = isLocal
                                ? String(p.purpose).replaceAll("_", " ")
                                : String(item.crmTransactionType || "").replaceAll("_", " ");

                            const typeText = isLocal
                                ? String(p.type).replaceAll("_", " ")
                                : String(item.crmType || "").replaceAll("_", " ");

                            return (
                                <div
                                    key={item.id}
                                    className="overflow-hidden rounded-[24px] border border-[var(--color-border)] bg-white"
                                >
                                    <a href={`/properties/${detailsKey}`} className="block h-80 w-full">
                                        <PropertyCardCarousel
                                            images={images}
                                            title={title}
                                            autoPlay
                                            intervalMs={3500}
                                            swipeMs={600}
                                        />
                                    </a>

                                    <div className="p-4">
                                        <p className="text-xs font-semibold tracking-[0.22em] text-[var(--color-accent)]">
                                            {purposeText} • {typeText}
                                        </p>

                                        <h3 className="mt-2 line-clamp-1 text-base font-bold text-[var(--color-header)]">
                                            {title}
                                        </h3>

                                        <p className="mt-1 line-clamp-1 text-sm text-[var(--color-muted)]">
                                            {location}
                                        </p>

                                        {!!item.crmCodeNo && !isLocal ? (
                                            <p className="mt-1 text-xs font-bold text-[var(--color-header)]">
                                                Code No: {item.crmCodeNo}
                                            </p>
                                        ) : null}

                                        <div className="mt-3 flex items-center justify-between">
                                            <div className="text-sm font-extrabold text-[var(--color-header)]">
                                                ₹ {priceText}
                                            </div>

                                            <RemoveFromCartButton cartItemId={item.id} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
