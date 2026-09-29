import Link from "next/link";
import ResidentialFilters from "@/components/ResidentialFilters";
import PropertyCardCarousel from "@/components/PropertyCardCarousel";
import { formatArea, formatPriceINR } from "@/lib/format";
import { getWebsiteProperties, type CrmWebsiteProperty } from "@/lib/crm";
import LandPropertyGridClient from "./LandPropertyGridClient";
import PageHeroAds from "@/components/PageHeroAds";
import { normalizePropertyCode, normalizeSearchText } from "@/lib/search";

/* export const dynamic = "force-dynamic"; */
export const revalidate = 60;
export const metadata = {
    title: "Land & Plot Properties | Sangli Properties",
    description:
        "Explore land & plot properties in Sangli & Miraj – residential plots, NA plots and open land.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

type PageProps = {
    searchParams?: SearchParams;
};

function getString(v: string | string[] | undefined) {
    return Array.isArray(v) ? v[0] : v;
}

function getNumber(v: string | string[] | undefined) {
    const s = getString(v);
    if (!s) return undefined;
    const n = Number(s);
    return Number.isFinite(n) ? n : undefined;
}

export default async function LandPropertiesPage({ searchParams }: PageProps) {
    const sp = (await searchParams) ?? {};

    const purpose = getString(sp.purpose);
    const q = (getString(sp.q) || "").trim();

    const minArea = getNumber(sp.minArea);
    const maxArea = getNumber(sp.maxArea);

    const minPrice = getNumber(sp.minPrice);
    const maxPrice = getNumber(sp.maxPrice);

    const normalizedPurpose = (purpose || "").toString().trim().toUpperCase();

    const crmProperties = await getWebsiteProperties({ type: "land" });

    const landProperties = crmProperties.filter((p: CrmWebsiteProperty) => {
        const propertyType = String(p.type || "").trim().toUpperCase();
        const propertyTransaction = String(p.transactionType || "").trim().toUpperCase();
        const propertyStatus = String(p.status || "").trim().toUpperCase();

        const matchesType =
            propertyType.includes("LAND") || propertyType.includes("PLOT") &&
            !propertyType.includes("RESIDENTIAL") &&
            !propertyType.includes("INDUSTRIAL") &&
            !propertyType.includes("COMMERCIAL");

        const matchesStatus =
            propertyStatus === "AVAILABLE" ||
            propertyStatus === "ACTIVE" ||
            propertyStatus === "UNDER CONSTRUCTION";

        const matchesPurpose =
            normalizedPurpose === "BUY"
                ? propertyTransaction === "BUY" || propertyTransaction === "SELL"
                : normalizedPurpose === "RENT"
                    ? propertyTransaction === "RENT"
                    : true;

        const searchText = normalizeSearchText(q);
        const searchCode = normalizePropertyCode(q);

        const codeText = normalizeSearchText(p.codeNo);
        const codeCompact = normalizePropertyCode(p.codeNo);
        const titleText = normalizeSearchText(p.title);
        const locationText = normalizeSearchText(p.location);
        const typeText = normalizeSearchText(p.type);
        const bedroomsText = normalizeSearchText(p.bedrooms);

        const matchesSearch =
            !q ||
            titleText.includes(searchText) ||
            locationText.includes(searchText) ||
            typeText.includes(searchText) ||
            bedroomsText.includes(searchText) ||
            codeText.includes(searchText) ||
            codeCompact.includes(searchCode);

        const areaValue =
            p.area != null && p.area !== ""
                ? Number(p.area)
                : p.builtUpArea != null && p.builtUpArea !== ""
                    ? Number(p.builtUpArea)
                    : p.carpetArea != null && p.carpetArea !== ""
                        ? Number(p.carpetArea)
                        : NaN;

        const priceValue =
            p.price != null && p.price !== ""
                ? Number(String(p.price).replace(/[^\d.]/g, ""))
                : NaN;

        const matchesArea =
            (minArea == null || (!Number.isNaN(areaValue) && areaValue >= minArea)) &&
            (maxArea == null || (!Number.isNaN(areaValue) && areaValue <= maxArea));

        const matchesPrice =
            (minPrice == null || (!Number.isNaN(priceValue) && priceValue >= minPrice)) &&
            (maxPrice == null || (!Number.isNaN(priceValue) && priceValue <= maxPrice));

        return (
            matchesType &&
            matchesStatus &&
            matchesPurpose &&
            matchesSearch &&
            matchesArea &&
            matchesPrice
        );
    });

    landProperties.sort((a, b) => {
        const aPublishedAt = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
        const bPublishedAt = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;

        if (bPublishedAt !== aPublishedAt) {
            return bPublishedAt - aPublishedAt;
        }

        return String(b.id).localeCompare(String(a.id), undefined, { numeric: true });
    });

    return (
        <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
            {/* HERO / BANNER */}
            <section className="relative overflow-hidden border-b border-[var(--color-border)] bg-[var(--color-header)] text-white">
                <div className="relative z-10 mx-auto flex max-w-[1400px] flex-col gap-6 px-4 pt-6 pb-6 sm:pt-8 sm:pb-8 md:flex-row md:items-center md:justify-between md:pt-10 md:pb-10 lg:gap-8">
                    <div className="min-w-0 shrink-0 space-y-3">
                        <p className="text-sm tracking-[0.35em] uppercase text-white/90">
                            SANGLI PROPERTIES LLP
                        </p>

                        <h1 className="text-3xl font-semibold sm:text-3xl leading-tight">
                            Land / Plot
                        </h1>

                        <p className="text-3xl font-semibold sm:text-3xl leading-tight">
                            Properties
                        </p>

                        <nav className="text-xs text-white/80">
                            <Link href="/" className="hover:underline">
                                Home
                            </Link>
                            <span className="mx-1">/</span>
                            <span>Properties</span>
                            <span className="mx-1">/</span>
                            <span>Land</span>
                        </nav>
                    </div>
                    <PageHeroAds
                        images={[
                            { src: "/Land1.png", alt: "Land Advertisement 1" },
                            { src: "/Land2.png", alt: "Land Advertisement 2" },
                        ]}
                    />
                </div>
            </section>

            {/* CONTENT */}
            <section className="bg-[var(--color-bg)]">
                <div className="mx-auto max-w-[1400px] px-4 py-10 sm:py-12">
                    <h2 className="text-xl font-semibold tracking-wide text-[var(--color-header)] text-center">
                        LAND / PLOT PROPERTIES
                    </h2>
                    <div className="mt-3 mx-auto h-[2px] w-16 rounded-full bg-[var(--color-accent)]" />

                    {/* Filters */}
                    <ResidentialFilters searchPlaceholder="Search by title, location, property code…" />

                    {/* GRID */}
                    <LandPropertyGridClient properties={landProperties} />
                </div>
            </section>
        </main>
    );
}
