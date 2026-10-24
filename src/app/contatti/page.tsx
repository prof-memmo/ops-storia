"use client";

import Link from "next/link";
import Header from "@/components/Header";

export default function Contatti() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto p-6 sm:p-12 w-full">
         <h1 className="text-4xl sm:text-5xl font-black text-slate-800 mb-8 uppercase text-center">Contattaci</h1>
         
         <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-md border-2 border-slate-100 text-lg text-slate-600 font-medium">
           <p className="mb-6">Siamo felici di rispondere a qualsiasi tua domanda su Ops! o di fornirti supporto tecnico per il gioco.</p>
           
           <h2 className="text-2xl font-black text-slate-800 mt-8 mb-4">Email</h2>
           <p>Puoi scriverci direttamente all'indirizzo email del Prof. Memmo:</p>
           <a href="mailto:info@profmemmo.it" className="text-2xl font-black text-primary-500 hover:underline block mt-2">info@profmemmo.it</a>
           
           <h2 className="text-2xl font-black text-slate-800 mt-8 mb-4">Assistenza Scuole</h2>
           <p>Sei un insegnante e vuoi portare Ops! nella tua classe? Contattaci specificando il nome del tuo istituto e le tue esigenze.</p>
         </div>
      </main>
      
      {/* Footer Patamu */}
      <footer className="w-full bg-[#171717] text-[#999999] px-4 py-3 flex flex-col items-center justify-center shrink-0 z-20 box-border">
        <div className="footer-legal-links flex justify-center gap-6 mb-2 text-xs uppercase tracking-wider flex-wrap">
          <Link href="/privacy" className="hover:text-amber-400 transition-colors text-slate-300">Privacy Policy</Link>
          <Link href="/termini" className="hover:text-amber-400 transition-colors text-slate-300">Termini e Condizioni</Link>
          <Link href="/contatti" className="hover:text-amber-400 transition-colors text-slate-300">Contatti</Link>
          <a href="https://prof-memmo.github.io/games/condividi-esperienza.html" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors text-slate-300">Condividi Esperienza</a>
        </div>
        <div className="flex w-full items-center justify-start text-left gap-3 sm:gap-4">
           <img src="https://prof-memmo.github.io/prof-memmo-gestione-siti/shared/assets/legal/patamu-badge.png" alt="Patamù" className="h-[52px] w-auto object-contain shrink-0" style={{ height: "52px" }} />
           <p className="text-[10px] sm:text-[11px] leading-relaxed tracking-normal flex-1">
             &copy; 2026 Guglielmo Piersanti. Tutti i contenuti presenti su questo sito sono di proprietà dell'autore e sono protetti tramite deposito e marcatura temporale presso Patamu. I contenuti sono inoltre distribuiti con licenza Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0).
           </p>
        </div>
      </footer>
    </div>
  );
}
