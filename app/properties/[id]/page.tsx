import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import PropertyGallery from "./PropertyGallery";
import ContactCTA from "./ContactCTA";
import { cookies } from "next/headers";
import { getUserIdFromCookie } from "@/lib/auth";
import AddToCartButton from "@/components/AddToCartButton";
import PropertyCardCarousel from "@/components/PropertyCardCarousel";
import { getWebsiteProperty, getWebsiteProperties, type CrmWebsiteProperty } from "@/lib/crm";
import { formatArea, formatPriceINR } from "@/lib/format";


function toNumber(value: string | number | null | undefined) {
    if (value == null || value === "") return null;
    const n = Number(String(value).replace(/[^\d.]/g, ""));
    return Number.isFinite(n) ? n : null;
}

function getCrmImages(property: CrmWebsiteProperty) {
    return Array.isArray(property.images) ? property.images.filter(Boolean) : [];
}

function getCrmPrice(property: CrmWebsiteProperty) {
    const n = toNumber(property.price);
    return n && n > 0 ? formatPriceINR(n) : "-";
}

function getCrmArea(property: CrmWebsiteProperty) {
    const n =
        toNumber(property.area) ??
        toNumber(property.builtUpArea) ??
        toNumber(property.carpetArea);

    return n && n > 0 ? formatArea(n) : "-";
}

function cleanText(value: unknown) {
    const s = String(value ?? "").trim();
    return s || "-";
}

function yesNo(value: unknown) {
    const v = String(value ?? "").trim().toLowerCase();

    if (!v) return "-";

    if (
        v === "true" ||
        v === "yes" ||
        v === "available" ||
        v === "1"
    ) {
        return "Yes";
    }

    if (
        v === "false" ||
        v === "no" ||
        v === "not available" ||
        v === "0"
    ) {
        return "No";
    }

    return String(value);
}

function getCategoryBucket(type: unknown) {
    const t = String(type || "").trim().toUpperCase();

    if (t.includes("LAND") || t.includes("PLOT")) return "LAND";
    if (t.includes("INDUSTRIAL")) return "INDUSTRIAL";
    if (t.includes("COMMERCIAL")) return "COMMERCIAL";
    return "RESIDENTIAL";
}

function normalizeTransactionType(value: unknown) {
    const v = String(value || "").trim().toUpperCase();

    if (v === "BUY" || v === "SELL" || v === "SALE") return "SELL";
    if (v === "RENT" || v === "LEASE") return "RENT";
    return v;
}

function normalizeText(value: unknown) {
    return String(value || "").trim().toLowerCase();
}

function getLocationTokens(value: unknown) {
    return normalizeText(value)
        .split(/[,/\\-]+|\s+/)
        .map((s) => s.trim())
        .filter((s) => s.length >= 3);
}

function getAreaNumber(property: CrmWebsiteProperty) {
    return (
        toNumber(property.area) ??
        toNumber(property.builtUpArea) ??
        toNumber(property.carpetArea)
    );
}

function getBedroomsNumber(property: CrmWebsiteProperty) {
    const n = Number(property.bedrooms);
    return Number.isFinite(n) ? n : null;
}

function getRelatedScore(base: CrmWebsiteProperty, candidate: CrmWebsiteProperty) {
    let score = 0;

    const baseCategory = getCategoryBucket(base.type);
    const candidateCategory = getCategoryBucket(candidate.type);

    if (baseCategory !== candidateCategory) {
        return -1;
    }

    score += 50;

    const baseTxn = normalizeTransactionType(base.transactionType);
    const candidateTxn = normalizeTransactionType(candidate.transactionType);

    if (baseTxn && candidateTxn && baseTxn === candidateTxn) {
        score += 25;
    }

    const basePrice = toNumber(base.price);
    const candidatePrice = toNumber(candidate.price);

    if (basePrice && candidatePrice) {
        const diffRatio = Math.abs(candidatePrice - basePrice) / basePrice;

        if (diffRatio <= 0.1) score += 30;
        else if (diffRatio <= 0.2) score += 22;
        else if (diffRatio <= 0.35) score += 14;
        else if (diffRatio <= 0.5) score += 6;
    }

    const baseArea = getAreaNumber(base);
    const candidateArea = getAreaNumber(candidate);

    if (baseArea && candidateArea) {
        const diffRatio = Math.abs(candidateArea - baseArea) / baseArea;

        if (diffRatio <= 0.1) score += 20;
        else if (diffRatio <= 0.2) score += 14;
        else if (diffRatio <= 0.35) score += 8;
    }

    const baseBedrooms = getBedroomsNumber(base);
    const candidateBedrooms = getBedroomsNumber(candidate);

    if (baseBedrooms && candidateBedrooms && baseBedrooms === candidateBedrooms) {
        score += 20;
    }

    const baseLocation = normalizeText(base.location);
    const candidateLocation = normalizeText(candidate.location);

    if (baseLocation && candidateLocation) {
        if (baseLocation === candidateLocation) {
            score += 25;
        } else {
            const baseTokens = getLocationTokens(base.location);
            const candidateTokens = new Set(getLocationTokens(candidate.location));
            const commonCount = baseTokens.filter((t) => candidateTokens.has(t)).length;

            score += Math.min(commonCount * 5, 20);
        }
    }

    return score;
}

