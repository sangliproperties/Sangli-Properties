"use client";

import { useState } from "react";
import Link from "next/link";
import ContactModal from "@/components/ContactModal";
import PropertyCardCarousel from "@/components/PropertyCardCarousel";
import { formatArea, formatPriceINR } from "@/lib/format";
import type { CrmWebsiteProperty } from "@/lib/crm";

function normalizeText(value: unknown) {
    return String(value || "").trim().toUpperCase();
}

function getNumericPrice(value: unknown) {
    const n = Number(String(value ?? "").replace(/[^\d.]/g, ""));
    return Number.isFinite(n) ? n : NaN;
}

function getNumericArea(p: CrmWebsiteProperty) {
    if (p.area != null && p.area !== "") return Number(p.area);
    if (p.builtUpArea != null && p.builtUpArea !== "") return Number(p.builtUpArea);
    if (p.carpetArea != null && p.carpetArea !== "") return Number(p.carpetArea);
    return NaN;
}

function isActiveStatus(status: string) {
    return (
        status === "AVAILABLE" ||
        status === "ACTIVE" ||
        status === "UNDER CONSTRUCTION"
    );
}

function getResidential(properties: CrmWebsiteProperty[]) {
    return properties
        .filter((p) => {
            const type = normalizeText(p.type);
            const status = normalizeText(p.status);

            const isResidential = type.includes("RESIDENTIAL");
            const isLandOrPlot = type.includes("LAND") || type.includes("PLOT");

            return isResidential && !isLandOrPlot && isActiveStatus(status);
        })

}

function getCommercial(properties: CrmWebsiteProperty[]) {
    return properties
        .filter((p) => {
            const type = normalizeText(p.type);
            const status = normalizeText(p.status);

            return type.includes("COMMERCIAL") && isActiveStatus(status);
        })

}

function getLandPlot(properties: CrmWebsiteProperty[]) {
    return properties
        .filter((p) => {
            const type = normalizeText(p.type);
            const status = normalizeText(p.status);

            return (
                (type.includes("LAND") || type.includes("PLOT")) &&
                isActiveStatus(status)
            );
        })

}

function getIndustrial(properties: CrmWebsiteProperty[]) {
    return properties
        .filter((p) => {
            const type = normalizeText(p.type);
            const status = normalizeText(p.status);

            return type.includes("INDUSTRIAL") && isActiveStatus(status);
        })

}

