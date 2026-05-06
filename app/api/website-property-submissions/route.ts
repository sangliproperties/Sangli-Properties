import { NextRequest, NextResponse } from "next/server";

const CRM_BASE_URL = process.env.CRM_BASE_URL;

function getString(formData: FormData, key: string): string {
    const value = formData.get(key);
    return typeof value === "string" ? value.trim() : "";
}

function redirectWithMessage(
    request: NextRequest,
    type: "success" | "error",
    message: string
) {
    const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
    const protocol = request.headers.get("x-forwarded-proto") || "http";

    const url = new URL(`${protocol}://${host}/submit-property`);
    url.searchParams.set(type, message);

    return NextResponse.redirect(url, 303);
}

export async function POST(request: NextRequest) {
    try {
        if (!CRM_BASE_URL) {
            return redirectWithMessage(
                request,
                "error",
                "CRM base URL is not configured."
            );
        }

        const formData = await request.formData();

        const payload = {
            title: getString(formData, "title"),
            locationAddress: getString(formData, "locationAddress"),
            googleLocationLink: getString(formData, "googleLocationLink"),
            price: getString(formData, "price"),
            apartmentName: getString(formData, "apartmentName"),

            areaSqft: getString(formData, "areaSqft"),
            builtUpAreaSqft: getString(formData, "builtUpAreaSqft"),
            carpetArea: getString(formData, "carpetArea"),
            totalFloor: getString(formData, "totalFloor"),
            floor: getString(formData, "floor"),
            propertyFacing: getString(formData, "propertyFacing"),

            bedrooms: getString(formData, "bedrooms"),
            bathrooms: getString(formData, "bathrooms"),
            balconies: getString(formData, "balconies"),
            halls: getString(formData, "halls"),

            propertyCategory: getString(formData, "propertyCategory"),
            transactionType: getString(formData, "transactionType"),
            constructionYear: getString(formData, "constructionYear"),
            lift: getString(formData, "lift"),
            parking: getString(formData, "parking"),
            furnishingStatus: getString(formData, "furnishingStatus"),

            ownerName: getString(formData, "ownerName"),
            ownerPhone: getString(formData, "ownerPhone"),
            description: getString(formData, "description"),

            source: "Website Submit Property",
        };

        const requiredFields: Array<keyof typeof payload> = [
            "title",
            "locationAddress",
            "price",
            "areaSqft",
            "transactionType",
            "ownerName",
            "ownerPhone",
        ];

        for (const field of requiredFields) {
            if (!payload[field]) {
                return redirectWithMessage(
                    request,
                    "error",
                    `Missing required field: ${field}`
                );
            }
        }

        const allowedTransactionTypes = ["Sell", "Rent"];
        if (!allowedTransactionTypes.includes(payload.transactionType)) {
            return redirectWithMessage(
                request,
                "error",
                "Invalid transaction type."
            );
        }

        const allowedPropertyFacing = [
            "",
            "East",
            "West",
            "South",
            "North",
            "North-East",
            "North-West",
            "South-East",
            "South-West",
        ];

        if (!allowedPropertyFacing.includes(payload.propertyFacing)) {
            return redirectWithMessage(
                request,
                "error",
                "Invalid property facing value."
            );
        }

        const allowedPropertyCategories = [
            "",
            "Residential",
            "Commercial",
            "Land/Plot",
            "Industrial",
        ];

        if (!allowedPropertyCategories.includes(payload.propertyCategory)) {
            return redirectWithMessage(
                request,
                "error",
                "Invalid property category value."
            );
        }

        const allowedLiftValues = ["", "Available", "Not Available"];
        if (!allowedLiftValues.includes(payload.lift)) {
            return redirectWithMessage(request, "error", "Invalid lift value.");
        }

        const allowedParkingValues = [
            "",
            "2 Wheeler",
            "4 Wheeler",
            "Common Parking",
            "Not Available",
        ];

        if (!allowedParkingValues.includes(payload.parking)) {
            return redirectWithMessage(request, "error", "Invalid parking value.");
        }

        const allowedFurnishingValues = [
            "",
            "Furnished",
            "Semi-furnished",
            "Unfurnished",
        ];

        if (!allowedFurnishingValues.includes(payload.furnishingStatus)) {
            return redirectWithMessage(
                request,
                "error",
                "Invalid furnishing status value."
            );
        }

        const crmResponse = await fetch(
            `${CRM_BASE_URL.replace(/\/$/, "")}/api/website-property-submissions`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
                cache: "no-store",
            }
        );

        if (!crmResponse.ok) {
            let errorMessage = "Failed to submit property to CRM.";

            try {
                const errorData = await crmResponse.json();
                errorMessage =
                    errorData?.message ||
                    errorData?.error ||
                    errorData?.details ||
                    errorMessage;
            } catch {
                // keep default message
            }

            return redirectWithMessage(request, "error", errorMessage);
        }

        return redirectWithMessage(
            request,
            "success",
            "Property submitted successfully."
        );
    } catch (error) {
        console.error("Website property submission error:", error);

        return redirectWithMessage(
            request,
            "error",
            "Something went wrong while submitting property."
        );
    }
}