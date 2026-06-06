export default function FacebookLatestPostsSection() {
    const facebookPageUrl = "https://www.facebook.com/sangliproperties/";

    return (
        <section className="border-t border-[var(--color-border)] bg-[var(--color-bg)]">
            <div className="mx-auto max-w-[1400px] px-4 py-12">
                <div className="text-center">
                    <p className="text-[20px] font-semibold tracking-[0.25em] uppercase text-[var(--color-accent)]">
                        OUR LATEST POSTS
                    </p>

                    <h2 className="mt-4 text-[16px] font-semibold text-[var(--color-header)]">
                        Follow our latest Facebook updates
                    </h2>
                </div>

                <div className="mt-10 grid gap-6 lg:grid-cols-[560px_1fr]">
                    {/* Left: Facebook Timeline */}
                    <div className="overflow-hidden rounded-[24px] border border-[var(--color-border)] bg-white p-4 shadow-[0_18px_40px_rgba(15,23,42,0.14)]">
                        <div className="mb-4 border-b border-[var(--color-border)] pb-4">
                            <h3 className="mt-4 text-2xl font-semibold leading-tight text-[var(--color-header)]">
                                Sangli Properties LLP
                            </h3>
                            <p className="mt-1 text-sm text-[var(--color-muted)]">
                                Latest updates from our Facebook page
                            </p>
                        </div>
                        <div className="flex h-[430px] justify-center overflow-hidden sm:hidden">
                            <iframe
                                title="Sangli Properties Facebook Posts Mobile"
                                src={`https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(
                                    facebookPageUrl
                                )}&tabs=timeline&width=340&height=520&small_header=true&adapt_container_width=true&hide_cover=true&show_facepile=false`}
                                width="340"
                                height="520"
                                style={{
                                    border: "none",
                                    overflow: "hidden",
                                    width: "100%",
                                    maxWidth: "340px",
                                    transform: "translateY(-90px)",
                                }}
                                scrolling="no"
                                frameBorder="0"
                                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                                allowFullScreen
                            />
                        </div>

                        <div className="hidden h-[560px] justify-center overflow-hidden sm:flex">
                            <iframe
                                title="Sangli Properties Facebook Posts Desktop"
                                src={`https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(
                                    facebookPageUrl
                                )}&tabs=timeline&width=500&height=650&small_header=true&adapt_container_width=true&hide_cover=true&show_facepile=false`}
                                width="500"
                                height="650"
                                style={{
                                    border: "none",
                                    overflow: "hidden",
                                    width: "100%",
                                    maxWidth: "500px",
                                    transform: "translateY(-90px)",
                                }}
                                scrolling="no"
                                frameBorder="0"
                                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                                allowFullScreen
                            />
                        </div>
                    </div>

                    {/* Right: Branded CTA / Highlights */}
                    <div className="hidden rounded-[24px] border border-[var(--color-border)] bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.10)] sm:p-8 lg:block">
                        <p className="text-sm font-semibold tracking-[0.25em] uppercase text-[var(--color-accent)]">
                            Sangli Properties LLP
                        </p>

                        <h3 className="mt-4 text-2xl font-semibold leading-tight text-[var(--color-header)]">
                            Stay updated with our latest property posts.
                        </h3>

                        <p className="mt-4 text-sm leading-6 text-[var(--color-muted)]">
                            Follow our Facebook page for new property updates, sale and rent listings,
                            project highlights, local property news, and latest offers in Sangli and Miraj.
                        </p>

                        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {[
                                ["Latest Listings", "New flats, bungalows, shops, plots and commercial properties."],
                                ["Verified Updates", "Direct updates from Sangli Properties official Facebook page."],
                                ["Property Offers", "Follow for budget-friendly and premium property opportunities."],
                                ["Local Market", "Updates focused on Sangli, Miraj and nearby locations."],
                                ["Sale & Rent", "Regular updates for both buying, selling and rental properties."],
                                ["New Projects", "Stay informed about upcoming residential and commercial projects."],
                                ["Documentation Help", "Guidance for clear titles, loan process and registration support."],
                                ["Prime Locations", "Properties from Vishrambag, Madhavnagar, Miraj and nearby areas."],
                                ["Customer Support", "Get quick assistance for property enquiries and site visits."],
                            ].map(([title, desc]) => (
                                <div key={title} className="rounded-2xl bg-[var(--color-bg)] p-4">
                                    <p className="text-base font-bold text-[var(--color-header)]">{title}</p>
                                    <p className="mt-1 text-sm text-[var(--color-muted)]">{desc}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 flex flex-wrap gap-3">
                            <a
                                href={facebookPageUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center rounded-full bg-[var(--color-accent)] px-6 py-2.5 text-sm font-semibold text-white shadow hover:bg-[#e28c1d]"
                            >
                                Visit our Facebook Page
                            </a>

                            <a
                                href="/properties"
                                className="inline-flex items-center rounded-full border border-[var(--color-border)] bg-white px-6 py-2.5 text-sm font-semibold text-[var(--color-header)] shadow hover:bg-[var(--color-bg)]"
                            >
                                View Properties
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}