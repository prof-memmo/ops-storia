"use client";

import { useState, useEffect } from "react";
import { 
  DEFAULT_OPS_MINIGUIDA, 
  SUPER_ADMIN_EMAIL, 
  saveMiniguidaToCloud, 
  useMiniguida,
  MiniguidaData,
  MiniguidaStep
} from "@/lib/miniguida-service";
import { 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  CloudUpload, 
  Loader2, 
  HelpCircle,
  Plus,
  Trash2,
  Info,
  AlertOctagon,
  SkipForward,
  Timer,
  MonitorPlay,
  Sparkles
} from "lucide-react";

interface MiniguidaEditorProps {
  userEmail?: string | null;
}

const ICON_MAP: Record<string, any> = {
  "info": Info,
  "alert-octagon": AlertOctagon,
  "skip-forward": SkipForward,
  "timer": Timer,
  "monitor-play": MonitorPlay,
  "sparkles": Sparkles,
  "help-circle": HelpCircle
};

export default function MiniguidaEditor({ userEmail }: MiniguidaEditorProps) {
  const { data, defaultData } = useMiniguida();
  const [formData, setFormData] = useState<MiniguidaData>(data);
  const [activePreviewStep, setActivePreviewStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const isSuperAdmin = (userEmail || "").toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();

  const handleStepChange = (index: number, field: keyof MiniguidaStep, value: string) => {
    const newSteps = [...formData.steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setFormData({ ...formData, steps: newSteps });
  };

  const handleAddStep = () => {
    const newStep: MiniguidaStep = {
      icon: "info",
      iconColor: "#5c67f2",
      title: `Nuovo Passaggio ${formData.steps.length + 1}`,
      desc: "Descrizione del nuovo passaggio..."
    };
    setFormData({ ...formData, steps: [...formData.steps, newStep] });
    setActivePreviewStep(formData.steps.length);
  };

  const handleRemoveStep = (index: number) => {
    if (formData.steps.length <= 1) {
      alert("La miniguida deve contenere almeno un passaggio.");
      return;
    }
    const newSteps = formData.steps.filter((_, i) => i !== index);
    setFormData({ ...formData, steps: newSteps });
    if (activePreviewStep >= newSteps.length) {
      setActivePreviewStep(Math.max(0, newSteps.length - 1));
    }
  };

  const handleSave = async () => {
    if (!isSuperAdmin) {
      alert(`⚠️ Permesso negato: solo il Super-Admin (${SUPER_ADMIN_EMAIL}) può salvare le modifiche su Firestore.`);
      return;
    }

    setSaving(true);
    setErrorMsg("");
    try {
      await saveMiniguidaToCloud(formData, userEmail || "");
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
    if (!confirm("Sei sicuro di voler ripristinare la Miniguida ai valori predefiniti?")) {
      return;
    }
    setFormData(defaultData);
    if (isSuperAdmin) {
      setSaving(true);
      try {
        await saveMiniguidaToCloud(defaultData, userEmail || "");
        alert("✅ Miniguida ripristinata e sincronizzata su Firestore!");
      } catch (e: any) {
        alert("Errore durante il ripristino cloud: " + e.message);
      } finally {
        setSaving(false);
      }
    }
  };

  const currentStep = formData.steps[activePreviewStep] || formData.steps[0];
  const StepIconComponent = ICON_MAP[currentStep?.icon] || Info;

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-100 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Miniguida Live Editor (In-Game)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Modifica Tutorial &amp; Miniguida Ops! Storia
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Modifica in tempo reale i passaggi, i titoli e le spiegazioni visualizzate nel popup tutorial per tutti gli studenti.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            onClick={handleReset}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all disabled:opacity-50"
            title="Ripristina ai valori predefiniti"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Predefiniti</span>
          </button>

          <button
            onClick={handleSave}
            disabled={saving || !isSuperAdmin}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white transition-all shadow-md active:scale-95 ${
              success
                ? "bg-emerald-600 shadow-emerald-200"
                : isSuperAdmin
                ? "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200"
                : "bg-slate-400 cursor-not-allowed"
            }`}
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Salvataggio...</span>
              </>
            ) : success ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Sincronizzato!</span>
              </>
            ) : (
              <>
                <CloudUpload className="w-4 h-4" />
                <span>Salva nel Cloud</span>
              </>
            )}
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
          {errorMsg}
        </div>
      )}

      {/* Grid: Left Editor - Right Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT: FORM CONTROLS (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
              Titolo Generale Modale
            </label>
            <input 
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                Passaggi ({formData.steps.length})
              </h3>
              <button
                type="button"
                onClick={handleAddStep}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg transition"
              >
                <Plus className="w-3.5 h-3.5" />
                Aggiungi Step
              </button>
            </div>

            {formData.steps.map((step, idx) => (
              <div 
                key={idx} 
                className={`p-4 rounded-2xl border transition-all ${
                  activePreviewStep === idx 
                    ? "bg-indigo-50/40 border-indigo-300 ring-2 ring-indigo-200" 
                    : "bg-white border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black text-indigo-600 bg-indigo-100 px-2.5 py-0.5 rounded-full">
                    Step {idx + 1}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActivePreviewStep(idx)}
                      className={`text-xs font-bold px-2.5 py-1 rounded-lg transition ${
                        activePreviewStep === idx ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {activePreviewStep === idx ? "In Anteprima" : "Vedi in Anteprima"}
                    </button>
                    {formData.steps.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveStep(idx)}
                        className="p-1 text-slate-400 hover:text-red-500 transition"
                        title="Elimina step"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Titolo Step</label>
                    <input 
                      type="text"
                      value={step.title}
                      onChange={(e) => handleStepChange(idx, "title", e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Icona</label>
                    <select
                      value={step.icon}
                      onChange={(e) => handleStepChange(idx, "icon", e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    >
                      <option value="info">Info</option>
                      <option value="alert-octagon">Attenzione (Alert)</option>
                      <option value="skip-forward">Scarto (Skip)</option>
                      <option value="timer">Timer</option>
                      <option value="monitor-play">Schermo / LIM</option>
                      <option value="sparkles">Speciale (Sparkles)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">
                    Spiegazione didattica (Supporta HTML: &lt;strong&gt;, &lt;span&gt;)
                  </label>
                  <textarea 
                    rows={3}
                    value={step.desc}
                    onChange={(e) => handleStepChange(idx, "desc", e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 font-mono leading-relaxed"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: LIVE RESPONSIVE PREVIEW (5 Cols) */}
        <div className="lg:col-span-5">
          <div className="sticky top-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                Live Preview in Gioco
              </span>
              <span className="text-xs font-bold text-slate-400">
                Step {activePreviewStep + 1} di {formData.steps.length}
              </span>
            </div>

            {/* Simulated Modal Box */}
            <div className="bg-slate-900/80 p-3 sm:p-4 rounded-3xl backdrop-blur-sm border border-slate-800 shadow-2xl">
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg flex flex-col sm:flex-row min-h-[380px]">
                {/* Avatar Prof. Memmo Full */}
                <div className="w-full sm:w-1/3 bg-slate-50 flex items-end justify-center pt-4 border-b sm:border-b-0 sm:border-r border-slate-100">
                  <img 
                    src="/assets/prof_memmo_full.jpg" 
                    onError={(e: any) => { e.currentTarget.src = "https://prof-memmo.github.io/prof-memmo-gestione-siti/shared/assets/branding/prof-memmo/prof-memmo-full.jpg"; }} 
                    alt="Prof Memmo" 
                    className="w-[120%] max-h-[220px] sm:max-h-[340px] object-contain mix-blend-multiply drop-shadow-md" 
                  />
                </div>

                {/* Modal Step Content */}
                <div className="w-full sm:w-2/3 p-4 sm:p-6 flex flex-col justify-between">
                  <div>
                    <h4 className="text-lg sm:text-xl font-black text-indigo-600 text-center uppercase tracking-tight pb-2 border-b-2 border-indigo-100 mb-4">
                      {formData.title}
                    </h4>

                    <div className="flex flex-col items-center text-center px-2 py-4">
                      <StepIconComponent 
                        className="w-12 h-12 mb-3 transition-transform hover:scale-110" 
                        style={{ color: currentStep?.iconColor || "#5c67f2" }} 
                      />
                      <h5 className="font-bold text-slate-800 text-sm mb-1">{currentStep?.title}</h5>
                      <div 
                        className="text-xs text-slate-600 leading-relaxed font-medium"
                        dangerouslySetInnerHTML={{ __html: currentStep?.desc || "" }}
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    {/* Dots */}
                    <div className="flex gap-1.5">
                      {formData.steps.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setActivePreviewStep(i)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            activePreviewStep === i ? "bg-indigo-600 w-4" : "bg-slate-200"
                          }`}
                        />
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => setActivePreviewStep((prev) => (prev + 1) % formData.steps.length)}
                      className="bg-indigo-600 text-white text-xs font-black px-4 py-2 rounded-lg hover:bg-indigo-700 transition shadow-sm"
                    >
                      {activePreviewStep === formData.steps.length - 1 ? (formData.finalButtonLabel || "HO CAPITO!") : (formData.buttonLabel || "AVANTI")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <p className="text-[11px] text-slate-400 text-center mt-2">
              💡 Le modifiche pubblicate saranno visibili istantaneamente a studenti e docenti.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
