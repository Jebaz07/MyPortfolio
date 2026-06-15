"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Save, User } from "lucide-react";

interface AboutForm {
  aboutBio: string;
  aboutEducation: string;
  aboutGoals: string;
  heroTitle: string;
  heroSubtitle: string;
}

export default function AdminAbout() {
  const [form, setForm] = useState<AboutForm>({
    aboutBio: "",
    aboutEducation: "",
    aboutGoals: "",
    heroTitle: "",
    heroSubtitle: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        if (data) {
          setForm({
            aboutBio: data.aboutBio || "",
            aboutEducation: data.aboutEducation || "",
            aboutGoals: data.aboutGoals || "",
            heroTitle: data.heroTitle || "",
            heroSubtitle: data.heroSubtitle || "",
          });
        }
      } catch {
        toast.error("Failed to fetch about data");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success("About section updated");
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
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
        <h1 className="text-3xl font-bold text-white">About</h1>
        <p className="text-zinc-400 mt-1">Manage your about section content</p>
      </div>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg gold-bg">
              <User className="h-5 w-5 text-black" />
            </div>
            <div>
              <CardTitle className="text-white">Hero Section</CardTitle>
              <CardDescription>Configure your hero/banner content</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-zinc-400">Hero Title</label>
            <Input
              value={form.heroTitle}
              onChange={(e) => setForm({ ...form, heroTitle: e.target.value })}
              placeholder="Your name / hero title"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-zinc-400">Hero Subtitle</label>
            <Input
              value={form.heroSubtitle}
              onChange={(e) => setForm({ ...form, heroSubtitle: e.target.value })}
              placeholder="Your tagline"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg gold-bg">
              <User className="h-5 w-5 text-black" />
            </div>
            <div>
              <CardTitle className="text-white">About Content</CardTitle>
              <CardDescription>Edit your bio, education, and goals</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-zinc-400">Bio</label>
            <Textarea
              value={form.aboutBio}
              onChange={(e) => setForm({ ...form, aboutBio: e.target.value })}
              placeholder="Write your bio..."
              className="min-h-[150px]"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-zinc-400">Education</label>
            <Textarea
              value={form.aboutEducation}
              onChange={(e) => setForm({ ...form, aboutEducation: e.target.value })}
              placeholder="Describe your education background..."
              className="min-h-[120px]"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-zinc-400">Goals</label>
            <Textarea
              value={form.aboutGoals}
              onChange={(e) => setForm({ ...form, aboutGoals: e.target.value })}
              placeholder="What are your goals?"
              className="min-h-[120px]"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button variant="gold" size="lg" onClick={handleSave} disabled={saving}>
          {saving ? (
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
          ) : (
            <Save className="h-5 w-5 mr-2" />
          )}
          Save Changes
        </Button>
      </div>
    </div>
  );
}
