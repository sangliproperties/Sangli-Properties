"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
    const sp = useSearchParams();
    const router = useRouter();

    const nextUrl = useMemo(() => {
        const n = sp.get("next");
        return n && n.startsWith("/") ? n : "/"; // safe fallback
    }, [sp]);

    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const submit = async () => {
        setError("");
        const fn = fullName.trim();
        const ph = phone.trim();

        if (!fn) return setError("Full Name is required");
        if (!ph || ph.length < 10) return setError("Valid Phone Number is required");

        setLoading(true);
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fullName: fn, phone: ph }),
            });

            const data = await res.json();
            if (!res.ok) return setError(data?.error || "Login failed");

            router.push(nextUrl);
            router.refresh();
        } catch {
            setError("Network error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-md rounded-xl bg-white shadow-xl border border-gray-200">
                <div className="border-b px-6 py-4">
                    <h1 className="text-lg font-bold text-gray-900">Login / Register</h1>
                    <p className="text-xs text-gray-600 mt-1">Continue to view property details</p>
                </div>

                <div className="px-6 py-5">
                    <label className="mb-2 block text-sm font-semibold text-gray-800">
                        Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="mb-4 w-full rounded-md border border-gray-300 px-3 py-2"
                        placeholder="Enter full name"
                    />

                    <label className="mb-2 block text-sm font-semibold text-gray-800">
                        Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="mb-4 w-full rounded-md border border-gray-300 px-3 py-2"
                        placeholder="Enter phone number"
                    />

                    {error ? <p className="mt-2 text-sm font-semibold text-red-600">{error}</p> : null}

                    <button
                        onClick={submit}
                        disabled={loading}
                        className="mt-5 w-full rounded-md bg-blue-600 py-2 text-sm font-semibold text-white disabled:opacity-60"
                    >
                        {loading ? "PLEASE WAIT..." : "CONTINUE"}
                    </button>
                </div>
            </div>
        </div>
    );
}