function PropertySection({
    title,
    viewAllHref,
    properties,
    sectionLabel,
    onContactClick,

}: {
    title: string;
    viewAllHref: string;
    properties: CrmWebsiteProperty[];
    sectionLabel: string;
    onContactClick: (property: Record<string, any>) => void;
}) {

    const shouldScroll = properties.length > 4;

    const visibleProperties = shouldScroll
        ? properties
        : properties.slice(0, 4);

    const displayProperties = shouldScroll
        ? [...visibleProperties, ...visibleProperties]
        : visibleProperties;

    return (
        <section className="mt-10">
            <div className="flex items-end justify-between gap-4">
                <div>
                    <h3 className="text-xl font-semibold text-[var(--color-header)]">
                        {title}
                    </h3>
                </div>

                <Link
                    href={viewAllHref}
                    className="text-sm font-semibold text-[var(--color-accent)] hover:brightness-110"
                >
                    View All Properties
                </Link>
            </div>

            <div className={shouldScroll ? "mt-6 overflow-hidden" : "mt-6"}>
                <div
                    className={
                        shouldScroll
                            ? "property-marquee-track"
                            : "grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
                    }
                >
                    {displayProperties.map((p, index) => {
                        const images = Array.isArray(p.images) ? p.images.filter(Boolean) : [];
                        const locationText = String(p.location || "");
                        const numericPrice = getNumericPrice(p.price);
                        const numericArea = getNumericArea(p);

                        return (
                            <article
                                key={`${p.id}-${index}`}
                                className={
                                    shouldScroll
                                        ? "property-marquee-card overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white shadow-sm"
                                        : "overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white shadow-sm"
                                }
                            >
                                <div className="relative h-85 w-full overflow-hidden bg-white">
                                    <PropertyCardCarousel
                                        images={
                                            images.length > 0
                                                ? images.map((url) => ({ url }))
                                                : [{ url: "/SP Placeholder Image2.png" }]
                                        }
                                        title={p.title}
                                        autoPlay
                                        intervalMs={3500}
                                        swipeMs={600}
                                    /* randomStart */
                                    />
                                </div>

                                <div className="p-4">
                                    <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-accent)]">
                                        {String(p.transactionType || "").toUpperCase() === "RENT"
                                            ? "FOR RENT"
                                            : "FOR SELL"}{" "}
                                        · {sectionLabel}
                                    </p>

                                    <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-[var(--color-header)]">
                                        {p.title}
                                    </h3>

                                    <p className="mt-1 text-[11px] text-gray-500">{locationText}</p>

                                    {p.codeNo ? (
                                        <p className="mt-1 text-[11px] font-bold text-[var(--color-header)]">
                                            Code No: {p.codeNo}
                                        </p>
                                    ) : null}

                                    <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-[11px]">
                                        <div>
                                            <div className="text-gray-400">Area</div>
                                            <div className="font-medium">
                                                {!Number.isNaN(numericArea) ? formatArea(numericArea) : "-"}
                                            </div>
                                        </div>

                                        {p.bedrooms ? (
                                            <div>
                                                <div className="text-gray-400">Bedrooms</div>
                                                <div className="font-medium">{p.bedrooms}</div>
                                            </div>
                                        ) : null}
                                    </div>

                                    <div className="mt-4 flex items-center justify-between">
                                        <div className="text-sm font-semibold text-[var(--color-header)]">
                                            ₹ {!Number.isNaN(numericPrice) ? formatPriceINR(numericPrice) : "-"}
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onContactClick({
                                                        propertyId: p.id,
                                                        propertyTitle: p.title || "",
                                                        propertyCodeNo: p.codeNo || "",
                                                        propertyLocation: p.location || "",
                                                        propertyPrice: p.price || "",
                                                        propertyType: p.type || "",
                                                        propertyTransactionType: p.transactionType || "",
                                                        propertyData: p,
                                                    })
                                                }
                                                className="inline-flex items-center rounded-md bg-[var(--color-accent)] px-2.5 py-1 text-[11px] font-semibold text-white transition hover:brightness-110"
                                            >
                                                Contact Us
                                            </button>

                                            <Link
                                                href={`/properties/${encodeURIComponent(String(p.id))}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[11px] font-semibold text-[var(--color-accent)] hover:brightness-125"
                                            >
                                                View details
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        );
                    })}

                    {visibleProperties.length === 0 ? (
                        <p className="text-sm text-[var(--color-muted)]">
                            No properties found.
                        </p>
                    ) : null}
                </div>
            </div>
        </section>
    );
}

export default function HomePropertySections({
    properties,
}: {
    properties: CrmWebsiteProperty[];
}) {
    const [selectedProperty, setSelectedProperty] = useState<Record<string, any> | null>(null);
    const residential = getResidential(properties);
    const commercial = getCommercial(properties);
    const landPlot = getLandPlot(properties);
    const industrial = getIndustrial(properties);

    return (
        <>
            <PropertySection
                title="Residential Properties"
                viewAllHref="/properties/residential"
                properties={residential}
                sectionLabel="RESIDENTIAL"
                onContactClick={setSelectedProperty}
            />

            <PropertySection
                title="Commercial Properties"
                viewAllHref="/properties/commercial"
                properties={commercial}
                sectionLabel="COMMERCIAL"
                onContactClick={setSelectedProperty}
            />

            <PropertySection
                title="Plot/Land"
                viewAllHref="/properties/land"
                properties={landPlot}
                sectionLabel="PLOT / LAND"
                onContactClick={setSelectedProperty}
            />

            <PropertySection
                title="Industrial Properties"
                viewAllHref="/properties/industrial"
                properties={industrial}
                sectionLabel="INDUSTRIAL"
                onContactClick={setSelectedProperty}
            />

            <ContactModal
                open={!!selectedProperty}
                onClose={() => setSelectedProperty(null)}
                propertyId={selectedProperty?.propertyId}
                propertyTitle={selectedProperty?.propertyTitle}
                propertyCodeNo={selectedProperty?.propertyCodeNo}
                propertyLocation={selectedProperty?.propertyLocation}
                propertyPrice={selectedProperty?.propertyPrice}
                propertyType={selectedProperty?.propertyType}
                propertyTransactionType={selectedProperty?.propertyTransactionType}
                propertyData={selectedProperty?.propertyData}
            />

        </>
    );
}