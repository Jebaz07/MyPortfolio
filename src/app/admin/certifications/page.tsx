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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  Plus,
  Edit2,
  Trash2,
  Loader2,
  Award,
  ExternalLink,
  FileText,
  Image,
} from "lucide-react";

interface Certification {
  id: string;
  title: string;
  issuer: string;
  description: string | null;
  imageUrl: string | null;
  pdfUrl: string | null;
  verificationUrl: string | null;
  issueDate: string | null;
  expiryDate: string | null;
  order: number;
}

interface CertificationForm {
  title: string;
  issuer: string;
  description: string;
  imageUrl: string;
  pdfUrl: string;
  verificationUrl: string;
  issueDate: string;
  expiryDate: string;
  order: number;
}

const emptyForm: CertificationForm = {
  title: "",
  issuer: "",
  description: "",
  imageUrl: "",
  pdfUrl: "",
  verificationUrl: "",
  issueDate: "",
  expiryDate: "",
  order: 0,
};

export default function AdminCertifications() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CertificationForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  const loadCertifications = async () => {
    try {
      const res = await fetch("/api/certifications");
      const data = await res.json();
      setCertifications(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to fetch certifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadCertifications();
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (cert: Certification) => {
    setEditingId(cert.id);
    setForm({
      title: cert.title,
      issuer: cert.issuer,
      description: cert.description || "",
      imageUrl: cert.imageUrl || "",
      pdfUrl: cert.pdfUrl || "",
      verificationUrl: cert.verificationUrl || "",
      issueDate: cert.issueDate ? format(new Date(cert.issueDate), "yyyy-MM-dd") : "",
      expiryDate: cert.expiryDate ? format(new Date(cert.expiryDate), "yyyy-MM-dd") : "",
      order: cert.order,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.issuer) {
      toast.error("Title and issuer are required");
      return;
    }
    setSaving(true);
    try {
      const body = {
        ...form,
        issueDate: form.issueDate ? new Date(form.issueDate).toISOString() : null,
        expiryDate: form.expiryDate ? new Date(form.expiryDate).toISOString() : null,
      };

      const res = await fetch(
        editingId ? `/api/certifications/${editingId}` : "/api/certifications",
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      if (!res.ok) throw new Error("Failed to save");
      toast.success(editingId ? "Certification updated" : "Certification created");
      setDialogOpen(false);
      loadCertifications();
    } catch {
      toast.error("Failed to save certification");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/certifications/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Certification deleted");
      loadCertifications();
    } catch {
      toast.error("Failed to delete certification");
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
          <h1 className="text-3xl font-bold text-white">Certifications</h1>
          <p className="text-zinc-400 mt-1">Manage your certifications and badges</p>
        </div>
        <Button variant="gold" onClick={openAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Certification
        </Button>
      </div>

      {certifications.length === 0 ? (
        <div className="text-center py-16">
          <Award className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
          <p className="text-zinc-500">No certifications added yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {certifications
            .sort((a, b) => a.order - b.order)
            .map((cert) => (
              <Card key={cert.id} className="border-white/10 bg-white/5 hover:bg-white/[0.07] transition-colors group">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-lg gold-bg flex items-center justify-center flex-shrink-0">
                      <Award className="h-6 w-6 text-black" />
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(cert)}>
                        <Edit2 className="h-3.5 w-3.5 text-zinc-400" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(cert.id)}>
                        <Trash2 className="h-3.5 w-3.5 text-red-400" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-white text-base mb-1">{cert.title}</CardTitle>
                  <p className="text-sm text-gold">{cert.issuer}</p>
                  {cert.description && (
                    <p className="text-xs text-zinc-400 mt-2 line-clamp-2">{cert.description}</p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {cert.issueDate && (
                      <span className="text-xs text-zinc-500">
                        Issued: {format(new Date(cert.issueDate), "MMM yyyy")}
                      </span>
                    )}
                    {cert.expiryDate && (
                      <span className="text-xs text-zinc-500">
                        Expires: {format(new Date(cert.expiryDate), "MMM yyyy")}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2 mt-3">
                    {cert.verificationUrl && (
                      <a
                        href={cert.verificationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-gold hover:text-gold-light flex items-center gap-1 transition-colors"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Verify
                      </a>
                    )}
                    {cert.pdfUrl && (
                      <a
                        href={cert.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
                      >
                        <FileText className="h-3 w-3" />
                        PDF
                      </a>
                    )}
                    {cert.imageUrl && (
                      <a
                        href={cert.imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
                      >
                        <Image className="h-3 w-3" aria-hidden="true" />
                        Image
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Certification" : "Add Certification"}</DialogTitle>
            <DialogDescription>
              {editingId ? "Update the certification details" : "Add a new certification"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm text-zinc-400">Title *</label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Certification title"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm text-zinc-400">Issuer *</label>
              <Input
                value={form.issuer}
                onChange={(e) => setForm({ ...form, issuer: e.target.value })}
                placeholder="Issuing organization"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm text-zinc-400">Description</label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Brief description"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-zinc-400">Image URL</label>
              <Input
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-zinc-400">PDF URL</label>
              <Input
                value={form.pdfUrl}
                onChange={(e) => setForm({ ...form, pdfUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-zinc-400">Verification URL</label>
              <Input
                value={form.verificationUrl}
                onChange={(e) => setForm({ ...form, verificationUrl: e.target.value })}
                placeholder="https://..."
              />
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
              <label className="text-sm text-zinc-400">Issue Date</label>
              <Input
                type="date"
                value={form.issueDate}
                onChange={(e) => setForm({ ...form, issueDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-zinc-400">Expiry Date</label>
              <Input
                type="date"
                value={form.expiryDate}
                onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
              />
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

