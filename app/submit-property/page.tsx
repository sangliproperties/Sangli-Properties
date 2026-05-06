"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function SubmitPropertyPage() {
  const searchParams = useSearchParams();

  const successMessage = searchParams.get("success");
  const errorMessage = searchParams.get("error");

  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <section className="mx-auto max-w-[1400px] px-4 pt-10 pb-4 sm:pt-12">
        <p className="text-xs tracking-[0.35em] uppercase text-[var(--color-muted)]">
          SANGLI PROPERTIES LLP
        </p>

        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <h1 className="text-2xl font-semibold sm:text-3xl lg:text-[2rem]">
            Submit Property
          </h1>

          <nav className="text-xs text-[var(--color-muted)]">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <span className="mx-1">/</span>
            <span>Submit Property</span>
          </nav>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 pb-16">
        {successMessage ? (
          <div className="mb-5 rounded-xl border border-green-300 bg-green-50 px-5 py-4 text-sm font-semibold text-green-700 shadow-sm">
            {successMessage}
          </div>
        ) : null}

        {errorMessage ? (
          <div className="mb-5 rounded-xl border border-red-300 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700 shadow-sm">
            {errorMessage}
          </div>
        ) : null}

        <form
          action="/api/website-property-submissions"
          method="post"
          className="space-y-10 rounded-2xl border border-[var(--color-border)] bg-white px-5 py-6 shadow-sm sm:px-8 sm:py-8 lg:px-10 xl:px-12"
        >
          <div>
            <h2 className="text-sm font-semibold tracking-[0.25em] uppercase text-[var(--color-muted)]">
              Basic Details
            </h2>

            <div className="mt-5 grid gap-5 md:grid-cols-2 xl:gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Property Title<span className="text-red-500">*</span>
                </label>
                <input
                  name="title"
                  required
                  type="text"
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
                  placeholder="Enter property title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Price<span className="text-red-500">*</span>
                </label>
                <input
                  name="price"
                  required
                  type="text"
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
                  placeholder="Enter price"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Location / Address<span className="text-red-500">*</span>
                </label>
                <input
                  name="locationAddress"
                  required
                  type="text"
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
                  placeholder="Enter location or full address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Google Location Link
                </label>
                <input
                  name="googleLocationLink"
                  type="url"
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
                  placeholder="Paste Google Maps link"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Apartment Name
                </label>
                <input
                  name="apartmentName"
                  type="text"
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
                  placeholder="Enter apartment name"
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold tracking-[0.25em] uppercase text-[var(--color-muted)]">
              Area Details
            </h2>

            <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3 xl:gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Area (sqft)<span className="text-red-500">*</span>
                </label>
                <input
                  name="areaSqft"
                  required
                  type="text"
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
                  placeholder="Enter area in sqft"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Built Up Area (sqft)
                </label>
                <input
                  name="builtUpAreaSqft"
                  type="text"
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
                  placeholder="Enter built up area"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Carpet Area
                </label>
                <input
                  name="carpetArea"
                  type="text"
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
                  placeholder="Enter carpet area"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Total Floor
                </label>
                <input
                  name="totalFloor"
                  type="text"
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
                  placeholder="Enter total floor"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Floor</label>
                <input
                  name="floor"
                  type="text"
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
                  placeholder="Enter floor"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Property Facing
                </label>
                <select
                  name="propertyFacing"
                  defaultValue=""
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
                >
                  <option value="">Select</option>
                  <option value="East">East</option>
                  <option value="West">West</option>
                  <option value="South">South</option>
                  <option value="North">North</option>
                  <option value="North-East">North-East</option>
                  <option value="North-West">North-West</option>
                  <option value="South-East">South-East</option>
                  <option value="South-West">South-West</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold tracking-[0.25em] uppercase text-[var(--color-muted)]">
              Room Details
            </h2>

            <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4 xl:gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">
                  No. of Bedroom
                </label>
                <input
                  name="bedrooms"
                  type="text"
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
                  placeholder="Enter bedrooms"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  No. of Bathroom
                </label>
                <input
                  name="bathrooms"
                  type="text"
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
                  placeholder="Enter bathrooms"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  No. of Balcony
                </label>
                <input
                  name="balconies"
                  type="text"
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
                  placeholder="Enter balconies"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  No. of Hall
                </label>
                <input
                  name="halls"
                  type="text"
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
                  placeholder="Enter halls"
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold tracking-[0.25em] uppercase text-[var(--color-muted)]">
              Other Details
            </h2>

            <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3 xl:gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Property Category
                </label>
                <select
                  name="propertyCategory"
                  defaultValue=""
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
                >
                  <option value="">Select</option>
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Land/Plot">Land/Plot</option>
                  <option value="Industrial">Industrial</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Transaction Type<span className="text-red-500">*</span>
                </label>
                <select
                  name="transactionType"
                  required
                  defaultValue=""
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
                >
                  <option value="">Select</option>
                  <option value="Sell">Sell</option>
                  <option value="Rent">Rent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Construction Year
                </label>
                <input
                  name="constructionYear"
                  type="text"
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
                  placeholder="Enter construction year"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Lift</label>
                <select
                  name="lift"
                  defaultValue=""
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
                >
                  <option value="">Select</option>
                  <option value="Available">Available</option>
                  <option value="Not Available">Not Available</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Parking</label>
                <select
                  name="parking"
                  defaultValue=""
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
                >
                  <option value="">Select</option>
                  <option value="2 Wheeler">2 Wheeler</option>
                  <option value="4 Wheeler">4 Wheeler</option>
                  <option value="Common Parking">Common Parking</option>
                  <option value="Not Available">Not Available</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Furnishing Status
                </label>
                <select
                  name="furnishingStatus"
                  defaultValue=""
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
                >
                  <option value="">Select</option>
                  <option value="Furnished">Furnished</option>
                  <option value="Semi-furnished">Semi-furnished</option>
                  <option value="Unfurnished">Unfurnished</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Property Owner Name<span className="text-red-500">*</span>
                </label>
                <input
                  name="ownerName"
                  required
                  type="text"
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
                  placeholder="Enter owner name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Property Owner Phone No.<span className="text-red-500">*</span>
                </label>
                <input
                  name="ownerPhone"
                  required
                  type="text"
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
                  placeholder="Enter owner phone number"
                />
              </div>

              <div className="lg:col-span-3">
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={5}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 text-sm outline-none resize-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
                  placeholder="Enter property description"
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-[var(--color-accent)] px-8 py-2.5 text-sm font-semibold text-white shadow hover:bg-[#e28c1d]"
            >
              Submit
            </button>
          </div>
        </form>
      </section>

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