import { NextRequest, NextResponse } from "next/server";
import { safeGetProjectBySlug, safeGetProjectById } from "@/lib/api-helpers";
import { auth } from "@/lib/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    let project = await safeGetProjectBySlug(id);
    if (!project) project = await safeGetProjectById(id);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    return NextResponse.json(project);
  } catch {
    console.error("Error fetching project");
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await params;
    const body = await request.json();
    const { prisma } = await import("@/lib/prisma");
    const data = {
      title: body.title,
      slug: body.slug,
      description: body.description,
      content: body.content ?? null,
      challenges: body.challenges ?? null,
      technologies: Array.isArray(body.technologies) ? body.technologies : [],
      githubUrl: body.githubUrl ?? null,
      demoUrl: body.demoUrl ?? null,
      featured: body.featured ?? false,
      order: body.order ?? 0,
    };
    const project = await prisma.project.update({
      where: { id },
      data,
      include: { images: { orderBy: { order: "asc" } } },
    });
    return NextResponse.json(project);
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await params;
    const { prisma } = await import("@/lib/prisma");
    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ message: "Deleted" });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
