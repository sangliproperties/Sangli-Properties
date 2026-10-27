
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
    House,
    Building2,
    Building,
    HousePlus,
    Store,
    MapPin,
    Factory,
} from "lucide-react";

const categories = [
    {
        name: "Bungalow",
        count: 111,
        icon: House,
        image: "/property-categories/bungalow.jpg",
        href: "/properties?q=Bungalow",
    },
    {
        name: "Commercial",
        count: 250,
        icon: Building2,
        image: "/property-categories/commercial.jpg",
        href: "/properties/commercial",
    },
    {
        name: "Flat",
        count: 300,
        icon: Building,
        image: "/property-categories/flat.jpg",
        href: "/properties?q=Flat",
    },
    {
        name: "Residential",
        count: 550,
        icon: HousePlus,
        image: "/property-categories/residential.jpg",
        href: "/properties/residential",
    },
    {
        name: "Shop",
        count: 200,
        icon: Store,
        image: "/property-categories/shop.jpg",
        href: "/properties?q=Shop",
    },
    {
        name: "Land / Plot",
        count: 150,
        icon: MapPin,
        image: "/property-categories/land.jpg",
        href: "/properties/land",
    },
    {
        name: "Industrial",
        count: 50,
        icon: Factory,
        image: "/property-categories/industrial.jpg",
        href: "/properties/industrial",
    },
];

function AnimatedCounter({
    target,
    start,
}: {
    target: number;
    start: boolean;
}) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!start) return;

        const duration = 1400;
        let frame = 0;
        let startTime: number | null = null;

        const animate = (time: number) => {
            if (startTime === null) startTime = time;

            const progress = Math.min(
                (time - startTime) / duration,
                1
            );

            const eased = 1 - Math.pow(1 - progress, 3);

            setCount(Math.floor(target * eased));

            if (progress < 1) {
                frame = requestAnimationFrame(animate);
            } else {
                setCount(target);
            }
        };

        frame = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(frame);
    }, [start, target]);

    return <span>{count}+</span>;
}

export default function PropertyCategoryCounterSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const [startCounting, setStartCounting] =
        useState(false);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setStartCounting(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.2 }
        );

        observer.observe(section);

        return () => observer.disconnect();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="property-category-section"
        >
            <div className="property-category-container">
                <div className="property-category-heading">
                    <h2>Try Searching For</h2>
                    <p>
                        Explore our property categories across Sangli.
                        Find your dream property for sale or rent.
                    </p>
                </div>

                <div className="property-category-grid">
                    {categories.map((category) => {
                        const Icon = category.icon;

                        return (
                            <Link
                                key={category.name}
                                href={category.href}
                                className="property-category-card"
                                aria-label={`Browse ${category.name} properties`}
                            >
                                <Image
                                    src={category.image}
                                    alt={`${category.name} properties`}
                                    fill
                                    sizes="(max-width: 640px) 75vw, (max-width: 1024px) 33vw, 20vw"
                                    className="property-category-image"
                                />

                                <div className="property-category-overlay" />

                                <div className="property-category-content">
                                    <Icon
                                        size={42}
                                        strokeWidth={2}
                                        className="property-category-icon"
                                        aria-hidden="true"
                                    />

                                    <div className="property-category-count">
                                        <AnimatedCounter
                                            target={category.count}
                                            start={startCounting}
                                        />
                                    </div>

                                    <h3>{category.name}</h3>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
