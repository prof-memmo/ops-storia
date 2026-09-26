"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { getAssetPath, getPawnImg } from "@/lib/assets";

type TeamBoardProps = {
  pos: number;
  oldPos?: number;
  pawn: number;
  id: string;
  name?: string;
};

// Coordinate percentuali esatte per le 24 caselle sul tabellone autentico di Ops! Storia (1920x1080)
const BOARD_COORDINATES = [
  { x: 13.28, y: 13.06 }, // 1: START (col 1, row 1)
  { x: 13.28, y: 27.59 }, // 2: (col 1, row 2)
  { x: 21.46, y: 27.59 }, // 3: (col 2, row 2)
  { x: 29.64, y: 27.59 }, // 4: (col 3, row 2)
  { x: 29.64, y: 13.06 }, // 5: (col 3, row 1)
  { x: 37.81, y: 13.06 }, // 6: Canna da pesca (col 4, row 1)
  { x: 45.99, y: 13.06 }, // 7: (col 5, row 1)
  { x: 45.99, y: 27.59 }, // 8: (col 5, row 2)
  { x: 45.99, y: 42.13 }, // 9: (col 5, row 3)
  { x: 45.99, y: 56.67 }, // 10: (col 5, row 4)
  { x: 37.81, y: 56.67 }, // 11: (col 4, row 4)
  { x: 29.64, y: 56.67 }, // 12: Segnaposto / Checkpoint (col 3, row 4)
  { x: 21.46, y: 56.67 }, // 13: (col 2, row 4)
  { x: 21.46, y: 71.20 }, // 14: (col 2, row 5)
  { x: 21.46, y: 85.74 }, // 15: (col 2, row 6)
  { x: 29.64, y: 85.74 }, // 16: (col 3, row 6)
  { x: 37.81, y: 85.74 }, // 17: (col 4, row 6)
  { x: 45.99, y: 85.74 }, // 18: Pedina scacchi (col 5, row 6)
  { x: 54.17, y: 85.74 }, // 19: (col 6, row 6)
  { x: 62.34, y: 85.74 }, // 20: (col 7, row 6)
  { x: 70.52, y: 85.74 }, // 21: x2 (col 8, row 6)
  { x: 78.70, y: 85.74 }, // 22: (col 9, row 6)
  { x: 78.70, y: 71.20 }, // 23: (col 9, row 5)
  { x: 78.70, y: 56.67 }  // 24: TRAGUARDO FINALE (col 9, row 4)
];

// Funzione audio per riprodurre il suono del passo/tick senza dipendenze esterne
function playStepTick() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    if (!(window as unknown as { __opsAudioCtx?: AudioContext }).__opsAudioCtx) {
      (window as unknown as { __opsAudioCtx: AudioContext }).__opsAudioCtx = new AudioCtx();
    }
    const ctx = (window as unknown as { __opsAudioCtx: AudioContext }).__opsAudioCtx;
    if (ctx.state === "suspended") {
      ctx.resume();
    }
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(820, ctx.currentTime);
    gain.gain.setValueAtTime(0.09, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch {
    // Fallback sicuro se audio non disponibile
  }
}

