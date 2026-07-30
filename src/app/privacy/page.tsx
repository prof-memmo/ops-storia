import Link from "next/link";

export default function Privacy() {
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

        <div className="font-black text-sm sm:text-xl text-primary-500 text-right flex-1 tracking-tight">PRIVACY</div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto p-6 sm:p-12 w-full">
         <h1 className="text-4xl sm:text-5xl font-black text-slate-800 mb-8 uppercase text-center">Privacy Policy</h1>
         
         <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-md border-2 border-slate-100 text-lg text-slate-600 font-medium space-y-6">
           <p>Informativa sul trattamento dei dati personali (Regolamento UE 2016/679 - GDPR).</p>
           
           <h2 className="text-xl sm:text-2xl font-black text-slate-800 mt-8 mb-4">1. Titolare del trattamento</h2>
           <p>Il titolare del trattamento è Guglielmo Piersanti, contattabile all’indirizzo email: <a href="mailto:prof.memmo@gmail.com" className="text-primary-500 hover:underline">prof.memmo@gmail.com</a></p>

           <h2 className="text-xl sm:text-2xl font-black text-slate-800 mt-8 mb-4">2. Finalità dell’app</h2>
           <p>“Ops!” è un’app didattica, utilizzata a scopo educativo e ludico e senza fini di lucro.</p>

           <h2 className="text-xl sm:text-2xl font-black text-slate-800 mt-8 mb-4">3. Dati raccolti</h2>
           <p>L’app può raccogliere i seguenti dati personali: indirizzo e-mail; informazioni di utilizzo relative ai giochi online (punteggi, attività didattiche ecc.); messaggio inviato tramite modulo di contatto; dati tecnici forniti automaticamente dalla piattaforma (es. tipo di dispositivo, dati di log)</p>

           <h2 className="text-xl sm:text-2xl font-black text-slate-800 mt-8 mb-4">4. Finalità del trattamento</h2>
           <p>I dati vengono trattati esclusivamente per consentire l’accesso all’app e alle sue funzionalità, gestire l’esperienza didattica e le classifiche interne, migliorare il funzionamento del servizio, rispondere alle richieste inviate tramite il modulo di contatto, fornire assistenza o informazioni richieste dall’utente. Non vengono utilizzati per scopi commerciali o pubblicitari.</p>

           <h2 className="text-xl sm:text-2xl font-black text-slate-800 mt-8 mb-4">5. Base giuridica</h2>
           <p>Il trattamento dei dati si basa sull’utilizzo dell’app e sul consenso dell’utente.</p>

           <h2 className="text-xl sm:text-2xl font-black text-slate-800 mt-8 mb-4">6. Conservazione dei dati</h2>
           <p>I dati sono trattati in modo lecito e sicuro. Non vengono venduti né ceduti a terzi. Sono mantenuti solo per il tempo necessario al funzionamento didattico dell’app o su richiesta o in maniera autonoma tramite il profilo utente, salvo obblighi di legge. Vengono utilizzati servizi terzi per l’archiviazione dei dati (Firebase).</p>

           <h2 className="text-xl sm:text-2xl font-black text-slate-800 mt-8 mb-4">7. Diritti dell’utente</h2>
           <p>L'utente può richiedere in qualsiasi momento: accesso ai propri dati, rettifica o cancellazione, limitazione del trattamento, revoca del consenso. Per esercitare questi diritti, è possibile contattare il titolare all’indirizzo email sopra indicato.</p>

           <h2 className="text-xl sm:text-2xl font-black text-slate-800 mt-8 mb-4">8. Cookie</h2>
           <p>Il sito non utilizza cookie di profilazione.</p>

           <h2 className="text-xl sm:text-2xl font-black text-slate-800 mt-8 mb-4">9. Utenti minori</h2>
           <p>L’app è destinata a un uso didattico. Per l'utilizzo da parte di minori, è responsabilità di un adulto assicurare le autorizzazioni necessarie. I genitori o tutori possono richiedere la cancellazione dei dati contattando il titolare.</p>

           <h2 className="text-xl sm:text-2xl font-black text-slate-800 mt-8 mb-4">10. Modifiche alla Policy</h2>
           <p>La presente informativa può essere aggiornata. Gli utenti verranno informati in caso di modifiche rilevanti.</p>

           <h2 className="text-xl sm:text-2xl font-black text-slate-800 mt-8 mb-4">11. Riferimenti normativi</h2>
           <p>Questa informativa è redatta in conformità al GDPR.</p>
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
