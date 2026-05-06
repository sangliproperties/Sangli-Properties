"use client";

import { useMemo, useState } from "react";

function formatINR(n: number) {
    if (!Number.isFinite(n)) return "0";
    return n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

function calcEmi(P: number, annualRate: number, months: number) {
    if (P <= 0 || annualRate < 0 || months <= 0) {
        return { emi: 0, totalPayment: 0, totalInterest: 0 };
    }

    const r = annualRate / 12 / 100; // monthly rate
    if (r === 0) {
        const emi = P / months;
        const totalPayment = emi * months;
        return { emi, totalPayment, totalInterest: totalPayment - P };
    }

    const pow = Math.pow(1 + r, months);
    const emi = (P * r * pow) / (pow - 1);
    const totalPayment = emi * months;
    const totalInterest = totalPayment - P;

    return { emi, totalPayment, totalInterest };
}

function IconButton({
    bgClass,
    label,
    href,
    onClick,
    children,
}: {
    bgClass: string;
    label?: string;
    href?: string;
    onClick?: () => void;
    children: React.ReactNode;
}) {
    const content = (
        <div
            className={[
                "group relative flex items-center justify-center",
                "h-8 w-8 rounded-lg", // ✅ smaller + rounded
                bgClass,
                "shadow-md transition-all duration-200",
                "hover:scale-105",
            ].join(" ")}
        >
            {children}

            {label ? (
                <div className="pointer-events-none absolute right-11 hidden sm:block">
                    <div
                        className={[
                            "translate-x-2 opacity-0",
                            "group-hover:translate-x-0 group-hover:opacity-100",
                            "transition-all duration-200",
                            "bg-orange-500 text-white",
                            "px-4 py-2 text-xs font-semibold",
                            "rounded-lg whitespace-nowrap",
                        ].join(" ")}
                    >
                        {label}
                    </div>
                </div>
            ) : null}
        </div>
    );

    if (href) {
        return (
            <a href={href} target="_blank" rel="noopener noreferrer">
                {content}
            </a>
        );
    }

    return (
        <button type="button" onClick={onClick}>
            {content}
        </button>
    );
}

export default function FloatingSidebar() {
    const [open, setOpen] = useState(false);

    // ✅ WhatsApp number (you told earlier): 9146636555
    // WhatsApp click-to-chat link:
    const whatsappLink = useMemo(() => {
        // If you want pre-filled message, add: ?text=Hello%20Sangli%20Properties
        return "https://wa.me/919146636555";
    }, []);

    // ⚠️ Replace these with your real profile URLs (when you have them)
    const facebookLink = "https://www.facebook.com/sangliproperties"; // TODO: put your real page URL
    const instagramLink = "https://www.instagram.com/sanglipropertiesllp"; // TODO
    const youtubeLink = "https://www.youtube.com/@sanglipropertiesllp"; // TODO

    // EMI state
    const [loan, setLoan] = useState<number>(2500000);
    const [rate, setRate] = useState<number>(10.5);
    const [tenureValue, setTenureValue] = useState<number>(20);
    const [tenureUnit, setTenureUnit] = useState<"YR" | "MO">("YR");

    const months = tenureUnit === "YR" ? Math.max(1, Math.round(tenureValue * 12)) : Math.max(1, Math.round(tenureValue));
    const { emi, totalPayment, totalInterest } = calcEmi(loan, rate, months);

    return (
        <>
            {/* RIGHT FLOATING SIDEBAR */}
            <div className="fixed right-0 top-4/7 z-[60] flex flex-col gap-2 pr-2">
                <IconButton bgClass="bg-orange-300 hover:bg-orange-500" label="WHATSAPP" href={whatsappLink}>
                    {/* WhatsApp SVG */}
                    <svg viewBox="0 0 32 32" className="h-6 w-6 fill-white" aria-hidden="true">
                        <path d="M19.11 17.36c-.27-.14-1.6-.79-1.85-.88-.25-.09-.43-.14-.61.14-.18.27-.7.88-.86 1.06-.16.18-.32.2-.59.07-.27-.14-1.13-.42-2.16-1.33-.8-.71-1.34-1.59-1.5-1.86-.16-.27-.02-.42.12-.55.13-.13.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.84-2.02-.22-.53-.45-.46-.61-.47h-.52c-.18 0-.48.07-.73.34-.25.27-.95.93-.95 2.27 0 1.33.98 2.62 1.11 2.8.14.18 1.92 2.93 4.65 4.11.65.28 1.15.45 1.54.58.65.21 1.25.18 1.72.11.52-.08 1.6-.65 1.82-1.28.22-.63.22-1.17.16-1.28-.07-.11-.25-.18-.52-.32z" />
                        <path d="M16 3C8.83 3 3 8.83 3 16c0 2.23.58 4.41 1.69 6.35L3 29l6.82-1.64A12.9 12.9 0 0 0 16 29c7.17 0 13-5.83 13-13S23.17 3 16 3zm0 23.64c-1.97 0-3.9-.53-5.58-1.54l-.4-.24-4.05.97.98-3.95-.26-.41A10.63 10.63 0 0 1 5.36 16C5.36 10.13 10.13 5.36 16 5.36S26.64 10.13 26.64 16 21.87 26.64 16 26.64z" />
                    </svg>
                </IconButton>

                {/* EMI Calculator */}
                <IconButton bgClass="bg-orange-300 hover:bg-orange-500" onClick={() => setOpen(true)} label="EMI CALC">
                    {/* Calculator SVG */}
                    <svg viewBox="0 0 24 24" className="h-6 w-6 fill-white" aria-hidden="true">
                        <path d="M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm0 2v4h10V4H7zm1 7h2v2H8v-2zm0 4h2v2H8v-2zm4-4h2v2h-2v-2zm0 4h2v2h-2v-2zm4-4h2v6h-2v-6z" />
                    </svg>
                </IconButton>

                {/* Facebook */}
                <IconButton bgClass="bg-orange-300 hover:bg-orange-500" href={facebookLink} label="FACEBOOK">
                    <svg viewBox="0 0 24 24" className="h-6 w-6 fill-white" aria-hidden="true">
                        <path d="M13.5 22v-8h2.7l.4-3H13.5V9.1c0-.9.3-1.6 1.6-1.6h1.7V4.8c-.3 0-1.5-.1-2.9-.1-2.9 0-4.8 1.7-4.8 5v2.3H6.3v3H9V22h4.5z" />
                    </svg>
                </IconButton>

                {/* Instagram */}
                <IconButton bgClass="bg-orange-300 hover:bg-orange-500" href={instagramLink} label="INSTAGRAM">
                    <svg viewBox="0 0 24 24" className="h-6 w-6 fill-white" aria-hidden="true">
                        <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm10 2H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm-5 4.2A3.8 3.8 0 1 1 8.2 12 3.8 3.8 0 0 1 12 8.2zm0 2A1.8 1.8 0 1 0 13.8 12 1.8 1.8 0 0 0 12 10.2zM17.7 6.6a.7.7 0 1 1-.7-.7.7.7 0 0 1 .7.7z" />
                    </svg>
                </IconButton>

                {/* YouTube */}
                <IconButton bgClass="bg-orange-300 hover:bg-orange-500" href={youtubeLink} label="YOUTUBE">
                    <svg viewBox="0 0 24 24" className="h-6 w-6 fill-white" aria-hidden="true">
                        <path d="M21.6 7.2a2.8 2.8 0 0 0-2-2C18 5 12 5 12 5s-6 0-7.6.2a2.8 2.8 0 0 0-2 2A29 29 0 0 0 2 12a29 29 0 0 0 .4 4.8 2.8 2.8 0 0 0 2 2C6 19 12 19 12 19s6 0 7.6-.2a2.8 2.8 0 0 0 2-2A29 29 0 0 0 22 12a29 29 0 0 0-.4-4.8zM10 15.5v-7l6 3.5-6 3.5z" />
                    </svg>
                </IconButton>
            </div>

            {/* EMI MODAL */}
            {open ? (
                <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4">
                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-md bg-white text-gray-900 shadow-2xl">
                        <div className="flex items-center justify-between border-b px-6 py-4">
                            <h2 className="text-xl font-semibold tracking-wide">EMI Calculator</h2>
                            <button
                                className="text-2xl leading-none text-gray-500 hover:text-gray-900"
                                onClick={() => setOpen(false)}
                                aria-label="Close"
                            >
                                ×
                            </button>
                        </div>

                        <div className="px-6 py-5">
                            {/* Inputs */}
                            <div className="space-y-4">
                                <div>
                                    <label className="mb-1 block text-sm font-semibold text-gray-700">Loan Amount</label>
                                    <div className="flex overflow-hidden rounded border">
                                        <div className="flex items-center justify-center bg-gray-100 px-3 text-gray-700">₹</div>
                                        <input
                                            type="number"
                                            className="w-full bg-white px-3 py-2 text-gray-900 outline-none placeholder:text-gray-400"
                                            value={loan}
                                            onChange={(e) => setLoan(Number(e.target.value))}
                                            min={0}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-semibold text-gray-700">Interest Rate</label>
                                    <div className="flex overflow-hidden rounded border">
                                        <div className="flex items-center justify-center bg-gray-100 px-3 text-gray-700">%</div>
                                        <input
                                            type="number"
                                            className="w-full bg-white px-3 py-2 text-gray-900 outline-none placeholder:text-gray-400"
                                            value={rate}
                                            onChange={(e) => setRate(Number(e.target.value))}
                                            min={0}
                                            step="0.1"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-semibold text-gray-700">Loan Tenure</label>
                                    <div className="flex gap-2">
                                        <div className="flex flex-1 overflow-hidden rounded border">
                                            <div className="flex items-center justify-center bg-gray-100 px-3 text-gray-700">⏱</div>
                                            <input
                                                type="number"
                                                className="w-full bg-white px-3 py-2 text-gray-900 outline-none placeholder:text-gray-400"
                                                value={tenureValue}
                                                onChange={(e) => setTenureValue(Number(e.target.value))}
                                                min={1}
                                            />
                                        </div>

                                        <div className="flex overflow-hidden rounded border">
                                            <button
                                                className={[
                                                    "px-4 py-2 text-sm font-semibold",
                                                    tenureUnit === "YR" ? "bg-blue-600 text-white" : "bg-white text-gray-700",
                                                ].join(" ")}
                                                onClick={() => setTenureUnit("YR")}
                                                type="button"
                                            >
                                                Yr
                                            </button>
                                            <button
                                                className={[
                                                    "px-4 py-2 text-sm font-semibold",
                                                    tenureUnit === "MO" ? "bg-blue-600 text-white" : "bg-white text-gray-700",
                                                ].join(" ")}
                                                onClick={() => setTenureUnit("MO")}
                                                type="button"
                                            >
                                                Mo
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Results */}
                            <div className="mt-6 border-t pt-6 text-center">
                                <div className="text-sm text-gray-500">Loan EMI</div>
                                <div className="mt-1 text-3xl font-bold text-gray-900">
                                    ₹ {formatINR(emi)}
                                </div>

                                <div className="mt-6 grid gap-4 md:grid-cols-2">
                                    <div className="rounded border p-4">
                                        <div className="text-sm text-gray-500">Total Interest Payable</div>
                                        <div className="mt-1 text-xl font-semibold text-gray-900">
                                            ₹ {formatINR(totalInterest)}
                                        </div>
                                    </div>
                                    <div className="rounded border p-4">
                                        <div className="text-sm text-gray-500">Total of Payments (Principal + Interest)</div>
                                        <div className="mt-1 text-xl font-semibold text-gray-900">
                                            ₹ {formatINR(totalPayment)}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end">
                                    <button
                                        className="rounded border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50"
                                        onClick={() => setOpen(false)}
                                        type="button"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
}
