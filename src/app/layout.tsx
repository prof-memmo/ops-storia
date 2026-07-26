import type { Metadata } from "next";
import { Bangers } from "next/font/google";
import "./globals.css";

const comicFont = Bangers({ 
  weight: '400',
  subsets: ['latin'],
  variable: '--font-comic'
});

export const metadata: Metadata = {
  title: "Ops! - Il Gioco Interattivo della Storia",
  description: "Sfida i tuoi compagni e gli Esploratori del Tempo con il gioco di storia interattivo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body className={`${comicFont.variable} antialiased bg-white text-slate-900 tracking-wider font-sans`}>
        {children}
      </body>
    </html>
  );
}
