"use client";

export default function LogoutButton() {
    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", {
                method: "POST",
            });
        } finally {
            window.location.href = "/";
        }
    };

    return (
        <button
            onClick={handleLogout}
            className="rounded-full border border-red-200 bg-white px-4 py-2 text-xs font-semibold text-red-600 shadow-sm hover:bg-red-50"
        >
            Logout
        </button>
    );
}