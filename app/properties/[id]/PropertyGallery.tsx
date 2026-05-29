"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export default function PropertyGallery({
    images,
    title,
}: {
    images: string[];
    title: string;
}) {
    const safeImages = useMemo(() => {
        return (images || [])
            .map((x) => (typeof x === "string" ? x.trim() : ""))
            .filter((x) => x.length > 0);
    }, [images]);

    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [zoom, setZoom] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);

    const dragStartRef = useRef({ x: 0, y: 0 });
    const dragOffsetStartRef = useRef({ x: 0, y: 0 });

    const total = safeImages.length;
    const fallback = "/SP Placeholder Image2.png";

    const MAX_VISIBLE_IMAGES = 8;
    const hasMoreImages = total > MAX_VISIBLE_IMAGES;
    const visibleImages = hasMoreImages
        ? safeImages.slice(0, MAX_VISIBLE_IMAGES)
        : safeImages;
    const remainingCount = total - MAX_VISIBLE_IMAGES;


    useEffect(() => {
        if (openIndex !== null) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
            setZoom(1);
            setOffset({ x: 0, y: 0 });
            setIsDragging(false);
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [openIndex]);

    if (total === 0) {
        return (
            <div className="flex h-[220px] items-center justify-center text-sm text-gray-500">
                No images available
            </div>
        );
    }

    const currentSrc =
        openIndex !== null
            ? safeImages[openIndex] || fallback
            : fallback;

    const openViewer = (index: number) => {
        setOpenIndex(index);
        setZoom(1);
        setOffset({ x: 0, y: 0 });
    };

    const closeViewer = () => {
        setOpenIndex(null);
        setZoom(1);
        setOffset({ x: 0, y: 0 });
        setIsDragging(false);
    };

    const prev = () => {
        if (openIndex === null) return;
        setOpenIndex((openIndex - 1 + total) % total);
        setZoom(1);
        setOffset({ x: 0, y: 0 });
        setIsDragging(false);
    };

    const next = () => {
        if (openIndex === null) return;
        setOpenIndex((openIndex + 1) % total);
        setZoom(1);
        setOffset({ x: 0, y: 0 });
        setIsDragging(false);
    };

    const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
        e.preventDefault();

        setZoom((prevZoom) => {
            const nextZoom =
                e.deltaY < 0 ? prevZoom + 0.2 : prevZoom - 0.2;

            const clampedZoom = Math.min(5, Math.max(1, Number(nextZoom.toFixed(2))));

            if (clampedZoom === 1) {
                setOffset({ x: 0, y: 0 });
            }

            return clampedZoom;
        });
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLImageElement>) => {
        if (zoom <= 1) return;

        setIsDragging(true);
        dragStartRef.current = { x: e.clientX, y: e.clientY };
        dragOffsetStartRef.current = { ...offset };
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDragging || zoom <= 1) return;

        const dx = e.clientX - dragStartRef.current.x;
        const dy = e.clientY - dragStartRef.current.y;

        setOffset({
            x: dragOffsetStartRef.current.x + dx,
            y: dragOffsetStartRef.current.y + dy,
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    return (
        <>
            {/* Thumbnail grid */}
            <div className="p-4 md:p-5">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                    {visibleImages.map((src, index) => {
                        const isViewMoreCard = hasMoreImages && index === MAX_VISIBLE_IMAGES - 1;

                        return (
                            <button
                                type="button"
                                key={`${src}-${index}`}
                                onClick={() => openViewer(index)}
                                className="group relative overflow-hidden rounded-[18px] border border-[var(--color-border)] bg-white text-left shadow-sm"
                            >
                                <img
                                    src={src}
                                    alt={`${title} ${index + 1}`}
                                    className={`h-40 w-full object-cover transition duration-300 group-hover:scale-[1.03] md:h-44 ${isViewMoreCard ? "blur-sm brightness-50" : ""
                                        }`}
                                />

                                {isViewMoreCard ? (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                                        <div className="mb-2 rounded-full bg-white/25 p-3 backdrop-blur-sm">
                                            📷
                                        </div>

                                        <span className="text-base font-extrabold">
                                            View More
                                        </span>

                                        <span className="mt-2 rounded-full bg-white/25 px-3 py-1 text-sm font-bold backdrop-blur-sm">
                                            +{remainingCount}
                                        </span>
                                    </div>
                                ) : (
                                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/70 to-transparent p-3">
                                        <span className="text-xs font-semibold text-white">
                                            Image {index + 1}
                                        </span>

                                        <span className="inline-flex items-center gap-1 rounded-md bg-white/95 px-3 py-1.5 text-xs font-semibold text-gray-800 shadow">
                                            View
                                        </span>
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Large image modal */}
            {openIndex !== null ? (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 p-4">
                    <button
                        type="button"
                        onClick={closeViewer}
                        className="absolute right-4 top-4 rounded-full bg-white px-3 py-2 text-sm font-bold text-black shadow hover:bg-gray-100"
                        aria-label="Close viewer"
                    >
                        ✕
                    </button>

                    {total > 1 ? (
                        <>
                            <button
                                type="button"
                                onClick={prev}
                                className="absolute bottom-20 left-6 z-[10001] rounded-full bg-white/95 px-4 py-3 text-xl font-bold text-black shadow hover:bg-white md:bottom-auto md:left-4 md:top-1/2 md:-translate-y-1/2"
                                aria-label="Previous image"
                            >
                                ‹
                            </button>

                            <button
                                type="button"
                                onClick={next}
                                className="absolute bottom-20 right-6 z-[10001] rounded-full bg-white/95 px-4 py-3 text-xl font-bold text-black shadow hover:bg-white md:bottom-auto md:right-4 md:top-1/2 md:-translate-y-1/2"
                                aria-label="Next image"
                            >
                                ›
                            </button>
                        </>
                    ) : null}

                    <div className="absolute left-4 top-4 z-[10001] hidden rounded-md bg-white/90 px-3 py-2 text-xs font-semibold text-black shadow md:block">
                        Scroll mouse wheel to zoom • Zoom: {zoom.toFixed(1)}x
                    </div>

                    <div className="absolute left-1/2 top-4 z-[10001] -translate-x-1/2 rounded-md bg-white/90 px-3 py-2 text-xs font-semibold text-black shadow md:hidden">
                        Swipe or use arrows
                    </div>

                    <div
                        className="flex h-full w-full items-center justify-center overflow-hidden"
                        onWheel={handleWheel}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseLeave}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={currentSrc}
                            alt={`${title} large preview`}
                            className={`max-h-[72vh] max-w-[92vw] select-none object-contain transition-transform duration-150 ease-out md:max-h-[90vh] md:max-w-[90vw] ${zoom > 1 ? (isDragging ? "cursor-grabbing" : "cursor-grab") : ""
                                }`}
                            style={{
                                transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                                transformOrigin: "center center",
                            }}
                            draggable={false}
                            onMouseDown={handleMouseDown}
                        />
                    </div>
                    <div className="pointer-events-none absolute bottom-8 left-1/2 z-[10001] -translate-x-1/2 rounded-full bg-black/75 px-5 py-2 text-sm font-bold text-white shadow-lg">
                        {openIndex + 1} / {total}
                    </div>
                </div>
            ) : null}
        </>
    );
}