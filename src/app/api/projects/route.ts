import { NextResponse } from "next/server";
import { safeGetSettings, safeGetProjects, safeGetSkills } from "@/lib/api-helpers";

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
