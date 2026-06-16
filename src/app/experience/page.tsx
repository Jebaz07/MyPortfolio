"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Briefcase, Award } from "lucide-react";
import Reveal from "@/components/sections/reveal";
import { Card } from "@/components/ui/card";
import { toLocalDate } from "@/lib/date-utils";

interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  description?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  type: string;
  location?: string;
}

function formatDate(dateVal: string): string {
  const d = toLocalDate(dateVal);
  if (!d) return "";
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function TimelineSection({
  title,
  icon,
  items,
}: {
  title: string;
  icon: React.ReactNode;
  items: ExperienceItem[];
}) {
  if (!Array.isArray(items) || items.length === 0) return null;
  return (
    <div>
      <Reveal>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-10 sm:mb-12 flex items-center gap-3">
          {icon}
          {title}
        </h2>
      </Reveal>
      <div className="relative">
        <div className="absolute left-[19px] top-3 bottom-3 w-px bg-gradient-to-b from-gold/40 via-white/10 to-transparent" />
        <div className="space-y-8 sm:space-y-10">
          {items.map((item, i) => (
            <motion.div
              key={item.id || i}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative pl-14 sm:pl-16"
            >
              <div
                className={`absolute left-0 top-1 w-[34px] h-[34px] sm:w-[38px] sm:h-[38px] rounded-full border-2 flex items-center justify-center ${
                  item.current ? "border-gold bg-gold/10" : "border-white/10 bg-black"
                }`}
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full ${item.current ? "gold-bg" : "bg-white/20"}`}
                />
              </div>

              <Card
                className={`border-l-2 p-5 sm:p-6 ${
                  item.current
                    ? "border-l-gold border-white/5 bg-gradient-to-r from-gold/[0.03] to-transparent"
                    : "border-l-white/5 border-white/5 bg-white/[0.02]"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg sm:text-xl font-semibold">{item.role}</h3>
                      {item.current && (
                        <span className="text-[10px] uppercase tracking-widest gold-bg text-black font-semibold px-2 py-0.5 rounded-full">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-gold font-medium mt-0.5 text-sm sm:text-base">{item.company}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 mb-4">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={12} />
                    {item.startDate ? formatDate(item.startDate) : ""} —{" "}
                    {item.endDate ? formatDate(item.endDate) : "Present"}
                  </span>
                  {item.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin size={12} />{item.location}
                    </span>
                  )}
                </div>

                {item.description && (
                  <p className="text-zinc-400 text-sm leading-relaxed">{item.description}</p>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/experience", { signal: controller.signal })
      .then((r) => r.json())
      .then((d) => setExperiences(Array.isArray(d) ? d : []))
      .catch(() => setExperiences([]));
    return () => controller.abort();
  }, []);

  const work = experiences.filter((e) => e.type === "work");
  const internships = experiences.filter((e) => e.type === "internship");

  return (
    <div className="pt-28 sm:pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <Reveal>
          <p className="text-xs tracking-[0.2em] uppercase text-zinc-500 mb-3">Experience</p>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-4">
            My <span className="gold-gradient">Experience</span>
          </h1>
          <p className="text-zinc-400 text-base sm:text-lg max-w-2xl">
            A timeline of my professional journey.
          </p>
        </Reveal>

        {experiences.length === 0 ? (
          <div className="mt-32 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-gold border-t-transparent animate-spin" />
          </div>
        ) : (
          <div className="mt-16 sm:mt-20 space-y-20 sm:space-y-24">
            <TimelineSection title="Work Experience" icon={<Briefcase size={28} className="text-gold" />} items={work} />
            <TimelineSection title="Internships" icon={<Award size={28} className="text-gold" />} items={internships} />
          </div>
        )}
      </div>
    </div>
  );
}
