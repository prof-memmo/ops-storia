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
  title: "Come si gioca?",
  buttonLabel: "AVANTI",
  finalButtonLabel: "HO CAPITO!",
  steps: [
    {
      icon: "info",
      iconColor: "#5c67f2",
      title: "Parola Chiave e Taboo",
      desc: "Fai indovinare la <strong>parola chiave</strong> senza pronunciare le <span class='text-red-500 font-bold'>5 Parole Vietate</span>. Ottieni <strong class='text-emerald-500'>+1 punto</strong> per ogni parola indovinata!"
    },
    {
      icon: "alert-octagon",
      iconColor: "#ef4444",
      title: "Il Tasto OPS!",
      desc: "Se pronunci una <span class='text-red-500 font-bold'>Parola Vietata</span>, la squadra avversaria preme <strong>OPS!</strong> rubandoti il punto!"
    },
    {
      icon: "skip-forward",
      iconColor: "#f59e0b",
      title: "Scarti Strategici",
      desc: "Puoi scartare massimo <strong>2 carte</strong> per turno, ma regali <strong class='text-red-500'>+1 punto</strong> agli avversari!"
    },
    {
      icon: "timer",
      iconColor: "#3b82f6",
      title: "Caselle & Poteri Speciali",
      desc: "Avanzando sul tabellone a 24 caselle sbloccherai <strong class='text-purple-600'>effetti speciali</strong> (Tempo Doppio 120s, Pesca Illimitata o Imprevisti)."
    },
    {
      icon: "monitor-play",
      iconColor: "#10b981",
      title: "Due Modalità di Gioco",
      desc: "<strong>Due modalità:</strong> Gioca con <strong class='text-slate-900'>1 Dispositivo</strong> (Passa e Gioca) oppure in <strong class='text-primary-600'>Multi-Device</strong> (Tabellone alla LIM e carte segrete sui tablet/device con PIN)."
    }
  ]
};

const STORAGE_KEY = "ops_miniguida_official_data";

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
            return parsed;
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
          setData(cloudData);
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudData));
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
