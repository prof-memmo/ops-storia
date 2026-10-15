"use client";

import Link from "next/link";
import { BookOpen, CheckCircle, Timer, Flag, Heart, ShieldCheck, HelpCircle } from "lucide-react";
import { useRules, RuleArticle } from "@/lib/rules-service";

function getArticleIcon(art: RuleArticle) {
  const id = (art.id || "").toLowerCase();
  const title = (art.title || "").toLowerCase();
  if (art.type === "turno" || id.includes("turno") || title.includes("turno")) {
    return <Timer className="w-6 h-6 text-blue-500 mr-2 shrink-0" />;
  }
  if (art.type === "tabellone" || id.includes("tabellone") || title.includes("tabellone")) {
    return <CheckCircle className="w-6 h-6 text-purple-500 mr-2 shrink-0" />;
  }
  if (art.type === "modalita" || id.includes("modalita") || title.includes("modalit")) {
    return <Flag className="w-6 h-6 text-emerald-500 mr-2 shrink-0" />;
  }
  if (id.includes("benessere") || title.includes("benessere")) {
    return <Heart className="w-6 h-6 text-rose-500 mr-2 shrink-0" />;
  }
  if (id.includes("etica") || title.includes("etic") || title.includes("deontologic")) {
    return <ShieldCheck className="w-6 h-6 text-indigo-500 mr-2 shrink-0" />;
  }
  return <HelpCircle className="w-6 h-6 text-primary-500 mr-2 shrink-0" />;
}

export default function Regolamento() {
  const { parsed } = useRules();
  const { articles } = parsed;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="bg-white px-4 py-3 flex items-center justify-between shadow-sm sticky top-0 z-10 relative shrink-0">
        <div className="flex items-center space-x-2 sm:space-x-4 flex-1">
          <Link href="/" className="shrink-0 hover:scale-110 transition-transform">
            <img src="/icons/6.png" alt="Home" className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
          </Link>
          <img src="https://prof-memmo.github.io/prof-memmo-gestione-siti/shared/assets/branding/games/ops-storia-badge.png" alt="Ops!" className="h-10 sm:h-14 object-contain shrink-0 hidden sm:block" />
        </div>
        
        <div className="flex items-center justify-center flex-1">
           <img src="https://prof-memmo.github.io/prof-memmo-gestione-siti/shared/assets/branding/prof-memmo/avatar.png" alt="Prof Memmo" className="h-12 sm:h-16 object-contain" />
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
            {articles.map((art) => {
              // 1. Tabellone with tiles
              if (art.tiles && art.tiles.length > 0) {
                return (
                  <section key={art.id || art.num}>
                    <h2 className="text-2xl font-black text-slate-800 mb-4 flex items-center">
                      {getArticleIcon(art)} {art.num}. {art.title}
                    </h2>
                    {art.intro && (
                      <p className="text-lg text-slate-600 leading-relaxed mb-4">
                        {art.intro}
                      </p>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {art.tiles.map((tile, tIdx) => {
                        const isFullWidth = tIdx === art.tiles.length - 1 && art.tiles.length % 2 !== 0;
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
                );
              }

              // 2. Modalità with cards
              if (art.items && art.items.length > 0) {
                return (
                  <section key={art.id || art.num}>
                    <h2 className="text-2xl font-black text-slate-800 mb-4 flex items-center">
                      {getArticleIcon(art)} {art.num}. {art.title}
                    </h2>
                    {art.intro && (
                      <p className="text-lg text-slate-600 leading-relaxed mb-4">
                        {art.intro}
                      </p>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {art.items.map((item, mIdx) => (
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
                );
              }

              // 3. Bullet points (Turno or generic)
              if (art.points && art.points.length > 0) {
                return (
                  <section key={art.id || art.num}>
                    <h2 className="text-2xl font-black text-slate-800 mb-4 flex items-center">
                      {getArticleIcon(art)} {art.num}. {art.title}
                    </h2>
                    {art.intro && (
                      <p className="text-lg text-slate-600 leading-relaxed mb-4">
                        {art.intro}
                      </p>
                    )}
                    <ul className="list-disc pl-6 space-y-2 text-lg text-slate-600 font-medium">
                      {art.points.map((pt, pIdx) => (
                        <li key={pIdx}>
                          {pt.label && <strong className="text-slate-800">{pt.label}: </strong>}
                          {pt.text}
                        </li>
                      ))}
                    </ul>
                  </section>
                );
              }

              // 4. Standard text card
              return (
                <section key={art.id || art.num}>
                  <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-100 flex items-start space-x-4">
                    <div className="bg-primary-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-black text-xl shrink-0">
                      {art.num}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-black text-slate-800 mb-2">{art.title}</h3>
                      <div className="text-lg text-slate-600 leading-relaxed whitespace-pre-line">
                        {art.body || art.intro}
                      </div>
                    </div>
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

