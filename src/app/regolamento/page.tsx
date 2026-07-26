import Link from "next/link";
import { ArrowLeft, BookOpen, CheckCircle, AlertOctagon, Timer, Flag } from "lucide-react";

export default function Regolamento() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="bg-white px-4 py-3 flex items-center justify-between shadow-sm sticky top-0 z-10 relative shrink-0">
        <div className="flex items-center space-x-2 sm:space-x-4 flex-1">
          <Link href="/" className="shrink-0 hover:scale-110 transition-transform">
            <img src="/ops-storia/icons/6.png" alt="Home" className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
          </Link>
          <img src="/ops-storia/images/logo.png" alt="Ops!" className="h-10 sm:h-14 object-contain shrink-0 hidden sm:block" />
        </div>
        
        <div className="flex items-center justify-center flex-1">
           <img src="/ops-storia/images/avatar.png" alt="Prof Memmo" className="h-12 sm:h-16 object-contain" />
        </div>

        <div className="font-black text-sm sm:text-xl text-primary-500 text-right flex-1 tracking-tight">REGOLAMENTO</div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto p-6 sm:p-12 w-full">
        <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-12 border border-slate-100">
          
          <div className="flex items-center mb-8 pb-6 border-b border-slate-100">
            <BookOpen className="w-12 h-12 text-primary-500 mr-4" />
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Come si gioca a Ops!</h1>
          </div>

          <div className="space-y-12">
            
            <section>
              <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-100 flex items-start space-x-4">
                <div className="bg-primary-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-black text-xl shrink-0">1</div>
                <p className="text-lg text-slate-600 leading-relaxed">
                Ops! è un gioco a squadre basato sulla comunicazione. Lo scopo è far indovinare ai propri compagni di squadra una parola segreta, indicata in grande sulla carta, senza MAI pronunciare nessuna delle 5 "parole vietate" elencate sotto di essa. Vince la squadra che porta la propria pedina per prima alla casella d'arrivo.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-black text-slate-800 mb-4 flex items-center">
                <Timer className="w-6 h-6 text-blue-500 mr-2" /> 2. Svolgimento del Turno
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-4">
                Ogni turno dura 60 secondi. Un giocatore (il "Suggeritore") prende il dispositivo e cerca di far indovinare più parole possibili alla sua squadra. 
              </p>
              <ul className="list-disc pl-6 space-y-2 text-lg text-slate-600 font-medium">
                <li><strong className="text-slate-800">Parola Indovinata:</strong> La squadra guadagna 1 punto e la pedina avanzerà di uno spazio sul tabellone.</li>
                <li><strong className="text-slate-800">Scarto:</strong> Se una parola è troppo difficile, il Suggeritore può scartarla. Si possono fare massimo 2 scarti per turno. Ogni scarto regala 1 punto alla squadra avversaria.</li>
              </ul>
            </section>

            <section>
              <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-100 flex items-start space-x-4">
                <div className="bg-primary-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-black text-xl shrink-0">3</div>
                <p className="text-lg text-slate-600 leading-relaxed">
                Durante il turno, un giocatore della squadra avversaria controllerà il proprio schermo. Se il Suggeritore pronuncia una parola Vietata, parte di essa, oppure gesticola, l'avversario premerà il grosso tasto <strong>OPS!</strong>. Questo blocca la carta attuale e regala immediatamente 1 punto agli avversari, rubandolo alla vostra squadra.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-black text-slate-800 mb-4 flex items-center">
                <CheckCircle className="w-6 h-6 text-purple-500 mr-2" /> 4. Il Tabellone e Caselle Speciali
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-4">
                Al termine dei 60 secondi, le pedine avanzano o retrocedono sul tabellone. Il percorso a serpentina contiene delle caselle speciali colorate che si attivano al turno successivo:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                  <h4 className="font-bold text-green-700 text-xl mb-1">Pesca Illimitata</h4>
                  <p className="text-green-600">Nel turno successivo la squadra può scartare infinite carte senza penalità o limiti.</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                  <h4 className="font-bold text-yellow-700 text-xl mb-1">Tempo Doppio</h4>
                  <p className="text-yellow-600">Nel turno successivo la squadra avrà ben 120 secondi a disposizione.</p>
                </div>
                <div className="bg-red-50 p-4 rounded-xl border border-red-200 md:col-span-2">
                  <h4 className="font-bold text-red-700 text-xl mb-1">Torna Indietro</h4>
                  <p className="text-red-600">Sfortuna! Se cadi qui la tua pedina retrocede immediatamente di 2 caselle.</p>
                </div>
              </div>
            </section>

          </div>
        </div>
      </main>
    </div>
  );
}
