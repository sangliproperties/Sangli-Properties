import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

function sign(value: string) {
  const secret = process.env.AUTH_SECRET || "dev_secret";
  const sig = crypto.createHmac("sha256", secret).update(value).digest("hex");
  return `${value}.${sig}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const fullName = String(body.fullName || "").trim();
    const phone = String(body.phone || "").trim();

    if (!fullName) {
      return NextResponse.json({ error: "Full Name is required" }, { status: 400 });
    }
    if (!phone || phone.length < 10) {
      return NextResponse.json({ error: "Valid Phone Number is required" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { phone } });

    let user;
    if (existing) {
      if (existing.fullName.trim().toLowerCase() !== fullName.toLowerCase()) {
        return NextResponse.json(
          { error: "Name does not match this phone number. Please enter correct name." },
          { status: 400 }
        );
      }
      user = existing;
    } else {
      user = await prisma.user.create({
        data: { fullName, phone },
      });
    }

    const res = NextResponse.json({ ok: true, user });
    res.cookies.set("sp_user", sign(String(user.id)), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return res;
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
