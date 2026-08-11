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
           <p>Il titolare del trattamento è <strong>Guglielmo Piersanti</strong>, contattabile all&apos;indirizzo email: <a href="mailto:prof.memmo@gmail.com" className="text-primary-500 hover:underline">prof.memmo@gmail.com</a></p>

           <h2 className="text-xl sm:text-2xl font-black text-slate-800 mt-8 mb-4">2. Finalità dell&apos;ecosistema</h2>
           <p>L&apos;&quot;Ecosistema Didattico Prof. Memmo&quot; è una piattaforma educativa composta da più giochi e strumenti didattici (tra cui Ops! Operazione Storia, FantaLetteratura, La Rotta degli Eroi, La Corte della Commedia, La Palestra di Riflessione e altri), utilizzata a scopo educativo e ludico. La piattaforma può prevedere piani di accesso a pagamento per i docenti.</p>

           <h2 className="text-xl sm:text-2xl font-black text-slate-800 mt-8 mb-4">3. Dati raccolti</h2>
           <ul className="list-disc pl-6 space-y-1">
             <li>Indirizzo e-mail e nome utente (tramite accesso Google o registrazione diretta)</li>
             <li>Informazioni di utilizzo dei giochi (punteggi, attività didattiche, progressi)</li>
             <li>Messaggi inviati tramite modulo di contatto o posta interna</li>
             <li>Dati tecnici forniti automaticamente dalla piattaforma (tipo di dispositivo, dati di log)</li>
             <li>Dati di sottoscrizione (piano scelto, data di registrazione)</li>
           </ul>

           <h2 className="text-xl sm:text-2xl font-black text-slate-800 mt-8 mb-4">4. Finalità del trattamento</h2>
           <ul className="list-disc pl-6 space-y-1">
             <li>Consentire l&apos;accesso all&apos;ecosistema e alle sue funzionalità</li>
             <li>Gestire l&apos;esperienza didattica, le classi, le classifiche e i tornei interni</li>
             <li>Migliorare il funzionamento del servizio</li>
             <li>Rispondere alle richieste inviate tramite modulo di contatto o posta interna</li>
             <li>Gestire gli abbonamenti e i piani di accesso</li>
           </ul>
           <p>Non vengono utilizzati per scopi commerciali o pubblicitari.</p>

           <h2 className="text-xl sm:text-2xl font-black text-slate-800 mt-8 mb-4">5. Base giuridica</h2>
           <p>Il trattamento si basa sull&apos;utilizzo dell&apos;ecosistema e sul consenso esplicito dell&apos;utente fornito in fase di registrazione.</p>

           <h2 className="text-xl sm:text-2xl font-black text-slate-800 mt-8 mb-4">6. Conservazione dei dati</h2>
           <p>I dati sono trattati in modo lecito e sicuro. Non vengono venduti né ceduti a terzi. Sono mantenuti solo per il tempo necessario al funzionamento didattico o su richiesta, salvo obblighi di legge. Vengono utilizzati servizi terzi per l&apos;archiviazione (<strong>Firebase / Google LLC</strong>).</p>

           <h2 className="text-xl sm:text-2xl font-black text-slate-800 mt-8 mb-4">7. Servizi di terze parti</h2>
           <p>L&apos;ecosistema utilizza: Firebase (autenticazione e database, Google LLC), Google Sign-In. Questi servizi possono raccogliere dati secondo le proprie privacy policy.</p>

           <h2 className="text-xl sm:text-2xl font-black text-slate-800 mt-8 mb-4">8. Diritti dell&apos;utente</h2>
           <ul className="list-disc pl-6 space-y-1">
             <li>Accesso ai propri dati</li>
             <li>Rettifica o cancellazione</li>
             <li>Limitazione del trattamento</li>
             <li>Revoca del consenso</li>
           </ul>
           <p>Per esercitare questi diritti: <a href="mailto:prof.memmo@gmail.com" className="text-primary-500 hover:underline">prof.memmo@gmail.com</a></p>

           <h2 className="text-xl sm:text-2xl font-black text-slate-800 mt-8 mb-4">9. Cookie</h2>
           <p>Il sito non utilizza cookie di profilazione. Potrebbero essere presenti cookie tecnici necessari al funzionamento del servizio.</p>

           <h2 className="text-xl sm:text-2xl font-black text-slate-800 mt-8 mb-4">10. Utenti minori</h2>
           <p>L&apos;ecosistema è destinato a uso didattico e può essere utilizzato da minori nell&apos;ambito scolastico, sotto la supervisione del docente. Per uso al di fuori del contesto scolastico è responsabilità di un adulto assicurare le autorizzazioni necessarie. I genitori o tutori possono richiedere la cancellazione dei dati contattando il titolare.</p>

           <h2 className="text-xl sm:text-2xl font-black text-slate-800 mt-8 mb-4">11. Modifiche alla Policy</h2>
           <p>La presente informativa può essere aggiornata. Gli utenti saranno informati in caso di modifiche rilevanti tramite avviso sulla piattaforma.</p>

           <h2 className="text-xl sm:text-2xl font-black text-slate-800 mt-8 mb-4">12. Riferimenti normativi</h2>
           <p>Redatta in conformità al <strong>GDPR (Regolamento UE 2016/679)</strong> e alla normativa italiana in materia di protezione dei dati personali.</p>
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
