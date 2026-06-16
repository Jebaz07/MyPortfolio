import { NextRequest, NextResponse } from "next/server";
import { safeGetSettings, safeGetProjects, safeGetSkills } from "@/lib/api-helpers";
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const featured = searchParams.get("featured") === "true";

  try {
    if (searchParams.get("type") === "settings") {
      const settings = await safeGetSettings();
      return NextResponse.json(settings);
    }
    if (searchParams.get("type") === "skills") {
      const skills = await safeGetSkills();
      return NextResponse.json(skills);
    }
    const projects = await safeGetProjects(featured);
    return NextResponse.json(projects);
  } catch {
    if (searchParams.get("type") === "settings") {
      const { fallbackSettings } = await import("@/lib/fallback-data");
      return NextResponse.json(fallbackSettings);
    }
    if (searchParams.get("type") === "skills") {
      const { fallbackSkillCategories } = await import("@/lib/fallback-data");
      return NextResponse.json(fallbackSkillCategories);
    }
    const { fallbackProjects } = await import("@/lib/fallback-data");
    return NextResponse.json(featured ? fallbackProjects.filter((p: { featured: boolean }) => p.featured) : fallbackProjects);
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { title, slug, description, content, challenges, technologies, githubUrl, demoUrl, featured, order } = body;

    if (!title || !slug || !description) {
      return NextResponse.json(
        { error: "Title, slug, and description are required" },
        { status: 400 }
      );
    }

    const { prisma } = await import("@/lib/prisma");

    const existing = await prisma.project.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: "A project with this slug already exists" },
        { status: 409 }
      );
    }

    const project = await prisma.project.create({
      data: {
        title,
        slug,
        description,
        content: content || null,
        challenges: challenges || null,
        technologies: Array.isArray(technologies) ? technologies : [],
        githubUrl: githubUrl || null,
        demoUrl: demoUrl || null,
        featured: featured ?? false,
        order: order ?? 0,
      },
      include: { images: { orderBy: { order: "asc" } } },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to save project" },
      { status: 500 }
    );
  }
}
