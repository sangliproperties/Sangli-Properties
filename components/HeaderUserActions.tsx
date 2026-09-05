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
            <div className="hidden shrink-0 flex-col items-end gap-2 xl:flex 2xl:gap-4">
                <div className="flex flex-nowrap items-center gap-3 2xl:gap-4">
                    <Link
                        href="/submit-property"
                        className="whitespace-nowrap rounded-full bg-[var(--color-accent)] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:brightness-110 2xl:px-5 2xl:text-sm"
                    >
                        SUBMIT PROPERTY
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="hidden shrink-0 flex-col items-end gap-2 xl:flex 2xl:gap-4">
            <div className="flex flex-nowrap items-center gap-3 2xl:gap-4">
                <Link
                    href="/submit-property"
                    className="whitespace-nowrap rounded-full bg-[var(--color-accent)] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:brightness-110 2xl:px-5 2xl:text-sm"
                >
                    SUBMIT PROPERTY
                </Link>

                {auth.loggedIn ? (
                    <>
                        <Link
                            href="/cart"
                            className="whitespace-nowrap rounded-full border border-gray-300 bg-white px-4 py-2.5 text-xs font-semibold text-gray-800 shadow-sm transition hover:bg-gray-50 2xl:px-5 2xl:text-sm"
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
                <p
                    className="max-w-[250px] truncate text-right text-xs font-medium text-[var(--color-muted)] 2xl:max-w-[320px] 2xl:text-sm"
                    title={`Welcome, ${auth.fullName}`}
                >
                    Welcome,{" "}
                    <span className="font-semibold text-[var(--color-header)]">
                        {auth.fullName}
                    </span>
                </p>
            ) : null}
        </div>
    );
}