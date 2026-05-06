"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type ImageInput =
    | string
    | {
        url?: string | null;
        alt?: string | null;
    };

type NormalizedImage = {
    url: string;
    alt?: string;
};

type Props = {
    images?: ImageInput[];
    title?: string;
    autoPlay?: boolean;
    intervalMs?: number;
    swipeMs?: number;
    randomStart?: boolean;
};

function normalizeImages(images?: ImageInput[], title?: string): NormalizedImage[] {
    const normalized = (images || [])
        .map((img) => {
            if (!img) return null;

            if (typeof img === "string") {
                const url = img.trim();
                if (!url) return null;
                return { url, alt: title || "Property image" };
            }

            const url = String(img.url || "").trim();
            if (!url) return null;

            return {
                url,
                alt: String(img.alt || title || "Property image").trim(),
            };
        })
        .filter(Boolean) as NormalizedImage[];

    if (normalized.length > 0) return normalized;

    return [
        {
            url: "/SP Placeholder Image.jpg",
            alt: title || "Property image",
        },
    ];
}

export default function PropertyCardCarousel({
    images = [],
    title = "Property",
    autoPlay = true,
    intervalMs = 3500,
    swipeMs = 600,
    randomStart = false,
}: Props) {
    const imgs = useMemo(() => normalizeImages(images, title), [images, title]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPageVisible, setIsPageVisible] = useState(true);
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        if (!randomStart || imgs.length <= 1) {
            setActiveIndex(0);
            return;
        }

        const startIndex = Math.floor(Math.random() * imgs.length);
        setActiveIndex(startIndex);
    }, [imgs.length, randomStart]);

    useEffect(() => {
        const handleVisibilityChange = () => {
            setIsPageVisible(document.visibilityState === "visible");
        };

        handleVisibilityChange();
        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, []);

    useEffect(() => {
        if (!autoPlay) return;
        if (!isPageVisible) return;
        if (imgs.length <= 1) return;

        intervalRef.current = window.setInterval(() => {
            setActiveIndex((current) => (current + 1) % imgs.length);
        }, intervalMs);

        return () => {
            if (intervalRef.current !== null) {
                window.clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [autoPlay, intervalMs, imgs.length, isPageVisible]);

    const goTo = (index: number) => {
        if (imgs.length <= 1) return;
        const safeIndex = ((index % imgs.length) + imgs.length) % imgs.length;
        setActiveIndex(safeIndex);
    };

    const prev = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        goTo(activeIndex - 1);
    };

    const next = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        goTo(activeIndex + 1);
    };

    return (
        <div className="relative h-full w-full overflow-hidden rounded-[inherit] bg-gray-100">
            <div className="relative h-full w-full">
                {imgs.map((img, index) => {
                    const isActive = index === activeIndex;

                    return (
                        <div
                            key={`${img.url}-${index}`}
                            className="absolute inset-0 h-full w-full"
                            style={{
                                opacity: isActive ? 1 : 0,
                                transition: `opacity ${swipeMs}ms ease-in-out`,
                                pointerEvents: isActive ? "auto" : "none",
                            }}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={img.url}
                                alt={img.alt || title}
                                className="h-full w-full object-fill"
                                draggable={false}
                                loading="lazy"
                                onError={(e) => {
                                    e.currentTarget.src = "/SP Placeholder Image.jpg";
                                }}
                            />
                        </div>
                    );
                })}
            </div>

            {imgs.length > 1 ? (
                <>
                    <button
                        type="button"
                        onClick={prev}
                        aria-label="Previous image"
                        className="absolute left-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white transition hover:bg-black/60"
                    >
                        ‹
                    </button>

                    <button
                        type="button"
                        onClick={next}
                        aria-label="Next image"
                        className="absolute right-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white transition hover:bg-black/60"
                    >
                        ›
                    </button>

                    <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5">
                        {imgs.map((_, index) => (
                            <button
                                key={index}
                                type="button"
                                aria-label={`Go to image ${index + 1}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    goTo(index);
                                }}
                                className={`h-1.5 rounded-full transition-all ${index === activeIndex
                                    ? "w-5 bg-white"
                                    : "w-1.5 bg-white/70 hover:bg-white"
                                    }`}
                            />
                        ))}
                    </div>
                </>
            ) : null}
        </div>
    );
}