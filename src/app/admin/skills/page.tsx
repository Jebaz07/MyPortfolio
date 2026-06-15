"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Plus,
  Edit2,
  Trash2,
  Loader2,
  Code2,
  ChevronUp,
  ChevronDown,
  PlusCircle,
  FolderKanban,
} from "lucide-react";

interface Skill {
  id: string;
  name: string;
  level: number;
  icon: string | null;
  order: number;
}

interface Category {
  id: string;
  name: string;
  order: number;
  skills: Skill[];
}

export default function AdminSkills() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [catDialogOpen, setCatDialogOpen] = useState(false);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [catName, setCatName] = useState("");

  const [skillDialogOpen, setSkillDialogOpen] = useState(false);
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<string>("");
  const [skillForm, setSkillForm] = useState({ name: "", level: 50, icon: "" });

  const [saving, setSaving] = useState(false);

  const loadCategories = async () => {
    try {
      const res = await fetch("/api/skills");
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to fetch skills");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadCategories();
  }, []);

  const openAddCategory = () => {
    setEditingCatId(null);
    setCatName("");
    setCatDialogOpen(true);
  };

  const openEditCategory = (cat: Category) => {
    setEditingCatId(cat.id);
    setCatName(cat.name);
    setCatDialogOpen(true);
  };

  const saveCategory = async () => {
    if (!catName.trim()) {
      toast.error("Category name is required");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(
        editingCatId ? `/api/skills/categories/${editingCatId}` : "/api/skills/categories",
        {
          method: editingCatId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: catName }),
        }
      );
      if (!res.ok) throw new Error("Failed to save");
      toast.success(editingCatId ? "Category updated" : "Category created");
      setCatDialogOpen(false);
      loadCategories();
    } catch {
      toast.error("Failed to save category");
    } finally {
      setSaving(false);
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const res = await fetch(`/api/skills/categories/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Category deleted");
      loadCategories();
    } catch {
      toast.error("Failed to delete category");
    }
  };

  const openAddSkill = (categoryId: string) => {
    setActiveCategoryId(categoryId);
    setEditingSkillId(null);
    setSkillForm({ name: "", level: 50, icon: "" });
    setSkillDialogOpen(true);
  };

  const openEditSkill = (skill: Skill, categoryId: string) => {
    setActiveCategoryId(categoryId);
    setEditingSkillId(skill.id);
    setSkillForm({ name: skill.name, level: skill.level, icon: skill.icon || "" });
    setSkillDialogOpen(true);
  };

  const saveSkill = async () => {
    if (!skillForm.name.trim()) {
      toast.error("Skill name is required");
      return;
    }
    setSaving(true);
    try {
      const url = editingSkillId
        ? `/api/skills/${editingSkillId}`
        : `/api/skills`;
      const method = editingSkillId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...skillForm, categoryId: activeCategoryId }),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success(editingSkillId ? "Skill updated" : "Skill created");
      setSkillDialogOpen(false);
      loadCategories();
    } catch {
      toast.error("Failed to save skill");
    } finally {
      setSaving(false);
    }
  };

  const deleteSkill = async (id: string) => {
    try {
      const res = await fetch(`/api/skills/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Skill deleted");
      loadCategories();
    } catch {
      toast.error("Failed to delete skill");
    }
  };

  const moveSkill = async (id: string, direction: "up" | "down", skills: Skill[]) => {
    const idx = skills.findIndex((s) => s.id === id);
    if (
      (direction === "up" && idx === 0) ||
      (direction === "down" && idx === skills.length - 1)
    ) return;

    const newSkills = [...skills];
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    [newSkills[idx], newSkills[swapIdx]] = [newSkills[swapIdx], newSkills[idx]];

    try {
      const res = await fetch("/api/skills/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ids: newSkills.map((s) => s.id),
        }),
      });
      if (!res.ok) throw new Error("Failed to reorder");
      toast.success("Reordered");
      loadCategories();
    } catch {
      toast.error("Failed to reorder");
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
          <h1 className="text-3xl font-bold text-white">Skills</h1>
          <p className="text-zinc-400 mt-1">Manage your skills and categories</p>
        </div>
        <Button variant="gold" onClick={openAddCategory}>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-16">
          <Code2 className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
          <p className="text-zinc-500 mb-4">No skill categories yet</p>
          <Button variant="gold" onClick={openAddCategory}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Create First Category
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((cat) => (
            <Card key={cat.id} className="border-white/10 bg-white/5">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div className="flex items-center gap-3">
                  <FolderKanban className="h-5 w-5 text-gold" />
                  <CardTitle className="text-white text-lg">{cat.name}</CardTitle>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={() => openEditCategory(cat)}>
                    <Edit2 className="h-3.5 w-3.5 text-zinc-400" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => deleteCategory(cat.id)}>
                    <Trash2 className="h-3.5 w-3.5 text-red-400" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {cat.skills.length === 0 ? (
                    <p className="text-sm text-zinc-500 text-center py-4">No skills in this category</p>
                  ) : (
                    cat.skills
                      .sort((a, b) => a.order - b.order)
                      .map((skill, idx) => (
                        <div
                          key={skill.id}
                          className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.03] border border-white/5 group"
                        >
                          <div className="flex flex-col gap-0.5">
                            <button
                              onClick={() => moveSkill(skill.id, "up", cat.skills)}
                              className="text-zinc-600 hover:text-gold transition-colors"
                              disabled={idx === 0}
                            >
                              <ChevronUp className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => moveSkill(skill.id, "down", cat.skills)}
                              className="text-zinc-600 hover:text-gold transition-colors"
                              disabled={idx === cat.skills.length - 1}
                            >
                              <ChevronDown className="h-3 w-3" />
                            </button>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-white font-medium">{skill.name}</span>
                              <span className="text-xs text-zinc-500">{skill.level}%</span>
                            </div>
                            <div className="mt-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                              <div
                                className="h-full rounded-full gold-bg transition-all duration-500"
                                style={{ width: `${skill.level}%` }}
                              />
                            </div>
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="sm" onClick={() => openEditSkill(skill, cat.id)}>
                              <Edit2 className="h-3 w-3 text-zinc-400" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => deleteSkill(skill.id)}>
                              <Trash2 className="h-3 w-3 text-red-400" />
                            </Button>
                          </div>
                        </div>
                      ))
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-3"
                  onClick={() => openAddSkill(cat.id)}
                >
                  <Plus className="h-3.5 w-3.5 mr-2" />
                  Add Skill
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={catDialogOpen} onOpenChange={setCatDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCatId ? "Edit Category" : "Add Category"}</DialogTitle>
            <DialogDescription>Enter the category name</DialogDescription>
          </DialogHeader>
          <Input
            value={catName}
            onChange={(e) => setCatName(e.target.value)}
            placeholder="Category name"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setCatDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="gold" onClick={saveCategory} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {editingCatId ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={skillDialogOpen} onOpenChange={setSkillDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingSkillId ? "Edit Skill" : "Add Skill"}</DialogTitle>
            <DialogDescription>Fill in the skill details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-zinc-400">Name</label>
              <Input
                value={skillForm.name}
                onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                placeholder="Skill name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-zinc-400">Level: {skillForm.level}%</label>
              <input
                type="range"
                min={0}
                max={100}
                value={skillForm.level}
                onChange={(e) => setSkillForm({ ...skillForm, level: parseInt(e.target.value) })}
                className="w-full h-2 rounded-full appearance-none bg-white/10 cursor-pointer accent-gold"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-zinc-400">Icon (optional)</label>
              <Input
                value={skillForm.icon}
                onChange={(e) => setSkillForm({ ...skillForm, icon: e.target.value })}
                placeholder="Icon name or URL"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSkillDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="gold" onClick={saveSkill} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {editingSkillId ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

