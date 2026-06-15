import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { page } = body;
    if (!page) return NextResponse.json({ error: "Page required" }, { status: 400 });
    const { prisma } = await import("@/lib/prisma");
    const existing = await prisma.analytics.findFirst({
      where: { page, date: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } },
    });
    if (existing) {
      await prisma.analytics.update({ where: { id: existing.id }, data: { visits: existing.visits + 1 } });
    } else {
      await prisma.analytics.create({ data: { page } });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: true });
  }
}

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { prisma } = await import("@/lib/prisma");
    const analytics = await prisma.analytics.findMany({ orderBy: { date: "desc" } });
    return NextResponse.json(analytics);
  } catch {
    return NextResponse.json([]);
  }
}
