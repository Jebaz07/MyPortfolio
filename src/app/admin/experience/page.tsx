"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { format } from "date-fns";
import { toLocalDate, toDateInputValue } from "@/lib/date-utils";
import {
  Plus,
  Edit2,
  Trash2,
  Loader2,
  Briefcase,
} from "lucide-react";

interface Experience {
  id: string;
  company: string;
  role: string;
  description: string | null;
  startDate: string;
  endDate: string | null;
  current: boolean;
  type: string;
  location: string | null;
  order: number;
}

interface ExperienceForm {
  company: string;
  role: string;
  description: string;
  startDate: string;
  endDate: string;
  current: boolean;
  type: string;
  location: string;
  order: number;
}

const emptyForm: ExperienceForm = {
  company: "",
  role: "",
  description: "",
  startDate: "",
  endDate: "",
  current: false,
  type: "work",
  location: "",
  order: 0,
};

export default function AdminExperience() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ExperienceForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  const loadExperiences = async () => {
    try {
      const res = await fetch("/api/experience");
      const data = await res.json();
      setExperiences(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to fetch experiences");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadExperiences();
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (exp: Experience) => {
    setEditingId(exp.id);
    setForm({
      company: exp.company,
      role: exp.role,
      description: exp.description || "",
      startDate: toDateInputValue(exp.startDate),
      endDate: toDateInputValue(exp.endDate),
      current: exp.current,
      type: exp.type,
      location: exp.location || "",
      order: exp.order,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.company || !form.role || !form.startDate) {
      toast.error("Company, role, and start date are required");
      return;
    }
    setSaving(true);
    try {
      const body = {
        ...form,
        startDate: new Date(form.startDate).toISOString(),
        endDate: form.current ? null : form.endDate ? new Date(form.endDate).toISOString() : null,
      };

      const res = await fetch(
        editingId ? `/api/experience/${editingId}` : "/api/experience",
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server error (${res.status})`);
      }
      toast.success(editingId ? "Experience updated" : "Experience created");
      setDialogOpen(false);
      loadExperiences();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save experience");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/experience/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server error (${res.status})`);
      }
      toast.success("Experience deleted");
      loadExperiences();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete experience");
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Experience</h1>
          <p className="text-zinc-400 mt-1">Manage your work history</p>
        </div>
        <Button variant="gold" onClick={openAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Experience
        </Button>
      </div>

      {experiences.length === 0 ? (
        <div className="text-center py-16">
          <Briefcase className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
          <p className="text-zinc-500">No experiences added yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {experiences
            .sort((a, b) => a.order - b.order)
            .map((exp) => (
              <Card key={exp.id} className="border-white/10 bg-white/5 hover:bg-white/[0.07] transition-colors">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-white font-medium">{exp.role}</h3>
                        <span className="text-zinc-500">at</span>
                        <span className="text-gold font-medium">{exp.company}</span>
                        <span className="px-2 py-0.5 text-xs rounded-full bg-white/5 text-zinc-400 capitalize">
                          {exp.type}
                        </span>
                        {exp.current && (
                          <span className="px-2 py-0.5 text-xs rounded-full gold-bg text-black font-medium">
                            Current
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-sm text-zinc-500">
                        <span>
                          {format(toLocalDate(exp.startDate) ?? new Date(), "MMM yyyy")} -{" "}
                          {exp.current ? "Present" : exp.endDate ? format(toLocalDate(exp.endDate) ?? new Date(), "MMM yyyy") : ""}
                        </span>
                        {exp.location && (
                          <>
                            <span>•</span>
                            <span>{exp.location}</span>
                          </>
                        )}
                      </div>
                      {exp.description && (
                        <p className="text-sm text-zinc-400 mt-2 line-clamp-2">{exp.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(exp)}>
                        <Edit2 className="h-4 w-4 text-zinc-400" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(exp.id)}>
                        <Trash2 className="h-4 w-4 text-red-400" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Experience" : "Add Experience"}</DialogTitle>
            <DialogDescription>
              {editingId ? "Update the experience details" : "Add a new experience entry"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm text-zinc-400">Company *</label>
              <Input
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                placeholder="Company name"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm text-zinc-400">Role *</label>
              <Input
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                placeholder="Job title"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm text-zinc-400">Description</label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe your responsibilities"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-zinc-400">Start Date *</label>
              <Input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-zinc-400">End Date</label>
              <Input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                disabled={form.current}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-zinc-400">Type</label>
              <Select
                value={form.type}
                onValueChange={(v) => setForm({ ...form, type: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-zinc-400">Order</label>
              <Input
                type="number"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-zinc-400">Location</label>
              <Input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="City, Country"
              />
            </div>
            <div className="flex items-center gap-3 pt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.current}
                  onChange={(e) => setForm({ ...form, current: e.target.checked })}
                  className="w-4 h-4 rounded border-white/20 bg-white/5 text-gold focus:ring-gold"
                />
                <span className="text-sm text-zinc-400">I currently work here</span>
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="gold" onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {editingId ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

