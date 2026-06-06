"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
    open: boolean;
    onClose: () => void;
    propertyId?: string | number;
    propertyTitle?: string;
    propertyCodeNo?: string;
    propertyLocation?: string;
    propertyPrice?: string | number;
    propertyType?: string;
    propertyTransactionType?: string;
    propertyData?: Record<string, any>;
};

export default function ContactModal({
    open,
    onClose,
    propertyTitle,
    propertyId,
    propertyCodeNo,
    propertyLocation,
    propertyPrice,
    propertyType,
    propertyTransactionType,
    propertyData,
}: Props) {
    const [name, setName] = useState("");
    const [mobile, setMobile] = useState("");
    const [requirementMessage, setRequirementMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        if (!open) return;
        const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onEsc);
        return () => window.removeEventListener("keydown", onEsc);
    }, [open, onClose]);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!open) return;

        const originalOverflow = document.body.style.overflow;
        const originalPaddingRight = document.body.style.paddingRight;

        // prevent layout jump when scrollbar disappears
        const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.overflow = "hidden";
        if (scrollBarWidth > 0) document.body.style.paddingRight = `${scrollBarWidth}px`;

        return () => {
            document.body.style.overflow = originalOverflow;
            document.body.style.paddingRight = originalPaddingRight;
        };
    }, [open]);

    if (!open) return null;

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();

        const trimmedName = name.trim();

        if (!trimmedName) {
            return alert("Please enter your name");
        }

        if (!/^[A-Za-z\s]+$/.test(trimmedName)) {
            return alert("Name should contain only alphabets");
        }
        if (!/^\d{10}$/.test(mobile.trim())) {
            return alert("Please enter a valid 10 digit mobile number");
        }

        try {
            setLoading(true);

            const res = await fetch("/api/website-leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    customerName: trimmedName,
                    mobileNo: mobile.trim(),
                    requirementMessage: requirementMessage.trim(),
                    transactionType: propertyTransactionType || propertyData?.transactionType || propertyData?.transaction || "",
                    propertyId: propertyId ? String(propertyId) : "",
                    propertyName:
                        propertyTitle ||
                        propertyData?.title ||
                        propertyData?.name ||
                        propertyData?.propertyName ||
                        "",

                    propertyCodeNo:
                        propertyCodeNo ||
                        propertyData?.codeNo ||
                        propertyData?.propertyCodeNo ||
                        propertyData?.propertyCode ||
                        "",

                    propertyLocation:
                        propertyLocation ||
                        propertyData?.location ||
                        propertyData?.address ||
                        propertyData?.locality ||
                        propertyData?.city ||
                        "",

                    propertyPrice:
                        propertyPrice ||
                        propertyData?.price ||
                        propertyData?.displayPrice ||
                        propertyData?.priceLabel ||
                        "",

                    propertyType:
                        propertyType ||
                        propertyData?.type ||
                        "",

                    propertyTransactionType:
                        propertyTransactionType ||
                        propertyData?.transactionType ||
                        propertyData?.transaction ||
                        "",

                    propertyData: propertyData || null,
                })
            });

            if (!res.ok) {
                const data = await res.json().catch(() => null);
                throw new Error(data?.message || "Failed to submit enquiry");
            }

            alert("Thanks! We will call you soon.");
            onClose();
            setName("");
            setMobile("");
            setRequirementMessage("");
        } catch (err) {
            console.error(err);
            alert("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!open || !mounted) return null;

    return createPortal(
        <div className="fixed inset-0 z-[999999] flex items-center justify-center">
            {/* overlay */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
                onWheel={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
            />

            {/* modal box */}
            <div className="relative z-[999999] w-[95%] max-w-3xl max-h-[85vh] overflow-auto rounded-xl bg-white p-8 shadow-2xl">
                {/* close */}
                <button
                    onClick={onClose}
                    className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded bg-gray-800 text-white hover:bg-black"
                    aria-label="Close"
                >
                    ✕
                </button>

                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-black">
                        {propertyTitle || "Property Enquiry"}
                    </h2>

                    {propertyLocation && (
                        <p className="mt-1 text-lg font-medium text-black">
                            {propertyLocation}
                        </p>
                    )}

                    <p className="mt-2 text-sm text-gray-700">
                        Please fill the below form we will call you soon.
                    </p>
                </div>

                <form onSubmit={submit} className="mt-8 space-y-5">
                    <input
                        className="w-full rounded border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-orange-400"
                        placeholder="Your name*"
                        value={name}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^[A-Za-z\s]*$/.test(value)) {
                                setName(value);
                            }
                        }}
                    />

                    <input
                        className="w-full rounded border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-orange-400"
                        placeholder="10 digit mobile number*"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    />

                    <textarea
                        className="min-h-[120px] w-full rounded border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-orange-400"
                        placeholder="Requirement message"
                        value={requirementMessage}
                        onChange={(e) => setRequirementMessage(e.target.value)}
                    />

                    {/*  <label className="flex items-center gap-2 text-xs text-gray-600">
                        <input
                            type="checkbox"
                            checked={agree}
                            onChange={(e) => setAgree(e.target.checked)}
                        />
                        I Agree to SANGLI PROPERTIES{" "}
                        <a
                            href="/terms-of-service"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline text-blue-600 hover:text-blue-800"
                        >
                            Terms of Use
                        </a>
                    </label> */}

                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded bg-red-600 px-8 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                    >
                        {loading ? "Submitting..." : "SUBMIT"}
                    </button>
                </form>
            </div>
        </div>,
        document.body
    );
}