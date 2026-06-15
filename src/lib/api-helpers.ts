import { prisma } from "./prisma";
import {
  fallbackSettings,
  fallbackProjects,
  fallbackSkillCategories,
  fallbackExperience,
  fallbackCertifications,
} from "./fallback-data";

export async function safeGetSettings() {
  try {
    let settings = await prisma.siteSettings.findUnique({ where: { id: "default" } });
    if (!settings) {
      settings = await prisma.siteSettings.create({ data: { id: "default" } });
    }
    return settings;
  } catch {
    return fallbackSettings;
  }
}

export async function safeGetProjects(featuredOnly = false) {
  try {
    const where = featuredOnly ? { featured: true } : {};
    return await prisma.project.findMany({
      where,
      orderBy: { order: "asc" },
      include: { images: { orderBy: { order: "asc" } } },
    });
  } catch {
    return featuredOnly
      ? fallbackProjects.filter((p) => p.featured)
      : fallbackProjects;
  }
}

export async function safeGetProjectBySlug(slug: string) {
  try {
    const project = await prisma.project.findUnique({
      where: { slug },
      include: { images: { orderBy: { order: "asc" } } },
    });
    return project;
  } catch {
    return fallbackProjects.find((p) => p.slug === slug) || null;
  }
}

export async function safeGetProjectById(id: string) {
  try {
    const project = await prisma.project.findUnique({
      where: { id },
      include: { images: { orderBy: { order: "asc" } } },
    });
    return project;
  } catch {
    return fallbackProjects.find((p) => p.id === id) || null;
  }
}

export async function safeGetSkills() {
  try {
    return await prisma.skillCategory.findMany({
      orderBy: { order: "asc" },
      include: { skills: { orderBy: { order: "asc" } } },
    });
  } catch {
    return fallbackSkillCategories;
  }
}

export async function safeGetExperience(type?: string) {
  try {
    const where = type ? { type } : {};
    return await prisma.experience.findMany({
      where,
      orderBy: { order: "asc" },
    });
  } catch {
    if (type) {
      return fallbackExperience.filter((e) => e.type === type);
    }
    return fallbackExperience;
  }
}

export async function safeGetCertifications() {
  try {
    return await prisma.certification.findMany({
      orderBy: { order: "asc" },
    });
  } catch {
    return fallbackCertifications;
  }
}

export async function safeCreateMessage(data: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}) {
  try {
    return await prisma.contactMessage.create({ data });
  } catch {
    return { id: "offline", ...data, read: false, createdAt: new Date() };
  }
}

export async function safeGetMessages() {
  try {
    return await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}
