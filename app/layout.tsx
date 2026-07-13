import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { LangProvider } from "@/context/LangContext";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["900"],
  style: ["italic"],
  variable: "--font-playfair",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Frecuencia Sur Ushuaia",
  description:
    "Trekking y experiencias de montaña en el Fin del Mundo. Excursiones guiadas en Ushuaia, Tierra del Fuego.",
  icons: {
    icon: "/images/logo/logo.png",
    apple: "/images/logo/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable}`}>
      <body style={{ color: "#1a1a1a" }} className="font-sans text-brand-text">
        <LangProvider>
          {children}
          <WhatsAppFloat />
        </LangProvider>
      </body>
    </html>
  );
}
