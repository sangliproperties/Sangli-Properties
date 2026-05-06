"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
    open: boolean;
    onClose: () => void;
    nextUrl?: string | null;
};

export default function AuthModal({ open, onClose, nextUrl }: Props) {
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        if (!open) return;
        const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onEsc);
        return () => window.removeEventListener("keydown", onEsc);
    }, [open, onClose]);

    if (!mounted || !open) return null;

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
            if (!res.ok) {
                setError(data?.error || "Failed");
                setLoading(false);
                return;
            }

            onClose();

            if (nextUrl && nextUrl.startsWith("/")) {
                window.location.assign(nextUrl);
            } else {
                window.location.reload();
            }
            
        } catch {
            setError("Network error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
            <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
                <div className="flex items-center justify-between border-b px-6 py-4">
                    <h2 className="text-lg font-bold text-gray-900">Login / Register</h2>
                    <button onClick={onClose} className="text-xl leading-none text-gray-600 hover:text-black">
                        ×
                    </button>
                </div>

                <div className="px-6 py-5">
                    <p className="mb-4 text-sm font-medium text-gray-700">
                        Please enter your details
                    </p>


                    <label className="mb-2 block text-sm font-semibold text-gray-800">

                        Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="mb-4 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                        placeholder="Enter full name"
                    />

                    <label className="mb-2 block text-sm font-semibold text-gray-800">

                        Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="mb-4 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                        placeholder="Enter phone number"
                    />

                    {error ? <p className="mt-2 text-sm font-semibold text-red-600">{error}</p> : null}

                    <button
                        onClick={submit}
                        disabled={loading}
                        className="mt-5 w-full rounded-md bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                    >
                        {loading ? "PLEASE WAIT..." : "CONTINUE"}
                    </button>

                    <p className="mt-4 text-center text-xs font-medium text-gray-600">
                        By clicking you agree to{" "}
                        <a href="/terms-of-service" className="text-blue-600 underline">
                            Terms and Conditions
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
