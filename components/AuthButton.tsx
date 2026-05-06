"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import AuthModal from "@/components/AuthModal";

export default function AuthButton({
    mobile = false,
    showButton = true,
}: {
    mobile?: boolean;
    showButton?: boolean;
}) {

    const [open, setOpen] = useState(false);
    const searchParams = useSearchParams();

    const nextUrl = useMemo(() => {
        const raw = searchParams.get("next");
        return raw && raw.startsWith("/") ? raw : null;
    }, [searchParams]);

    useEffect(() => {
        const auth = searchParams.get("auth");
        if (auth === "1") setOpen(true);
    }, [searchParams]);

    return (
        <>
            {showButton ? (
                <button
                    onClick={() => setOpen(true)}
                    className={
                        mobile
                            ? "rounded-full border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-800 shadow-sm hover:bg-gray-50"
                            : "hidden rounded-full border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-800 shadow-sm hover:bg-gray-50 md:inline-flex"
                    }
                >
                    Login / Signup
                </button>
            ) : null}

            <AuthModal
                open={open}
                onClose={() => setOpen(false)}
                nextUrl={nextUrl}
            />
        </>
    );
}