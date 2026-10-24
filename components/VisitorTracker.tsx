"use client";

import { useEffect } from "react";

export default function VisitorTracker() {
    useEffect(() => {
        const storageKey = "sp_visitor_id";

        let visitorId: string;

        try {
            visitorId = localStorage.getItem(storageKey) || "";

            if (!visitorId) {
                visitorId = crypto.randomUUID();
                localStorage.setItem(storageKey, visitorId);
            }
        } catch {
            // Storage may be blocked by the browser.
            return;
        }

        const track = () => {
            fetch("/api/visitor", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ visitorId }),
                keepalive: true,
            }).catch(() => { });
        };

        track();

        // Recheck when a previously open tab becomes active.
        const onVisible = () => {
            if (document.visibilityState === "visible") {
                track();
            }
        };

        document.addEventListener("visibilitychange", onVisible);

        return () => {
            document.removeEventListener(
                "visibilitychange",
                onVisible
            );
        };
    }, []);

    return null;
}