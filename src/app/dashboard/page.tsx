"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { onAuthStateChanged, User, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import Link from "next/link";
import { LogOut, LayoutDashboard, Users, Clock, Settings } from "lucide-react";
import HostLogin from "@/components/HostLogin";

export default function TeacherDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const docRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          }
        } catch (e) {
          console.error("Error fetching user data", e);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <HostLogin onLoginSuccess={() => setLoading(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <img src="/ops-storia/icons/6.png" alt="Home" className="w-10 h-10 object-contain" />
            </Link>
            <h1 className="text-xl font-black text-slate-800 flex items-center gap-2">
              <LayoutDashboard className="w-6 h-6 text-primary-500" />
              DASHBOARD DOCENTE
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-bold text-slate-800">{userData?.nome || user.displayName}</p>
              <p className="text-xs text-slate-500">{userData?.scuola || "Docente"}</p>
            </div>
            <button 
              onClick={() => signOut(auth)}
              className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
              title="Esci"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Le Mie Classi</h3>
            <p className="text-slate-500 text-sm">Gestisci le squadre e monitora i punteggi dei tuoi studenti.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
              <Clock className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Storico Partite</h3>
            <p className="text-slate-500 text-sm">Rivedi i risultati delle partite passate e le statistiche.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4">
              <Settings className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Impostazioni</h3>
            <p className="text-slate-500 text-sm">Modifica il tuo profilo, la scuola e le preferenze account.</p>
          </motion.div>

        </div>

        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center">
          <img src="https://prof-memmo.github.io/prof-memmo-gestione-siti/shared/assets/branding/prof-memmo/prof-memmo-avatar.png" alt="Prof Memmo" className="w-32 h-32 mx-auto mb-4 opacity-50" />
          <h2 className="text-2xl font-black text-slate-300 mb-2">Sezione in costruzione</h2>
          <p className="text-slate-400 max-w-md mx-auto">
            Le funzionalità della dashboard docente saranno disponibili a breve.
            Potrai gestire le tue classi e le partite direttamente da qui.
          </p>
        </div>
      </main>
    </div>
  );
}
