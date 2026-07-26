"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { onAuthStateChanged, User, signOut } from "firebase/auth";
import { doc, getDoc, collection, getDocs, query, orderBy } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import Link from "next/link";
import { LogOut, ShieldCheck, Users, Gamepad2, Activity, Search } from "lucide-react";
import HostLogin from "@/components/HostLogin";

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const docRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(docRef);
          
          // Check if admin (prof.memmo@gmail.com or ruolo === 'admin')
          if (docSnap.exists() && (currentUser.email === "prof.memmo@gmail.com" || docSnap.data().ruolo === "admin")) {
            setUserData(docSnap.data());
            setIsAdmin(true);
            loadUsers();
          } else {
            setIsAdmin(false);
          }
        } catch (e) {
          console.error("Error fetching user data", e);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loadUsers = async () => {
    try {
      const q = query(collection(db, "users"));
      const querySnapshot = await getDocs(q);
      const usersList: any[] = [];
      querySnapshot.forEach((doc) => {
        usersList.push({ id: doc.id, ...doc.data() });
      });
      // Sort by creation date descending client-side
      usersList.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
      setAllUsers(usersList);
    } catch (e) {
      console.error("Error loading users", e);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
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

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <ShieldCheck className="w-24 h-24 text-slate-300 mb-4" />
        <h2 className="text-2xl font-black text-slate-700 mb-2">Accesso Negato</h2>
        <p className="text-slate-500 mb-6 text-center max-w-sm">
          Non hai i permessi di amministratore per visualizzare questa pagina.
        </p>
        <Link href="/" className="bg-primary-500 text-white px-6 py-2 rounded-xl font-bold hover:bg-primary-600 transition-colors">
          Torna alla Home
        </Link>
      </div>
    );
  }

  const filteredUsers = allUsers.filter(u => 
    u.nome?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.cognome?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.scuola?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-30 border-b border-red-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <img src="/ops-storia/icons/6.png" alt="Home" className="w-10 h-10 object-contain" />
            </Link>
            <h1 className="text-xl font-black text-red-600 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6" />
              PANNELLO ADMIN
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
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
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase">Totale Utenti</p>
              <p className="text-2xl font-black text-slate-800">{allUsers.length}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase">Docenti</p>
              <p className="text-2xl font-black text-slate-800">
                {allUsers.filter(u => u.ruolo === 'docente').length}
              </p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 opacity-50">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center shrink-0">
              <Gamepad2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase">Partite Attive</p>
              <p className="text-2xl font-black text-slate-800">-</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 opacity-50">
            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center shrink-0">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase">Stanze Gioco</p>
              <p className="text-2xl font-black text-slate-800">-</p>
            </div>
          </div>
        </div>

        {/* Users List */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h2 className="text-lg font-bold text-slate-800">Elenco Utenti Iscritti</h2>
            <div className="relative w-full sm:w-64">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Cerca utente..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-bold">
                  <th className="p-4">Utente</th>
                  <th className="p-4 hidden sm:table-cell">Contatti</th>
                  <th className="p-4 hidden md:table-cell">Scuola / Città</th>
                  <th className="p-4">Ruolo</th>
                  <th className="p-4 hidden lg:table-cell">Iscrizione</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400 italic">
                      Nessun utente trovato.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-slate-800">{u.nome} {u.cognome}</div>
                        <div className="text-xs text-slate-500 sm:hidden mt-1">{u.email}</div>
                      </td>
                      <td className="p-4 hidden sm:table-cell">
                        <a href={`mailto:${u.email}`} className="text-primary-600 hover:underline text-sm">{u.email}</a>
                      </td>
                      <td className="p-4 hidden md:table-cell text-sm text-slate-600">
                        {u.scuola}
                        {u.citta && <span className="text-slate-400 block text-xs">{u.citta}</span>}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase ${
                          u.ruolo === 'admin' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {u.ruolo || 'docente'}
                        </span>
                      </td>
                      <td className="p-4 hidden lg:table-cell text-xs text-slate-400">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit' }) : 'N/D'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
