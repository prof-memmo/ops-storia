"use client";

import { useState } from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, googleProvider, db } from "@/lib/firebase";
import { BookOpen, LogIn, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

import { User } from "firebase/auth";

export default function HostLogin({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [tempUser, setTempUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    cognome: "",
    scuola: "",
    citta: ""
  });

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if user exists in Firestore, if not create them
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);

      if (!docSnap.exists()) {
        setTempUser(user);
        setNeedsOnboarding(true);
        setFormData(prev => ({ ...prev, nome: user.displayName || "" }));
        return;
      }

      onLoginSuccess();
    } catch (err: any) {
      console.error("Login error:", err);
      setError("Errore durante l'accesso. Riprova.");
    } finally {
      setLoading(false);
    }
  };

  const handleOnboardingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempUser) return;
    
    setLoading(true);
    try {
      const userRef = doc(db, "users", tempUser.uid);
      await setDoc(userRef, {
        nome: formData.nome,
        cognome: formData.cognome,
        scuola: formData.scuola,
        citta: formData.citta,
        email: tempUser.email,
        ruolo: "docente",
        createdAt: new Date().toISOString(),
        gioco: "Ops! Operazione Storia"
      }, { merge: true });
      
      try {
        const { collection, addDoc, serverTimestamp } = await import("firebase/firestore");
        const { hubDb } = await import("@/lib/firebase");
        await addDoc(collection(hubDb, "hub_posta_inviata"), {
          destinatarioEmail: tempUser.email,
          destinatarioNome: formData.nome,
          gioco: "Ops! Operazione Storia",
          oggetto: "✅ Benvenuto in Ops! Operazione Storia",
          timestamp: serverTimestamp()
        });
      } catch (e) {
        console.warn("Errore invio mail hub:", e);
      }
      
      onLoginSuccess();
    } catch (err) {
      console.error("Onboarding error:", err);
      setError("Errore durante la registrazione. Riprova.");
    } finally {
      setLoading(false);
    }
  };

  if (needsOnboarding) {
    return (
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-slate-100 mx-auto mt-12">
        <h2 className="text-3xl font-black text-primary-500 mb-2 text-center">Benvenuto!</h2>
        <p className="text-slate-500 font-medium mb-6 text-center">
          Sembra che sia la tua prima volta qui. Completa il tuo profilo docente per continuare.
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 flex items-center justify-center font-bold">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        <form onSubmit={handleOnboardingSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Nome</label>
            <input required type="text" value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-primary-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Cognome</label>
            <input required type="text" value={formData.cognome} onChange={e => setFormData({...formData, cognome: e.target.value})} className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-primary-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Scuola</label>
            <input required type="text" value={formData.scuola} onChange={e => setFormData({...formData, scuola: e.target.value})} className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-primary-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Città</label>
            <input required type="text" value={formData.citta} onChange={e => setFormData({...formData, citta: e.target.value})} className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-primary-500 outline-none" />
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 text-white py-4 rounded-xl font-black text-xl shadow-lg mt-4 hover:bg-emerald-600 active:scale-95 transition-all"
          >
            {loading ? "Salvataggio..." : "Salva e Inizia"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 text-center border border-slate-100 mx-auto mt-12">
      <BookOpen className="w-12 h-12 text-primary-500 mx-auto mb-4" />
      <h2 className="text-3xl font-black text-slate-900 mb-2">Accesso Docenti</h2>
      <p className="text-slate-500 font-medium mb-8">
        Per creare una stanza e avviare una partita, è necessario effettuare l'accesso.
      </p>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 flex items-center justify-center font-bold">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      <button 
        onClick={handleGoogleLogin} 
        disabled={loading}
        className="w-full bg-primary-500 text-white py-4 rounded-xl font-black text-xl shadow-lg active:scale-95 transition-all flex items-center justify-center disabled:opacity-70"
      >
        <LogIn className="w-6 h-6 mr-3" />
        {loading ? "Accesso in corso..." : "Accedi con Google"}
      </button>
    </div>
  );
}
