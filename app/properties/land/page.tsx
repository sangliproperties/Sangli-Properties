import Link from "next/link";
import ResidentialFilters from "@/components/ResidentialFilters";
import PropertyCardCarousel from "@/components/PropertyCardCarousel";
import { formatArea, formatPriceINR } from "@/lib/format";
import { getWebsiteProperties, type CrmWebsiteProperty } from "@/lib/crm";
import LandPropertyGridClient from "./LandPropertyGridClient";


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

        const locationText = String(p.location || "").toLowerCase();
        const titleText = String(p.title || "").toLowerCase();
        const searchText = q.toLowerCase();

        const matchesSearch =
            !q ||
            titleText.includes(searchText) ||
            locationText.includes(searchText);

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
                <div className="relative z-10 mx-auto max-w-[1400px] px-4 pt-10 pb-10 sm:pt-12 sm:pb-12 md:pt-14 md:pb-8">
                    <div className="space-y-3">
                        <p className="text-sm tracking-[0.35em] uppercase text-white/90">
                            SANGLI PROPERTIES LLP
                        </p>

                        <h1 className="text-3xl font-semibold sm:text-4xl leading-tight">
                            Land / Plot
                        </h1>

                        <p className="text-3xl font-semibold sm:text-4xl leading-tight">
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
                </div>

                {/* SKYLINE */}
                <div className="absolute bottom-0 left-85 right-5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src="/skyline_white2.png"
                        alt="Skyline"
                        className="w-small h-[170px] object-cover opacity-100 pointer-events-none hidden md:block"
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
                    <ResidentialFilters
                        searchPlaceholder="Search by title, location… (NA Plot, Residential Plot, Open Land)"
                    />

                    {/* GRID */}
                    <LandPropertyGridClient properties={landProperties} />
                </div>
            </section>
        </main>
    );
}
