import type { Metadata, Viewport } from "next";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL(
    "https://brasa-e-ponto-artesanal.boiledsunbird3.chatgpt.site",
  ),
  title: "Brasa & Ponto | Fogo, sabor e personalidade",
  description:
    "Explore o cardápio da Brasa & Ponto: burgers artesanais, acompanhamentos, bebidas e sobremesas. Personalize seu pedido. Projeto demonstrativo de portfólio.",
  openGraph: {
    title: "Brasa & Ponto — Hambúrgueres artesanais",
    description: "Fogo, sabor e personalidade. Encontre seu próximo favorito.",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/images/hero.webp",
        width: 1600,
        height: 1200,
        alt: "Hambúrguer artesanal Brasa & Ponto",
      },
    ],
  },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/icon.svg" },
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#171714",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
