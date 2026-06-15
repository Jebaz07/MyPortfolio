"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Search, Code, ArrowUpRight } from "lucide-react";
import Reveal from "@/components/sections/reveal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  featured: boolean;
  technologies: string[];
  images?: { url: string; alt?: string }[];
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState("");
  const [selectedTech, setSelectedTech] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/projects", { signal: controller.signal })
      .then((r) => r.json())
      .then((d) => setProjects(Array.isArray(d) ? d : []))
      .catch(() => setProjects([]));
    return () => controller.abort();
  }, []);

  const allTechnologies = useMemo(() => {
    const techs = new Set<string>();
    if (Array.isArray(projects)) {
      projects.forEach((p) => { if (Array.isArray(p.technologies)) p.technologies.forEach((t: string) => techs.add(t)); });
    }
    return Array.from(techs).sort();
  }, [projects]);

  const featured = useMemo(() => Array.isArray(projects) ? projects.filter((p) => p.featured) : [], [projects]);

  const filtered = useMemo(() => {
    if (!Array.isArray(projects)) return [];
    return projects.filter((p) => {
      const matchesSearch = !search ||
        (p.title || "").toLowerCase().includes(search.toLowerCase()) ||
        (p.description || "").toLowerCase().includes(search.toLowerCase());
      const matchesTech = !selectedTech || (Array.isArray(p.technologies) && p.technologies.includes(selectedTech));
      return matchesSearch && matchesTech;
    });
  }, [projects, search, selectedTech]);

  return (
    <div className="pt-28 sm:pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal>
          <p className="text-xs tracking-[0.2em] uppercase text-zinc-500 mb-3">Portfolio</p>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-4">
            My <span className="gold-gradient">Projects</span>
          </h1>
          <p className="text-zinc-400 text-base sm:text-lg max-w-2xl">
            A curated selection of work I&apos;ve built.
          </p>
        </Reveal>

        {/* Search & Filter */}
        <Reveal delay={0.15}>
          <div className="flex flex-col sm:flex-row gap-4 mt-10 sm:mt-12 mb-12 sm:mb-16">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <Input placeholder="Search projects..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setSelectedTech(null)} className={`px-3 py-1.5 text-xs rounded-full border transition-all ${!selectedTech ? "border-gold bg-gold/10 text-gold" : "border-white/10 text-zinc-400 hover:border-white/20"}`}>
                All
              </button>
              {allTechnologies.map((tech) => (
                <button key={tech} onClick={() => setSelectedTech(selectedTech === tech ? null : tech)} className={`px-3 py-1.5 text-xs rounded-full border transition-all ${selectedTech === tech ? "border-gold bg-gold/10 text-gold" : "border-white/10 text-zinc-400 hover:border-white/20"}`}>
                  {tech}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Featured */}
        {featured.length > 0 && (
          <Reveal delay={0.2}>
            <h2 className="text-xl sm:text-2xl font-semibold mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 rounded-full gold-bg" />
              Featured
            </h2>
            <div className="grid md:grid-cols-2 gap-5 sm:gap-6 mb-16 sm:mb-20">
              {featured.map((project, i) => (
                <motion.div key={project.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <Link href={`/projects/${project.slug}`}>
                    <Card className="group overflow-hidden border-gold/10 hover:border-gold/30 transition-all duration-500 h-full bg-white/[0.02]">
                      <div className="relative h-56 sm:h-64 overflow-hidden bg-zinc-900">
                        {project.images?.[0]?.url ? (
                          <img src={project.images[0].url} alt={project.images[0].alt || project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center"><Code size={48} className="text-zinc-700" /></div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                          <span className="flex items-center gap-2 text-gold text-sm font-medium">View Project <ArrowUpRight size={14} /></span>
                        </div>
                      </div>
                      <CardContent className="p-5 sm:p-6">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg sm:text-xl font-semibold group-hover:text-gold transition-colors">{project.title}</h3>
                          <span className="text-[10px] uppercase tracking-widest text-gold border border-gold/20 rounded-full px-2 py-0.5">Featured</span>
                        </div>
                        <p className="text-zinc-400 text-sm line-clamp-2 mb-4">{project.description}</p>
                        {Array.isArray(project.technologies) && (
                          <div className="flex flex-wrap gap-1.5">
                            {project.technologies.map((tech: string) => (
                              <span key={tech} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-zinc-400 border border-white/10">{tech}</span>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </Reveal>
        )}

        {/* All Projects */}
        <Reveal>
          <h2 className="text-xl sm:text-2xl font-semibold mb-6 flex items-center gap-2">
            <span className="w-1.5 h-6 rounded-full bg-white/30" />
            All Projects
            <span className="text-zinc-500 text-base font-normal ml-2">({filtered.length})</span>
          </h2>
        </Reveal>

        {filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filtered.map((project, i) => (
              <Reveal key={project.id} delay={i * 0.05}>
                <Link href={`/projects/${project.slug}`}>
                  <Card className="group overflow-hidden border-white/5 hover:border-gold/30 transition-all duration-500 h-full bg-white/[0.02]">
                    <div className="relative h-44 sm:h-48 overflow-hidden bg-zinc-900">
                        {project.images?.[0]?.url ? (
                          <img src={project.images[0].url} alt={project.images[0].alt || project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center"><Code size={48} className="text-zinc-700" /></div>
                        )}
                    </div>
                    <CardContent className="p-5">
                      <h3 className="text-base font-semibold mb-1.5 group-hover:text-gold transition-colors">{project.title}</h3>
                      <p className="text-zinc-400 text-sm line-clamp-2 mb-3">{project.description}</p>
                      {Array.isArray(project.technologies) && (
                        <div className="flex flex-wrap gap-1.5">
                          {project.technologies.slice(0, 3).map((tech: string) => (
                            <span key={tech} className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 text-zinc-500 border border-white/10">{tech}</span>
                          ))}
                          {project.technologies.length > 3 && (
                            <span className="text-[11px] px-2 py-0.5 text-zinc-600">+{project.technologies.length - 3}</span>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-zinc-500">No projects match your criteria.</p>
            <Button variant="ghost" className="mt-4" onClick={() => { setSearch(""); setSelectedTech(null); }}>
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
