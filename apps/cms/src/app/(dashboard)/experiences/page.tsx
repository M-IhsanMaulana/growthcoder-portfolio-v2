"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Briefcase,
  GraduationCap,
  Award,
  Plus,
  Search,
  RefreshCw,
  Trash2,
  Loader2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import {
  Button,
  Input,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@growthcoder/ui";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";

import { ExperienceTab } from "@/components/experiences/experience-tab";
import { ExperienceDialog } from "@/components/experiences/experience-dialog";
import { EducationTab } from "@/components/experiences/education-tab";
import { EducationDialog } from "@/components/experiences/education-dialog";
import { CertificationTab } from "@/components/experiences/certification-tab";
import { CertificationDialog } from "@/components/experiences/certification-dialog";

import type {
  Experience,
  Education,
  Certification,
  TechStack,
} from "@growthcoder/types";

type ActiveTab = "experiences" | "educations" | "certifications";

export default function ExperiencesPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("experiences");
  const [search, setSearch] = useState("");

  // Data states
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [techStacks, setTechStacks] = useState<TechStack[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Dialog states - Experience
  const [expDialogOpen, setExpDialogOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);

  // Dialog states - Education
  const [eduDialogOpen, setEduDialogOpen] = useState(false);
  const [editingEdu, setEditingEdu] = useState<Education | null>(null);

  // Dialog states - Certification
  const [certDialogOpen, setCertDialogOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Certification | null>(null);

  // Delete modal states
  const [deleteItem, setDeleteItem] = useState<{
    type: "experience" | "education" | "certification";
    id: string;
    title: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch all career & education data
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [expRes, eduRes, certRes, techRes] = await Promise.all([
        apiClient.get<Experience[]>("/api/admin/experiences"),
        apiClient.get<Education[]>("/api/admin/educations"),
        apiClient.get<Certification[]>("/api/admin/certifications"),
        apiClient.get<TechStack[]>("/api/admin/tech-stacks"),
      ]);

      if (expRes.success && expRes.data) setExperiences(expRes.data);
      if (eduRes.success && eduRes.data) setEducations(eduRes.data);
      if (certRes.success && certRes.data) setCertifications(certRes.data);
      if (techRes.success && techRes.data) setTechStacks(techRes.data);
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(error.message || "Gagal memuat data karir & pendidikan");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filtered lists
  const filteredExperiences = useMemo(() => {
    if (!search.trim()) return experiences;
    const q = search.toLowerCase();
    return experiences.filter(
      (e) =>
        e.company.toLowerCase().includes(q) ||
        e.position.toLowerCase().includes(q) ||
        (e.location && e.location.toLowerCase().includes(q)),
    );
  }, [experiences, search]);

  const filteredEducations = useMemo(() => {
    if (!search.trim()) return educations;
    const q = search.toLowerCase();
    return educations.filter(
      (e) =>
        e.institution.toLowerCase().includes(q) ||
        e.degree.toLowerCase().includes(q) ||
        e.fieldOfStudy.toLowerCase().includes(q),
    );
  }, [educations, search]);

  const filteredCertifications = useMemo(() => {
    if (!search.trim()) return certifications;
    const q = search.toLowerCase();
    return certifications.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.issuer.toLowerCase().includes(q) ||
        (c.credentialId && c.credentialId.toLowerCase().includes(q)),
    );
  }, [certifications, search]);

  // Handlers - Create / Edit
  const handleOpenCreate = () => {
    if (activeTab === "experiences") {
      setEditingExp(null);
      setExpDialogOpen(true);
    } else if (activeTab === "educations") {
      setEditingEdu(null);
      setEduDialogOpen(true);
    } else {
      setEditingCert(null);
      setCertDialogOpen(true);
    }
  };

  // Handlers - Save Success
  const handleExpSaved = (saved: Experience) => {
    setExperiences((prev) => {
      const idx = prev.findIndex((x) => x.id === saved.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = saved;
        return next;
      }
      return [saved, ...prev];
    });
  };

  const handleEduSaved = (saved: Education) => {
    setEducations((prev) => {
      const idx = prev.findIndex((x) => x.id === saved.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = saved;
        return next;
      }
      return [saved, ...prev];
    });
  };

  const handleCertSaved = (saved: Certification) => {
    setCertifications((prev) => {
      const idx = prev.findIndex((x) => x.id === saved.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = saved;
        return next;
      }
      return [saved, ...prev];
    });
  };

  // Handlers - Delete
  const handleDeleteConfirm = async () => {
    if (!deleteItem) return;
    setIsDeleting(true);

    try {
      const endpoint =
        deleteItem.type === "experience"
          ? `/api/admin/experiences/${deleteItem.id}`
          : deleteItem.type === "education"
            ? `/api/admin/educations/${deleteItem.id}`
            : `/api/admin/certifications/${deleteItem.id}`;

      const res = await apiClient.delete(endpoint);
      if (res.success) {
        toast.success(res.message || "Item berhasil dihapus");
        if (deleteItem.type === "experience") {
          setExperiences((prev) => prev.filter((x) => x.id !== deleteItem.id));
        } else if (deleteItem.type === "education") {
          setEducations((prev) => prev.filter((x) => x.id !== deleteItem.id));
        } else {
          setCertifications((prev) =>
            prev.filter((x) => x.id !== deleteItem.id),
          );
        }
        setDeleteItem(null);
      } else {
        toast.error(res.message || "Gagal menghapus item");
      }
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(error.message || "Terjadi kesalahan saat menghapus");
    } finally {
      setIsDeleting(false);
    }
  };

  const getAddButtonText = () => {
    if (activeTab === "experiences") return "Tambah Pengalaman";
    if (activeTab === "educations") return "Tambah Pendidikan";
    return "Tambah Sertifikasi";
  };

  return (
    <div className="space-y-6 w-full pb-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <GraduationCap className="w-7 h-7 text-primary" />
            Karir & Pendidikan
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Kelola rekam jejak pengalaman kerja, riwayat studi formal, dan
            sertifikasi kompetensi profesional
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchData}
            disabled={isLoading}
            className="gap-1.5 text-xs h-9"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>

          <Button
            size="sm"
            onClick={handleOpenCreate}
            className="gap-1.5 text-xs h-9 bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            {getAddButtonText()}
          </Button>
        </div>
      </div>

      {/* Quick Stats Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => setActiveTab("experiences")}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            activeTab === "experiences"
              ? "border-primary bg-primary/5 shadow-xs"
              : "border-border/80 bg-card hover:border-border hover:bg-card/80"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Pengalaman Kerja
            </span>
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground mt-2">
            {experiences.length}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {experiences.filter((e) => e.isCurrent).length} posisi aktif saat
            ini
          </p>
        </div>

        <div
          onClick={() => setActiveTab("educations")}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            activeTab === "educations"
              ? "border-primary bg-primary/5 shadow-xs"
              : "border-border/80 bg-card hover:border-border hover:bg-card/80"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Riwayat Pendidikan
            </span>
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground mt-2">
            {educations.length}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Institusi dan gelar akademis
          </p>
        </div>

        <div
          onClick={() => setActiveTab("certifications")}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            activeTab === "certifications"
              ? "border-primary bg-primary/5 shadow-xs"
              : "border-border/80 bg-card hover:border-border hover:bg-card/80"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Sertifikasi & Lisensi
            </span>
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground mt-2">
            {certifications.length}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Kredensial keahlian terverifikasi
          </p>
        </div>
      </div>

      {/* Navigation Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-2 rounded-2xl border border-border/80 bg-card/60">
        {/* Tabs Switcher */}
        <div className="flex items-center gap-1.5 overflow-x-auto p-1">
          <button
            type="button"
            onClick={() => setActiveTab("experiences")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all shrink-0 cursor-pointer ${
              activeTab === "experiences"
                ? "bg-primary text-primary-foreground shadow-2xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Pengalaman Kerja</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === "experiences"
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {experiences.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("educations")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all shrink-0 cursor-pointer ${
              activeTab === "educations"
                ? "bg-primary text-primary-foreground shadow-2xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Pendidikan</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === "educations"
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {educations.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("certifications")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all shrink-0 cursor-pointer ${
              activeTab === "certifications"
                ? "bg-primary text-primary-foreground shadow-2xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Sertifikasi</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === "certifications"
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {certifications.length}
            </span>
          </button>
        </div>

        {/* Live Search Bar */}
        <div className="relative w-full md:w-72 px-1">
          <Search className="w-3.5 h-3.5 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            placeholder={`Cari dalam ${
              activeTab === "experiences"
                ? "pengalaman kerja"
                : activeTab === "educations"
                  ? "pendidikan"
                  : "sertifikasi"
            }...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs bg-background/50 border-border rounded-xl"
          />
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === "experiences" && (
        <ExperienceTab
          experiences={filteredExperiences}
          isLoading={isLoading}
          onEdit={(item) => {
            setEditingExp(item);
            setExpDialogOpen(true);
          }}
          onDelete={(item) =>
            setDeleteItem({
              type: "experience",
              id: item.id,
              title: `${item.position} di ${item.company}`,
            })
          }
          onOpenCreate={handleOpenCreate}
        />
      )}

      {activeTab === "educations" && (
        <EducationTab
          educations={filteredEducations}
          isLoading={isLoading}
          onEdit={(item) => {
            setEditingEdu(item);
            setEduDialogOpen(true);
          }}
          onDelete={(item) =>
            setDeleteItem({
              type: "education",
              id: item.id,
              title: `${item.degree} di ${item.institution}`,
            })
          }
          onOpenCreate={handleOpenCreate}
        />
      )}

      {activeTab === "certifications" && (
        <CertificationTab
          certifications={filteredCertifications}
          isLoading={isLoading}
          onEdit={(item) => {
            setEditingCert(item);
            setCertDialogOpen(true);
          }}
          onDelete={(item) =>
            setDeleteItem({
              type: "certification",
              id: item.id,
              title: `${item.name} (${item.issuer})`,
            })
          }
          onOpenCreate={handleOpenCreate}
        />
      )}

      {/* Dialog Modals */}
      <ExperienceDialog
        open={expDialogOpen}
        onOpenChange={setExpDialogOpen}
        experience={editingExp}
        availableTechStacks={techStacks}
        onSuccess={handleExpSaved}
      />

      <EducationDialog
        open={eduDialogOpen}
        onOpenChange={setEduDialogOpen}
        education={editingEdu}
        onSuccess={handleEduSaved}
      />

      <CertificationDialog
        open={certDialogOpen}
        onOpenChange={setCertDialogOpen}
        certification={editingCert}
        onSuccess={handleCertSaved}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={Boolean(deleteItem)}
        onOpenChange={(open) => !open && setDeleteItem(null)}
      >
        <DialogContent className="max-w-md p-6 border-border">
          <DialogHeader className="space-y-2">
            <div className="w-11 h-11 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive flex items-center justify-center mb-1">
              <AlertCircle className="w-5 h-5" />
            </div>
            <DialogTitle className="text-lg font-bold text-foreground">
              Konfirmasi Penghapusan
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
              Apakah Anda yakin ingin menghapus{" "}
              <strong className="text-foreground font-semibold">
                &quot;{deleteItem?.title}&quot;
              </strong>
              ? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex items-center justify-end gap-3 mt-5 pt-4 border-t border-border/70">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteItem(null)}
              disabled={isDeleting}
              className="text-xs h-9 px-4"
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="text-xs h-9 px-4 min-w-[90px] font-semibold shadow-xs"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  Menghapus...
                </>
              ) : (
                <>
                  <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                  Hapus
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
