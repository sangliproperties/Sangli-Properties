import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      {/* HERO / BANNER */}
      <section className="relative overflow-hidden border-b border-[var(--color-border)] bg-[var(--color-header)] text-white">
        <div className="relative z-10 mx-auto flex max-w-[1400px] justify-between px-4 pt-10 pb-10 sm:pt-12 sm:pb-12 md:pt-14 md:pb-20">
          {/* LEFT TEXT */}
          <div className="max-w-xl space-y-3">
            <p className="text-sm uppercase tracking-[0.35em] text-white/90">
              SANGLI PROPERTIES LLP
            </p>

            <h1 className="text-3xl sm:text-3xl font-semibold">About Us</h1>

            <nav className="text-xs text-white/80">
              <Link href="/" className="hover:underline">Home</Link>
              <span className="mx-1">/</span>
              <span>About Us</span>
            </nav>
          </div>
        </div>

        {/* About us ADS */}
        <div className="absolute top-[5px] bottom-[5px] left-[370px] right-[20px] hidden md:flex items-center justify-end gap-4 overflow-hidden">

          <img
            src="/AboutUs1.png"
            alt="About Us Advertisement 1"
            className="h-full w-[26%] -translate-y-[-3px] rounded-xl object-contain object-center"
          />

          <img
            src="/AboutUs2.png"
            alt="About Us Advertisement 2"
            className="h-full w-[32%] -translate-y-[-2px] rounded-xl object-cover object-center"
          />
        </div>
      </section>


      {/* ===================== MAIN CONTENT ======================== */}
      <section className="mx-auto max-w-[1400px] px-4 py-10 sm:py-12">
        {/* Section heading */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-xl font-semibold tracking-wide text-[var(--color-header)]">
            ABOUT US
          </h2>
          <div className="mt-3 mx-auto h-[2px] w-16 rounded-full bg-[var(--color-accent)]" />

          <p className="mt-5 text-sm leading-relaxed text-[var(--color-muted)]">

          </p>
        </div>


        {/* ========= INTRO SECTION ========= */}
        <div className="mt-10 grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.05fr_1fr] xl:gap-14">

          {/* Left Image */}
          <div className="w-full">
            <Image
              src="/about_us_image.jpg"
              width={700}
              height={460}
              alt="About Sangli Properties"
              className="w-full rounded-xl shadow-md object-cover"
            />
          </div>

          {/* Right Text */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Welcome to SANGLI PROPERTIES</h2>

            <p className="text-[var(--color-muted)] leading-relaxed mb-4">
              A property is the core of every home and business. It is an asset, worth the investment.
              At Sangli Properties, we guide you to make the right choice when it comes to selecting
              your place of residence or work. For a house worth to call home and a business address
              where your dream thrives, Sangli Properties is here for you.
            </p>

            <p className="text-[var(--color-muted)] leading-relaxed">
              With a rich experience of 15+ years, builders trust our name to market their properties,
              and buyers believe that we will select and deliver the perfect abode for them.
            </p>
          </div>
        </div>



        {/* ========= WHO DO WE WORK WITH SECTION ========= */}
        <h2 className="text-xl font-semibold mt-20 mb-8">Who do we work with?</h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">

          {/* BUYERS */}
          <div className="bg-white rounded-xl shadow p-6 border border-[var(--color-border)]">
            <h3 className="font-semibold mb-2">Buyers</h3>
            <p className="text-[var(--color-muted)] text-sm leading-relaxed">
              If you want a hassle-free experience of buying or renting a house or office,
              you have come to the right place.
            </p>
          </div>

          {/* BUILDERS */}
          <div className="bg-white rounded-xl shadow p-6 border border-[var(--color-border)]">
            <h3 className="font-semibold mb-2">Builders</h3>
            <p className="text-[var(--color-muted)] text-sm leading-relaxed">
              Are you sales-numbers driven? We help you sell properties to the
              right customers at the right price — with strategy and smart marketing.
            </p>
          </div>

          {/* PROPERTY OWNER */}
          <div className="bg-white rounded-xl shadow p-6 border border-[var(--color-border)]">
            <h3 className="font-semibold mb-2">Property Owners</h3>
            <p className="text-[var(--color-muted)] text-sm leading-relaxed">
              For owners wanting to sell or rent their place, we are the bridge between
              both parties — bringing trust, transparency, and smooth communication.
            </p>
          </div>

          {/* INVESTORS */}
          <div className="bg-white rounded-xl shadow p-6 border border-[var(--color-border)]">
            <h3 className="font-semibold mb-2">Investors</h3>
            <p className="text-[var(--color-muted)] text-sm leading-relaxed">
              Unsure where to invest? Our clients have trusted us for 15+ years with
              their investments — your success becomes our responsibility.
            </p>
          </div>

        </div>
      </section>


      {/* ================= CTA SECTION (Same as Services Page) ================= */}
      <section className="bg-[var(--color-accent)] text-white py-12 mt-10">
        <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-4 px-4 md:flex-row md:items-center">

          {/* Left */}
          <div>
            <p className="uppercase text-sm tracking-widest text-white/80">Need Help?</p>
            <h3 className="text-lg font-semibold mt-1">
              Looking to Buy, Sell or Rent Your Property?
            </h3>
            <p className="text-white/80 text-sm mt-1">
              Share your details and we’ll get in touch with a free consultation.
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
