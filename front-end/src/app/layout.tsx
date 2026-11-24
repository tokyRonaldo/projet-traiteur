// app/layout.tsx
import { Suspense } from 'react';
import { LoadingProvider } from '@/context/LoadingContext';
import GlobalLoader from '@/components/shared/GlobalLoader';
import NavigationLoader from '@/components/shared/NavigationLoader';
import ApiLoadingBridge from '@/components/shared/ApiLoadingBridge';
import { AuthProvider } from '@/context/AuthContext';
import { MobileSidebarProvider } from '@/context/MobileSidebarContext';

import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ToastProvider from "@/components/ui/ToastProvider";

const inter = localFont({
  src: "./fonts/inter-latin-wght-normal.woff2",
  variable: "--font-sans",
  weight: "100 900",
  display: "swap",
});

const rubik = localFont({
  src: [
    { path: "./fonts/rubik-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/rubik-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "./fonts/rubik-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "./fonts/rubik-latin-700-normal.woff2", weight: "700", style: "normal" },
    { path: "./fonts/rubik-latin-800-normal.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kali Tao - Votre carrière online pour le monde de caterers",
  description: "Rejoignez la plateforme dédiée aux professionnels du catering.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${rubik.variable}
                   font-sans antialiased
                   bg-background text-foreground`}
      >
        <MobileSidebarProvider>
          <LoadingProvider>
            <GlobalLoader />
            <Suspense fallback={null}>
              <NavigationLoader />
            </Suspense>
            <ApiLoadingBridge />
            <AuthProvider>
              {children}
              <ToastProvider />
            </AuthProvider>
          </LoadingProvider>
        </MobileSidebarProvider>
      </body>
    </html>
  );
}