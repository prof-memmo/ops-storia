import Link from "next/link";

export default function Termini() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="bg-white px-4 py-3 flex items-center justify-between shadow-sm sticky top-0 z-10 shrink-0">
        <div className="flex items-center space-x-2 sm:space-x-4 flex-1">
          <Link href="/" className="shrink-0 hover:scale-110 transition-transform">
            <img src="/ops-storia/icons/6.png" alt="Home" className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
          </Link>
          <img src="/ops-storia/images/logo.png" alt="Ops!" className="h-10 sm:h-14 object-contain shrink-0 hidden sm:block" />
        </div>
        
        <div className="flex items-center justify-center flex-1">
           <img src="/ops-storia/images/avatar.png" alt="Prof Memmo" className="h-12 sm:h-16 object-contain" />
        </div>

        <div className="font-black text-sm sm:text-xl text-primary-500 text-right flex-1 tracking-tight">TERMINI</div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto p-6 sm:p-12 w-full">
         <h1 className="text-4xl sm:text-5xl font-black text-slate-800 mb-8 uppercase text-center">Termini e Condizioni</h1>
         
         <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-md border-2 border-slate-100 text-lg text-slate-600 font-medium space-y-6">
           <p>Termini di utilizzo del sito e del gioco Ops!.</p>
           
           <h2 className="text-2xl font-black text-slate-800 mt-8 mb-4">Utilizzo del Materiale</h2>
           <p>I contenuti di questo sito e del gioco, inclusi testi, loghi, illustrazioni e meccaniche, sono distribuiti con licenza Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0).</p>
           <p>Questo significa che è vietata la riproduzione per scopi commerciali e la creazione di opere derivate senza l'esplicito consenso dell'autore.</p>
           
           <h2 className="text-2xl font-black text-slate-800 mt-8 mb-4">Uso Didattico</h2>
           <p>Il gioco è concepito per un uso didattico. Insegnanti ed educatori sono liberi di utilizzarlo nelle proprie classi seguendo le regole fornite, garantendo che non vi sia alcun lucro derivante da tale utilizzo.</p>
         </div>
      </main>

      {/* Footer Patamu */}
      <footer className="w-full bg-[#171717] text-[#999999] px-4 py-2 sm:py-3 flex items-center justify-center shrink-0 z-20">
        <div className="flex max-w-[1200px] w-full items-center justify-center text-left">
           <img src="/ops-storia/images/patamu_pencil.png" alt="Patamù" className="h-8 sm:h-10 mr-4 sm:mr-6 object-contain shrink-0" />
           <p className="text-[9px] sm:text-[11px] leading-tight font-sans tracking-tight">
             &copy; 2026 Guglielmo Piersanti. Tutti i contenuti presenti su questo sito sono di proprietà dell'autore e sono protetti tramite deposito e marcatura temporale presso Patamu. I contenuti sono inoltre distribuiti con licenza Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0).
           </p>
        </div>
      </footer>
    </div>
  );
}