/* export const dynamic = "force-dynamic"; */
export default async function PropertyDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const rawValue = String(id || "");
    const value = rawValue.trim();

    if (!value) return notFound();

    const cookieStore = await cookies();
    const userId = getUserIdFromCookie(cookieStore.get("sp_user")?.value);

    if (!userId) {
        redirect(`/?auth=1&next=${encodeURIComponent(`/properties/${value}`)}`);
    }

    const maybeId = Number(value);

    let decodedValue = value;
    try {
        decodedValue = decodeURIComponent(value);
    } catch {
        decodedValue = value;
    }

    const slugCandidates = Array.from(
        new Set([value, decodedValue].filter(Boolean))
    );

    const property = await prisma.property.findFirst({
        where: {
            OR: [
                Number.isFinite(maybeId) ? { id: maybeId } : undefined,
                ...slugCandidates.map((slug) => ({
                    slug: {
                        equals: slug,
                        mode: "insensitive" as const,
                    },
                })),
            ].filter(Boolean) as any,
        },
        include: {
            images: true,
            project: true,
        },
    });

    if (!property) {
        const crmProperty = await getWebsiteProperty(value);

        if (!crmProperty) {
            console.log("DETAILS PAGE NOT FOUND:", {
                rawValue,
                value,
                decodedValue,
                slugCandidates,
                maybeId,
            });
            return notFound();
        }

        const crmImages = getCrmImages(crmProperty);

        const allCrmProperties = await getWebsiteProperties();

        const scoredRelatedCrm = allCrmProperties
            .filter((p) => String(p.id) !== String(crmProperty.id))
            .map((p) => ({
                property: p,
                score: getRelatedScore(crmProperty, p),
            }))
            .sort((a, b) => {
                if (b.score !== a.score) return b.score - a.score;

                const aPublishedAt = a.property.publishedAt
                    ? new Date(a.property.publishedAt).getTime()
                    : 0;
                const bPublishedAt = b.property.publishedAt
                    ? new Date(b.property.publishedAt).getTime()
                    : 0;

                return bPublishedAt - aPublishedAt;
            });

        let relatedCrm = scoredRelatedCrm
            .filter((item) => item.score >= 80)
            .slice(0, 6)
            .map((item) => item.property);

        if (relatedCrm.length < 6) {
            relatedCrm = scoredRelatedCrm
                .filter((item) => item.score >= 50)
                .slice(0, 6)
                .map((item) => item.property);
        }

        if (relatedCrm.length < 6) {
            relatedCrm = scoredRelatedCrm
                .filter((item) => item.score >= 0)
                .slice(0, 6)
                .map((item) => item.property);
        }

        return (
            <div className="bg-white text-gray-800">
                <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8 py-12">
                    {/* Header */}
                    <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                        <div>
                            <p className="text-xs font-semibold tracking-[0.25em] text-[var(--color-accent)]">
                                {cleanText(crmProperty.transactionType).replaceAll("_", " ")}
                                {"  "}•{"  "}
                                {cleanText(crmProperty.type).replaceAll("_", " ")}
                            </p>

                            <h1 className="mt-2 text-2xl font-bold text-[var(--color-header)] md:text-3xl">
                                {crmProperty.title}
                            </h1>

                            {crmProperty.codeNo ? (
                                <p className="mt-1 text-sm font-bold text-[var(--color-accent)]">
                                    Code No: {crmProperty.codeNo}
                                </p>
                            ) : null}

                            <p className="mt-1 text-sm text-[var(--color-muted)]">
                                {cleanText(crmProperty.location)}
                            </p>
                        </div>

                        <div className="mt-2 md:mt-0">
                            <div className="flex items-center justify-between gap-3">
                                <AddToCartButton
                                    crmProperty={{
                                        id: String(crmProperty.id),
                                        slug: String(crmProperty.id),
                                        codeNo: crmProperty.codeNo || "",
                                        title: crmProperty.title || "",
                                        location: crmProperty.location || "",
                                        price: crmProperty.price || "",
                                        type: crmProperty.type || "",
                                        transactionType: crmProperty.transactionType || "",
                                        images: Array.isArray(crmProperty.images) ? crmProperty.images : [],
                                    }}
                                    nextPath={`/properties/${encodeURIComponent(String(crmProperty.id))}`}
                                />

                                <div className="text-right text-2xl font-extrabold text-[var(--color-header)]">
                                    ₹ {getCrmPrice(crmProperty)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Gallery */}
                    <div className="mt-8 overflow-hidden rounded-[24px] border border-[var(--color-border)] bg-white shadow-[0_14px_30px_rgba(15,23,42,0.12)]">
                        <PropertyGallery
                            images={crmImages.length ? crmImages : ["/SP Placeholder Image2.png"]}
                            title={crmProperty.title}
                        />
                    </div>

                    {/* Details */}
                    <div className="mt-10 grid gap-6 lg:grid-cols-3">
                        <div className="lg:col-span-2">
                            <div className="rounded-[24px] border border-[var(--color-border)] bg-white p-6 shadow-[0_14px_30px_rgba(15,23,42,0.12)]">
                                <h2 className="text-lg font-bold text-[var(--color-header)]">
                                    Property Details
                                </h2>

                                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <Detail label="Property Type" value={cleanText(crmProperty.type)} />
                                    <Detail label="Transaction Type" value={cleanText(crmProperty.transactionType)} />
                                    <Detail label="Status" value={cleanText(crmProperty.status)} />
                                    <Detail label="Location" value={cleanText(crmProperty.location)} />
                                    <Detail label="Area" value={getCrmArea(crmProperty)} />
                                    {crmProperty.builtUpArea ? (
                                        <Detail label="Built-up Area" value={`${crmProperty.builtUpArea} sq.ft`} />
                                    ) : null}
                                    {crmProperty.carpetArea ? (
                                        <Detail label="Carpet Area" value={`${crmProperty.carpetArea} sq.ft`} />
                                    ) : null}
                                    {crmProperty.floor ? <Detail label="Floor" value={crmProperty.floor} /> : null}
                                    {crmProperty.totalFloor ? <Detail label="Total Floor" value={crmProperty.totalFloor} /> : null}
                                    {crmProperty.bedrooms ? <Detail label="Bedrooms" value={crmProperty.bedrooms} /> : null}
                                    {crmProperty.bathrooms ? <Detail label="Bathrooms" value={crmProperty.bathrooms} /> : null}
                                    {crmProperty.balconies ? <Detail label="Balconies" value={crmProperty.balconies} /> : null}
                                    <Detail label="Lift" value={yesNo(crmProperty.lift)} />
                                    <Detail label="Parking" value={yesNo(crmProperty.parking)} />
                                    {crmProperty.halls ? <Detail label="Halls" value={crmProperty.halls} /> : null}
                                    {crmProperty.furnishingStatus ? (
                                        <Detail label="Furnishing" value={crmProperty.furnishingStatus} />
                                    ) : null}
                                    {crmProperty.propertyFacing ? (
                                        <Detail label="Facing" value={crmProperty.propertyFacing} />
                                    ) : null}
                                    {crmProperty.constructionYear ? (
                                        <Detail label="Construction Year" value={crmProperty.constructionYear} />
                                    ) : null}
                                    {/* {crmProperty.codeNo ? <Detail label="Property Code" value={crmProperty.codeNo} /> : null} */}
                                </div>

                                {crmProperty.description ? (
                                    <div className="mt-6 rounded-[18px] border border-[var(--color-border)] bg-[var(--color-card)] p-4">
                                        <p className="text-sm font-semibold text-[var(--color-header)]">
                                            About
                                        </p>
                                        <p className="mt-2 text-sm text-[var(--color-muted)]">
                                            {crmProperty.description}
                                        </p>
                                    </div>
                                ) : null}

                                {crmProperty.googleMapLink ? (
                                    <div className="mt-4">
                                        {/* <a
                                            href={crmProperty.googleMapLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm font-semibold text-[var(--color-accent)] hover:underline"
                                        >
                                            Open Location in Google Maps
                                        </a> */}
                                    </div>
                                ) : null}
                            </div>
                        </div>

                        {/* Right side CTA */}
                        <aside className="lg:col-span-1">
                            <div className="sticky top-24 rounded-[24px] border border-[var(--color-border)] bg-white p-6 shadow-[0_14px_30px_rgba(15,23,42,0.12)]">
                                <p className="text-sm font-semibold text-[var(--color-muted)]">
                                    Interested?
                                </p>

                                <div className="mt-2 text-2xl font-extrabold text-[var(--color-header)]">
                                    ₹ {getCrmPrice(crmProperty)}
                                </div>

                                <div className="mt-4">
                                    <AddToCartButton
                                        crmProperty={{
                                            id: String(crmProperty.id),
                                            slug: String(crmProperty.id),
                                            codeNo: crmProperty.codeNo || "",
                                            title: crmProperty.title || "",
                                            location: crmProperty.location || "",
                                            price: crmProperty.price || "",
                                            type: crmProperty.type || "",
                                            transactionType: crmProperty.transactionType || "",
                                            images: Array.isArray(crmProperty.images) ? crmProperty.images : [],
                                        }}
                                        nextPath={`/properties/${encodeURIComponent(String(crmProperty.id))}`}
                                    />
                                </div>

                                {/* <a
                                    href={`https://wa.me/919146636555?text=${encodeURIComponent(
                                        `Hello Sangli Properties, I am interested in: ${crmProperty.title}`
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-[var(--color-accent)] px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110 active:scale-[0.99]"
                                >
                                    Contact on WhatsApp
                                </a> */}
                                <ContactCTA
                                    propertyId={crmProperty.id}
                                    propertyTitle={crmProperty.title}
                                    propertyCodeNo={crmProperty.codeNo || ""}
                                    propertyLocation={crmProperty.location || ""}
                                    propertyPrice={crmProperty.price || ""}
                                    propertyType={crmProperty.type || ""}
                                    propertyTransactionType={crmProperty.transactionType || ""}
                                    propertyData={crmProperty as unknown as Record<string, any>}
                                />
                            </div>
                        </aside>
                    </div>

                    {/* Related CRM properties */}
                    {relatedCrm.length > 0 ? (
                        <div className="mt-12">
                            <div className="mb-4 flex items-end justify-between">
                                <div>
                                    <p className="text-xs font-semibold tracking-[0.25em] text-[var(--color-accent)]">
                                        YOU MAY ALSO LIKE
                                    </p>
                                    <h2 className="mt-2 text-xl font-bold text-[var(--color-header)]">
                                        Related Properties
                                    </h2>
                                </div>
                            </div>

                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                {relatedCrm.map((p) => (
                                    <a
                                        key={p.id}
                                        href={`/properties/${encodeURIComponent(String(p.id))}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group overflow-hidden rounded-[24px] border border-[var(--color-border)] bg-white shadow-[0_14px_30px_rgba(15,23,42,0.10)] transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.16)]"
                                    >
                                        <div className="relative h-85 w-full overflow-hidden bg-gray-100">
                                            <PropertyCardCarousel
                                                images={
                                                    getCrmImages(p).length
                                                        ? getCrmImages(p).map((url) => ({ url }))
                                                        : [{ url: "/SP Placeholder Image2.png" }]
                                                }
                                                title={p.title}
                                                autoPlay
                                                intervalMs={3500}
                                                swipeMs={600}
                                            />
                                        </div>

                                        <div className="p-4">
                                            <p className="text-xs font-semibold tracking-[0.22em] text-[var(--color-accent)]">
                                                {cleanText(p.transactionType)} • {cleanText(p.type)}
                                            </p>

                                            <h3 className="mt-2 line-clamp-1 text-base font-bold text-[var(--color-header)]">
                                                {p.title}
                                            </h3>

                                            <p className="mt-1 line-clamp-1 text-sm text-[var(--color-muted)]">
                                                {cleanText(p.location)}
                                            </p>

                                            <div className="mt-3 flex items-center justify-between">
                                                <div className="text-sm font-extrabold text-[var(--color-header)]">
                                                    ₹ {getCrmPrice(p)}
                                                </div>

                                                <span className="text-sm font-semibold text-[var(--color-accent)]">
                                                    View details →
                                                </span>
                                            </div>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        );
    }

    const related = await prisma.property.findMany({
        where: {
            id: { not: property.id },
            status: "ACTIVE",
            type: property.type,
            purpose: property.purpose,
        },
        include: { images: true },
        orderBy: [
            { featured: "desc" },
            { createdAt: "desc" },
        ],
        take: 6,
    });


    return (
        <div className="bg-white text-gray-800">
            <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="text-xs font-semibold tracking-[0.25em] text-[var(--color-accent)]">
                            {String(property.purpose).replaceAll("_", " ")}
                            {"  "}•{"  "}
                            {String(property.type).replaceAll("_", " ")}
                        </p>

                        <h1 className="mt-2 text-2xl font-bold text-[var(--color-header)] md:text-3xl">
                            {property.title}
                        </h1>

                        <p className="mt-1 text-sm text-[var(--color-muted)]">
                            {property.locality}, {property.city}
                        </p>
                    </div>

                    <div className="mt-2 md:mt-0">
                        <div className="flex items-center justify-between gap-3">
                            <AddToCartButton propertyId={property.id} nextPath={`/properties/${value}`} />

                            <div className="text-right text-2xl font-extrabold text-[var(--color-header)]">
                                ₹ {Number(property.price || 0).toLocaleString("en-IN")}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Gallery Card */}
                <div className="mt-8 overflow-hidden rounded-[24px] border border-[var(--color-border)] bg-white shadow-[0_14px_30px_rgba(15,23,42,0.12)]">
                    <PropertyGallery
                        images={property.images.map((img) => img.url)}
                        title={property.title}
                    />
                </div>

                {/* Details */}
                <div className="mt-10 grid gap-6 lg:grid-cols-3">
                    {/* Left: details grid */}
                    <div className="lg:col-span-2">
                        <div className="rounded-[24px] border border-[var(--color-border)] bg-white p-6 shadow-[0_14px_30px_rgba(15,23,42,0.12)]">
                            <h2 className="text-lg font-bold text-[var(--color-header)]">
                                Property Details
                            </h2>

                            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <Detail label="Property Type" value={property.type} />
                                <Detail label="Purpose" value={property.purpose} />
                                <Detail label="Transaction" value={property.transaction} />
                                <Detail label="Area" value={`${property.areaSqFt ?? "-"} Sq.ft`} />
                                {property.bhk ? <Detail label="BHK" value={property.bhk} /> : null}
                                <Detail label="City" value={property.city} />
                                <Detail label="Locality" value={property.locality} />
                                {property.address ? <Detail label="Address" value={property.address} /> : null}
                            </div>

                            {property.description ? (
                                <div className="mt-6 rounded-[18px] border border-[var(--color-border)] bg-[var(--color-card)] p-4">
                                    <p className="text-sm font-semibold text-[var(--color-header)]">
                                        About
                                    </p>
                                    <p className="mt-2 text-sm text-[var(--color-muted)]">
                                        {property.description}
                                    </p>
                                </div>
                            ) : null}
                        </div>
                    </div>

                    {/* Right: contact card */}
                    <aside className="lg:col-span-1">
                        <div className="sticky top-24 rounded-[24px] border border-[var(--color-border)] bg-white p-6 shadow-[0_14px_30px_rgba(15,23,42,0.12)]">
                            <p className="text-sm font-semibold text-[var(--color-muted)]">
                                Interested?
                            </p>
                            <div className="mt-2 text-2xl font-extrabold text-[var(--color-header)]">
                                ₹ {Number(property.price || 0).toLocaleString("en-IN")}
                            </div>

                            <a
                                href={`https://wa.me/919146636555?text=${encodeURIComponent(
                                    `Hello Sangli Properties, I am interested in: ${property.title}`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-[var(--color-accent)] px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110 active:scale-[0.99]">

                                Contact on WhatsApp
                            </a>

                            <ContactCTA
                                propertyId={property.id}
                                propertyTitle={property.title}
                                propertyCodeNo={property.slug || ""}
                                propertyLocation={property.address || `${property.locality}, ${property.city}`}
                                propertyPrice={property.priceLabel?.trim() ? property.priceLabel : String(property.price || "")}
                                propertyType={String(property.type || "")}
                                propertyTransactionType={String(property.transaction || property.purpose || "")}
                                propertyData={{
                                    id: property.id,
                                    slug: property.slug,
                                    title: property.title,
                                    locality: property.locality,
                                    city: property.city,
                                    address: property.address,
                                    price: property.price,
                                    priceLabel: property.priceLabel,
                                    type: property.type,
                                    transaction: property.transaction,
                                    purpose: property.purpose,
                                    areaSqFt: property.areaSqFt,
                                    bhk: property.bhk,
                                    description: property.description,
                                }}
                            />
                        </div>
                    </aside>
                </div>

                {/* ✅ Related Properties */}
                {related.length > 0 ? (
                    <div className="mt-12">
                        <div className="mb-4 flex items-end justify-between">
                            <div>
                                <p className="text-xs font-semibold tracking-[0.25em] text-[var(--color-accent)]">
                                    YOU MAY ALSO LIKE
                                </p>
                                <h2 className="mt-2 text-xl font-bold text-[var(--color-header)]">
                                    Related Properties
                                </h2>
                            </div>

                            <a
                                href="/properties"
                                className="text-sm font-semibold text-[var(--color-accent)] hover:underline"
                            >
                                View all
                            </a>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {related.map((p) => {

                                const href = `/properties/${p.slug && p.slug.trim() ? encodeURIComponent(p.slug) : p.id}`;

                                return (
                                    <a
                                        key={p.id}
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group overflow-hidden rounded-[24px] border border-[var(--color-border)] bg-white shadow-[0_14px_30px_rgba(15,23,42,0.10)] transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.16)]"
                                    >
                                        <div className="relative h-44 w-full overflow-hidden bg-gray-100">
                                            <PropertyCardCarousel
                                                images={p.images ?? []}
                                                title={p.title}
                                                autoPlay
                                                intervalMs={3500}
                                                swipeMs={600}
                                            /*  randomStart */
                                            />
                                        </div>

                                        <div className="p-4">
                                            <p className="text-xs font-semibold tracking-[0.22em] text-[var(--color-accent)]">
                                                {String(p.purpose).replaceAll("_", " ")} •{" "}
                                                {String(p.type).replaceAll("_", " ")}
                                            </p>

                                            <h3 className="mt-2 line-clamp-1 text-base font-bold text-[var(--color-header)]">
                                                {p.title}
                                            </h3>

                                            <p className="mt-1 line-clamp-1 text-sm text-[var(--color-muted)]">
                                                {p.locality}, {p.city}
                                            </p>

                                            <div className="mt-3 flex items-center justify-between">
                                                <div className="text-sm font-extrabold text-[var(--color-header)]">
                                                    ₹ {p.priceLabel?.trim() ? p.priceLabel : Number(p.price || 0).toLocaleString("en-IN")}
                                                </div>

                                                <span className="text-sm font-semibold text-[var(--color-accent)]">
                                                    View details →
                                                </span>
                                            </div>
                                        </div>
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
}

function Detail({ label, value }: { label: string; value: any }) {
    return (
        <div className="rounded-[16px] border border-[var(--color-border)] bg-white p-4 transition hover:shadow-[0_10px_20px_rgba(15,23,42,0.08)]">
            <p className="text-xs font-semibold text-[var(--color-muted)]">{label}</p>
            <p className="mt-1 font-semibold text-[var(--color-header)]">
                {String(value ?? "-").replaceAll("_", " ")}
            </p>
        </div>
    );
}