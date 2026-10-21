import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { hubDb } from "@/lib/firebase";
import { useEffect, useState } from "react";

export const SUPER_ADMIN_EMAIL = "prof.memmo@gmail.com";

export interface MiniguidaStep {
  icon: string;
  iconColor?: string;
  title: string;
  desc: string;
}

export interface MiniguidaData {
  title: string;
  buttonLabel: string;
  finalButtonLabel: string;
  steps: MiniguidaStep[];
}

export const DEFAULT_OPS_MINIGUIDA: MiniguidaData = {
  title: "Miniguida",
  buttonLabel: "AVANTI",
  finalButtonLabel: "HO CAPITO!",
  steps: [
    {
      icon: "help-circle",
      iconColor: "#5c67f2",
      title: "",
      desc: "Lo scopo del gioco è far indovinare alla propria squadra la parola storica misteriosa prima che scada il tempo, evitando assolutamente di pronunciare le parole vietate."
    },
    {
      icon: "key",
      iconColor: "#d97706",
      title: "Accesso al Gioco",
      desc: "<strong>Accesso rapido:</strong> effettua il login con il tuo account Docente (o Viandante) per sbloccare tutte le funzionalità.<br><br><strong>Nessuna classe da creare:</strong> per questo gioco non servono codici né account per gli studenti; si gioca subito a squadre direttamente alla LIM o su dispositivo condiviso!"
    },
    {
      icon: "users",
      iconColor: "#10b981",
      title: "",
      desc: "Si gioca a turni tra due squadre: un giocatore descrive la parola chiave ai compagni senza usare i termini vietati; la squadra avversaria controlla e preme OPS in caso di errore, e ogni carta indovinata fa avanzare la propria pedina sul tabellone."
    },
    {
      icon: "monitor-play",
      iconColor: "#0284c7",
      title: "",
      desc: "Clicca su <strong>1 Dispositivo (Passa e Gioca)</strong> per sfidare l'altra squadra su un unico schermo, passandovi il dispositivo a ogni turno."
    },
    {
      icon: "book-open",
      iconColor: "#db2777",
      title: "",
      desc: "Clicca su <strong>Crea Stanza (LIM + Device)</strong> per proiettare il tabellone alla LIM con il timer, i punteggi e il pulsante OPS."
    },
    {
      icon: "skip-forward",
      iconColor: "#d97706",
      title: "",
      desc: "Clicca su <strong>Unisciti con PIN</strong> per entrare rapidamente in partita usando il tuo dispositivo come controller di squadra.<br><br><em>Consulta il regolamento per saperne di più.</em>"
    }
  ]
};

const STORAGE_KEY = "ops_miniguida_official_data";

export function ensureOpsAccessStep(data: MiniguidaData): MiniguidaData {
  if (!data || !Array.isArray(data.steps)) return data;
  const hasAccess = data.steps.some(s => 
    (s.title && s.title.toLowerCase().includes('accesso')) ||
    (s.desc && s.desc.toLowerCase().includes('accesso'))
  );
  if (!hasAccess && data.steps.length > 0) {
    const accessStep = JSON.parse(JSON.stringify(DEFAULT_OPS_MINIGUIDA.steps[1]));
    data.steps.splice(1, 0, accessStep);
  }
  return data;
}

export async function saveMiniguidaToCloud(data: MiniguidaData, authorEmail: string): Promise<void> {
  const isSuperAdmin = authorEmail.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
  if (!isSuperAdmin) {
    throw new Error(`Permesso negato: solo il Super-Admin (${SUPER_ADMIN_EMAIL}) può aggiornare la Miniguida.`);
  }

  const payload = {
    title: data.title || DEFAULT_OPS_MINIGUIDA.title,
    buttonLabel: data.buttonLabel || "AVANTI",
    finalButtonLabel: data.finalButtonLabel || "HO CAPITO!",
    steps: data.steps || DEFAULT_OPS_MINIGUIDA.steps,
    updatedAt: new Date().toISOString(),
    updatedBy: authorEmail
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (e) {}

  if (hubDb) {
    const docRef = doc(hubDb, "ops_settings", "miniguida");
    await setDoc(docRef, payload, { merge: true });
  }
}

export function useMiniguida() {
  const [data, setData] = useState<MiniguidaData>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && Array.isArray(parsed.steps) && parsed.steps.length > 0) {
            return ensureOpsAccessStep(parsed);
          }
        }
      } catch (e) {}
    }
    return DEFAULT_OPS_MINIGUIDA;
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hubDb) {
      setLoading(false);
      return;
    }

    const docRef = doc(hubDb, "ops_settings", "miniguida");
    const unsub = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const snapData = docSnap.data();
        if (snapData && Array.isArray(snapData.steps) && snapData.steps.length > 0) {
          const cloudData: MiniguidaData = {
            title: snapData.title || DEFAULT_OPS_MINIGUIDA.title,
            buttonLabel: snapData.buttonLabel || "AVANTI",
            finalButtonLabel: snapData.finalButtonLabel || "HO CAPITO!",
            steps: snapData.steps
          };
          const normalized = ensureOpsAccessStep(cloudData);
          setData(normalized);
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
          } catch (e) {}
        }
      }
      setLoading(false);
    }, (err) => {
      console.warn("[OpsMiniguida] Errore ascolto Firestore:", err);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return { data, loading, defaultData: DEFAULT_OPS_MINIGUIDA };
}
