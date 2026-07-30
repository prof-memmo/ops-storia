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
           <p><strong>Ultimo aggiornamento: 31/04/26</strong></p>

           <h2 className="text-xl sm:text-2xl font-black text-slate-800 mt-8 mb-4">1. Titolare del sito</h2>
           <p>Il presente sito web è gestito da: Guglielmo Piersanti. Email di contatto: <a href="mailto:prof.memmo@gmail.com" className="text-primary-500 hover:underline">prof.memmo@gmail.com</a></p>

           <h2 className="text-xl sm:text-2xl font-black text-slate-800 mt-8 mb-4">2. Accettazione dei termini</h2>
           <p>L’accesso e l’utilizzo del sito implicano l’accettazione dei presenti Termini e Condizioni. Se non si accettano tali condizioni, si invita a non utilizzare il sito.</p>

           <h2 className="text-xl sm:text-2xl font-black text-slate-800 mt-8 mb-4">3. Descrizione del servizio</h2>
           <p>Il sito ha finalità informative ed educative. Gli utenti possono: Consultare i contenuti disponibili e usufruire della piattaforma di gioco. Contattare il gestore tramite modulo di contatto.</p>

           <h2 className="text-xl sm:text-2xl font-black text-slate-800 mt-8 mb-4">4. Utilizzo del sito</h2>
           <p>L’utente si impegna a utilizzare il sito in modo lecito e corretto, evitando di: Inviare messaggi offensivi, illeciti o spam; Tentare di compromettere la sicurezza del sito; Utilizzare il sito per scopi fraudolenti.</p>

           <h2 className="text-xl sm:text-2xl font-black text-slate-800 mt-8 mb-4">5. Modulo di contatto</h2>
           <p>L’utente è responsabile dei dati e dei contenuti inviati tramite il modulo di contatto. È vietato: Inserire dati falsi o di terzi senza autorizzazione; Inviare contenuti illeciti o non pertinenti.</p>

           <h2 className="text-xl sm:text-2xl font-black text-slate-800 mt-8 mb-4">6. Proprietà intellettuale</h2>
           <p>Tutti i contenuti del sito (testi, materiali, ecc.) sono di proprietà del titolare, salvo diversa indicazione. È vietata la copia, distribuzione o utilizzo senza autorizzazione.</p>

           <h2 className="text-xl sm:text-2xl font-black text-slate-800 mt-8 mb-4">7. Limitazione di responsabilità</h2>
           <p>Il sito è fornito “così com’è”. Il titolare non garantisce l’assenza di errori o interruzioni, la completezza o accuratezza dei contenuti. Il titolare non è responsabile per: Danni derivanti dall’utilizzo del sito; Problemi tecnici o interruzioni del servizio; Contenuti inviati dagli utenti tramite modulo di contatto.</p>

           <h2 className="text-xl sm:text-2xl font-black text-slate-800 mt-8 mb-4">8. Link esterni</h2>
           <p>Il sito può contenere link a siti esterni. Il titolare non è responsabile del contenuto o delle politiche di tali siti.</p>

           <h2 className="text-xl sm:text-2xl font-black text-slate-800 mt-8 mb-4">9. Modifiche</h2>
           <p>Il titolare si riserva il diritto di modificare i presenti Termini in qualsiasi momento. Le modifiche saranno pubblicate su questa pagina.</p>

           <h2 className="text-xl sm:text-2xl font-black text-slate-800 mt-8 mb-4">10. Legge applicabile</h2>
           <p>I presenti Termini sono regolati dalla normativa italiana e dal GDPR.</p>
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
