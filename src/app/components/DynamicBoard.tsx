"use client";

import { motion } from "framer-motion";

type Team = {
  pos: number;
  pawn: number;
  id: string;
};

export default function DynamicBoard({ teamA, teamB }: { teamA: Team, teamB: Team }) {
  const TOTAL_CELLS = 25;
  const ICONS = ["3.png", "4.png", "5.png", "6.png", "7.png"];

  // Genera le 25 caselle
  const cells = Array.from({ length: TOTAL_CELLS }, (_, i) => {
    return {
      index: i,
      icon: ICONS[i % ICONS.length],
      isEnd: i === TOTAL_CELLS - 1
    };
  });

  return (
    <div className="w-full h-full min-h-[50vh] max-h-[70vh] bg-white rounded-3xl p-6 sm:p-10 overflow-y-auto shadow-inner border-4 border-slate-100 flex flex-wrap justify-center items-center gap-6 sm:gap-10">
      {cells.map((cell) => {
        const teamsHere = [];
        if (teamA.pos === cell.index) teamsHere.push(teamA);
        if (teamB.pos === cell.index) teamsHere.push(teamB);

        if (cell.isEnd) {
          return (
            <div key={cell.index} className="relative w-36 h-36 sm:w-56 sm:h-56 flex items-center justify-center bg-slate-50 rounded-3xl border-8 border-yellow-400 shadow-2xl p-4 shrink-0 mx-4">
              <img src="/images/logo.png" alt="Traguardo" className="w-full h-full object-contain" />
              
              <div className="absolute -top-4 -left-4 bg-yellow-400 text-slate-900 text-sm sm:text-lg font-black w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                {cell.index + 1}
              </div>

              {/* Pedine sul traguardo */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {teamsHere.map((team, idx) => (
                  <motion.img 
                    key={team.id}
                    layoutId={`pawn-${team.id}`}
                    src={`/images/pedine_page_${team.pawn}.png`} 
                    className="w-16 h-20 sm:w-24 sm:h-32 object-contain drop-shadow-2xl origin-bottom" 
                    style={{ marginLeft: idx > 0 ? '-30px' : '0', zIndex: 10 + idx }}
                    transition={{ type: "spring", stiffness: 100, damping: 15 }}
                  />
                ))}
              </div>
            </div>
          );
        }

        return (
          <div key={cell.index} className="relative w-20 h-20 sm:w-28 sm:h-28 flex items-center justify-center shrink-0">
            {/* Sfondo Casella (Icona) */}
            <img src={`/images/board_icons/${cell.icon}`} className="w-full h-full object-contain opacity-90 drop-shadow-sm" />
            
            {/* Numerazione Percorso */}
            <div className="absolute -top-2 -left-2 bg-slate-800 text-white text-[10px] sm:text-xs font-black w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shadow-md">
              {cell.index + 1}
            </div>

            {/* Pedine in Casella */}
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-3 pointer-events-none">
              <div className="flex items-end justify-center">
                {teamsHere.map((team, idx) => (
                  <motion.img 
                    key={team.id}
                    layoutId={`pawn-${team.id}`}
                    src={`/images/pedine_page_${team.pawn}.png`} 
                    className="w-12 h-16 sm:w-16 sm:h-20 object-contain drop-shadow-xl origin-bottom" 
                    style={{ marginLeft: idx > 0 ? '-20px' : '0', zIndex: 10 + idx }}
                    transition={{ type: "spring", stiffness: 100, damping: 15 }}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
