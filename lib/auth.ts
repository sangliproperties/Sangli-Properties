import crypto from "crypto";

export function getUserIdFromCookie(cookieValue?: string | null) {
    if (!cookieValue) return null;

    const secret = process.env.AUTH_SECRET || "dev_secret";
    const parts = cookieValue.split(".");
    if (parts.length !== 2) return null;

    const [value, sig] = parts;
    const expected = crypto.createHmac("sha256", secret).update(value).digest("hex");

    if (sig !== expected) return null;

    const id = Number(value);
    return Number.isFinite(id) ? id : null;
}
