import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        if (!body.customerName?.trim()) {
            return NextResponse.json(
                { message: "Customer name is required" },
                { status: 400 }
            );
        }

        if (!/^\d{10}$/.test(String(body.mobileNo || "").trim())) {
            return NextResponse.json(
                { message: "Valid mobile number is required" },
                { status: 400 }
            );
        }

        const crmBaseUrl = process.env.CRM_BASE_URL;
        if (!crmBaseUrl) {
            return NextResponse.json(
                { message: "CRM_BASE_URL missing in environment variables" },
                { status: 500 }
            );
        }

        const crmRes = await fetch(
            `${crmBaseUrl.replace(/\/$/, "")}/api/website-leads`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
                cache: "no-store",
            }
        );

        const contentType = crmRes.headers.get("content-type") || "application/json";
        const text = await crmRes.text();

        return new NextResponse(text, {
            status: crmRes.status,
            headers: {
                "Content-Type": contentType,
            },
        });
    } catch (error) {
        console.error("Website lead submit error:", error);

        return NextResponse.json(
            { message: "Failed to submit website lead" },
            { status: 500 }
        );
    }
}