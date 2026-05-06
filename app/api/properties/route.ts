import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function slugify(text: string) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}


async function uniqueSlug(base: string) {
    let slug = base;
    let i = 1;

    while (true) {
        const exists = await prisma.property.findUnique({ where: { slug } });
        if (!exists) return slug;
        slug = `${base}-${i++}`;
    }
}

function parsePriceToRupees(input: string): number {
    const raw = (input || "").toString().trim().toLowerCase();

    if (!raw) return 0;

    // Remove commas and ₹ symbol if user enters them
    const cleaned = raw.replace(/,/g, "").replace(/₹/g, "").trim();

    // Examples supported:
    // "2.30 cr", "2.3cr", "2 cr"
    // "75 lakh", "75lakh"
    // "1000000"
    if (cleaned.includes("cr")) {
        const num = parseFloat(cleaned.replace("cr", "").trim());
        return Number.isFinite(num) ? num * 10000000 : NaN;
    }

    if (cleaned.includes("lakh") || cleaned.includes("lac")) {
        const num = parseFloat(cleaned.replace("lakh", "").replace("lac", "").trim());
        return Number.isFinite(num) ? num * 100000 : NaN;
    }

    const num = parseFloat(cleaned);
    return Number.isFinite(num) ? num : NaN;
}

function parseAreaToSqFt(input: string): number {
    const raw = (input || "").toString().trim().toLowerCase();
    if (!raw) return NaN;

    const cleaned = raw.replace(/,/g, "").trim();

    // Examples supported:
    // "3 acre", "3acre"
    // "1200", "1200 sq.ft", "1200 sqft", "1200 sq ft"
    if (cleaned.includes("acre")) {
        const num = parseFloat(cleaned.replace("acre", "").trim());
        return Number.isFinite(num) ? num * 43560 : NaN;
    }

    // If user types sq ft text, just strip it and parse number
    const sqftClean = cleaned
        .replace("sq.ft", "")
        .replace("sqft", "")
        .replace("sq ft", "")
        .trim();

    const num = parseFloat(sqftClean);
    return Number.isFinite(num) ? num : NaN;
}

export async function POST(req: Request) {
    const form = await req.formData();

    // ✅ Read fields from form
    const title = String(form.get("title") || "").trim();
    const description = String(form.get("description") || "").trim();
    const type = String(form.get("type") || "").trim(); // RESIDENTIAL/COMMERCIAL/PLOT/LAND/INDUSTRIAL
    const purpose = String(form.get("purpose") || "").trim(); // BUY/RENT/SELL
    const city = String(form.get("city") || "").trim();
    const locality = String(form.get("locality") || "").trim();
    const address = String(form.get("address") || "").trim() || null;


    const plotAreaSqFtRaw = String(form.get("plotAreaSqFt") || "").trim();
    const plotAreaSqFt = plotAreaSqFtRaw ? Number(plotAreaSqFtRaw) : null;

    const furnishing = String(form.get("furnishing") || "").trim() || null;
    const propertyAge = String(form.get("propertyAge") || "").trim() || null;

    const flatNo = String(form.get("flatNo") || "").trim() || null;
    const buildingName = String(form.get("buildingName") || "").trim() || null;
    const street = String(form.get("street") || "").trim() || null;
    const landmark = String(form.get("landmark") || "").trim() || null;
    const pinCode = String(form.get("pinCode") || "").trim() || null;

    const amenities = String(form.get("amenities") || "").trim() || null;
    const youtubeUrl = String(form.get("youtubeUrl") || "").trim() || null;
    const areaLabel = String(form.get("areaSqFt") || "").trim();
    const priceLabel = String(form.get("price") || "").trim();

    const areaSqFt = parseAreaToSqFt(areaLabel);
    const price = parsePriceToRupees(priceLabel);
    const bhkRaw = String(form.get("bhk") || "").trim();
    const bhk = bhkRaw ? Number(bhkRaw) : null;


    const transaction = String(form.get("transaction") || "RESALE").trim(); // NEW/RESALE
    const status = String(form.get("status") || "ACTIVE").trim(); // ACTIVE/SOLD/RENTED/INACTIVE
    const featured = String(form.get("featured") || "false") === "true";

    // ✅ Image URLs (optional) - user can paste URLs separated by commas
    const imageUrlsRaw = String(form.get("imageUrls") || "").trim();
    const imageUrls = imageUrlsRaw
        ? imageUrlsRaw.split(",").map((s) => s.trim()).filter(Boolean)
        : [];

    // ✅ basic validation
    if (!title || !description || !type || !purpose || !city || !locality) {
        return NextResponse.json(
            { error: "Missing required fields (title, description, type, purpose, city, locality)." },
            { status: 400 }
        );
    }

    if (!Number.isFinite(areaSqFt) || areaSqFt <= 0) {
        return NextResponse.json(
            { error: "Area must be valid (examples: 1200, 1200 sq.ft, 3 acre)." },
            { status: 400 }
        );
    }

    // price can be 0 if you want "Price on request"
    if (!Number.isFinite(price) || price < 0) {
        return NextResponse.json(
            { error: "Price must be valid (examples: 2300000, 75 lakh, 2.3 cr)." },
            { status: 400 }
        );
    }

    const baseSlug = slugify(title);
    const slug = await uniqueSlug(baseSlug);

    // ✅ Create property + images
    const created = await prisma.property.create({
        data: {
            title,
            slug,
            description,
            type: type as any,
            purpose: purpose as any,
            price,
            priceLabel: priceLabel || undefined,

            areaSqFt,
            areaLabel: areaLabel || undefined,
            bhk: bhk ?? undefined,
            city,
            locality,
            address,
            status: status as any,
            transaction: transaction as any,
            featured,
            furnishing: furnishing ?? undefined,
            propertyAge: propertyAge ?? undefined,

            flatNo: flatNo ?? undefined,
            buildingName: buildingName ?? undefined,
            street: street ?? undefined,
            landmark: landmark ?? undefined,
            pinCode: pinCode ?? undefined,

            amenities: amenities ?? undefined,
            youtubeUrl: youtubeUrl ?? undefined,
            images: imageUrls.length
                ? {
                    create: imageUrls.map((url, idx) => ({
                        url,
                        alt: title,
                        sortOrder: idx,
                    })),
                }
                : undefined,
        },
    });

    // ✅ Redirect user to the correct listing page
    let redirectTo = "/properties";

    if (created.type === "RESIDENTIAL") redirectTo = "/properties/residential";
    else if (created.type === "COMMERCIAL") redirectTo = "/properties/commercial";
    else if (created.type === "INDUSTRIAL") redirectTo = "/properties/industrial";
    else if (created.type === "PLOT" || created.type === "LAND") redirectTo = "/properties/land";

    return NextResponse.redirect(new URL(redirectTo, req.url));
}
