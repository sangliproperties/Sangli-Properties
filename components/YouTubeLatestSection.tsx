import { getLatestYouTubeItems } from "@/lib/youtube";
import YouTubeLatestGridClient from "@/components/YouTubeLatestGridClient";

export default async function YouTubeLatestSection() {
    const items = await getLatestYouTubeItems(8);
    const channelUrl = process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_URL || "https://www.youtube.com";

    if (items.length === 0) return null;

    return (
        <section className="border-t border-[var(--color-border)] bg-[var(--color-card)]">
            <div className="w-full px-4 py-10">
                <div className="text-center">
                    <p className="text-[20px] font-semibold tracking-[0.25em] uppercase text-[var(--color-accent)]">
                        OUR LATEST VIDEOS
                    </p>
                    <h2 className="mt-4 text-[16px] font-semibold text-[var(--color-header)]">
                        Latest videos & shorts from Sangli Properties LLP
                    </h2>
                </div>

                <YouTubeLatestGridClient items={items} />

                <div className="mt-8 flex justify-center">
                    <a
                        href={channelUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center rounded-md bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
                    >
                        Visit our YouTube Channel
                    </a>
                </div>
            </div>
        </section>
    );
}
