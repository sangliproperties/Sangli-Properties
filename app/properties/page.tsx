import Link from "next/link";
import ResidentialFilters from "@/components/ResidentialFilters";
import { getWebsiteProperties, type CrmWebsiteProperty } from "@/lib/crm";
import ResidentialPropertyGridClient from "./residential/ResidentialPropertyGridClient";

export const revalidate = 60;

export const metadata = {
    title: "All Properties | Sangli Properties",
    description:
        "Search all residential, commercial, industrial, and land properties in Sangli and nearby areas.",
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

export default async function AllPropertiesPage({ searchParams }: PageProps) {
    const sp = (await searchParams) ?? {};

    const purpose = getString(sp.purpose);
    const q = (getString(sp.q) || "").trim();

    const minArea = getNumber(sp.minArea);
    const maxArea = getNumber(sp.maxArea);

    const minPrice = getNumber(sp.minPrice);
    const maxPrice = getNumber(sp.maxPrice);

    const normalizedPurpose = (purpose || "").toString().trim().toUpperCase();

    const crmProperties = await getWebsiteProperties();

    const allProperties = crmProperties.filter((p: CrmWebsiteProperty) => {
        const propertyTransaction = String(p.transactionType || "").trim().toUpperCase();
        const propertyStatus = String(p.status || "").trim().toUpperCase();

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
        const typeText = String(p.type || "").toLowerCase();
        const bedroomsText = String(p.bedrooms || "").toLowerCase();
        const searchText = q.toLowerCase();

        const matchesSearch =
            !q ||
            titleText.includes(searchText) ||
            locationText.includes(searchText) ||
            typeText.includes(searchText) ||
            bedroomsText.includes(searchText);

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
            matchesStatus &&
            matchesPurpose &&
            matchesSearch &&
            matchesArea &&
            matchesPrice
        );
    });

    return (
        <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
            <section className="relative overflow-hidden border-b border-[var(--color-border)] bg-[var(--color-header)] text-white">
                 <div className="relative z-10 mx-auto max-w-[1400px] px-4 pt-10 pb-10 sm:pt-12 sm:pb-12 md:pt-14 md:pb-8">
                    <div className="space-y-3">
                        <p className="text-sm tracking-[0.35em] uppercase text-white/90">
                            SANGLI PROPERTIES LLP
                        </p>

                        <h1 className="text-3xl font-semibold sm:text-4xl leading-tight">
                            All Properties
                        </h1>

                        {/* <p className="text-sm text-white/80">
                            Search across residential, commercial, industrial, and land properties
                        </p> */}

                        <nav className="text-xs text-white/80">
                            <Link href="/" className="hover:underline">
                                Home
                            </Link>
                            <span className="mx-1">/</span>
                            <span>Properties</span>
                        </nav>
                    </div>
                </div>

                <div className="absolute bottom-0 left-85 right-5">
                    <img
                        src="/skyline_white2.png"
                        alt="Skyline"
                        className="w-small h-[170px] object-cover opacity-100 pointer-events-none hidden md:block"
                    />
                </div>
            </section>

            <section className="bg-[var(--color-bg)]">
                <div className="mx-auto max-w-[1400px] px-4 py-10 sm:py-12">
                    <h2 className="text-xl font-semibold tracking-wide text-[var(--color-header)] text-center">
                        ALL PROPERTIES
                    </h2>
                    <div className="mt-3 mx-auto h-[2px] w-16 rounded-full bg-[var(--color-accent)]" />

                    <ResidentialFilters searchPlaceholder="Search by city, locality, property type, BHK…" />

                    <ResidentialPropertyGridClient properties={allProperties} />
                </div>
            </section>
        </main>
    );
}