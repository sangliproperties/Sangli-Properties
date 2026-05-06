import { NextResponse } from "next/server";

export async function POST() {
    const res = NextResponse.json({ ok: true });

    // delete cookie
    res.cookies.set("sp_user", "", {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 0,
    });

    return res;
}
