import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

function parseDate(dateStr: string): Date {
  const [year, month] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, 1);
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });

  const adminEmail = process.env.ADMIN_EMAIL || "admin@jebazwesley.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123";

  // Create admin user
  const existingAdmin = await prisma.user.findFirst({
    where: { role: "ADMIN" },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    await prisma.user.create({
      data: {
        email: adminEmail,
        name: "Jebaz Wesley Raj",
        password: hashedPassword,
        role: "ADMIN",
      },
    });
    console.log("Admin user created");
  } else {
    console.log("Admin user already exists, skipping");
  }

  // Upsert site settings
  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      title: "Jebaz Wesley Raj",
      subtitle: "Full Stack Developer",
      heroTitle: "Jebaz Wesley Raj",
      heroSubtitle: "Full Stack Developer & Creative Technologist",
      aboutBio:
        "Passionate full-stack developer with expertise in building modern web applications using React, Next.js, and Node.js. I love turning complex problems into simple, beautiful, and intuitive solutions. With a strong foundation in computer science and a keen eye for design, I strive to create digital experiences that make a difference.",
      aboutEducation:
        "Computer Science graduate with a focus on web technologies and software engineering. Continuously learning and staying up-to-date with the latest industry trends and best practices.",
      githubUrl: "https://github.com/jebazwesley",
      linkedinUrl: "https://linkedin.com/in/jebazwesley",
      email: "jebazwesleyraj@gmail.com",
    },
  });
  console.log("Site settings created");

  // Create skill categories and skills
  const skillCategories = [
    {
      name: "Frontend",
      order: 0,
      skills: [
        { name: "React", level: 95 },
        { name: "Next.js", level: 92 },
        { name: "TypeScript", level: 90 },
        { name: "HTML/CSS", level: 95 },
        { name: "JavaScript", level: 93 },
        { name: "Tailwind CSS", level: 88 },
      ],
    },
    {
      name: "Backend",
      order: 1,
      skills: [
        { name: "Node.js", level: 88 },
        { name: "Python", level: 80 },
        { name: "PostgreSQL", level: 82 },
        { name: "Prisma", level: 85 },
        { name: "REST APIs", level: 90 },
        { name: "GraphQL", level: 75 },
      ],
    },
    {
      name: "Tools & Others",
      order: 2,
      skills: [
        { name: "Git", level: 90 },
        { name: "Docker", level: 75 },
        { name: "AWS", level: 70 },
        { name: "CI/CD", level: 78 },
        { name: "Figma", level: 72 },
        { name: "Linux", level: 80 },
      ],
    },
  ];

  for (const cat of skillCategories) {
    const existingCategory = await prisma.skillCategory.findFirst({
      where: { name: cat.name },
    });

    if (!existingCategory) {
      const createdCategory = await prisma.skillCategory.create({
        data: {
          name: cat.name,
          order: cat.order,
          skills: {
            create: cat.skills.map((skill, idx) => ({
              name: skill.name,
              level: skill.level,
              order: idx,
            })),
          },
        },
      });
      console.log(`Created category: ${createdCategory.name}`);
    } else {
      console.log(`Category ${cat.name} already exists, skipping`);
    }
  }

  // Create experience entries
  const experiences = [
    {
      type: "work",
      company: "Tech Company",
      role: "Full Stack Developer",
      current: true,
      startDate: "2023-01",
      description:
        "Building modern web applications using Next.js, TypeScript, and Node.js. Leading frontend architecture decisions and implementing scalable solutions. Collaborating with cross-functional teams to deliver high-quality products.",
    },
    {
      type: "internship",
      company: "Startup Inc",
      role: "Frontend Developer Intern",
      startDate: "2022-06",
      endDate: "2022-12",
      description:
        "Developed React components and integrated REST APIs. Worked on responsive design implementation and contributed to the company's main product dashboard.",
    },
    {
      type: "education",
      company: "University",
      role: "B.S. Computer Science",
      startDate: "2019-09",
      endDate: "2023-05",
      description:
        "Graduated with honors. Relevant coursework: Data Structures, Algorithms, Web Development, Database Systems, and Software Engineering.",
    },
  ];

  for (const exp of experiences) {
    const existingExp = await prisma.experience.findFirst({
      where: {
        company: exp.company,
        role: exp.role,
        type: exp.type,
      },
    });

    if (!existingExp) {
      await prisma.experience.create({
        data: {
          type: exp.type,
          company: exp.company,
          role: exp.role,
          current: exp.current,
          startDate: parseDate(exp.startDate),
          endDate: exp.endDate ? parseDate(exp.endDate) : null,
          description: exp.description,
        },
      });
      console.log(`Created experience: ${exp.role} at ${exp.company}`);
    } else {
      console.log(`Experience at ${exp.company} already exists, skipping`);
    }
  }

  // Create projects
  const projects = [
    {
      title: "E-Commerce Platform",
      description:
        "A full-featured e-commerce platform with product management, shopping cart, payment integration, and admin dashboard built with modern web technologies.",
      technologies: ["React", "Next.js", "TypeScript", "PostgreSQL", "Stripe"],
      featured: true,
      order: 0,
    },
    {
      title: "AI Chat Application",
      description:
        "Real-time AI-powered chat application with natural language processing capabilities, WebSocket communication, and a responsive user interface.",
      technologies: ["Python", "FastAPI", "React", "WebSocket"],
      featured: true,
      order: 1,
    },
    {
      title: "Portfolio Website",
      description:
        "A modern, animated portfolio website showcasing projects, skills, and experience with a focus on performance and visual appeal.",
      technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
      featured: false,
      order: 2,
    },
    {
      title: "Task Management App",
      description:
        "A collaborative task management application with real-time updates, drag-and-drop functionality, and team workspace features.",
      technologies: ["React", "Node.js", "MongoDB", "Socket.io"],
      featured: false,
      order: 3,
    },
  ];

  for (const project of projects) {
    const slug = slugify(project.title);
    const existingProject = await prisma.project.findUnique({
      where: { slug },
    });

    if (!existingProject) {
      await prisma.project.create({
        data: {
          title: project.title,
          slug,
          description: project.description,
          technologies: project.technologies,
          featured: project.featured,
          order: project.order,
        },
      });
      console.log(`Created project: ${project.title}`);
    } else {
      console.log(`Project ${project.title} already exists, skipping`);
    }
  }

  // Create certifications
  const certifications = [
    {
      title: "AWS Certified Developer - Associate",
      issuer: "Amazon Web Services",
    },
    {
      title: "Meta Front-End Developer",
      issuer: "Meta (Coursera)",
    },
    {
      title: "Google Cloud Digital Leader",
      issuer: "Google Cloud",
    },
    {
      title: "MongoDB Associate Developer",
      issuer: "MongoDB",
    },
  ];

  for (const cert of certifications) {
    const existingCert = await prisma.certification.findFirst({
      where: {
        title: cert.title,
        issuer: cert.issuer,
      },
    });

    if (!existingCert) {
      await prisma.certification.create({
        data: {
          title: cert.title,
          issuer: cert.issuer,
        },
      });
      console.log(`Created certification: ${cert.title}`);
    } else {
      console.log(`Certification ${cert.title} already exists, skipping`);
    }
  }

  console.log("Seed complete!");
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
