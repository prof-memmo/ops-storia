"use client";

import { useState } from "react";
import Link from "next/link";
import { LogIn, GraduationCap, ShieldCheck, Compass, ArrowLeft } from "lucide-react";

type Role = "studente" | "docente" | "esploratore" | "admin" | null;

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<Role>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Accesso in corso come ${selectedRole}...`);
  };

  const roles = [
    { id: "studente", name: "Studente", icon: <GraduationCap className="w-8 h-8" />, desc: "Accedi con il codice della tua classe", color: "text-blue-500" },
    { id: "esploratore", name: "Esploratore del Tempo", icon: <Compass className="w-8 h-8" />, desc: "Gioca liberamente da esterno", color: "text-amber-500" },
    { id: "docente", name: "Docente", icon: <LogIn className="w-8 h-8" />, desc: "Gestisci le classi e avvia partite", color: "text-emerald-500" },
    { id: "admin", name: "Admin", icon: <ShieldCheck className="w-8 h-8" />, desc: "Amministrazione piattaforma", color: "text-purple-500" },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-6 text-slate-900">
      
      <div className="w-full max-w-4xl flex justify-between items-center py-6 border-b border-slate-100 mb-10">
        <Link href="/" className="flex items-center text-primary-500 font-bold hover:underline">
          <ArrowLeft className="w-5 h-5 mr-2" /> Torna alla Home
        </Link>
        <img src="/images/logo.png" alt="Ops Logo" className="h-12 object-contain" />
      </div>

      <div className="w-full max-w-4xl flex flex-col md:flex-row gap-12">
        
        {/* Left Side: Roles */}
        <div className="md:w-1/2 flex flex-col justify-center">
          <h2 className="text-4xl font-extrabold text-primary-500 mb-2">Benvenuto in Ops!</h2>
          <p className="text-xl text-slate-500 mb-8">Seleziona il tuo ruolo per continuare.</p>
          
          <div className="flex flex-col gap-4">
            {roles.map(role => (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id as Role)}
                className={`flex items-center p-4 rounded-xl transition-all border-l-4 ${
                  selectedRole === role.id 
                    ? `border-primary-500 bg-primary-50 font-bold` 
                    : "border-transparent bg-slate-50 hover:bg-slate-100"
                }`}
              >
                <div className={`${role.color} mr-4`}>
                  {role.icon}
                </div>
                <div className="text-left">
                  <h3 className="text-lg">{role.name}</h3>
                  <p className="text-sm text-slate-500 font-normal">{role.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:w-1/2 flex flex-col justify-center">
          {!selectedRole ? (
            <div className="flex flex-col items-center justify-center h-full text-center opacity-30 py-20">
              <Compass className="w-24 h-24 mb-6 text-slate-400" />
              <h3 className="text-2xl font-semibold text-slate-500">Seleziona un profilo</h3>
            </div>
          ) : (
            <div className="w-full">
              <h3 className="text-3xl font-extrabold text-slate-800 mb-8 capitalize">
                Accesso {selectedRole}
              </h3>
              
              <form onSubmit={handleLogin} className="space-y-6">
                {selectedRole === "studente" ? (
                  <>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Codice Partita</label>
                      <input 
                        type="text" 
                        placeholder="Es. 84A2-99B"
                        className="w-full px-4 py-4 rounded-xl bg-slate-50 text-slate-900 border-2 border-slate-200 focus:border-primary-500 outline-none uppercase font-mono tracking-widest text-xl transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Scegli la tua Pedina</label>
                      <div className="grid grid-cols-4 gap-3">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                          <button
                            key={num}
                            type="button"
                            className="p-2 rounded-xl border-2 border-slate-100 hover:border-primary-300 focus:border-primary-500 focus:bg-primary-50 transition-all aspect-square flex items-center justify-center"
                          >
                            <img src={`/images/pedine_page_${num}.png`} className="w-full h-full object-contain drop-shadow-md" alt={`Pedina ${num}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tua@email.com"
                        className="w-full px-4 py-4 rounded-xl bg-slate-50 text-slate-900 border-2 border-slate-200 focus:border-primary-500 outline-none transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
                      <input 
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-4 rounded-xl bg-slate-50 text-slate-900 border-2 border-slate-200 focus:border-primary-500 outline-none transition-colors"
                        required
                      />
                    </div>
                  </>
                )}
                
                <button 
                  type="submit"
                  className="w-full bg-primary-500 hover:bg-primary-600 text-white font-extrabold py-4 rounded-full text-lg transition-colors mt-8"
                >
                  {selectedRole === "studente" ? "Entra in Partita" : "Accedi"}
                </button>
              </form>

              {selectedRole === "esploratore" && (
                <p className="mt-8 text-center text-slate-500">
                  Non hai un account? <span className="text-primary-500 font-bold hover:underline cursor-pointer">Registrati ora</span>
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
