# PDF Report Service

Tento projekt je malý backend server, ktorý prijíma HTML a generuje z neho PDF súbor.  
PDF sa ukladá do **Supabase Storage** a vracia sa URL pre stiahnutie.

---

## 🧱 Požiadavky

- Supabase účet / projekt
- Railway účet
- Node.js (lokálne pre testovanie)

---

## 📌 1) Nastavenie Supabase

1. Prihlás sa na https://supabase.com
2. Vytvor nový projekt
3. Choď do **Storage** → **Create new bucket**
   - Názov: `reports`
   - Public: **OFF**
4. V **Settings → API** si skopíruj:
   - `SUPABASE_URL`
   - `anon` a hlavne `service_role` kľúč
5. Vytvor `.env` podľa `.env.example` a vlož tam tieto hodnoty

---

## 📌 2) Deploy backend na Railway

1. Vytvor si nový GitHub repozitár a nahraj tento projekt
2. Choď na https://railway.app
3. **New Project → Deploy from GitHub**
4. Vyber svoj repozitár
5. V Railway **Settings → Variables**
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
6. Deploy a počkaj kým sa projekt spustí
7. Railway ti dá URL služby (napr. `https://xyz.up.railway.app`)

---

## 📌 3) Volanie služby z frontend

Po generovaní textu z OpenAI posli toto:

```js
await fetch("https://<railway-url>/generate-pdf", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    html: "<html>…</html>",
    filename: "my-report.pdf"
  })
});
