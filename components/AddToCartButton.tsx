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
    const [toast, setToast] = useState<{
        type: "success" | "error";
        message: string;
    } | null>(null);

    function showToast(type: "success" | "error", message: string) {
        setToast({ type, message });

        setTimeout(() => {
            setToast(null);
        }, 3000);
    }

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

                showToast("error", data?.error || "Failed to add to cart");
                return;
            }

            setDone(true);
            showToast("success", "Property saved successfully");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                type="button"
                onClick={add}
                disabled={loading || done}
                className="rounded-md bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-70"
            >
                {done ? "Added" : loading ? "Adding..." : "Add To Cart"}
            </button>

            {toast ? (
                <div className="fixed left-1/2 top-24 z-[99999] w-[92%] max-w-[360px] -translate-x-1/2 rounded-2xl border border-gray-200 bg-white p-4 shadow-2xl">
                    <div className="flex items-start gap-3">
                        <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white ${toast.type === "success" ? "bg-green-500" : "bg-orange-500"
                                }`}
                        >
                            {toast.type === "success" ? "✓" : "!"}
                        </div>

                        <div>
                            <p className="text-sm font-bold text-gray-900">
                                {toast.type === "success" ? "Success" : "Notice"}
                            </p>
                            <p className="mt-1 text-sm text-gray-600">
                                {toast.message}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setToast(null)}
                            className="ml-auto text-lg leading-none text-gray-400 hover:text-gray-700"
                        >
                            ×
                        </button>
                    </div>
                </div>
            ) : null}
        </>
    );
}