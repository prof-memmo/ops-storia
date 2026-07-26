"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Check, X, Home, AlertOctagon, Undo2, Pause, LogIn } from "lucide-react";
import Link from "next/link";
import { joinRoom, subscribeToRoom, updateRoomState, updateTeamStats, RoomState } from "@/lib/gameLogic";

export default function ClientBoard() {
  const [phase, setPhase] = useState<"JOIN" | "WAITING" | "PLAYING" | "SUMMARY">("JOIN");
  const [roomCode, setRoomCode] = useState("");
  const [teamName, setTeamName] = useState("");
  const [teamId, setTeamId] = useState<1 | 2>(1);
  const [pawn, setPawn] = useState(1);
  const [room, setRoom] = useState<RoomState | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (room && phase === "WAITING" && room.status === "PLAYING") {
      setPhase("PLAYING");
    } else if (room && room.status === "SUMMARY") {
      setPhase("SUMMARY");
    } else if (room && room.status === "BOARD") {
      setPhase("WAITING"); // Client waits during board animation on host
    } else if (room && room.status === "LOBBY") {
      setPhase("WAITING");
    }
  }, [room, phase]);

  const handleJoin = async () => {
    if (!roomCode || !teamName) return setError("Compila tutti i campi");
    setIsLoading(true);
    setError("");
    try {
      await joinRoom(roomCode, teamId, pawn, teamName);
      subscribeToRoom(roomCode, (newRoom) => setRoom(newRoom));
      setPhase("WAITING");
    } catch (err: any) {
      setError(err.message || "Errore di connessione alla stanza");
    }
    setIsLoading(false);
  };

  const handleAction = async (action: "ESATTA" | "SCARTA" | "OPS") => {
    if (!room) return;
    const currentCard = room.deck[room.state.cardIndex % room.deck.length];
    const teamKey = room.state.currentTurn === 1 ? 'teamA' : 'teamB';
    const opponentKey = room.state.currentTurn === 1 ? 'teamB' : 'teamA';

    if (action === "ESATTA") {
      await updateRoomState(room.code, { 
        cardsGuessed: room.state.cardsGuessed + 1,
        cardIndex: room.state.cardIndex + 1 
      });
      await updateTeamStats(room.code, room.state.currentTurn, { score: room[teamKey].score + 1 });
    } 
    else if (action === "SCARTA") {
      if (room.state.cardsPassed >= 2 && !room.state.unlimitedPass) {
        alert("Hai raggiunto il limite massimo di 2 scarti!");
        return;
      }
      await updateRoomState(room.code, { 
        cardsPassed: room.state.cardsPassed + 1,
        cardIndex: room.state.cardIndex + 1 
      });
      await updateTeamStats(room.code, room.state.currentTurn === 1 ? 2 : 1, { score: room[opponentKey].score + 1 });
    }
    else if (action === "OPS") {
      await updateRoomState(room.code, { 
        opsPenalties: room.state.opsPenalties + 1,
        showUndo: true
      });
      await updateTeamStats(room.code, room.state.currentTurn === 1 ? 2 : 1, { score: room[opponentKey].score + 1 });
      
      // Auto hide undo after 3s
      setTimeout(() => {
        updateRoomState(room.code, { showUndo: false });
      }, 3000);
    }
  };

  const undoOps = async () => {
    if (!room || !room.state.showUndo) return;
    const opponentKey = room.state.currentTurn === 1 ? 'teamB' : 'teamA';
    
    await updateRoomState(room.code, { 
      opsPenalties: Math.max(0, room.state.opsPenalties - 1),
      showUndo: false
    });
    await updateTeamStats(room.code, room.state.currentTurn === 1 ? 2 : 1, { score: Math.max(0, room[opponentKey].score - 1) });
  };

  const currentCard = room && room.deck.length > 0 ? room.deck[room.state.cardIndex % room.deck.length] : null;
  const isActiveTeam = room ? teamId === room.state.currentTurn : false;

  return (
    <div className="h-[100dvh] w-screen bg-slate-50 flex flex-col font-sans overflow-hidden">
      
      <header className="bg-white px-4 py-3 flex items-center justify-between shadow-sm sticky top-0 z-10 shrink-0 border-b border-slate-100">
        <div className="flex items-center space-x-2 flex-1">
          <Link href="/" className="shrink-0 hover:scale-110 transition-transform">
            <img src="/icons/6.png" alt="Home" className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
          </Link>
          <img src="/images/logo.png" alt="Ops!" className="h-10 sm:h-14 object-contain shrink-0" />
        </div>
        
        <div className="flex items-center justify-center flex-1">
           <img src="/images/avatar.png" alt="Prof Memmo" className="h-12 sm:h-16 object-contain" />
        </div>

        <div className="text-sm font-black text-primary-500 text-right flex-1 uppercase tracking-tighter">
          {room ? `STANZA ${room.code}` : 'UNISCITI'}
        </div>
      </header>

      <main className="flex-1 relative flex items-center justify-center p-2 sm:p-4 overflow-hidden">
        <AnimatePresence mode="wait">
          
          {phase === "JOIN" && (
            <motion.div key="join" className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
              <div className="flex justify-center mb-6 text-primary-500">
                <LogIn className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-black text-center text-slate-900 mb-6">Codice Stanza</h2>
              
              {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-bold mb-4 text-center">{error}</div>}
              
              <div className="space-y-4 mb-6">
                <input 
                  type="text" 
                  placeholder="ES: 4X8B9" 
                  value={roomCode}
                  onChange={e => setRoomCode(e.target.value.toUpperCase())}
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-4 text-center font-black text-2xl uppercase tracking-widest focus:border-primary-500 focus:outline-none transition-colors"
                />

                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => { setTeamId(1); setTeamName("Squadra A"); }} className={`py-3 rounded-xl border-2 font-bold transition-all ${teamId === 1 ? 'border-primary-500 bg-primary-50 text-primary-600' : 'border-slate-200 text-slate-400'}`}>Squadra A</button>
                  <button onClick={() => { setTeamId(2); setTeamName("Squadra B"); }} className={`py-3 rounded-xl border-2 font-bold transition-all ${teamId === 2 ? 'border-primary-500 bg-primary-50 text-primary-600' : 'border-slate-200 text-slate-400'}`}>Squadra B</button>
                </div>

                <div className="pt-2">
                  <p className="text-xs font-bold text-slate-400 uppercase text-center mb-2">Scegli la Pedina</p>
                  <div className="flex flex-wrap justify-center gap-3">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(p => (
                      <button key={p} onClick={() => setPawn(p)} className={`w-16 h-16 p-1 rounded-xl border-2 transition-all ${pawn === p ? 'border-primary-500 bg-primary-50 shadow-md scale-110' : 'border-transparent opacity-60'}`}>
                        <img src={`/images/pedine_page_${p}.png`} className="w-full h-full object-contain" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button onClick={handleJoin} disabled={isLoading} className="w-full bg-primary-500 text-white py-4 rounded-xl font-black text-xl shadow-lg active:scale-95 transition-all">
                {isLoading ? 'CONNESSIONE...' : 'ENTRA'}
              </button>
            </motion.div>
          )}

          {phase === "WAITING" && (
            <motion.div key="waiting" className="text-center p-8">
               <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-6"></div>
               <h2 className="text-2xl font-black text-slate-900 mb-2">In Attesa...</h2>
               <p className="text-slate-500 font-medium">Guarda il tabellone del docente. La partita inizierà a breve!</p>
            </motion.div>
          )}

          {phase === "SUMMARY" && (
            <motion.div key="summary" className="text-center p-8">
               <h2 className="text-3xl font-black text-primary-500 mb-4">Fine del Turno</h2>
               <p className="text-slate-500 font-medium mb-6">Guarda il tabellone per vedere il riepilogo e l'avanzamento delle pedine!</p>
            </motion.div>
          )}

          {phase === "PLAYING" && currentCard && room && (
            <motion.div key="playing" className={`w-full max-w-4xl h-full max-h-[700px] bg-white rounded-3xl shadow-xl flex flex-col border-4 overflow-hidden ${currentCard.colorTheme.borderClass}`}>
              
              <div className={`${currentCard.colorTheme.colorClass} text-white text-center py-2 font-bold text-xs sm:text-sm uppercase tracking-widest shrink-0 flex justify-between px-4`}>
                <span>{isActiveTeam ? "Il tuo turno" : "Controlla"}</span>
                <span>{room.state.timeLeft}s</span>
              </div>
              
              <div className="flex flex-col md:flex-row flex-1 min-h-0">
                  <div className="flex-1 flex flex-col items-center justify-center p-4">
                    <h1 className={`text-3xl sm:text-5xl md:text-6xl font-black mb-2 text-center leading-tight shrink-0 ${currentCard.colorTheme.textClass}`}>
                      {currentCard.word}
                    </h1>
                    
                    <div className="bg-slate-100 w-full p-4 rounded-xl border border-slate-200 mt-2 min-h-0 flex-1 overflow-y-auto">
                      <p className="text-center font-bold text-slate-400 text-xs uppercase tracking-widest mb-1">Parole Vietate</p>
                      <ul className="text-center space-y-1 sm:space-y-2">
                        {currentCard.taboos.map((word: string) => (
                          <div key={word} className="bg-slate-50 text-slate-700 font-bold py-1.5 sm:py-2 px-2 sm:px-4 rounded-lg sm:rounded-xl text-center text-base sm:text-xl border border-slate-100">{word}</div>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="p-2 sm:p-4 bg-slate-50 border-t-2 md:border-t-0 md:border-l-4 sm:border-t-4 border-slate-100 shrink-0 md:w-64">
                    {isActiveTeam ? (
                      <div className="grid grid-cols-2 md:grid-cols-1 gap-2 sm:gap-4 h-full">
                        <button onClick={() => handleAction("SCARTA")} className={`bg-white border-2 sm:border-4 border-slate-200 text-slate-700 font-black text-xs sm:text-2xl rounded-xl sm:rounded-2xl py-3 sm:py-6 flex flex-col items-center justify-center transition-all shadow-sm sm:shadow-md md:flex-1 ${room.state.cardsPassed >= 2 && !room.state.unlimitedPass ? 'opacity-50 pointer-events-none' : 'hover:bg-slate-100 active:scale-95'}`}>
                          <X className="w-5 h-5 sm:w-8 sm:h-8 mb-1"/> <span>Scarta</span> <span className="text-[10px] sm:text-sm opacity-60">({room.state.cardsPassed}/{room.state.unlimitedPass ? '∞' : '2'})</span>
                        </button>
                        <button onClick={() => handleAction("ESATTA")} className="bg-emerald-500 border-2 sm:border-4 border-emerald-600 text-white font-black text-xs sm:text-2xl rounded-xl sm:rounded-2xl py-3 sm:py-6 flex flex-col items-center justify-center hover:bg-emerald-600 active:scale-95 transition-all shadow-sm sm:shadow-md md:flex-1">
                          <Check className="w-5 h-5 sm:w-8 sm:h-8 mb-1"/> <span>Esatta!</span>
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col space-y-2 h-full">
                        <button onClick={() => handleAction("OPS")} className="w-full bg-red-500 text-white py-3 sm:py-6 rounded-xl sm:rounded-2xl flex flex-col justify-center items-center font-black text-xl sm:text-3xl shadow-xl hover:bg-red-600 active:scale-95 transition-all border-2 sm:border-4 border-red-600 flex-1">
                          <AlertOctagon className="w-6 h-6 sm:w-10 sm:h-10 mb-1 sm:mr-2" /> OPS! (Sbagliata)
                        </button>
                        {room.state.showUndo ? (
                          <button onClick={undoOps} className="flex items-center justify-center text-slate-500 active:text-slate-800 font-bold py-2 bg-slate-200 rounded-xl text-sm sm:text-base shrink-0 mt-2">
                            <Undo2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2" /> Annulla penalità
                          </button>
                        ) : (
                          <div className="h-9 shrink-0 mt-2"></div> 
                        )}
                      </div>
                    )}
                  </div>
              </div>
            </motion.div>
          )}

          {/* PAUSE OVERLAY */}
          {room && room.state.isPaused && (
             <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-sm z-50 flex flex-col items-center justify-center text-white">
                <Pause className="w-20 h-20 mb-6 text-white/50" />
                <h2 className="text-5xl font-black mb-4 tracking-tight">PAUSA</h2>
                <p className="text-lg font-medium text-white/70 text-center px-8">La partita è stata sospesa dal Docente. Il timer è fermo.</p>
             </div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}
