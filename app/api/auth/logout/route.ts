import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";

export async function POST() {
    logger.step("Auth logout started");
    const res = NextResponse.json({ ok: true });

    // delete cookie
    res.cookies.set("sp_user", "", {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 0,
    });

    logger.step("Auth logout completed");
    return res;
}
