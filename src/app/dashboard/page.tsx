"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, hubDb } from "@/lib/firebase";
import Link from "next/link";
import {
  Trophy,
  Users,
  Clock,
  BarChart3,
  Calendar,
  Play,
  Tv,
  Wifi,
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  Download,
  Share2,
  Award,
  Layers
} from "lucide-react";
import Header from "@/components/Header";
import HostLogin from "@/components/HostLogin";

interface MatchRecord {
  id: string;
  date: string;
  className: string;
  yearLevel: "1ª Media" | "2ª Media" | "3ª Media";
  teamA: { name: string; score: number; color: string };
  teamB: { name: string; score: number; color: string };
  winner: string;
  durationMinutes: number;
  totalCardsPlayed: number;
}

interface ClassPreset {
  id: string;
  name: string;
  yearLevel: "1ª Media" | "2ª Media" | "3ª Media";
  teamAName: string;
  teamBName: string;
}

const DEFAULT_MATCHES: MatchRecord[] = [
  {
    id: "m-001",
    date: "10/09/2026",
    className: "Classe 1ª A",
    yearLevel: "1ª Media",
    teamA: { name: "I Centurioni", score: 24, color: "#e11d48" },
    teamB: { name: "I Legionari", score: 21, color: "#2563eb" },
    winner: "I Centurioni",
    durationMinutes: 28,
    totalCardsPlayed: 18,
  },
  {
    id: "m-002",
    date: "08/09/2026",
    className: "Classe 2ª B",
    yearLevel: "2ª Media",
    teamA: { name: "I Cavalieri", score: 19, color: "#e11d48" },
    teamB: { name: "I Feudatari", score: 24, color: "#2563eb" },
    winner: "I Feudatari",
    durationMinutes: 32,
    totalCardsPlayed: 22,
  },
  {
    id: "m-003",
    date: "05/09/2026",
    className: "Classe 3ª C",
    yearLevel: "3ª Media",
    teamA: { name: "Garibaldini", score: 24, color: "#e11d48" },
    teamB: { name: "Mille Eroi", score: 23, color: "#2563eb" },
    winner: "Garibaldini",
    durationMinutes: 25,
    totalCardsPlayed: 20,
  },
];

const DEFAULT_CLASSES: ClassPreset[] = [
  {
    id: "c-1",
    name: "Classe 1ª A",
    yearLevel: "1ª Media",
    teamAName: "I Centurioni",
    teamBName: "I Legionari",
  },
  {
    id: "c-2",
    name: "Classe 2ª B",
    yearLevel: "2ª Media",
    teamAName: "I Cavalieri",
    teamBName: "I Feudatari",
  },
  {
    id: "c-3",
    name: "Classe 3ª C",
    yearLevel: "3ª Media",
    teamAName: "Garibaldini",
    teamBName: "Mille Eroi",
  },
];

