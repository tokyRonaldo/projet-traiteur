// app/layout.tsx
import { LoadingProvider } from '@/context/LoadingContext';
import GlobalLoader from '@/components/shared/GlobalLoader';
import NavigationLoader from '@/components/shared/NavigationLoader';
import ApiLoadingBridge from '@/components/shared/ApiLoadingBridge';
import { AuthProvider } from '@/context/AuthContext';
import { MobileSidebarProvider } from '@/context/MobileSidebarContext';

import type { Metadata } from "next";
import { Inter, Rubik } from "next/font/google";
import "./globals.css";
import ToastProvider from "@/components/ui/ToastProvider";


const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const rubik = Rubik({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800"],
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
          <NavigationLoader />
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