"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useAuth } from "@/hooks/use-auth";
import { Button, Input, FormError, FormRequiredMark } from "@/components/ui";
import {
  Label,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Badge,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@growthcoder/ui";
import {
  Fingerprint,
  Lock,
  Mail,
  ShieldCheck,
  ArrowRight,
  Loader2,
  Sparkles,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  Cpu,
  BarChart3,
  KeyRound,
  Sun,
  Moon,
  Laptop,
} from "lucide-react";
import { toast } from "@growthcoder/ui";

export default function LoginPage() {
  const { loginWithPassword, loginWithPasskey } = useAuth();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [isPasskeyLoading, setIsPasskeyLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"password" | "passkey">(
    "password",
  );
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

  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const newErrors: Record<string, string> = {};
    if (!email.trim()) {
      newErrors.email = "Alamat email wajib diisi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "Format alamat email tidak valid";
    }
    if (!password) {
      newErrors.password = "Kata sandi wajib diisi";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setErrorMessage("Harap lengkapi email dan kata sandi dengan benar.");
      toast.error("Harap lengkapi email dan kata sandi.");
      return;
    }

    setErrors({});
    try {
      setIsPasswordLoading(true);
      await loginWithPassword(email.trim(), password);
      toast.success("Login berhasil! Mengalihkan ke dashboard...");
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Gagal login. Silakan periksa kembali akun Anda.";
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsPasswordLoading(false);
    }
  };

  const handlePasskeyLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    try {
      setIsPasskeyLoading(true);
      toast.info("Memulai autentikasi biometrik Passkey...");
      await loginWithPasskey(email.trim() || undefined);
      toast.success("Autentikasi Passkey berhasil!");
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Verifikasi Passkey biometrik gagal atau dibatalkan.";
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsPasskeyLoading(false);
    }
  };

  // Quick fill helper for development convenience
  const handleQuickFill = () => {
    setEmail("admin@growthcoder.id");
    setPassword("password123");
    toast.info("Kredensial administrator default telah diisikan.");
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-background text-foreground font-sans selection:bg-emerald-500/20 selection:text-emerald-500 transition-colors relative">
      {/* Top Right Theme Switcher */}
      <div className="absolute top-4 right-4 z-50">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="w-9 h-9 border-border bg-card/80 backdrop-blur-md text-foreground hover:bg-muted cursor-pointer shadow-sm"
            >
              {mounted && resolvedTheme === "dark" ? (
                <Moon className="h-4 w-4 text-teal-400" />
              ) : (
                <Sun className="h-4 w-4 text-amber-500" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-popover border-border text-popover-foreground shadow-lg"
          >
            <DropdownMenuItem
              onClick={() => setTheme("light")}
              className="flex items-center gap-2 cursor-pointer hover:bg-muted"
            >
              <Sun className="w-4 h-4 text-amber-500" />
              <span>Terang (Light)</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setTheme("dark")}
              className="flex items-center gap-2 cursor-pointer hover:bg-muted"
            >
              <Moon className="w-4 h-4 text-teal-400" />
              <span>Gelap (Dark)</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setTheme("system")}
              className="flex items-center gap-2 cursor-pointer hover:bg-muted"
            >
              <Laptop className="w-4 h-4 text-muted-foreground" />
              <span>Sistem Default</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* ========================================================================= */}
      {/* LEFT COLUMN: Brand Showcase & Architecture Highlights (Visible on Desktop) */}
      {/* ========================================================================= */}
      <div className="hidden lg:flex lg:w-7/12 relative flex-col justify-between p-12 xl:p-16 bg-slate-900/5 dark:bg-slate-950/60 border-r border-border overflow-hidden">
        {/* Ambient Lighting & Glows */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/15 dark:bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 w-[30rem] h-[30rem] bg-indigo-600/10 dark:bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-teal-500/10 dark:bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Subtle Grid Backdrop */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#33415510_1px,transparent_1px),linear-gradient(to_bottom,#33415510_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

        {/* Top Header Branding with Dynamic Logo */}
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-4">
            {/* Dynamic Logo: logo-gc-dark.png on Light Mode, logo-gc-light.png on Dark Mode */}
            <div className="block dark:hidden">
              <Image
                src="/logo-gc-dark.png"
                alt="GrowthCoder Logo"
                width={220}
                height={56}
                className="h-12 xl:h-14 w-auto object-contain"
                priority
              />
            </div>
            <div className="hidden dark:block">
              <Image
                src="/logo-gc-light.png"
                alt="GrowthCoder Logo"
                width={220}
                height={56}
                className="h-12 xl:h-14 w-auto object-contain"
                priority
              />
            </div>
            <Badge
              variant="outline"
              className="text-[10px] font-mono border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
            >
              CMS v2.0
            </Badge>
          </div>
        </div>

        {/* Middle Hero Showcase Narrative */}
        <div className="relative z-10 space-y-8 my-auto py-10 max-w-xl">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-border text-xs font-medium text-emerald-600 dark:text-emerald-400 backdrop-blur-md shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full-Stack TypeScript Architecture</span>
            </div>

            <h2 className="text-4xl xl:text-5xl font-heading font-extrabold tracking-tight text-foreground leading-tight">
              Pusat Kontrol Portofolio &{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 dark:from-emerald-400 dark:via-teal-300 dark:to-sky-400">
                Analitik Real-Time
              </span>
            </h2>

            <p className="text-base text-muted-foreground leading-relaxed font-normal">
              Kelola seluruh studi kasus proyek, artikel blog, portofolio
              interaktif, dan integrasi otomatisasi Telegram dari satu panel
              kontrol terpadu.
            </p>
          </div>

          {/* Architecture Badges Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-card/80 border border-border backdrop-blur-md space-y-2 hover:border-emerald-500/30 transition-colors shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Cpu className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-semibold text-foreground">
                AdonisJS v6 + Next.js
              </h4>
              <p className="text-[11px] text-muted-foreground leading-normal">
                100% end-to-end type safety dengan PostgreSQL & Lucid ORM.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-card/80 border border-border backdrop-blur-md space-y-2 hover:border-sky-500/30 transition-colors shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-600 dark:text-sky-400">
                <BarChart3 className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-semibold text-foreground">
                Live Analytics
              </h4>
              <p className="text-[11px] text-muted-foreground leading-normal">
                Visualisasi trafik pembaca & monitoring pesan masuk
                terintegrasi.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-card/80 border border-border backdrop-blur-md space-y-2 hover:border-indigo-500/30 transition-colors shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Fingerprint className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-semibold text-foreground">
                WebAuthn Passkey
              </h4>
              <p className="text-[11px] text-muted-foreground leading-normal">
                Autentikasi biometrik FIDO2 (Windows Hello, TouchID, FaceID).
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Profile Status Footer */}
        <div className="relative z-10 flex items-center justify-between pt-6 border-t border-border text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Image
                src="/gc-icon.png"
                alt="Muhammad Ihsan Maulana"
                width={36}
                height={36}
                className="h-8 w-8 object-contain rounded-full border border-border shadow-sm"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
            </div>
            <div>
              <p className="text-foreground font-semibold leading-tight">
                Muhammad Ihsan Maulana
              </p>
              <p className="text-[11px] text-muted-foreground">
                Full-Stack Developer & Automation Specialist
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Sistem Operasional Normal</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* RIGHT COLUMN: Modern Shadcn Login Card Form                                */}
      {/* ========================================================================= */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 lg:p-12 relative">
        {/* Background glow on mobile */}
        <div className="absolute top-1/4 right-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none lg:hidden" />

        <div className="w-full max-w-md space-y-6 relative z-10">
          {/* Mobile Brand Header with Dynamic Logo */}
          <div className="lg:hidden text-center space-y-3 pb-2 flex flex-col items-center">
            <div className="block dark:hidden">
              <Image
                src="/logo-gc-dark.png"
                alt="GrowthCoder Logo"
                width={190}
                height={48}
                className="h-11 w-auto object-contain"
                priority
              />
            </div>
            <div className="hidden dark:block">
              <Image
                src="/logo-gc-light.png"
                alt="GrowthCoder Logo"
                width={190}
                height={48}
                className="h-11 w-auto object-contain"
                priority
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Admin CMS Platform v2.0
            </p>
          </div>

          {/* Main Auth Card */}
          <Card className="border-border bg-card/90 backdrop-blur-2xl shadow-xl rounded-2xl text-card-foreground overflow-hidden">
            <CardHeader className="space-y-1.5 pb-5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-heading font-bold text-foreground tracking-tight">
                  Masuk ke Akun Anda
                </CardTitle>
                <Badge
                  variant="outline"
                  className="border-border text-muted-foreground text-[10px] bg-muted/40 font-mono"
                >
                  <ShieldCheck className="w-3 h-3 text-emerald-500 mr-1" />
                  SSL Protected
                </Badge>
              </div>
              <CardDescription className="text-xs text-muted-foreground">
                Pilih metode masuk yang sesuai dengan preferensi Anda
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              {/* Alert Error Banner */}
              {errorMessage && (
                <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs animate-in fade-in-50 duration-200">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <div className="flex-1 leading-relaxed">
                    <span className="font-semibold block">
                      Gagal Mengakses:
                    </span>
                    <span>{errorMessage}</span>
                  </div>
                </div>
              )}

              {/* Tabs for Password vs Passkey Biometrics */}
              <Tabs
                value={activeTab}
                onValueChange={(val) => {
                  setActiveTab(val as "password" | "passkey");
                  setErrorMessage(null);
                }}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 bg-muted/50 dark:bg-muted/30 p-1.5 border border-border/70 rounded-2xl backdrop-blur-sm mb-4 gap-1">
                  <TabsTrigger
                    value="password"
                    className="group flex items-center justify-center gap-2 rounded-xl text-xs font-semibold py-2 transition-all duration-200 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-border/80 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-amber-500" />
                    <span>Kata Sandi</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="passkey"
                    className="group flex items-center justify-center gap-2 rounded-xl text-xs font-semibold py-2 transition-all duration-200 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-border/80 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <Fingerprint className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Passkey Biometrik</span>
                  </TabsTrigger>
                </TabsList>

                {/* TAB 1: Password Form */}
                <TabsContent
                  value="password"
                  className="space-y-4 focus-visible:outline-none"
                >
                  <form
                    onSubmit={handlePasswordLogin}
                    className="space-y-4"
                    noValidate
                  >
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="email"
                        className="text-xs font-semibold text-foreground flex items-center"
                      >
                        <span>Alamat Email</span>
                        <FormRequiredMark />
                      </Label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="admin@growthcoder.id"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            clearFieldError("email");
                          }}
                          error={errors.email}
                          autoComplete="username webauthn"
                          className="pl-10 h-11 text-sm rounded-xl"
                          disabled={isPasswordLoading}
                        />
                      </div>
                      <FormError message={errors.email} />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label
                          htmlFor="password"
                          className="text-xs font-semibold text-foreground flex items-center"
                        >
                          <span>Kata Sandi</span>
                          <FormRequiredMark />
                        </Label>
                      </div>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••••••"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            clearFieldError("password");
                          }}
                          error={errors.password}
                          autoComplete="current-password"
                          className="pl-10 pr-10 h-11 text-sm rounded-xl"
                          disabled={isPasswordLoading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 transition-colors cursor-pointer"
                          tabIndex={-1}
                          title={
                            showPassword
                              ? "Sembunyikan password"
                              : "Lihat password"
                          }
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <FormError message={errors.password} />
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-11 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 group cursor-pointer mt-2"
                      disabled={isPasswordLoading}
                    >
                      {isPasswordLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                          <span>Memverifikasi Akun...</span>
                        </>
                      ) : (
                        <>
                          <span>Masuk ke Dashboard</span>
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </Button>
                  </form>
                </TabsContent>

                {/* TAB 2: Passkey Biometrics Form */}
                <TabsContent
                  value="passkey"
                  className="space-y-4 focus-visible:outline-none"
                >
                  <div className="p-4 rounded-xl bg-muted/60 border border-border text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-500">
                      <Fingerprint className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-foreground">
                        Login Cepat Tanpa Password
                      </h4>
                      <p className="text-[11px] text-muted-foreground leading-relaxed max-w-xs mx-auto">
                        Gunakan sensor sidik jari, FaceID, atau Windows Hello
                        yang telah Anda daftarkan pada akun ini.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="passkey-email"
                      className="text-xs font-medium text-foreground"
                    >
                      Email Akun (Opsional)
                    </Label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="passkey-email"
                        type="email"
                        placeholder="admin@growthcoder.id"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="username webauthn"
                        className="pl-10 h-11 bg-background border-input text-foreground placeholder:text-muted-foreground focus:border-emerald-500 focus:ring-emerald-500/20 text-sm rounded-xl"
                        disabled={isPasskeyLoading}
                      />
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={handlePasskeyLogin}
                    disabled={isPasskeyLoading}
                    className="w-full h-11 bg-secondary hover:bg-secondary/80 border border-border text-secondary-foreground font-semibold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2.5 group cursor-pointer"
                  >
                    {isPasskeyLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                        <span>Menghubungkan Sensor Biometrik...</span>
                      </>
                    ) : (
                      <>
                        <Fingerprint className="w-5 h-5 text-emerald-500 transition-transform group-hover:scale-110" />
                        <span>Pindai Biometrik (Passkey)</span>
                      </>
                    )}
                  </Button>
                </TabsContent>
              </Tabs>

              {/* Developer Quick-Fill Helper */}
              <div className="pt-2 border-t border-border flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground font-medium">
                  Kredensial Seeder Default
                </span>
                <button
                  type="button"
                  onClick={handleQuickFill}
                  className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>Isi Akun Default</span>
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Security & System Info Footer */}
          <div className="text-center space-y-1 text-xs text-muted-foreground">
            <p>
              © {new Date().getFullYear()} GrowthCoder ID. Hak Cipta Dilindungi.
            </p>
            <p className="text-[10px] text-muted-foreground/80">
              Argon2id / scrypt Hash • SimpleWebAuthn • PostgreSQL
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
