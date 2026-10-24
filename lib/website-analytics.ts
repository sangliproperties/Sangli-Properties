type AnalyticsEvent =
    | {
        type: "visit";
        visitorId: string;
    }
    | {
        type: "login";
        userId: number;
        fullName: string;
        phone: string;
    };

export async function sendWebsiteAnalytics(
    event: AnalyticsEvent
): Promise<boolean> {
    const baseUrl = process.env.CRM_BASE_URL;
    const secret = process.env.WEBSITE_ANALYTICS_SECRET;

    if (!baseUrl || !secret) {
        console.error("Website analytics configuration missing");
        return false;
    }

    try {
        const response = await fetch(
            `${baseUrl.replace(/\/$/, "")}/api/website-analytics/events`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-analytics-secret": secret,
                },
                body: JSON.stringify(event),
                cache: "no-store",
                signal: AbortSignal.timeout(5000),
            }
        );

        if (!response.ok) {
            console.error("Analytics API returned", response.status);
        }

        return response.ok;
    } catch (error) {
        console.error("Analytics delivery failed", error);
        return false;
    }
}