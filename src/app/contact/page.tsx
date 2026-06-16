"use client";

import { useState, useEffect } from "react";
import { Send, Mail, MapPin, FolderGit2, UserRound, Globe, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Reveal from "@/components/sections/reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { normalizeUrl } from "@/lib/utils";

interface SettingsData {
  email?: string;
  location?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  resumeUrl?: string;
}

interface SocialLink {
  href: string;
  icon: React.ComponentType<{ size?: number }>;
  label: string;
}

export default function ContactPage() {
  const [settings, setSettings] = useState<SettingsData>({});
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/settings", { signal: controller.signal })
      .then((r) => r.json())
      .then((d) => setSettings(d || {}))
      .catch(() => {});
    return () => controller.abort();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server error (${res.status})`);
      }
      toast.success("Message sent successfully! I'll get back to you soon.");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  }

  const socialLinks: SocialLink[] = [
    { href: normalizeUrl(settings?.githubUrl), icon: FolderGit2, label: "GitHub" },
    { href: normalizeUrl(settings?.linkedinUrl), icon: UserRound, label: "LinkedIn" },
    { href: normalizeUrl(settings?.twitterUrl), icon: Globe, label: "Twitter" },
  ].filter((l) => l.href);

  return (
    <div className="pt-28 sm:pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal>
          <p className="text-xs tracking-[0.2em] uppercase text-zinc-500 mb-3">Contact</p>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-4">
            Get In <span className="gold-gradient">Touch</span>
          </h1>
          <p className="text-zinc-400 text-base sm:text-lg max-w-2xl">
            Have a project in mind or just want to say hello?
          </p>
        </Reveal>

        <div className="grid lg:grid-cols-5 gap-12 sm:gap-16 mt-16 sm:mt-20">
          <div className="lg:col-span-3">
            <Reveal>
              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
                  <div className="space-y-2">
                    <label className="text-sm text-zinc-400">Name <span className="text-gold">*</span></label>
                    <Input placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-zinc-400">Email <span className="text-gold">*</span></label>
                    <Input type="email" placeholder="your@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-zinc-400">Subject</label>
                  <Input placeholder="What&apos;s this about?" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-zinc-400">Message <span className="text-gold">*</span></label>
                  <Textarea placeholder="Tell me about your project..." rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
                </div>
                <Button type="submit" variant="gold" size="lg" className="w-full gap-2" disabled={submitting}>
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  {submitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </Reveal>
          </div>

          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-32 space-y-6 sm:space-y-8">
              <Reveal direction="right">
                <Card className="border-white/5 p-5 sm:p-6 space-y-5 bg-white/[0.02]">
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Contact Info</h3>
                  {settings?.email && (
                    <a href={`mailto:${settings.email}`} className="flex items-center gap-3 text-zinc-300 hover:text-gold transition-colors group">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-gold/10 transition-colors">
                        <Mail size={16} className="text-gold" />
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500">Email</p>
                        <p className="text-sm">{settings.email}</p>
                      </div>
                    </a>
                  )}
                  {settings?.location && (
                    <div className="flex items-center gap-3 text-zinc-300">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white/5 flex items-center justify-center">
                        <MapPin size={16} className="text-gold" />
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500">Location</p>
                        <p className="text-sm">{settings.location}</p>
                      </div>
                    </div>
                  )}
                </Card>
              </Reveal>

              {socialLinks.length > 0 && (
                <Reveal direction="right" delay={0.1}>
                  <Card className="border-white/5 p-5 sm:p-6 bg-white/[0.02]">
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4">Social</h3>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      {socialLinks.map((link) => (
                        <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-white/5 hover:bg-gold/10 border border-white/5 hover:border-gold/20 text-sm text-zinc-300 hover:text-gold transition-all">
                          <link.icon size={14} /> {link.label}
                        </a>
                      ))}
                    </div>
                  </Card>
                </Reveal>
              )}

              {normalizeUrl(settings?.resumeUrl) && (
                <Reveal direction="right" delay={0.2}>
                  <a href={normalizeUrl(settings?.resumeUrl)} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="w-full gap-2">
                      <Download size={16} /> Download Resume
                    </Button>
                  </a>
                </Reveal>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
