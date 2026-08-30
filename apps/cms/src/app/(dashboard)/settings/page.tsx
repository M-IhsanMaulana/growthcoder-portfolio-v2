"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Settings,
  User,
  ShieldAlert,
  Send,
  Globe,
  Save,
  RefreshCw,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Lock,
  FileText,
  HelpCircle,
  Layout,
  Sparkles,
  BarChart3,
  Plus,
  Trash2,
  Hash,
} from "lucide-react";
import {
  Button,
  Input,
  Textarea,
  FormError,
  FormRequiredMark,
} from "@/components/ui";
import {
  Switch,
  Badge,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@growthcoder/ui";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import type {
  SiteProfile,
  SiteAboutConfig,
  SiteAppearanceConfig,
  MaintenanceConfig,
  TelegramConfig,
  SeoDefaults,
  StatItem,
} from "@growthcoder/types";
import { AvatarUploadField } from "@/components/settings/avatar-upload-field";
import { DocumentUploadField } from "@/components/settings/document-upload-field";
import { OgImageUploadField } from "@/components/settings/og-image-upload-field";
import { RichEditor } from "@/components/editor/rich-editor";

const defaultStats: StatItem[] = [
  {
    id: "stat-1",
    label: "Tahun Pengalaman",
    value: 5,
    suffix: "+",
    prefix: "",
    order: 1,
  },
  {
    id: "stat-2",
    label: "Proyek & Sistem Produksi",
    value: 25,
    suffix: "+",
    prefix: "",
    order: 2,
  },
  {
    id: "stat-3",
    label: "Target PageSpeed & Core Web Vitals",
    value: 98,
    suffix: "+",
    prefix: "",
    order: 3,
  },
  {
    id: "stat-4",
    label: "Type Safety Contract",
    value: 100,
    suffix: "%",
    prefix: "",
    order: 4,
  },
];

const defaultAppearance: SiteAppearanceConfig = {
  navbarStyle: "floating",
};

const defaultAbout: SiteAboutConfig = {
  storyHtml: `<p>Halo! Saya <strong>Muhammad Ihsan Maulana</strong>, seorang <strong>Full-Stack Software Engineer &amp; System Architect</strong> yang berfokus pada pembangunan sistem perangkat lunak modern yang tangguh, aman, dan berkinerja tinggi.</p><p>Dengan pengalaman bertahun-tahun dalam arsitektur sistem terdistribusi, perancangan API skalabel, dan ekosistem TypeScript end-to-end (Next.js, AdonisJS, Node.js), saya menggabungkan standar kode yang bersih dengan pengalaman pengguna (UX) yang memukau.</p><h3>Filosofi Rekayasa</h3><p>Saya percaya bahwa kode yang baik adalah kode yang mudah dipelihara, teruji dengan andal, dan mampu memberikan nilai nyata bagi bisnis serta para pengguna akhirnya.</p>`,
  yearsOfExperience: "5+ Tahun",
  projectsCompleted: "30+ Proyek",
  clientsSatisfied: "20+ Mitra & Klien",
  availabilityStatus: "Tersedia untuk Kontrak & Konsultasi",
  availabilityActive: true,
  quote: "Code is like humor. When you have to explain it, it’s bad.",
  quoteAuthor: "Cory House",
};

const defaultProfile: SiteProfile = {
  siteName: "GrowthCoder",
  tagline: "Full-Stack Web Developer",
  bio: "Passionate fullstack web developer building high-performance web applications.",
  ownerName: "Muhammad Ihsan Maulana",
  avatarUrl: "",
  cvFileUrl: "",
  email: "admin@growthcoder.id",
  phone: "+62 812 3456 7890",
  roles: ["Full-Stack Web Developer"],
  socials: {
    github: "https://github.com/growthcoder",
    linkedin: "https://linkedin.com/in/growthcoder",
    twitter: "https://twitter.com/growthcoder",
    instagram: "https://instagram.com/growthcoder",
    telegram: "https://t.me/growthcoder",
    whatsapp: "https://wa.me/628123456789",
  },
};

const defaultMaintenance: MaintenanceConfig = {
  isActive: false,
  headline: "Sistem Sedang Dalam Pemeliharaan Terjadwal",
  message:
    "Kami sedang melakukan peningkatan performa infrastruktur dan pembaruan sistem. Mohon kembali beberapa saat lagi.",
  estimatedEndTime: "Hari ini pukul 18:00 WIB",
};

const defaultTelegram: TelegramConfig = {
  botToken: "",
  adminChatId: "",
  notifyOnInbox: true,
  notifyOnPostPublish: true,
};

const defaultSeo: SeoDefaults = {
  metaTitle: "GrowthCoder — Portfolio & Technical Blog",
  metaDescription:
    "Portofolio resmi dan blog teknis Muhammad Ihsan Maulana seputar Full-Stack Engineering, Arsitektur Sistem, dan Desain UI/UX Modern.",
  metaKeywords: [
    "Full-Stack",
    "Next.js",
    "React",
    "Developer Portfolio",
    "TypeScript",
  ],
  ogImageUrl: "",
  googleAnalyticsId: "",
  googleSiteVerification: "",
};

