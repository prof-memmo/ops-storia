import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { hubDb } from "@/lib/firebase";
import { useEffect, useState } from "react";

export const SUPER_ADMIN_EMAIL = "prof.memmo@gmail.com";

export const DEFAULT_OPS_RULES_TEXT = `[SCOPO]
1. Scopo del Gioco e Accesso Centralizzato
Ops! è un gioco a squadre basato sulla comunicazione storica e lessicale. L'accesso, la gestione del proprio account, dei piani e delle classi avvengono esclusivamente tramite il Profilo del docente sul portale principale https://prof-memmo.github.io/games/ che genera un codice univoco da condividere con gli studenti. Lo scopo è far indovinare ai compagni di squadra una parola segreta, indicata in grande sulla carta, senza MAI pronunciare nessuna delle 5 "parole vietate" elencate sotto di essa. Vince la squadra che porta la propria pedina per prima alla casella d'arrivo.

[TURNO]
2. Svolgimento del Turno
Ogni turno dura 60 secondi. Un giocatore (il "Suggeritore") prende il dispositivo e cerca di far indovinare più parole possibili alla sua squadra.
• Parola Indovinata: La squadra guadagna 1 punto e la pedina avanza di uno spazio sul tabellone.
• Scarto: Se una parola è troppo difficile, il Suggeritore può scartarla (massimo 2 scarti per turno). Ogni scarto regala 1 punto alla squadra avversaria.

[TASTO_OPS]
3. Il Tasto OPS!
Durante il turno, un giocatore della squadra avversaria controlla lo schermo. Se il Suggeritore pronuncia una parola vietata, parte di essa, oppure gesticola, l'avversario premerà il grosso tasto OPS!. Questo blocca la carta attuale e regala immediatamente 1 punto agli avversari, rubandolo alla vostra squadra.

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
• 🖥️ Multi-Device (LIM + Tablet/Device): La modalità regina per la classe! Il docente proietta il tabellone alla LIM e genera un PIN Stanza a 4 cifre. Gli studenti accedono dai propri tablet o device per visualizzare le carte del proprio turno e premere il tasto OPS! in tempo reale, senza spoiler per la classe.

[BENESSERE]
6. Benessere Digitale e Gestione delle Pause
In linea con le linee guida pedagogiche di Prof. Memmo, l'attività didattica prevede sessioni attive di massimo 45 minuti, seguite obbligatoriamente da almeno 15 minuti di pausa o debriefing non mediato da schermi, garantendo un equilibrio sostenibile tra gioco digitale e confronto in presenza.

[ETICA]
7. Codice Deontologico e Fair Play
I partecipanti si impegnano al rispetto reciproco, alla correttezza nell'uso del tasto OPS! (vietato l'uso speculativo o scorretto) e alla valorizzazione del lavoro di squadra. Gli studenti identificati tramite il codice classe operano nel pieno rispetto della privacy scolastica.`;

const STORAGE_KEY = "ops_rules_official_text";

export interface RuleTile {
  num: string;
  title: string;
  desc: string;
  color: string;
}

export interface RuleModeItem {
  title: string;
  desc: string;
  icon: string;
}

export interface RulePoint {
  label: string;
  text: string;
}

export interface RuleArticle {
  id: string;
  num: number;
  tag?: string;
  title: string;
  body: string;
  intro?: string;
  points: RulePoint[];
  tiles: RuleTile[];
  items: RuleModeItem[];
  type: "standard" | "turno" | "tabellone" | "modalita";
}

export interface ParsedOpsRules {
  articles: RuleArticle[];
  scopo: { title: string; body: string };
  turno: { title: string; intro: string; points: RulePoint[] };
  tastoOps: { title: string; body: string };
  tabellone: {
    title: string;
    intro: string;
    tiles: RuleTile[];
  };
  modalita: {
    title: string;
    items: RuleModeItem[];
  };
}

export function resolveAdminEmail(explicitEmail?: string | null): string {
  if (explicitEmail && explicitEmail.trim().length > 0) return explicitEmail.trim();
  if (typeof window !== "undefined") {
    try {
      const candidates = ["currentUser", "user", "eroi_user_profile", "userProfile"];
      for (const k of candidates) {
        const raw = localStorage.getItem(k);
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            if (parsed && typeof parsed.email === "string" && parsed.email.trim().length > 0) {
              return parsed.email.trim();
            }
          } catch (e) {
            if (raw.includes("@") && raw.length < 100) return raw.trim();
          }
        }
      }
      if ((window as any).currentUser?.email) return (window as any).currentUser.email;
    } catch (e) {}
  }
  return "";
}

