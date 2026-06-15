import { NextRequest, NextResponse } from "next/server";
import { safeGetSkills } from "@/lib/api-helpers";
import { auth } from "@/lib/auth";

export async function GET() {
  return NextResponse.json(await safeGetSkills());
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    const { prisma } = await import("@/lib/prisma");
    const category = await prisma.skillCategory.create({ data: { name: body.name, order: body.order ?? 0 } });
    return NextResponse.json(category, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Create failed" }, { status: 500 });
  }
}