export default function SettingsPage() {
  const [profile, setProfile] = useState<SiteProfile>(defaultProfile);
  const [about, setAbout] = useState<SiteAboutConfig>(defaultAbout);
  const [appearance, setAppearance] =
    useState<SiteAppearanceConfig>(defaultAppearance);
  const [maintenance, setMaintenance] =
    useState<MaintenanceConfig>(defaultMaintenance);
  const [telegram, setTelegram] = useState<TelegramConfig>(defaultTelegram);
  const [seo, setSeo] = useState<SeoDefaults>(defaultSeo);
  const [stats, setStats] = useState<StatItem[]>(defaultStats);
  const [keywordsString, setKeywordsString] = useState("");
  const [rolesString, setRolesString] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isTestingTelegram, setIsTestingTelegram] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const clearFieldError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get<Record<string, unknown>>(
        "/api/admin/settings",
      );
      if (res.success && res.data) {
        if (res.data.profile) {
          const prof = res.data.profile as SiteProfile;
          setProfile({ ...defaultProfile, ...prof });
          setRolesString(
            Array.isArray(prof.roles)
              ? prof.roles.join(", ")
              : typeof prof.roles === "string"
                ? prof.roles
                : defaultProfile.roles?.join(", ") || "",
          );
        }
        if (res.data.about) {
          setAbout({ ...defaultAbout, ...(res.data.about as SiteAboutConfig) });
        }
        if (res.data.appearance) {
          setAppearance({
            ...defaultAppearance,
            ...(res.data.appearance as SiteAppearanceConfig),
          });
        }
        if (res.data.maintenance) {
          setMaintenance({
            ...defaultMaintenance,
            ...(res.data.maintenance as MaintenanceConfig),
          });
        }
        if (res.data.telegram) {
          setTelegram({
            ...defaultTelegram,
            ...(res.data.telegram as TelegramConfig),
          });
        }
        if (res.data.seo) {
          const seoData = { ...defaultSeo, ...(res.data.seo as SeoDefaults) };
          setSeo(seoData);
          setKeywordsString(
            Array.isArray(seoData.metaKeywords)
              ? seoData.metaKeywords.join(", ")
              : "",
          );
        }
        if (res.data.stats) {
          setStats(
            Array.isArray(res.data.stats)
              ? (res.data.stats as StatItem[])
              : defaultStats,
          );
        }
      }
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(error.message || "Gagal memuat pengaturan sistem");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const validateSettings = () => {
    const newErrors: Record<string, string> = {};

    if (!profile.siteName?.trim()) {
      newErrors["profile.siteName"] = "Nama Website (Brand) wajib diisi";
    }
    if (!profile.ownerName?.trim()) {
      newErrors["profile.ownerName"] = "Nama Pemilik / Author wajib diisi";
    }
    if (!profile.email?.trim()) {
      newErrors["profile.email"] = "Email kontak resmi wajib diisi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email.trim())) {
      newErrors["profile.email"] = "Format email tidak valid";
    }

    if (maintenance.isActive) {
      if (!maintenance.headline?.trim()) {
        newErrors["maintenance.headline"] =
          "Headline pesan maintenance wajib diisi saat mode aktif";
      }
      if (!maintenance.message?.trim()) {
        newErrors["maintenance.message"] =
          "Detail pesan maintenance wajib diisi saat mode aktif";
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      // Auto-switch tab to where first error occurred
      const firstKey = Object.keys(newErrors)[0];
      if (firstKey.startsWith("profile.")) setActiveTab("profile");
      else if (firstKey.startsWith("maintenance.")) setActiveTab("maintenance");
      return false;
    }

    return true;
  };

  const handleSaveAll = async () => {
    if (!validateSettings()) {
      toast.error("Mohon lengkapi field pengaturan yang bertanda wajib diisi.");
      return;
    }

    setIsSaving(true);
    try {
      const parsedKeywords = keywordsString
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean);

      const parsedRoles = rolesString
        .split(",")
        .map((r) => r.trim())
        .filter(Boolean);

      const updatedProfile = {
        ...profile,
        roles: parsedRoles,
      };

      const updatedSeo = {
        ...seo,
        metaKeywords: parsedKeywords,
      };

      const payload = {
        settings: {
          profile: updatedProfile,
          about,
          appearance,
          maintenance,
          telegram,
          seo: updatedSeo,
          stats,
        },
      };

      const res = await apiClient.put("/api/admin/settings/bulk", payload);
      if (res.success) {
        toast.success("Seluruh pengaturan berhasil disimpan");
        setErrors({});
      }
    } catch (err: unknown) {
      const error = err as {
        message?: string;
        data?: {
          errors?:
            | Array<{ field: string; message: string }>
            | Record<string, string[]>;
        };
      };
      if (error.data?.errors) {
        const serverErrors: Record<string, string> = {};
        if (Array.isArray(error.data.errors)) {
          error.data.errors.forEach((errItem) => {
            if (errItem.field) serverErrors[errItem.field] = errItem.message;
          });
        } else if (typeof error.data.errors === "object") {
          Object.entries(error.data.errors).forEach(([k, v]) => {
            serverErrors[k] = Array.isArray(v) ? v[0] : String(v);
          });
        }
        setErrors(serverErrors);
      }
      toast.error(error.message || "Gagal menyimpan pengaturan");
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestTelegram = async () => {
    setIsTestingTelegram(true);
    try {
      const res = await apiClient.post("/api/admin/settings/telegram/test", {
        botToken: telegram.botToken,
        chatId: telegram.adminChatId,
      });
      if (res.success) {
        toast.success(
          "Pesan uji coba Telegram berhasil dikirim ke Admin Chat ID!",
        );
      }
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(error.message || "Gagal mengirim pesan uji coba Telegram");
    } finally {
      setIsTestingTelegram(false);
    }
  };

  return (
    <div className="space-y-6 w-full pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-2xs">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Pengaturan Global & Integrasi
              </h1>
              <p className="text-xs text-muted-foreground">
                Konfigurasi profil website, narasi tentang saya, mode
                pemeliharaan, bot Telegram, dan SEO.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchSettings}
            disabled={isLoading || isSaving}
            className="text-xs h-9"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 mr-1.5 ${isLoading ? "animate-spin" : ""}`}
            />
            Muat Ulang
          </Button>
          <Button
            onClick={handleSaveAll}
            disabled={isLoading || isSaving}
            size="sm"
            className="text-xs h-9 bg-primary text-primary-foreground font-semibold shadow-xs"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-1.5" />
                Simpan Semua Pengaturan
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Tabs Container */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <div className="flex items-center overflow-x-auto pb-1 no-scrollbar">
          <TabsList className="inline-flex h-auto items-center gap-1.5 p-1.5 bg-muted/50 dark:bg-muted/30 border border-border/70 rounded-2xl backdrop-blur-md shadow-2xs flex-wrap sm:flex-nowrap">
            <TabsTrigger
              value="profile"
              className="group flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-muted-foreground transition-all duration-200 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-border/80 hover:text-foreground hover:bg-muted/50 cursor-pointer"
            >
              <div className="p-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-data-[state=active]:bg-emerald-500/20 transition-colors">
                <User className="w-3.5 h-3.5" />
              </div>
              <span>Profil Situs</span>
              {Object.keys(errors).some((k) => k.startsWith("profile.")) && (
                <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
              )}
            </TabsTrigger>

            <TabsTrigger
              value="about"
              className="group flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-muted-foreground transition-all duration-200 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-border/80 hover:text-foreground hover:bg-muted/50 cursor-pointer"
            >
              <div className="p-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 group-data-[state=active]:bg-amber-500/20 transition-colors">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span>Tentang Saya</span>
            </TabsTrigger>

            <TabsTrigger
              value="appearance"
              className="group flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-muted-foreground transition-all duration-200 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-border/80 hover:text-foreground hover:bg-muted/50 cursor-pointer"
            >
              <div className="p-1 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 group-data-[state=active]:bg-indigo-500/20 transition-colors">
                <Layout className="w-3.5 h-3.5" />
              </div>
              <span>Tampilan &amp; Tema</span>
            </TabsTrigger>

            <TabsTrigger
              value="stats"
              className="group flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-muted-foreground transition-all duration-200 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-border/80 hover:text-foreground hover:bg-muted/50 cursor-pointer"
            >
              <div className="p-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-data-[state=active]:bg-emerald-500/20 transition-colors">
                <BarChart3 className="w-3.5 h-3.5" />
              </div>
              <span>Statistik Portofolio</span>
            </TabsTrigger>

            <TabsTrigger
              value="maintenance"
              className="group flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-muted-foreground transition-all duration-200 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-border/80 hover:text-foreground hover:bg-muted/50 cursor-pointer"
            >
              <div className="p-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 group-data-[state=active]:bg-amber-500/20 transition-colors">
                <ShieldAlert className="w-3.5 h-3.5" />
              </div>
              <span>Maintenance Mode</span>
              {Object.keys(errors).some((k) =>
                k.startsWith("maintenance."),
              ) && (
                <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
              )}
              {maintenance.isActive ? (
                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  Aktif
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-muted text-muted-foreground border border-border/50">
                  Nonaktif
                </span>
              )}
            </TabsTrigger>

            <TabsTrigger
              value="integrations"
              className="group flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-muted-foreground transition-all duration-200 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-border/80 hover:text-foreground hover:bg-muted/50 cursor-pointer"
            >
              <div className="p-1 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 group-data-[state=active]:bg-sky-500/20 transition-colors">
                <Send className="w-3.5 h-3.5" />
              </div>
              <span>Telegram Bot</span>
            </TabsTrigger>

            <TabsTrigger
              value="seo"
              className="group flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-muted-foreground transition-all duration-200 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-border/80 hover:text-foreground hover:bg-muted/50 cursor-pointer"
            >
              <div className="p-1 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 group-data-[state=active]:bg-teal-500/20 transition-colors">
                <Globe className="w-3.5 h-3.5" />
              </div>
              <span>SEO & Meta</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab 1: Profile */}
        <TabsContent value="profile" className="space-y-4">
          <div className="rounded-2xl border border-border bg-card/60 p-5 md:p-6 space-y-6 shadow-2xs">
            <div>
              <h2 className="text-base font-bold text-foreground">
                Informasi Identitas & Personal
              </h2>
              <p className="text-xs text-muted-foreground">
                Data utama yang tampil pada header, hero section, footer, dan
                kartu tentang saya di website publik.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center">
                  <span>Nama Website (Brand)</span>
                  <FormRequiredMark />
                </label>
                <Input
                  value={profile.siteName}
                  onChange={(e) => {
                    setProfile({ ...profile, siteName: e.target.value });
                    clearFieldError("profile.siteName");
                  }}
                  error={errors["profile.siteName"]}
                  placeholder="Contoh: GrowthCoder"
                  className="text-xs h-9"
                />
                <FormError message={errors["profile.siteName"]} />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center">
                  <span>Nama Pemilik / Author</span>
                  <FormRequiredMark />
                </label>
                <Input
                  value={profile.ownerName}
                  onChange={(e) => {
                    setProfile({ ...profile, ownerName: e.target.value });
                    clearFieldError("profile.ownerName");
                  }}
                  error={errors["profile.ownerName"]}
                  placeholder="Contoh: Muhammad Ihsan Maulana"
                  className="text-xs h-9"
                />
                <FormError message={errors["profile.ownerName"]} />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-foreground">
                  Tagline Profesional
                </label>
                <Input
                  value={profile.tagline}
                  onChange={(e) =>
                    setProfile({ ...profile, tagline: e.target.value })
                  }
                  placeholder="Contoh: Full-Stack Software Engineer & System Architect"
                  className="text-xs h-9"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground">
                    Role Animasi Hero Section (&gt; Role Switcher)
                  </label>
                  <span className="text-[11px] text-muted-foreground">
                    Dipisahkan dengan koma (,)
                  </span>
                </div>
                <Input
                  value={rolesString}
                  onChange={(e) => setRolesString(e.target.value)}
                  placeholder="Contoh: Full-Stack Software Engineer, System & Cloud Architect, Database & API Designer"
                  className="text-xs h-9 font-mono"
                />
                <p className="text-[11px] text-muted-foreground">
                  Daftar spesialisasi yang akan berputar otomatis dengan animasi
                  teks di bawah headline utama website.
                </p>
                {rolesString && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {rolesString
                      .split(",")
                      .map((r) => r.trim())
                      .filter(Boolean)
                      .map((role, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-mono font-medium bg-primary/10 text-primary border border-primary/20"
                        >
                          &gt; {role}
                        </span>
                      ))}
                  </div>
                )}
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-foreground">
                  Bio / Ringkasan Diri
                </label>
                <Textarea
                  value={profile.bio}
                  onChange={(e) =>
                    setProfile({ ...profile, bio: e.target.value })
                  }
                  rows={3}
                  placeholder="Deskripsi singkat mengenai passion dan keahlian rekayasa software..."
                  className="text-xs resize-none"
                />
              </div>

              <div className="space-y-1.5 md:col-span-1">
                <AvatarUploadField
                  value={profile.avatarUrl}
                  onChange={(url) => {
                    setProfile({ ...profile, avatarUrl: url });
                    clearFieldError("profile.avatarUrl");
                  }}
                  label="Avatar Profil"
                  error={errors["profile.avatarUrl"]}
                />
                <FormError message={errors["profile.avatarUrl"]} />
              </div>

              <div className="space-y-1.5 md:col-span-1">
                <DocumentUploadField
                  value={profile.cvFileUrl}
                  onChange={(url) => {
                    setProfile({ ...profile, cvFileUrl: url });
                    clearFieldError("profile.cvFileUrl");
                  }}
                  label="Resume / CV (PDF)"
                  error={errors["profile.cvFileUrl"]}
                />
                <FormError message={errors["profile.cvFileUrl"]} />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center">
                  <span>Email Kontak Resmi</span>
                  <FormRequiredMark />
                </label>
                <Input
                  type="email"
                  value={profile.email}
                  onChange={(e) => {
                    setProfile({ ...profile, email: e.target.value });
                    clearFieldError("profile.email");
                  }}
                  error={errors["profile.email"]}
                  placeholder="admin@growthcoder.id"
                  className="text-xs h-9"
                />
                <FormError message={errors["profile.email"]} />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Nomor Telepon / WhatsApp
                </label>
                <Input
                  value={profile.phone || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, phone: e.target.value })
                  }
                  placeholder="+62 812 3456 7890"
                  className="text-xs h-9"
                />
              </div>
            </div>

            <hr className="border-border" />

            <div>
              <h3 className="text-sm font-bold text-foreground mb-1">
                Tautan Media Sosial
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                URL akun media sosial yang disematkan di footer dan halaman
                kontak.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    GitHub URL
                  </label>
                  <Input
                    value={profile.socials?.github || ""}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        socials: { ...profile.socials, github: e.target.value },
                      })
                    }
                    placeholder="https://github.com/..."
                    className="text-xs h-9"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    LinkedIn URL
                  </label>
                  <Input
                    value={profile.socials?.linkedin || ""}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        socials: {
                          ...profile.socials,
                          linkedin: e.target.value,
                        },
                      })
                    }
                    placeholder="https://linkedin.com/in/..."
                    className="text-xs h-9"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Twitter / X URL
                  </label>
                  <Input
                    value={profile.socials?.twitter || ""}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        socials: {
                          ...profile.socials,
                          twitter: e.target.value,
                        },
                      })
                    }
                    placeholder="https://twitter.com/..."
                    className="text-xs h-9"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Telegram Channel / DM
                  </label>
                  <Input
                    value={profile.socials?.telegram || ""}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        socials: {
                          ...profile.socials,
                          telegram: e.target.value,
                        },
                      })
                    }
                    placeholder="https://t.me/..."
                    className="text-xs h-9"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Instagram URL
                  </label>
                  <Input
                    value={profile.socials?.instagram || ""}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        socials: {
                          ...profile.socials,
                          instagram: e.target.value,
                        },
                      })
                    }
                    placeholder="https://instagram.com/..."
                    className="text-xs h-9"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    WhatsApp / Direct Link
                  </label>
                  <Input
                    value={profile.socials?.whatsapp || ""}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        socials: {
                          ...profile.socials,
                          whatsapp: e.target.value,
                        },
                      })
                    }
                    placeholder="https://wa.me/... atau nomor WhatsApp"
                    className="text-xs h-9"
                  />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Tab: Tentang Saya & Narasi Biografi */}
        <TabsContent value="about" className="space-y-6">
          {/* Card 1: Rich Editor for Biography */}
          <div className="rounded-2xl border border-border bg-card/60 p-5 md:p-6 space-y-6 shadow-2xs">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Biografi Mendalam & Kisah Perjalanan
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Konten narasi biografi lengkap yang tampil di halaman{" "}
                  <code>/about</code> dan <code>/tentang</code>. Menggunakan
                  CKEditor 5 dengan dukungan styling kaya, heading, list, quote,
                  code block, dan upload media asset.
                </p>
              </div>
              <Badge
                variant="outline"
                className="text-[10px] text-amber-600 dark:text-amber-400 border-amber-500/30 bg-amber-500/10"
              >
                CKEditor 5 Studio
              </Badge>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <span>Konten Narasi Biografi</span>
                <span className="text-[10px] font-normal text-muted-foreground">
                  (HTML Rich Content)
                </span>
              </label>
              <div className="min-h-[380px] rounded-xl border border-border/80 overflow-hidden bg-background">
                <RichEditor
                  value={about.storyHtml}
                  onChange={(val) => setAbout({ ...about, storyHtml: val })}
                  placeholder="Ceritakan kisah perjalanan karir, pencapaian teknis, dan filosofi rekayasa Anda..."
                />
              </div>
            </div>
          </div>

          {/* Card 2: Key Metrics & Stats */}
          <div className="rounded-2xl border border-border bg-card/60 p-5 md:p-6 space-y-5 shadow-2xs">
            <div>
              <h2 className="text-base font-bold text-foreground">
                Metrik &amp; Sorotan Statistik (Key Metrics)
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Angka ringkasan yang ditampilkan pada hero section halaman About
                untuk menunjukkan kredibilitas profesional.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Tahun Pengalaman
                </label>
                <Input
                  value={about.yearsOfExperience}
                  onChange={(e) =>
                    setAbout({ ...about, yearsOfExperience: e.target.value })
                  }
                  placeholder="Contoh: 5+ Tahun"
                  className="text-xs h-9"
                />
                <p className="text-[10px] text-muted-foreground">
                  Tampil pada badge counter pengalaman.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Total Proyek Selesai
                </label>
                <Input
                  value={about.projectsCompleted}
                  onChange={(e) =>
                    setAbout({ ...about, projectsCompleted: e.target.value })
                  }
                  placeholder="Contoh: 30+ Proyek"
                  className="text-xs h-9"
                />
                <p className="text-[10px] text-muted-foreground">
                  Tampil pada badge counter portofolio.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Klien &amp; Mitra Puas
                </label>
                <Input
                  value={about.clientsSatisfied}
                  onChange={(e) =>
                    setAbout({ ...about, clientsSatisfied: e.target.value })
                  }
                  placeholder="Contoh: 20+ Mitra & Klien"
                  className="text-xs h-9"
                />
                <p className="text-[10px] text-muted-foreground">
                  Tampil pada badge counter kepuasan.
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: Availability & Engineering Motto */}
          <div className="rounded-2xl border border-border bg-card/60 p-5 md:p-6 space-y-6 shadow-2xs">
            <div>
              <h2 className="text-base font-bold text-foreground">
                Status Ketersediaan &amp; Kutipan Filosofis
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Badge status kerja aktif dan quote moto rekayasa yang
                ditampilkan sebagai pemantik perhatian.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
              {/* Availability Status */}
              <div className="p-4 rounded-xl border border-border/70 bg-muted/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-xs font-bold text-foreground">
                      Status Ketersediaan Kerja
                    </label>
                    <p className="text-[11px] text-muted-foreground">
                      Tampilkan badge indikator hijau aktif di samping foto
                      profil.
                    </p>
                  </div>
                  <Switch
                    checked={about.availabilityActive}
                    onCheckedChange={(val) =>
                      setAbout({ ...about, availabilityActive: val })
                    }
                  />
                </div>

                <div className="space-y-1.5 pt-1">
                  <label className="text-xs font-medium text-foreground">
                    Label Status Ketersediaan
                  </label>
                  <Input
                    value={about.availabilityStatus}
                    onChange={(e) =>
                      setAbout({ ...about, availabilityStatus: e.target.value })
                    }
                    placeholder="Contoh: Tersedia untuk Kontrak & Konsultasi"
                    className="text-xs h-9 bg-background"
                  />
                </div>
              </div>

              {/* Engineering Quote */}
              <div className="p-4 rounded-xl border border-border/70 bg-muted/20 space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">
                    Kutipan / Motto Rekayasa
                  </label>
                  <Input
                    value={about.quote || ""}
                    onChange={(e) =>
                      setAbout({ ...about, quote: e.target.value })
                    }
                    placeholder="Contoh: Code is like humor. When you have to explain it, it’s bad."
                    className="text-xs h-9 bg-background"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Author Kutipan
                  </label>
                  <Input
                    value={about.quoteAuthor || ""}
                    onChange={(e) =>
                      setAbout({ ...about, quoteAuthor: e.target.value })
                    }
                    placeholder="Contoh: Cory House"
                    className="text-xs h-9 bg-background"
                  />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Tab 2: Maintenance Mode */}
        <TabsContent value="maintenance" className="space-y-4">
          <div className="rounded-2xl border border-border bg-card/60 p-5 md:p-6 space-y-6 shadow-2xs">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                  Emergency Maintenance Mode
                  {maintenance.isActive ? (
                    <Badge variant="destructive" className="text-[10px]">
                      AKTIF — WEBSITE DIPROTEKSI
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="text-[10px] text-emerald-500 border-emerald-500/30"
                    >
                      NONAKTIF — WEBSITE NORMAL
                    </Badge>
                  )}
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Saat mode ini diaktifkan, seluruh pengunjung publik akan
                  diarahkan otomatis ke halaman <code>/maintenance</code>.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={maintenance.isActive}
                  onCheckedChange={(val) => {
                    setMaintenance({ ...maintenance, isActive: val });
                    if (!val) {
                      clearFieldError("maintenance.headline");
                      clearFieldError("maintenance.message");
                    }
                  }}
                />
              </div>
            </div>

            {maintenance.isActive && (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">
                    Perhatian: Mode Pemeliharaan Sedang Aktif
                  </p>
                  <p className="mt-0.5 opacity-90">
                    Pengunjung non-admin tidak dapat mengakses artikel dan
                    portofolio hingga mode ini dimatikan kembali.
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center">
                  <span>Headline Pesan Maintenance</span>
                  {maintenance.isActive && <FormRequiredMark />}
                </label>
                <Input
                  value={maintenance.headline || ""}
                  onChange={(e) => {
                    setMaintenance({
                      ...maintenance,
                      headline: e.target.value,
                    });
                    clearFieldError("maintenance.headline");
                  }}
                  error={errors["maintenance.headline"]}
                  placeholder="Sistem Sedang Dalam Pemeliharaan Terjadwal"
                  className="text-xs h-9"
                />
                <FormError message={errors["maintenance.headline"]} />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center">
                  <span>Detail Pesan / Penjelasan</span>
                  {maintenance.isActive && <FormRequiredMark />}
                </label>
                <Textarea
                  value={maintenance.message || ""}
                  onChange={(e) => {
                    setMaintenance({ ...maintenance, message: e.target.value });
                    clearFieldError("maintenance.message");
                  }}
                  error={errors["maintenance.message"]}
                  rows={3}
                  placeholder="Kami sedang melakukan peningkatan performa infrastruktur..."
                  className="text-xs resize-none"
                />
                <FormError message={errors["maintenance.message"]} />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Estimasi Waktu Selesai (Opsional)
                </label>
                <Input
                  value={maintenance.estimatedEndTime || ""}
                  onChange={(e) =>
                    setMaintenance({
                      ...maintenance,
                      estimatedEndTime: e.target.value,
                    })
                  }
                  placeholder="Contoh: Hari ini pukul 18:00 WIB"
                  className="text-xs h-9"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Tab 3: Telegram Bot */}
        <TabsContent value="integrations" className="space-y-4">
          <div className="rounded-2xl border border-border bg-card/60 p-5 md:p-6 space-y-6 shadow-2xs">
            <div>
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                Integrasi Telegram Bot
                <Badge
                  variant="outline"
                  className="text-[10px] text-sky-500 border-sky-500/30"
                >
                  Real-Time Notification
                </Badge>
              </h2>
              <p className="text-xs text-muted-foreground">
                Terima notifikasi instan langsung ke smartphone Anda setiap kali
                ada pesan kontak baru atau pendaftaran newsletter.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-card border border-border space-y-4">
              <div>
                <h3 className="text-xs font-bold text-foreground">
                  Kredensial Telegram Bot
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  Kirim pesan broadcast ke channel/grup Telegram pribadi Anda
                  secara realtime
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-border">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Telegram Bot Token
                  </label>
                  <Input
                    type="password"
                    value={telegram.botToken || ""}
                    onChange={(e) =>
                      setTelegram({ ...telegram, botToken: e.target.value })
                    }
                    placeholder="123456789:ABCdefGhIJKlmNoPQRstuVWXyz"
                    className="text-xs font-mono h-9"
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Dapatkan dari @BotFather di Telegram
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Target Admin Chat ID / Channel ID
                  </label>
                  <Input
                    value={telegram.adminChatId || ""}
                    onChange={(e) =>
                      setTelegram({ ...telegram, adminChatId: e.target.value })
                    }
                    placeholder="-100123456789 atau ID User"
                    className="text-xs font-mono h-9"
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Dapatkan ID via @userinfobot
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-border space-y-3">
                <h4 className="text-xs font-bold text-foreground">
                  Pemicu Notifikasi (Event Triggers)
                </h4>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-foreground">
                    Pesan Form Kontak Baru Masuk
                  </span>
                  <Switch
                    checked={telegram.notifyOnInbox}
                    onCheckedChange={(val) =>
                      setTelegram({ ...telegram, notifyOnInbox: val })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-foreground">
                    Notifikasi Publikasi Post/Artikel Baru
                  </span>
                  <Switch
                    checked={telegram.notifyOnPostPublish}
                    onCheckedChange={(val) =>
                      setTelegram({ ...telegram, notifyOnPostPublish: val })
                    }
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between gap-3">
                <p className="text-[11px] text-muted-foreground">
                  Uji token & chat ID dengan mengirimkan pesan verifikasi
                  langsung ke Telegram.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleTestTelegram}
                  disabled={isTestingTelegram || !telegram.adminChatId}
                  className="h-8 text-xs font-semibold shrink-0 gap-1.5"
                >
                  {isTestingTelegram ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5 text-sky-500" />
                  )}
                  <span>
                    {isTestingTelegram
                      ? "Mengirim..."
                      : "Uji Notifikasi Telegram"}
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Tab 4: SEO & Meta */}
        <TabsContent value="seo" className="space-y-4">
          <div className="rounded-2xl border border-border bg-card/60 p-5 md:p-6 space-y-6 shadow-2xs">
            <div>
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                SEO Default & Search Engine Visibility
                <Badge
                  variant="outline"
                  className="text-[10px] text-teal-500 border-teal-500/30"
                >
                  SERP Metadata
                </Badge>
              </h2>
              <p className="text-xs text-muted-foreground">
                Konfigurasi OpenGraph, Google Site Verification, dan meta tag
                bawaan untuk halaman web.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Default Meta Title
                </label>
                <Input
                  value={seo.metaTitle}
                  onChange={(e) =>
                    setSeo({ ...seo, metaTitle: e.target.value })
                  }
                  placeholder="GrowthCoder — Portfolio & Technical Blog"
                  className="text-xs h-9"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Default Meta Description
                </label>
                <Textarea
                  value={seo.metaDescription}
                  onChange={(e) =>
                    setSeo({ ...seo, metaDescription: e.target.value })
                  }
                  rows={3}
                  placeholder="Deskripsi singkat seputar website untuk mesin pencari Google..."
                  className="text-xs resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Meta Keywords (Pisahkan dengan koma)
                </label>
                <Input
                  value={keywordsString}
                  onChange={(e) => setKeywordsString(e.target.value)}
                  placeholder="Full-Stack, Next.js, Developer Portfolio, React"
                  className="text-xs h-9"
                />
              </div>

              <div className="pt-2 border-t border-border">
                <OgImageUploadField
                  value={seo.ogImageUrl || ""}
                  onChange={(url) => setSeo({ ...seo, ogImageUrl: url })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-border">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Google Analytics Measurement ID
                  </label>
                  <Input
                    value={seo.googleAnalyticsId || ""}
                    onChange={(e) =>
                      setSeo({ ...seo, googleAnalyticsId: e.target.value })
                    }
                    placeholder="G-XXXXXXXXXX"
                    className="text-xs font-mono h-9"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Google Search Console Verification Code
                  </label>
                  <Input
                    value={seo.googleSiteVerification || ""}
                    onChange={(e) =>
                      setSeo({ ...seo, googleSiteVerification: e.target.value })
                    }
                    placeholder="google-site-verification=..."
                    className="text-xs font-mono h-9"
                  />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Tab: Appearance (Tampilan & Tema) */}
        <TabsContent value="appearance" className="space-y-4">
          <div className="rounded-2xl border border-border bg-card/60 p-5 md:p-6 space-y-6 shadow-2xs">
            <div>
              <h2 className="text-base font-bold text-foreground">
                Gaya Navigasi & Header Publik
              </h2>
              <p className="text-xs text-muted-foreground">
                Pilih tata letak navigasi utama (Navbar) yang ditampilkan kepada
                pengunjung di website publik.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Option 1: Floating Centered Pill */}
              <div
                onClick={() =>
                  setAppearance({ ...appearance, navbarStyle: "floating" })
                }
                className={`relative group cursor-pointer rounded-2xl border p-5 transition-all duration-200 overflow-hidden ${
                  appearance.navbarStyle === "floating"
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-md"
                    : "border-border/80 bg-muted/20 hover:border-border hover:bg-muted/40"
                }`}
              >
                {/* Selection Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        appearance.navbarStyle === "floating"
                          ? "border-primary bg-primary text-white"
                          : "border-muted-foreground/40"
                      }`}
                    >
                      {appearance.navbarStyle === "floating" && (
                        <CheckCircle2 className="w-3 h-3 stroke-[3]" />
                      )}
                    </div>
                    <span className="text-sm font-bold text-foreground">
                      Versi 1: Floating Centered Pill
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                  >
                    Default Modern
                  </Badge>
                </div>

                {/* Visual Mockup Preview */}
                <div className="w-full h-28 rounded-xl bg-background/80 border border-border/60 p-3 relative flex flex-col items-center justify-center overflow-hidden mb-4 shadow-inner">
                  <div className="absolute top-2 w-3/4 h-8 rounded-full border border-border/80 bg-card/90 shadow-sm backdrop-blur-md px-3 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3.5 h-3.5 rounded-md bg-gradient-to-br from-primary to-emerald-500" />
                      <div className="w-10 h-1.5 rounded-full bg-muted-foreground/40" />
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-6 h-1 rounded-full bg-primary" />
                      <div className="w-6 h-1 rounded-full bg-muted-foreground/30" />
                      <div className="w-6 h-1 rounded-full bg-muted-foreground/30" />
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3.5 h-3.5 rounded-full bg-muted-foreground/20" />
                      <div className="w-8 h-3.5 rounded-full bg-primary/80" />
                    </div>
                  </div>

                  <div className="mt-8 space-y-1.5 w-full px-4">
                    <div className="w-1/2 h-2 rounded bg-muted-foreground/20 mx-auto" />
                    <div className="w-3/4 h-1.5 rounded bg-muted-foreground/10 mx-auto" />
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  Navbar berbentuk kapsul melayang (floating pill) di tengah
                  atas layar dengan backdrop blur glassmorphism dan animasi
                  active pill.
                </p>
              </div>

              {/* Option 2: Full-Width Sticky Header */}
              <div
                onClick={() =>
                  setAppearance({ ...appearance, navbarStyle: "full_width" })
                }
                className={`relative group cursor-pointer rounded-2xl border p-5 transition-all duration-200 overflow-hidden ${
                  appearance.navbarStyle === "full_width"
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-md"
                    : "border-border/80 bg-muted/20 hover:border-border hover:bg-muted/40"
                }`}
              >
                {/* Selection Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        appearance.navbarStyle === "full_width"
                          ? "border-primary bg-primary text-white"
                          : "border-muted-foreground/40"
                      }`}
                    >
                      {appearance.navbarStyle === "full_width" && (
                        <CheckCircle2 className="w-3 h-3 stroke-[3]" />
                      )}
                    </div>
                    <span className="text-sm font-bold text-foreground">
                      Versi 2: Full-Width Sticky Header
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30"
                  >
                    Classic Standard
                  </Badge>
                </div>

                {/* Visual Mockup Preview */}
                <div className="w-full h-28 rounded-xl bg-background/80 border border-border/60 p-0 relative flex flex-col justify-start overflow-hidden mb-4 shadow-inner">
                  <div className="w-full h-8 border-b border-border/80 bg-card/90 px-3 flex items-center justify-between shadow-2xs">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3.5 h-3.5 rounded-md bg-gradient-to-br from-primary to-emerald-500" />
                      <div className="w-12 h-1.5 rounded-full bg-muted-foreground/40" />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="relative flex flex-col items-center">
                        <div className="w-6 h-1 rounded-full bg-foreground" />
                        <div className="absolute -bottom-2 w-6 h-[2px] rounded-full bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-400" />
                      </div>
                      <div className="w-6 h-1 rounded-full bg-muted-foreground/30" />
                      <div className="w-6 h-1 rounded-full bg-muted-foreground/30" />
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3.5 h-3.5 rounded-full bg-muted-foreground/20" />
                      <div className="w-8 h-3.5 rounded-full bg-primary/80" />
                    </div>
                  </div>

                  <div className="mt-5 space-y-1.5 w-full px-4">
                    <div className="w-1/2 h-2 rounded bg-muted-foreground/20 mx-auto" />
                    <div className="w-3/4 h-1.5 rounded bg-muted-foreground/10 mx-auto" />
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  Header menempel penuh dari ujung ke ujung layar (edge-to-edge)
                  di bagian atas dengan border bawah dan backdrop blur yang
                  elegan.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Tab: Portfolio Stats */}
        <TabsContent value="stats" className="space-y-4">
          <div className="rounded-2xl border border-border bg-card/60 p-5 md:p-6 space-y-6 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-emerald-500" />
                  <span>Statistik Portofolio & Rekayasa</span>
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Kelola baris angka statistik (counter) yang tampil pada
                  ringkasan keahlian di beranda website publik.
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const newStat: StatItem = {
                    id: `stat-${Date.now()}`,
                    label: "Statistik Baru",
                    value: 10,
                    suffix: "+",
                    prefix: "",
                    order: stats.length + 1,
                  };
                  setStats([...stats, newStat]);
                }}
                className="text-xs h-8 border-primary/40 text-primary hover:bg-primary/10 gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Tambah Counter Stat
              </Button>
            </div>

            {/* Stats Editor Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stats.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="rounded-2xl border border-border/80 bg-background/60 p-4 space-y-3 relative group transition-all duration-200 hover:border-emerald-500/40 hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                      Stat #{idx + 1}
                    </span>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setStats(stats.filter((_, i) => i !== idx));
                      }}
                      className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      title="Hapus Stat"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Label Metrik / Deskripsi Singkat
                    </label>
                    <Input
                      value={item.label}
                      onChange={(e) => {
                        const updated = [...stats];
                        updated[idx].label = e.target.value;
                        setStats(updated);
                      }}
                      placeholder="Contoh: Tahun Pengalaman, Proyek Selesai"
                      className="text-xs h-9"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2.5">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-muted-foreground">
                        Nilai Angka
                      </label>
                      <Input
                        type="number"
                        value={item.value}
                        onChange={(e) => {
                          const updated = [...stats];
                          updated[idx].value = Number(e.target.value) || 0;
                          setStats(updated);
                        }}
                        className="text-xs h-8"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-muted-foreground">
                        Suffix (+, %, x)
                      </label>
                      <Input
                        value={item.suffix || ""}
                        onChange={(e) => {
                          const updated = [...stats];
                          updated[idx].suffix = e.target.value;
                          setStats(updated);
                        }}
                        placeholder="e.g. +"
                        className="text-xs h-8"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-muted-foreground">
                        Urutan Tampil
                      </label>
                      <Input
                        type="number"
                        value={item.order ?? idx + 1}
                        onChange={(e) => {
                          const updated = [...stats];
                          updated[idx].order = Number(e.target.value) || 0;
                          setStats(updated);
                        }}
                        className="text-xs h-8"
                      />
                    </div>
                  </div>

                  {/* Live Counter Mini Preview */}
                  <div className="mt-2 pt-2 border-t border-border/40 flex items-center justify-between text-xs">
                    <span className="text-[10.5px] text-muted-foreground">
                      Pratinjau Tampilan:
                    </span>
                    <div className="font-extrabold text-sm text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-500">
                      {item.prefix || ""}
                      {item.value}
                      {item.suffix || ""}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {stats.length === 0 && (
              <div className="p-8 text-center rounded-2xl border border-dashed border-border bg-muted/20 space-y-2">
                <BarChart3 className="w-8 h-8 text-muted-foreground mx-auto" />
                <p className="text-xs text-muted-foreground">
                  Belum ada baris statistik yang dikonfigurasi. Klik tombol di
                  atas untuk menambahkan.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
