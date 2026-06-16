"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Code } from "lucide-react";
import Reveal from "@/components/sections/reveal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  featured: boolean;
  githubUrl?: string | null;
  images: { url: string; alt?: string }[];
}

function openGitHub(url: string | null | undefined) {
  if (!url) return;
  window.open(url, "_blank", "noopener,noreferrer");
}

interface SkillCategory {
  id: string;
  name: string;
  skills: { id: string; name: string; level: number }[];
}

function useAPI<T>(url: string, fallback: T): [T, boolean] {
  const [data, setData] = useState<T>(fallback);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    fetch(url, { signal: controller.signal })
      .then((r) => r.json())
      .then((d) => { if (!cancelled) setData(Array.isArray(d) && typeof d === 'object' && !Array.isArray(fallback) ? d : d); })
      .catch(() => {})
      .finally(() => { if (!cancelled) { setLoading(false); clearTimeout(timeout); } });
    return () => { cancelled = true; clearTimeout(timeout); controller.abort(); };
  }, [url, fallback]);
  return [data, loading];
}

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden animate-pulse">
      <div className="h-52 bg-zinc-900" />
      <div className="p-6 space-y-3">
        <div className="h-5 w-3/4 rounded bg-zinc-800" />
        <div className="h-4 w-full rounded bg-zinc-800/50" />
        <div className="h-4 w-2/3 rounded bg-zinc-800/50" />
      </div>
    </div>
  );
}

export default function HomePage() {
  const [projects] = useAPI<Project[]>("/api/projects?featured=true", []);
  const [skills] = useAPI<SkillCategory[]>("/api/skills", []);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gold/[0.03] via-transparent to-black pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.06),transparent_60%)]" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gold/[0.02] blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-gold/[0.02] blur-3xl" />

        <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <p className="text-sm sm:text-base text-zinc-500 tracking-[0.3em] uppercase mb-8">
              Software Developer
            </p>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-6xl sm:text-8xl lg:text-[10rem] font-bold tracking-[-0.04em] leading-[0.9] mb-4"
          >
            <span className="gold-gradient">JEBAZ</span>
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-5xl sm:text-7xl lg:text-[8rem] font-bold tracking-[-0.03em] leading-[0.9] text-white mb-8"
          >
            WESLEY RAJ
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-12 font-light leading-relaxed"
          >
            Building modern web applications, AI-powered solutions, and interactive digital experiences.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <Link href="/projects">
              <Button variant="gold" size="lg" className="text-base gap-2 px-8">
                View Projects <ArrowRight size={16} />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="text-base px-8">
                Get In Touch
              </Button>
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-10 rounded-full border border-zinc-700 flex items-start justify-center pt-2"
          >
            <div className="w-1 h-2 rounded-full bg-zinc-500" />
          </motion.div>
        </motion.div>
      </section>

      {/* Projects */}
      <section className="py-24 sm:py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="flex items-end justify-between mb-12 sm:mb-16">
              <div>
                <p className="text-xs tracking-[0.2em] uppercase text-zinc-500 mb-3">Selected Work</p>
                <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
                  Featured <span className="gold-gradient">Projects</span>
                </h2>
              </div>
              <Link href="/projects" className="hidden sm:inline-flex">
                <Button variant="ghost" className="gap-2 text-zinc-400 hover:text-white">
                  View All <ArrowRight size={14} />
                </Button>
              </Link>
            </div>
          </Reveal>

          {projects.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {projects.slice(0, 6).map((project, i) => {
                const hasUrl = !!project.githubUrl;
                return (
                  <Reveal key={project.id} delay={i * 0.08}>
                    <div
                      onClick={() => hasUrl && openGitHub(project.githubUrl)}
                      className={`${hasUrl ? "cursor-pointer" : "cursor-default"} group`}
                    >
                      <Card className="overflow-hidden border-white/5 hover:border-gold/30 transition-all duration-500 h-full bg-white/[0.02]">
                        <div className="relative h-48 sm:h-52 overflow-hidden bg-zinc-900">
                          {project.images?.[0]?.url ? (
                            <img
                              src={project.images[0].url}
                              alt={project.images[0].alt || project.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Code size={36} className="text-zinc-700" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </div>
                        <CardContent className="p-5 sm:p-6">
                          <h3 className="text-lg font-semibold mb-2 group-hover:text-gold transition-colors">
                            {project.title}
                          </h3>
                          <p className="text-zinc-400 text-sm line-clamp-2 mb-4">
                            {project.description}
                          </p>
                          {Array.isArray(project.technologies) && (
                            <div className="flex flex-wrap gap-1.5">
                              {project.technologies.slice(0, 4).map((tech: string) => (
                                <span key={tech} className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 text-zinc-400 border border-white/10">
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
            </div>
          )}
        </div>
      </section>

      {/* Skills */}
      {Array.isArray(skills) && skills.length > 0 && (
        <section className="py-24 sm:py-32 px-6 bg-white/[0.02]">
          <div className="max-w-7xl mx-auto">
            <Reveal>
              <p className="text-xs tracking-[0.2em] uppercase text-zinc-500 mb-3 text-center">Expertise</p>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-16 text-center">
                Skills & <span className="gold-gradient">Technologies</span>
              </h2>
            </Reveal>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {skills.map((category, i) => (
                <Reveal key={category.id} delay={i * 0.1}>
                  <Card className="border-white/5 p-5 sm:p-6 bg-white/[0.02]">
                    <h3 className="text-base sm:text-lg font-semibold text-gold mb-5 sm:mb-6">
                      {category.name}
                    </h3>
                    <div className="space-y-3 sm:space-y-4">
                      {Array.isArray(category.skills) && category.skills.map((skill) => (
                        <div key={skill.id}>
                          <div className="flex justify-between text-xs sm:text-sm mb-1.5">
                            <span className="text-zinc-300">{skill.name}</span>
                            <span className="text-gold">{skill.level}%</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${skill.level}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className="h-full rounded-full gold-bg"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-24 sm:py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gold/[0.02] via-transparent to-transparent" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <Reveal>
            <p className="text-xs tracking-[0.2em] uppercase text-zinc-500 mb-4">Get In Touch</p>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-6">
              Let&apos;s Build Something{" "}
              <span className="gold-gradient">Great</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-base sm:text-lg text-zinc-400 mb-10 max-w-xl mx-auto">
              Open to new opportunities and collaborations.
            </p>
          </Reveal>
          <Reveal delay={0.4}>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact">
                <Button variant="gold" size="lg" className="text-base gap-2 px-8">
                  Start a Conversation <ArrowRight size={16} />
                </Button>
              </Link>
              <Link href="/projects">
                <Button variant="outline" size="lg" className="text-base px-8">
                  Browse Projects
                </Button>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
