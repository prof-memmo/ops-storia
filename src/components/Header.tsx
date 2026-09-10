"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { onAuthStateChanged, User, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getAssetPath } from "@/lib/assets";
import { 
  Music, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  UserCheck, 
  Send, 
  ShieldCheck, 
  FileText, 
  Mail, 
  Power, 
  ChevronDown 
} from "lucide-react";

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [audioEl, setAudioEl] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Chiudi dropdown cliccando fuori
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("#header-user-menu")) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const toggleMusic = () => {
    if (!audioEl) {
      const trackUrl = getAssetPath("/audio/avventura_storica.mp3");
      const audio = new Audio(trackUrl);
      audio.loop = true;
      audio.play().then(() => {
        setIsPlaying(true);
        setAudioEl(audio);
      }).catch(() => {
        // Fallback remote
        const fallbackAudio = new Audio("https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3");
        fallbackAudio.loop = true;
        fallbackAudio.play().then(() => {
          setIsPlaying(true);
          setAudioEl(fallbackAudio);
        }).catch(() => {});
      });
    } else {
      if (isPlaying) {
        audioEl.pause();
        setIsPlaying(false);
      } else {
        audioEl.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {});
      }
    }
  };

  const toggleMute = () => {
    if (audioEl) {
      audioEl.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const openLegalModal = (type: 'privacy' | 'termini' | 'contatti' | 'invita') => {
    setDropdownOpen(false);
    if (typeof window !== "undefined" && (window as any).openSharedModal) {
      (window as any).openSharedModal(type);
    } else if (typeof window !== "undefined" && (window as any).Modals) {
      (window as any).Modals.openLegalModal(type);
    } else {
      window.open(`https://prof-memmo.github.io/games/`, "_blank");
    }
  };

  const handleLogout = async () => {
    if (confirm("Vuoi davvero uscire dalla sessione di gioco?")) {
      await signOut(auth);
      window.location.href = "https://prof-memmo.github.io/games/";
    }
  };

  const userDisplayName = user?.displayName || (user?.email === "prof.memmo@gmail.com" ? "Prof. Memmo" : (user ? "Docente" : "Ospite"));
  const userRole = user?.email === "prof.memmo@gmail.com" ? "Amministratore" : (user ? "Docente" : "Ospite");
  const avatarUrl = user?.photoURL || "https://prof-memmo.github.io/prof-memmo-gestione-siti/shared/assets/avatars/6.png";

  return (
    <header className="w-full bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200 sticky top-0 z-40 px-4 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Sinistra: Logo Gioco Trasparente */}
        <div className="flex items-center gap-3">
          <Link href="/" className="hover:opacity-90 transition-opacity flex items-center gap-2">
            <img 
              src={getAssetPath('/images/logo.png')} 
              alt="Ops! Storia" 
              className="h-10 sm:h-12 w-auto object-contain" 
            />
          </Link>
        </div>

        {/* Centro: Logo Avatar Prof. Memmo */}
        <div className="flex items-center justify-center">
          <Link href="/" className="hover:scale-105 transition-transform" title="Home Prof. Memmo">
            <img 
              src="https://prof-memmo.github.io/prof-memmo-gestione-siti/shared/assets/branding/prof-memmo/prof-memmo-avatar.png" 
              alt="Prof. Memmo" 
              className="h-10 sm:h-13 w-auto object-contain drop-shadow-sm" 
            />
          </Link>
        </div>

        {/* Destra: Profilo Utente & Dropdown Menu Chiaro e Armonioso */}
        <div className="relative" id="header-user-menu">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 sm:gap-3 bg-white hover:bg-slate-50 text-slate-800 pl-2 pr-3 sm:pr-4 py-1.5 rounded-full shadow-sm hover:shadow transition-all border border-slate-200 cursor-pointer"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border-2 border-amber-400 bg-slate-100 shrink-0 shadow-sm">
              <img 
                src={avatarUrl} 
                alt="Avatar" 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="text-left hidden xs:block">
              <div className="text-[11px] sm:text-xs font-black text-slate-900 tracking-wide leading-tight truncate max-w-[110px]">
                {userDisplayName}
              </div>
              <div className="text-[9px] text-amber-600 font-bold uppercase tracking-wider leading-none">
                {userRole}
              </div>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Menu a Tendina Dropdown - Stile Chiaro e Pulito */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white/98 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-2xl p-4 text-slate-800 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              
              {/* Header Utente */}
              <div className="border-b border-slate-100 pb-3 mb-3 text-center">
                <div className="font-black text-sm text-slate-900 tracking-wide">{userDisplayName}</div>
                <div className="text-[10px] text-amber-600 font-bold uppercase tracking-widest">{userRole}</div>
              </div>

              {/* Sottofondo Player Widget */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 mb-3 shadow-inner">
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mb-1.5">
                  <span className="flex items-center gap-1.5 text-amber-600">
                    <Music className="w-3.5 h-3.5" /> SOTTOFONDO
                  </span>
                  <span className="text-[9px] text-slate-400 font-semibold">OPS! AUDIO</span>
                </div>
                <div className="flex items-center justify-between bg-white rounded-lg p-2 border border-slate-200/60 shadow-sm">
                  <span className="text-xs font-bold text-slate-800 truncate pr-2">Avventura Storica</span>
                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={toggleMusic}
                      className="w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center hover:bg-amber-600 transition-colors shadow-sm"
                      title={isPlaying ? "Pausa" : "Play"}
                    >
                      {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Pulsanti Azione Ecosistema */}
              <div className="space-y-1.5 text-xs font-bold">
                <a
                  href="https://prof-memmo.github.io/games/profilo.html" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors border border-slate-100"
                >
                  <span className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-amber-500" /> Modifica Profilo
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">Hub ↗</span>
                </a>

                <button
                  type="button"
                  onClick={() => openLegalModal('invita')}
                  className="w-full flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors border border-slate-100 text-left"
                >
                  <Send className="w-4 h-4 text-amber-500" /> Invita un Collega
                </button>

                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => openLegalModal('privacy')}
                    className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors border border-slate-100 text-[11px]"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-400" /> Privacy
                  </button>
                  <button
                    type="button"
                    onClick={() => openLegalModal('termini')}
                    className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors border border-slate-100 text-[11px]"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-400" /> Termini
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => openLegalModal('contatti')}
                  className="w-full flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors border border-slate-100 text-left"
                >
                  <Mail className="w-4 h-4 text-amber-500" /> Contatti
                </button>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={toggleMute}
                    className="flex-1 flex items-center justify-center gap-1.5 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors text-[11px]"
                  >
                    {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-500" /> : <Volume2 className="w-3.5 h-3.5 text-slate-600" />}
                    <span>{isMuted ? "Attiva" : "Muto"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex-1 flex items-center justify-center gap-1.5 p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200/60 transition-colors text-[11px]"
                  >
                    <Power className="w-3.5 h-3.5 text-red-500" /> Esci
                  </button>
                </div>

              </div>

            </div>
          )}
        </div>

      </div>
    </header>
  );
}
