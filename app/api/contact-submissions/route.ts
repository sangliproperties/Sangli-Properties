import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const crmBaseUrl = process.env.CRM_BASE_URL;
        if (!crmBaseUrl) {
            return NextResponse.json({ message: "CRM_BASE_URL missing" }, { status: 500 });
        }

        const crmRes = await fetch(
            `${crmBaseUrl.replace(/\/$/, "")}/api/contact-submissions`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: body.name,
                    phone: body.phone,
                    email: body.email || "",
                    message: body.message || "",
                }),
                cache: "no-store",
            }
        );

        const text = await crmRes.text();
        return new NextResponse(text, {
            status: crmRes.status,
            headers: { "Content-Type": crmRes.headers.get("content-type") || "application/json" },
        });
    } catch {
        return NextResponse.json({ message: "Failed to submit contact form" }, { status: 500 });
    }
}