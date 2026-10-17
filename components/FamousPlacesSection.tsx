"use client";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import Image from "next/image";


type FamousPlace = {
    name: string;
    landmark: string;
    image: string;
    href: string;
};

const famousPlaces: FamousPlace[] = [
    {
        name: "Ganapati Mandir",
        landmark: " Situated on the eastern banks of the Krishna River in Ganapati Peth, about 4 km from Sangli Railway Station.",
        image: "/famous-places/Ganpati mandir.png",
        href: "/properties",
    },
    {
        name: "Ganeshdurg (Darbar Hall)",
        landmark: "A historic land fort (bhuikot) located in Khanbhag, Sangli, Maharashtra, built around 1843 by Chintamanrao Patwardhan.",
        image: "/famous-places/Ganeshdurg (Sangli Fort).png",
        href: "/properties",
    },
    {
        name: "Amrai Garden",
        landmark: "A prominent historic public park and green landmark located in the western part of Sangli, Maharashtra",
        image: "/famous-places/Amrai Garden.png",
        href: "/properties",
    },
    {
        name: "Sangmeshwar Temple",
        landmark: "A historic Hindu landmark dedicated to Lord Shiva, located approximately 4 to 5 km from Sangli city.",
        image: "/famous-places/sangmeshwar temple haripur.png",
        href: "/properties",
    },
    {
        name: "Irwin Bridge",
        landmark: "A historic landmark in Sangli, Maharashtra, built in 1929 during the British colonial era",
        image: "/famous-places/irwin bridge sangli.png",
        href: "/properties",
    },
    {
        name: "Dandoba Hills",
        landmark: "A prominent natural and historical landmark located near Bhose and Kharshing villages in the Miraj taluka of Sangli district, Maharashtra",
        image: "/famous-places/Dandoba Hills Forest Reserve.png",
        href: "/properties",
    },
    {
        name: "Mahaveer Udyan",
        landmark: "A prominent local public park and community landmark located in the Nishant Colony area of Sangli, Maharashtra",
        image: "/famous-places/Bapat Mala.png",
        href: "/properties",
    },
    {
        name: "Ganapati Mandir, Vishrambag",
        landmark: "A highly revered local spiritual landmark located in the heart of Vishrambag, Sangli.",
        image: "/famous-places/vishrambag ganpati.png",
        href: "/properties",
    },
    {
        name: "Sangli Bus Stand",
        landmark: "A highly revered local spiritual landmark located in the heart of Vishrambag, Sangli.",
        image: "/famous-places/Sangli Bus Stand.png",
        href: "/properties",
    },
    {
        name: "SFC Mega Mall",
        landmark: "Serves as a primary local landmark for entertainment, shopping, and dining in the region.",
        image: "/famous-places/SFC Mega Mall.png",
        href: "/properties",
    },
];


