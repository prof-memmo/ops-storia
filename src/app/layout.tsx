import type { Metadata } from "next";
import { Julius_Sans_One } from "next/font/google";
import "./globals.css";

const juliusFont = Julius_Sans_One({ 
  weight: '400',
  subsets: ['latin'],
  variable: '--font-julius'
});

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export const metadata: Metadata = {
  title: "Ops! - Il Gioco Interattivo della Storia",
  description: "Sfida i tuoi compagni e gli Esploratori del Tempo con il gioco di storia interattivo.",
  icons: {
    icon: `${basePath}/favicon.png?v=4`,
    apple: `${basePath}/apple-touch-icon.png?v=4`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className={juliusFont.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Julius+Sans+One&display=swap" rel="stylesheet" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.HUB_GAME_ID = "ops-storia";
              (function() {
                var isPreview = window.location.pathname.includes('/preview') || window.location.hostname === 'localhost';
                var sharedBase = isPreview ? 'https://prof-memmo.github.io/prof-memmo-gestione-siti/preview/shared/' : 'https://prof-memmo.github.io/prof-memmo-gestione-siti/shared/';
                function loadScript(src) {
                  var s = document.createElement('script');
                  s.src = src;
                  s.async = true;
                  document.head.appendChild(s);
                }
                loadScript(sharedBase + 'hub-subscription-guard.js?v=20260910_ops_guard');
                loadScript(sharedBase + 'legal-modal.js?v=20260910_ops_legal');

                // Anti-flicker guard for footer legal links
                var observer = new MutationObserver(function() {
                  document.querySelectorAll('.footer-legal-links').forEach(function(fl) {
                    if (fl && fl.children.length > 0 && fl.children.length < 4) {
                      var cond = fl.querySelector('a[href*="condividi-esperienza"]');
                      if (!cond) {
                        var a = document.createElement('a');
                        a.href = 'https://prof-memmo.github.io/games/condividi-esperienza.html';
                        a.target = '_blank';
                        a.rel = 'noopener noreferrer';
                        a.textContent = 'Condividi Esperienza';
                        a.className = 'hover:text-amber-400 transition-colors text-slate-300';
                        fl.appendChild(a);
                      }
                      var cont = fl.querySelector('button[onclick*="contatti"], a[href*="contatti"]');
                      if (!cont) {
                        var c = document.createElement('a');
                        c.href = 'https://prof-memmo.github.io/ops-storia/contatti';
                        c.textContent = 'Contatti';
                        c.className = 'hover:text-amber-400 transition-colors text-slate-300';
                        fl.insertBefore(c, cond || null);
                      }
                    }
                  });
                });
                observer.observe(document.documentElement, { childList: true, subtree: true });
              })();
            `
          }}
        />
      </head>
      <body className={`${juliusFont.variable} antialiased bg-white text-slate-900 tracking-wider font-sans`}>
        {children}
      </body>
    </html>
  );
}
