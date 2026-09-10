import type { Metadata } from "next";
import { Julius_Sans_One } from "next/font/google";
import "./globals.css";

const juliusFont = Julius_Sans_One({ 
  weight: '400',
  subsets: ['latin'],
  variable: '--font-julius'
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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: 'window.HUB_GAME_ID = "ops-storia";'
          }}
        />
        <script src="https://prof-memmo.github.io/prof-memmo-gestione-siti/shared/hub-subscription-guard.js?v=20260824_ops_guard" async></script>
      </head>
      <body className={`${juliusFont.variable} antialiased bg-white text-slate-900 tracking-wider font-sans`}>
        {children}
      </body>
    </html>
  );
}
