# Regole Operative Fondamentali dell'Ecosistema Prof. Memmo

Queste regole sono vincolanti per qualsiasi operazione su tutti i repository e i siti dell'Ecosistema Prof. Memmo (L'Oratore, La Rotta degli Eroi, La Corte della Commedia, FantaLetteratura, Palestra di Riflessione, Ops! Storia, Hub Admin, Hub Vetrina, Supplenze App).

---

## 1. Zero Iniziative Arbitrarie (No Over-Engineering)
- L'assistente deve eseguire **esclusivamente e rigorosamente ciò che l'utente richiede in modo esplicito**.
- È severamente vietato aggiungere funzionalità, campi di testo, pulsanti, opzioni, modali o sezioni non richieste.
- Non eseguire refactoring non richiesti, non "migliorare" o "ripulire" codice funzionante di propria iniziativa.

## 2. Principio di Isolamento Chirurgico (Non toccare ciò che funziona)
- Se una sezione, file o funzione è già stabile e funzionante, **è vietato aprirla, re-impaginarla o rinominarne le classi CSS/HTML**.
- Ogni modifica deve toccare solo ed esclusivamente il punto esatto richiesto.
- Se una classe CSS o un tag HTML funziona, non va rinominato o alterato.

## 3. Rispetto Assoluto della Modalità "READ ONLY"
- Quando l'utente specifica `read only` o `solo analisi`, l'assistente **non deve modificare alcun file**, non deve eseguire comandi distruttivi o di scrittura, non deve fare commit né push. Si eseguono solo analisi, letture e report.

## 4. Regola di Rilascio: Esclusivamente su `preview`
- **MAI eseguire `git push` sul branch `main`**.
- Tutti i commit e push devono essere indirizzati **esclusivamente al branch `preview`**.
- Il passaggio a `main` (produzione) spetta unicamente all'utente dal pannello Rilasci dell'Hub Admin.

## 5. Controllo di Coerenza Preventivo (Anti-Regressione)
Prima di dichiarare completata qualsiasi modifica:
- **Verifica HTML ↔ CSS**: Ogni classe usata nell'HTML deve esistere nel foglio di stile CSS.
- **Integrità Dati & Metodi**: Nessuna funzione JS preesistente deve essere rimossa o alterata, nessun file JSON di dati (carte, domande) deve essere troncato o corrotto.
- **Cache Busting**: Aggiornare sempre la versione nei link CSS/JS (es. `style.css?v=YYYYMMDD_...`).

## 6. Trasparenza del Diff Minimo
- L'assistente deve mostrare con precisione i file toccati e le righe modificate, garantendo che non siano stati toccati file estranei al compito.
