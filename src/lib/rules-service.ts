import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { hubDb } from "@/lib/firebase";
import { useEffect, useState } from "react";

export const SUPER_ADMIN_EMAIL = "prof.memmo@gmail.com";

export const DEFAULT_OPS_RULES_TEXT = `[SCOPO]
1. Scopo del Gioco
Ops! è un gioco a squadre basato sulla comunicazione. Lo scopo è far indovinare ai propri compagni di squadra una parola segreta, indicata in grande sulla carta, senza MAI pronunciare nessuna delle 5 "parole vietate" elencate sotto di essa. Vince la squadra che porta la propria pedina per prima alla casella d'arrivo.

[TURNO]
2. Svolgimento del Turno
Ogni turno dura 60 secondi. Un giocatore (il "Suggeritore") prende il dispositivo e cerca di far indovinare più parole possibili alla sua squadra.
• Parola Indovinata: La squadra guadagna 1 punto e la pedina avanzerà di uno spazio sul tabellone.
• Scarto: Se una parola è troppo difficile, il Suggeritore può scartarla. Si possono fare massimo 2 scarti per turno. Ogni scarto regala 1 punto alla squadra avversaria.

[TASTO_OPS]
3. Il Tasto OPS!
Durante il turno, un giocatore della squadra avversaria controllerà il proprio schermo. Se il Suggeritore pronuncia una parola Vietata, parte di essa, oppure gesticola, l'avversario premerà il grosso tasto OPS!. Questo blocca la carta attuale e regala immediatamente 1 punto agli avversari, rubandolo alla vostra squadra.

[TABELLONE]
4. Il Tabellone e Caselle Speciali
Al termine dei 60 secondi, le pedine avanzano sul tabellone a 24 caselle. Lungo il tracciato sono presenti caselle speciali che garantiscono vantaggi esclusivi alla squadra che vi atterra:
• Casella 6 (🎣 Pesca Illimitata): Nel turno successivo la squadra può scartare infinite carte senza il limite standard di 2 scarti.
• Casella 12 (📍 Checkpoint Intermedio): Traguardo a metà percorso: sancisce l'ingresso nella seconda metà del tabellone storico.
• Casella 18 (♟️ Mossa del Cavallo): Scacco al tabellone! La pedina compie un balzo immediato alla casella 19.
• Casella 21 (✖️2 Tempo Doppio 120s): Volata finale! Nel turno successivo la squadra avrà ben 120 secondi di tempo a disposizione.
• Casella 24 (🏆 Traguardo Finale): La prima squadra che raggiunge o supera la casella 24 trionfa nella sfida storica!

[MODALITA]
5. Le 2 Modalità di Gioco
• 📱 1 Dispositivo (Passa e Gioca • Party): Perfetta per sfide veloci con un unico tablet, PC o device condiviso. Il suggeritore tiene il dispositivo per sé durante il suo turno per non mostrare le parole taboo alla squadra, poi lo passa alla squadra avversaria al termine dei 60 secondi.
• 🖥️ Multi-Device (LIM + Tablet/Device): La modalità regina per la classe! Il docente proietta il tabellone alla LIM e genera un PIN Stanza a 4 cifre. Gli studenti accedono dai propri tablet o device per visualizzare le carte del proprio turno e premere il tasto OPS! in tempo reale, senza spoiler per la classe.`;

const STORAGE_KEY = "ops_rules_official_text";

export interface ParsedOpsRules {
  scopo: { title: string; body: string };
  turno: { title: string; intro: string; points: { label: string; text: string }[] };
  tastoOps: { title: string; body: string };
  tabellone: {
    title: string;
    intro: string;
    tiles: { num: string; title: string; desc: string; color: string }[];
  };
  modalita: {
    title: string;
    items: { title: string; desc: string; icon: string }[];
  };
}

