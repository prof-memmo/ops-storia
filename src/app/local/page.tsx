"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Timer, Check, X, Home, AlertOctagon, Undo2, LogIn, ArrowLeft, LogOut } from "lucide-react";
import Link from "next/link";
import DynamicBoard from "../components/DynamicBoard";
import HostLogin from "@/components/HostLogin";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";

const decksDB = [
  { id: "prima", name: "Età medievale (1° Anno)" },
  { id: "seconda", name: "Età moderna (2° Anno)" },
  { id: "terza", name: "Età contemporanea (3° Anno)" }
];

const colorsDB = [
  { id: "verde", name: "Dalla caduta di Roma all'Alto Medioevo", colorClass: "bg-green-500", textClass: "text-green-500", borderClass: "border-green-500" },
  { id: "rosso", name: "La nascita dell'Islam e il Sacro Romano Impero", colorClass: "bg-red-500", textClass: "text-red-500", borderClass: "border-red-500" },
  { id: "arancio", name: "Il feudalesimo e l'incastellamento", colorClass: "bg-orange-500", textClass: "text-orange-500", borderClass: "border-orange-500" },
  { id: "giallo", name: "La rinascita dell'Anno Mille", colorClass: "bg-yellow-500", textClass: "text-yellow-500", borderClass: "border-yellow-500" },
  { id: "blu", name: "Le Crociate e i Comuni", colorClass: "bg-blue-500", textClass: "text-blue-500", borderClass: "border-blue-500" },
  { id: "viola", name: "La crisi del Trecento e la Peste Nera", colorClass: "bg-purple-500", textClass: "text-purple-500", borderClass: "border-purple-500" }
];

const boardPath = [
  { x: 13, y: 15 }, { x: 13, y: 30 }, { x: 23, y: 30 }, { x: 32, y: 30 }, { x: 32, y: 15 },
  { x: 42, y: 15 }, { x: 52, y: 15 }, { x: 52, y: 30 }, { x: 52, y: 55 }, { x: 42, y: 55 },
  { x: 32, y: 55 }, { x: 23, y: 55 }, { x: 13, y: 55 }, { x: 13, y: 70 }, { x: 13, y: 85 },
  { x: 23, y: 85 }, { x: 32, y: 85 }, { x: 42, y: 85 }, { x: 52, y: 85 }, { x: 62, y: 85 },
  { x: 72, y: 85 }, { x: 82, y: 85 }, { x: 82, y: 70 }, { x: 82, y: 55 }, { x: 80, y: 25 }
];

const verticalBoardPath = [
  { x: 34, y: 92 }, { x: 23, y: 92 }, { x: 23, y: 84 }, { x: 23, y: 76 }, { x: 34, y: 76 },
  { x: 44, y: 76 }, { x: 55, y: 76 }, { x: 55, y: 84 }, { x: 55, y: 92 }, { x: 65, y: 92 },
  { x: 76, y: 92 }, { x: 76, y: 84 }, { x: 76, y: 76 }, { x: 76, y: 68 }, { x: 76, y: 60 },
  { x: 65, y: 60 }, { x: 55, y: 60 }, { x: 44, y: 60 }, { x: 34, y: 60 }, { x: 23, y: 60 },
  { x: 12, y: 60 }, { x: 12, y: 68 }, { x: 12, y: 76 }, { x: 12, y: 84 }, { x: 34, y: 25 }
];

const avatars = Array.from({length: 12}, (_, i) => i + 1);

