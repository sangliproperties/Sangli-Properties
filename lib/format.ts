export function formatPriceINR(price?: number | null) {
    const p = typeof price === "number" ? price : 0;
    if (!Number.isFinite(p) || p <= 0) return "0";

    // Crore
    if (p >= 10000000) return `${(p / 10000000).toFixed(2)} Cr`;
    // Lakh
    if (p >= 100000) return `${(p / 100000).toFixed(2)} Lakh`;

    return p.toLocaleString("en-IN");
}

export function formatArea(areaSqFt?: number | null) {
    const a = typeof areaSqFt === "number" ? areaSqFt : 0;
    if (!Number.isFinite(a) || a <= 0) return "0";

    // Show acres if >= 1 acre (43560 sq.ft)
    const acres = a / 43560;
    if (acres >= 1) return `${acres.toFixed(2)} acre`;

    return `${a.toLocaleString("en-IN")} sq.ft.`;
}