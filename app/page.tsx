// app/page.tsx
export const revalidate = 60;
import Link from "next/link";
import Image from "next/image";
import { getWebsiteProperties, type CrmWebsiteProperty } from "@/lib/crm";
import YouTubeLatestSection from "@/components/YouTubeLatestSection";
import PropertyCardCarousel from "@/components/PropertyCardCarousel";
import HomePropertySections from "@/components/HomePropertySections";
import HomeHeroSearch from "@/components/HomeHeroSearch";
import HeroTextAnimation from "@/components/HeroTextAnimation";

// Logos used in the “Our Happy Customers” strip
const CUSTOMER_LOGOS = [
  "/logos/Axis_Bank.png",
  "/logos/Bata logo.png",
  "/logos/CSB bank.png",
  "/logos/Dominos.jpg",
  "/logos/ESAF bank.jpg",
  "/logos/Ganger Eyenation.png",
  "/logos/HDFC bank.png",
  "/logos/ICICI Bank.jpg",
  "/logos/Jockey2.jpg",
  "/logos/KFC2.jpg",
  "/logos/kotak.jpg",
  "/logos/Levi's2.jpg",
  "/logos/METRO.jpg",
  "/logos/mochi2.png",
  "/logos/Mufti.jpg",
  "/logos/Pizza Hut2.webp",
  "/logos/Policy Bazaar com.png",
  "/logos/reliance-smart.avif",
  "/logos/SBI2.jpg",
  "/logos/Skoda2.jpg",
  "/logos/Star Localmart.png",
];

export default async function HomePage() {

  const crmProperties = await getWebsiteProperties();

  return (
    <main className="bg-[var(--color-bg)] text-[var(--color-text)]">
      {/* HERO SECTION */}

      <section className="relative border-b border-[var(--color-border)] overflow-hidden">
        <HeroTextAnimation />
        {/* BACKGROUND IMAGE */}
        <div className="absolute inset-0">
          <div className="hero-bg hero-bg-1" />
          <div className="hero-bg hero-bg-2" />
          <div className="hero-bg hero-bg-3" />
          <div className="absolute inset-0 bg-[var(--color-bg)]/25" />
        </div>

        {/* CONTENT */}
        <div className="site-container relative z-10 flex flex-col gap-10 py-12 lg:flex-row lg:items-center">
          {/* LEFT SIDE */}
          <div className="w-full max-w-2xl space-y-5">
            <p className="hero-text-reveal hero-delay-1 text-[11px] font-semibold tracking-[0.3em] text-[var(--color-accent)]">
              REAL ESTATE CONSULTANT · SANGLI
            </p>

            <h1 className="hero-text-reveal hero-delay-2 text-4xl font-semibold lg:text-5xl text-[var(--color-header)]">
              Find the right property in{" "}
              <span className="text-[var(--color-accent)]">Sangli.</span>
            </h1>

            <p className="hero-text-reveal hero-delay-3 text-sm text-[var(--color-header)]">
              Buy, sell and rent residential and commercial properties with a
              trusted local advisor. 15+ years of experience, transparent
              process and end-to-end support from site visit to registration.
            </p>

            {/* SEARCH CARD */}
            <HomeHeroSearch />

            {/* PRIMARY BUTTONS */}
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/properties"
                className="inline-flex items-center rounded-full bg-[var(--color-header)] px-5 py-2.5 text-sm font-medium text-[var(--color-card)] shadow-sm hover:brightness-110"
              >
                View properties
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center rounded-full bg-[var(--color-header)] px-5 py-2.5 text-sm font-medium text-[var(--color-card)] shadow-sm hover:brightness-110"
              >
                Talk to us
              </Link>
            </div>
          </div>

          {/* RIGHT SIDE – HIGHLIGHT CARD */}
          <div className="relative z-10 flex flex-1 items-center justify-center">
            <div className="hero-text-reveal hero-delay-4 w-full max-w-2xl rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)] p-8 shadow-lg shadow-[var(--color-border)]/60">
              <p className="text-[13px] font-semibold uppercase tracking-[0.28em] text-[var(--color-accent)]">
                Highlight
              </p>

              <p className="mt-3 text-xl font-semibold leading-relaxed text-[var(--color-header)]">
                Verified projects, clear titles and on-ground support in Sangli.
              </p>

              <div className="mt-5 space-y-2 text-base leading-relaxed text-[var(--color-muted)]">
                <p>• Residential &amp; commercial properties</p>
                <p>• Plots, NA layouts &amp; farm lands</p>
                <p>• Bank loan &amp; documentation assistance</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOME PROPERTY SECTIONS */}
      <section
        id="featured"
        className="border-t border-[var(--color-border)] bg-[var(--color-bg)]"
      >
        <div className="site-container py-10">
          <div>
            <h2 className="text-lg font-semibold text-[var(--color-header)]">
              Featured properties
            </h2>
            <p className="mt-1 text-xs text-[var(--color-muted)]">
              Browse the latest published properties from Sangli Properties.
            </p>
          </div>

          <HomePropertySections properties={crmProperties} />
        </div>
      </section>

      {/* OUR HAPPY CUSTOMERS – LOGO SCROLLER */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-card)]">
        <div className="w-full px-4 py-10">
          <div className="text-center">
            <p className="text-[20px] font-semibold tracking-[0.25em] uppercase text-[var(--color-accent)]">
              Our Happy Customers
            </p>
            <h2 className="mt-4 text-lg text-[16px] font-semibold text-[var(--color-header)]">
              Brands that trust Sangli Properties LLP
            </h2>
          </div>

          {/* Scrolling logo strip */}
          <div className="mt-10 overflow-hidden">
            <div className="flex w-max">
              {/* Track 1 */}
              <div className="logos-marquee-track">
                {CUSTOMER_LOGOS.map((src, idx) => (
                  <div
                    key={`track1-${idx}`}
                    className="flex min-w-[100px] items-center justify-center rounded-[20px] bg-white px-6 py-4 shadow-[0_14px_30px_rgba(15,23,42,0.12)] border border-[var(--color-border)]/80"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={`Customer logo ${idx + 1}`}
                      className="max-h-8 w-auto object-contain opacity-90 transition-opacity hover:opacity-100"
                    />
                  </div>
                ))}
              </div>

              {/* Track 2 – duplicate for seamless loop */}
              <div className="logos-marquee-track" aria-hidden="true">
                {CUSTOMER_LOGOS.map((src, idx) => (
                  <div
                    key={`track2-${idx}`}
                    className="flex min-w-[100px] items-center justify-center rounded-[20px] bg-white px-6 py-4 shadow-[0_14px_30px_rgba(15,23,42,0.12)] border border-[var(--color-border)]/80"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt=""
                      className="max-h-8 w-auto object-contain opacity-90 transition-opacity hover:opacity-100"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <YouTubeLatestSection />
    </main>
  );
}