"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Timer, Check, X, Home, AlertOctagon, Undo2, Play, BookOpen, Settings, Layers, Pause, PlayCircle, LogOut, Trophy, Sparkles, Award, FolderOpen, Save, Trash2 } from "lucide-react";
import Link from "next/link";
import DynamicBoard from "../components/DynamicBoard";
import HostLogin from "@/components/HostLogin";
import { createRoom, subscribeToRoom, updateRoomStatus, updateRoomState, updateTeamStats, RoomState } from "@/lib/gameLogic";
import { auth, hubDb } from "@/lib/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { collection, doc, setDoc, getDocs, query, where, deleteDoc } from "firebase/firestore";
import { getPawnImg, getAssetPath } from "@/lib/assets";

import cardsPrima from "@/../public/data/cards_prima.json";
import cardsSeconda from "@/../public/data/cards_seconda.json";
import cardsTerza from "@/../public/data/cards_terza.json";

const CARDS_MAP: Record<string, any[]> = {
  prima: cardsPrima,
  seconda: cardsSeconda,
  terza: cardsTerza,
};

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

export default function HostBoard() {
  const [phase, setPhase] = useState<"SETUP_DECK" | "SETUP_TOPICS" | "ROOM">("SETUP_DECK");
  const [selectedDeck, setSelectedDeck] = useState<string>("prima");
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [room, setRoom] = useState<RoomState | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAllowed, setIsAllowed] = useState(true);

  const [savedHostGames, setSavedHostGames] = useState<any[]>([]);
  const [showSavedHostModal, setShowSavedHostModal] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveSessionName, setSaveSessionName] = useState("");
  const [lastHostStartPos, setLastHostStartPos] = useState({ oldPosA: 1, oldPosB: 1 });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchSavedHostGames(currentUser);
        if (typeof window !== "undefined" && (window as any).HubSubscriptionGuard) {
          const allowed = await (window as any).HubSubscriptionGuard.verifyAccess({
            user: { uid: currentUser.uid, email: currentUser.email },
            role: "docente",
            isPublicView: false
          });
          setIsAllowed(allowed);
        }
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!roomCode) return;
    const unsub = subscribeToRoom(roomCode, (updatedRoom) => {
      setRoom(updatedRoom);
    });
    return () => unsub();
  }, [roomCode]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (room && room.status === "PLAYING" && room.state.timeLeft > 0 && !room.state.isPaused) {
      timer = setTimeout(() => {
        updateRoomState(room.code, { timeLeft: room.state.timeLeft - 1 });
      }, 1000);
      return () => clearTimeout(timer);
    } else if (room && room.status === "PLAYING" && room.state.timeLeft === 0) {
      updateRoomStatus(room.code, "SUMMARY");
    }
  }, [room]);

  const initializeGame = async () => {
    setIsLoading(true);
    try {
      let allCards: any[] = CARDS_MAP[selectedDeck] || [];
      
      if (!allCards || allCards.length === 0) {
        try {
          const res = await fetch(`data/cards_${selectedDeck}.json`);
          const data = await res.json();
          allCards = data;
        } catch (e) {
          try {
            const res = await fetch(`/data/cards_${selectedDeck}.json`);
            const data = await res.json();
            allCards = data;
          } catch(e2) {
            allCards = cardsPrima;
          }
        }
      }

      const activeColors = selectedColors.length > 0 ? selectedColors : colorsDB.map(c => c.id);
      const chunkSize = Math.ceil(allCards.length / 6);
      let finalDeck: any[] = [];
      
      allCards.forEach((c: any, index: number) => {
        const chunkIndex = Math.min(5, Math.floor(index / chunkSize));
        const colorObj = colorsDB[chunkIndex];
        if (activeColors.includes(colorObj.id)) {
          finalDeck.push({ 
            word: c.parola_chiave, 
            taboos: c.parole_taboo, 
            parola_chiave: c.parola_chiave, 
            parole_taboo: c.parole_taboo, 
            colorTheme: colorObj 
          });
        }
      });

      if (finalDeck.length === 0) {
        allCards.forEach((c: any, index: number) => {
          const chunkIndex = Math.min(5, Math.floor(index / chunkSize));
          finalDeck.push({ 
            word: c.parola_chiave, 
            taboos: c.parole_taboo, 
            parola_chiave: c.parola_chiave, 
            parole_taboo: c.parole_taboo, 
            colorTheme: colorsDB[chunkIndex] 
          });
        });
      }

      finalDeck = finalDeck.sort(() => Math.random() - 0.5);
      
      const code = await createRoom({ deckId: selectedDeck, topics: activeColors }, finalDeck);
      setRoomCode(code);
      setPhase("ROOM");
    } catch (err: any) {
      console.error("Errore creazione stanza:", err);
      alert("Impossibile creare la stanza: " + (err.message || "Verifica la connessione e riprova."));
    } finally {
      setIsLoading(false);
    }
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
    if (!room) return;
    const activeTeamKey = room.state.currentTurn === 1 ? 'teamA' : 'teamB';
    const pendingBonus = room[activeTeamKey].pendingBonus || { unlimitedPass: false, doubleTime: false };
    
    updateRoomState(room.code, { 
      timeLeft: pendingBonus.doubleTime ? 120 : 60,
      doubleTime: pendingBonus.doubleTime,
      unlimitedPass: pendingBonus.unlimitedPass
    });

    // Clear active team's consumed bonuses
    updateTeamStats(room.code, room.state.currentTurn, {
      pendingBonus: { unlimitedPass: false, doubleTime: false }
    });

    updateRoomStatus(room.code, "PLAYING");
  };

  const showBoardAfterSummary = async () => {
    if (!room) return;
    const activeTeamKey = room.state.currentTurn === 1 ? 'teamA' : 'teamB';
    const opponentTeamKey = room.state.currentTurn === 1 ? 'teamB' : 'teamA';
    const opponentTurn: 1 | 2 = room.state.currentTurn === 1 ? 2 : 1;

    const currentPosActive = room[activeTeamKey].position || 1;
    const currentPosOpponent = room[opponentTeamKey].position || 1;

    const activeGain = Math.max(0, room.state.cardsGuessed);
    const opponentGain = Math.max(0, room.state.opsPenalties + room.state.cardsPassed);

    let newPosActive = Math.min(24, Math.max(1, currentPosActive + activeGain));
    let newPosOpponent = Math.min(24, Math.max(1, currentPosOpponent + opponentGain));
    let notices: string[] = [];
    
    let activeBonus = {
      unlimitedPass: room[activeTeamKey].pendingBonus?.unlimitedPass || false,
      doubleTime: room[activeTeamKey].pendingBonus?.doubleTime || false
    };

    let opponentBonus = {
      unlimitedPass: room[opponentTeamKey].pendingBonus?.unlimitedPass || false,
      doubleTime: room[opponentTeamKey].pendingBonus?.doubleTime || false
    };

    if (newPosActive === 6) {
      activeBonus.unlimitedPass = true;
      notices.push(`🎣 Casella 6 (Pesca Illimitata): ${room[activeTeamKey].name} potrà scartare senza limiti nel prossimo turno!`);
    } else if (newPosActive === 12) {
      notices.push(`📍 Casella 12: Checkpoint intermedio raggiunto da ${room[activeTeamKey].name}!`);
    } else if (newPosActive === 18) {
      newPosActive = Math.min(24, newPosActive + 1);
      notices.push(`♟️ Casella 18 (Mossa del Cavallo): ${room[activeTeamKey].name} balza alla casella ${newPosActive}!`);
    } else if (newPosActive === 21) {
      activeBonus.doubleTime = true;
      notices.push(`✖️2 Casella 21 (Tempo Doppio): ${room[activeTeamKey].name} avrà 120 secondi nel prossimo turno!`);
    } else if (newPosActive === 24) {
      notices.push(`🏆 TRAGUARDO: ${room[activeTeamKey].name} ha raggiunto il traguardo finale!`);
    }

    if (opponentGain > 0) {
      if (newPosOpponent === 6) {
        opponentBonus.unlimitedPass = true;
        notices.push(`🎣 Casella 6: ${room[opponentTeamKey].name} ottiene scarti illimitati!`);
      } else if (newPosOpponent === 18) {
        newPosOpponent = Math.min(24, newPosOpponent + 1);
        notices.push(`♟️ Casella 18: ${room[opponentTeamKey].name} balza alla casella ${newPosOpponent}!`);
      } else if (newPosOpponent === 21) {
        opponentBonus.doubleTime = true;
        notices.push(`✖️2 Casella 21: ${room[opponentTeamKey].name} ottiene tempo doppio!`);
      } else if (newPosOpponent === 24) {
        notices.push(`🏆 TRAGUARDO: ${room[opponentTeamKey].name} ha raggiunto il traguardo finale!`);
      }
    }

    await updateTeamStats(room.code, room.state.currentTurn, {
      position: newPosActive,
      pendingBonus: activeBonus
    });

    if (opponentGain > 0 || newPosOpponent !== currentPosOpponent) {
      await updateTeamStats(room.code, opponentTurn, {
        position: newPosOpponent,
        pendingBonus: opponentBonus
      });
    }

    setLastHostStartPos({
      oldPosA: room.teamA.position || 1,
      oldPosB: room.teamB.position || 1
    });

    await updateRoomState(room.code, {
      lastSpecialNotice: notices.join(" | ")
    });

    await updateRoomStatus(room.code, "BOARD");
  };

  const handleNextTurn = async () => {
    if (!room) return;
    const nextTurn: 1 | 2 = room.state.currentTurn === 1 ? 2 : 1;
    const nextTeamKey = nextTurn === 1 ? 'teamA' : 'teamB';
    const nextBonus = room[nextTeamKey].pendingBonus || { unlimitedPass: false, doubleTime: false };

    await updateRoomState(room.code, {
      currentTurn: nextTurn,
      cardsGuessed: 0,
      cardsPassed: 0,
      opsPenalties: 0,
      timeLeft: nextBonus.doubleTime ? 120 : 60,
      doubleTime: nextBonus.doubleTime,
      unlimitedPass: nextBonus.unlimitedPass,
      lastSpecialNotice: ""
    });

    // Clear next team's consumed bonus
    await updateTeamStats(room.code, nextTurn, {
      pendingBonus: { unlimitedPass: false, doubleTime: false }
    });

    await updateRoomStatus(room.code, "PLAYING");
  };

  const handleLogout = async () => {
    if (confirm("Vuoi disconnettere il tuo account e tornare alla Home?")) {
      await signOut(auth);
      window.location.href = getAssetPath("/");
    }
  };

  const fetchSavedHostGames = async (currentUser?: User | null) => {
    const activeUser = currentUser || user;
    let localSaves: any[] = [];
    try {
      const raw = localStorage.getItem("ops_storia_saved_host_games");
      if (raw) localSaves = JSON.parse(raw);
    } catch (_) {}

    const map = new Map<string, any>();
    localSaves.forEach(s => map.set(s.id, { ...s, source: "local" }));

    if (activeUser && hubDb) {
      try {
        const q = query(collection(hubDb, "ops_saved_games"), where("userId", "==", activeUser.uid), where("mode", "==", "multiplayer"));
        const snap = await getDocs(q);
        snap.forEach(d => {
          map.set(d.id, { ...d.data(), id: d.id, source: "cloud" });
        });
      } catch (e) {
        console.warn("Errore caricamento salvataggi cloud host:", e);
      }
    }

    setSavedHostGames(Array.from(map.values()).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0)));
  };

  const handleSaveHostGame = async () => {
    if (!room) return;
    const now = new Date();
    const dateFormatted = now.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    const cleanName = saveSessionName.trim() || `Sfida Multiplayer del ${dateFormatted}`;
    const saveId = `host_save_${Date.now()}`;

    const newSave = {
      id: saveId,
      name: cleanName,
      date: dateFormatted,
      timestamp: Date.now(),
      mode: "multiplayer",
      settings: room.settings || { deckId: selectedDeck, topics: selectedColors },
      deck: room.deck || [],
      state: room.state,
      teamA: room.teamA,
      teamB: room.teamB,
      source: user ? "cloud" : "local"
    };

    // 1. Salva in LocalStorage
    try {
      let raw = localStorage.getItem("ops_storia_saved_host_games");
      let list: any[] = raw ? JSON.parse(raw) : [];
      list.unshift(newSave);
      localStorage.setItem("ops_storia_saved_host_games", JSON.stringify(list.slice(0, 20)));
    } catch (_) {}

    // 2. Salva in Cloud Firestore
    if (user && hubDb) {
      try {
        await setDoc(doc(hubDb, "ops_saved_games", saveId), {
          ...newSave,
          userId: user.uid,
          userEmail: (user.email || '').toLowerCase().trim(),
          updatedAt: new Date().toISOString()
        });
        console.log("☁️ Sessione Multiplayer salvata sul Cloud!");
      } catch (e) {
        console.warn("Salvataggio Cloud host fallito:", e);
      }
    }

    setShowSaveDialog(false);
    alert("Sessione Multiplayer salvata con successo! Potrai riprenderla in qualsiasi momento da questo o da un altro dispositivo.");
    setPhase("SETUP_DECK");
  };

  const handleLoadHostGame = async (savedItem: any) => {
    setIsLoading(true);
    try {
      const newRoomCode = await createRoom(savedItem.settings, savedItem.deck || []);
      
      // Ripristina statistiche e posizioni squadre
      await updateTeamStats(newRoomCode, 1, {
        name: savedItem.teamA?.name || "Squadra A",
        score: savedItem.teamA?.score || 0,
        pawn: savedItem.teamA?.pawn || 1,
        position: savedItem.teamA?.position || 1
      });
      await updateTeamStats(newRoomCode, 2, {
        name: savedItem.teamB?.name || "Squadra B",
        score: savedItem.teamB?.score || 0,
        pawn: savedItem.teamB?.pawn || 2,
        position: savedItem.teamB?.position || 1
      });

      if (savedItem.state) {
        await updateRoomState(newRoomCode, {
          currentTurn: savedItem.state.currentTurn || 1,
          cardIndex: savedItem.state.cardIndex || 0,
          timeLeft: savedItem.state.timeLeft || 60
        });
      }

      setRoomCode(newRoomCode);
      setShowSavedHostModal(false);
      setPhase("ROOM");
    } catch (e: any) {
      alert("Errore caricamento sessione: " + e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSavedHostGame = async (saveId: string) => {
    try {
      let raw = localStorage.getItem("ops_storia_saved_host_games");
      if (raw) {
        let list: any[] = JSON.parse(raw);
        list = list.filter(s => s.id !== saveId);
        localStorage.setItem("ops_storia_saved_host_games", JSON.stringify(list));
      }
      setSavedHostGames(prev => prev.filter(s => s.id !== saveId));
    } catch (_) {}

    if (user && hubDb) {
      try {
        await deleteDoc(doc(hubDb, "ops_saved_games", saveId));
      } catch (_) {}
    }
  };

  const getRankedTeams = () => {
    if (!room) return [];
    const tA = { ...room.teamA, id: 'A', isTeamA: true };
    const tB = { ...room.teamB, id: 'B', isTeamA: false };
    const teams = [tA, tB];
    return teams.sort((a, b) => {
      if (b.position !== a.position) return b.position - a.position;
      return b.score - a.score;
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      <header className="bg-white px-4 py-3 flex items-center justify-between shadow-sm sticky top-0 z-10 shrink-0">
        <div className="flex items-center space-x-2 sm:space-x-4 flex-1">
          <Link href="/" className="shrink-0 flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-full font-bold text-xs sm:text-sm transition-all" title="Torna alla Home">
            <Home className="w-4 h-4 text-primary-500" />
            <span className="hidden sm:inline">Home</span>
          </Link>
          <img src="https://prof-memmo.github.io/prof-memmo-gestione-siti/shared/assets/branding/games/ops-storia-badge.png" alt="Ops!" className="h-10 sm:h-14 object-contain shrink-0 hidden sm:block" />
        </div>
        
        <div className="flex items-center justify-center flex-1">
           <img src="https://prof-memmo.github.io/prof-memmo-gestione-siti/shared/assets/branding/prof-memmo/avatar.png" alt="Prof Memmo" className="h-12 sm:h-16 object-contain" />
        </div>

        <div className="font-black text-sm sm:text-xl text-primary-500 text-right flex-1 tracking-tight flex items-center justify-end gap-3">
          <button onClick={() => setPhase("SETUP_DECK")} className="text-xs sm:text-sm font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-full transition-all" title="Crea Nuova Stanza">
            Nuova Stanza
          </button>
          {user && (
            <button onClick={handleLogout} className="flex items-center gap-1.5 text-slate-400 hover:text-red-500 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-full text-xs font-bold transition-colors" title="Disconnetti Account">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Disconnetti</span>
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        {authLoading ? (
          <div className="text-slate-400 font-bold animate-pulse">Caricamento...</div>
        ) : !user ? (
          <HostLogin onLoginSuccess={() => {}} />
        ) : !isAllowed ? null : (
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
              <div className="flex gap-3">
                <button onClick={() => setPhase("SETUP_TOPICS")} className="flex-1 bg-primary-500 text-white py-4 rounded-xl font-black text-xl shadow-lg active:scale-95 transition-all">AVANTI</button>
                <button onClick={() => { fetchSavedHostGames(); setShowSavedHostModal(true); }} className="flex-1 bg-slate-100 border-2 border-slate-200 text-slate-700 py-4 rounded-xl font-black flex items-center justify-center gap-2 hover:bg-slate-200 transition-all text-sm">
                  <FolderOpen className="w-5 h-5 text-amber-600" /> Riprendi Partita
                </button>
              </div>
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

              {room.status !== "LOBBY" && room.status !== "LEADERBOARD" && (
                <div className="w-full flex-1 flex flex-col items-center justify-center">
                  
                  <div className="flex justify-between w-full max-w-4xl px-8 mb-4 items-center">
                    <div className="text-center">
                      <span className="text-sm font-bold text-slate-500">{room.teamA.name}</span>
                      <div className="text-5xl font-black text-slate-900">{room.teamA.score} <span className="text-sm text-slate-400 font-normal">pts</span></div>
                      <div className="text-xs font-bold text-primary-600">Casella: {room.teamA.position || 1}</div>
                    </div>
                    
                    <div className="flex flex-col items-center">
                       <span className="text-sm font-bold text-slate-400 mb-1">TEMPO</span>
                       <div className={`text-6xl font-black ${room.state.timeLeft <= 10 ? 'text-red-500' : 'text-slate-800'}`}>
                         {room.state.timeLeft}s
                       </div>
                       {(room.state.unlimitedPass || room.state.doubleTime) && (
                         <div className="flex gap-2 mt-2">
                           {room.state.unlimitedPass && <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">🎣 Scarti Infiniti</span>}
                           {room.state.doubleTime && <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-0.5 rounded-full">✖️2 Tempo Doppio</span>}
                         </div>
                       )}
                    </div>

                    <div className="text-center">
                      <span className="text-sm font-bold text-slate-500">{room.teamB.name}</span>
                      <div className="text-5xl font-black text-slate-900">{room.teamB.score} <span className="text-sm text-slate-400 font-normal">pts</span></div>
                      <div className="text-xs font-bold text-primary-600">Casella: {room.teamB.position || 1}</div>
                    </div>
                  </div>

                  {room.status === "BOARD" && (
                    <div className="w-full max-w-5xl flex flex-col items-center">
                      <DynamicBoard 
                        teamA={{ pos: room.teamA.position || 1, oldPos: lastHostStartPos.oldPosA, pawn: room.teamA.pawn, id: "A", name: room.teamA.name }} 
                        teamB={{ pos: room.teamB.position || 1, oldPos: lastHostStartPos.oldPosB, pawn: room.teamB.pawn, id: "B", name: room.teamB.name }} 
                      />

                      {room.state.lastSpecialNotice && (
                        <div className="mt-4 bg-amber-50 border-2 border-amber-300 text-amber-900 font-bold px-6 py-3 rounded-2xl shadow-sm text-center animate-bounce">
                          {room.state.lastSpecialNotice}
                        </div>
                      )}

                      <div className="flex flex-wrap gap-4 mt-6 justify-center">
                        <button 
                          onClick={handleNextTurn} 
                          className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-xl font-black text-lg shadow-lg active:scale-95 transition-all flex items-center gap-2"
                        >
                          <Play className="w-5 h-5 fill-current" />
                          Prossimo Turno ({room.state.currentTurn === 1 ? room.teamB.name : room.teamA.name})
                        </button>
                        <button 
                          onClick={() => updateRoomStatus(room.code, "LEADERBOARD")} 
                          className="bg-slate-800 hover:bg-slate-900 text-white px-6 py-4 rounded-xl font-bold text-base shadow-md active:scale-95 transition-all flex items-center gap-2"
                        >
                          <Trophy className="w-5 h-5 text-amber-400" />
                          Classifica
                        </button>
                      </div>
                    </div>
                  )}

                  {room.status === "SUMMARY" && (
                     <div className="text-center py-12 bg-white rounded-3xl shadow-sm border border-slate-100 p-8 max-w-2xl">
                       <h3 className="text-4xl font-black text-primary-500 mb-4">Fine Turno!</h3>
                       <p className="text-xl font-medium text-slate-600 mb-8">
                         Punti indovinati: <span className="text-emerald-500 font-bold">+{room.state.cardsGuessed}</span> | Errori OPS: <span className="text-red-500 font-bold">-{room.state.opsPenalties}</span> | Scarti: <span className="text-amber-500 font-bold">-{room.state.cardsPassed}</span>
                       </p>
                       <button onClick={showBoardAfterSummary} className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-xl font-bold shadow-lg text-lg transition-all">
                         Mostra Tabellone & Muovi Pedine
                       </button>
                     </div>
                  )}

                  <div className="absolute top-8 right-8">
                     <button onClick={togglePause} className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-4 rounded-full shadow-sm">
                       {room.state.isPaused ? <PlayCircle className="w-8 h-8"/> : <Pause className="w-8 h-8"/>}
                     </button>
                  </div>

                </div>
              )}

              {/* LEADERBOARD VIEW */}
              {room.status === "LEADERBOARD" && (
                <div className="w-full flex flex-col items-center justify-center py-6 max-w-3xl">
                  <div className="inline-flex items-center gap-2 bg-amber-100 border border-amber-300 text-amber-800 px-4 py-1.5 rounded-full font-black text-sm uppercase tracking-wider mb-4 shadow-sm">
                    <Trophy className="w-4 h-4 text-amber-600" /> Classifica Partita
                  </div>

                  <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-2 text-center tracking-tight">
                    {room.teamA.position >= 24 || room.teamB.position >= 24 ? "🏆 Vittoria Finale!" : "📊 Classifica Squadre"}
                  </h2>
                  <p className="text-slate-500 font-medium mb-8 text-center">
                    {room.teamA.position >= 24 || room.teamB.position >= 24 ? "Una squadra ha raggiunto il traguardo finale della Storia!" : "Riepilogo delle posizioni sul tabellone e punteggi."}
                  </p>

                  {/* Podium / Teams Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full mb-8">
                    {getRankedTeams().map((team, idx) => {
                      const isFirst = idx === 0;
                      return (
                        <div 
                          key={team.id} 
                          className={`relative rounded-3xl p-6 flex flex-col items-center border-4 shadow-xl transition-all ${
                            isFirst 
                              ? 'bg-gradient-to-b from-amber-50 to-white border-amber-400 shadow-amber-200/50' 
                              : 'bg-white border-slate-200 shadow-slate-200/50'
                          }`}
                        >
                          <div className="absolute -top-4 bg-slate-900 text-white font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-md">
                            {isFirst ? <span className="text-amber-300">🥇 1° Posto</span> : <span>🥈 2° Posto</span>}
                          </div>

                          <div className="w-20 h-20 rounded-full border-4 border-white shadow-xl overflow-hidden bg-slate-100 flex items-center justify-center my-3">
                            <img src={getPawnImg(team.pawn || 1)} alt={team.name} className="w-full h-full object-cover" />
                          </div>

                          <h3 className="text-2xl font-black text-slate-900 mb-1">{team.name}</h3>

                          <div className="flex items-center gap-2 mb-4">
                            <span className="text-xs font-bold px-3 py-1 bg-primary-50 text-primary-700 rounded-full border border-primary-200">
                              Casella {team.position || 1} / 24
                            </span>
                          </div>

                          <div className="w-full bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2">
                            <div className="flex justify-between items-center text-sm font-bold text-slate-600">
                              <span>Punti Totali:</span>
                              <span className="text-lg font-black text-slate-900">{team.score}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm font-bold text-slate-600">
                              <span>Avanzamento:</span>
                              <span className="text-primary-600 font-black">{Math.round(((team.position || 1) / 24) * 100)}%</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-4 justify-center">
                    <button
                      onClick={() => updateRoomStatus(room.code, "BOARD")}
                      className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-2xl font-black text-lg shadow-lg active:scale-95 transition-all flex items-center gap-2"
                    >
                      <Play className="w-5 h-5 fill-current" /> Torna al Tabellone
                    </button>
                    <button
                      onClick={() => setPhase("SETUP_DECK")}
                      className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-6 py-4 rounded-2xl font-bold text-base shadow-sm active:scale-95 transition-all"
                    >
                      Nuova Partita
                    </button>
                  </div>
                </div>
              )}

              {room.state.isPaused && (
                <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center text-white p-6">
                  <Pause className="w-20 h-20 mb-4 text-white/50" />
                  <h2 className="text-5xl font-black mb-2 tracking-tight">PAUSA</h2>
                  <p className="text-xl font-medium text-white/70 mb-8">La partita è momentaneamente sospesa dal Docente.</p>
                  
                  <div className="flex flex-wrap gap-4 justify-center">
                    <button onClick={togglePause} className="bg-white text-slate-900 px-10 py-4 rounded-full font-black text-lg shadow-2xl hover:scale-105 transition-transform flex items-center gap-2">
                      <Play className="w-5 h-5 fill-current" /> RIPRENDI GIOCO
                    </button>
                    <button onClick={() => setShowSaveDialog(true)} className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-full font-black text-lg shadow-xl hover:scale-105 transition-transform flex items-center gap-2">
                      <Save className="w-5 h-5" /> SALVA SESSIONE
                    </button>
                  </div>
                </div>
              )}

            </motion.div>
          )}

        </AnimatePresence>
        )}
      </main>

      {/* Modal Partite Multiplayer Salvate */}
      {showSavedHostModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-w-lg w-full border border-slate-100 max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                <FolderOpen className="w-6 h-6 text-amber-600" /> Sfide Multiplayer Salvate
              </h3>
              <button onClick={() => setShowSavedHostModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-6 h-6" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4">Seleziona una sessione multiplayer per rigenerare la stanza con i punteggi e le posizioni salvate.</p>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {savedHostGames.length === 0 ? (
                <div className="text-center py-10 text-slate-400 font-medium text-sm">
                  Nessuna sfida multiplayer salvata trovata.
                </div>
              ) : (
                savedHostGames.map(s => {
                  const isCloud = s.source === "cloud";
                  return (
                    <div key={s.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 hover:border-amber-400 transition-all">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-black text-slate-900 text-base">{s.name}</h4>
                          {isCloud ? (
                            <span className="bg-indigo-100 text-indigo-700 border border-indigo-200 text-[10px] font-extrabold px-1.5 py-0.5 rounded-md">
                              ☁️ Cloud
                            </span>
                          ) : (
                            <span className="bg-slate-200 text-slate-700 text-[10px] font-semibold px-1.5 py-0.5 rounded-md">
                              🖥️ Locale
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 font-medium mt-1">
                          {s.date} • A: c.{s.teamA?.position || 1} ({s.teamA?.score || 0} pts) vs B: c.{s.teamB?.position || 1} ({s.teamB?.score || 0} pts)
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleLoadHostGame(s)} 
                          disabled={isLoading}
                          className="bg-primary-500 hover:bg-primary-600 text-white font-bold px-3 py-1.5 rounded-lg text-xs shadow"
                        >
                          Riprendi
                        </button>
                        <button 
                          onClick={() => handleDeleteSavedHostGame(s.id)} 
                          className="text-slate-400 hover:text-red-500 p-1.5" 
                          title="Elimina"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="mt-4 pt-3 border-t flex justify-end">
              <button onClick={() => setShowSavedHostModal(false)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-bold text-sm">
                Chiudi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dialog Salva Sessione Host */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-w-md w-full border border-slate-100">
            <h3 className="text-2xl font-black text-slate-900 mb-2 flex items-center gap-2">
              <Save className="w-6 h-6 text-amber-600" /> Salva Sfida Multiplayer
            </h3>
            <p className="text-xs text-slate-500 mb-4">Assegna un nome alla sessione per riprenderla alla prossima lezione.</p>

            <input 
              type="text" 
              value={saveSessionName}
              onChange={(e) => setSaveSessionName(e.target.value)}
              placeholder="Es. Sfida 2ª A vs 2ª B"
              className="w-full p-3.5 border-2 border-slate-200 rounded-xl font-bold text-slate-900 mb-6 focus:border-primary-500 outline-none"
            />

            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowSaveDialog(false)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-3 rounded-xl font-bold text-sm">
                Annulla
              </button>
              <button onClick={handleSaveHostGame} className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md">
                Salva ed Esci
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
