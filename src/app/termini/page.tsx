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
           <p>Il presente ecosistema di piattaforme didattiche è gestito da <strong>Guglielmo Piersanti</strong>. Email di contatto: <a href="mailto:prof.memmo@gmail.com" className="text-primary-500 hover:underline">prof.memmo@gmail.com</a></p>

           <h2 className="text-xl sm:text-2xl font-black text-slate-800 mt-8 mb-4">2. Accettazione dei termini</h2>
           <p>L&apos;accesso e l&apos;utilizzo dell&apos;ecosistema Prof. Memmo implicano l&apos;accettazione dei presenti Termini. Se non si accettano, si invita a non utilizzare i servizi.</p>

           <h2 className="text-xl sm:text-2xl font-black text-slate-800 mt-8 mb-4">3. Descrizione del servizio</h2>
           <p>L&apos;Ecosistema Prof. Memmo è un insieme di piattaforme didattiche e ludiche (Ops! Operazione Storia, FantaLetteratura, La Rotta degli Eroi, La Palestra di Riflessione, La Corte della Commedia e altri) accessibili tramite un unico account Hub. Il servizio ha finalità educative.</p>

           <h2 className="text-xl sm:text-2xl font-black text-slate-800 mt-8 mb-4">4. Utilizzo del servizio</h2>
           <p>L&apos;utente si impegna a evitare di:</p>
           <ul className="list-disc pl-6 space-y-1">
             <li>Inviare messaggi offensivi, illeciti o spam</li>
             <li>Tentare di compromettere la sicurezza delle piattaforme</li>
             <li>Utilizzare il servizio per scopi fraudolenti</li>
             <li>Condividere credenziali di accesso con terzi</li>
             <li>Eludere i sistemi di pagamento o accedere a funzionalità non incluse nel proprio piano</li>
           </ul>

           <h2 className="text-xl sm:text-2xl font-black text-slate-800 mt-8 mb-4">5. Modulo di contatto e posta interna</h2>
           <p>L&apos;utente è responsabile dei contenuti inviati. È vietato inserire dati falsi o inviare contenuti illeciti o non pertinenti.</p>

           <h2 className="text-xl sm:text-2xl font-black text-slate-800 mt-8 mb-4">6. Proprietà intellettuale</h2>
           <p>Tutti i contenuti (testi, materiali didattici, grafica, giochi, meccaniche) sono di proprietà del titolare e protetti da diritto d&apos;autore. Distribuiti con licenza <strong>CC BY-NC-ND 4.0</strong>. Vietata la copia, distribuzione, modifica o utilizzo commerciale senza autorizzazione scritta.</p>

           <h2 className="text-xl sm:text-2xl font-black text-slate-800 mt-8 mb-4">7. Abbonamenti e pagamenti</h2>
           <p>Alcune funzionalità sono disponibili solo con piani a pagamento (Piano Viandante, Piano Docente, Ecosistema Completo). I prezzi sono indicati nella pagina dedicata. Gli studenti inseriti in una classe da un docente non sono soggetti a costi aggiuntivi.</p>

           <h2 className="text-xl sm:text-2xl font-black text-slate-800 mt-8 mb-4">8. Limitazione di responsabilità</h2>
           <p>Il servizio è fornito &quot;così com&apos;è&quot;. Il titolare non garantisce l&apos;assenza di errori o interruzioni e non è responsabile per danni derivanti dall&apos;utilizzo.</p>

           <h2 className="text-xl sm:text-2xl font-black text-slate-800 mt-8 mb-4">9. Link esterni</h2>
           <p>L&apos;ecosistema può contenere link a siti esterni. Il titolare non è responsabile del loro contenuto.</p>

           <h2 className="text-xl sm:text-2xl font-black text-slate-800 mt-8 mb-4">10. Modifiche ai termini</h2>
           <p>Il titolare si riserva il diritto di modificare i presenti Termini in qualsiasi momento, con avviso sulla piattaforma.</p>

           <h2 className="text-xl sm:text-2xl font-black text-slate-800 mt-8 mb-4">11. Legge applicabile</h2>
           <p>Regolati dalla normativa italiana e dal <strong>GDPR (Regolamento UE 2016/679)</strong>. Foro competente: quello del luogo di residenza del titolare.</p>
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
