"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Timer, Check, X, Home, AlertOctagon, Undo2, Play, BookOpen, Settings, Layers, Pause, PlayCircle, LogOut } from "lucide-react";
import Link from "next/link";
import DynamicBoard from "../components/DynamicBoard";
import HostLogin from "@/components/HostLogin";
import { createRoom, subscribeToRoom, updateRoomStatus, updateRoomState, RoomState } from "@/lib/gameLogic";
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

export default function HostBoard() {
  const [phase, setPhase] = useState<"SETUP_DECK" | "SETUP_TOPICS" | "ROOM">("SETUP_DECK");
  const [selectedDeck, setSelectedDeck] = useState<string>("prima");
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [room, setRoom] = useState<RoomState | null>(null);
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
    if (roomCode) {
      const unsubscribe = subscribeToRoom(roomCode, (newRoom) => {
        setRoom(newRoom);
      });
      return () => unsubscribe();
    }
  }, [roomCode]);

  // Host timer sync
  useEffect(() => {
    if (room && room.status === "PLAYING" && !room.state.isPaused && room.state.timeLeft > 0) {
      const timer = setTimeout(() => {
        updateRoomState(room.code, { timeLeft: room.state.timeLeft - 1 });
      }, 1000);
      return () => clearTimeout(timer);
    } else if (room && room.status === "PLAYING" && room.state.timeLeft === 0) {
      updateRoomStatus(room.code, "SUMMARY");
    }
  }, [room]);

  const initializeGame = async () => {
    if (selectedColors.length === 0) return alert("Seleziona almeno un colore!");
    
    setIsLoading(true);
    let allCards: any[] = [];
    
    try {
      const res = await fetch(`/data/cards_${selectedDeck}.json`);
      const data = await res.json();
      allCards = data;
    } catch (e) {
      console.error("Errore", e);
      setIsLoading(false);
      return;
    }

    const chunkSize = Math.ceil(allCards.length / 6);
    let finalDeck: any[] = [];
    
    allCards.forEach((c: any, index: number) => {
      const chunkIndex = Math.min(5, Math.floor(index / chunkSize));
      const colorObj = colorsDB[chunkIndex];
      if (selectedColors.includes(colorObj.id)) {
        finalDeck.push({ word: c.parola_chiave, taboos: c.parole_taboo, colorTheme: colorObj });
      }
    });

    finalDeck = finalDeck.sort(() => Math.random() - 0.5);
    
    const code = await createRoom({ deckId: selectedDeck, topics: selectedColors }, finalDeck);
    setRoomCode(code);
    setIsLoading(false);
    setPhase("ROOM");
  };

  const toggleColor = (id: string) => {
    setSelectedColors(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  };

  const togglePause = () => {
    if (room) {
      updateRoomState(room.code, { isPaused: !room.state.isPaused });
    }
  };

  const startGame = () => {
    if (room) {
      updateRoomState(room.code, { 
        timeLeft: room.state.doubleTime && room.state.currentTurn === 1 ? 120 : 60,
        doubleTime: false
      });
      updateRoomStatus(room.code, "PLAYING");
    }
  };

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

        <div className="font-black text-sm sm:text-xl text-primary-500 text-right flex-1 tracking-tight flex items-center justify-end">
          <span className="hidden sm:inline mr-4">REGIA</span>
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
          <HostLogin onLoginSuccess={() => {}} />
        ) : (
          <AnimatePresence mode="wait">
          
          {phase === "SETUP_DECK" && (
            <motion.div key="setup_deck" className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 text-center border border-slate-100">
              <BookOpen className="w-8 h-8 text-primary-500 mx-auto mb-4" />
              <h2 className="text-3xl font-black text-slate-900 mb-2">Scegli l'Anno</h2>
              <p className="text-slate-500 font-medium mb-8">Crea una nuova stanza di gioco</p>
              <div className="space-y-3 mb-8">
                {decksDB.map(deckOption => (
                  <button key={deckOption.id} onClick={() => setSelectedDeck(deckOption.id)} className={`w-full flex items-center p-4 rounded-xl border-2 transition-all ${selectedDeck === deckOption.id ? 'border-primary-500 bg-primary-50' : 'border-slate-100'}`}>
                    <span className={`font-bold text-lg ${selectedDeck === deckOption.id ? 'text-primary-700' : 'text-slate-700'}`}>{deckOption.name}</span>
                  </button>
                ))}
              </div>
              <button onClick={() => setPhase("SETUP_TOPICS")} className="w-full bg-primary-500 text-white py-4 rounded-xl font-black text-xl shadow-lg active:scale-95 transition-all">AVANTI</button>
            </motion.div>
          )}

          {phase === "SETUP_TOPICS" && (
            <motion.div key="setup_topics" className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 text-center border border-slate-100">
              <Layers className="w-8 h-8 text-primary-500 mx-auto mb-4" />
              <h2 className="text-3xl font-black text-slate-900 mb-8">Macroargomenti</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {colorsDB.map(colorOption => {
                  const isSelected = selectedColors.includes(colorOption.id);
                  return (
                    <button key={colorOption.id} onClick={() => toggleColor(colorOption.id)} className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 ${isSelected ? colorOption.borderClass + ' bg-slate-50' : 'border-slate-100 opacity-60'}`}>
                      <div className={`w-6 h-6 rounded-full ${colorOption.colorClass} mb-2`}></div>
                      <span className={`font-bold text-sm ${isSelected ? colorOption.textClass : 'text-slate-500'}`}>{colorOption.name}</span>
                    </button>
                  );
                })}
              </div>
              <div className="flex space-x-2">
                <button onClick={() => setPhase("SETUP_DECK")} className="flex-1 bg-slate-200 text-slate-700 py-4 rounded-xl font-black text-lg">INDIETRO</button>
                <button onClick={initializeGame} disabled={isLoading} className="flex-[2] bg-emerald-500 text-white py-4 rounded-xl font-black text-lg shadow-lg">CREA STANZA</button>
              </div>
            </motion.div>
          )}

          {phase === "ROOM" && room && (
            <motion.div key="room" className="w-full max-w-5xl bg-white rounded-3xl shadow-xl p-8 flex flex-col items-center relative overflow-hidden min-h-[600px]">
              
              <div className="bg-slate-900 text-white px-8 py-4 rounded-2xl mb-8 flex flex-col items-center shadow-lg">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Codice Stanza</span>
                <span className="text-5xl font-black tracking-widest">{room.code}</span>
              </div>

              {room.status === "LOBBY" && (
                <div className="flex w-full max-w-2xl justify-between items-center mb-12">
                  <div className={`flex-1 p-6 rounded-2xl text-center border-2 ${room.teamA.connected ? 'border-primary-500 bg-primary-50' : 'border-slate-200 border-dashed'}`}>
                    <h3 className="text-xl font-black mb-2">Squadra A</h3>
                    {room.teamA.connected ? <div className="text-primary-600 font-bold flex items-center justify-center"><Check className="w-5 h-5 mr-1"/> Connessa</div> : <div className="text-slate-400 font-medium animate-pulse">In attesa...</div>}
                  </div>
                  <div className="px-8 text-slate-300 font-black text-2xl">VS</div>
                  <div className={`flex-1 p-6 rounded-2xl text-center border-2 ${room.teamB.connected ? 'border-primary-500 bg-primary-50' : 'border-slate-200 border-dashed'}`}>
                    <h3 className="text-xl font-black mb-2">Squadra B</h3>
                    {room.teamB.connected ? <div className="text-primary-600 font-bold flex items-center justify-center"><Check className="w-5 h-5 mr-1"/> Connessa</div> : <div className="text-slate-400 font-medium animate-pulse">In attesa...</div>}
                  </div>
                </div>
              )}

              {room.status === "LOBBY" && room.teamA.connected && room.teamB.connected && (
                <button onClick={startGame} className="bg-emerald-500 text-white px-12 py-5 rounded-full font-black text-2xl shadow-xl hover:bg-emerald-600 transition-all animate-bounce">
                  AVVIA PARTITA!
                </button>
              )}

              {room.status !== "LOBBY" && (
                <div className="w-full flex-1 flex flex-col items-center justify-center">
                  
                  <div className="flex justify-between w-full max-w-4xl px-8 mb-8">
                    <div className="text-center">
                      <span className="text-sm font-bold text-slate-500">{room.teamA.name}</span>
                      <div className="text-6xl font-black text-slate-900">{room.teamA.score}</div>
                    </div>
                    
                    <div className="flex flex-col items-center">
                       <span className="text-sm font-bold text-slate-400 mb-2">TEMPO</span>
                       <div className={`text-8xl font-black ${room.state.timeLeft <= 10 ? 'text-red-500' : 'text-slate-800'}`}>
                         {room.state.timeLeft}
                       </div>
                    </div>

                    <div className="text-center">
                      <span className="text-sm font-bold text-slate-500">{room.teamB.name}</span>
                      <div className="text-6xl font-black text-slate-900">{room.teamB.score}</div>
                    </div>
                  </div>

                  {room.status === "BOARD" && (
                    <div className="w-full max-w-5xl h-full flex items-center justify-center">
                      <DynamicBoard 
                        teamA={{ pos: room.teamA.position, pawn: room.teamA.pawn, id: "A" }} 
                        teamB={{ pos: room.teamB.position, pawn: room.teamB.pawn, id: "B" }} 
                      />
                    </div>
                  )}

                  {room.status === "SUMMARY" && (
                     <div className="text-center py-12">
                       <h3 className="text-4xl font-black text-primary-500 mb-4">Fine Turno!</h3>
                       <p className="text-xl font-medium text-slate-600 mb-8">Punti indovinati: <span className="text-emerald-500 font-bold">+{room.state.cardsGuessed}</span> | Errori OPS: <span className="text-red-500 font-bold">-{room.state.opsPenalties}</span> | Scarti: <span className="text-amber-500 font-bold">-{room.state.cardsPassed}</span></p>
                       <button onClick={() => updateRoomStatus(room.code, "BOARD")} className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold shadow-lg">Mostra Tabellone</button>
                     </div>
                  )}

                  {room.status === "BOARD" && (
                     <button onClick={() => {
                        const activeTeamKey = room.state.currentTurn === 1 ? 'teamA' : 'teamB';
                        const inactiveTeamKey = room.state.currentTurn === 1 ? 'teamB' : 'teamA';
                        
                        let newPos = Math.min(24, Math.max(0, room[activeTeamKey].position + room.state.cardsGuessed - room.state.opsPenalties - room.state.cardsPassed));
                        let unlPass = false; let dblTime = false;
                        
                        if (newPos === 5) unlPass = true;
                        if (newPos === 11) newPos = Math.max(0, newPos - 2);
                        if (newPos === 20) dblTime = true;

                        updateRoomState(room.code, {
                           currentTurn: room.state.currentTurn === 1 ? 2 : 1,
                           cardsGuessed: 0, cardsPassed: 0, opsPenalties: 0,
                           unlimitedPass: unlPass, doubleTime: dblTime
                        });
                        
                        updateRoomStatus(room.code, "PLAYING");
                     }} className="mt-8 bg-primary-500 text-white px-8 py-4 rounded-xl font-bold shadow-lg">
                       Prossimo Turno
                     </button>
                  )}

                  <div className="absolute top-8 right-8">
                     <button onClick={togglePause} className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-4 rounded-full shadow-sm">
                       {room.state.isPaused ? <PlayCircle className="w-8 h-8"/> : <Pause className="w-8 h-8"/>}
                     </button>
                  </div>

                </div>
              )}

              {room.state.isPaused && (
                <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center text-white">
                  <Pause className="w-24 h-24 mb-6 text-white/50" />
                  <h2 className="text-6xl font-black mb-4 tracking-tight">PAUSA</h2>
                  <p className="text-2xl font-medium text-white/70">La partita è momentaneamente sospesa dal Docente.</p>
                  <button onClick={togglePause} className="mt-12 bg-white text-slate-900 px-12 py-5 rounded-full font-black text-xl shadow-2xl hover:scale-105 transition-transform">
                    RIPRENDI GIOCO
                  </button>
                </div>
              )}

            </motion.div>
          )}

        </AnimatePresence>
        )}
      </main>
    </div>
  );
}
