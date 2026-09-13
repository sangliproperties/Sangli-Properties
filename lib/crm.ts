// lib/crm.ts

export type CrmWebsiteProperty = {
    id: string;
    codeNo?: string | null;
    title: string;
    location: string;
    googleMapLink?: string | null;
    latitude?: string | number | null;
    longitude?: string | number | null;
    price?: string | number | null;
    area?: string | number | null;
    builtUpArea?: string | number | null;
    carpetArea?: string | number | null;
    floor?: string | null;
    totalFloor?: string | null;
    constructionYear?: string | null;
    type?: string | null;
    transactionType?: string | null;
    status?: string | null;
    furnishingStatus?: string | null;
    propertyFacing?: string | null;
    bedrooms?: string | null;
    bathrooms?: string | null;
    balconies?: string | null;
    halls?: string | null;
    lift?: string | boolean | null;
    parking?: string | boolean | null;
    caste?: string | null;
    description?: string | null;
    images?: string[] | null;
    ownerName?: string | null;
    ownerPhone?: string | null;
    publishedAt?: string | null;
};

type GetWebsitePropertiesParams = {
    search?: string;
    transactionType?: string;
    status?: string;
    caste?: string;
    apartmentId?: string;
    type?: string;
};

const CRM_BASE_URL = process.env.CRM_BASE_URL?.trim().replace(/\/+$/, "");
const CRM_REQUEST_TIMEOUT_MS = 20_000;

function isCrmEnabled() {
    return !!CRM_BASE_URL;
}

function buildWebsitePropertiesUrl(params?: GetWebsitePropertiesParams): string {
    const baseUrl = CRM_BASE_URL!;
    const qs = new URLSearchParams();

    if (params?.search?.trim()) qs.set("search", params.search.trim());
    if (params?.transactionType?.trim()) qs.set("transactionType", params.transactionType.trim());
    if (params?.status?.trim()) qs.set("status", params.status.trim());
    if (params?.caste?.trim()) qs.set("caste", params.caste.trim());
    if (params?.apartmentId?.trim()) qs.set("apartmentId", params.apartmentId.trim());
    if (params?.type?.trim()) qs.set("type", params.type.trim());

    const query = qs.toString();
    return query
        ? `${baseUrl}/api/website/properties?${query}`
        : `${baseUrl}/api/website/properties`;
}

async function readJsonSafely(res: Response) {
    const contentType = res.headers.get("content-type") || "";
    const text = await res.text();

    if (!res.ok) {
        throw new Error(`CRM request failed (${res.status}): ${text}`);
    }

    if (!contentType.includes("application/json")) {
        throw new Error(
            `CRM did not return JSON. Content-Type: ${contentType}. Response starts with: ${text.slice(0, 200)}`
        );
    }

    try {
        return JSON.parse(text);
    } catch {
        throw new Error(`Failed to parse CRM JSON response: ${text.slice(0, 200)}`);
    }
}

export async function getWebsiteProperties(
    params?: GetWebsitePropertiesParams,
): Promise<CrmWebsiteProperty[]> {
    if (!isCrmEnabled()) {
        return [];
    }

    try {
        const url = buildWebsitePropertiesUrl(params);

        const typeTag =
            params?.type?.trim()
                ? `crm-properties-type-${params.type.trim().toLowerCase()}`
                : "crm-properties-all";

        const res = await fetch(url, {
            method: "GET",
            signal: AbortSignal.timeout(CRM_REQUEST_TIMEOUT_MS),
            next: {
                revalidate: 60,
                tags: ["crm-properties", typeTag],
            },
            headers: {
                Accept: "application/json",
            },
        });

        const data = await readJsonSafely(res);

        if (!Array.isArray(data)) {
            return [];
        }

        return data as CrmWebsiteProperty[];
    } catch (error) {
        console.error("CRM properties unavailable:", error);
        return [];
    }
}

export async function getWebsiteProperty(
    id: string,
): Promise<CrmWebsiteProperty | null> {
    if (!isCrmEnabled()) {
        return null;
    }

    try {
        const cleanId = String(id || "").trim();
        if (!cleanId) return null;

        const url = `${CRM_BASE_URL}/api/website/properties/${encodeURIComponent(cleanId)}`;

        const res = await fetch(url, {
            method: "GET",
            signal: AbortSignal.timeout(CRM_REQUEST_TIMEOUT_MS),
            next: { revalidate: 60, tags: [`crm-property-${cleanId}`] },
            headers: {
                Accept: "application/json",
            },
        });

        if (res.status === 404) {
            return null;
        }

        const data = await readJsonSafely(res);
        return data as CrmWebsiteProperty;
    } catch (error) {
        console.error("CRM property unavailable:", error);
        return null;
    }
}