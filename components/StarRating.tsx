"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type StarRatingProps = {
    value?: number; // average rating, e.g. 4.2
    count?: number; // ratingCount
    readonly?: boolean;
    propertyId?: number; // when provided and readonly=false => user can rate
    className?: string;
    size?: number; // px
    showCount?: boolean; // default true
};

function StarIcon({
    filled,
    size,
    className,
}: {
    filled: boolean;
    size: number;
    className?: string;
}) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            aria-hidden="true"
            className={className}
        >
            <path
                d="M12 17.27l-5.18 3.05 1.4-5.93-4.6-3.99 6.06-.52L12 4.5l2.32 5.38 6.06.52-4.6 3.99 1.4 5.93z"
                fill={filled ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export default function StarRating({
    value = 0,
    count = 0,
    readonly = true,
    propertyId,
    className,
    size = 16,
    showCount = true,
}: StarRatingProps) {
    const router = useRouter();
    const [hover, setHover] = useState<number | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const avg = useMemo(() => {
        const v = typeof value === "number" && !Number.isNaN(value) ? value : 0;
        return Math.max(0, Math.min(5, v));
    }, [value]);

    const displayValue = hover ?? avg;
    const interactive = !readonly && typeof propertyId === "number" && propertyId > 0;

    async function submitRating(r: number) {
        if (!interactive || submitting) return;

        try {
            setSubmitting(true);
            const res = await fetch("/api/properties/rate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ propertyId, rating: r }),
            });

            if (!res.ok) {
                // Optional: handle unauthorized or errors silently
                console.error("Rating failed:", await res.text());
                return;
            }

            // refresh server components/pages to reflect new average
            router.refresh();
        } finally {
            setSubmitting(false);
            setHover(null);
        }
    }

    return (
        <div className={className}>
            <div className="flex items-center gap-2">
                <div
                    className={`flex items-center ${interactive ? "cursor-pointer" : "cursor-default"
                        } ${submitting ? "opacity-60" : ""}`}
                    onMouseLeave={() => interactive && setHover(null)}
                    aria-label={
                        interactive
                            ? "Rate this property"
                            : `Rating ${avg.toFixed(1)} out of 5`
                    }
                >
                    {Array.from({ length: 5 }).map((_, i) => {
                        const star = i + 1;
                        const filled = displayValue >= star - 0.01; // simple fill (no half-star UI)
                        return (
                            <button
                                key={star}
                                type="button"
                                disabled={!interactive || submitting}
                                className="p-0.5 text-amber-500 disabled:cursor-not-allowed"
                                onMouseEnter={() => interactive && setHover(star)}
                                onFocus={() => interactive && setHover(star)}
                                onClick={(e) => {
                                    e.preventDefault();     // prevents link navigation
                                    e.stopPropagation();    // prevents parent click handler
                                    submitRating(star);
                                }}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}
                                aria-label={`Rate ${star} star${star === 1 ? "" : "s"}`}
                            >
                                <StarIcon filled={filled} size={size} />
                            </button>
                        );
                    })}
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-800">
                        {avg.toFixed(1)}
                    </span>
                    {showCount ? (
                        <span className="text-xs text-gray-500">
                            ({count ?? 0})
                        </span>
                    ) : null}
                </div>
            </div>

            {interactive ? (
                <p className="mt-1 text-[11px] text-gray-500">
                    Click to rate{submitting ? "..." : ""}
                </p>
            ) : null}
        </div>
    );
}
