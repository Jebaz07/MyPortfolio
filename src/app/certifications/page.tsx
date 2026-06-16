"use client";

import { useState, useEffect } from "react";
import { Award, FileText, ExternalLink, Calendar, Verified } from "lucide-react";
import Reveal from "@/components/sections/reveal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toLocalDate } from "@/lib/date-utils";

interface Certification {
  id: string;
  title: string;
  issuer: string;
  description?: string;
  imageUrl?: string;
  pdfUrl?: string;
  verificationUrl?: string;
  issueDate?: string;
  expiryDate?: string;
}

function formatDate(dateVal: string): string {
  const d = toLocalDate(dateVal);
  if (!d) return "";
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export default function CertificationsPage() {
  const [certifications, setCertifications] = useState<Certification[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/certifications", { signal: controller.signal })
      .then((r) => r.json())
      .then((d) => setCertifications(Array.isArray(d) ? d : []))
      .catch(() => setCertifications([]));
    return () => controller.abort();
  }, []);

  return (
    <div className="pt-28 sm:pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal>
          <p className="text-xs tracking-[0.2em] uppercase text-zinc-500 mb-3">Credentials</p>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-4">
            <span className="gold-gradient">Certifications</span>
          </h1>
          <p className="text-zinc-400 text-base sm:text-lg max-w-2xl">
            Professional certifications and credentials.
          </p>
        </Reveal>

        {certifications.length > 0 ? (
          <div className="mt-16 sm:mt-20 grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {certifications.map((cert, i) => (
              <Reveal key={cert.id || i} delay={i * 0.08}>
                <Card className="group border-white/5 hover:border-gold/20 transition-all duration-500 h-full flex flex-col bg-white/[0.02]">
                  {cert.imageUrl && (
                    <div className="relative h-36 sm:h-40 overflow-hidden rounded-t-xl bg-zinc-900">
                      <img src={cert.imageUrl} alt={cert.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>
                  )}
                  <CardContent className="p-5 sm:p-6 flex flex-col flex-1">
                    {!cert.imageUrl && (
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl gold-bg flex items-center justify-center mb-4">
                        <Award size={20} className="text-black" />
                      </div>
                    )}
                    <h3 className="text-base sm:text-lg font-semibold mb-1 group-hover:text-gold transition-colors">{cert.title}</h3>
                    <p className="text-gold text-sm font-medium mb-3">{cert.issuer}</p>
                    {cert.description && <p className="text-zinc-400 text-sm mb-4 line-clamp-2 flex-1">{cert.description}</p>}
                    <div className="space-y-2 text-xs text-zinc-500 mb-4 sm:mb-5">
                      {cert.issueDate && (
                        <span className="flex items-center gap-1.5">
                          <Calendar size={12} />
                          Issued: {formatDate(cert.issueDate)}
                        </span>
                      )}
                      {cert.expiryDate && (
                        <span className="flex items-center gap-1.5">
                          <Calendar size={12} />
                          Expires: {formatDate(cert.expiryDate)}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-white/5">
                      {cert.pdfUrl && (
                        <a href={cert.pdfUrl} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                            <FileText size={12} /> PDF
                          </Button>
                        </a>
                      )}
                      {cert.verificationUrl && (
                        <a href={cert.verificationUrl} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-gold hover:text-gold">
                            <Verified size={12} /> Verify <ExternalLink size={10} />
                          </Button>
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Reveal>
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
