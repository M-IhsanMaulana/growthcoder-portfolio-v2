import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import { Toaster } from "@growthcoder/ui";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { AuthProvider } from "@/contexts/auth-context";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "GrowthCoder CMS — Admin Panel",
  description:
    "Admin panel CMS untuk manajemen portofolio, artikel, dan integrasi growthcoder.id",
  icons: {
    icon: [
      { url: "/gc-icon.png?v=2", type: "image/png" },
      { url: "/icon.png?v=2", type: "image/png" },
    ],
    apple: [{ url: "/gc-icon.png?v=2" }],
    shortcut: ["/gc-icon.png?v=2"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${outfit.variable} ${plusJakartaSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/gc-icon.png?v=2" type="image/png" />
        <link rel="shortcut icon" href="/gc-icon.png?v=2" type="image/png" />
        <link rel="apple-touch-icon" href="/gc-icon.png?v=2" />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground selection:bg-brand-primary/20 selection:text-brand-primary">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <AuthProvider>
              {children}
              <Toaster />
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
