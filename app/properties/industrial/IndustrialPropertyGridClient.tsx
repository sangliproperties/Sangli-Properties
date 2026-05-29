"use client";

import { useState } from "react";
import Link from "next/link";
import ContactModal from "@/components/ContactModal";
import PropertyCardCarousel from "@/components/PropertyCardCarousel";
import { formatArea, formatPriceINR } from "@/lib/format";
import type { CrmWebsiteProperty } from "@/lib/crm";

export default function IndustrialPropertyGridClient({
    properties,
}: {
    properties: CrmWebsiteProperty[];
}) {
    const [selectedProperty, setSelectedProperty] = useState<Record<string, any> | null>(null);

    return (
        <>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {properties.map((p) => {
                    const images = Array.isArray(p.images) ? p.images.filter(Boolean) : [];
                    const locationText = String(p.location || "");

                    return (
                        <article
                            key={p.id}
                            className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white shadow-sm"
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
                                    {String(p.transactionType || "").toUpperCase() === "RENT" ? "FOR RENT" : "FOR SELL"} · INDUSTRIAL
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
                                            {p.area ? formatArea(Number(p.area)) : "-"}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 flex items-center justify-between">
                                    <div className="text-sm font-semibold text-[var(--color-header)]">
                                        ₹ {p.price != null ? formatPriceINR(Number(String(p.price).replace(/[^\d.]/g, ""))) : "-"}
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setSelectedProperty({
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
            </div>

            {properties.length === 0 && (
                <p className="mt-10 text-center text-sm text-gray-500">
                    No Industrial properties found.
                </p>
            )}

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