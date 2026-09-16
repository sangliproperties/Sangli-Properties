import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromCookie } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

export async function GET(req: NextRequest) {
  logger.step("Auth status check started");
  const cookie = req.cookies.get("sp_user")?.value;
  const userId = getUserIdFromCookie(cookie);

  if (!userId) {
    return NextResponse.json({ loggedIn: false });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { fullName: true },
  });

  return NextResponse.json({
    loggedIn: true,
    fullName: user?.fullName ?? null,
  });
}