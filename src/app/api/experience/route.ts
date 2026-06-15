import { NextRequest, NextResponse } from "next/server";
import { safeGetExperience } from "@/lib/api-helpers";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || undefined;
  return NextResponse.json(await safeGetExperience(type));
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    const { prisma } = await import("@/lib/prisma");
    const entry = await prisma.experience.create({
      data: {
        company: body.company,
        role: body.role,
        description: body.description,
        startDate: new Date(body.startDate),
        endDate: body.endDate ? new Date(body.endDate) : null,
        current: body.current ?? false,
        type: body.type ?? "work",
        location: body.location,
        order: body.order ?? 0,
      },
    });
    return NextResponse.json(entry, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Create failed" }, { status: 500 });
  }
}
