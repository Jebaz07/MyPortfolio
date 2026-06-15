import { NextRequest, NextResponse } from "next/server";
import { safeGetCertifications } from "@/lib/api-helpers";
import { auth } from "@/lib/auth";

export async function GET() {
  return NextResponse.json(await safeGetCertifications());
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    const { prisma } = await import("@/lib/prisma");
    const cert = await prisma.certification.create({
      data: {
        title: body.title,
        issuer: body.issuer,
        description: body.description,
        imageUrl: body.imageUrl,
        pdfUrl: body.pdfUrl,
        verificationUrl: body.verificationUrl,
        issueDate: body.issueDate ? new Date(body.issueDate) : null,
        expiryDate: body.expiryDate ? new Date(body.expiryDate) : null,
        order: body.order ?? 0,
      },
    });
    return NextResponse.json(cert, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Create failed" }, { status: 500 });
  }
}
