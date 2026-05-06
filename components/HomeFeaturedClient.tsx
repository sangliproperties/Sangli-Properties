"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import PropertyCardCarousel from "@/components/PropertyCardCarousel";
import ContactModal from "@/components/ContactModal";

export default function HomeFeaturedClient({ featured }: { featured: any[] }) {
    const searchParams = useSearchParams();
    const [selectedProperty, setSelectedProperty] = useState<Record<string, any> | null>(null);
    const q = (searchParams.get("q") ?? "").trim();


    const filtered = useMemo(() => {
        if (!q) return featured;

        // Extract any number (treat as bhk)
        const numMatch = q.match(/(\d+)/);
        const bhkFromQuery = numMatch ? parseInt(numMatch[1], 10) : null;

        // Remove "2 bhk" + numbers, remaining text filters by title/city/locality/project
        const qWithoutBhk = q
            .replace(/(\d+)\s*bhk/gi, " ")
            .replace(/(\d+)/g, " ")
            .replace(/\s+/g, " ")
            .trim()
            .toLowerCase();

        return featured.filter((p) => {
            // bhk filter
            if (bhkFromQuery !== null && !Number.isNaN(bhkFromQuery)) {
                if (Number(p.bhk) !== bhkFromQuery) return false;
            }

            // text filter
            if (qWithoutBhk) {
                const haystack = [
                    p.title,
                    p.city,
                    p.locality,
                    p.slug,
                    p.project?.name,
                ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();

                if (!haystack.includes(qWithoutBhk)) return false;
            }

            return true;
        });
    }, [featured, q]);

    return (
        <>
            {q ? (
                <div className="mt-4 text-xs text-[var(--color-muted)]">
                    Showing results for{" "}
                    <span className="font-semibold text-[var(--color-header)]">
                        “{q}”
                    </span>{" "}
                    ({filtered.length})
                </div>
            ) : null}

            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((p) => (
                    <article
                        key={p.id}
                        className="flex flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] shadow-sm transition hover:shadow-md"
                    >
                        <div className="h-44 bg-[var(--color-bg)]">
                            <PropertyCardCarousel
                                images={p.images ?? []}
                                title={p.title}
                                autoPlay
                                intervalMs={4000}
                                swipeMs={600}
                                /* randomStart */
                            />
                        </div>

                        <div className="flex flex-1 flex-col p-4">
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-accent)]">
                                {p.purpose === "BUY" ? "For Sale" : "For Rent"} ·{" "}
                                {(p.type ?? "").toLowerCase()}
                            </p>

                            <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-[var(--color-header)]">
                                {p.title}
                            </h3>

                            <p className="mt-1 text-[11px] text-[var(--color-muted)]">
                                {p.locality}, {p.city}
                            </p>

                            <dl className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px]">
                                <div>
                                    <dt className="text-[var(--color-muted)]">Area</dt>
                                    <dd>{p.areaLabel?.trim() ? p.areaLabel : `${p.areaSqFt} sq.ft.`}</dd>
                                </div>
                                {p.bhk ? (
                                    <div>
                                        <dt className="text-[var(--color-muted)]">BHK</dt>
                                        <dd>{p.bhk}</dd>
                                    </div>
                                ) : null}
                                {p.project ? (
                                    <div>
                                        <dt className="text-[var(--color-muted)]">Project</dt>
                                        <dd>{p.project.name}</dd>
                                    </div>
                                ) : null}
                            </dl>

                            <div className="mt-4 flex items-center justify-between">
                                <div className="text-sm font-semibold text-[var(--color-header)]">
                                    ₹ {p.priceLabel?.trim() ? p.priceLabel : Number(p.price || 0).toLocaleString("en-IN")}
                                </div>

                                <div className="flex items-center gap-4">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setSelectedProperty({
                                                propertyId: p.id,
                                                propertyTitle: p.title || "",
                                                propertyCodeNo: "",
                                                propertyLocation: p.address || `${p.locality || ""}${p.locality && p.city ? ", " : ""}${p.city || ""}`,
                                                propertyPrice: p.priceLabel?.trim() ? p.priceLabel : String(p.price || ""),
                                                propertyType: String(p.type || ""),
                                                propertyTransactionType: String(p.transaction || p.purpose || ""),
                                                propertyData: p,
                                            })
                                        }
                                        className="inline-flex items-center rounded-md bg-[var(--color-accent)] px-2.5 py-1 text-[11px] font-semibold text-white transition hover:brightness-110"
                                    >
                                        Contact Us
                                    </button>

                                    {(() => {
                                        const detailsKey =
                                            p.slug && p.slug.trim() ? encodeURIComponent(p.slug.trim()) : String(p.id);

                                        const detailsUrl = `/properties/${detailsKey}`;

                                        return (
                                            <Link
                                                href={detailsUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[11px] font-semibold text-[var(--color-accent)] hover:brightness-125"
                                            >
                                                View details
                                            </Link>
                                        );
                                    })()}
                                </div>
                            </div>
                        </div>
                    </article>
                ))}

                {filtered.length === 0 ? (
                    <p className="text-sm text-[var(--color-muted)]">
                        No properties found.
                    </p>
                ) : null}
            </div>
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