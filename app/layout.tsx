import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost, Pinyon_Script } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/config";

const display = Cormorant_Garamond({ subsets: ["latin"], weight: ["500", "600"], variable: "--font-display", display: "swap" });
const body = Jost({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-body", display: "swap" });
const script = Pinyon_Script({ subsets: ["latin"], weight: "400", variable: "--font-script", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: "Silvana Ferri | Cerimonialista em Mogi Guaçu e região",
  description: "Cerimonial e assessoria para casamentos e festas de 15 anos em Mogi Guaçu e região. Mais de 10 anos cuidando de cada detalhe. Peça seu orçamento no WhatsApp.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "Silvana Ferri | Cerimonialista",
    description: "Cerimonial e assessoria para casamentos e festas de 15 anos em Mogi Guaçu e região.",
    images: [{ url: "/og.jpg", width: 1200, height: 630 }],
    locale: "pt_BR",
    type: "website",
  },
};

export const viewport: Viewport = { themeColor: "#0b0a09", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${body.variable} ${script.variable}`}>
      <head>
        {/* PIXEL / ANALYTICS — cole aqui (Meta Pixel ou Google Analytics) */}
      </head>
      <body>{children}</body>
    </html>
  );
}
