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
            <div className="site-container relative flex min-w-0 items-center justify-between gap-4 py-2 xl:gap-7 xl:py-2">
              <Link
                href="/"
                className="flex min-w-0 shrink-0 items-center gap-2 xl:gap-3"
              >
                {/* Icon with animation */}
                <div className="shrink-0 transition-all duration-300 hover:-translate-y-1 hover:scale-105">
                  <Image
                    src="/Sangli Properties Logo.png"
                    alt="Sangli Properties LLP logo"
                    width={200}
                    height={200}
                    className="h-14 w-14 rounded-full bg-white object-contain sm:h-16 sm:w-16 xl:h-[72px] xl:w-[72px] 2xl:h-24 2xl:w-24"
                    priority
                  />
                </div>

                {/* BRAND TEXT */}

                <div className="min-w-0 leading-tight">
                  <h1
                    className={`${brandFont.className} whitespace-nowrap text-[20px] font-normal tracking-tight text-[#1a1a1a] sm:text-[24px] xl:text-[28px] 2xl:text-[32px]`}
                  >
                    Sangli Properties LLP
                  </h1>
                  <p className="mt-1 whitespace-nowrap text-[10px] italic tracking-wide text-[#555] sm:text-[11px] xl:text-[13px] 2xl:text-[14px]">
                    Buy • Sell • Rent
                  </p>
                </div>
              </Link>

              {/* NAVIGATION */}
              <nav className="hidden min-w-0 flex-1 items-center justify-center gap-6 whitespace-nowrap text-[17px] font-semibold text-[var(--color-muted)] xl:flex 2xl:gap-9 2xl:text-[19px]">
                {/* PROPERTIES – 2-LEVEL DROPDOWN */}
                <div className="relative group pb-2">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 text-[17px] transition hover:text-[var(--color-header)] 2xl:text-[19px]"
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
                  href="/"
                  className="text-[17px] transition hover:text-[var(--color-header)] 2xl:text-[19px]"
                >
                  Home
                </Link>
                <Link
                  href="/services"
                  className="text-[17px] transition hover:text-[var(--color-header)] 2xl:text-[19px]"
                >
                  Services
                </Link>
                <Link
                  href="/about"
                  className="text-[17px] transition hover:text-[var(--color-header)] 2xl:text-[19px]"
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  className="text-[17px] transition hover:text-[var(--color-header)] 2xl:text-[19px]"
                >
                  Contact
                </Link>
              </nav>

              {/* CTA BUTTONS */}

              <div className="hidden shrink-0 xl:block">
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