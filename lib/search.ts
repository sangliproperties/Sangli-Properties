export const INVALID_SEARCH_CHARS_REGEX = /[@#*&]/;

export function hasInvalidSearchChars(value: string) {
    return INVALID_SEARCH_CHARS_REGEX.test(value);
}

export function normalizeSearchText(value: unknown) {
    return String(value || "")
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim();
}

export function normalizePropertyCode(value: unknown) {
    return String(value || "")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");
}