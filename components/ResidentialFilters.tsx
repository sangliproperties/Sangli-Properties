"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function ResidentialFilters({
  searchPlaceholder = "Search by title, location… (Flat, Bungalow, Vishrambag)",
}: {
  searchPlaceholder?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  // URL → state (initial)
  const initialPurpose = (sp.get("purpose") as "BUY" | "RENT" | "") || "";
  const initialQ = sp.get("q") ?? "";

  const initialMinArea = sp.get("minArea") ?? "";
  const initialMaxArea = sp.get("maxArea") ?? "";

  const initialMinPrice = sp.get("minPrice") ?? "";
  const initialMaxPrice = sp.get("maxPrice") ?? "";

  const [purpose, setPurpose] = useState<"BUY" | "RENT" | "">(initialPurpose);
  const [query, setQuery] = useState(initialQ);

  // ✅ Area inputs (text boxes)
  const [minArea, setMinArea] = useState(initialMinArea);
  const [maxArea, setMaxArea] = useState(initialMaxArea);

  // ✅ Budget inputs
  const [budgetMin, setBudgetMin] = useState(initialMinPrice);
  const [budgetMax, setBudgetMax] = useState(initialMaxPrice);

  // If user navigates back/forward, keep UI in sync
  useEffect(() => {
    const p = (sp.get("purpose") as "BUY" | "RENT" | "") || "";
    setPurpose(p);

    setQuery(sp.get("q") ?? "");

    setMinArea(sp.get("minArea") ?? "");
    setMaxArea(sp.get("maxArea") ?? "");

    setBudgetMin(sp.get("minPrice") ?? "");
    setBudgetMax(sp.get("maxPrice") ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sp]);

  function applyFilters() {
    const params = new URLSearchParams(sp.toString());

    // purpose
    if (purpose) params.set("purpose", purpose);
    else params.delete("purpose");

    // query
    const q = query.trim();
    if (q) params.set("q", q);
    else params.delete("q");

    // ✅ area (text boxes)
    const mi = minArea.trim();
    const ma = maxArea.trim();

    if (mi && !Number.isFinite(Number(mi))) return;
    if (ma && !Number.isFinite(Number(ma))) return;

    if (mi) params.set("minArea", String(Number(mi)));
    else params.delete("minArea");

    if (ma) params.set("maxArea", String(Number(ma)));
    else params.delete("maxArea");

    // budget
    const minP = budgetMin.trim();
    const maxP = budgetMax.trim();

    if (minP && !Number.isFinite(Number(minP))) return;
    if (maxP && !Number.isFinite(Number(maxP))) return;

    if (minP) params.set("minPrice", String(Number(minP)));
    else params.delete("minPrice");

    if (maxP) params.set("maxPrice", String(Number(maxP)));
    else params.delete("maxPrice");

    router.push(`${pathname}?${params.toString()}`);
  }

  function resetFilters() {
    setPurpose("");
    setQuery("");
    setMinArea("");
    setMaxArea("");
    setBudgetMin("");
    setBudgetMax("");

    router.push(pathname);
  }

  return (
    <div className="mt-8 rounded-xl border border-[var(--color-border)] bg-white p-4 shadow-sm">
      <div className="grid gap-4 md:grid-cols-12 md:items-end">
        {/* Rent/Sell dropdown */}
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-[var(--color-header)]">
            Type
          </label>
          <select
            value={purpose}
            onChange={(e) => setPurpose(e.target.value as "BUY" | "RENT" | "")}
            className="h-11 w-full rounded-lg border border-[var(--color-border)] bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          >
            <option value="">All</option>
            <option value="RENT">Rent</option>
            <option value="BUY">Sell</option>
          </select>
        </div>

        {/* Search */}
        <div className="md:col-span-5">
          <label className="mb-1 block text-sm font-medium text-[var(--color-header)]">
            Search
          </label>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="h-11 w-full rounded-lg border border-[var(--color-border)] bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          />
        </div>

        {/* ✅ Area inputs (replaces slider) */}
        <div className="md:col-span-5">
          <label className="mb-1 block text-sm font-medium text-[var(--color-header)]">
            Area (Sq ft)
          </label>
          <div className="grid grid-cols-2 gap-3">
            <input
              value={minArea}
              onChange={(e) => setMinArea(e.target.value)}
              placeholder="Min Area"
              className="h-11 w-full rounded-lg border border-[var(--color-border)] bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            />
            <input
              value={maxArea}
              onChange={(e) => setMaxArea(e.target.value)}
              placeholder="Max Area"
              className="h-11 w-full rounded-lg border border-[var(--color-border)] bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            />
          </div>
        </div>
      </div>

      {/* Budget row (under area, right side) */}
      <div className="mt-4 grid gap-4 md:grid-cols-12">
        <div className="md:col-span-5 md:col-start-8">
          <label className="mb-1 block text-sm font-medium text-[var(--color-header)]">
            Budget
          </label>
          <div className="grid grid-cols-2 gap-3">
            <input
              value={budgetMin}
              onChange={(e) => setBudgetMin(e.target.value)}
              placeholder="Min budget"
              className="h-11 w-full rounded-lg border border-[var(--color-border)] bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            />
            <input
              value={budgetMax}
              onChange={(e) => setBudgetMax(e.target.value)}
              placeholder="Max budget"
              className="h-11 w-full rounded-lg border border-[var(--color-border)] bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-4 flex flex-wrap justify-end gap-3">
        <button
          type="button"
          onClick={resetFilters}
          className="h-10 rounded-lg border border-[var(--color-border)] bg-white px-4 text-sm font-medium hover:bg-gray-50"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={applyFilters}
          className="h-10 rounded-lg bg-[var(--color-accent)] px-4 text-sm font-semibold text-white hover:brightness-110"
        >
          Apply
        </button>
      </div>
    </div>
  );
}
