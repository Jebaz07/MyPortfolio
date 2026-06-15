"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, GraduationCap, Target, Mail } from "lucide-react";
import Reveal from "@/components/sections/reveal";
import { Card } from "@/components/ui/card";

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

interface SettingsData {
  aboutBio?: string;
  aboutEducation?: string;
  aboutGoals?: string;
  profileImage?: string;
  location?: string;
  email?: string;
}

function formatDate(dateVal: string | Date): string {
  try {
    return new Date(dateVal).toLocaleDateString("en-US", { month: "short", year: "numeric" });
  } catch {
    return String(dateVal || "").slice(0, 7);
  }
}

export default function AboutPage() {
  const [data, setData] = useState<SettingsData>({});
  const [education, setEducation] = useState<ExperienceItem[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    Promise.all([
      fetch("/api/settings", { signal: controller.signal }).then((r) => r.json()).catch(() => ({})),
      fetch("/api/experience?type=education", { signal: controller.signal }).then((r) => r.json()).catch(() => []),
    ]).then(([s, e]) => {
      setData(s || {});
      setEducation(Array.isArray(e) ? e : []);
    });
    return () => controller.abort();
  }, []);

  return (
    <div className="pt-28 sm:pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal>
          <p className="text-xs tracking-[0.2em] uppercase text-zinc-500 mb-3">About</p>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-4">
            <span className="gold-gradient">About</span> Me
          </h1>
          {data.location && (
            <p className="flex items-center gap-1.5 text-sm text-zinc-500">
              <MapPin size={14} /> {data.location}
            </p>
          )}
        </Reveal>

        <div className="grid lg:grid-cols-3 gap-12 sm:gap-16 mt-16 sm:mt-20">
          <div className="lg:col-span-1">
            <Reveal direction="left">
              <div className="lg:sticky lg:top-32">
                <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 bg-zinc-900">
                  {data.profileImage ? (
                    <img src={data.profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-24 h-24 rounded-full gold-bg flex items-center justify-center text-black text-4xl font-bold">
                        JW
                      </div>
                    </div>
                  )}
                </div>
                {data.email && (
                  <a href={`mailto:${data.email}`} className="block text-sm text-zinc-400 hover:text-gold transition-colors mt-4">
                    <Mail size={14} className="inline mr-1.5 -mt-0.5" />
                    {data.email}
                  </a>
                )}
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-2 space-y-16 sm:space-y-20">
            <Reveal>
              <div>
                <h2 className="text-2xl sm:text-3xl font-semibold mb-6 flex items-center gap-3">
                  <span className="w-8 h-px bg-gold/50" />
                  My Story
                </h2>
                <p className="text-zinc-300 leading-relaxed text-base sm:text-lg">
                  {data.aboutBio || "I'm passionate about creating exceptional digital experiences through code."}
                </p>
              </div>
            </Reveal>

            {education.length > 0 && (
              <Reveal>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-semibold mb-8 sm:mb-10 flex items-center gap-3">
                    <GraduationCap size={28} className="text-gold" />
                    Education
                  </h2>
                  <div className="relative">
                    <div className="absolute left-[7px] top-2 bottom-2 w-px bg-white/10" />
                    <div className="space-y-8 sm:space-y-10">
                      {education.map((item, i) => (
                        <motion.div
                          key={item.id || i}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.1, duration: 0.5 }}
                          className="relative pl-10"
                        >
                          <div className="absolute left-0 top-1.5 w-[15px] h-[15px] rounded-full border-2 border-gold bg-black" />
                          <h3 className="text-lg font-semibold text-white">{item.role}</h3>
                          <p className="text-gold text-sm font-medium">{item.company}</p>
                          <p className="text-zinc-500 text-sm mt-1 flex items-center gap-2">
                            <Calendar size={12} />
                            {item.startDate ? formatDate(item.startDate) : ""}
                            {" — "}
                            {item.endDate ? formatDate(item.endDate) : "Present"}
                          </p>
                          {item.description && (
                            <p className="text-zinc-400 text-sm mt-3 leading-relaxed">{item.description}</p>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            )}

            <Reveal>
              <Card className="border-gold/10 bg-gold/[0.02] p-6 sm:p-8">
                <h2 className="text-xl sm:text-2xl font-semibold mb-4 flex items-center gap-3">
                  <Target size={24} className="text-gold" />
                  Career Goals
                </h2>
                <p className="text-zinc-300 leading-relaxed">
                  {data.aboutGoals || "Always striving to push boundaries in technology and design."}
                </p>
              </Card>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}
