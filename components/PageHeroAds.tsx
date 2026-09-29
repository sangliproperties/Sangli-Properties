// components/PageHeroAds.tsx
export type HeroAdImage = {
    src: string;
    alt: string;
};

/**
 * Banner advertisement images shown beside the page-hero text.
 *
 * Each ad is rendered at its natural aspect ratio with `object-contain` +
 * `w-auto`, so the FULL image is always visible — never cropped, squished or
 * shrunk away — and scales smoothly when the browser window is resized or
 * minimised on any screen size. `shrink-0` stops flex layout from compressing
 * them.
 */
export default function PageHeroAds({ images }: { images: HeroAdImage[] }) {
    return (
        <div className="hidden shrink-0 items-center justify-center gap-3 md:flex md:justify-end 2xl:gap-5">
            {images.map((img) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    key={img.src}
                    src={img.src}
                    alt={img.alt}
                    className="h-10 w-auto rounded-xl object-contain shadow-md transition-all duration-200 sm:h-20 md:h-50 xl:h-54 2xl:h-70"
                />
            ))}
        </div>
    );
}