export default function LocalPlay() {
  const [phase, setPhase] = useState<"SETUP" | "TOPICS" | "AVATAR_A" | "AVATAR_B" | "READY" | "PLAYING" | "SUMMARY" | "BOARD">("SETUP");
  const [selectedDeck, setSelectedDeck] = useState("prima");
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  
  const [deck, setDeck] = useState<any[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  
  const [teamA, setTeamA] = useState({ score: 0, pawn: 1, pos: 0 });
  const [teamB, setTeamB] = useState({ score: 0, pawn: 4, pos: 0 });
  const [currentTurn, setCurrentTurn] = useState<1 | 2>(1);
  
  const [timeLeft, setTimeLeft] = useState(60);
  
  const [turnStats, setTurnStats] = useState({ guessed: 0, passed: 0, ops: 0 });
  const [showUndoOps, setShowUndoOps] = useState(false);
  const [doubleTime, setDoubleTime] = useState(false);
  const [unlimitedPass, setUnlimitedPass] = useState(false);

  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (phase === "PLAYING" && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (phase === "PLAYING" && timeLeft === 0) {
      setPhase("SUMMARY");
    }
    return () => clearTimeout(timer);
  }, [timeLeft, phase]);

  const initGame = async () => {
    let allCards = [];
    try {
      const res = await fetch(`/data/cards_${selectedDeck}.json`);
      allCards = await res.json();
    } catch(e) { return; }

    const chunkSize = Math.ceil(allCards.length / 6);
    let finalDeck: any[] = [];
    
    allCards.forEach((c: any, index: number) => {
      const chunkIndex = Math.min(5, Math.floor(index / chunkSize));
      const colorObj = colorsDB[chunkIndex];
      if (selectedColors.includes(colorObj.id)) {
        finalDeck.push({ ...c, colorTheme: colorObj });
      }
    });

    setDeck(finalDeck.sort(() => Math.random() - 0.5));
    setPhase("AVATAR_A");
  };

  const startGame = () => {
    setTimeLeft(doubleTime ? 120 : 60);
    setDoubleTime(false);
    setTurnStats({ guessed: 0, passed: 0, ops: 0 });
    setPhase("PLAYING");
  };

  const handleAction = (action: "ESATTA" | "SCARTA" | "OPS") => {
    if (action === "ESATTA") {
      setTurnStats(s => ({...s, guessed: s.guessed + 1}));
      if (currentTurn === 1) setTeamA(s => ({...s, score: s.score + 1}));
      else setTeamB(s => ({...s, score: s.score + 1}));
      setCurrentCardIndex(i => i + 1);
    } 
    else if (action === "SCARTA") {
      if (turnStats.passed >= 2 && !unlimitedPass) return alert("Massimo 2 scarti!");
      setTurnStats(s => ({...s, passed: s.passed + 1}));
      if (currentTurn === 1) setTeamB(s => ({...s, score: s.score + 1}));
      else setTeamA(s => ({...s, score: s.score + 1}));
      setCurrentCardIndex(i => i + 1);
    }
    else if (action === "OPS") {
      setTurnStats(s => ({...s, ops: s.ops + 1}));
      if (currentTurn === 1) setTeamB(s => ({...s, score: s.score + 1}));
      else setTeamA(s => ({...s, score: s.score + 1}));
      setShowUndoOps(true);
      setTimeout(() => setShowUndoOps(false), 3000);
    }
  };

  const undoOps = () => {
    setTurnStats(s => ({...s, ops: Math.max(0, s.ops - 1)}));
    if (currentTurn === 1) setTeamB(s => ({...s, score: Math.max(0, s.score - 1)}));
    else setTeamA(s => ({...s, score: Math.max(0, s.score - 1)}));
    setShowUndoOps(false);
  };

  const nextTurn = () => {
    let unlPass = false; let dblTime = false;
    const updateTeam = currentTurn === 1 ? setTeamA : setTeamB;
    const currentTeam = currentTurn === 1 ? teamA : teamB;
    
    let newPos = Math.min(24, Math.max(0, currentTeam.pos + turnStats.guessed - turnStats.ops - turnStats.passed));
    
    if (newPos === 5) unlPass = true;
    if (newPos === 11) newPos = Math.max(0, newPos - 2);
    if (newPos === 20) dblTime = true;

    updateTeam(s => ({...s, pos: newPos}));
    setUnlimitedPass(unlPass);
    setDoubleTime(dblTime);
    setCurrentTurn(currentTurn === 1 ? 2 : 1);
    setPhase("READY");
  };

  const card = deck[currentCardIndex % deck.length];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="bg-white px-4 py-3 flex items-center justify-between shadow-sm sticky top-0 z-10 shrink-0">
        <div className="flex items-center space-x-2 sm:space-x-4 flex-1">
          <Link href="/" className="shrink-0 hover:scale-110 transition-transform">
            <img src="/ops-storia/icons/6.png" alt="Home" className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
          </Link>
          <img src="https://prof-memmo.github.io/prof-memmo-gestione-siti/shared/assets/branding/games/ops-storia-badge.png" alt="Ops!" className="h-10 sm:h-14 object-contain shrink-0 hidden sm:block" />
        </div>
        
        <div className="flex items-center justify-center flex-1">
           <img src="https://prof-memmo.github.io/prof-memmo-gestione-siti/shared/assets/branding/prof-memmo/avatar.png" alt="Prof Memmo" className="h-12 sm:h-16 object-contain" />
        </div>

        <div className="font-black text-sm sm:text-xl text-primary-500 text-right flex-1 tracking-tight flex items-center justify-end">
          <span className="hidden sm:inline mr-4">TABELLONE</span>
          {user && (
            <button onClick={() => signOut(auth)} className="text-slate-400 hover:text-red-500 transition-colors" title="Disconnetti">
              <LogOut className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        {authLoading ? (
          <div className="text-slate-400 font-bold animate-pulse">Caricamento...</div>
        ) : !user ? (
          <HostLogin 
            onLoginSuccess={() => {}} 
            title="Accesso"
            description="Per giocare in questa modalità è necessario accedere."
            smallButton={true}
          />
        ) : (
          <AnimatePresence mode="wait">
          
          {phase === "SETUP" && (
            <motion.div key="setup" className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 text-center">
              <h2 className="text-3xl font-black mb-6">Scegli l'Anno</h2>
              <div className="space-y-3 mb-8">
                {decksDB.map(d => (
                  <button key={d.id} onClick={() => setSelectedDeck(d.id)} className={`w-full p-4 rounded-xl border-2 font-bold ${selectedDeck === d.id ? 'border-primary-500 bg-primary-50' : 'border-slate-100'}`}>{d.name}</button>
                ))}
              </div>
              <button onClick={() => setPhase("TOPICS")} className="w-full bg-primary-500 text-white py-4 rounded-xl font-black">AVANTI</button>
            </motion.div>
          )}

          {phase === "TOPICS" && (
            <motion.div key="topics" className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 text-center">
              <h2 className="text-3xl font-black mb-6">Argomenti</h2>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {colorsDB.map(c => (
                  <button key={c.id} onClick={() => setSelectedColors(prev => prev.includes(c.id) ? prev.filter(id => id !== c.id) : [...prev, c.id])} className={`p-4 rounded-xl border-2 font-bold text-sm ${selectedColors.includes(c.id) ? c.borderClass + ' bg-slate-50' : 'border-slate-100 opacity-50'}`}>
                    {c.name}
                  </button>
                ))}
              </div>
              <button onClick={initGame} className="w-full bg-emerald-500 text-white py-4 rounded-xl font-black">AVANTI</button>
            </motion.div>
          )}

          {phase === "AVATAR_A" && (
            <motion.div key="avatarA" className="w-full max-w-xl bg-white rounded-3xl shadow-xl p-8 text-center">
              <h2 className="text-3xl font-black mb-6">Avatar Squadra A</h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mb-8">
                {avatars.map(a => (
                  <button key={a} onClick={() => { setTeamA(s => ({...s, pawn: a})); setPhase("AVATAR_B"); }} className="p-2 border-4 border-slate-100 rounded-xl hover:border-primary-500 hover:bg-slate-50 transition-colors bg-white">
                    <img src={`/images/pedine_page_${a}.png`} className="w-full object-contain h-16 sm:h-20" alt={`Avatar ${a}`} />
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {phase === "AVATAR_B" && (
            <motion.div key="avatarB" className="w-full max-w-xl bg-white rounded-3xl shadow-xl p-8 text-center">
              <h2 className="text-3xl font-black mb-6">Avatar Squadra B</h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mb-8">
                {avatars.map(a => (
                  <button key={a} onClick={() => { setTeamB(s => ({...s, pawn: a})); setPhase("READY"); }} className="p-2 border-4 border-slate-100 rounded-xl hover:border-primary-500 hover:bg-slate-50 transition-colors bg-white">
                    <img src={`/images/pedine_page_${a}.png`} className="w-full object-contain h-16 sm:h-20" alt={`Avatar ${a}`} />
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {phase === "READY" && (
            <motion.div key="ready" className="text-center">
              <h2 className="text-5xl font-black mb-4">Tocca alla Squadra {currentTurn === 1 ? 'A' : 'B'}!</h2>
              <button onClick={startGame} className="bg-primary-500 text-white px-12 py-6 rounded-full font-black text-3xl shadow-xl hover:scale-105 transition-transform">VIA!</button>
            </motion.div>
          )}

          {phase === "PLAYING" && card && (
            <motion.div key="playing" className="w-full max-w-4xl flex flex-col items-center h-full max-h-[85vh]">
              
              <div className="flex justify-between w-full mb-2 px-1 sm:px-4 shrink-0">
                <div className={`text-center p-1 sm:p-2 px-2 sm:px-4 rounded-xl flex items-center justify-center space-x-2 ${currentTurn === 1 ? 'bg-primary-100 border-2 border-primary-500' : 'bg-white opacity-80'}`}>
                  <img src={`/images/pedine_page_${teamA.pawn}.png`} className="w-8 h-8 sm:w-12 sm:h-12 object-contain hidden sm:block" />
                  <div>
                    <span className={`text-[9px] sm:text-xs font-bold uppercase tracking-widest ${currentTurn === 1 ? 'text-primary-700' : 'text-slate-900'}`}>Squadra A</span>
                    <div className={`text-2xl sm:text-4xl font-black ${currentTurn === 1 ? 'text-primary-900' : 'text-slate-900'}`}>{teamA.score}</div>
                  </div>
                </div>
                
                <div className="text-center p-1 sm:p-2 px-2 sm:px-4 rounded-xl bg-white opacity-90 shadow-sm border border-slate-200">
                  <span className="text-[9px] sm:text-xs font-bold text-slate-900 uppercase tracking-widest">Tempo</span>
                  <div className={`text-2xl sm:text-4xl font-black ${timeLeft <= 10 ? 'text-red-600' : 'text-slate-900'}`}>{timeLeft}</div>
                </div>

                <div className={`text-center p-1 sm:p-2 px-2 sm:px-4 rounded-xl flex items-center justify-center space-x-2 ${currentTurn === 2 ? 'bg-primary-100 border-2 border-primary-500' : 'bg-white opacity-80'}`}>
                  <div>
                    <span className={`text-[9px] sm:text-xs font-bold uppercase tracking-widest ${currentTurn === 2 ? 'text-primary-700' : 'text-slate-900'}`}>Squadra B</span>
                    <div className={`text-2xl sm:text-4xl font-black ${currentTurn === 2 ? 'text-primary-900' : 'text-slate-900'}`}>{teamB.score}</div>
                  </div>
                  <img src={`/images/pedine_page_${teamB.pawn}.png`} className="w-8 h-8 sm:w-12 sm:h-12 object-contain hidden sm:block" />
                </div>
              </div>

              <div className={`w-full max-w-3xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border-4 overflow-hidden ${card.colorTheme.borderClass} flex flex-col flex-1 min-h-0`}>
                <div className={`px-4 py-2 ${card.colorTheme.colorClass} text-white font-black text-lg sm:text-2xl flex justify-between shrink-0`}>
                  <span>Squadra {currentTurn === 1 ? 'A' : 'B'}</span>
                  <span>{timeLeft}s</span>
                </div>
                
                <div className="flex flex-col md:flex-row flex-1 min-h-0">
                  <div className="flex-1 flex flex-col items-center justify-start p-4 sm:p-8 overflow-y-auto min-h-0">
                    <h1 className={`text-4xl sm:text-6xl md:text-7xl font-black mb-4 sm:mb-8 text-center leading-tight ${card.colorTheme.textClass}`}>{card.parola_chiave}</h1>
                    <div className="space-y-2 sm:space-y-4 w-full max-w-sm mt-2 sm:mt-4">
                      {card.parole_taboo.map((t: string) => (
                        <div key={t} className="bg-slate-100 font-bold text-xl sm:text-3xl py-2 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl text-center border-2 border-slate-200 text-slate-800">{t}</div>
                      ))}
                    </div>
                  </div>

                  <div className="p-2 sm:p-4 bg-slate-50 border-t-4 md:border-t-0 md:border-l-4 border-slate-100 grid grid-cols-3 md:grid-cols-1 gap-2 sm:gap-4 shrink-0 md:w-64">
                    <button onClick={() => handleAction("SCARTA")} className="bg-white border-2 sm:border-4 border-slate-200 text-slate-700 font-black text-xs sm:text-2xl rounded-xl sm:rounded-2xl py-3 sm:py-6 flex flex-col items-center justify-center hover:bg-slate-100 active:scale-95 transition-all md:flex-1">
                      <X className="w-5 h-5 sm:w-8 sm:h-8 mb-1"/> <span>Scarta</span> <span className="text-[10px] sm:text-sm opacity-60">({turnStats.passed}/{unlimitedPass ? '∞' : '2'})</span>
                    </button>
                    <button onClick={() => handleAction("ESATTA")} className="bg-emerald-500 border-2 sm:border-4 border-emerald-600 text-white font-black text-xs sm:text-2xl rounded-xl sm:rounded-2xl py-3 sm:py-6 flex flex-col items-center justify-center hover:bg-emerald-600 active:scale-95 transition-all shadow-md md:flex-1">
                      <Check className="w-5 h-5 sm:w-8 sm:h-8 mb-1"/> <span>Esatta!</span>
                    </button>
                    <button onClick={() => handleAction("OPS")} className="bg-red-500 border-2 sm:border-4 border-red-600 text-white font-black text-xs sm:text-2xl rounded-xl sm:rounded-2xl py-3 sm:py-6 flex flex-col items-center justify-center hover:bg-red-600 active:scale-95 transition-all shadow-md md:flex-1">
                      <AlertOctagon className="w-5 h-5 sm:w-8 sm:h-8 mb-1"/> <span>Sbagliata!</span>
                    </button>
                  </div>
                </div>
                {showUndoOps && (
                  <div className="absolute bottom-36 left-1/2 -translate-x-1/2 bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-700 z-50">
                    <button onClick={undoOps} className="font-bold flex items-center text-lg"><Undo2 className="w-6 h-6 mr-2"/> Annulla Sbagliata</button>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {phase === "SUMMARY" && (
            <motion.div key="summary" className="text-center bg-white p-12 rounded-3xl shadow-xl">
              <h2 className="text-5xl font-black text-primary-500 mb-8">Fine Turno</h2>
              <div className="text-2xl font-medium space-y-4 mb-8">
                <p>Indovinate: <span className="text-emerald-500 font-black">+{turnStats.guessed}</span></p>
                <p>Scarti: <span className="text-amber-500 font-black">-{turnStats.passed}</span></p>
                <p>Errori OPS: <span className="text-red-500 font-black">-{turnStats.ops}</span></p>
              </div>
              <button onClick={() => setPhase("BOARD")} className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold shadow-lg">Mostra Tabellone</button>
            </motion.div>
          )}

          {phase === "BOARD" && (
            <motion.div key="board" className="w-full max-w-5xl text-center h-full max-h-[85vh] flex flex-col items-center justify-center">
              <DynamicBoard 
                teamA={{ pos: teamA.pos, pawn: teamA.pawn, id: "A" }} 
                teamB={{ pos: teamB.pos, pawn: teamB.pawn, id: "B" }} 
              />
              <button onClick={nextTurn} className="bg-primary-500 text-white px-8 py-4 rounded-xl font-bold shadow-lg text-xl mt-6 shrink-0">Passa al Turno Successivo</button>
            </motion.div>
          )}

        </AnimatePresence>
        )}
      </main>
    </div>
  );
}
