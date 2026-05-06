"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AuthButton from "@/components/AuthButton";
import LogoutButton from "@/components/LogoutButton";

type AuthState =
    | { loggedIn: false }
    | { loggedIn: true; fullName?: string | null };

export default function HeaderUserActions() {
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

    if (auth == null) {
        return (
            <div className="hidden md:flex md:flex-col md:items-end md:gap-5">
                <div className="flex items-center gap-3">
                    <Link
                        href="/submit-property"
                        className="rounded-full bg-[var(--color-accent)] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:brightness-110"
                    >
                        SUBMIT PROPERTY
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="hidden md:flex md:flex-col md:items-end md:gap-5">
            <div className="flex items-center gap-3">
                <Link
                    href="/submit-property"
                    className="rounded-full bg-[var(--color-accent)] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:brightness-110"
                >
                    SUBMIT PROPERTY
                </Link>

                {auth.loggedIn ? (
                    <>
                        <Link
                            href="/cart"
                            className="rounded-full border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-800 shadow-sm hover:bg-gray-50"
                        >
                            Cart
                        </Link>
                        <LogoutButton />
                    </>
                ) : (
                    <AuthButton />
                )}
            </div>

            {auth.loggedIn && auth.fullName ? (
                <p className="text-xs font-medium text-[var(--color-muted)]">
                    Welcome,{" "}
                    <span className="font-semibold text-[var(--color-header)]">
                        {auth.fullName}
                    </span>
                </p>
            ) : null}
        </div>
    );
}