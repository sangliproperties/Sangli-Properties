// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { DM_Serif_Display } from "next/font/google";
import FloatingSidebar from "@/components/FloatingSidebar";
import AuthButton from "@/components/AuthButton";
/* import { cookies } from "next/headers"; */
/* import { getUserIdFromCookie } from "@/lib/auth"; */
/* import { prisma } from "@/lib/prisma"; */
import LogoutButton from "@/components/LogoutButton";
import Link from "next/link";
import HeaderUserActions from "@/components/HeaderUserActions";
import MobileHeaderMenu from "@/components/MobileHeaderMenu";
import Image from "next/image";

// closest premium serif to Bropella
const brandFont = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Sangli Properties | Real Estate in Sangli & Miraj",
  description:
    "Buy, sell & rent verified properties in Sangli and Miraj with Sangli Properties.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  /*  const cookieStore = await cookies();
   const userId = getUserIdFromCookie(cookieStore.get("sp_user")?.value);
   const user = userId
     ? await prisma.user.findUnique({
       where: { id: userId },
       select: { fullName: true },
     })
     : null; */
  const year = new Date().getFullYear();   // ✅ FIX — define year inside component
  return (
    <html lang="en">
      <body className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
        <div className="flex min-h-screen flex-col">

          {/* HEADER */}
          <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-white">
            <div className="site-container relative flex items-center justify-between py-1.5 md:py-1">
              <a href="/" className="flex items-center">
                {/* Icon with animation */}
                <div className="shrink-0 transition-all duration-300 hover:-translate-y-1 hover:scale-105">
                  <Image
                    src="/Sangli Properties Logo.png"
                    alt="Sangli Properties LLP logo"
                    width={200}
                    height={200}
                    className="h-18 w-18 rounded-full object-contain bg-white md:h-25 md:w-25"
                    priority
                  />
                </div>

                {/* BRAND TEXT */}

                <div className="leading-tight">
                  <h1 className={`${brandFont.className} text-[24px] sm:text-[24px] md:text-[32px] font-normal text-[#1a1a1a] tracking-tight`}>
                    Sangli Properties LLP
                  </h1>
                  <p className="mt-1 md:mt-2 text-[11px] md:text-[13px] italic tracking-wide text-[#555]">
                    Buy • Sell • Rent
                  </p>
                </div>
              </a>

              {/* NAVIGATION */}
              <nav className="hidden items-center gap-10 text-[19px] font-semibold text-[var(--color-muted)] md:flex">
                {/* PROPERTIES – 2-LEVEL DROPDOWN */}
                <div className="relative group pb-2">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 text-[19px] hover:text-[var(--color-header)] transition"
                  >
                    <span>Properties</span>
                    {/* small chevron */}
                    <svg
                      className="h-3 w-3"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5 7.5L10 12.5L15 7.5"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  {/* FIRST LEVEL: 4 MAIN CATEGORIES */}
                  <div
                    className="pointer-events-none absolute left-0 top-full z-30 w-60 pt-2 opacity-0 transition-opacity duration-150 group-hover:pointer-events-auto group-hover:opacity-100"
                  >
                    <div className="rounded-md bg-slate-900 text-[17px] font-medium text-white shadow-xl ring-1 ring-black/10">
                      <ul className="relative">
                        {/* Residential */}
                        <li className="relative group/residential">
                          <Link
                            href="/properties/residential"
                            className="flex items-center justify-between px-4 py-2 hover:bg-slate-800"
                          >
                            <span>Residential properties</span>

                          </Link>

                        </li>

                        {/* Commercial */}
                        <li className="relative group/commercial">
                          <Link
                            href="/properties/commercial"
                            className="flex items-center justify-between px-4 py-2 hover:bg-slate-800"
                          >
                            <span>Commercial properties</span>

                          </Link>

                        </li>

                        {/* Land */}
                        <li className="relative group/land">
                          <Link
                            href="/properties/land"
                            className="flex items-center justify-between px-4 py-2 hover:bg-slate-800"
                          >
                            <span>Land/Plot</span>

                          </Link>

                        </li>

                        {/* Industrial (no submenu yet) */}
                        <li>
                          <Link
                            href="/properties/industrial"
                            className="flex items-center justify-between px-4 py-2 hover:bg-slate-800"

                          >
                            Industrial
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Link
                  href="/services"
                  className="text-[19px] hover:text-[var(--color-header)] transition"
                >
                  Services
                </Link>
                <Link
                  href="/about"
                  className="text-[19px] hover:text-[var(--color-header)] transition"
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  className="text-[19px] hover:text-[var(--color-header)] transition"
                >
                  Contact
                </Link>
              </nav>

              {/* CTA BUTTONS */}

              <div className="hidden md:block">
                <HeaderUserActions />
              </div>

              <AuthButton showButton={false} />

              <MobileHeaderMenu />
            </div>
          </header>

          {/* MAIN */}
          <main className="pt-0">{children}</main>

          {/* FOOTER */}
          <footer className="border-t border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-muted)]">
            <div className="site-container py-4 md:py-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                {/* Left: Phone */}
                <div className="md:w-[28%]">
                  <div className="flex items-start gap-2 text-xs sm:text-sm">
                    <svg
                      viewBox="0 0 24 24"
                      className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-header)]"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.12.9.37 1.77.73 2.59a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.49-1.25a2 2 0 0 1 2.11-.45c.82.36 1.69.61 2.59.73A2 2 0 0 1 22 16.92Z" />
                    </svg>
                    <span className="font-medium leading-relaxed text-[var(--color-header)]">
                      +91-7385077033 / 9146636555
                    </span>
                  </div>
                </div>

                {/* Center: Email + Address */}
                <div className="md:w-[44%] md:px-4">
                  <div className="space-y-2 text-xs sm:text-sm">
                    <div className="flex items-start gap-2">
                      <svg
                        viewBox="0 0 24 24"
                        className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-header)]"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="3" y="5" width="18" height="14" rx="2" ry="2" />
                        <polyline points="3 7 12 13 21 7" />
                      </svg>
                      <a
                        href="mailto:rajeshtunge@gmail.com"
                        className="font-medium leading-relaxed break-all text-[var(--color-header)] hover:text-[var(--color-accent)]"
                      >
                        rajeshstunge@gmail.com
                      </a>
                    </div>

                    <div className="flex items-start gap-2">
                      <span className="mt-0.5 shrink-0 text-[var(--color-header)]">📍</span>
                      <p className="font-medium leading-relaxed text-[var(--color-header)]">
                        Rajesh Bungalow, In Front Of ESAF Bank, Vishrambag, LIC Colony,
                        Near 100 Ft Road, Sangli.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right: Copyright + RERA */}
                <div className="md:w-[28%]">
                  <div className="space-y-1 text-[11px] text-left md:text-right">
                    <p>© {year} Sangli Properties LLP. All rights reserved.</p>
                    <p>
                      RERA No:{" "}
                      <span className="font-semibold text-[var(--color-header)]">
                        A53100019451
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </footer>
          <FloatingSidebar />
        </div>
      </body>
    </html>
  );
}
// app/services/page.tsx