const TILE_COLORS = ["green", "blue", "purple", "yellow", "amber"];

function parseBulletPoints(lines: string[]): RulePoint[] {
  return lines
    .filter((l) => l.startsWith("•") || l.startsWith("-") || l.startsWith("*"))
    .map((l) => {
      const clean = l.replace(/^[•\-*]\s*/, "");
      const colonIdx = clean.indexOf(":");
      if (colonIdx !== -1) {
        return {
          label: clean.substring(0, colonIdx).trim(),
          text: clean.substring(colonIdx + 1).trim()
        };
      }
      return { label: "", text: clean };
    });
}

function parseTiles(lines: string[]): RuleTile[] {
  return lines
    .filter((l) => l.startsWith("•") || l.startsWith("-") || l.startsWith("*"))
    .map((l, idx) => {
      const clean = l.replace(/^[•\-*]\s*/, "");
      const colonIdx = clean.indexOf(":");
      const title = colonIdx !== -1 ? clean.substring(0, colonIdx).trim() : clean;
      const desc = colonIdx !== -1 ? clean.substring(colonIdx + 1).trim() : "";
      return {
        num: String(idx + 1),
        title,
        desc,
        color: TILE_COLORS[idx % TILE_COLORS.length]
      };
    });
}

function parseModes(lines: string[]): RuleModeItem[] {
  return lines
    .filter((l) => l.startsWith("•") || l.startsWith("-") || l.startsWith("*"))
    .map((l) => {
      const clean = l.replace(/^[•\-*]\s*/, "");
      const colonIdx = clean.indexOf(":");
      const title = colonIdx !== -1 ? clean.substring(0, colonIdx).trim() : clean;
      const desc = colonIdx !== -1 ? clean.substring(colonIdx + 1).trim() : "";
      return {
        title,
        desc,
        icon: title.includes("1") || title.toLowerCase().includes("party") ? "📱" : "🖥️"
      };
    });
}

