"use client";

import { useState } from "react";

type AddToCartButtonProps = {
    propertyId?: number;
    crmProperty?: {
        id: string;
        slug?: string;
        codeNo?: string;
        title?: string;
        location?: string;
        price?: string | number | null;
        type?: string | null;
        transactionType?: string | null;
        images?: string[] | null;
    };
    nextPath?: string;
};

export default function AddToCartButton({
    propertyId,
    crmProperty,
    nextPath,
}: AddToCartButtonProps) {
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);

    const add = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/cart/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    propertyId,
                    crmProperty,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                if (res.status === 401) {
                    const fallbackNext =
                        nextPath ||
                        (crmProperty?.id
                            ? `/properties/${encodeURIComponent(String(crmProperty.id))}`
                            : propertyId
                                ? `/properties/${propertyId}`
                                : "/cart");

                    window.location.href = `/login?next=${encodeURIComponent(fallbackNext)}`;
                    return;
                }

                alert(data?.error || "Failed to add to cart");
                return;
            }

            setDone(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            type="button"
            onClick={add}
            disabled={loading || done}
            className="rounded-md bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-70"
        >
            {done ? "Added" : loading ? "Adding..." : "Add To Cart"}
        </button>
    );
}