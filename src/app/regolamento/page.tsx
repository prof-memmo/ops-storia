"use client";

import Link from "next/link";
import { BookOpen, CheckCircle, Timer, Flag } from "lucide-react";
import { useRules } from "@/lib/rules-service";

export default function Regolamento() {
  const { parsed } = useRules();
  const { scopo, turno, tastoOps, tabellone, modalita } = parsed;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="bg-white px-4 py-3 flex items-center justify-between shadow-sm sticky top-0 z-10 relative shrink-0">
        <div className="flex items-center space-x-2 sm:space-x-4 flex-1">
          <Link href="/" className="shrink-0 hover:scale-110 transition-transform">
            <img src="/ops-storia/icons/6.png" alt="Home" className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
          </Link>
          <img src="https://gestionesiti.profmemmo.it/shared/assets/branding/games/ops-storia-badge.png" alt="Ops!" className="h-10 sm:h-14 object-contain shrink-0 hidden sm:block" />
        </div>
        
        <div className="flex items-center justify-center flex-1">
           <img src="https://gestionesiti.profmemmo.it/shared/assets/branding/prof-memmo/avatar.png" alt="Prof Memmo" className="h-12 sm:h-16 object-contain" />
        </div>

        <div className="font-black text-sm sm:text-xl text-primary-500 text-right flex-1 tracking-tight">REGOLAMENTO</div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto p-6 sm:p-12 w-full">
        <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-12 border border-slate-100">
          
          <div className="flex items-center mb-8 pb-6 border-b border-slate-100">
            <BookOpen className="w-12 h-12 text-primary-500 mr-4 shrink-0" />
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Come si gioca a Ops!</h1>
          </div>

          <div className="space-y-12">
            
            {/* 1. Scopo */}
            <section>
              <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-100 flex items-start space-x-4">
                <div className="bg-primary-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-black text-xl shrink-0">1</div>
                <p className="text-lg text-slate-600 leading-relaxed">
                  {scopo.body}
                </p>
              </div>
            </section>

            {/* 2. Turno */}
            <section>
              <h2 className="text-2xl font-black text-slate-800 mb-4 flex items-center">
                <Timer className="w-6 h-6 text-blue-500 mr-2 shrink-0" /> {turno.title}
              </h2>
              {turno.intro && (
                <p className="text-lg text-slate-600 leading-relaxed mb-4">
                  {turno.intro}
                </p>
              )}
              {turno.points.length > 0 && (
                <ul className="list-disc pl-6 space-y-2 text-lg text-slate-600 font-medium">
                  {turno.points.map((pt, pIdx) => (
                    <li key={pIdx}>
                      {pt.label && <strong className="text-slate-800">{pt.label}: </strong>}
                      {pt.text}
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* 3. Tasto OPS */}
            <section>
              <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-100 flex items-start space-x-4">
                <div className="bg-primary-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-black text-xl shrink-0">3</div>
                <p className="text-lg text-slate-600 leading-relaxed">
                  {tastoOps.body}
                </p>
              </div>
            </section>

            {/* 4. Tabellone */}
            <section>
              <h2 className="text-2xl font-black text-slate-800 mb-4 flex items-center">
                <CheckCircle className="w-6 h-6 text-purple-500 mr-2 shrink-0" /> {tabellone.title}
              </h2>
              {tabellone.intro && (
                <p className="text-lg text-slate-600 leading-relaxed mb-4">
                  {tabellone.intro}
                </p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tabellone.tiles.map((tile, tIdx) => {
                  const isFullWidth = tIdx === tabellone.tiles.length - 1 && tabellone.tiles.length % 2 !== 0;
                  const colorStyles: Record<string, { bg: string; border: string; title: string; desc: string }> = {
                    green: { bg: "bg-green-50", border: "border-green-200", title: "text-green-700", desc: "text-green-600" },
                    blue: { bg: "bg-blue-50", border: "border-blue-200", title: "text-blue-700", desc: "text-blue-600" },
                    purple: { bg: "bg-purple-50", border: "border-purple-200", title: "text-purple-700", desc: "text-purple-600" },
                    yellow: { bg: "bg-yellow-50", border: "border-yellow-200", title: "text-yellow-700", desc: "text-yellow-600" },
                    amber: { bg: "bg-amber-50", border: "border-amber-300", title: "text-amber-800", desc: "text-amber-700" }
                  };
                  const style = colorStyles[tile.color] || colorStyles.amber;

                  return (
                    <div 
                      key={tIdx} 
                      className={`${style.bg} p-4 rounded-xl border ${style.border} ${isFullWidth ? "md:col-span-2 text-center" : ""}`}
                    >
                      <h4 className={`font-bold ${style.title} text-xl mb-1`}>{tile.title}</h4>
                      <p className={style.desc}>{tile.desc}</p>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 5. Modalità */}
            <section>
              <h2 className="text-2xl font-black text-slate-800 mb-4 flex items-center">
                <Flag className="w-6 h-6 text-emerald-500 mr-2 shrink-0" /> {modalita.title}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {modalita.items.map((item, mIdx) => (
                  <div 
                    key={mIdx} 
                    className={mIdx === 0 ? "bg-slate-50 p-5 rounded-2xl border-2 border-slate-200" : "bg-primary-50/50 p-5 rounded-2xl border-2 border-primary-200"}
                  >
                    <h3 className={`text-lg font-black mb-2 ${mIdx === 0 ? "text-slate-900" : "text-primary-900"}`}>
                      {item.title}
                    </h3>
                    <p className={`text-sm leading-relaxed ${mIdx === 0 ? "text-slate-600" : "text-slate-700"}`}>
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </section>

          </div>
        </div>
      </main>
    </div>
  );
}
