"use client";

import Link from "next/link";
import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!form.name.trim()) {
      setError("Full name is required");
      return;
    }

    if (!/^\d{10}$/.test(form.phone.trim())) {
      setError("Enter valid 10 digit mobile number");
      return;
    }

    if (!form.email.trim()) {
      setError("Email is required");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError("Enter valid email address");
      return;
    }

    if (!form.message.trim()) {
      setError("Message is required");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/contact-submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        setError("Failed to submit enquiry");
        return;
      }

      setSuccess("Thank you. We will contact you soon.");

      setTimeout(() => {
        setSuccess("");
      }, 5000);

      setForm({
        name: "",
        phone: "",
        email: "",
        message: "",
      });
    } catch {
      setError("Failed to submit enquiry");
    } finally {
      setLoading(false);
    }
  };

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

            <h1 className="text-3xl sm:text-3xl font-semibold">Contact Us</h1>

            <nav className="text-xs text-white/80">
              <Link href="/" className="hover:underline">Home</Link>
              <span className="mx-1">/</span>
              <span>Contact Us</span>
            </nav>
          </div>
        </div>

        {/* Contact Us ADS */}
        <div className="absolute top-[5px] bottom-[5px] left-[370px] right-[20px] hidden md:flex items-center justify-end gap-2 overflow-hidden">

          <img
            src="/ContactUs1.png"
            alt="Contact Us Advertisement 1"
            className="h-full w-[29%] -translate-y-[-3px] rounded-xl object-contain object-center"
          />
          <img
            src="/AboutUs2.png"
            alt="About Us Advertisement 2"
            className="h-full w-[32%] -translate-y-[-2px] rounded-xl object-cover object-center"
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
                  Rajesh Bungalow,LIC Colony, In Front Of ESAF Bank,
                  100 Feet Road, Vishrambag, Sangli. 416415
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
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Full Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
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
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                  className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] bg-[var(--color-card)]"
                  placeholder="Enter your mobile number"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Email<span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] bg-[var(--color-card)]"
                  placeholder="Enter your email address"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Write message<span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] bg-[var(--color-card)] resize-none"
                  placeholder="Tell us briefly how we can help you"
                />
              </div>

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 shadow-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700 shadow-sm">
                  ✅ {success}
                </div>
              )}

              {/* Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded-full bg-[var(--color-accent)] px-6 py-2 text-sm font-semibold text-white shadow hover:bg-[#e28c1d] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* ================= FIND US HERE / GOOGLE MAP ================= */}
      <section className="mx-auto max-w-[1400px] px-4 pb-12">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-semibold tracking-wide text-[var(--color-header)]">
            Find Us Here
          </h2>
          <div className="mt-3 mx-auto h-[2px] w-16 rounded-full bg-[var(--color-accent)]" />
          <p className="mt-3 text-sm sm:text-base text-[var(--color-muted)]">
            Visit our office for a cup of coffee and discuss your property needs.
          </p>
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white shadow-xl">
          <iframe
            title="Sangli Properties LLP Office Location"
            src="https://www.google.com/maps?q=Sangli%20Properties%20LLP%2C%20Rajesh%20Bungalow%2C%20100%20Feet%20Road%2C%20Vishrambag%2C%20Sangli%2C%20Maharashtra%20416415&output=embed"
            className="h-[360px] w-full sm:h-[420px] lg:h-[450px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </section>
    </main>
  );
}