export default function DynamicBoard({ 
  teamA, 
  teamB,
  onAnimationDone 
}: { 
  teamA: TeamBoardProps; 
  teamB: TeamBoardProps;
  onAnimationDone?: () => void;
}) {
  const targetPosA = Math.max(1, Math.min(24, teamA.pos || 1));
  const targetPosB = Math.max(1, Math.min(24, teamB.pos || 1));
  const startPosA = Math.max(1, Math.min(24, teamA.oldPos ?? targetPosA));
  const startPosB = Math.max(1, Math.min(24, teamB.oldPos ?? targetPosB));

  const [displayPosA, setDisplayPosA] = useState(startPosA);
  const [displayPosB, setDisplayPosB] = useState(startPosB);
  const [isMovingA, setIsMovingA] = useState(false);
  const [isMovingB, setIsMovingB] = useState(false);

  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    if (hasAnimatedRef.current) return;
    hasAnimatedRef.current = true;

    let curA = startPosA;
    let curB = startPosB;

    const animateTeamA = () => {
      if (curA < targetPosA) {
        setIsMovingA(true);
        const intervalA = setInterval(() => {
          curA += 1;
          setDisplayPosA(curA);
          playStepTick();

          if (curA >= targetPosA) {
            clearInterval(intervalA);
            setIsMovingA(false);
            setTimeout(animateTeamB, 200);
          }
        }, 260);
      } else {
        animateTeamB();
      }
    };

    const animateTeamB = () => {
      if (curB < targetPosB) {
        setIsMovingB(true);
        const intervalB = setInterval(() => {
          curB += 1;
          setDisplayPosB(curB);
          playStepTick();

          if (curB >= targetPosB) {
            clearInterval(intervalB);
            setIsMovingB(false);
            if (onAnimationDone) onAnimationDone();
          }
        }, 260);
      } else {
        if (onAnimationDone) onAnimationDone();
      }
    };

    // Avvia l'animazione dopo un breve delay di montaggio per consentire la visualizzazione iniziale
    const startTimeout = setTimeout(() => {
      animateTeamA();
    }, 350);

    return () => {
      clearTimeout(startTimeout);
    };
  }, [startPosA, targetPosA, startPosB, targetPosB, onAnimationDone]);

  const idxA = Math.max(0, Math.min(23, displayPosA - 1));
  const idxB = Math.max(0, Math.min(23, displayPosB - 1));
  const isSameTile = idxA === idxB;

  const coordA = BOARD_COORDINATES[idxA] || BOARD_COORDINATES[0];
  const coordB = BOARD_COORDINATES[idxB] || BOARD_COORDINATES[0];

  return (
    <div className="w-full max-w-5xl relative rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-900/20 bg-[#fbf6ea]">
      {/* Immagine del Tabellone Originale di Ops! Storia */}
      <div className="relative w-full aspect-[1920/1080]">
        <img 
          src={getAssetPath("/images/tabellone_page_1.png")} 
          alt="Tabellone Ufficiale Ops! Storia" 
          className="w-full h-full object-contain select-none pointer-events-none"
        />

        {/* Overlay Pedine Squadre con animazioni fluide Framer Motion */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Pedina Squadra A (Rossa) */}
          <motion.div
            layout
            key={`pawn-A-${teamA.pawn}`}
            initial={false}
            animate={{
              left: `${coordA.x}%`,
              top: `${coordA.y}%`,
              x: isSameTile ? "-70%" : "-50%",
              y: "-50%",
              scale: isMovingA ? 1.3 : 1
            }}
            transition={{ type: "spring", stiffness: 180, damping: 18 }}
            className="absolute z-20 flex flex-col items-center justify-center pointer-events-auto"
            title={`${teamA.name || "Squadra A"} (Casella ${displayPosA})`}
          >
            <div className="relative w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full border-3 sm:border-4 border-red-500 bg-white shadow-2xl ring-2 sm:ring-4 ring-red-400/60 overflow-hidden flex items-center justify-center">
              <img 
                src={getPawnImg(teamA.pawn || 1)} 
                alt="Pedina Squadra A" 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="mt-1 bg-red-600 text-white text-[9px] sm:text-[11px] font-black px-1.5 sm:px-2 py-0.5 rounded-full shadow-md uppercase tracking-wider whitespace-nowrap">
              {teamA.name || "Squadra A"} ({displayPosA})
            </span>
          </motion.div>

          {/* Pedina Squadra B (Blu) */}
          <motion.div
            layout
            key={`pawn-B-${teamB.pawn}`}
            initial={false}
            animate={{
              left: `${coordB.x}%`,
              top: `${coordB.y}%`,
              x: isSameTile ? "-30%" : "-50%",
              y: "-50%",
              scale: isMovingB ? 1.3 : 1
            }}
            transition={{ type: "spring", stiffness: 180, damping: 18 }}
            className="absolute z-20 flex flex-col items-center justify-center pointer-events-auto"
            title={`${teamB.name || "Squadra B"} (Casella ${displayPosB})`}
          >
            <div className="relative w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full border-3 sm:border-4 border-blue-500 bg-white shadow-2xl ring-2 sm:ring-4 ring-blue-400/60 overflow-hidden flex items-center justify-center">
              <img 
                src={getPawnImg(teamB.pawn || 2)} 
                alt="Pedina Squadra B" 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="mt-1 bg-blue-600 text-white text-[9px] sm:text-[11px] font-black px-1.5 sm:px-2 py-0.5 rounded-full shadow-md uppercase tracking-wider whitespace-nowrap">
              {teamB.name || "Squadra B"} ({displayPosB})
            </span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
