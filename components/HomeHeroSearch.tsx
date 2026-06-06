"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { hasInvalidSearchChars } from "@/lib/search";

type Mode = "BUY" | "RENT";

/* function detectCategory(query: string) {
    const q = query.trim().toLowerCase();

    if (!q) return "residential";

    const landWords = ["plot", "land", "na plot", "open land"];
    const industrialWords = ["industrial", "godown", "warehouse", "factory", "shed"];
    const commercialWords = ["commercial", "shop", "office", "showroom"];
    const residentialWords = [
        "residential",
        "flat",
        "apartment",
        "bungalow",
        "row house",
        "house",
        "villa",
        "1 bhk",
        "2 bhk",
        "3 bhk",
        "4 bhk",
        "bhk",
    ];

    if (landWords.some((word) => q.includes(word))) return "land";
    if (industrialWords.some((word) => q.includes(word))) return "industrial";
    if (commercialWords.some((word) => q.includes(word))) return "commercial";
    if (residentialWords.some((word) => q.includes(word))) return "residential";

    return "residential";
} */

export default function HomeHeroSearch() {
    const router = useRouter();
    const [mode, setMode] = useState<Mode>("BUY");
    const [query, setQuery] = useState("");
    const [error, setError] = useState("");

    const placeholder = useMemo(() => {
        return mode === "BUY"
            ? "2 BHK, Bungalow, Shop, Plot, BUNG 0146, CPS.NO:5001..."
            : "2 BHK, Bungalow, Shop, Plot, BUNG 0146, CPS.NO:5001...";
    }, [mode]);

    const handleSubmit = () => {
        const trimmed = query.trim();

        if (hasInvalidSearchChars(trimmed)) {
            setError("Special characters like @ # * & are not allowed.");
            return;
        }

        setError("");

        const params = new URLSearchParams();
        params.set("purpose", mode);

        if (trimmed) {
            params.set("q", trimmed);
        }

        router.push(`/properties?${params.toString()}`);
    };


    return (
        <div className="mt-6 w-full max-w-3xl rounded-2xl bg-white/95 p-4 shadow-md">
            <div className="grid grid-cols-2 gap-3 rounded-[20px] bg-[#f3f5f9] p-2">
                <button
                    type="button"
                    onClick={() => setMode("BUY")}
                    className={`h-12 rounded-lg text-base font-semibold transition ${mode === "BUY"
                        ? "bg-white text-[var(--color-header)] shadow-sm"
                        : "text-[#6b7a90]"
                        }`}
                >
                    Buy
                </button>

                <button
                    type="button"
                    onClick={() => setMode("RENT")}
                    className={`h-12 rounded-lg text-base font-semibold transition ${mode === "RENT"
                        ? "bg-white text-[var(--color-header)] shadow-sm"
                        : "text-[#6b7a90]"
                        }`}
                >
                    Rent
                </button>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        if (error) setError("");
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleSubmit();
                    }}
                    placeholder={placeholder}
                    className="h-12 w-full rounded-lg border border-[var(--color-border)] px-5 text-[17px] text-[var(--color-header)] outline-none transition placeholder:text-[#7f8ca3] focus:border-[var(--color-accent)]"
                />

                <button
                    type="button"
                    onClick={handleSubmit}
                    className="h-12 min-w-[110px] rounded-lg bg-[var(--color-accent)] px-5 text-sm   font-semibold text-white transition hover:brightness-105 active:scale-[0.99]"
                >
                    Search
                </button>
            </div>
            {error && (
                <p className="mt-2 text-sm font-medium text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
}