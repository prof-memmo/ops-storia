"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, Users, LogIn, HelpCircle, X, Info, AlertOctagon, Timer, SkipForward, MonitorPlay, ShieldCheck, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import { getAssetPath } from "@/lib/assets";

export default function Home() {
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [showRules, setShowRules] = useState(false);
  const [showContatti, setShowContatti] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTermini, setShowTermini] = useState(false);

  const openLegal = (type: 'privacy' | 'termini' | 'contatti') => {
    if (typeof window !== "undefined" && (window as any).openSharedModal) {
      (window as any).openSharedModal(type);
    } else {
      if (type === 'privacy') setShowPrivacy(true);
      else if (type === 'termini') setShowTermini(true);
      else if (type === 'contatti') setShowContatti(true);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).HubSubscriptionGuard) {
      (window as any).HubSubscriptionGuard.hideBlockOverlay();
    }
  }, []);

  return (
    <div className="min-h-[100dvh] bg-slate-50 flex flex-col font-sans overflow-x-hidden">
      
      {/* Header Standard Ecosistema con Menu Profilo */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 min-h-0 relative z-10">
        <div className="flex flex-col items-center flex-1 justify-center space-y-2 md:space-y-6 max-h-full">
          
          <img 
            src={getAssetPath('/images/logo.png?v=2')} 
            alt="Ops! Storia Logo" 
            className="w-[80%] sm:w-[60%] max-w-lg h-auto max-h-[35vh] object-contain shrink-0 mb-3" 
          />
          
          <p className="text-sm sm:text-base md:text-xl text-slate-700 max-w-2xl font-medium leading-relaxed text-center shrink-0 px-4">
            Sfida i tuoi compagni e gli "Esploratori del Tempo". Mettiti alla prova con la storia, ma attenzione a non dire la parola vietata!
          </p>

          {/* Main Action Pill Buttons - 3 Colori del Logo OPS su Sfondo Bianco */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl w-full mt-4 shrink-0 px-2">
            
            {/* O - Azzurro: 1 Dispositivo */}
            <div className="flex flex-col items-center text-center">
              <Link 
                href="/local" 
                className="w-full flex items-center justify-center gap-2.5 bg-white hover:bg-sky-50/70 text-sky-600 border-2 border-sky-400 py-3.5 px-6 rounded-full font-black text-base shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all"
              >
                <MonitorPlay className="w-5 h-5 text-sky-500" />
                <span>1 Dispositivo (Passa e Gioca)</span>
              </Link>
              <p className="text-xs text-slate-500 font-medium mt-2 px-2 leading-relaxed">
                Un solo tablet, PC o device: passalo di mano in mano a ogni turno.
              </p>
            </div>

            {/* P - Rosa: Crea Stanza */}
            <div className="flex flex-col items-center text-center">
              <Link 
                href="/host" 
                className="w-full flex items-center justify-center gap-2.5 bg-white hover:bg-pink-50/70 text-pink-600 border-2 border-pink-400 py-3.5 px-6 rounded-full font-black text-base shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all"
              >
                <BookOpen className="w-5 h-5 text-pink-500" />
                <span>Crea Stanza (LIM + Device)</span>
              </Link>
              <p className="text-xs text-slate-500 font-medium mt-2 px-2 leading-relaxed">
                Proietta il tabellone alla LIM e connetti i tablet/device con PIN.
              </p>
            </div>

            {/* S - Giallo/Ambra: Unisciti con PIN */}
            <div className="flex flex-col items-center text-center">
              <Link 
                href="/play" 
                className="w-full flex items-center justify-center gap-2.5 bg-white hover:bg-amber-50/70 text-amber-600 border-2 border-amber-400 py-3.5 px-6 rounded-full font-black text-base shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all"
              >
                <Users className="w-5 h-5 text-amber-500" />
                <span>Unisciti con PIN</span>
              </Link>
              <p className="text-xs text-slate-500 font-medium mt-2 px-2 leading-relaxed">
                Partecipa inserendo il PIN per usare il tuo tablet/device come controller.
              </p>
            </div>

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
            <button onClick={() => openLegal('contatti')} className="hover:scale-110 hover:-translate-y-2 transition-all cursor-pointer">
              <img src="/ops-storia/icons/3.png" alt="Contatti" className="w-14 h-14 sm:w-24 sm:h-24 object-contain drop-shadow-sm scale-110 sm:scale-125" />
            </button>
            <span className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-xs font-bold py-1 px-3 rounded-full shadow-lg whitespace-nowrap pointer-events-none">Contatti</span>
          </div>

          <div className="group relative flex flex-col items-center">
            <button onClick={() => openLegal('privacy')} className="hover:scale-110 hover:-translate-y-2 transition-all cursor-pointer">
              <img src="/ops-storia/icons/4.png" alt="Privacy" className="w-14 h-14 sm:w-24 sm:h-24 object-contain drop-shadow-sm scale-110 sm:scale-125" />
            </button>
            <span className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-xs font-bold py-1 px-3 rounded-full shadow-lg whitespace-nowrap pointer-events-none">Privacy</span>
          </div>

          <div className="group relative flex flex-col items-center">
            <button onClick={() => openLegal('termini')} className="hover:scale-110 hover:-translate-y-2 transition-all cursor-pointer">
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
                
                <h2 className="text-3xl sm:text-4xl font-black text-primary-500 mb-6 text-center uppercase tracking-tight border-b-4 border-primary-100 inline-block pb-2 mx-auto shrink-0">Come si gioca?</h2>
                
                <div className="flex-1 relative overflow-hidden">
                  <AnimatePresence mode="wait">
                    {tutorialStep === 0 && (
                      <motion.div key="step0" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }} className="absolute inset-0 flex items-center justify-center">
                        <div className="flex flex-col items-center text-center w-full max-w-md px-4">
                          <Info className="w-20 h-20 sm:w-24 sm:h-24 text-primary-500 mb-4" />
                          <p className="text-lg sm:text-xl text-slate-600 font-medium leading-relaxed">Fai indovinare la <strong>parola chiave</strong> senza pronunciare le <span className="text-red-500 font-bold">5 Parole Vietate</span>. Ottieni <strong className="text-emerald-500">+1 punto</strong> per ogni parola indovinata!</p>
                        </div>
                      </motion.div>
                    )}
                    {tutorialStep === 1 && (
                      <motion.div key="step1" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }} className="absolute inset-0 flex items-center justify-center">
                        <div className="flex flex-col items-center text-center w-full max-w-md px-4">
                          <AlertOctagon className="w-20 h-20 sm:w-24 sm:h-24 text-red-500 mb-4" />
                          <p className="text-lg sm:text-xl text-slate-600 font-medium leading-relaxed">Se pronunci una <span className="text-red-500 font-bold">Parola Vietata</span>, la squadra avversaria preme <strong>OPS!</strong> rubandoti il punto!</p>
                        </div>
                      </motion.div>
                    )}
                    {tutorialStep === 2 && (
                      <motion.div key="step2" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }} className="absolute inset-0 flex items-center justify-center">
                        <div className="flex flex-col items-center text-center w-full max-w-md px-4">
                          <SkipForward className="w-20 h-20 sm:w-24 sm:h-24 text-amber-500 mb-4" />
                          <p className="text-lg sm:text-xl text-slate-600 font-medium leading-relaxed">Puoi scartare massimo <strong>2 carte</strong> per turno, ma regali <strong className="text-red-500">+1 punto</strong> agli avversari!</p>
                        </div>
                      </motion.div>
                    )}
                    {tutorialStep === 3 && (
                      <motion.div key="step3" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }} className="absolute inset-0 flex items-center justify-center">
                        <div className="flex flex-col items-center text-center w-full max-w-md px-4">
                          <Timer className="w-20 h-20 sm:w-24 sm:h-24 text-blue-500 mb-4" />
                          <p className="text-lg sm:text-xl text-slate-600 font-medium leading-relaxed">Avanzando sul tabellone a 24 caselle sbloccherai <strong className="text-purple-600">effetti speciali</strong> (Tempo Doppio 120s, Pesca Illimitata o Imprevisti).</p>
                        </div>
                      </motion.div>
                    )}
                    {tutorialStep === 4 && (
                      <motion.div key="step4" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }} className="absolute inset-0 flex items-center justify-center">
                        <div className="flex flex-col items-center text-center w-full max-w-md px-4">
                          <MonitorPlay className="w-20 h-20 sm:w-24 sm:h-24 text-emerald-500 mb-4" />
                          <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
                            <strong>Due modalità:</strong> Gioca con <strong className="text-slate-900">1 Dispositivo</strong> (Passa e Gioca) oppure in <strong className="text-primary-600">Multi-Device</strong> (Tabellone alla LIM e carte segrete sui tablet/device con PIN).
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="mt-6 flex justify-between items-center shrink-0">
                  <div className="flex space-x-2">
                    {[0, 1, 2, 3, 4].map(step => (
                      <div key={step} className={`w-3 h-3 rounded-full transition-colors ${tutorialStep === step ? 'bg-primary-500' : 'bg-slate-200'}`} />
                    ))}
                  </div>
                  
                  {tutorialStep < 4 ? (
                    <button 
                      onClick={() => setTutorialStep(s => s + 1)}
                      className="bg-primary-500 text-white px-8 py-2.5 rounded-xl font-black text-base hover:bg-primary-600 transition-colors shadow-md"
                    >
                      AVANTI
                    </button>
                  ) : (
                    <button 
                      onClick={() => { setShowTutorial(false); setTutorialStep(0); }}
                      className="bg-slate-900 text-white px-8 py-2.5 rounded-xl font-black text-base hover:bg-slate-800 transition-colors shadow-md"
                    >
                      HO CAPITO!
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
                    <p>Lungo il tabellone potrai sbloccare carte con effetti speciali (Tempo Doppio, Pesca Illimitata, Imprevisto). Vince la prima squadra che raggiunge la casella 24!</p>
                  </div>
                </div>

                <div className="bg-amber-500/10 p-5 rounded-2xl border border-amber-500/30 flex items-start space-x-4">
                  <div className="bg-amber-500 text-slate-950 w-8 h-8 rounded-full flex items-center justify-center font-black text-base shrink-0 mt-0.5">5</div>
                  <div>
                    <h3 className="font-black text-slate-900 text-lg mb-1">Le 2 Modalità di Gioco</h3>
                    <ul className="list-disc pl-5 mt-2 space-y-1.5 font-medium text-slate-700 text-sm sm:text-base">
                      <li><strong>1 Dispositivo (Passa e Gioca • Party):</strong> Ideale per giocare con un unico tablet, PC o device. I giocatori si passano il dispositivo a ogni turno per non svelare le parole taboo.</li>
                      <li><strong>Multi-Device (LIM + Tablet/Device con PIN):</strong> Il docente proietta il tabellone alla LIM e gli studenti interagiscono dai loro tablet o device inserendo il PIN della stanza a 4 cifre.</li>
                    </ul>
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
              className="bg-white rounded-3xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl relative overflow-hidden"
            >
              <div className="p-6 sm:p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div className="flex items-center space-x-3">
                  <ShieldCheck className="w-8 h-8 text-primary-500" />
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-800 uppercase tracking-tight">Privacy Policy (GDPR)</h2>
                </div>
                <button 
                  onClick={() => setShowPrivacy(false)}
                  className="p-2 bg-white hover:bg-slate-200 text-slate-600 rounded-full transition-colors border border-slate-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 sm:p-8 overflow-y-auto space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed">
                <h3 className="font-black text-slate-800 text-base">1. Titolare del trattamento</h3>
                <p>Il titolare del trattamento è <strong>Guglielmo Piersanti</strong>, contattabile all'indirizzo email: <a href="mailto:prof.memmo@gmail.com" className="text-primary-500 underline font-medium">prof.memmo@gmail.com</a></p>

                <h3 className="font-black text-slate-800 text-base mt-4">2. Finalità dell'ecosistema</h3>
                <p>L'"Ecosistema Didattico Prof. Memmo" è una piattaforma educativa composta da più giochi e strumenti didattici (FantaLetteratura, La Rotta degli Eroi, La Corte della Commedia, La Palestra di Riflessione, Ops! Operazione Storia e altri), utilizzata a scopo educativo e ludico. La piattaforma può prevedere piani di accesso a pagamento per i docenti.</p>

                <h3 className="font-black text-slate-800 text-base mt-4">3. Dati raccolti</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Indirizzo e-mail e nome utente (tramite accesso Google o registrazione diretta)</li>
                  <li>Informazioni di utilizzo dei giochi (punteggi, attività didattiche, progressi)</li>
                  <li>Messaggi inviati tramite modulo di contatto o posta interna</li>
                  <li>Dati tecnici forniti automaticamente dalla piattaforma (tipo di dispositivo, dati di log)</li>
                  <li>Dati di sottoscrizione (piano scelto, data di registrazione)</li>
                </ul>

                <h3 className="font-black text-slate-800 text-base mt-4">4. Finalità del trattamento</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Consentire l'accesso all'ecosistema e alle sue funzionalità</li>
                  <li>Gestire l'esperienza didattica, le classi, le classifiche e i tornei interni</li>
                  <li>Migliorare il funzionamento del servizio</li>
                  <li>Rispondere alle richieste inviate tramite modulo di contatto o posta interna</li>
                  <li>Gestire gli abbonamenti e i piani di accesso</li>
                </ul>
                <p>Non vengono utilizzati per scopi commerciali o pubblicitari.</p>

                <h3 className="font-black text-slate-800 text-base mt-4">5. Base giuridica</h3>
                <p>Il trattamento si basa sull'utilizzo dell'ecosistema e sul consenso esplicito dell'utente fornito in fase di registrazione.</p>

                <h3 className="font-black text-slate-800 text-base mt-4">6. Conservazione dei dati</h3>
                <p>I dati sono trattati in modo lecito e sicuro. Non vengono venduti né ceduti a terzi. Sono mantenuti solo per il tempo necessario al funzionamento didattico o su richiesta, salvo obblighi di legge. Vengono utilizzati servizi terzi per l'archiviazione (<strong>Firebase / Google LLC</strong>).</p>

                <h3 className="font-black text-slate-800 text-base mt-4">7. Servizi di terze parti</h3>
                <p>L'ecosistema utilizza: Firebase (autenticazione e database, Google LLC), Google Sign-In. Questi servizi possono raccogliere dati secondo le proprie privacy policy.</p>

                <h3 className="font-black text-slate-800 text-base mt-4">8. Diritti dell'utente</h3>
                <p>L'utente ha diritto di accesso ai propri dati, rettifica o cancellazione, limitazione del trattamento e revoca del consenso inviando un'email a: <a href="mailto:prof.memmo@gmail.com" className="text-primary-500 underline font-medium">prof.memmo@gmail.com</a></p>

                <h3 className="font-black text-slate-800 text-base mt-4">9. Cookie e Utenti minori</h3>
                <p>Il sito non utilizza cookie di profilazione. L'ecosistema è destinato a uso didattico e può essere utilizzato da minori nell'ambito scolastico sotto la supervisione del docente.</p>

                <h3 className="font-black text-slate-800 text-base mt-4">10. Riferimenti normativi</h3>
                <p>Redatta in conformità al <strong>GDPR (Regolamento UE 2016/679)</strong> e alla normativa italiana in materia di protezione dei dati personali.</p>
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
              className="bg-white rounded-3xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl relative overflow-hidden"
            >
              <div className="p-6 sm:p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div className="flex items-center space-x-3">
                  <FileText className="w-8 h-8 text-primary-500" />
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-800 uppercase tracking-tight">Termini e Condizioni</h2>
                </div>
                <button 
                  onClick={() => setShowTermini(false)}
                  className="p-2 bg-white hover:bg-slate-200 text-slate-600 rounded-full transition-colors border border-slate-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 sm:p-8 overflow-y-auto space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed">
                <h3 className="font-black text-slate-800 text-base">1. Titolare del sito e Denominazione Sociale</h3>
                <p>L'Ecosistema Prof. Memmo è gestito da <strong>Prof. Memmo - Games&Co.</strong> di Guglielmo Piersanti. Email di contatto: <a href="mailto:prof.memmo@gmail.com" className="text-primary-500 underline font-medium">prof.memmo@gmail.com</a></p>

                <h3 className="font-black text-slate-800 text-base mt-4">2. Accettazione dei Termini</h3>
                <p>L'accesso e l'utilizzo dell'Ecosistema Prof. Memmo e delle relative piattaforme didattiche implicano l'accettazione integrale dei presenti Termini e Condizioni.</p>

                <h3 className="font-black text-slate-800 text-base mt-4">3. Descrizione dell'attività: Prof. Memmo</h3>
                <p>Prof. Memmo è un progetto educativo digitale dedicato alla scuola secondaria di primo grado. Il progetto offre risorse, attività didattiche, giochi educativi e ambienti digitali interattivi destinati principalmente a docenti e studenti.</p>

                <h3 className="font-black text-slate-800 text-base mt-4">4. Piani, prezzi e pagamenti</h3>
                <p>I servizi per i docenti sono forniti tramite abbonamenti con gestione sicura dei pagamenti tramite Stripe. Gli studenti inseriti in una classe didattica creata da un docente non sono soggetti a costi aggiuntivi.</p>

                <h3 className="font-black text-slate-800 text-base mt-4">5. Proprietà intellettuale e Licenza Didattica</h3>
                <p>Tutti i contenuti presenti nell'ecosistema (testi, narrazioni, schede didattiche, grafiche, marchi, meccaniche di gioco e software) sono di proprietà esclusiva dell'autore e sono protetti tramite deposito e marcatura temporale presso Patamu. I contenuti sono inoltre distribuiti con licenza <strong>Creative Commons Attribuzione - Non commerciale - Non opere derivate 4.0 Internazionale (CC BY-NC-ND 4.0)</strong>.</p>

                <h3 className="font-black text-slate-800 text-base mt-4">6. Legge applicabile e Foro competente</h3>
                <p>I presenti Termini sono regolati dalla legge italiana e dal <strong>GDPR (Regolamento UE 2016/679)</strong>.</p>
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
