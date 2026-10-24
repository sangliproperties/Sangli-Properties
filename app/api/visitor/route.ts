import { NextRequest, NextResponse } from "next/server";
import { sendWebsiteAnalytics } from "@/lib/website-analytics";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const visitorId = body.visitorId;

        if (
            typeof visitorId !== "string" ||
            !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(visitorId)
        ) {
            return NextResponse.json(
                { error: "Invalid visitor ID" },
                { status: 400 }
            );
        }

        const ok = await sendWebsiteAnalytics({
            type: "visit",
            visitorId,
        });

        return NextResponse.json(
            { ok },
            { status: ok ? 200 : 503 }
        );
    } catch {
        return NextResponse.json(
            { error: "Tracking failed" },
            { status: 500 }
        );
    }
}