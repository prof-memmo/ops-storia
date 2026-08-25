"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, Users, LogIn, HelpCircle, X, Info, AlertOctagon, Timer, SkipForward, MonitorPlay } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [showRules, setShowRules] = useState(false);
  const [showContatti, setShowContatti] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTermini, setShowTermini] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).HubSubscriptionGuard) {
      (window as any).HubSubscriptionGuard.hideBlockOverlay();
    }
  }, []);

  return (
    <div className="min-h-[100dvh] bg-slate-50 flex flex-col font-sans overflow-x-hidden">
      
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 min-h-0 relative z-10">
        <div className="flex flex-col items-center flex-1 justify-center space-y-2 md:space-y-6 max-h-full">
          
          <img src="https://prof-memmo.github.io/prof-memmo-gestione-siti/shared/assets/branding/prof-memmo/avatar.png" alt="Prof Memmo" className="h-[10vh] sm:h-[15vh] max-h-24 object-contain drop-shadow-md shrink-0 mb-2" />
          <img src="https://prof-memmo.github.io/prof-memmo-gestione-siti/shared/assets/branding/games/ops-storia-badge.png" alt="Ops! Logo" className="w-[90%] sm:w-[75%] max-w-2xl h-auto max-h-[40vh] object-contain shrink-0 mb-4" />
          
          <p className="text-sm sm:text-base md:text-xl text-slate-700 max-w-2xl font-medium leading-relaxed text-center shrink-0 px-4">
            Sfida i tuoi compagni e gli "Esploratori del Tempo". Mettiti alla prova con la storia, ma attenzione a non dire la parola vietata!
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center w-full mt-4 shrink-0">
            <Link href="/play" className="flex items-center justify-center bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg transition-all shadow-lg hover:-translate-y-1">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 mr-3" />
              Unisciti
            </Link>
            <Link href="/host" className="flex items-center justify-center bg-white hover:bg-slate-50 text-primary-500 border-2 border-primary-500 px-6 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg transition-all shadow-sm hover:-translate-y-1">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 mr-3" />
              Crea Stanza
            </Link>
            <Link href="/local" className="flex items-center justify-center bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg transition-all shadow-lg hover:-translate-y-1">
              <MonitorPlay className="w-5 h-5 sm:w-6 sm:h-6 mr-3" />
              Gioco con 1 Device
            </Link>
          </div>

        </div>
      </main>

      {/* Navigation Dock */}
      <nav className="mb-4 mx-auto bg-slate-100/90 backdrop-blur-md px-4 sm:px-8 py-2 sm:py-1 flex justify-start sm:justify-center items-center shadow-lg rounded-[2rem] sm:rounded-full border border-slate-300 z-20 shrink-0 max-w-[95vw] overflow-x-auto">
        <div className="flex space-x-3 sm:space-x-8 items-center text-slate-800 shrink-0 mx-auto">
          <div className="group relative flex flex-col items-center">
            <Link href="/admin" className="hover:scale-110 hover:-translate-y-2 transition-all">
              <img src="/ops-storia/icons/7.png" alt="Dashboard Admin" className="w-14 h-14 sm:w-24 sm:h-24 object-contain drop-shadow-sm scale-110 sm:scale-125" />
            </Link>
            <span className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-xs font-bold py-1 px-3 rounded-full shadow-lg whitespace-nowrap pointer-events-none">Admin</span>
          </div>

          <div className="group relative flex flex-col items-center">
            <Link href="/dashboard" className="hover:scale-110 hover:-translate-y-2 transition-all">
              <img src="/ops-storia/icons/8.png" alt="Dashboard Docente" className="w-14 h-14 sm:w-24 sm:h-24 object-contain drop-shadow-sm scale-110 sm:scale-125" />
            </Link>
            <span className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-xs font-bold py-1 px-3 rounded-full shadow-lg whitespace-nowrap pointer-events-none">Docente</span>
          </div>

          <div className="w-px h-8 sm:h-12 bg-slate-300 mx-2"></div>
          <div className="group relative flex flex-col items-center">
            <button onClick={() => setShowTutorial(true)} className="hover:scale-110 hover:-translate-y-2 transition-all">
              <img src="/ops-storia/icons/1.png" alt="Miniguida" className="w-14 h-14 sm:w-24 sm:h-24 object-contain drop-shadow-sm scale-110 sm:scale-125" />
            </button>
            <span className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-xs font-bold py-1 px-3 rounded-full shadow-lg whitespace-nowrap pointer-events-none">Miniguida</span>
          </div>
          
          <div className="group relative flex flex-col items-center">
            <button onClick={() => setShowRules(true)} className="hover:scale-110 hover:-translate-y-2 transition-all">
              <img src="/ops-storia/icons/2.png" alt="Regolamento" className="w-14 h-14 sm:w-24 sm:h-24 object-contain drop-shadow-sm scale-110 sm:scale-125" />
            </button>
            <span className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-xs font-bold py-1 px-3 rounded-full shadow-lg whitespace-nowrap pointer-events-none">Regolamento</span>
          </div>

          <div className="w-px h-8 sm:h-12 bg-slate-300 mx-2"></div>

          <div className="group relative flex flex-col items-center">
            <button onClick={() => setShowContatti(true)} className="hover:scale-110 hover:-translate-y-2 transition-all">
              <img src="/ops-storia/icons/3.png" alt="Contatti" className="w-14 h-14 sm:w-24 sm:h-24 object-contain drop-shadow-sm scale-110 sm:scale-125" />
            </button>
            <span className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-xs font-bold py-1 px-3 rounded-full shadow-lg whitespace-nowrap pointer-events-none">Contatti</span>
          </div>

          <div className="group relative flex flex-col items-center">
            <button onClick={() => setShowPrivacy(true)} className="hover:scale-110 hover:-translate-y-2 transition-all">
              <img src="/ops-storia/icons/4.png" alt="Privacy" className="w-14 h-14 sm:w-24 sm:h-24 object-contain drop-shadow-sm scale-110 sm:scale-125" />
            </button>
            <span className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-xs font-bold py-1 px-3 rounded-full shadow-lg whitespace-nowrap pointer-events-none">Privacy</span>
          </div>

          <div className="group relative flex flex-col items-center">
            <button onClick={() => setShowTermini(true)} className="hover:scale-110 hover:-translate-y-2 transition-all">
              <img src="/ops-storia/icons/5.png" alt="Termini" className="w-14 h-14 sm:w-24 sm:h-24 object-contain drop-shadow-sm scale-110 sm:scale-125" />
            </button>
            <span className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-xs font-bold py-1 px-3 rounded-full shadow-lg whitespace-nowrap pointer-events-none">Termini</span>
          </div>
        </div>
      </nav>

      {/* Footer Patamu */}
      <footer className="w-full text-slate-400 px-4 py-2 flex items-center justify-center shrink-0 z-20">
        <div className="flex max-w-[1200px] w-full items-center justify-center text-left">
           <img src="https://prof-memmo.github.io/prof-memmo-gestione-siti/shared/assets/legal/patamu-badge.png" alt="Patamù" className="h-8 sm:h-10 mr-4 sm:mr-6 object-contain shrink-0 opacity-80" />
           <p className="text-[9px] sm:text-[11px] leading-tight font-sans tracking-tight">
             &copy; 2026 Guglielmo Piersanti. Tutti i contenuti presenti su questo sito sono di proprietà dell'autore e sono protetti tramite deposito e marcatura temporale presso Patamu. I contenuti sono inoltre distribuiti con licenza Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0).
           </p>
        </div>
      </footer>

      {/* TUTORIAL MODAL (COMIC STYLE) */}
      <AnimatePresence>
        {showTutorial && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-10"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] flex overflow-hidden shadow-2xl relative"
            >
              <div className="hidden md:flex w-1/3 bg-slate-50 items-end justify-center pt-8 border-r-2 border-slate-100">
                 <img src="https://prof-memmo.github.io/prof-memmo-gestione-siti/shared/assets/branding/prof-memmo/prof-memmo-full.jpg" alt="Prof Memmo" className="w-[120%] object-contain mix-blend-multiply drop-shadow-xl" />
              </div>
              
              <div className="w-full md:w-2/3 p-4 sm:p-8 flex flex-col relative min-h-[550px] md:min-h-[500px]">
                <button 
                  onClick={() => setShowTutorial(false)}
                  className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full z-10"
                >
                  <X className="w-6 h-6" />
                </button>
                
                <h2 className="text-4xl font-black text-primary-500 mb-8 text-center uppercase tracking-tight border-b-4 border-primary-100 inline-block pb-2 mx-auto shrink-0">Come si gioca?</h2>
                
                <div className="flex-1 relative overflow-hidden">
                  <AnimatePresence mode="wait">
                    {tutorialStep === 0 && (
                      <motion.div key="step0" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }} className="absolute inset-0 flex items-center justify-center">
                        <div className="flex flex-col items-center text-center w-full max-w-md px-4">
                          <Info className="w-20 h-20 sm:w-28 sm:h-28 text-primary-500 mb-6" />
                          <p className="text-lg sm:text-xl md:text-2xl text-slate-600 font-medium leading-relaxed">Fai indovinare la <strong>parola chiave</strong> senza pronunciare le <span className="text-red-500 font-bold">5 Parole Vietate</span>. Ottieni <strong className="text-emerald-500">+1 punto</strong> per ogni parola!</p>
                        </div>
                      </motion.div>
                    )}
                    {tutorialStep === 1 && (
                      <motion.div key="step1" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }} className="absolute inset-0 flex items-center justify-center">
                        <div className="flex flex-col items-center text-center w-full max-w-md px-4">
                          <AlertOctagon className="w-20 h-20 sm:w-28 sm:h-28 text-red-500 mb-6" />
                          <p className="text-lg sm:text-xl md:text-2xl text-slate-600 font-medium leading-relaxed">Se pronunci una <span className="text-red-500 font-bold">Parola Vietata</span>, la squadra avversaria preme <strong>OPS!</strong> rubandoti il punto!</p>
                        </div>
                      </motion.div>
                    )}
                    {tutorialStep === 2 && (
                      <motion.div key="step2" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }} className="absolute inset-0 flex items-center justify-center">
                        <div className="flex flex-col items-center text-center w-full max-w-md px-4">
                          <SkipForward className="w-20 h-20 sm:w-28 sm:h-28 text-amber-500 mb-6" />
                          <p className="text-lg sm:text-xl md:text-2xl text-slate-600 font-medium leading-relaxed">Puoi scartare massimo <strong>2 carte</strong> per turno, ma regali <strong className="text-red-500">+1 punto</strong> agli avversari!</p>
                        </div>
                      </motion.div>
                    )}
                    {tutorialStep === 3 && (
                      <motion.div key="step3" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }} className="absolute inset-0 flex items-center justify-center">
                        <div className="flex flex-col items-center text-center w-full max-w-md px-4">
                          <Timer className="w-20 h-20 sm:w-28 sm:h-28 text-blue-500 mb-6" />
                          <p className="text-lg sm:text-xl md:text-2xl text-slate-600 font-medium leading-relaxed">Avanzando sul tabellone potrai pescare carte magiche con <strong className="text-purple-600">effetti speciali</strong> (come tempo doppio o scarti infiniti).</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="mt-8 flex justify-between items-center shrink-0">
                  <div className="flex space-x-2">
                    {[0, 1, 2, 3].map(step => (
                      <div key={step} className={`w-3 h-3 rounded-full transition-colors ${tutorialStep === step ? 'bg-primary-500' : 'bg-slate-200'}`} />
                    ))}
                  </div>
                  
                  {tutorialStep < 3 ? (
                    <button 
                      onClick={() => setTutorialStep(s => s + 1)}
                      className="bg-primary-500 text-white px-8 py-3 rounded-xl font-black text-lg hover:bg-primary-600 transition-colors shadow-md"
                    >
                      AVANTI
                    </button>
                  ) : (
                    <button 
                      onClick={() => { setShowTutorial(false); setTutorialStep(0); }}
                      className="bg-slate-900 text-white px-8 py-3 rounded-xl font-black text-lg hover:bg-slate-800 transition-colors shadow-md"
                    >
                      GIOCA!
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* REGOLAMENTO MODAL */}
      <AnimatePresence>
        {showRules && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-8"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl relative overflow-hidden"
            >
              <div className="p-6 sm:p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div className="flex items-center space-x-3">
                  <BookOpen className="w-8 h-8 text-primary-500" />
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-800 uppercase tracking-tight">Regolamento di Ops!</h2>
                </div>
                <button 
                  onClick={() => setShowRules(false)}
                  className="p-2 bg-white hover:bg-slate-200 text-slate-600 rounded-full transition-colors border border-slate-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-600 text-base sm:text-lg leading-relaxed">
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-start space-x-4">
                  <div className="bg-primary-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-black text-base shrink-0 mt-0.5">1</div>
                  <div>
                    <h3 className="font-black text-slate-800 text-lg mb-1">Obiettivo del Gioco</h3>
                    <p>Ops! è un gioco a squadre basato sulla comunicazione. Lo scopo è far indovinare ai compagni una parola storica segreta senza MAI pronunciare nessuna delle <strong>5 parole vietate</strong>.</p>
                  </div>
                </div>

                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-start space-x-4">
                  <div className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-black text-base shrink-0 mt-0.5">2</div>
                  <div>
                    <h3 className="font-black text-slate-800 text-lg mb-1">Svolgimento del Turno (60s)</h3>
                    <p>Il Suggeritore ha 60 secondi per far indovinare più parole possibili:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1 font-medium text-slate-700">
                      <li><strong>Parola Indovinata:</strong> +1 punto e avanzamento pedina.</li>
                      <li><strong>Scarto:</strong> Massimo 2 scarti per turno. Ogni scarto regala 1 punto agli avversari.</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-start space-x-4">
                  <div className="bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-black text-base shrink-0 mt-0.5">3</div>
                  <div>
                    <h3 className="font-black text-slate-800 text-lg mb-1">Il Tasto OPS!</h3>
                    <p>L'avversario controlla lo schermo. Se il suggeritore pronuncia una parola vietata o gesticola, l'avversario preme <strong>OPS!</strong>, bloccando la carta e <strong>rubando il punto</strong>.</p>
                  </div>
                </div>

                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-start space-x-4">
                  <div className="bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-black text-base shrink-0 mt-0.5">4</div>
                  <div>
                    <h3 className="font-black text-slate-800 text-lg mb-1">Carte Magiche e Vittoria</h3>
                    <p>Lungo il tabellone potrai sbloccare carte con effetti speciali. Vince la prima squadra che raggiunge la casella d'arrivo!</p>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
                <button 
                  onClick={() => setShowRules(false)}
                  className="bg-primary-500 hover:bg-primary-600 text-white font-bold px-8 py-3 rounded-xl transition-colors shadow-md"
                >
                  Ho capito
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CONTATTI MODAL */}
      <AnimatePresence>
        {showContatti && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-8"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl relative overflow-hidden"
            >
              <div className="p-6 sm:p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">✉️ Contatti e Assistenza</h2>
                <button 
                  onClick={() => setShowContatti(false)}
                  className="p-2 bg-white hover:bg-slate-200 text-slate-600 rounded-full transition-colors border border-slate-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-600 text-base leading-relaxed">
                <p>Hai domande su <strong>Ops! Operazione Storia</strong>, vuoi proporre nuove carte o richiedere informazioni per la tua scuola?</p>
                
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center">
                  <p className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-1">Email Ufficiale Prof. Memmo</p>
                  <a href="mailto:prof.memmo@gmail.com" className="text-xl sm:text-2xl font-black text-primary-500 hover:underline">
                    prof.memmo@gmail.com
                  </a>
                </div>

                <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 text-blue-900 text-sm">
                  <strong className="block mb-1">🏫 Per Insegnanti e Istituti Scolastici</strong>
                  Puoi richiedere l'abilitazione delle tue classi all'Ecosistema Didattico o assistenza personalizzata per i laboratori in classe.
                </div>
              </div>

              <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
                <button 
                  onClick={() => setShowContatti(false)}
                  className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-8 py-3 rounded-xl transition-colors shadow-md"
                >
                  Chiudi
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PRIVACY POLICY MODAL */}
      <AnimatePresence>
        {showPrivacy && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-8"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl relative overflow-hidden"
            >
              <div className="p-6 sm:p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">🔒 Privacy Policy (GDPR)</h2>
                <button 
                  onClick={() => setShowPrivacy(false)}
                  className="p-2 bg-white hover:bg-slate-200 text-slate-600 rounded-full transition-colors border border-slate-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 sm:p-8 overflow-y-auto space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed">
                <p>Informativa sul trattamento dei dati personali ai sensi del Regolamento UE 2016/679 (GDPR).</p>

                <h3 className="font-black text-slate-800 text-base mt-4">1. Titolare del trattamento</h3>
                <p>Il titolare del trattamento è Guglielmo Piersanti, contattabile all’indirizzo email: <a href="mailto:prof.memmo@gmail.com" className="text-primary-500 underline font-medium">prof.memmo@gmail.com</a>.</p>

                <h3 className="font-black text-slate-800 text-base mt-4">2. Finalità della piattaforma</h3>
                <p>L'Ecosistema Didattico Prof. Memmo è una piattaforma educativa utilizzata a scopo didattico e ludico senza profilazione commerciale.</p>

                <h3 className="font-black text-slate-800 text-base mt-4">3. Dati raccolti e conservazione</h3>
                <p>Raccogliamo unicamente i dati necessari al funzionamento del gioco (indirizzo email per autenticazione, nickname o nome utente, punteggi e progressi didattici). I dati non vengono ceduti né venduti a terzi e sono custoditi in sicurezza su infrastruttura Firebase (Google LLC).</p>

                <h3 className="font-black text-slate-800 text-base mt-4">4. Diritti dell'utente e minori</h3>
                <p>L'utente può richiedere in qualunque momento la cancellazione o modifica dei propri dati personali. Per i minori di 14 anni, l'accesso avviene sotto supervisione didattica di docenti o genitori.</p>
              </div>

              <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
                <button 
                  onClick={() => setShowPrivacy(false)}
                  className="bg-primary-500 hover:bg-primary-600 text-white font-bold px-8 py-3 rounded-xl transition-colors shadow-md"
                >
                  Ho capito
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TERMINI E CONDIZIONI MODAL */}
      <AnimatePresence>
        {showTermini && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-8"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl relative overflow-hidden"
            >
              <div className="p-6 sm:p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">📜 Termini e Condizioni</h2>
                <button 
                  onClick={() => setShowTermini(false)}
                  className="p-2 bg-white hover:bg-slate-200 text-slate-600 rounded-full transition-colors border border-slate-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 sm:p-8 overflow-y-auto space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed">
                <p><strong>Ultimo aggiornamento: 2026</strong></p>

                <h3 className="font-black text-slate-800 text-base mt-4">1. Accettazione dei termini</h3>
                <p>L’accesso e l’utilizzo del gioco Ops! Operazione Storia implicano l’accettazione integrale dei presenti Termini e Condizioni.</p>

                <h3 className="font-black text-slate-800 text-base mt-4">2. Proprietà Intellettuale e Licenza</h3>
                <p>Tutti i contenuti didattici, grafici e testuali presenti su questo sito sono di proprietà di Guglielmo Piersanti e sono protetti tramite deposito con marcatura temporale presso Patamù e distribuiti con licenza Creative Commons BY-NC-ND 4.0.</p>

                <h3 className="font-black text-slate-800 text-base mt-4">3. Utilizzo lecito</h3>
                <p>È vietato utilizzare la piattaforma per finalità improprie, tentare di manomettere il database di gioco o inserire contenuti ingiuriosi o non pertinenti.</p>
              </div>

              <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
                <button 
                  onClick={() => setShowTermini(false)}
                  className="bg-primary-500 hover:bg-primary-600 text-white font-bold px-8 py-3 rounded-xl transition-colors shadow-md"
                >
                  Ho capito
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
