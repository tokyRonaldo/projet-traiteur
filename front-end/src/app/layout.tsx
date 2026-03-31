// app/layout.tsx
import type { Metadata } from "next";
import { Inter, Rubik } from "next/font/google";
import "./globals.css";

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
  description: "Rejoignez la plateforme dédiée aux professionnels de la restauration et du catering. Gérez votre carrière, vos missions et votre entreprise en toute simplicité.",
  keywords: ["catering", "caterers", "restauration", "emploi catering", "mission traiteur", "kali tao", "professionnel catering"],
  authors: [{ name: "Kali Tao" }],
  icons: {
    icon: "/favicon.ico",         
    shortcut: "/favicon.ico",
  },
  openGraph: {
    title: "Kali Tao - Votre carrière online pour le monde de caterers",
    description: "La plateforme ultime pour les professionnels du catering et de la restauration.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${rubik.variable}
                   font-sans antialiased
                   bg-background text-foreground
                   selection:bg-primary selection:text-white`}
      >
        {children}
      </body>
    </html>
  );
}