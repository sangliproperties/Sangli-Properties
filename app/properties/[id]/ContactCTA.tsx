"use client";

import { useState } from "react";
import ContactModal from "@/components/ContactModal";

type ContactCTAProps = {
    propertyId?: string | number;
    propertyTitle?: string;
    propertyCodeNo?: string;
    propertyLocation?: string;
    propertyPrice?: string | number;
    propertyType?: string;
    propertyTransactionType?: string;
    propertyData?: Record<string, any>;
};

export default function ContactCTA({
    propertyId,
    propertyTitle,
    propertyCodeNo,
    propertyLocation,
    propertyPrice,
    propertyType,
    propertyTransactionType,
    propertyData,
}: ContactCTAProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-[var(--color-accent)] px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110 active:scale-[0.99]"
            >
                Contact Us
            </button>

            <ContactModal
                open={open}
                onClose={() => setOpen(false)}
                propertyId={propertyId}
                propertyTitle={propertyTitle}
                propertyCodeNo={propertyCodeNo}
                propertyLocation={propertyLocation}
                propertyPrice={propertyPrice}
                propertyType={propertyType}
                propertyTransactionType={propertyTransactionType}
                propertyData={propertyData}
            />
        </>
    );
}