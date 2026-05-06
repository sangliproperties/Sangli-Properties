import Link from "next/link";

export default function ContactPage() {
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

            <h1 className="text-3xl sm:text-4xl font-semibold">Contact Us</h1>

            <nav className="text-xs text-white/80">
              <Link href="/" className="hover:underline">Home</Link>
              <span className="mx-1">/</span>
              <span>Contact Us</span>
            </nav>
          </div>
        </div>

        {/* FULL-WIDTH SKYLINE AT BOTTOM */}
        <div className="absolute bottom-0 left-85 right-5 ">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/skyline_white2.png"
            alt="Skyline"
            className="w-small object-cover opacity-100 pointer-events-none hidden md:block"
          />
        </div>
      </section>


      {/* ================= MAIN CONTACT LAYOUT ================= */}
      <section className="mx-auto max-w-[1400px] px-4 py-10 sm:py-12">
        {/* Section heading */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-xl font-semibold tracking-wide text-[var(--color-header)]">
            CONTACT US
          </h2>
          <div className="mt-3 mx-auto h-[2px] w-16 rounded-full bg-[var(--color-accent)]" />

          <p className="mt-8 text-sm leading-relaxed text-[var(--color-muted)]">

          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 items-start gap-10 lg:grid-cols-[0.95fr_1.05fr] xl:gap-12">
          {/* ========== LEFT: CONTACT INFO CARDS ========== */}
          <div className="space-y-6">
            {/* Office Address */}
            <div className="flex gap-4 bg-white rounded-xl border border-[var(--color-border)] px-4 py-5 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)] text-xl">
                📍
              </div>
              <div>
                <h3 className="font-semibold mb-1">Office Address</h3>
                <p className="text-sm text-[var(--color-muted)] leading-relaxed">
                  Rajesh Bungalow, Near Federal Bank Of Vishrambag,
                  LIC Colony, Near 100 Ft Road, Vishrambag, Sangli
                </p>
              </div>
            </div>

            {/* Phone Numbers */}
            <div className="flex gap-4 bg-white rounded-xl border border-[var(--color-border)] px-4 py-5 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)] text-xl">
                ☎️
              </div>
              <div>
                <h3 className="font-semibold mb-1">Phone Number</h3>
                <p className="text-sm text-[var(--color-muted)]">
                  Office: +91-7385077033 / 9146636555
                </p>
                <p className="text-sm text-[var(--color-muted)]">
                  Mobile: +91-7385077033 / 9768365555
                </p>
              </div>
            </div>

            {/* Email / Website */}
            <div className="flex gap-4 bg-white rounded-xl border border-[var(--color-border)] px-4 py-5 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)] text-xl">
                ✉️
              </div>
              <div>
                <h3 className="font-semibold mb-1">Email Address</h3>
                <p className="text-sm text-[var(--color-muted)]">
                  rajeshtrunge@gmail.com
                </p>
                {/* <p className="text-sm text-[var(--color-muted)]">
                  http://sangliproperties.com
                </p> */}
              </div>
            </div>
          </div>

          {/* ========== RIGHT: CONTACT FORM ========== */}
          <div className="bg-white rounded-xl border border-[var(--color-border)] px-5 sm:px-6 py-6 shadow-sm">
            <form className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Full Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] bg-[var(--color-card)]"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  10 digit mobile number<span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] bg-[var(--color-card)]"
                  placeholder="Enter your mobile number"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] bg-[var(--color-card)]"
                  placeholder="Enter your email address"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Write message
                </label>
                <textarea
                  rows={5}
                  className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] bg-[var(--color-card)] resize-none"
                  placeholder="Tell us briefly how we can help you"
                />
              </div>

              {/* Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full bg-[var(--color-accent)] px-6 py-2 text-sm font-semibold text-white shadow hover:bg-[#e28c1d]"
                >
                  Contact Us
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* ================= CTA (same style as Services/About) ================= */}
      <section className="bg-[var(--color-accent)] text-white py-12 mt-4">
        <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-4 px-4 md:flex-row md:items-center">
          <div>
            <p className="uppercase text-sm tracking-widest text-white/80">
              Looking To Sell Or Rent Your Property?
            </p>
            <h3 className="text-lg font-semibold mt-1">
              Share your details and we&apos;ll get in touch with a free consultation.
            </h3>
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
