import { NextRequest, NextResponse } from "next/server";
import { safeGetSkills } from "@/lib/api-helpers";
import { auth } from "@/lib/auth";

export async function GET() {
  const skills = await safeGetSkills();
  return NextResponse.json(skills);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    const { prisma } = await import("@/lib/prisma");
    const skill = await prisma.skill.create({ data: { name: body.name, level: body.level ?? 50, icon: body.icon, categoryId: body.categoryId, order: body.order ?? 0 } });
    return NextResponse.json(skill, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Create failed" }, { status: 500 });
  }
}
