"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, Users, LogIn, HelpCircle, X, Info, AlertOctagon, Timer, SkipForward, MonitorPlay } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);

  return (
    <div className="min-h-[100dvh] bg-slate-50 flex flex-col font-sans overflow-x-hidden">
      
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 min-h-0 relative z-10">
        <div className="flex flex-col items-center flex-1 justify-center space-y-2 md:space-y-6 max-h-full">
          
          <img src="/ops-storia/images/avatar.png" alt="Prof Memmo" className="h-[10vh] sm:h-[15vh] max-h-24 object-contain drop-shadow-md shrink-0 mb-2" />
          <img src="/ops-storia/images/logo.png" alt="Ops! Logo" className="w-[90%] sm:w-[75%] max-w-2xl h-auto max-h-[40vh] object-contain shrink-0 mb-4 mix-blend-multiply" />
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary-500 tracking-tight text-center shrink-0">
            Sfida la Storia all'Ultima Parola!
          </h1>
          
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
      <nav className="mb-4 mx-auto bg-slate-100/90 backdrop-blur-md px-8 py-0 sm:py-1 flex justify-center items-center shadow-lg rounded-full border border-slate-300 z-20 shrink-0">
        <div className="flex space-x-4 sm:space-x-8 items-center text-slate-800">
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
            <Link href="/regolamento" className="hover:scale-110 hover:-translate-y-2 transition-all">
              <img src="/ops-storia/icons/2.png" alt="Regolamento" className="w-14 h-14 sm:w-24 sm:h-24 object-contain drop-shadow-sm scale-110 sm:scale-125" />
            </Link>
            <span className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-xs font-bold py-1 px-3 rounded-full shadow-lg whitespace-nowrap pointer-events-none">Regolamento</span>
          </div>

          <div className="w-px h-8 sm:h-12 bg-slate-300 mx-2"></div>

          <div className="group relative flex flex-col items-center">
            <Link href="/contatti" className="hover:scale-110 hover:-translate-y-2 transition-all">
              <img src="/ops-storia/icons/3.png" alt="Contatti" className="w-14 h-14 sm:w-24 sm:h-24 object-contain drop-shadow-sm scale-110 sm:scale-125" />
            </Link>
            <span className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-xs font-bold py-1 px-3 rounded-full shadow-lg whitespace-nowrap pointer-events-none">Contatti</span>
          </div>

          <div className="group relative flex flex-col items-center">
            <Link href="/privacy" className="hover:scale-110 hover:-translate-y-2 transition-all">
              <img src="/ops-storia/icons/4.png" alt="Privacy" className="w-14 h-14 sm:w-24 sm:h-24 object-contain drop-shadow-sm scale-110 sm:scale-125" />
            </Link>
            <span className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-xs font-bold py-1 px-3 rounded-full shadow-lg whitespace-nowrap pointer-events-none">Privacy</span>
          </div>

          <div className="group relative flex flex-col items-center">
            <Link href="/termini" className="hover:scale-110 hover:-translate-y-2 transition-all">
              <img src="/ops-storia/icons/5.png" alt="Termini" className="w-14 h-14 sm:w-24 sm:h-24 object-contain drop-shadow-sm scale-110 sm:scale-125" />
            </Link>
            <span className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-xs font-bold py-1 px-3 rounded-full shadow-lg whitespace-nowrap pointer-events-none">Termini</span>
          </div>
        </div>
      </nav>

      {/* Footer Patamu */}
      <footer className="w-full text-slate-400 px-4 py-2 flex items-center justify-center shrink-0 z-20">
        <div className="flex max-w-[1200px] w-full items-center justify-center text-left">
           <img src="/ops-storia/images/patamu_pencil.png" alt="Patamù" className="h-8 sm:h-10 mr-4 sm:mr-6 object-contain shrink-0 opacity-80" />
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
                 <img src="/ops-storia/images/prof_memmo_full.jpg" alt="Prof Memmo" className="w-[120%] object-contain mix-blend-multiply drop-shadow-xl" />
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

    </div>
  );
}
