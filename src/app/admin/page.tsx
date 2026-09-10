"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, User, signOut } from "firebase/auth";
import { auth, hubDb } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import { 
  LogOut, 
  ShieldCheck, 
  Search, 
  Plus, 
  FileText, 
  Download, 
  Upload, 
  Edit3, 
  Trash2, 
  Layers, 
  BookOpen, 
  Sparkles,
  ArrowLeft,
  X,
  Check
} from "lucide-react";
import HostLogin from "@/components/HostLogin";
import Header from "@/components/Header";

import cardsPrima from "@/../public/data/cards_prima.json";
import cardsSeconda from "@/../public/data/cards_seconda.json";
import cardsTerza from "@/../public/data/cards_terza.json";

interface CardItem {
  id: string;
  classe: "Prima" | "Seconda" | "Terza";
  categoria: string;
  parola_chiave: string;
  parole_taboo: string[];
}

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAllowed, setIsAllowed] = useState(true);

  // Dati Carte per le 3 classi
  const [activeTab, setActiveTab] = useState<"Prima" | "Seconda" | "Terza">("Prima");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const [cardsMap, setCardsMap] = useState<Record<string, CardItem[]>>({
    Prima: cardsPrima as CardItem[],
    Seconda: cardsSeconda as CardItem[],
    Terza: cardsTerza as CardItem[]
  });

  // Modal Editing & Bulk Import
  const [editingCard, setEditingCard] = useState<CardItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkText, setBulkText] = useState("");
  const [bulkMessage, setBulkMessage] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const isSuperAdmin = currentUser.email?.toLowerCase() === "prof.memmo@gmail.com";
        if (typeof window !== "undefined" && (window as any).HubSubscriptionGuard) {
          const allowed = await (window as any).HubSubscriptionGuard.verifyAccess({
            user: { uid: currentUser.uid, email: currentUser.email },
            role: "admin",
            isPublicView: false
          });
          setIsAllowed(allowed);
        }

        try {
          let hasAdminRole = isSuperAdmin;
          try {
            const docRef = doc(hubDb, "hub_users", currentUser.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists() && (docSnap.data().ruolo === "admin" || docSnap.data().role === "admin")) {
              hasAdminRole = true;
            }
          } catch (err) {}

          setIsAdmin(isSuperAdmin || hasAdminRole);
        } catch (e) {
          setIsAdmin(isSuperAdmin);
        }
      }
      setLoading(false);
    });

    // Carica eventuali modifiche salvate in localStorage
    const saved = localStorage.getItem("ops_storia_custom_cards");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCardsMap(parsed);
      } catch (err) {}
    }

    return () => unsubscribe();
  }, []);

  const saveToStorage = (updatedMap: Record<string, CardItem[]>) => {
    setCardsMap(updatedMap);
    localStorage.setItem("ops_storia_custom_cards", JSON.stringify(updatedMap));
  };

  const handleSaveCard = (card: CardItem) => {
    const currentList = [...cardsMap[card.classe]];
    const idx = currentList.findIndex(c => c.id === card.id);
    if (idx >= 0) {
      currentList[idx] = card;
    } else {
      currentList.unshift(card);
    }
    const newMap = { ...cardsMap, [card.classe]: currentList };
    saveToStorage(newMap);
    setEditingCard(null);
    setShowAddModal(false);
  };

  const handleDeleteCard = (cardId: string, classe: "Prima" | "Seconda" | "Terza") => {
    if (confirm("Sei sicuro di voler eliminare questa carta?")) {
      const currentList = cardsMap[classe].filter(c => c.id !== cardId);
      const newMap = { ...cardsMap, [classe]: currentList };
      saveToStorage(newMap);
    }
  };

  const handleBulkImport = () => {
    if (!bulkText.trim()) return;
    const lines = bulkText.split("\n").map(l => l.trim()).filter(Boolean);
    const newCards: CardItem[] = [];
    let currentCard: Partial<CardItem> | null = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // Riconosce nuovo elemento numerato es. "1. Napoleone" o "1) Carlo Magno"
      const numMatch = line.match(/^(\d+)[\.\)]\s*(.+)/i);
      if (numMatch) {
        if (currentCard && currentCard.parola_chiave && currentCard.parole_taboo?.length) {
          newCards.push(currentCard as CardItem);
        }
        currentCard = {
          id: `${activeTab}_custom_${Date.now()}_${i}`,
          classe: activeTab,
          categoria: selectedCategory !== "ALL" ? selectedCategory : "Età Medievale",
          parola_chiave: numMatch[2].trim(),
          parole_taboo: []
        };
      } else if (line.toLowerCase().startsWith("taboo:") || line.toLowerCase().startsWith("vietate:") || line.toLowerCase().startsWith("parole:")) {
        const words = line.replace(/^(taboo|vietate|parole):\s*/i, "").split(/[,;-]/).map(w => w.trim()).filter(Boolean);
        if (currentCard) currentCard.parole_taboo = words;
      } else if (line.toLowerCase().startsWith("categoria:") || line.toLowerCase().startsWith("tema:")) {
        if (currentCard) currentCard.categoria = line.replace(/^(categoria|tema):\s*/i, "").trim();
      } else if (currentCard && (!currentCard.parole_taboo || currentCard.parole_taboo.length < 5)) {
        const words = line.split(/[,;-]/).map(w => w.trim()).filter(Boolean);
        currentCard.parole_taboo = [...(currentCard.parole_taboo || []), ...words].slice(0, 5);
      }
    }

    if (currentCard && currentCard.parola_chiave && currentCard.parole_taboo?.length) {
      newCards.push(currentCard as CardItem);
    }

    if (newCards.length > 0) {
      const updatedList = [...newCards, ...cardsMap[activeTab]];
      const newMap = { ...cardsMap, [activeTab]: updatedList };
      saveToStorage(newMap);
      setBulkMessage(`✅ Importate con successo ${newCards.length} carte in ${activeTab} Media!`);
      setBulkText("");
      setTimeout(() => {
        setBulkMessage("");
        setShowBulkModal(false);
      }, 2000);
    } else {
      setBulkMessage("⚠️ Nessuna carta valida riconosciuta. Formato: 1. Parola Chiave / Taboo: p1, p2, p3, p4, p5");
    }
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(cardsMap, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `ops_storia_cards_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <HostLogin onLoginSuccess={() => setLoading(false)} title="Pannello Amministrazione Ops! Storia" description="Accesso riservato all'amministratore per la gestione delle 390 carte didattiche." />
      </div>
    );
  }

  const currentCards = cardsMap[activeTab] || [];
  const categories = Array.from(new Set(currentCards.map(c => c.categoria))).filter(Boolean);

  const filteredCards = currentCards.filter(c => {
    const matchesSearch = c.parola_chiave.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.parole_taboo.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "ALL" || c.categoria === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalCardsCount = (cardsMap.Prima?.length || 0) + (cardsMap.Seconda?.length || 0) + (cardsMap.Terza?.length || 0);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              Centrale Didattica Ops! Storia
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Gestione Database & Carte (390 Totali)
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Catalogo, modifica in tempo reale e importazione massiva delle parole chiave e dei termini taboo.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-4 py-2.5 rounded-2xl shadow-sm hover:shadow transition-all text-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Aggiungi Carta
            </button>
            <button
              onClick={() => setShowBulkModal(true)}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold px-4 py-2.5 rounded-2xl shadow-sm hover:shadow transition-all text-sm cursor-pointer"
            >
              <Sparkles className="w-4 h-4" /> Importa da Word
            </button>
            <button
              onClick={handleExportJSON}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white font-bold px-4 py-2.5 rounded-2xl shadow-sm hover:shadow transition-all text-sm cursor-pointer"
              title="Esporta Backup JSON"
            >
              <Download className="w-4 h-4" /> Esporta Backup
            </button>
          </div>
        </div>

        {/* Tab Scelta Anno / Classe */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2 sm:gap-3 bg-slate-200/60 p-1.5 rounded-2xl">
            {(["Prima", "Seconda", "Terza"] as const).map(classe => {
              const count = cardsMap[classe]?.length || 0;
              const isActive = activeTab === classe;
              const label = classe === "Prima" ? "🐣 1ª Media (Medioevo)" : classe === "Seconda" ? "🌿 2ª Media (Età Moderna)" : "🏛️ 3ª Media (Contemporanea)";
              return (
                <button
                  key={classe}
                  onClick={() => { setActiveTab(classe); setSelectedCategory("ALL"); }}
                  className={`px-4 sm:px-6 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 ${
                    isActive 
                      ? "bg-white text-slate-900 shadow-md scale-102" 
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                  }`}
                >
                  <span>{label}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${isActive ? "bg-amber-400 text-slate-900 font-black" : "bg-slate-300 text-slate-700"}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="text-xs font-bold text-slate-500">
            Database complessivo: <span className="text-slate-900 font-black">{totalCardsCount}</span> carte
          </div>
        </div>

        {/* Filtri e Barra di Ricerca */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Cerca parola chiave o taboo..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-bold text-slate-500 shrink-0">Categoria:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:w-auto bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <option value="ALL">Tutte le Categorie ({categories.length})</option>
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Griglia Carte della Classe */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredCards.map((card, idx) => (
            <div 
              key={card.id || idx}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-slate-200 overflow-hidden transition-all flex flex-col justify-between group"
            >
              {/* Card Header */}
              <div className="p-4 border-b border-slate-100 flex items-start justify-between gap-2 bg-slate-50/50">
                <span className="text-[10px] font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full uppercase tracking-wider truncate max-w-[170px]">
                  {card.categoria || "Storia"}
                </span>
                <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                  <button
                    onClick={() => setEditingCard(card)}
                    className="p-1.5 hover:bg-amber-100 text-amber-700 rounded-lg transition-colors"
                    title="Modifica Carta"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteCard(card.id, card.classe)}
                    className="p-1.5 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                    title="Elimina Carta"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Card Body: Parola Chiave */}
              <div className="p-4 text-center">
                <h3 className="text-xl font-black text-slate-900 mb-3 tracking-tight">
                  {card.parola_chiave}
                </h3>

                {/* 5 Parole Taboo */}
                <div className="space-y-1.5">
                  <div className="text-[9px] font-black uppercase text-red-500 tracking-widest mb-1 flex items-center justify-center gap-1">
                    <span>🚫 5 Parole Taboo</span>
                  </div>
                  {card.parole_taboo?.map((taboo, tIdx) => (
                    <div 
                      key={tIdx}
                      className="text-xs font-bold text-slate-700 bg-slate-100 py-1 px-2.5 rounded-lg border border-slate-200/60"
                    >
                      {taboo}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
                <span className="text-[10px] font-bold text-slate-400">ID: {card.id}</span>
              </div>
            </div>
          ))}
        </div>

        {filteredCards.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
            <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-700">Nessuna carta trovata</h3>
            <p className="text-slate-400 text-xs mt-1">Prova a modificare i termini di ricerca o la categoria selezionata.</p>
          </div>
        )}

      </main>

      {/* Modal Modifica Carta */}
      {editingCard && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-500" /> Modifica Carta
              </h3>
              <button onClick={() => setEditingCard(null)} className="p-1 text-slate-400 hover:text-slate-600 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSaveCard(editingCard); }} className="space-y-4 text-sm font-bold">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Classe / Livello</label>
                <select
                  value={editingCard.classe}
                  onChange={(e) => setEditingCard({ ...editingCard, classe: e.target.value as any })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-800"
                >
                  <option value="Prima">1ª Media (Medioevo)</option>
                  <option value="Seconda">2ª Media (Moderna)</option>
                  <option value="Terza">3ª Media (Contemporanea)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-500 mb-1">Categoria Tematica</label>
                <input 
                  type="text"
                  value={editingCard.categoria}
                  onChange={(e) => setEditingCard({ ...editingCard, categoria: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-slate-500 mb-1">Parola Chiave (Da Indovinare)</label>
                <input 
                  type="text"
                  value={editingCard.parola_chiave}
                  onChange={(e) => setEditingCard({ ...editingCard, parola_chiave: e.target.value })}
                  className="w-full bg-slate-50 border-2 border-amber-400 rounded-xl p-2.5 font-black text-slate-900 text-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-red-500 mb-1 font-black">5 Parole Taboo (Vietate)</label>
                <div className="space-y-2">
                  {[0, 1, 2, 3, 4].map(idx => (
                    <input
                      key={idx}
                      type="text"
                      placeholder={`Parola Taboo #${idx + 1}`}
                      value={editingCard.parole_taboo[idx] || ""}
                      onChange={(e) => {
                        const nextTaboos = [...(editingCard.parole_taboo || [])];
                        nextTaboos[idx] = e.target.value;
                        setEditingCard({ ...editingCard, parole_taboo: nextTaboos });
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-medium text-slate-800 text-xs"
                      required
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingCard(null)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black shadow-md flex items-center gap-2"
                >
                  <Check className="w-4 h-4" /> Salva Modifiche
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Aggiungi Nuova Carta */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-500" /> Aggiungi Nuova Carta Didattica
              </h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form 
              onSubmit={(e) => { 
                e.preventDefault(); 
                const form = e.currentTarget as any;
                const newC: CardItem = {
                  id: `${form.classe.value}_${Date.now()}`,
                  classe: form.classe.value,
                  categoria: form.categoria.value,
                  parola_chiave: form.parola_chiave.value,
                  parole_taboo: [
                    form.taboo0.value,
                    form.taboo1.value,
                    form.taboo2.value,
                    form.taboo3.value,
                    form.taboo4.value,
                  ]
                };
                handleSaveCard(newC);
              }} 
              className="space-y-4 text-sm font-bold"
            >
              <div>
                <label className="block text-xs text-slate-500 mb-1">Classe</label>
                <select name="classe" defaultValue={activeTab} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-800">
                  <option value="Prima">1ª Media (Medioevo)</option>
                  <option value="Seconda">2ª Media (Moderna)</option>
                  <option value="Terza">3ª Media (Contemporanea)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-500 mb-1">Categoria Tematica</label>
                <input name="categoria" placeholder="Es. L'Età dei Comuni" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-800" required />
              </div>

              <div>
                <label className="block text-xs text-slate-500 mb-1">Parola Chiave</label>
                <input name="parola_chiave" placeholder="Es. Feudatario" className="w-full bg-slate-50 border-2 border-emerald-400 rounded-xl p-2.5 font-black text-slate-900 text-lg" required />
              </div>

              <div>
                <label className="block text-xs text-red-500 mb-1 font-black">5 Parole Taboo</label>
                <div className="space-y-2">
                  {[0, 1, 2, 3, 4].map(idx => (
                    <input key={idx} name={`taboo${idx}`} placeholder={`Taboo #${idx + 1}`} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-medium text-slate-800 text-xs" required />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50">Annulla</button>
                <button type="submit" className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black shadow-md flex items-center gap-2">
                  <Check className="w-4 h-4" /> Crea Carta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Bulk Import da Word */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full p-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" /> Caricamento Massivo da Testo (Word / Excel)
              </h3>
              <button onClick={() => setShowBulkModal(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 mb-3 leading-relaxed">
              Incolla qui direttamente l'elenco numerato dal tuo foglio Word. Il parser riconosce automaticamente la parola chiave e i 5 termini taboo per la classe <strong>{activeTab} Media</strong>.
            </p>

            <textarea 
              rows={10} 
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              placeholder="1. Carlo Magno&#10;Categoria: Sacro Romano Impero&#10;Taboo: Imperatore, Notte di Natale, Aquisgrana, Papa, Franchi&#10;&#10;2. Crociate&#10;Categoria: Medioevo&#10;Taboo: Gerusalemme, Terra Santa, Cavalieri, Papa Urbano, Musulmani"
              className="w-full p-3 bg-slate-900 text-amber-300 font-mono text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-400 leading-relaxed mb-3"
            />

            {bulkMessage && (
              <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold rounded-xl mb-3">
                {bulkMessage}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowBulkModal(false)} className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold">Chiudi</button>
              <button type="button" onClick={handleBulkImport} className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black shadow-md flex items-center gap-2 text-xs">
                <Sparkles className="w-4 h-4" /> Analizza & Importa Carte
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
