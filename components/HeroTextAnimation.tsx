"use client";

import { useEffect } from "react";

export default function HeroTextAnimation() {
    useEffect(() => {
        const elements = document.querySelectorAll(".hero-text-reveal");

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const el = entry.target as HTMLElement;

                    if (entry.isIntersecting) {
                        el.classList.remove("hero-text-visible");

                        void el.offsetWidth;

                        el.classList.add("hero-text-visible");
                    } else {
                        el.classList.remove("hero-text-visible");
                    }
                });
            },
            {
                threshold: 0.35,
            }
        );

        elements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return null;
}