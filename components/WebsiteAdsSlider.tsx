
"use client";

import { useEffect, useRef, useState } from "react";
import type { WebsiteAd } from "@/lib/website-ads";
import Link from "next/link";

type Props = {
    ads: WebsiteAd[];
    placement: "landscape" | "portrait";
};

export default function WebsiteAdsSlider({
    ads,
    placement,
}: Props) {
    const isPortrait = placement === "portrait";

    // Desktop advertisement count
    const desktopVisibleCount = isPortrait ? 4 : 2;

    // Mobile: display only one advertisement
    const [isMobile, setIsMobile] = useState(false);
    const [isViewportReady, setIsViewportReady] = useState(false);


    useEffect(() => {
        const mediaQuery = window.matchMedia(
            "(max-width: 767px)"
        );

        const updateMobileView = () => {
            setIsMobile(mediaQuery.matches);
            setIsViewportReady(true);
        };

        updateMobileView();

        mediaQuery.addEventListener(
            "change",
            updateMobileView
        );

        return () => {
            mediaQuery.removeEventListener(
                "change",
                updateMobileView
            );
        };
    }, []);


    const visibleCount = isMobile
        ? 1
        : desktopVisibleCount;

    const maxAds = isPortrait ? 8 : 6;

    const filteredAds = ads
        .filter((ad) => ad.placement === placement)
        .sort(
            (a, b) =>
                a.displayOrder - b.displayOrder ||
                a.id - b.id
        )
        .slice(0, maxAds);

    const count = filteredAds.length;
    const canSlide = count > visibleCount;

    // Start after the cloned advertisements
    const [currentIndex, setCurrentIndex] = useState(0);

    const [paused, setPaused] = useState(false);
    const [animated, setAnimated] = useState(true);

    // Prevent overlapping animations
    const isSliding = useRef(false);
    const resetFrame = useRef<number | null>(null);

    // Clone advertisements on both sides
    // This enables continuous left-to-right movement.
    const sliderAds = canSlide
        ? [
            ...filteredAds.slice(-visibleCount),
            ...filteredAds,
            ...filteredAds.slice(0, visibleCount),
        ]
        : filteredAds;

    // Reset when placement or advertisement count changes
    useEffect(() => {
        isSliding.current = false;
        setAnimated(false);

        setCurrentIndex(
            canSlide ? visibleCount : 0
        );
    }, [
        placement,
        count,
        visibleCount,
        canSlide,
    ]);

    // Restore animation after an instant position reset
    useEffect(() => {
        if (animated || !canSlide) return;

        resetFrame.current = requestAnimationFrame(() => {
            resetFrame.current = requestAnimationFrame(() => {
                setAnimated(true);
            });
        });

        return () => {
            if (resetFrame.current !== null) {
                cancelAnimationFrame(resetFrame.current);
            }
        };
    }, [animated, canSlide, currentIndex]);

    // Automatically slide LEFT TO RIGHT
    // Move only one advertisement every 5 seconds.
    useEffect(() => {
        if (!canSlide || paused) return;

        const timer = window.setInterval(() => {
            if (isSliding.current) return;

            isSliding.current = true;
            setAnimated(true);

            setCurrentIndex((prev) => prev - 1);
        }, 3000);

        return () => window.clearInterval(timer);
    }, [canSlide, paused]);

    // Handle seamless looping after transition
    const handleTransitionEnd = (
        event: React.TransitionEvent<HTMLDivElement>
    ) => {
        if (
            event.target !== event.currentTarget ||
            event.propertyName !== "transform"
        ) {
            return;
        }

        if (!canSlide) return;

        if (currentIndex < visibleCount) {
            // Jump to the matching original position
            setAnimated(false);
            setCurrentIndex(currentIndex + count);
        } else if (
            currentIndex >= count + visibleCount
        ) {
            setAnimated(false);
            setCurrentIndex(currentIndex - count);
        }

        isSliding.current = false;
    };

    // Move LEFT TO RIGHT
    const moveRight = () => {
        if (!canSlide || isSliding.current) return;

        isSliding.current = true;
        setAnimated(true);

        setCurrentIndex((prev) => prev - 1);
    };

    // Move RIGHT TO LEFT (manual navigation)
    const moveLeft = () => {
        if (!canSlide || isSliding.current) return;

        isSliding.current = true;
        setAnimated(true);

        setCurrentIndex((prev) => prev + 1);
    };

    // Current advertisement position for navigation dots
    const activeIndex = canSlide
        ? (
            (currentIndex - visibleCount) % count +
            count
        ) % count
        : 0;

    // Navigate directly to an advertisement
    const goToSlide = (index: number) => {
        if (!canSlide || isSliding.current) return;

        if (activeIndex === index) return;

        isSliding.current = true;
        setAnimated(true);
        setCurrentIndex(index + visibleCount);
    };

    if (count === 0) return null;

    return (
        <section
            aria-label={
                isPortrait
                    ? "Portrait Advertisements"
                    : "Landscape Advertisements"
            }
            className={`my-8 w-full ${isViewportReady ? "" : "invisible"
                }`}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocusCapture={() => setPaused(true)}
            onBlurCapture={(event) => {
                if (
                    !event.currentTarget.contains(
                        event.relatedTarget as Node | null
                    )
                ) {
                    setPaused(false);
                }
            }}
        >
            <div className="relative">
                <div className="overflow-hidden rounded-xl">
                    <div
                        className={`flex ${animated
                            ? "transition-transform duration-400 ease-in-out"
                            : "transition-none"
                            }`}
                        style={{
                            transform: `translateX(-${(currentIndex * 100) /
                                visibleCount
                                }%)`,
                        }}
                        onTransitionEnd={
                            handleTransitionEnd
                        }
                    >
                        {sliderAds.map((ad, index) => (
                            <div
                                key={`${ad.id}-${index}`}
                                className="shrink-0 px-1.5"
                                style={{
                                    width: `${100 / visibleCount
                                        }%`,
                                }}
                            >

                                <Link
                                    href="/properties"
                                    aria-label={`View all properties - ${ad.title}`}
                                    className="block overflow-hidden rounded-xl bg-white cursor-pointer"
                                >
                                    <img
                                        src={ad.imageUrl}
                                        alt={ad.title}
                                        loading="lazy"
                                        className="block w-full object-cover"
                                        style={{
                                            aspectRatio: isPortrait
                                                ? "3 / 4"
                                                : "8 / 3",
                                        }}
                                    />
                                </Link>

                            </div>
                        ))}
                    </div>
                </div>

                {canSlide && (
                    <>
                        {/* Previous button */}
                        <button
                            type="button"
                            onClick={moveRight}
                            aria-label="Previous advertisement"
                            className="absolute left-0 top-1/2
                                -translate-y-1/2 rounded-r-lg
                                bg-white/90 px-3 py-3
                                text-xl shadow-md"
                        >
                            &#8249;
                        </button>

                        {/* Next button */}
                        <button
                            type="button"
                            onClick={moveLeft}
                            aria-label="Next advertisement"
                            className="absolute right-0 top-1/2
                                -translate-y-1/2 rounded-l-lg
                                bg-white/90 px-3 py-3
                                text-xl shadow-md"
                        >
                            &#8250;
                        </button>
                    </>
                )}
            </div>

            {/* Advertisement navigation dots */}
            {canSlide && (
                <div className="mt-3 flex justify-center gap-2">
                    {filteredAds.map((ad, index) => (
                        <button
                            key={ad.id}
                            type="button"
                            onClick={() =>
                                goToSlide(index)
                            }
                            aria-label={`Show advertisement ${index + 1
                                }`}
                            aria-current={
                                activeIndex === index
                                    ? "true"
                                    : undefined
                            }
                            className={`h-2 rounded-full transition-all ${activeIndex === index
                                ? "w-6 bg-amber-500"
                                : "w-2 bg-gray-300"
                                }`}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
