"use client";

import { useState } from "react";
import type { YouTubeItem } from "@/lib/youtube";

export default function YouTubeLatestGridClient({
    items,
}: {
    items: YouTubeItem[];
}) {
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    let hoverTimer: any;

    return (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((v, idx) => {
                const isHover = hoveredId === v.videoId && !!v.videoId;

                // autoplay muted preview on hover
                const isShort =
                    v.videoUrl.includes("/shorts/") ||
                    v.title.toLowerCase().includes("#shorts") ||
                    v.title.toLowerCase().includes("shorts");

                const embedUrl = v.videoId
                    ? isShort
                        // Shorts-friendly embed
                        ? `https://www.youtube.com/embed/${v.videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${v.videoId}&modestbranding=1&rel=0&playsinline=1`
                        // Normal videos
                        : `https://www.youtube.com/embed/${v.videoId}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&playsinline=1`
                    : "";
                return (
                    <a
                        key={`${v.videoId}-${idx}`}
                        href={v.videoUrl}                 // ✅ opens the exact video
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group overflow-hidden rounded-[20px] border border-[var(--color-border)]/80 bg-white shadow-[0_14px_30px_rgba(15,23,42,0.12)]"
                        onMouseEnter={() => {
                            clearTimeout(hoverTimer);
                            hoverTimer = setTimeout(() => setHoveredId(v.videoId), 250);
                        }}
                        onMouseLeave={() => {
                            clearTimeout(hoverTimer);
                            setHoveredId(null);
                        }}
                        title="Open on YouTube"
                    >
                        {/* Preview area */}
                        <div className="relative h-44 w-full bg-black">
                            {isHover ? (
                                <iframe
                                    key={v.videoId}                 // ✅ forces reload on hover
                                    className="h-full w-full"
                                    src={embedUrl}
                                    title={v.title}
                                    allow="autoplay; encrypted-media; picture-in-picture"
                                    allowFullScreen
                                />
                            ) : (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={v.thumbnailUrl}
                                    alt={v.title}
                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                                    loading="lazy"
                                />
                            )}

                            {/* small play badge (optional) */}
                            <div className="absolute bottom-2 right-2 rounded-lg bg-black/60 px-2 py-1 text-xs font-semibold text-white">
                                ▶
                            </div>
                        </div>

                        {/* Text */}
                        <div className="p-4">
                            <div className="line-clamp-2 text-sm font-semibold text-[var(--color-header)]">
                                {v.title}
                            </div>

                            <div className="mt-2 flex items-center justify-between text-xs text-[var(--color-muted)]">
                                <span>Latest upload</span>
                                <span className="font-semibold text-[var(--color-accent)] group-hover:brightness-125">
                                    Watch on YouTube
                                </span>
                            </div>
                        </div>
                    </a>
                );
            })}
        </div>
    );
}
