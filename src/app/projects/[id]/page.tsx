"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ExternalLink, FolderGit2, ChevronLeft, ChevronRight, AlertTriangle, Code } from "lucide-react";
import Reveal from "@/components/sections/reveal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  content?: string;
  challenges?: string;
  technologies: string[];
  githubUrl?: string;
  demoUrl?: string;
  images: { id: string; url: string; alt?: string; order: number }[];
}

export default function ProjectDetailPage() {
  const params = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [related, setRelated] = useState<Project[]>([]);
  const [currentImage, setCurrentImage] = useState(0);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!params?.id) return;
    const controller = new AbortController();
    fetch(`/api/projects/${params.id}`, { signal: controller.signal })
      .then(async (r) => {
        if (!r.ok) { setNotFound(true); return null; }
        const data = await r.json();
        if (data?.error) { setNotFound(true); return null; }
        setProject(data);
        return fetch("/api/projects", { signal: controller.signal }).then((r2) => r2.json());
      })
      .then((all) => {
        if (Array.isArray(all)) {
          setRelated(all.filter((p: Project) => p.id !== project?.id).slice(0, 3));
        }
      })
      .catch(() => setNotFound(true));
    return () => controller.abort();
  }, [params?.id, project?.id]);

  if (notFound) {
    return (
      <div className="pt-40 pb-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <Code size={64} className="mx-auto text-zinc-700 mb-6" />
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Project Not Found</h1>
          <p className="text-zinc-400 mb-8">The project you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Link href="/projects">
            <Button variant="gold">
              <ArrowLeft size={16} className="mr-2" /> Back to Projects
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="pt-40 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-gold border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-28 sm:pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Back */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <Link href="/projects" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-gold transition-colors mb-10 sm:mb-12">
            <ArrowLeft size={14} /> Back to Projects
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-10 sm:gap-16">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-10 sm:space-y-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
              <p className="text-xs tracking-[0.2em] uppercase text-zinc-500 mb-3">Project</p>
              <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">{project.title}</h1>
              <p className="text-base sm:text-lg text-zinc-400 leading-relaxed">{project.description}</p>
            </motion.div>

            {/* Gallery */}
            {Array.isArray(project.images) && project.images.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
                <div className="relative rounded-xl overflow-hidden border border-white/10 bg-zinc-900">
                  <img src={project.images[currentImage]?.url} alt={project.images[currentImage]?.alt || project.title} className="w-full aspect-video object-cover" />
                  {project.images.length > 1 && (
                    <>
                      <button onClick={() => setCurrentImage((currentImage - 1 + project.images.length) % project.images.length)} className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-gold/80 transition-all">
                        <ChevronLeft size={18} />
                      </button>
                      <button onClick={() => setCurrentImage((currentImage + 1) % project.images.length)} className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-gold/80 transition-all">
                        <ChevronRight size={18} />
                      </button>
                      <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {project.images.map((_, i) => (
                          <button key={i} onClick={() => setCurrentImage(i)} className={`w-2 h-2 rounded-full transition-all ${i === currentImage ? "bg-gold w-5 sm:w-6" : "bg-white/40 hover:bg-white/60"}`} />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            )}

            {/* Content */}
            {project.content && (
              <Reveal>
                <div>
                  <h2 className="text-xl sm:text-2xl font-semibold mb-4">Overview</h2>
                  <div className="text-zinc-300 leading-relaxed whitespace-pre-wrap">{project.content}</div>
                </div>
              </Reveal>
            )}

            {/* Challenges */}
            {project.challenges && (
              <Reveal>
                <Card className="border-amber-500/10 bg-amber-500/[0.02] p-6 sm:p-8">
                  <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-3">
                    <AlertTriangle size={20} className="text-amber-400" />
                    Challenges & Solutions
                  </h2>
                  <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">{project.challenges}</p>
                </Card>
              </Reveal>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-32 space-y-6 sm:space-y-8">
              {Array.isArray(project.technologies) && project.technologies.length > 0 && (
                <Reveal direction="right">
                  <Card className="border-white/5 p-5 sm:p-6 bg-white/[0.02]">
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4">Technologies</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <span key={tech} className="px-3 py-1.5 text-sm rounded-lg bg-white/5 border border-white/10 text-zinc-300">{tech}</span>
                      ))}
                    </div>
                  </Card>
                </Reveal>
              )}

              <Reveal direction="right" delay={0.1}>
                <div className="space-y-3">
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="w-full gap-2 justify-start">
                        <FolderGit2 size={16} /> View Source Code <ExternalLink size={14} className="ml-auto text-zinc-600" />
                      </Button>
                    </a>
                  )}
                  {project.demoUrl && (
                    <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="gold" className="w-full gap-2 justify-start">
                        <ExternalLink size={16} /> Live Demo <ExternalLink size={14} className="ml-auto text-black/50" />
                      </Button>
                    </a>
                  )}
                </div>
              </Reveal>
            </div>
          </div>
        </div>

        {/* Related */}
        {Array.isArray(related) && related.length > 0 && (
          <div className="mt-24 sm:mt-32">
            <Reveal>
              <h2 className="text-2xl sm:text-3xl font-semibold mb-8 sm:mb-10">
                Related <span className="gold-gradient">Projects</span>
              </h2>
            </Reveal>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {related.map((rp, i) => (
                <Reveal key={rp.id} delay={i * 0.1}>
                  <Link href={`/projects/${rp.slug}`}>
                    <Card className="group border-white/5 hover:border-gold/30 transition-all duration-500 h-full bg-white/[0.02]">
                      <div className="relative h-40 sm:h-44 overflow-hidden bg-zinc-900">
                        {rp.images?.[0]?.url ? (
                          <img src={rp.images[0].url} alt={rp.images[0].alt || rp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-700"><Code size={28} /></div>
                        )}
                      </div>
                      <CardContent className="p-4 sm:p-5">
                        <h3 className="font-semibold mb-1 group-hover:text-gold transition-colors">{rp.title}</h3>
                        <p className="text-zinc-400 text-sm line-clamp-2">{rp.description}</p>
                      </CardContent>
                    </Card>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
