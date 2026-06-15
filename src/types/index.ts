export type Role = "ADMIN" | "EDITOR";

export interface SiteSettingsData {
  title: string;
  subtitle: string;
  description: string;
  keywords: string;
  profileImage?: string | null;
  resumeUrl?: string | null;
  heroTitle: string;
  heroSubtitle: string;
  heroBackground?: string | null;
  aboutTitle: string;
  aboutBio: string;
  aboutEducation: string;
  aboutGoals: string;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  twitterUrl?: string | null;
  email?: string | null;
  phone?: string | null;
  location?: string | null;
  primaryColor: string;
}

export interface ProjectData {
  id: string;
  title: string;
  slug: string;
  description: string;
  content?: string | null;
  challenges?: string | null;
  technologies: string[];
  githubUrl?: string | null;
  demoUrl?: string | null;
  featured: boolean;
  order: number;
  images: { id: string; url: string; alt?: string | null; order: number }[];
  createdAt: Date;
}

export interface SkillCategoryData {
  id: string;
  name: string;
  order: number;
  skills: { id: string; name: string; level: number; icon?: string | null; order: number }[];
}

export interface ExperienceData {
  id: string;
  company: string;
  role: string;
  description?: string | null;
  startDate: Date;
  endDate?: Date | null;
  current: boolean;
  type: string;
  location?: string | null;
  order: number;
}

export interface CertificationData {
  id: string;
  title: string;
  issuer: string;
  description?: string | null;
  imageUrl?: string | null;
  pdfUrl?: string | null;
  verificationUrl?: string | null;
  issueDate?: Date | null;
  expiryDate?: Date | null;
  order: number;
}

export interface ContactMessageData {
  id: string;
  name: string;
  email: string;
  subject?: string | null;
  message: string;
  read: boolean;
  createdAt: Date;
}
