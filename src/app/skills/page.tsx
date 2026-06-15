"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Code2, Layers, Server, Palette, Database, Terminal } from "lucide-react";
import Reveal from "@/components/sections/reveal";
import { Card } from "@/components/ui/card";

const categoryIcons: Record<string, React.ReactNode> = {
  Frontend: <Code2 size={24} />,
  Backend: <Server size={24} />,
  Design: <Palette size={24} />,
  Database: <Database size={24} />,
  DevOps: <Terminal size={24} />,
  Other: <Layers size={24} />,
};

function CircularProgress({ level, label }: { level: number; label: string }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (level / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
          <motion.circle
            cx="50" cy="50" r={radius} fill="none"
            stroke="url(#goldGrad)" strokeWidth="6" strokeLinecap="round"
            initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
            whileInView={{ strokeDashoffset: offset }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
          <defs>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#B8960F" />
              <stop offset="50%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#F0D060" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className="text-lg font-bold gold-gradient"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
          >
            {level}%
          </motion.span>
        </div>
      </div>
      <span className="text-xs text-zinc-400 font-medium">{label}</span>
    </div>
  );
}

interface Skill {
  id: string;
  name: string;
  level: number;
}

interface Category {
  id: string;
  name: string;
  skills: Skill[];
}

export default function SkillsPage() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/skills", { signal: controller.signal })
      .then((r) => r.json())
      .then((d) => setCategories(Array.isArray(d) ? d : []))
      .catch(() => setCategories([]));
    return () => controller.abort();
  }, []);

  return (
    <div className="pt-28 sm:pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal>
          <p className="text-xs tracking-[0.2em] uppercase text-zinc-500 mb-3">Expertise</p>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-4">
            Skills & <span className="gold-gradient">Technologies</span>
          </h1>
          <p className="text-zinc-400 text-base sm:text-lg max-w-2xl">
            Technologies and tools I work with.
          </p>
        </Reveal>

        {Array.isArray(categories) && categories.length > 0 ? (
          <div className="mt-16 sm:mt-20 space-y-20 sm:space-y-24">
            {categories.map((category, catIdx) => (
              <div key={category.id || catIdx}>
                <Reveal>
                  <div className="flex items-center gap-4 mb-10 sm:mb-12">
                    <span className="text-gold">{categoryIcons[category.name] || <Layers size={24} />}</span>
                    <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">{category.name}</h2>
                    <div className="flex-1 h-px bg-gradient-to-r from-gold/30 to-transparent" />
                  </div>
                </Reveal>

                {/* Circular charts - md+ */}
                {Array.isArray(category.skills) && (
                  <>
                    <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                      {category.skills.map((skill: Skill, i: number) => (
                        <motion.div key={skill.id || i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                          <Card className="border-white/5 p-5 sm:p-6 flex items-center justify-center bg-white/[0.02]">
                            <CircularProgress level={skill.level} label={skill.name} />
                          </Card>
                        </motion.div>
                      ))}
                    </div>

                    {/* Bar charts - mobile */}
                    <div className="md:hidden space-y-4">
                      {category.skills.map((skill: Skill, i: number) => (
                        <Reveal key={skill.id || i} delay={i * 0.05}>
                          <div>
                            <div className="flex justify-between text-sm mb-1.5">
                              <span className="text-zinc-300">{skill.name}</span>
                              <span className="text-gold font-medium">{skill.level}%</span>
                            </div>
                            <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: `${skill.level}%` }}
                                viewport={{ once: true }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="h-full rounded-full gold-bg"
                              />
                            </div>
                          </div>
                        </Reveal>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-32 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-gold border-t-transparent animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}
