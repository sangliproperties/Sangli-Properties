export type YouTubeItem = {
    title: string;
    videoUrl: string;
    videoId: string;
    thumbnailUrl: string;
    published: string;
};

function pickFirst(text: string, regex: RegExp) {
    const m = text.match(regex);
    return m?.[1]?.trim() ?? "";
}

export function getYouTubeVideoId(url: string) {
    try {
        const u = new URL(url);

        // 1) Normal YouTube watch URL
        const v = u.searchParams.get("v");
        if (v) return v;

        // 2) Shorts URL: /shorts/VIDEO_ID
        const shortsMatch = u.pathname.match(/^\/shorts\/([^/?]+)/);
        if (shortsMatch?.[1]) return shortsMatch[1];

        // 3) youtu.be short URL
        if (u.hostname.includes("youtu.be")) {
            const id = u.pathname.replace("/", "");
            if (id) return id;
        }
    } catch { }

    return "";
}

function decodeXml(s: string) {
    return s
        .replaceAll("&amp;", "&")
        .replaceAll("&lt;", "<")
        .replaceAll("&gt;", ">")
        .replaceAll("&quot;", '"')
        .replaceAll("&#39;", "'");
}

export async function getLatestYouTubeItems(limit = 8): Promise<YouTubeItem[]> {
    const channelId = process.env.YOUTUBE_CHANNEL_ID;
    if (!channelId) return [];

    const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;

    const res = await fetch(feedUrl, {
        // refresh every 1 hour
        next: { revalidate: 3600 },
    });

    if (!res.ok) return [];

    const xml = await res.text();

    const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) ?? [];
    return entries.slice(0, limit).map((entry) => {
        const title = decodeXml(pickFirst(entry, /<title>([\s\S]*?)<\/title>/));
        const videoUrl = pickFirst(entry, /<link[^>]*rel="alternate"[^>]*href="([^"]+)"/);
        const thumbnailUrl = pickFirst(entry, /<media:thumbnail[^>]*url="([^"]+)"/);
        const published = pickFirst(entry, /<published>([\s\S]*?)<\/published>/);

        const videoId = getYouTubeVideoId(videoUrl);

        return { title, videoUrl, videoId, thumbnailUrl, published };
    });
}
