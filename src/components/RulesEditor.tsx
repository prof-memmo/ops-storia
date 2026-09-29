"use client";

import { useState, useEffect } from "react";
import { 
  DEFAULT_OPS_RULES_TEXT, 
  SUPER_ADMIN_EMAIL, 
  saveRulesToCloud, 
  useRules 
} from "@/lib/rules-service";
import { 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  CloudUpload, 
  Loader2, 
  BookOpen 
} from "lucide-react";

interface RulesEditorProps {
  userEmail?: string | null;
}

export default function RulesEditor({ userEmail }: RulesEditorProps) {
  const { rawText, defaultText } = useRules();
  const [editorText, setEditorText] = useState(rawText);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    setEditorText(rawText);
  }, [rawText]);

  const isSuperAdmin = (userEmail || "").toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();

  const handleSave = async () => {
    if (!isSuperAdmin) {
      alert(`⚠️ Permesso negato: solo il Super-Admin (${SUPER_ADMIN_EMAIL}) può salvare le modifiche su Firestore.`);
      return;
    }

    setSaving(true);
    setErrorMsg("");
    try {
      await saveRulesToCloud(editorText, userEmail || "");
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 2500);
    } catch (err: any) {
      setErrorMsg(err.message || "Errore durante il salvataggio.");
      alert("Errore salvataggio: " + (err.message || "Impossibile salvare su Firestore."));
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!confirm("Sei sicuro di voler ripristinare il testo del Regolamento ai valori predefiniti?")) {
      return;
    }
    setEditorText(defaultText);
    if (isSuperAdmin) {
      setSaving(true);
      try {
        await saveRulesToCloud(defaultText, userEmail || "");
        alert("✅ Regolamento ripristinato e salvato su Firestore!");
      } catch (e: any) {
        alert("Errore durante il ripristino cloud: " + e.message);
      } finally {
        setSaving(false);
      }
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-100 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">📜</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Regolamento Ops! Storia • Live Editor
            </h2>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Modifica le sezioni del regolamento ([SCOPO], [TURNO], [TASTO_OPS], [TABELLONE], [MODALITA]). Si sincronizza in tempo reale su Firestore.
          </p>
        </div>

        <div>
          {isSuperAdmin ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Super-Admin Autenticato ({userEmail})
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
              <CloudUpload className="w-4 h-4 text-amber-600" />
              Cloud Sync ({SUPER_ADMIN_EMAIL})
            </span>
          )}
        </div>
      </div>

      {/* Editor Textarea */}
      <div className="mb-6">
        <textarea
          value={editorText}
          onChange={(e) => setEditorText(e.target.value)}
          rows={20}
          className="w-full p-4 sm:p-5 font-mono text-sm leading-relaxed bg-slate-900 text-slate-100 rounded-2xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-inner resize-y"
          placeholder="Inserisci il regolamento formattato con i tag di sezione [SCOPO], [TURNO], [TASTO_OPS], [TABELLONE], [MODALITA]..."
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-black uppercase tracking-wider transition-all shadow-md cursor-pointer ${
            success
              ? "bg-emerald-600 text-white shadow-emerald-200"
              : "bg-primary-500 hover:bg-primary-600 text-white shadow-primary-200 hover:-translate-y-0.5"
          } ${saving ? "opacity-75 cursor-not-allowed" : ""}`}
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              SALVATAGGIO...
            </>
          ) : success ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              SALVATO CON SUCCESSO!
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              SALVA REGOLAMENTO
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleReset}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-slate-500" />
          Ripristina Predefinito
        </button>
      </div>

      {errorMsg && (
        <p className="text-red-500 text-xs font-bold mt-3">⚠️ {errorMsg}</p>
      )}
    </div>
  );
}
