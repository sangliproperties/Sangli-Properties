// app/services/page.tsx
import Link from "next/link";

export const metadata = {
  title: "Services | Sangli Properties",
  description:
    "Property services in Sangli & Miraj – buy, sell and rent with transparent, on-ground support.",
};

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      {/* HERO / BANNER */}
      <section className="relative overflow-hidden border-b border-[var(--color-border)] bg-[var(--color-header)] text-white">
        <div className="relative z-10 mx-auto flex max-w-[1400px] justify-between px-4 pt-10 pb-10 sm:pt-12 sm:pb-12 md:pt-14 md:pb-20">
          {/* LEFT TEXT */}
          <div className="max-w-xl space-y-3">
            <p className="text-sm tracking-[0.35em] uppercase text-white/150">
              SANGLI PROPERTIES LLP
            </p>

            <h1 className="text-3xl sm:text-4xl font-semibold">Services</h1>

            <nav className="text-xs text-white/80">
              <Link href="/" className="hover:underline">Home</Link>
              <span className="mx-1">/</span>
              <span>Services</span>
            </nav>
          </div>
        </div>

        {/* FULL-WIDTH SKYLINE AT BOTTOM */}
        <div className="absolute bottom-0 left-85 right-5 ">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/skyline_white2.png"
            alt="Skyline"
            className="w-small object-cover opacity-100 pointer-events-none object-contain hidden md:block"
          />
        </div>
      </section>

      {/* INTRO + MAIN SERVICES */}
      <section className="border-b border-[var(--color-border)] bg-[var(--color-bg)]">
        <div className="mx-auto max-w-[1400px] px-4 py-10 sm:py-12">
          {/* Section heading */}
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-xl font-semibold tracking-wide text-[var(--color-header)]">
              OUR CORE SERVICES
            </h2>
            <div className="mt-3 mx-auto h-[2px] w-16 rounded-full bg-[var(--color-accent)]" />

            <p className="mt-5 text-sm leading-relaxed text-[var(--color-muted)]">
              The property market is one of the most complicated and volatile
              markets. We look at this a bit differently. With 15+ years of
              rich experience and the right resources in place, the property
              market is a home to us. Your anxiety is our comfort zone. Market
              knowledge is now at your fingertips to help you make an informed
              decision.
            </p>
          </div>

          {/* Cards */}
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {/* Property Buying & Selling Assistance */}
            <article className="flex h-full flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-sm">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-bg)] text-[var(--color-accent)]">
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 12L12 5l8 7" />
                  <path d="M6 11v8h12v-8" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[var(--color-header)]">
                Property Buying & Selling Assistance
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted)]">
                Verified listings, fair prices, and expert guidance.
              </p>
            </article>

            {/* Commercial Property Deals */}
            <article className="flex h-full flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-sm">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-bg)] text-[var(--color-accent)]">
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 21h18" />
                  <path d="M5 21V7l7-4 7 4v14" />
                  <path d="M9 10h.01" />
                  <path d="M12 10h.01" />
                  <path d="M15 10h.01" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[var(--color-header)]">
                Commercial Property Deals
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted)]">
                Offices, showrooms, and investment opportunities.
              </p>
            </article>

            {/* Rental & Leasing Services */}
            <article className="flex h-full flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-sm">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-bg)] text-[var(--color-accent)]">
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 11l9-7 9 7" />
                  <path d="M5 10v10h14V10" />
                  <path d="M9 20v-6h6v6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[var(--color-header)]">
                Rental & Leasing Services
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted)]">
                Helping owners and tenants find the perfect match.
              </p>
            </article>

            {/* Real Estate Investment Guidance */}
            <article className="flex h-full flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-sm">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-bg)] text-[var(--color-accent)]">
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 16l4-4 4 3 6-7" />
                  <path d="M18 8h2v2" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[var(--color-header)]">
                Real Estate Investment Guidance
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted)]">
                Market insights and portfolio management.
              </p>
            </article>

            {/* Project Marketing & Branding */}
            <article className="flex h-full flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-sm">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-bg)] text-[var(--color-accent)]">
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="4" y="4" width="16" height="16" rx="2" />
                  <path d="M8 16V12" />
                  <path d="M12 16V8" />
                  <path d="M16 16v-5" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[var(--color-header)]">
                Project Marketing & Branding
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted)]">
                Helping builders promote new projects effectively.
              </p>
            </article>

            {/* Legal & Documentation Support */}
            <article className="flex h-full flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-sm">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-bg)] text-[var(--color-accent)]">
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M8 3h8l5 5v13H3V3h5z" />
                  <path d="M16 3v5h5" />
                  <path d="M8 13h8" />
                  <path d="M8 17h6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[var(--color-header)]">
                Legal & Documentation Support
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted)]">
                Hassle-free paperwork and registration support.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="bg-[var(--color-accent)] text-[var(--color-card)]">
        <div className="mx-auto flex max-w-[1400px] flex-col items-start gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-card)]/80">
              Need help?
            </p>
            <h3 className="mt-2 text-lg font-semibold">
              Looking to sell or rent your property?
            </h3>
            <p className="mt-1 text-sm text-[var(--color-card)]/90">
              Share your details and we&apos;ll get in touch with a free
              consultation.
            </p>
          </div>

          <Link
            href="/submit-property"
            className="mt-6 md:mt-0 bg-white text-[var(--color-accent)] font-semibold px-6 py-2 rounded-full shadow hover:bg-gray-100"
          >
            Submit Now
          </Link>
        </div>
      </section>
    </main>
  );
}
