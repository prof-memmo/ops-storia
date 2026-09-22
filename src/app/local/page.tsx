"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, Timer, Check, X, Home, AlertOctagon, Undo2, LogIn, ArrowLeft, LogOut, 
  Trophy, Pause, Play, FolderOpen, Save, Trash2, Clock, Sparkles, Award
} from "lucide-react";
import Link from "next/link";
import DynamicBoard from "../components/DynamicBoard";
import HostLogin from "@/components/HostLogin";
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

const avatars = Array.from({length: 8}, (_, i) => i + 1);

interface TeamData {
  name: string;
  score: number;
  pawn: number;
  pos: number;
  pendingBonus: {
    unlimitedPass: boolean;
    doubleTime: boolean;
  };
}

interface SavedGame {
  id: string;
  name: string;
  date: string;
  timestamp: number;
  selectedDeck: string;
  selectedColors: string[];
  currentTurn: 1 | 2;
  teamA: TeamData;
  teamB: TeamData;
  currentCardIndex: number;
  source?: "cloud" | "local";
}

export default function LocalPlay() {
  const [phase, setPhase] = useState<"SETUP" | "TOPICS" | "AVATAR_A" | "AVATAR_B" | "READY" | "PLAYING" | "SUMMARY" | "BOARD" | "LEADERBOARD">("SETUP");
  const [selectedDeck, setSelectedDeck] = useState("prima");
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  
  const [deck, setDeck] = useState<any[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  
  const [teamA, setTeamA] = useState<TeamData>({ 
    name: "Squadra A", 
    score: 0, 
    pawn: 1, 
    pos: 1, 
    pendingBonus: { unlimitedPass: false, doubleTime: false } 
  });
  const [teamB, setTeamB] = useState<TeamData>({ 
    name: "Squadra B", 
    score: 0, 
    pawn: 2, 
    pos: 1, 
    pendingBonus: { unlimitedPass: false, doubleTime: false } 
  });

  const [selectedPawnA, setSelectedPawnA] = useState<number | null>(null);
  const [selectedPawnB, setSelectedPawnB] = useState<number | null>(null);
  const [currentTurn, setCurrentTurn] = useState<1 | 2>(1);
  
  const [timeLeft, setTimeLeft] = useState(60);
  
  const [turnStats, setTurnStats] = useState({ guessed: 0, passed: 0, ops: 0 });
  const [showUndoOps, setShowUndoOps] = useState(false);
  const [activeDoubleTime, setActiveDoubleTime] = useState(false);
  const [activeUnlimitedPass, setActiveUnlimitedPass] = useState(false);
  const [lastSpecialNotice, setLastSpecialNotice] = useState<string>("");

  const [isFinalLeaderboard, setIsFinalLeaderboard] = useState(false);
  const [showSavedGamesModal, setShowSavedGamesModal] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveSessionName, setSaveSessionName] = useState("");
  const [cloudSavedGames, setCloudSavedGames] = useState<SavedGame[]>([]);

  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAllowed, setIsAllowed] = useState(true);

  const handleSelectPawnA = (pawnId: number) => {
    setSelectedPawnA(pawnId);
    setTeamA(s => ({ ...s, pawn: pawnId }));
    setPhase("AVATAR_B");
  };

  const handleSelectPawnB = (pawnId: number) => {
    setSelectedPawnB(pawnId);
    setTeamB(s => ({ ...s, pawn: pawnId }));
    setPhase("READY");
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchCloudSavedGames(currentUser);
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
    let timer: NodeJS.Timeout;
    if (phase === "PLAYING" && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (phase === "PLAYING" && timeLeft === 0) {
      setPhase("SUMMARY");
    }
    return () => clearTimeout(timer);
  }, [timeLeft, phase]);

  const initGame = async () => {
    let allCards: any[] = CARDS_MAP[selectedDeck] || [];
    if (!allCards || allCards.length === 0) {
      try {
        const res = await fetch(`data/cards_${selectedDeck}.json`);
        allCards = await res.json();
      } catch(e) {
        try {
          const res = await fetch(`/data/cards_${selectedDeck}.json`);
          allCards = await res.json();
        } catch(e2) {
          allCards = cardsPrima;
        }
      }
    }

    const chunkSize = Math.ceil(allCards.length / 6);
    let finalDeck: any[] = [];
    const activeColors = selectedColors.length > 0 ? selectedColors : colorsDB.map(c => c.id);
    
    allCards.forEach((c: any, index: number) => {
      const chunkIndex = Math.min(5, Math.floor(index / chunkSize));
      const colorObj = colorsDB[chunkIndex];
      if (activeColors.includes(colorObj.id)) {
        finalDeck.push({ ...c, colorTheme: colorObj });
      }
    });

    if (finalDeck.length === 0) {
      allCards.forEach((c: any, index: number) => {
        const chunkIndex = Math.min(5, Math.floor(index / chunkSize));
        finalDeck.push({ ...c, colorTheme: colorsDB[chunkIndex] });
      });
    }

    setDeck(finalDeck.sort(() => Math.random() - 0.5));
    setPhase("AVATAR_A");
  };

  const startGame = () => {
    const activeTeam = currentTurn === 1 ? teamA : teamB;
    const setActiveTeam = currentTurn === 1 ? setTeamA : setTeamB;

    const hasDoubleTime = activeTeam.pendingBonus?.doubleTime || false;
    const hasUnlimitedPass = activeTeam.pendingBonus?.unlimitedPass || false;

    setActiveTeam(s => ({
      ...s,
      pendingBonus: { unlimitedPass: false, doubleTime: false }
    }));

    setTimeLeft(hasDoubleTime ? 120 : 60);
    setActiveDoubleTime(hasDoubleTime);
    setActiveUnlimitedPass(hasUnlimitedPass);
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
      if (turnStats.passed >= 2 && !activeUnlimitedPass) return alert("Massimo 2 scarti!");
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

  const showBoardFromSummary = () => {
    const activeTeam = currentTurn === 1 ? teamA : teamB;
    const opponentTeam = currentTurn === 1 ? teamB : teamA;
    const setActiveTeam = currentTurn === 1 ? setTeamA : setTeamB;
    const setOpponentTeam = currentTurn === 1 ? setTeamB : setTeamA;

    const oldPosActive = activeTeam.pos || 1;
    const oldPosOpponent = opponentTeam.pos || 1;

    const activeGain = Math.max(0, turnStats.guessed);
    const opponentGain = Math.max(0, turnStats.ops + turnStats.passed);

    let newPosActive = Math.min(24, Math.max(1, oldPosActive + activeGain));
    let newPosOpponent = Math.min(24, Math.max(1, oldPosOpponent + opponentGain));
    let notices: string[] = [];

    let activeBonus = {
      unlimitedPass: activeTeam.pendingBonus?.unlimitedPass || false,
      doubleTime: activeTeam.pendingBonus?.doubleTime || false
    };

    let opponentBonus = {
      unlimitedPass: opponentTeam.pendingBonus?.unlimitedPass || false,
      doubleTime: opponentTeam.pendingBonus?.doubleTime || false
    };

    if (newPosActive === 6) {
      activeBonus.unlimitedPass = true;
      notices.push(`🎣 Canna da Pesca (Casella 6): ${activeTeam.name} potrà scartare senza limiti nel prossimo turno!`);
    } else if (newPosActive === 12) {
      notices.push(`📍 Checkpoint (Casella 12) raggiunto da ${activeTeam.name}!`);
    } else if (newPosActive === 18) {
      newPosActive = Math.min(24, newPosActive + 1);
      notices.push(`♟️ Mossa del Cavallo (Casella 18): ${activeTeam.name} balza alla casella ${newPosActive}!`);
    } else if (newPosActive === 21) {
      activeBonus.doubleTime = true;
      notices.push(`✖️2 Tempo Doppio (Casella 21): ${activeTeam.name} avrà 120 secondi nel prossimo turno!`);
    } else if (newPosActive >= 24) {
      newPosActive = 24;
      notices.push(`🏆 TRAGUARDO: ${activeTeam.name} ha raggiunto la vittoria!`);
    }

    if (opponentGain > 0) {
      if (newPosOpponent === 6) {
        opponentBonus.unlimitedPass = true;
        notices.push(`🎣 Casella 6: ${opponentTeam.name} ottiene scarti illimitati!`);
      } else if (newPosOpponent === 18) {
        newPosOpponent = Math.min(24, newPosOpponent + 1);
        notices.push(`♟️ Casella 18: ${opponentTeam.name} balza alla casella ${newPosOpponent}!`);
      } else if (newPosOpponent === 21) {
        opponentBonus.doubleTime = true;
        notices.push(`✖️2 Casella 21: ${opponentTeam.name} ottiene tempo doppio!`);
      } else if (newPosOpponent >= 24) {
        newPosOpponent = 24;
        notices.push(`🏆 TRAGUARDO: ${opponentTeam.name} ha raggiunto la vittoria!`);
      }
    }

    setActiveTeam(s => ({ ...s, pos: newPosActive, pendingBonus: activeBonus }));
    setOpponentTeam(s => ({ ...s, pos: newPosOpponent, pendingBonus: opponentBonus }));
    setLastSpecialNotice(notices.join(" | "));

    if (newPosActive >= 24 || newPosOpponent >= 24) {
      setIsFinalLeaderboard(true);
    }

    setPhase("BOARD");
  };

  const nextTurn = () => {
    if (isFinalLeaderboard) {
      setPhase("LEADERBOARD");
      return;
    }
    setCurrentTurn(currentTurn === 1 ? 2 : 1);
    setPhase("READY");
  };

  const fetchCloudSavedGames = async (currentUser?: User | null) => {
    const activeUser = currentUser || user;
    if (!activeUser || !hubDb) return;
    try {
      const q = query(collection(hubDb, "ops_saved_games"), where("userId", "==", activeUser.uid));
      const snap = await getDocs(q);
      const list: SavedGame[] = [];
      snap.forEach(d => {
        list.push({ ...(d.data() as SavedGame), id: d.id, source: "cloud" });
      });
      setCloudSavedGames(list);
    } catch(e) {
      console.warn("Errore caricamento cloud saves:", e);
    }
  };

  const getSavedGames = (): SavedGame[] => {
    try {
      const raw = localStorage.getItem("ops_storia_saved_games");
      const localSaves: SavedGame[] = raw ? JSON.parse(raw) : [];
      const map = new Map<string, SavedGame>();

      cloudSavedGames.forEach(s => map.set(s.id, { ...s, source: "cloud" }));
      localSaves.forEach(s => {
        if (!map.has(s.id)) map.set(s.id, { ...s, source: "local" });
      });

      return Array.from(map.values()).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    } catch(e) {
      return [];
    }
  };

  const handleSaveGame = async () => {
    const now = new Date();
    const dateFormatted = now.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    const cleanName = saveSessionName.trim() || `Sessione del ${dateFormatted}`;
    const saveId = `save_${Date.now()}`;

    const newSave: SavedGame = {
      id: saveId,
      name: cleanName,
      date: dateFormatted,
      timestamp: Date.now(),
      selectedDeck,
      selectedColors,
      currentTurn,
      teamA,
      teamB,
      currentCardIndex,
      source: user ? "cloud" : "local"
    };

    // 1. Salva in LocalStorage (cache immediata offline)
    try {
      let raw = localStorage.getItem("ops_storia_saved_games");
      let saved: SavedGame[] = raw ? JSON.parse(raw) : [];
      saved.unshift(newSave);
      localStorage.setItem("ops_storia_saved_games", JSON.stringify(saved.slice(0, 20)));
    } catch(e) {}

    // 2. Salva su Firestore Cloud se autenticato
    if (user && hubDb) {
      try {
        await setDoc(doc(hubDb, "ops_saved_games", saveId), {
          ...newSave,
          userId: user.uid,
          userEmail: (user.email || '').toLowerCase().trim(),
          mode: "local",
          updatedAt: new Date().toISOString()
        });
        console.log("☁️ Partita salvata sul Cloud Firestore!");
      } catch (errCloud) {
        console.warn("Salvataggio Cloud fallito, mantenuto in locale:", errCloud);
      }
    }

    setShowSaveDialog(false);
    alert("Partita salvata con successo! Potrai riprenderla in qualsiasi momento da questo o da un altro dispositivo.");
    setPhase("SETUP");
  };

  const handleLoadGame = (saveItem: SavedGame) => {
    setSelectedDeck(saveItem.selectedDeck || "prima");
    setSelectedColors(saveItem.selectedColors || []);
    setCurrentTurn(saveItem.currentTurn || 1);
    setTeamA({
      ...saveItem.teamA,
      pendingBonus: saveItem.teamA.pendingBonus || { unlimitedPass: false, doubleTime: false }
    });
    setTeamB({
      ...saveItem.teamB,
      pendingBonus: saveItem.teamB.pendingBonus || { unlimitedPass: false, doubleTime: false }
    });
    setCurrentCardIndex(saveItem.currentCardIndex || 0);

    let allCards = CARDS_MAP[saveItem.selectedDeck || "prima"] || cardsPrima;
    const chunkSize = Math.ceil(allCards.length / 6);
    let finalDeck: any[] = [];
    const activeColors = (saveItem.selectedColors && saveItem.selectedColors.length > 0) ? saveItem.selectedColors : colorsDB.map(c => c.id);
    
    allCards.forEach((c: any, index: number) => {
      const chunkIndex = Math.min(5, Math.floor(index / chunkSize));
      const colorObj = colorsDB[chunkIndex];
      if (activeColors.includes(colorObj.id)) {
        finalDeck.push({ ...c, colorTheme: colorObj });
      }
    });
    setDeck(finalDeck.length > 0 ? finalDeck : allCards);

    setShowSavedGamesModal(false);
    setPhase("BOARD");
  };

  const handleDeleteSavedGame = async (saveId: string) => {
    try {
      let raw = localStorage.getItem("ops_storia_saved_games");
      if (raw) {
        let saved: SavedGame[] = JSON.parse(raw);
        saved = saved.filter(s => s.id !== saveId);
        localStorage.setItem("ops_storia_saved_games", JSON.stringify(saved));
      }
      setCloudSavedGames(prev => prev.filter(s => s.id !== saveId));
    } catch(e) {}

    if (user && hubDb) {
      try {
        await deleteDoc(doc(hubDb, "ops_saved_games", saveId));
      } catch (_) {}
    }
  };

  const handleLogout = async () => {
    if (confirm("Vuoi disconnettere il tuo account e tornare alla Home?")) {
      await signOut(auth);
      window.location.href = getAssetPath("/");
    }
  };

  const card = deck[currentCardIndex % (deck.length || 1)];

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
          <HostLogin 
            onLoginSuccess={() => {}} 
            title="Accesso"
            description="Per giocare in questa modalità è necessario accedere."
            smallButton={true}
          />
        ) : !isAllowed ? null : (
          <AnimatePresence mode="wait">
          
          {phase === "SETUP" && (
            <motion.div key="setup" className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 text-center border border-slate-100">
              <h2 className="text-3xl font-black mb-6 text-slate-900">Scegli l'Anno</h2>
              <div className="space-y-3 mb-8">
                {decksDB.map(d => (
                  <button key={d.id} onClick={() => setSelectedDeck(d.id)} className={`w-full p-4 rounded-xl border-2 font-bold transition-all ${selectedDeck === d.id ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-slate-100 text-slate-700 hover:border-slate-300'}`}>{d.name}</button>
                ))}
              </div>

              <div className="flex gap-3">
                <button onClick={() => setPhase("TOPICS")} className="flex-1 bg-primary-500 text-white py-4 rounded-xl font-black shadow-lg hover:bg-primary-600 active:scale-95 transition-all">AVANTI</button>
                <button onClick={() => setShowSavedGamesModal(true)} className="flex-1 bg-slate-100 border-2 border-slate-200 text-slate-700 py-4 rounded-xl font-black flex items-center justify-center gap-2 hover:bg-slate-200 transition-all">
                  <FolderOpen className="w-5 h-5 text-amber-600" /> Riprendi Partita
                </button>
              </div>
            </motion.div>
          )}

          {phase === "TOPICS" && (
            <motion.div key="topics" className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 text-center border border-slate-100">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Argomenti</h2>
                <button 
                  type="button"
                  onClick={() => setSelectedColors(selectedColors.length === colorsDB.length ? [] : colorsDB.map(c => c.id))} 
                  className="text-xs font-bold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-lg hover:bg-primary-100 transition-colors"
                >
                  {selectedColors.length === colorsDB.length ? "Deseleziona tutti" : "Seleziona tutti"}
                </button>
              </div>
              <p className="text-xs text-slate-500 mb-4">Se non selezioni nulla, verranno usati tutti gli argomenti.</p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {colorsDB.map(c => (
                  <button key={c.id} onClick={() => setSelectedColors(prev => prev.includes(c.id) ? prev.filter(id => id !== c.id) : [...prev, c.id])} className={`p-4 rounded-xl border-2 font-bold text-sm transition-all ${selectedColors.includes(c.id) ? c.borderClass + ' bg-slate-50 text-slate-900' : 'border-slate-100 opacity-50 text-slate-600'}`}>
                    {c.name}
                  </button>
                ))}
              </div>
              <button onClick={initGame} className="w-full bg-emerald-500 text-white py-4 rounded-xl font-black shadow-lg hover:bg-emerald-600 active:scale-95 transition-all">AVANTI</button>
            </motion.div>
          )}

          {phase === "AVATAR_A" && (
            <motion.div key="avatarA" className="w-full max-w-3xl bg-white rounded-3xl shadow-xl p-6 sm:p-8 text-center border border-slate-100">
              <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-1.5 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
                Squadra A (Rossa)
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">Scegli la tua Pedina</h2>
              <p className="text-xs sm:text-sm text-slate-500 mb-6">Tocca un personaggio per sceglierlo e passare alla Squadra B.</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-6">
                {avatars.map(a => {
                  const isSelected = selectedPawnA === a;
                  return (
                    <button 
                      key={a} 
                      type="button"
                      onClick={() => handleSelectPawnA(a)} 
                      className={`relative p-4 rounded-2xl border-4 transition-all flex flex-col items-center justify-center cursor-pointer ${
                        isSelected 
                          ? 'border-red-500 bg-red-50/60 shadow-xl scale-105 ring-4 ring-red-400' 
                          : 'border-slate-200 bg-white hover:border-red-400 hover:scale-[1.03] hover:shadow-lg'
                      }`}
                    >
                      <img src={getPawnImg(a)} className="w-full h-24 sm:h-32 object-contain filter drop-shadow-md" alt={`Pedina ${a}`} />
                      <span className="mt-2 text-xs font-bold text-slate-500">
                        Personaggio #{a}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-center mt-2">
                <button 
                  type="button"
                  onClick={() => setPhase("TOPICS")} 
                  className="px-6 py-3 rounded-2xl font-bold border-2 border-slate-200 text-slate-600 hover:bg-slate-100 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
                >
                  <ArrowLeft className="w-4 h-4"/> Torna agli Argomenti
                </button>
              </div>
            </motion.div>
          )}

          {phase === "AVATAR_B" && (
            <motion.div key="avatarB" className="w-full max-w-3xl bg-white rounded-3xl shadow-xl p-6 sm:p-8 text-center border border-slate-100">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
                Squadra B (Blu)
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">Scegli la tua Pedina</h2>
              <p className="text-xs sm:text-sm text-slate-500 mb-6">Tocca un personaggio per sceglierlo e avviare la sfida.</p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-6">
                {avatars.map(a => {
                  const isSelected = selectedPawnB === a;
                  const isTaken = selectedPawnA === a;
                  return (
                    <button 
                      key={a} 
                      type="button"
                      disabled={isTaken}
                      onClick={() => !isTaken && handleSelectPawnB(a)} 
                      className={`relative p-4 rounded-2xl border-4 transition-all flex flex-col items-center justify-center ${
                        isTaken
                          ? 'border-slate-200 bg-slate-100 opacity-40 cursor-not-allowed'
                          : isSelected 
                            ? 'border-blue-500 bg-blue-50/60 shadow-xl scale-105 ring-4 ring-blue-400 cursor-pointer' 
                            : 'border-slate-200 bg-white hover:border-blue-400 hover:scale-[1.03] hover:shadow-lg cursor-pointer'
                      }`}
                    >
                      {isTaken && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                          Squadra A
                        </div>
                      )}
                      <img src={getPawnImg(a)} className={`w-full h-24 sm:h-32 object-contain filter drop-shadow-md ${isTaken ? 'grayscale' : ''}`} alt={`Pedina ${a}`} />
                      <span className="mt-2 text-xs font-bold text-slate-500">
                        Personaggio #{a}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-center mt-2">
                <button 
                  type="button"
                  onClick={() => setPhase("AVATAR_A")} 
                  className="px-6 py-3 rounded-2xl font-bold border-2 border-slate-200 text-slate-600 hover:bg-slate-100 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
                >
                  <ArrowLeft className="w-4 h-4"/> Torna alla Squadra A
                </button>
              </div>
            </motion.div>
          )}

          {phase === "READY" && (
            <motion.div key="ready" className="text-center bg-white p-10 sm:p-14 rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full">
              <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-black uppercase tracking-wider mb-4 ${currentTurn === 1 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                <span className={`w-2.5 h-2.5 rounded-full ${currentTurn === 1 ? 'bg-red-500' : 'bg-blue-500'} animate-pulse`}></span>
                Turno della Squadra {currentTurn === 1 ? 'A (Rossa)' : 'B (Blu)'}
              </div>

              <h2 className="text-4xl sm:text-5xl font-black mb-4 text-slate-900">Preparatevi!</h2>
              <p className="text-slate-500 mb-6 font-medium">Il suggeritore tiene il dispositivo. Quando sei pronto, premi VIA per avviare il timer.</p>

              {((currentTurn === 1 ? teamA : teamB).pendingBonus?.doubleTime || (currentTurn === 1 ? teamA : teamB).pendingBonus?.unlimitedPass) && (
                <div className="mb-6 bg-amber-50 border-2 border-amber-300 p-4 rounded-2xl text-amber-800 text-sm font-bold flex items-center justify-center gap-2 animate-pulse">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                  <span>
                    {(currentTurn === 1 ? teamA : teamB).pendingBonus?.doubleTime && "✖️2 Bonus 120s Attivo! "}
                    {(currentTurn === 1 ? teamA : teamB).pendingBonus?.unlimitedPass && "🎣 Scarti Infiniti Attivi!"}
                  </span>
                </div>
              )}

              <button onClick={startGame} className="w-full bg-primary-500 text-white py-5 rounded-2xl font-black text-3xl shadow-xl hover:bg-primary-600 active:scale-95 transition-all">
                VIA!
              </button>
            </motion.div>
          )}

          {phase === "PLAYING" && card && (
            <motion.div key="playing" className="w-full max-w-4xl flex flex-col items-center h-full max-h-[85vh]">
              
              <div className="flex justify-between w-full mb-2 px-1 sm:px-4 shrink-0">
                <div className={`text-center p-1 sm:p-2 px-2 sm:px-4 rounded-xl flex items-center justify-center space-x-2 ${currentTurn === 1 ? 'bg-primary-100 border-2 border-primary-500' : 'bg-white opacity-80'}`}>
                  <img src={getPawnImg(teamA.pawn)} className="w-8 h-8 sm:w-12 sm:h-12 object-contain hidden sm:block" />
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
                  <img src={getPawnImg(teamB.pawn)} className="w-8 h-8 sm:w-12 sm:h-12 object-contain hidden sm:block" />
                </div>
              </div>

              {(activeDoubleTime || activeUnlimitedPass) && (
                <div className="w-full max-w-3xl mb-2 bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 border border-amber-400 p-2 rounded-xl text-center text-amber-900 font-black text-xs sm:text-sm flex items-center justify-center gap-3">
                  {activeDoubleTime && <span className="bg-amber-400 text-slate-900 px-2.5 py-0.5 rounded-full">✖️2 Tempo 120s</span>}
                  {activeUnlimitedPass && <span className="bg-emerald-400 text-slate-900 px-2.5 py-0.5 rounded-full">🎣 Scarti Infiniti</span>}
                </div>
              )}

              <div className={`w-full max-w-3xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border-3 sm:border-4 overflow-hidden ${card.colorTheme?.borderClass || 'border-orange-500'} flex flex-col flex-1 min-h-0`}>
                <div className={`px-4 py-2 ${card.colorTheme?.colorClass || 'bg-orange-500'} text-white font-black text-base sm:text-xl flex justify-between shrink-0`}>
                  <span>Squadra {currentTurn === 1 ? 'A' : 'B'}</span>
                  <span>{timeLeft}s</span>
                </div>
                
                <div className="flex flex-col md:flex-row flex-1 min-h-0">
                  <div className="flex-1 flex flex-col items-center justify-between p-2.5 sm:p-5 min-h-0">
                    <h1 className={`text-3xl sm:text-4xl md:text-5xl font-black my-1 sm:my-2 text-center leading-tight shrink-0 ${card.colorTheme?.textClass || 'text-slate-900'}`}>{card.parola_chiave}</h1>
                    <div className="w-full max-w-md bg-slate-100/80 p-2 sm:p-3 rounded-2xl border border-slate-200 flex-1 min-h-0 flex flex-col justify-center">
                      <p className="text-center font-black text-slate-400 text-[10px] sm:text-xs uppercase tracking-widest mb-1 shrink-0">Parole Vietate</p>
                      <div className="flex-1 flex flex-col justify-center gap-1 sm:gap-1.5 min-h-0">
                        {card.parole_taboo.map((t: string) => (
                          <div key={t} className="bg-white font-extrabold text-sm sm:text-lg md:text-xl py-1 sm:py-2 px-3 sm:px-4 rounded-xl text-center border border-slate-200/80 shadow-xs text-slate-800 flex items-center justify-center leading-snug">{t}</div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-2 sm:p-4 bg-slate-50 border-t-2 md:border-t-0 md:border-l-2 border-slate-200 grid grid-cols-3 md:grid-cols-1 gap-2 sm:gap-3 shrink-0 md:w-60 flex-col justify-center">
                    <button onClick={() => handleAction("SCARTA")} className="bg-white border-2 border-slate-200 text-slate-700 font-black text-xs sm:text-xl rounded-xl sm:rounded-2xl py-2.5 sm:py-4 flex flex-col items-center justify-center hover:bg-slate-100 active:scale-95 transition-all md:flex-1 shadow-xs">
                      <X className="w-5 h-5 sm:w-7 sm:h-7 mb-0.5"/> <span>Scarta</span> <span className="text-[10px] sm:text-xs opacity-60">({turnStats.passed}/{activeUnlimitedPass ? '∞' : '2'})</span>
                    </button>
                    <button onClick={() => handleAction("ESATTA")} className="bg-emerald-500 border-2 border-emerald-600 text-white font-black text-xs sm:text-xl rounded-xl sm:rounded-2xl py-2.5 sm:py-4 flex flex-col items-center justify-center hover:bg-emerald-600 active:scale-95 transition-all shadow-xs md:flex-1">
                      <Check className="w-5 h-5 sm:w-7 sm:h-7 mb-0.5"/> <span>Esatta!</span>
                    </button>
                    <button onClick={() => handleAction("OPS")} className="bg-red-500 border-2 border-red-600 text-white font-black text-xs sm:text-xl rounded-xl sm:rounded-2xl py-2.5 sm:py-4 flex flex-col items-center justify-center hover:bg-red-600 active:scale-95 transition-all shadow-xs md:flex-1">
                      <AlertOctagon className="w-5 h-5 sm:w-7 sm:h-7 mb-0.5"/> <span>OPS! (-1)</span>
                    </button>
                  </div>
                </div>
                {showUndoOps && (
                  <div className="absolute bottom-36 left-1/2 -translate-x-1/2 bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-700 z-50">
                    <button onClick={undoOps} className="font-bold flex items-center text-lg"><Undo2 className="w-6 h-6 mr-2"/> Annulla OPS</button>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {phase === "SUMMARY" && (
            <motion.div key="summary" className="text-center bg-white p-8 sm:p-12 rounded-3xl shadow-xl max-w-lg w-full border border-slate-100">
              <h2 className="text-3xl sm:text-4xl font-black text-primary-500 mb-6">Fine Turno</h2>
              <div className="text-lg sm:text-xl font-bold space-y-3 mb-6 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <p className="flex justify-between items-center"><span>Parole Indovinate:</span> <span className="text-emerald-600 font-black">+{turnStats.guessed}</span></p>
                <p className="flex justify-between items-center"><span>Scarti Avversari:</span> <span className="text-amber-600 font-black">+{turnStats.passed}</span></p>
                <p className="flex justify-between items-center"><span>Errori OPS Avversari:</span> <span className="text-red-600 font-black">+{turnStats.ops}</span></p>
                <div className="border-t pt-3 flex justify-between items-center text-slate-900 font-black">
                  <span>Avanzamento Squadra:</span>
                  <span className="text-primary-600">+{turnStats.guessed} caselle</span>
                </div>
              </div>
              <button onClick={showBoardFromSummary} className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-2xl font-black text-xl shadow-lg transition-all">
                Mostra Tabellone & Pedine
              </button>
            </motion.div>
          )}

          {phase === "BOARD" && (
            <motion.div key="board" className="w-full max-w-5xl text-center h-full max-h-[85vh] flex flex-col items-center justify-center">
              <DynamicBoard 
                teamA={{ pos: teamA.pos, pawn: teamA.pawn, id: "A" }} 
                teamB={{ pos: teamB.pos, pawn: teamB.pawn, id: "B" }} 
              />

              {lastSpecialNotice && (
                <div className="mt-3 bg-amber-100 border border-amber-300 text-amber-900 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold animate-bounce">
                  {lastSpecialNotice}
                </div>
              )}

              <div className="flex gap-3 justify-center items-center mt-4 shrink-0">
                <button 
                  onClick={() => {
                    setIsFinalLeaderboard(false);
                    setPhase("LEADERBOARD");
                  }} 
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-6 py-4 rounded-xl font-bold shadow-sm border border-slate-300 flex items-center gap-2 transition-all"
                >
                  <Pause className="w-5 h-5 text-amber-600" /> Sospendi / Classifica
                </button>
                <button 
                  onClick={nextTurn} 
                  className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-xl font-black shadow-lg text-lg sm:text-xl transition-all"
                >
                  Passa al Turno Successivo
                </button>
              </div>
            </motion.div>
          )}

          {phase === "LEADERBOARD" && (
            <motion.div key="leaderboard" className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-6 sm:p-10 border border-slate-100 text-center">
              <div className="mb-6">
                <span className={`inline-flex items-center gap-2 px-4 py-1 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider mb-2 ${isFinalLeaderboard ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}`}>
                  {isFinalLeaderboard ? <Trophy className="w-4 h-4 text-amber-600" /> : <Pause className="w-4 h-4 text-blue-600" />}
                  {isFinalLeaderboard ? "Podio Finale dei Vincitori" : "Classifica Provvisoria"}
                </span>
                <h2 className="text-3xl sm:text-5xl font-black text-slate-900">
                  {isFinalLeaderboard 
                    ? `🏆 ${(teamA.pos >= 24 || teamA.pos > teamB.pos) ? teamA.name : teamB.name} Vince la Sfida!` 
                    : "Stato della Partita"}
                </h2>
                <p className="text-slate-500 text-sm sm:text-base mt-1">
                  Avanzamento pedine sul tracciato storico a 24 caselle.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 max-w-2xl mx-auto">
                <div className={`p-6 rounded-3xl border-4 text-center transition-all ${teamA.pos >= teamB.pos ? 'border-amber-400 bg-amber-50/50 shadow-xl' : 'border-slate-200 bg-slate-50'}`}>
                  <div className="text-2xl mb-1">{teamA.pos >= teamB.pos ? '🥇 1° Posto' : '🥈 2° Posto'}</div>
                  <div className="w-20 h-20 rounded-full border-4 border-red-500 mx-auto mb-3 overflow-hidden bg-white shadow-md">
                    <img src={getPawnImg(teamA.pawn)} className="w-full h-full object-contain" alt="Squadra A" />
                  </div>
                  <h3 className="text-xl font-black text-red-600 mb-1">{teamA.name}</h3>
                  <div className="text-3xl font-black text-slate-900 mb-2">Casella {teamA.pos || 1} / 24</div>
                  <div className="text-xs font-bold text-slate-500">Punti Totali: {teamA.score}</div>
                  {teamA.pendingBonus?.doubleTime && <div className="mt-2 text-xs bg-yellow-100 text-yellow-800 font-bold px-2 py-0.5 rounded-full inline-block">✖️2 Tempo 120s</div>}
                  {teamA.pendingBonus?.unlimitedPass && <div className="mt-2 text-xs bg-green-100 text-green-800 font-bold px-2 py-0.5 rounded-full inline-block">🎣 Scarti Infiniti</div>}
                </div>

                <div className={`p-6 rounded-3xl border-4 text-center transition-all ${teamB.pos > teamA.pos ? 'border-amber-400 bg-amber-50/50 shadow-xl' : 'border-slate-200 bg-slate-50'}`}>
                  <div className="text-2xl mb-1">{teamB.pos > teamA.pos ? '🥇 1° Posto' : '🥈 2° Posto'}</div>
                  <div className="w-20 h-20 rounded-full border-4 border-blue-500 mx-auto mb-3 overflow-hidden bg-white shadow-md">
                    <img src={getPawnImg(teamB.pawn)} className="w-full h-full object-contain" alt="Squadra B" />
                  </div>
                  <h3 className="text-xl font-black text-blue-600 mb-1">{teamB.name}</h3>
                  <div className="text-3xl font-black text-slate-900 mb-2">Casella {teamB.pos || 1} / 24</div>
                  <div className="text-xs font-bold text-slate-500">Punti Totali: {teamB.score}</div>
                  {teamB.pendingBonus?.doubleTime && <div className="mt-2 text-xs bg-yellow-100 text-yellow-800 font-bold px-2 py-0.5 rounded-full inline-block">✖️2 Tempo 120s</div>}
                  {teamB.pendingBonus?.unlimitedPass && <div className="mt-2 text-xs bg-green-100 text-green-800 font-bold px-2 py-0.5 rounded-full inline-block">🎣 Scarti Infiniti</div>}
                </div>
              </div>

              <div className="flex flex-wrap gap-4 justify-center items-center pt-4 border-t border-slate-100">
                {isFinalLeaderboard ? (
                  <>
                    <button 
                      onClick={() => setPhase("SETUP")} 
                      className="bg-primary-500 text-white px-8 py-4 rounded-xl font-black text-lg shadow-lg hover:bg-primary-600 transition-all"
                    >
                      Nuova Partita
                    </button>
                    <Link 
                      href="/" 
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-4 rounded-xl font-bold transition-all"
                    >
                      Torna alla Home
                    </Link>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => {
                        const now = new Date();
                        setSaveSessionName(`Classe - ${now.toLocaleDateString('it-IT')}`);
                        setShowSaveDialog(true);
                      }} 
                      className="bg-slate-100 border-2 border-slate-200 text-slate-800 px-6 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-200 transition-all"
                    >
                      <Save className="w-5 h-5 text-amber-600" /> Salva Sessione ed Esci
                    </button>
                    <button 
                      onClick={() => setPhase("BOARD")} 
                      className="bg-primary-500 text-white px-8 py-4 rounded-xl font-black text-lg shadow-lg hover:bg-primary-600 transition-all flex items-center gap-2"
                    >
                      <Play className="w-5 h-5" /> Continua Partita
                    </button>
                    <button 
                      onClick={() => {
                        if (confirm("Vuoi concludere la partita adesso e proclamare la squadra vincitrice?")) {
                          setIsFinalLeaderboard(true);
                        }
                      }} 
                      className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-4 rounded-xl font-bold text-sm transition-all"
                    >
                      Termina Ora & Proclama Vincitore
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
        )}
      </main>

      {showSavedGamesModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-w-lg w-full border border-slate-100 max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                <FolderOpen className="w-6 h-6 text-amber-600" /> Partite Salvate
              </h3>
              <button onClick={() => setShowSavedGamesModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-6 h-6" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4">Seleziona una sessione precedente per riprendere la partita dal punto esatto.</p>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {getSavedGames().length === 0 ? (
                <div className="text-center py-10 text-slate-400 font-medium text-sm">
                  Nessuna partita salvata trovata.
                </div>
              ) : (
                getSavedGames().map(s => {
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
                          {s.date} • A: c.{s.teamA.pos || 1} vs B: c.{s.teamB.pos || 1}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleLoadGame(s)} 
                          className="bg-primary-500 hover:bg-primary-600 text-white font-bold px-3 py-1.5 rounded-lg text-xs shadow"
                        >
                          Riprendi
                        </button>
                        <button 
                          onClick={() => handleDeleteSavedGame(s.id)} 
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
              <button onClick={() => setShowSavedGamesModal(false)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-bold text-sm">
                Chiudi
              </button>
            </div>
          </div>
        </div>
      )}

      {showSaveDialog && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-w-md w-full border border-slate-100">
            <h3 className="text-2xl font-black text-slate-900 mb-2 flex items-center gap-2">
              <Save className="w-6 h-6 text-amber-600" /> Salva Sessione di Gioco
            </h3>
            <p className="text-xs text-slate-500 mb-4">Assegna un nome alla sessione per ritrovarla alla prossima lezione.</p>

            <input 
              type="text" 
              value={saveSessionName}
              onChange={(e) => setSaveSessionName(e.target.value)}
              placeholder="Es. Classe 2ª B - Medioevo"
              className="w-full p-3.5 border-2 border-slate-200 rounded-xl font-bold text-slate-900 mb-6 focus:border-primary-500 outline-none"
            />

            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowSaveDialog(false)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-3 rounded-xl font-bold text-sm">
                Annulla
              </button>
              <button onClick={handleSaveGame} className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md">
                Salva ed Esci
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