export function parseOpsRules(rawText: string): ParsedOpsRules {
  const text = (rawText && rawText.trim().length > 0) ? rawText.trim() : DEFAULT_OPS_RULES_TEXT.trim();
  const articles: RuleArticle[] = [];

  const hasTags = /\[[A-Za-z0-9_]+\]/.test(text);

  if (hasTags) {
    const regex = /\[([A-Za-z0-9_]+)\]/g;
    const parts = text.split(regex);
    // parts[0] is text before first tag, parts[1] is tag1, parts[2] is text1, etc.
    let itemIdx = 0;
    for (let i = 1; i < parts.length; i += 2) {
      itemIdx++;
      const tag = (parts[i] || "").trim().toUpperCase();
      const content = (parts[i + 1] || "").trim();
      const lines = content.split("\n").map((l) => l.trim()).filter(Boolean);

      const firstNonBullet = lines.find((l) => !l.startsWith("•") && !l.startsWith("-") && !l.startsWith("*")) || `Articolo ${itemIdx}`;
      const numMatch = firstNonBullet.match(/^(\d+)[\.\)]\s*(.*)$/);
      const articleNum = numMatch ? parseInt(numMatch[1], 10) : itemIdx;
      const cleanTitle = numMatch && numMatch[2] ? numMatch[2].trim() : firstNonBullet.replace(/^\d+[\.\)]\s*/, "").trim();

      const nonBulletLines = lines.filter((l) => !l.startsWith("•") && !l.startsWith("-") && !l.startsWith("*"));
      const bodyLines = nonBulletLines.filter((l) => l !== firstNonBullet);
      const body = bodyLines.join("\n\n");
      const intro = bodyLines[0] || "";

      let type: "standard" | "turno" | "tabellone" | "modalita" = "standard";
      const tagLower = tag.toLowerCase();

      if (tagLower === "turno" || tagLower.includes("turno")) {
        type = "turno";
      } else if (tagLower === "tabellone" || tagLower.includes("tabellone")) {
        type = "tabellone";
      } else if (tagLower === "modalita" || tagLower.includes("modalit")) {
        type = "modalita";
      }

      articles.push({
        id: tagLower || `art_${articleNum}`,
        num: articleNum,
        tag,
        title: cleanTitle || `Articolo ${articleNum}`,
        body,
        intro,
        points: parseBulletPoints(lines),
        tiles: parseTiles(lines),
        items: parseModes(lines),
        type
      });
    }
  } else {
    // Numbered articles fallback: 1. Title, 2. Title, etc.
    const chunks = text.split(/(?=(?:^|\n)\s*\d+[\.\)]\s+)/).map((c) => c.trim()).filter(Boolean);
    chunks.forEach((chunk, idx) => {
      const lines = chunk.split("\n").map((l) => l.trim()).filter(Boolean);
      const firstLine = lines[0] || `Articolo ${idx + 1}`;
      const numMatch = firstLine.match(/^(\d+)[\.\)]\s*(.*)$/);
      const articleNum = numMatch ? parseInt(numMatch[1], 10) : idx + 1;
      const cleanTitle = numMatch && numMatch[2] ? numMatch[2].trim() : firstLine.replace(/^\d+[\.\)]\s*/, "").trim();

      const nonBulletLines = lines.filter((l) => !l.startsWith("•") && !l.startsWith("-") && !l.startsWith("*"));
      const bodyLines = nonBulletLines.slice(1);
      const body = bodyLines.join("\n\n");
      const intro = bodyLines[0] || "";

      const titleLower = cleanTitle.toLowerCase();
      let type: "standard" | "turno" | "tabellone" | "modalita" = "standard";
      if (titleLower.includes("turno")) type = "turno";
      else if (titleLower.includes("tabellone")) type = "tabellone";
      else if (titleLower.includes("modalit")) type = "modalita";

      articles.push({
        id: `art_${articleNum}`,
        num: articleNum,
        title: cleanTitle,
        body,
        intro,
        points: parseBulletPoints(lines),
        tiles: parseTiles(lines),
        items: parseModes(lines),
        type
      });
    });
  }

  // Ensure legacy compatibility fields are fully populated
  const scopoArt = articles.find((a) => a.id === "scopo" || a.num === 1) || articles[0];
  const turnoArt = articles.find((a) => a.id === "turno" || a.num === 2) || articles[1];
  const tastoOpsArt = articles.find((a) => a.id === "tasto_ops" || a.num === 3) || articles[2];
  const tabelloneArt = articles.find((a) => a.id === "tabellone" || a.num === 4) || articles[3];
  const modalitaArt = articles.find((a) => a.id === "modalita" || a.num === 5) || articles[4];

  return {
    articles,
    scopo: {
      title: scopoArt ? scopoArt.title : "1. Scopo del Gioco",
      body: scopoArt ? (scopoArt.body || scopoArt.intro || "") : ""
    },
    turno: {
      title: turnoArt ? turnoArt.title : "2. Svolgimento del Turno",
      intro: turnoArt ? (turnoArt.intro || "") : "",
      points: turnoArt ? turnoArt.points : []
    },
    tastoOps: {
      title: tastoOpsArt ? tastoOpsArt.title : "3. Il Tasto OPS!",
      body: tastoOpsArt ? (tastoOpsArt.body || tastoOpsArt.intro || "") : ""
    },
    tabellone: {
      title: tabelloneArt ? tabelloneArt.title : "4. Il Tabellone e Caselle Speciali",
      intro: tabelloneArt ? (tabelloneArt.intro || "") : "",
      tiles: tabelloneArt ? tabelloneArt.tiles : []
    },
    modalita: {
      title: modalitaArt ? modalitaArt.title : "5. Le 2 Modalità di Gioco",
      items: modalitaArt ? modalitaArt.items : []
    }
  };
}

export async function saveRulesToCloud(newText: string, userEmail?: string): Promise<boolean> {
  const email = resolveAdminEmail(userEmail);
  if (email.toLowerCase() !== SUPER_ADMIN_EMAIL.toLowerCase()) {
    throw new Error(`Permesso negato: solo il Super-Admin (${SUPER_ADMIN_EMAIL}) può salvare le modifiche. Autenticato: "${email || "nessuno"}".`);
  }

  const trimmed = (newText || "").trim();
  if (!trimmed) throw new Error("Il testo del regolamento non può essere vuoto.");

  const payload = {
    text: trimmed,
    lastUpdated: new Date().toISOString(),
    updatedBy: email,
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

