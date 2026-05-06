"use client";

import { useState } from "react";

export default function RemoveFromCartButton({ cartItemId }: { cartItemId: number }) {
    const [loading, setLoading] = useState(false);

    const remove = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/cart/remove", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cartItemId }),
            });

            if (res.status === 401) {
                window.location.href = "/?auth=1&next=/cart";
                return;
            }

            window.location.reload();
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={remove}
            disabled={loading}
            className="text-xs font-semibold text-red-600 hover:underline disabled:opacity-60"
        >
            {loading ? "Removing..." : "Remove"}
        </button>
    );
}