export default function TeacherDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAllowed, setIsAllowed] = useState(true);

  const [activeTab, setActiveTab] = useState<"history" | "classes" | "stats">("history");
  const [filterYear, setFilterYear] = useState<string>("all");

  const [matches, setMatches] = useState<MatchRecord[]>([]);
  const [classes, setClasses] = useState<ClassPreset[]>([]);

  // New Class Form State
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [newClassName, setNewClassName] = useState("");
  const [newYearLevel, setNewYearLevel] = useState<"1ª Media" | "2ª Media" | "3ª Media">("1ª Media");
  const [newTeamA, setNewTeamA] = useState("Squadra Rossa");
  const [newTeamB, setNewTeamB] = useState("Squadra Blu");

  useEffect(() => {
    // Load local storage matches & classes
    if (typeof window !== "undefined") {
      const savedMatches = localStorage.getItem("ops_storia_match_history");
      if (savedMatches) {
        try {
          setMatches(JSON.parse(savedMatches));
        } catch {
          setMatches(DEFAULT_MATCHES);
        }
      } else {
        setMatches(DEFAULT_MATCHES);
      }

      const savedClasses = localStorage.getItem("ops_storia_class_presets");
      if (savedClasses) {
        try {
          setClasses(JSON.parse(savedClasses));
        } catch {
          setClasses(DEFAULT_CLASSES);
        }
      } else {
        setClasses(DEFAULT_CLASSES);
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        if (typeof window !== "undefined" && (window as any).HubSubscriptionGuard) {
          const allowed = await (window as any).HubSubscriptionGuard.verifyAccess({
            user: { uid: currentUser.uid, email: currentUser.email },
            role: "docente",
            isPublicView: false,
          });
          setIsAllowed(allowed);
        }
        try {
          let uData = null;
          try {
            const docRef = doc(hubDb, "hub_users", currentUser.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              uData = docSnap.data();
            } else {
              const fallbackRef = doc(hubDb, "users", currentUser.uid);
              const fallbackSnap = await getDoc(fallbackRef);
              if (fallbackSnap.exists()) {
                uData = fallbackSnap.data();
              }
            }
          } catch (err) {
            console.warn("Hub users lookup warning:", err);
          }
          if (uData) {
            setUserData(uData);
          } else {
            setUserData({ nome: currentUser.displayName || "Docente", scuola: "Docente di Storia" });
          }
        } catch (e) {
          console.error("Error fetching user data", e);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSaveClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;

    const newEntry: ClassPreset = {
      id: `c-${Date.now()}`,
      name: newClassName.trim(),
      yearLevel: newYearLevel,
      teamAName: newTeamA.trim() || "Squadra Rossa",
      teamBName: newTeamB.trim() || "Squadra Blu",
    };

    const updated = [newEntry, ...classes];
    setClasses(updated);
    localStorage.setItem("ops_storia_class_presets", JSON.stringify(updated));

    setNewClassName("");
    setShowAddClassModal(false);
  };

  const handleDeleteClass = (id: string) => {
    if (confirm("Vuoi davvero eliminare questa configurazione di classe?")) {
      const updated = classes.filter((c) => c.id !== id);
      setClasses(updated);
      localStorage.setItem("ops_storia_class_presets", JSON.stringify(updated));
    }
  };

  const handleExportCSV = () => {
    const headers = "Data,Classe,Anno,Squadra A,Punti A,Squadra B,Punti B,Vincitore,Durata (min),Carte Giocate\n";
    const rows = matches
      .map(
        (m) =>
          `"${m.date}","${m.className}","${m.yearLevel}","${m.teamA.name}",${m.teamA.score},"${m.teamB.name}",${m.teamB.score},"${m.winner}",${m.durationMinutes},${m.totalCardsPlayed}`
      )
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `registro_partite_ops_storia_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredMatches = matches.filter((m) => {
    if (filterYear === "all") return true;
    return m.yearLevel === filterYear;
  });

  // Calculate stats
  const totalMatches = matches.length;
  const totalCards = matches.reduce((acc, m) => acc + m.totalCardsPlayed, 0);
  const avgDuration = totalMatches > 0 ? Math.round(matches.reduce((acc, m) => acc + m.durationMinutes, 0) / totalMatches) : 0;
  const totalPoints = matches.reduce((acc, m) => acc + m.teamA.score + m.teamB.score, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <HostLogin onLoginSuccess={() => setLoading(false)} />
      </div>
    );
  }

  if (!isAllowed) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-rose-500/30">
      {/* Ecosystem Standard Header */}
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Dashboard Hero / Welcome Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 border border-slate-700/60 p-6 sm:p-8 shadow-2xl">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> Dashboard Docente • Ops! Storia
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Bentornato/a, {userData?.nome || user.displayName || "Docente"}
              </h1>
              <p className="text-slate-400 text-sm sm:text-base max-w-2xl">
                Monitora il registro delle sfide storiche in classe, gestisci le formazioni delle squadre e avvia rapidamente una nuova sessione alla LIM.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap sm:flex-nowrap gap-3">
              <Link
                href="/local"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white font-bold text-sm shadow-lg shadow-rose-900/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Tv className="w-4 h-4" />
                <span>Avvia Partita LIM (Locale)</span>
              </Link>
              <Link
                href="/host"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 hover:text-white font-bold text-sm shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Wifi className="w-4 h-4 text-emerald-400" />
                <span>Host Multi-Device</span>
              </Link>
            </div>
          </div>
        </div>

        {/* KPI Quick Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Partite Giocate</span>
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Trophy className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-black text-white mt-3">{totalMatches}</p>
            <p className="text-xs text-slate-500 mt-1">Nelle sessioni didattiche</p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Carte Affrontate</span>
              <div className="w-9 h-9 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-black text-white mt-3">{totalCards}</p>
            <p className="text-xs text-slate-500 mt-1">Concetti storici spiegati</p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Classi Configurate</span>
              <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-black text-white mt-3">{classes.length}</p>
            <p className="text-xs text-slate-500 mt-1">Con formazioni attive</p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Durata Media</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-black text-white mt-3">{avgDuration} <span className="text-lg font-bold text-slate-400">min</span></p>
            <p className="text-xs text-slate-500 mt-1">Per singola partita</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab("history")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === "history"
                ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Registro Partite</span>
          </button>

          <button
            onClick={() => setActiveTab("classes")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === "classes"
                ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Gestione Squadre & Classi</span>
          </button>

          <button
            onClick={() => setActiveTab("stats")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === "stats"
                ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Statistiche di Partecipazione</span>
          </button>
        </div>

        {/* TAB 1: REGISTRO PARTITE */}
        {activeTab === "history" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Filtra per anno:</span>
                <select
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-slate-200 text-sm font-semibold rounded-lg px-3 py-1.5 focus:outline-none focus:border-amber-500"
                >
                  <option value="all">Tutti gli anni</option>
                  <option value="1ª Media">1ª Media</option>
                  <option value="2ª Media">2ª Media</option>
                  <option value="3ª Media">3ª Media</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleExportCSV}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white font-bold text-xs transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Esporta Report CSV</span>
                </button>
              </div>
            </div>

            {/* Table of Matches */}
            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950/80 text-xs font-black uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-4 px-6">Data</th>
                    <th className="py-4 px-6">Classe & Anno</th>
                    <th className="py-4 px-6">Sfida & Risultato</th>
                    <th className="py-4 px-6 text-center">Vincitore</th>
                    <th className="py-4 px-6 text-right">Durata</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredMatches.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-slate-500 font-medium">
                        Nessuna partita registrata per questo filtro.
                      </td>
                    </tr>
                  ) : (
                    filteredMatches.map((m) => (
                      <tr key={m.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-4 px-6 font-semibold text-slate-400 whitespace-nowrap flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          {m.date}
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-bold text-white">{m.className}</div>
                          <span className="inline-block text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700 mt-0.5">
                            {m.yearLevel}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-rose-400">{m.teamA.name} ({m.teamA.score})</span>
                            <span className="text-xs font-bold text-slate-500">VS</span>
                            <span className="font-bold text-blue-400">{m.teamB.name} ({m.teamB.score})</span>
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">{m.totalCardsPlayed} carte giocate</div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold text-xs">
                            <Trophy className="w-3 h-3" />
                            {m.winner}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right font-medium text-slate-400 whitespace-nowrap">
                          {m.durationMinutes} min
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: GESTIONE SQUADRE & CLASSI */}
        {activeTab === "classes" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Profili e Formazioni di Classe</h3>
                <p className="text-slate-400 text-sm">
                  Personalizza i nomi delle squadre per ciascuna delle tue classi prima di avviare una partita alla LIM.
                </p>
              </div>
              <button
                onClick={() => setShowAddClassModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-md transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Aggiungi Classe</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {classes.map((cls) => (
                <div
                  key={cls.id}
                  className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between hover:border-slate-700 transition-colors"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-lg font-black text-white">{cls.name}</h4>
                        <span className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 mt-1">
                          {cls.yearLevel}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteClass(cls.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                        title="Elimina"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-2.5 pt-2 border-t border-slate-800/80">
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-rose-950/20 border border-rose-900/40">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-rose-500" />
                          <span className="text-xs font-semibold text-slate-400">Squadra Rossa:</span>
                        </div>
                        <span className="text-sm font-bold text-rose-300">{cls.teamAName}</span>
                      </div>

                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-blue-950/20 border border-blue-900/40">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-blue-500" />
                          <span className="text-xs font-semibold text-slate-400">Squadra Blu:</span>
                        </div>
                        <span className="text-sm font-bold text-blue-300">{cls.teamBName}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-5 mt-4 border-t border-slate-800 flex items-center justify-end gap-2">
                    <Link
                      href={`/local?classId=${cls.id}&teamA=${encodeURIComponent(cls.teamAName)}&teamB=${encodeURIComponent(cls.teamBName)}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
                    >
                      <Play className="w-3.5 h-3.5 text-amber-400" />
                      <span>Gioca con questa classe</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: STATISTICHE DI PARTECIPAZIONE */}
        {activeTab === "stats" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Distribution by Grade Level */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-amber-400" />
                  Ripartizione Partite per Anno Scolastico
                </h4>
                <div className="space-y-3 pt-2">
                  {["1ª Media", "2ª Media", "3ª Media"].map((lvl) => {
                    const count = matches.filter((m) => m.yearLevel === lvl).length;
                    const pct = totalMatches > 0 ? Math.round((count / totalMatches) * 100) : 0;
                    return (
                      <div key={lvl} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-bold text-slate-300">
                          <span>{lvl}</span>
                          <span>{count} partite ({pct}%)</span>
                        </div>
                        <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-amber-500 to-rose-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Engagement Summary */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  Indicatori Didattici di Partecipazione
                </h4>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 text-center">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Punti Totali Assegnati</p>
                    <p className="text-2xl font-black text-amber-400 mt-2">{totalPoints}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 text-center">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Carte per Partita</p>
                    <p className="text-2xl font-black text-emerald-400 mt-2">
                      {totalMatches > 0 ? Math.round(totalCards / totalMatches) : 0}
                    </p>
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
                  💡 <strong>Suggerimento didattico:</strong> Utilizza il gioco a fine modulo per consolidare i termini storiografici e favorire l'esposizione orale collaborativa senza l'ansia da interrogazione.
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Add Class Modal */}
      <AnimatePresence>
        {showAddClassModal && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-lg font-black text-white">Nuova Configurazione Classe</h3>
                <button
                  onClick={() => setShowAddClassModal(false)}
                  className="text-slate-400 hover:text-white text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveClass} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Nome della Classe
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Es. Classe 2ª C"
                    value={newClassName}
                    onChange={(e) => setNewClassName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Anno Scolastico
                  </label>
                  <select
                    value={newYearLevel}
                    onChange={(e) => setNewYearLevel(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500"
                  >
                    <option value="1ª Media">1ª Media (Medioevo / Origini)</option>
                    <option value="2ª Media">2ª Media (Età Moderna / Rivoluzioni)</option>
                    <option value="3ª Media">3ª Media (Ottocento / Novecento)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-rose-400 uppercase tracking-wider mb-1.5">
                      Squadra Rossa
                    </label>
                    <input
                      type="text"
                      placeholder="Nome squadra A"
                      value={newTeamA}
                      onChange={(e) => setNewTeamA(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-blue-400 uppercase tracking-wider mb-1.5">
                      Squadra Blu
                    </label>
                    <input
                      type="text"
                      placeholder="Nome squadra B"
                      value={newTeamB}
                      onChange={(e) => setNewTeamB(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="pt-3 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddClassModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition-colors"
                  >
                    Annulla
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-md transition-colors"
                  >
                    Salva Classe
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
