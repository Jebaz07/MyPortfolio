import { NextRequest, NextResponse } from "next/server";
import { safeGetSettings } from "@/lib/api-helpers";
import { auth } from "@/lib/auth";

export async function GET() {
  return NextResponse.json(await safeGetSettings());
}

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    const { prisma } = await import("@/lib/prisma");
    let settings = await prisma.siteSettings.findUnique({ where: { id: "default" } });
    if (!settings) {
      settings = await prisma.siteSettings.create({ data: { id: "default", ...body } });
    } else {
      settings = await prisma.siteSettings.update({ where: { id: "default" }, data: body });
    }
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
