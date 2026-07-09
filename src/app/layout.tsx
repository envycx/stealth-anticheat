import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { LicenseProvider } from "@/contexts/LicenseContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Stealth — Premium Anti-Cheat Platform",
  description:
    "Kernel-level and usermode anti-cheat protection for competitive gaming. Real-time detection, low false-positive rate, and developer-friendly API.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-[#0a0a0f] text-slate-200">
        <AuthProvider>
          <LicenseProvider>
            {children}
          </LicenseProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
