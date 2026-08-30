"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Fingerprint,
  Laptop,
  Smartphone,
  Tablet,
  KeyRound,
  Trash2,
  Plus,
  Loader2,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Globe,
  Monitor,
  Eye,
  EyeOff,
  LogOut,
  ShieldAlert,
  HelpCircle,
  Lock,
  Sparkles,
  UserCheck,
} from "lucide-react";
import {
  Button,
  Input,
  Label,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@growthcoder/ui";
import { FormError, FormRequiredMark } from "@/components/ui";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { startRegistration } from "@simplewebauthn/browser";
import type { SecurityPasskey, SecuritySession } from "@growthcoder/types";

export default function SecuritySettingsPage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<
    "passkeys" | "sessions" | "password"
  >("passkeys");

  // Passkeys State
  const [passkeys, setPasskeys] = useState<SecurityPasskey[]>([]);
  const [isLoadingPasskeys, setIsLoadingPasskeys] = useState(true);
  const [isRegisteringPasskey, setIsRegisteringPasskey] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [newDeviceName, setNewDeviceName] = useState("");
  const [passkeyToDelete, setPasskeyToDelete] =
    useState<SecurityPasskey | null>(null);
  const [isDeletingPasskey, setIsDeletingPasskey] = useState(false);

  // Sessions State
  const [sessions, setSessions] = useState<SecuritySession[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const [sessionToRevoke, setSessionToRevoke] =
    useState<SecuritySession | null>(null);
  const [isRevokingSession, setIsRevokingSession] = useState(false);
  const [isRevokeOthersModalOpen, setIsRevokeOthersModalOpen] = useState(false);
  const [isRevokingOthers, setIsRevokingOthers] = useState(false);

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>(
    {},
  );
  const [passkeyErrors, setPasskeyErrors] = useState<Record<string, string>>(
    {},
  );

  const clearPasswordError = (field: string) => {
    if (passwordErrors[field]) {
      setPasswordErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const clearPasskeyError = (field: string) => {
    if (passkeyErrors[field]) {
      setPasskeyErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // ==========================================
  // FETCH DATA
  // ==========================================

  const fetchPasskeys = useCallback(async () => {
    setIsLoadingPasskeys(true);
    try {
      const res = await apiClient.get<SecurityPasskey[]>(
        "/api/admin/security/passkeys",
      );
      if (res.success && res.data) {
        setPasskeys(res.data);
      }
    } catch {
      toast.error("Gagal memuat daftar Passkey.");
    } finally {
      setIsLoadingPasskeys(false);
    }
  }, []);

  const fetchSessions = useCallback(async () => {
    setIsLoadingSessions(true);
    try {
      const res = await apiClient.get<SecuritySession[]>(
        "/api/admin/security/sessions",
      );
      if (res.success && res.data) {
        setSessions(res.data);
      }
    } catch {
      toast.error("Gagal memuat daftar sesi aktif.");
    } finally {
      setIsLoadingSessions(false);
    }
  }, []);

  useEffect(() => {
    fetchPasskeys();
    fetchSessions();
  }, [fetchPasskeys, fetchSessions]);

  // ==========================================
  // PASSKEY ACTIONS
  // ==========================================

  const handleStartPasskeyRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeviceName.trim()) {
      setPasskeyErrors({ newDeviceName: "Label / nama perangkat wajib diisi" });
      toast.error("Harap masukkan label atau nama perangkat.");
      return;
    }
    setPasskeyErrors({});

    setIsRegisteringPasskey(true);
    try {
      // 1. Generate challenge options from API
      const optRes = await apiClient.post<any>(
        "/api/auth/passkey/generate-registration-options",
      );
      if (!optRes.success || !optRes.data) {
        throw new Error(
          optRes.message || "Gagal menghasilkan opsi pendaftaran passkey.",
        );
      }

      const options = optRes.data?.options || optRes.data;
      if (!options || !options.challenge) {
        throw new Error("Format challenge registrasi tidak valid dari server.");
      }

      // 2. Prompt browser WebAuthn API
      let attResp;
      try {
        attResp = await startRegistration({ optionsJSON: options });
      } catch (browserErr: unknown) {
        const errorName = (browserErr as Error)?.name || "";
        const errorMsg = (browserErr as Error)?.message || "";
        if (
          errorName === "NotAllowedError" ||
          errorMsg.includes("cancelled") ||
          errorMsg.includes("abort")
        ) {
          throw new Error("Pendaftaran biometrik dibatalkan oleh pengguna.");
        }
        if (errorName === "InvalidStateError") {
          throw new Error("Perangkat ini sudah terdaftar sebagai Passkey.");
        }
        throw new Error(`Sensor biometrik tidak dapat diakses: ${errorMsg}`);
      }

      // 3. Send verification to backend
      const verifyRes = await apiClient.post<any>(
        "/api/auth/passkey/verify-registration",
        {
          response: attResp,
          deviceName: newDeviceName.trim(),
          challenge: options.challenge,
        },
      );

      if (!verifyRes.success) {
        throw new Error(
          verifyRes.message || "Verifikasi pendaftaran Passkey gagal.",
        );
      }

      toast.success(
        `Passkey "${newDeviceName.trim()}" berhasil didaftarkan! Anda kini dapat login menggunakan biometrik.`,
      );
      setIsRegisterModalOpen(false);
      setNewDeviceName("");
      fetchPasskeys();
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat mendaftarkan Passkey.";
      toast.error(msg);
    } finally {
      setIsRegisteringPasskey(false);
    }
  };

  const handleDeletePasskey = async () => {
    if (!passkeyToDelete) return;
    setIsDeletingPasskey(true);
    try {
      const res = await apiClient.delete(
        `/api/admin/security/passkeys/${passkeyToDelete.id}`,
      );
      if (res.success) {
        toast.success(res.message || "Passkey berhasil dihapus.");
        setPasskeyToDelete(null);
        fetchPasskeys();
      } else {
        toast.error(res.message || "Gagal menghapus Passkey.");
      }
    } catch {
      toast.error("Gagal menghubungi server untuk menghapus Passkey.");
    } finally {
      setIsDeletingPasskey(false);
    }
  };

  // ==========================================
  // SESSION ACTIONS
  // ==========================================

  const handleRevokeSession = async () => {
    if (!sessionToRevoke) return;
    setIsRevokingSession(true);
    try {
      const res = await apiClient.delete<any>(
        `/api/admin/security/sessions/${sessionToRevoke.id}`,
      );
      if (res.success) {
        toast.success(res.message || "Sesi berhasil dicabut.");
        const isCurrent = res.data?.isCurrent || sessionToRevoke.isCurrent;
        setSessionToRevoke(null);
        if (isCurrent) {
          await logout();
          router.push("/login");
        } else {
          fetchSessions();
        }
      } else {
        toast.error(res.message || "Gagal mencabut sesi.");
      }
    } catch {
      toast.error("Gagal menghubungi server untuk mencabut sesi.");
    } finally {
      setIsRevokingSession(false);
    }
  };

  const handleRevokeOtherSessions = async () => {
    setIsRevokingOthers(true);
    try {
      const res = await apiClient.post<any>(
        "/api/admin/security/sessions/revoke-others",
      );
      if (res.success) {
        toast.success(res.message || "Seluruh sesi lain berhasil dicabut.");
        setIsRevokeOthersModalOpen(false);
        fetchSessions();
      } else {
        toast.error(res.message || "Gagal mencabut sesi lain.");
      }
    } catch {
      toast.error("Gagal menghubungi server.");
    } finally {
      setIsRevokingOthers(false);
    }
  };

  // ==========================================
  // PASSWORD CHANGE ACTION
  // ==========================================

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!currentPassword) {
      newErrors.currentPassword = "Kata sandi saat ini wajib diisi";
    }
    if (!newPassword) {
      newErrors.newPassword = "Kata sandi baru wajib diisi";
    } else if (newPassword.length < 8) {
      newErrors.newPassword = "Kata sandi baru minimal harus 8 karakter";
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = "Konfirmasi kata sandi baru wajib diisi";
    } else if (newPassword && newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Konfirmasi kata sandi baru tidak cocok";
    }

    if (Object.keys(newErrors).length > 0) {
      setPasswordErrors(newErrors);
      toast.error("Mohon periksa data kata sandi yang belum valid.");
      return;
    }

    setPasswordErrors({});
    setIsUpdatingPassword(true);
    try {
      const res = await apiClient.put("/api/admin/security/password", {
        currentPassword,
        newPassword,
        newPassword_confirmation: confirmPassword,
      });

      if (res.success) {
        toast.success(res.message || "Kata sandi berhasil diperbarui!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setPasswordErrors({});
      } else {
        toast.error(res.message || "Gagal memperbarui kata sandi.");
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
        setPasswordErrors(serverErrors);
      }
      const msg =
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat memperbarui kata sandi.";
      toast.error(msg);
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  // Helper for Session Icon
  const getDeviceIcon = (deviceType: string, os: string) => {
    const osLower = os.toLowerCase();
    if (
      deviceType === "mobile" ||
      osLower.includes("ios") ||
      osLower.includes("android")
    ) {
      return <Smartphone className="w-5 h-5 text-emerald-500" />;
    }
    if (deviceType === "tablet" || osLower.includes("ipad")) {
      return <Tablet className="w-5 h-5 text-teal-500" />;
    }
    if (
      osLower.includes("windows") ||
      osLower.includes("mac") ||
      osLower.includes("linux")
    ) {
      return <Laptop className="w-5 h-5 text-sky-500" />;
    }
    return <Monitor className="w-5 h-5 text-indigo-500" />;
  };

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: "", color: "bg-muted" };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (pass.length >= 12) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 2) return { score, label: "Lemah", color: "bg-rose-500" };
    if (score <= 3) return { score, label: "Sedang", color: "bg-amber-500" };
    return { score, label: "Kuat", color: "bg-emerald-500" };
  };

  const strength = getPasswordStrength(newPassword);
  const otherSessionsCount = sessions.filter((s) => !s.isCurrent).length;

  return (
    <div className="space-y-8 w-full pb-12">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono mb-1">
            <span>Pengaturan</span>
            <span>/</span>
            <span className="text-foreground font-semibold">
              Keamanan & Passkey
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
            <ShieldCheck className="w-7 h-7 text-emerald-500" />
            <span>Pusat Keamanan Akun</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Kelola otentikasi biometrik Passkey (FIDO2), pantau sesi perangkat
            aktif, dan perbarui kata sandi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              fetchPasskeys();
              fetchSessions();
              toast.info("Data keamanan diperbarui.");
            }}
            className="border-border text-xs gap-1.5 h-9"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Segarkan</span>
          </Button>
        </div>
      </div>

      {/* Security Status Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-card/80 border-border backdrop-blur-md shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0">
              <Fingerprint className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">
                Passkey Biometrik
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xl font-bold font-heading text-foreground">
                  {passkeys.length}
                </span>
                <Badge
                  variant="outline"
                  className={`text-[10px] ${
                    passkeys.length > 0
                      ? "border-emerald-500/30 text-emerald-500 bg-emerald-500/10"
                      : "border-amber-500/30 text-amber-500 bg-amber-500/10"
                  }`}
                >
                  {passkeys.length > 0 ? "FIDO2 Aktif" : "Belum Ada Passkey"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/80 border-border backdrop-blur-md shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-500 shrink-0">
              <Monitor className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">
                Sesi Login Aktif
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xl font-bold font-heading text-foreground">
                  {sessions.length}
                </span>
                <Badge
                  variant="outline"
                  className="text-[10px] border-sky-500/30 text-sky-500 bg-sky-500/10 font-mono"
                >
                  {otherSessionsCount} Sesi Lain
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/80 border-border backdrop-blur-md shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">
                Proteksi Kredensial
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs font-semibold text-foreground">
                  {user?.email || "admin@growthcoder.id"}
                </span>
                <Badge
                  variant="outline"
                  className="text-[10px] border-indigo-500/30 text-indigo-400 bg-indigo-500/10"
                >
                  scrypt Hash
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs Container */}
      <Tabs
        value={activeTab}
        onValueChange={(val) =>
          setActiveTab(val as "passkeys" | "sessions" | "password")
        }
        className="space-y-6"
      >
        <div className="flex items-center overflow-x-auto pb-1 no-scrollbar">
          <TabsList className="inline-flex h-auto items-center gap-1.5 p-1.5 bg-muted/50 dark:bg-muted/30 border border-border/70 rounded-2xl backdrop-blur-md shadow-2xs">
            <TabsTrigger
              value="passkeys"
              className="group flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-muted-foreground transition-all duration-200 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-border/80 hover:text-foreground hover:bg-muted/50 cursor-pointer"
            >
              <div className="p-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-data-[state=active]:bg-emerald-500/20 transition-colors">
                <Fingerprint className="w-3.5 h-3.5" />
              </div>
              <span>Passkeys</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-muted text-muted-foreground border border-border/60 group-data-[state=active]:bg-emerald-500/15 group-data-[state=active]:text-emerald-600 dark:group-data-[state=active]:text-emerald-400 group-data-[state=active]:border-emerald-500/30 transition-all">
                {passkeys.length}
              </span>
            </TabsTrigger>

            <TabsTrigger
              value="sessions"
              className="group flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-muted-foreground transition-all duration-200 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-border/80 hover:text-foreground hover:bg-muted/50 cursor-pointer"
            >
              <div className="p-1 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 group-data-[state=active]:bg-sky-500/20 transition-colors">
                <Laptop className="w-3.5 h-3.5" />
              </div>
              <span>Sesi Aktif</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-muted text-muted-foreground border border-border/60 group-data-[state=active]:bg-sky-500/15 group-data-[state=active]:text-sky-600 dark:group-data-[state=active]:text-sky-400 group-data-[state=active]:border-sky-500/30 transition-all">
                {sessions.length}
              </span>
            </TabsTrigger>

            <TabsTrigger
              value="password"
              className="group flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-muted-foreground transition-all duration-200 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-border/80 hover:text-foreground hover:bg-muted/50 cursor-pointer"
            >
              <div className="p-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 group-data-[state=active]:bg-amber-500/20 transition-colors">
                <KeyRound className="w-3.5 h-3.5" />
              </div>
              <span>Ubah Sandi</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: PASSKEYS MANAGEMENT                                                */}
        {/* ========================================================================= */}
        <TabsContent
          value="passkeys"
          className="space-y-6 focus-visible:outline-none"
        >
          {/* Explainer Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/20 via-teal-950/10 to-background border border-emerald-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 shrink-0">
                <Fingerprint className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-heading font-bold text-foreground flex items-center gap-2">
                  <span>Autentikasi Cepat & Aman dengan Passkey</span>
                  <Badge
                    variant="outline"
                    className="text-[10px] border-emerald-500/30 text-emerald-500 bg-emerald-500/10"
                  >
                    FIDO2 / WebAuthn
                  </Badge>
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
                  Passkey memungkinkan Anda masuk ke CMS secara instan
                  menggunakan sensor biometrik perangkat Anda (Windows Hello,
                  Touch ID, Face ID, atau PIN perangkat) tanpa perlu mengetikkan
                  kata sandi.
                </p>
              </div>
            </div>

            <Button
              onClick={() => {
                setNewDeviceName("");
                setIsRegisterModalOpen(true);
              }}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs h-10 px-4 rounded-xl shadow-md gap-2 shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Daftarkan Passkey Baru</span>
            </Button>
          </div>

          {/* Passkeys List */}
          <Card className="border-border bg-card/90 backdrop-blur-md shadow-sm">
            <CardHeader className="border-b border-border pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-heading font-bold text-foreground">
                    Daftar Passkey Terdaftar
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    Perangkat yang memiliki otorisasi login biometrik pada akun
                    administrator Anda
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              {isLoadingPasskeys ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-3 text-muted-foreground">
                  <Loader2 className="w-7 h-7 animate-spin text-emerald-500" />
                  <p className="text-xs">Memuat daftar Passkey biometrik...</p>
                </div>
              ) : passkeys.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-muted/60 border border-border flex items-center justify-center text-muted-foreground">
                    <Fingerprint className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">
                      Belum Ada Passkey yang Didaftarkan
                    </p>
                    <p className="text-xs text-muted-foreground max-w-sm">
                      Tingkatkan keamanan akun dengan mendaftarkan sensor
                      biometrik perangkat Anda sekarang.
                    </p>
                  </div>
                  <Button
                    onClick={() => {
                      setNewDeviceName("");
                      setIsRegisterModalOpen(true);
                    }}
                    variant="outline"
                    className="border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 text-xs h-9 rounded-xl gap-2 mt-2 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Daftarkan Sekarang</span>
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {passkeys.map((pk) => (
                    <div
                      key={pk.id}
                      className="p-4 rounded-xl bg-card border border-border hover:border-emerald-500/30 transition-all flex flex-col justify-between space-y-4 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0 mt-0.5">
                            <Fingerprint className="w-5 h-5" />
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-sm font-semibold text-foreground leading-tight flex items-center gap-2">
                              <span>
                                {pk.deviceName || "Biometrik Passkey"}
                              </span>
                            </h4>
                            <p className="text-[11px] text-muted-foreground font-mono truncate max-w-[14rem] sm:max-w-xs">
                              ID: {pk.credentialId.slice(0, 16)}...
                            </p>
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setPasskeyToDelete(pk)}
                          className="w-8 h-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg cursor-pointer"
                          title="Hapus Passkey"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="pt-2 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                          <span>
                            Dibuat:{" "}
                            {new Date(pk.createdAt).toLocaleDateString(
                              "id-ID",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </span>
                        </div>

                        <div>
                          {pk.lastUsedAt ? (
                            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                              Digunakan:{" "}
                              {new Date(pk.lastUsedAt).toLocaleDateString(
                                "id-ID",
                                {
                                  day: "numeric",
                                  month: "short",
                                },
                              )}
                            </span>
                          ) : (
                            <span className="text-muted-foreground italic">
                              Belum pernah digunakan
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ========================================================================= */}
        {/* TAB 2: ACTIVE SESSIONS & DEVICE MANAGEMENT                                */}
        {/* ========================================================================= */}
        <TabsContent
          value="sessions"
          className="space-y-6 focus-visible:outline-none"
        >
          <Card className="border-border bg-card/90 backdrop-blur-md shadow-sm">
            <CardHeader className="border-b border-border pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-base font-heading font-bold text-foreground flex items-center gap-2">
                    <span>Daftar Sesi Perangkat Aktif</span>
                    <Badge
                      variant="secondary"
                      className="text-[10px] font-mono"
                    >
                      {sessions.length} Terhubung
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground mt-0.5">
                    Daftar perangkat dan browser yang saat ini memiliki token
                    akses masuk ke akun Anda
                  </CardDescription>
                </div>

                {otherSessionsCount > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => setIsRevokeOthersModalOpen(true)}
                    className="border-destructive/30 text-destructive hover:bg-destructive/10 text-xs h-9 px-3 rounded-xl gap-2 cursor-pointer shrink-0"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Cabut Semua Sesi Lain ({otherSessionsCount})</span>
                  </Button>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-6">
              {isLoadingSessions ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-3 text-muted-foreground">
                  <Loader2 className="w-7 h-7 animate-spin text-sky-500" />
                  <p className="text-xs">Memuat sesi aktif...</p>
                </div>
              ) : sessions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
                  <Monitor className="w-8 h-8 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">
                    Tidak ada sesi yang terdeteksi.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {sessions.map((sess) => (
                    <div
                      key={sess.id}
                      className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        sess.isCurrent
                          ? "bg-emerald-500/5 border-emerald-500/30 shadow-sm"
                          : "bg-card border-border hover:border-border/80"
                      }`}
                    >
                      <div className="flex items-start sm:items-center gap-3.5">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            sess.isCurrent
                              ? "bg-emerald-500/10 border border-emerald-500/20"
                              : "bg-muted border border-border"
                          }`}
                        >
                          {getDeviceIcon(sess.deviceType, sess.os)}
                        </div>

                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="text-sm font-semibold text-foreground leading-tight">
                              {sess.os} • {sess.browser}
                            </h4>

                            {sess.isCurrent && (
                              <Badge
                                variant="outline"
                                className="border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 text-[10px] font-semibold flex items-center gap-1.5"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span>Sesi Ini (Perangkat Anda)</span>
                              </Badge>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
                            <span>
                              Login:{" "}
                              {new Date(sess.createdAt).toLocaleDateString(
                                "id-ID",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </span>
                            {sess.lastUsedAt && (
                              <span>
                                Aktif Terakhir:{" "}
                                {new Date(sess.lastUsedAt).toLocaleDateString(
                                  "id-ID",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  },
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSessionToRevoke(sess)}
                          className={`text-xs h-8 px-3 rounded-lg cursor-pointer ${
                            sess.isCurrent
                              ? "text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                              : "text-destructive hover:bg-destructive/10"
                          }`}
                        >
                          <LogOut className="w-3.5 h-3.5 mr-1" />
                          <span>
                            {sess.isCurrent
                              ? "Keluar (Sesi Ini)"
                              : "Cabut Sesi"}
                          </span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ========================================================================= */}
        {/* TAB 3: PASSWORD MANAGEMENT                                                */}
        {/* ========================================================================= */}
        <TabsContent
          value="password"
          className="space-y-6 focus-visible:outline-none"
        >
          <Card className="border-border bg-card/90 backdrop-blur-md shadow-sm max-w-2xl">
            <CardHeader className="border-b border-border pb-4">
              <CardTitle className="text-base font-heading font-bold text-foreground flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-amber-500" />
                <span>Pembaruan Kata Sandi Administrator</span>
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Gunakan kombinasi minimal 8 karakter dengan huruf besar, angka,
                dan simbol untuk keamanan maksimal
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6">
              <form
                onSubmit={handleUpdatePassword}
                className="space-y-5"
                noValidate
              >
                {/* Current Password */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="current-password"
                    className="text-xs font-semibold text-foreground flex items-center"
                  >
                    <span>Kata Sandi Saat Ini</span>
                    <FormRequiredMark />
                  </Label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="current-password"
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder="Masukkan kata sandi saat ini"
                      value={currentPassword}
                      onChange={(e) => {
                        setCurrentPassword(e.target.value);
                        clearPasswordError("currentPassword");
                      }}
                      className={`pl-10 pr-10 h-11 bg-background text-sm rounded-xl ${passwordErrors.currentPassword ? "border-destructive" : ""}`}
                      disabled={isUpdatingPassword}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 cursor-pointer"
                      tabIndex={-1}
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <FormError message={passwordErrors.currentPassword} />
                </div>

                {/* New Password */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="new-password"
                    className="text-xs font-semibold text-foreground flex items-center"
                  >
                    <span>Kata Sandi Baru</span>
                    <FormRequiredMark />
                  </Label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="new-password"
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Minimal 8 karakter"
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        clearPasswordError("newPassword");
                      }}
                      className={`pl-10 pr-10 h-11 bg-background text-sm rounded-xl ${passwordErrors.newPassword ? "border-destructive" : ""}`}
                      disabled={isUpdatingPassword}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 cursor-pointer"
                      tabIndex={-1}
                    >
                      {showNewPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <FormError message={passwordErrors.newPassword} />

                  {/* Password Strength Bar */}
                  {newPassword && (
                    <div className="space-y-1 pt-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-muted-foreground">
                          Kekuatan Kata Sandi:
                        </span>
                        <span className="font-semibold text-foreground">
                          {strength.label}
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${strength.color}`}
                          style={{
                            width: `${Math.min(100, strength.score * 20)}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm New Password */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="confirm-password"
                    className="text-xs font-semibold text-foreground flex items-center"
                  >
                    <span>Konfirmasi Kata Sandi Baru</span>
                    <FormRequiredMark />
                  </Label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Ketik ulang kata sandi baru"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        clearPasswordError("confirmPassword");
                      }}
                      className={`pl-10 pr-10 h-11 bg-background text-sm rounded-xl ${passwordErrors.confirmPassword ? "border-destructive" : ""}`}
                      disabled={isUpdatingPassword}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 cursor-pointer"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <FormError message={passwordErrors.confirmPassword} />
                </div>

                <div className="pt-3 border-t border-border flex justify-end">
                  <Button
                    type="submit"
                    disabled={isUpdatingPassword}
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs h-10 px-6 rounded-xl shadow-md gap-2 cursor-pointer"
                  >
                    {isUpdatingPassword ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Menyimpan Perubahan...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Simpan Kata Sandi Baru</span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ========================================================================= */}
      {/* MODAL 1: REGISTER NEW PASSKEY                                             */}
      {/* ========================================================================= */}
      <Dialog open={isRegisterModalOpen} onOpenChange={setIsRegisterModalOpen}>
        <DialogContent className="sm:max-w-md bg-background border-border p-6 shadow-2xl rounded-2xl">
          <DialogHeader className="space-y-2">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center mb-1">
              <Fingerprint className="w-5 h-5" />
            </div>
            <DialogTitle className="text-lg font-bold text-foreground">
              Daftarkan Passkey Biometrik Baru
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
              Beri nama label perangkat ini agar mudah dikenali (contoh:
              &quot;MacBook Pro Kantor&quot; atau &quot;Windows Hello
              ThinkPad&quot;).
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleStartPasskeyRegistration}
            className="space-y-4 py-1"
            noValidate
          >
            <div className="space-y-1.5">
              <Label
                htmlFor="device-name"
                className="text-xs font-semibold text-foreground flex items-center"
              >
                <span>Nama Perangkat / Nickname</span>
                <FormRequiredMark />
              </Label>
              <Input
                id="device-name"
                placeholder="Contoh: Windows Hello - Laptop Utama"
                value={newDeviceName}
                onChange={(e) => {
                  setNewDeviceName(e.target.value);
                  clearPasskeyError("newDeviceName");
                }}
                autoFocus
                className={`h-10 text-sm ${passkeyErrors.newDeviceName ? "border-destructive" : ""}`}
                disabled={isRegisteringPasskey}
              />
              <FormError message={passkeyErrors.newDeviceName} />
            </div>

            <div className="p-3.5 rounded-xl bg-muted/40 border border-border text-xs text-muted-foreground space-y-1.5">
              <div className="flex items-center gap-1.5 text-foreground font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                <span>Petunjuk Pendaftaran:</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Setelah menekan tombol <strong>Mulai Pindai Biometrik</strong>,
                browser akan menampilkan prompt sistem operasi untuk memindai
                sidik jari, wajah, atau kunci keamanan perangkat Anda.
              </p>
            </div>

            <DialogFooter className="flex items-center justify-end gap-3 pt-4 border-t border-border/70">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsRegisterModalOpen(false)}
                disabled={isRegisteringPasskey}
                className="text-xs h-9 px-4"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isRegisteringPasskey}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-9 px-4 gap-2 shadow-xs"
              >
                {isRegisteringPasskey ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                    <span>Menghubungkan Sensor...</span>
                  </>
                ) : (
                  <>
                    <Fingerprint className="w-3.5 h-3.5" />
                    <span>Mulai Pindai Biometrik</span>
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* MODAL 2: CONFIRM DELETE PASSKEY                                           */}
      {/* ========================================================================= */}
      <Dialog
        open={!!passkeyToDelete}
        onOpenChange={(open) => !open && setPasskeyToDelete(null)}
      >
        <DialogContent className="sm:max-w-md bg-background border-border p-6 shadow-2xl rounded-2xl">
          <DialogHeader className="space-y-2">
            <div className="w-11 h-11 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive flex items-center justify-center mb-1">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <DialogTitle className="text-lg font-bold text-foreground">
              Hapus Passkey Biometrik?
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
              Apakah Anda yakin ingin menghapus Passkey &quot;
              <strong className="text-foreground">
                {passkeyToDelete?.deviceName}
              </strong>
              &quot;? Perangkat ini tidak akan dapat login kembali menggunakan
              biometrik sampai Anda mendaftarkannya ulang.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex items-center justify-end gap-3 mt-5 pt-4 border-t border-border/70">
            <Button
              type="button"
              variant="outline"
              onClick={() => setPasskeyToDelete(null)}
              disabled={isDeletingPasskey}
              className="text-xs h-9 px-4"
            >
              Batal
            </Button>
            <Button
              type="button"
              onClick={handleDeletePasskey}
              disabled={isDeletingPasskey}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground font-semibold text-xs h-9 px-4 gap-2 shadow-xs"
            >
              {isDeletingPasskey ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Menghapus...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Ya, Hapus Passkey</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* MODAL 3: CONFIRM REVOKE SINGLE SESSION                                    */}
      {/* ========================================================================= */}
      <Dialog
        open={!!sessionToRevoke}
        onOpenChange={(open) => !open && setSessionToRevoke(null)}
      >
        <DialogContent className="sm:max-w-md bg-background border-border p-6 shadow-2xl rounded-2xl">
          <DialogHeader className="space-y-2">
            <div className="w-11 h-11 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive flex items-center justify-center mb-1">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <DialogTitle className="text-lg font-bold text-foreground">
              Cabut Sesi Perangkat?
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
              {sessionToRevoke?.isCurrent ? (
                <span>
                  <strong className="text-foreground">Perhatian:</strong> Ini
                  adalah sesi yang sedang Anda gunakan saat ini. Jika dicabut,
                  Anda akan langsung dialihkan ke halaman login.
                </span>
              ) : (
                <span>
                  Sesi pada{" "}
                  <strong className="text-foreground">
                    {sessionToRevoke?.os} • {sessionToRevoke?.browser}
                  </strong>{" "}
                  akan segera dicabut dan pengguna di perangkat tersebut akan
                  dikeluarkan.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex items-center justify-end gap-3 mt-5 pt-4 border-t border-border/70">
            <Button
              type="button"
              variant="outline"
              onClick={() => setSessionToRevoke(null)}
              disabled={isRevokingSession}
              className="text-xs h-9 px-4"
            >
              Batal
            </Button>
            <Button
              type="button"
              onClick={handleRevokeSession}
              disabled={isRevokingSession}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground font-semibold text-xs h-9 px-4 gap-2 shadow-xs"
            >
              {isRevokingSession ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Mencabut...</span>
                </>
              ) : (
                <>
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Ya, Cabut Sesi</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* MODAL 4: CONFIRM REVOKE ALL OTHER SESSIONS                                */}
      {/* ========================================================================= */}
      <Dialog
        open={isRevokeOthersModalOpen}
        onOpenChange={setIsRevokeOthersModalOpen}
      >
        <DialogContent className="sm:max-w-md bg-background border-border p-6 shadow-2xl rounded-2xl">
          <DialogHeader className="space-y-2">
            <div className="w-11 h-11 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive flex items-center justify-center mb-1">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <DialogTitle className="text-lg font-bold text-foreground">
              Cabut Seluruh Sesi Perangkat Lain?
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
              Tindakan ini akan mengeluarkan ({otherSessionsCount}) sesi login
              aktif lainnya dari semua browser dan perangkat lain. Sesi Anda di
              perangkat ini akan tetap aktif.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex items-center justify-end gap-3 mt-5 pt-4 border-t border-border/70">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsRevokeOthersModalOpen(false)}
              disabled={isRevokingOthers}
              className="text-xs h-9 px-4"
            >
              Batal
            </Button>
            <Button
              type="button"
              onClick={handleRevokeOtherSessions}
              disabled={isRevokingOthers}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground font-semibold text-xs h-9 px-4 gap-2 shadow-xs"
            >
              {isRevokingOthers ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Mencabut Semua...</span>
                </>
              ) : (
                <>
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Ya, Cabut Semua Sesi Lain</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
