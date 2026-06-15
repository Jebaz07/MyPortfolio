"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Save, Globe, Image, Link, Mail, Palette } from "lucide-react";

interface SettingsForm {
  title: string;
  subtitle: string;
  description: string;
  keywords: string;
  profileImage: string;
  resumeUrl: string;
  githubUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
  email: string;
  phone: string;
  location: string;
  primaryColor: string;
}

export default function AdminSettings() {
  const [form, setForm] = useState<SettingsForm>({
    title: "",
    subtitle: "",
    description: "",
    keywords: "",
    profileImage: "",
    resumeUrl: "",
    githubUrl: "",
    linkedinUrl: "",
    twitterUrl: "",
    email: "",
    phone: "",
    location: "",
    primaryColor: "#D4AF37",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingSection, setSavingSection] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        if (data) {
          setForm({
            title: data.title || "",
            subtitle: data.subtitle || "",
            description: data.description || "",
            keywords: data.keywords || "",
            profileImage: data.profileImage || "",
            resumeUrl: data.resumeUrl || "",
            githubUrl: data.githubUrl || "",
            linkedinUrl: data.linkedinUrl || "",
            twitterUrl: data.twitterUrl || "",
            email: data.email || "",
            phone: data.phone || "",
            location: data.location || "",
            primaryColor: data.primaryColor || "#D4AF37",
          });
        }
      } catch {
        toast.error("Failed to fetch settings");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSave = async (section?: string) => {
    setSaving(true);
    setSavingSection(section || null);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success("Settings updated");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
      setSavingSection(null);
    }
  };

  const updateField = (field: keyof SettingsForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-zinc-400 mt-1">Manage your website settings</p>
      </div>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg gold-bg">
              <Globe className="h-5 w-5 text-black" />
            </div>
            <div>
              <CardTitle className="text-white">SEO & Site Info</CardTitle>
              <CardDescription>Configure your site metadata and SEO</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-zinc-400">Site Title</label>
              <Input
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="Your name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-zinc-400">Site Subtitle</label>
              <Input
                value={form.subtitle}
                onChange={(e) => updateField("subtitle", e.target.value)}
                placeholder="Full Stack Developer"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-zinc-400">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Site description for SEO"
              className="flex min-h-[80px] w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-gold/50 focus:border-gold/50 disabled:cursor-not-allowed disabled:opacity-50 transition-colors resize-y"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-zinc-400">Keywords (comma separated)</label>
            <Input
              value={form.keywords}
              onChange={(e) => updateField("keywords", e.target.value)}
              placeholder="portfolio, developer, react"
            />
          </div>
          <div className="flex justify-end">
            <Button
              variant="gold"
              size="sm"
              onClick={() => handleSave("seo")}
              disabled={saving}
            >
              {saving && savingSection === "seo" ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Section
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg gold-bg">
              <Image className="h-5 w-5 text-black" aria-hidden="true" />
            </div>
            <div>
              <CardTitle className="text-white">Profile & Resume</CardTitle>
              <CardDescription>Profile image and resume links</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-zinc-400">Profile Image URL</label>
            <Input
              value={form.profileImage}
              onChange={(e) => updateField("profileImage", e.target.value)}
              placeholder="https://..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-zinc-400">Resume URL</label>
            <Input
              value={form.resumeUrl}
              onChange={(e) => updateField("resumeUrl", e.target.value)}
              placeholder="https://..."
            />
          </div>
          <div className="flex justify-end">
            <Button
              variant="gold"
              size="sm"
              onClick={() => handleSave("profile")}
              disabled={saving}
            >
              {saving && savingSection === "profile" ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Section
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg gold-bg">
              <Link className="h-5 w-5 text-black" />
            </div>
            <div>
              <CardTitle className="text-white">Social Links</CardTitle>
              <CardDescription>Your social media profiles</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-zinc-400">GitHub URL</label>
              <Input
                value={form.githubUrl}
                onChange={(e) => updateField("githubUrl", e.target.value)}
                placeholder="https://github.com/..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-zinc-400">LinkedIn URL</label>
              <Input
                value={form.linkedinUrl}
                onChange={(e) => updateField("linkedinUrl", e.target.value)}
                placeholder="https://linkedin.com/in/..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-zinc-400">Twitter URL</label>
              <Input
                value={form.twitterUrl}
                onChange={(e) => updateField("twitterUrl", e.target.value)}
                placeholder="https://twitter.com/..."
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              variant="gold"
              size="sm"
              onClick={() => handleSave("social")}
              disabled={saving}
            >
              {saving && savingSection === "social" ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Section
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg gold-bg">
              <Mail className="h-5 w-5 text-black" />
            </div>
            <div>
              <CardTitle className="text-white">Contact Info</CardTitle>
              <CardDescription>Your contact details</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-zinc-400">Email</label>
              <Input
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="your@email.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-zinc-400">Phone</label>
              <Input
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                placeholder="+1 234 567 890"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-zinc-400">Location</label>
              <Input
                value={form.location}
                onChange={(e) => updateField("location", e.target.value)}
                placeholder="City, Country"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              variant="gold"
              size="sm"
              onClick={() => handleSave("contact")}
              disabled={saving}
            >
              {saving && savingSection === "contact" ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Section
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg gold-bg">
              <Palette className="h-5 w-5 text-black" />
            </div>
            <div>
              <CardTitle className="text-white">Theme</CardTitle>
              <CardDescription>Customize your site appearance</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-zinc-400">Primary Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={form.primaryColor}
                onChange={(e) => updateField("primaryColor", e.target.value)}
                className="w-10 h-10 rounded-lg border border-white/20 bg-transparent cursor-pointer"
              />
              <Input
                value={form.primaryColor}
                onChange={(e) => updateField("primaryColor", e.target.value)}
                placeholder="#D4AF37"
                className="w-32"
              />
              <div
                className="w-8 h-8 rounded-full border border-white/10"
                style={{ backgroundColor: form.primaryColor }}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              variant="gold"
              size="sm"
              onClick={() => handleSave("theme")}
              disabled={saving}
            >
              {saving && savingSection === "theme" ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Section
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