export function parseOpsRules(rawText: string): ParsedOpsRules {
  const text = (rawText && rawText.trim().length > 0) ? rawText.trim() : DEFAULT_OPS_RULES_TEXT.trim();

  const sections: Record<string, string> = {
    scopo: "",
    turno: "",
    tasto_ops: "",
    tabellone: "",
    modalita: ""
  };

  const regex = /\[(SCOPO|TURNO|TASTO_OPS|TABELLONE|MODALITA)\]/gi;
  const parts = text.split(regex);

  if (parts.length > 1) {
    for (let i = 1; i < parts.length; i += 2) {
      const key = parts[i].toLowerCase();
      sections[key] = (parts[i + 1] || "").trim();
    }
  }

  // 1. Scopo
  const scopoLines = (sections.scopo || "").split("\n").map(l => l.trim()).filter(Boolean);
  const scopoTitle = scopoLines[0]?.replace(/^[0-9]+\.\s*/, "") || "1. Obiettivo del Gioco";
  const scopoBody = scopoLines.slice(1).join(" ") || "Ops! è un gioco a squadre basato sulla comunicazione...";

  // 2. Turno
  const turnoLines = (sections.turno || "").split("\n").map(l => l.trim()).filter(Boolean);
  const turnoTitle = turnoLines[0]?.replace(/^[0-9]+\.\s*/, "") || "2. Svolgimento del Turno (60s)";
  const turnoIntro = turnoLines.filter(l => !l.startsWith("•")).slice(1).join(" ") || "Ogni turno dura 60 secondi...";
  const turnoPoints = turnoLines.filter(l => l.startsWith("•")).map(l => {
    const clean = l.replace(/^•\s*/, "");
    const colonIdx = clean.indexOf(":");
    if (colonIdx !== -1) {
      return { label: clean.substring(0, colonIdx).trim(), text: clean.substring(colonIdx + 1).trim() };
    }
    return { label: "", text: clean };
  });

  // 3. Tasto OPS
  const opsLines = (sections.tasto_ops || "").split("\n").map(l => l.trim()).filter(Boolean);
  const opsTitle = opsLines[0]?.replace(/^[0-9]+\.\s*/, "") || "3. Il Tasto OPS!";
  const opsBody = opsLines.slice(1).join(" ") || "Durante il turno, un giocatore della squadra avversaria controlla lo schermo...";

  // 4. Tabellone
  const tabLines = (sections.tabellone || "").split("\n").map(l => l.trim()).filter(Boolean);
  const tabTitle = tabLines[0]?.replace(/^[0-9]+\.\s*/, "") || "4. Il Tabellone e Caselle Speciali";
  const tabIntro = tabLines.filter(l => !l.startsWith("•")).slice(1).join(" ") || "Al termine dei 60 secondi, le pedine avanzano sul tabellone...";
  const tileColors = ["green", "blue", "purple", "yellow", "amber"];
  const tabTiles = tabLines.filter(l => l.startsWith("•")).map((l, idx) => {
    const clean = l.replace(/^•\s*/, "");
    const colonIdx = clean.indexOf(":");
    const title = colonIdx !== -1 ? clean.substring(0, colonIdx).trim() : clean;
    const desc = colonIdx !== -1 ? clean.substring(colonIdx + 1).trim() : "";
    return {
      num: String(idx + 1),
      title,
      desc,
      color: tileColors[idx % tileColors.length]
    };
  });

  // 5. Modalita
  const modLines = (sections.modalita || "").split("\n").map(l => l.trim()).filter(Boolean);
  const modTitle = modLines[0]?.replace(/^[0-9]+\.\s*/, "") || "5. Le 2 Modalità di Gioco";
  const modItems = modLines.filter(l => l.startsWith("•")).map(l => {
    const clean = l.replace(/^•\s*/, "");
    const colonIdx = clean.indexOf(":");
    const title = colonIdx !== -1 ? clean.substring(0, colonIdx).trim() : clean;
    const desc = colonIdx !== -1 ? clean.substring(colonIdx + 1).trim() : "";
    return {
      title,
      desc,
      icon: title.includes("1") ? "📱" : "🖥️"
    };
  });

  return {
    scopo: { title: scopoTitle, body: scopoBody },
    turno: { title: turnoTitle, intro: turnoIntro, points: turnoPoints },
    tastoOps: { title: opsTitle, body: opsBody },
    tabellone: { title: tabTitle, intro: tabIntro, tiles: tabTiles },
    modalita: { title: modTitle, items: modItems }
  };
}

export async function saveRulesToCloud(newText: string, userEmail: string): Promise<boolean> {
  if (userEmail.toLowerCase() !== SUPER_ADMIN_EMAIL.toLowerCase()) {
    throw new Error(`Permesso negato: solo il Super-Admin (${SUPER_ADMIN_EMAIL}) può salvare le modifiche.`);
  }

  const trimmed = (newText || "").trim();
  if (!trimmed) throw new Error("Il testo del regolamento non può essere vuoto.");

  const payload = {
    text: trimmed,
    lastUpdated: new Date().toISOString(),
    updatedBy: userEmail,
    gameKey: "ops"
  };

  const docRef = doc(hubDb, "ops_settings", "official_rules");
  await setDoc(docRef, payload, { merge: true });

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (e) {}

  return true;
}

export function useRules() {
  const [rawText, setRawText] = useState<string>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed?.text) return parsed.text;
        }
      } catch (e) {}
    }
    return DEFAULT_OPS_RULES_TEXT;
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const docRef = doc(hubDb, "ops_settings", "official_rules");
      const unsubscribe = onSnapshot(docRef, (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          if (data?.text && data.text.trim().length > 0) {
            setRawText(data.text);
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify({
                text: data.text,
                lastUpdated: data.lastUpdated,
                updatedBy: data.updatedBy
              }));
            } catch (e) {}
          }
        }
      }, (err) => {
        console.warn("Firestore realtime listener offline for OPS rules:", err.message);
      });

      return () => unsubscribe();
    } catch (err) {
      console.warn("Error setting up Firestore listener for OPS rules:", err);
    }
  }, []);

  const parsed = parseOpsRules(rawText);

  return { rawText, parsed, loading, defaultText: DEFAULT_OPS_RULES_TEXT };
}
