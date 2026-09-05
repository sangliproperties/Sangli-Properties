"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AuthButton from "@/components/AuthButton";
import LogoutButton from "@/components/LogoutButton";

type AuthState =
    | { loggedIn: false }
    | { loggedIn: true; fullName?: string | null };

export default function MobileHeaderMenu() {
    const [open, setOpen] = useState(false);
    const [auth, setAuth] = useState<AuthState | null>(null);

    useEffect(() => {
        let mounted = true;

        fetch("/api/auth/status", { cache: "no-store" })
            .then((res) => res.json())
            .then((data) => {
                if (!mounted) return;
                setAuth(data);
            })
            .catch(() => {
                if (!mounted) return;
                setAuth({ loggedIn: false });
            });

        return () => {
            mounted = false;
        };
    }, []);

    return (
        <div className="shrink-0 xl:hidden">
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-white p-2 text-gray-800 shadow-sm transition hover:bg-gray-50"
                aria-label="Toggle menu"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    {open ? (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    )}
                </svg>
            </button>

            {open && (
                <div className="absolute left-0 top-full z-50 max-h-[calc(100vh-80px)] w-full overflow-y-auto border-t border-[var(--color-border)] bg-white shadow-lg">
                    <div className="site-container flex flex-col gap-4 py-4">
                        <Link
                            href="/"
                            onClick={() => setOpen(false)}
                            className="text-base font-medium text-[var(--color-header)]"
                        >
                            Home
                        </Link>
                        <Link href="/properties" onClick={() => setOpen(false)} className="text-base font-medium text-[var(--color-header)]">
                            Properties
                        </Link>
                        <Link href="/properties/residential" onClick={() => setOpen(false)} className="pl-3 text-sm text-[var(--color-muted)]">
                            Residential
                        </Link>
                        <Link href="/properties/commercial" onClick={() => setOpen(false)} className="pl-3 text-sm text-[var(--color-muted)]">
                            Commercial
                        </Link>
                        <Link href="/properties/land" onClick={() => setOpen(false)} className="pl-3 text-sm text-[var(--color-muted)]">
                            Land / Plot
                        </Link>
                        <Link href="/properties/industrial" onClick={() => setOpen(false)} className="pl-3 text-sm text-[var(--color-muted)]">
                            Industrial
                        </Link>

                        <Link href="/services" onClick={() => setOpen(false)} className="text-base font-medium text-[var(--color-header)]">
                            Services
                        </Link>
                        <Link href="/about" onClick={() => setOpen(false)} className="text-base font-medium text-[var(--color-header)]">
                            About
                        </Link>
                        <Link href="/contact" onClick={() => setOpen(false)} className="text-base font-medium text-[var(--color-header)]">
                            Contact
                        </Link>

                        <hr className="border-[var(--color-border)]" />

                        <Link
                            href="/submit-property"
                            onClick={() => setOpen(false)}
                            className="inline-flex w-fit rounded-full bg-[var(--color-accent)] px-4 py-2 text-xs font-semibold text-white shadow-sm"
                        >
                            SUBMIT PROPERTY
                        </Link>

                        {auth?.loggedIn ? (
                            <div className="flex flex-col gap-3">
                                <Link
                                    href="/cart"
                                    onClick={() => setOpen(false)}
                                    className="inline-flex w-fit rounded-full border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-800 shadow-sm"
                                >
                                    Cart
                                </Link>
                                <div className="w-fit">
                                    <LogoutButton />
                                </div>
                                {auth.fullName ? (
                                    <p className="text-sm font-medium text-[var(--color-muted)]">
                                        Welcome,{" "}
                                        <span className="font-semibold text-[var(--color-header)]">
                                            {auth.fullName}
                                        </span>
                                    </p>
                                ) : null}
                            </div>
                        ) : (
                            <div className="w-fit">
                                <AuthButton mobile />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}