export default function FamousPlacesSection() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [transitionEnabled, setTransitionEnabled] =
        useState(true);
    const [autoplayAllowed, setAutoplayAllowed] =
        useState(false);
    const [isPaused, setIsPaused] = useState(false);

    const viewportRef = useRef<HTMLDivElement>(null);
    const resetFrameRef = useRef<number | null>(null);

    const shouldAnimate = famousPlaces.length > 5;

    const animatedPlaces = shouldAnimate
        ? [...famousPlaces, ...famousPlaces.slice(0, 5)]
        : famousPlaces;

    useEffect(() => {
        const desktop = window.matchMedia(
            "(min-width: 768px)"
        );

        const largeDesktop = window.matchMedia(
            "(min-width: 1200px)"
        );

        const reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );

        const updateAutoplay = () => {

            setAutoplayAllowed(!reducedMotion.matches);
            setActiveIndex(0);
            setTransitionEnabled(false);

            if (resetFrameRef.current !== null) {
                cancelAnimationFrame(resetFrameRef.current);
            }

            resetFrameRef.current = requestAnimationFrame(() => {
                resetFrameRef.current = requestAnimationFrame(() => {
                    setTransitionEnabled(true);
                });
            });
        };

        updateAutoplay();

        desktop.addEventListener("change", updateAutoplay);

        largeDesktop.addEventListener(
            "change",
            updateAutoplay
        );

        reducedMotion.addEventListener(
            "change",
            updateAutoplay
        );

        return () => {
            desktop.removeEventListener(
                "change",
                updateAutoplay
            );
            reducedMotion.removeEventListener(
                "change",
                updateAutoplay
            );

            if (resetFrameRef.current !== null) {
                cancelAnimationFrame(resetFrameRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (!shouldAnimate || !autoplayAllowed || isPaused) {
            return;
        }

        const timer = window.setInterval(() => {
            setActiveIndex((current) => current + 1);
        }, 2500);


        return () => window.clearInterval(timer);
    }, [shouldAnimate, autoplayAllowed, isPaused]);

    const handleTransitionEnd = () => {
        if (!shouldAnimate) return;

        if (activeIndex >= famousPlaces.length) {
            setTransitionEnabled(false);
            setActiveIndex(0);

            resetFrameRef.current = requestAnimationFrame(() => {
                resetFrameRef.current = requestAnimationFrame(() => {
                    setTransitionEnabled(true);
                });
            });
        }
    };

    return (

        <section className="famous-places-section">
            <div className="famous-places-container">

                {/* Heading and map artwork */}
                <div className="famous-places-header">

                    <div className="famous-places-heading">
                        <p className="famous-places-eyebrow">
                            SANGLI PROPERTIES LLP
                        </p>

                        <h2 className="famous-places-title">
                            <span>Famous Places.</span>
                            <span className="famous-places-title-accent">
                                Great Properties.
                            </span>
                        </h2>

                        <p className="famous-places-description">
                            Explore top locations in Sangli District
                            and find your dream property.
                        </p>
                    </div>

                    <div
                        className="famous-places-map"
                        aria-hidden="true"
                    >
                        <span className="famous-places-map-label">
                            Explore
                            <br />
                            Sangli
                        </span>

                        <span className="famous-places-pin">
                            <span className="famous-places-pin-dot" />
                        </span>
                    </div>

                </div>

                {/* Location cards */}


                {/* Animated Famous Places Cards */}

                <div
                    ref={viewportRef}
                    className="famous-places-viewport"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    onFocusCapture={() => setIsPaused(true)}
                    onBlurCapture={(event) => {
                        if (
                            !event.currentTarget.contains(
                                event.relatedTarget as Node | null
                            )
                        ) {
                            setIsPaused(false);
                        }
                    }}
                >
                    <div
                        className={`famous-places-track ${shouldAnimate && transitionEnabled
                            ? "famous-places-track-animated"
                            : ""
                            }`}
                        style={
                            {
                                "--famous-index": activeIndex,
                            } as CSSProperties
                        }
                        onTransitionEnd={(event) => {
                            if (
                                event.target === event.currentTarget &&
                                event.propertyName === "transform"
                            ) {
                                handleTransitionEnd();
                            }
                        }}
                    >
                        {animatedPlaces.map((place, index) => (
                            <Link
                                key={`${place.name}-${index}`}
                                href={place.href}
                                className="famous-place-card"
                            >
                                <div className="famous-place-image">
                                    <Image
                                        src={place.image}
                                        alt={`${place.name} - ${place.landmark}`}
                                        fill
                                        sizes="(max-width: 767px) 260px, (max-width: 1199px) 33vw, 20vw"
                                        className="famous-place-photo"
                                    />
                                </div>

                                <div className="famous-place-info">
                                    <div className="famous-place-text">
                                        <h3>{place.name}</h3>
                                        <p>{place.landmark}</p>
                                    </div>

                                    <span
                                        className="famous-place-arrow"
                                        aria-hidden="true"
                                    >
                                        &#8594;
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
