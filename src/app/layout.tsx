import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "PANADEROS - Historial AOE2",
  description: "Historial de partidas de Age of Empires 2 para nuestro grupo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body
        className={`${inter.variable} ${outfit.variable} font-sans antialiased bg-background text-foreground min-h-screen`}
      >
        <div className="fixed inset-0 aoe-gradient -z-10" />
        <Navbar />
        <main className="max-w-md mx-auto px-4 pt-20 pb-24">
          {children}
        </main>
      </body>
    </html>
  );
}
