
export type WebsiteAd = {
    id: number;
    title: string;
    placement: "landscape" | "portrait";
    imageUrl: string;
    displayOrder: number;
};

export async function getWebsiteAds(): Promise<WebsiteAd[]> {
    const baseUrl = process.env.CRM_BASE_URL
        ?.trim()
        .replace(/\/+$/, "");

    if (!baseUrl) {
        return [];
    }

    try {
        const response = await fetch(
            `${baseUrl}/api/website/ads`,
            {
                next: {
                    revalidate: 60,
                    tags: ["crm-website-ads"],
                },
                signal: AbortSignal.timeout(10000),
            }
        );

        if (!response.ok) {
            throw new Error(
                `Ads API failed: ${response.status}`
            );
        }

        const data: unknown = await response.json();

        if (!Array.isArray(data)) {
            return [];
        }


        const validAds = data.filter(
            (item): item is WebsiteAd =>
                item !== null &&
                typeof item === "object" &&
                typeof item.id === "number" &&
                typeof item.title === "string" &&
                typeof item.imageUrl === "string" &&
                typeof item.displayOrder === "number" &&
                (item.placement === "landscape" ||
                    item.placement === "portrait")
        );

        return validAds.map((ad) => ({
            ...ad,
            imageUrl: new URL(ad.imageUrl, `${baseUrl}/`).href,
        }));

    } catch (error) {
        console.error("Website ads fetch failed", error);
        return [];
    }
}
