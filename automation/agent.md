# agent.md — automation/ (cmspush2)

> Note operative per Claude su come pubblicare ARTICOLI e PRODOTTI in automatico su cmspush2.
> Leggere questo file PRIMA di ogni pubblicazione. File controllore/madre del progetto: `..\.claude.md`.

---

## Cos'e

Motore Python unico e stabile per pubblicare contenuti su cmspush2 (sito Jekyll + GitHub Pages)
senza riscrivere ogni volta slug, front-matter, git add/commit/push da zero.

**File**: `automation\publish.py`
**Funzioni**: `pubblica_articolo(...)` e `pubblica_prodotto(...)`

Confermato funzionante (test 2026-07-04):
- Articolo: "Enrico Fermi: il fisico che divise l'atomo e la storia" -> `_posts\2026-07-04-enrico-fermi-il-fisico-che-divise-l-atomo-e-la-storia.md`
- Prodotto: "Mazzo di Carte Magiche Pro" -> `_products\mazzo-di-carte-magiche-pro.md`
Entrambi pubblicati e pushati con successo, build GitHub Pages verificata.

---

## Come usarlo (SEMPRE questo workflow, nessuna eccezione)

Claude deve fare SOLO 2 cose per ogni contenuto: 1) generare il testo (ricerca web se serve), 2) chiamare la funzione giusta. Tutto il resto (slug, file, git) e' automatico.

### Per un ARTICOLO
```python
import sys
sys.path.insert(0, r"C:\Users\mirco\Desktop\cmspush2\automation")
from publish import pubblica_articolo

pubblica_articolo(
    titolo="Titolo Articolo",
    categoria="tecnica",          # vedi _data/categorie.json per categorie esistenti
    excerpt="Riassunto breve 1-2 frasi.",
    corpo="Testo in markdown, con ## sottotitoli e **grassetti**...",
)
```
Genera `_posts\YYYY-MM-DD-slug-titolo.md` con front-matter pulito (layout: single, title, date, excerpt, categories), fa commit+push automatico.

⚠️ **URL pubblico articolo** — questo sito ha `permalink: /:categories/:title/` in `_config.yml` (NON lo schema Jekyll di default `/YYYY/MM/DD/title.html`). L'URL corretto e' sempre:
```
https://cialdecompatibili-netizen.github.io/cmspush2/{categoria}/{slug-titolo}/
```
Esempio: categoria "tecnica", titolo "Enrico Fermi..." -> `https://cialdecompatibili-netizen.github.io/cmspush2/tecnica/enrico-fermi-il-fisico-che-divise-l-atomo-e-la-storia/`
NON usare mai lo schema data (`/2026/07/04/...html`) per questo progetto — da 404. Verificare sempre `_config.yml` (chiave `permalink`) prima di comunicare un link a Mirco.

### Per un PRODOTTO
```python
import sys
sys.path.insert(0, r"C:\Users\mirco\Desktop\cmspush2\automation")
from publish import pubblica_prodotto

pubblica_prodotto(
    nome="Nome Prodotto",
    prezzo="24.90",
    categoria="abbigliamento",    # vedi _data/shop-categorie.json per categorie esistenti
    sku="COD-001",
    descrizione="Descrizione breve per schede/anteprima.",
    corpo="Testo lungo in markdown per la scheda prodotto...",
    image="https://...",          # opzionale
    stock=20,                     # opzionale, default 20
    badge="Bestseller",           # opzionale
    price_original="34.90",       # opzionale, mostra sconto
    colors="Bianco, Nero",        # opzionale
    sizes="S, M, L, XL",          # opzionale
    shipping="Spedizione gratuita sopra 35 euro",  # opzionale
)
```
Genera `_products\slug-nome.md` con front-matter completo (compatibile con `_layouts\product.html`), fa commit+push automatico.

## 📦 Prodotti fisici vs digitali (aggiunto 2026-07-05)

`pubblica_prodotto()` accetta ora `tipo="fisico"` (default) o `tipo="digitale"`. Scritto nel frontmatter come `tipo: "..."`.

**Logica checkout** (in `_pages/shop-carrello.md`): al momento di "Procedi al checkout" appare un vero form (non piu' un alert placeholder). La regola e':
- Carrello con **almeno un** prodotto fisico (o misto fisico+digitale) → form completo: email + nome + indirizzo di spedizione (serve per il corriere). **Il fisico vince sempre** se e' misto.
- Carrello con **tutti** prodotti digitali → form minimo: solo email (nessun indirizzo, nessuna spedizione).

Per pubblicare un prodotto digitale:
```python
pubblica_prodotto(
    nome="Ebook Fotografia",
    prezzo="9.90",
    categoria="abbigliamento",
    sku="EBOOK-001",
    descrizione="...",
    corpo="...",
    tipo="digitale",   # <- questo campo, default e' "fisico" se omesso
)
```

**File toccati per questa feature** (controllare qui per primi se serve estenderla):
- `automation/publish.py` — parametro `tipo`, validato (solo "fisico"/"digitale" ammessi, altrimenti `PublishError`)
- `_layouts/product.html` — `TIPO` letto da `p.tipo` e passato nell'oggetto `item` quando si aggiunge al carrello dalla pagina prodotto singola
- `_pages/shop-cat-abbigliamento.md` — stesso campo passato dal bottone "Aggiungi" nella card prodotto della pagina categoria (funzione `aggiungiCarrello()`, 5° parametro)
- `_pages/shop-carrello.md` — `carrelloRichiedeIndirizzo()` + form checkout dinamico (`checkout()`, `confermaCheckout()`)

⚠️ **Se in futuro si aggiungono altre pagine categoria** (`_pages/shop-cat-*.md`), copiare la logica `tipo` aggiornata da `shop-cat-abbigliamento.md`, non da versioni vecchie/cache — stesso principio gia' documentato per il bug `p.name` vs `p.path` in `..\.claude.md`.

⚠️ Il checkout resta demo (nessun gateway di pagamento reale collegato) — la validazione e la UX sono complete, ma "Conferma ordine" mostra solo un toast di successo. Integrare Stripe/PayPal/altro quando serve procedere con pagamenti veri.

### Procedura pratica per ogni richiesta
1. Scrivo uno script minimo `tmp_xxx.py` nella root del progetto con l'import + i dati del contenuto
2. Lancio con `Windows-MCP:PowerShell`: `cd "C:\Users\mirco\Desktop\cmspush2"; python tmp_xxx.py`
3. Cancello lo script temporaneo dopo la pubblicazione riuscita (`Remove-Item tmp_xxx.py`) e pusho la pulizia
4. Do a Mirco il link pubblico del contenuto

---

## 🖼️ Immagini — SEMPRE scaricate e servite dal repo (aggiunto 2026-07-04)

Quando si passa `image=URL` a `pubblica_articolo` o `pubblica_prodotto`, il motore ora **scarica l'immagine in automatico** e la salva dentro il repo (`assets/images/posts/{slug}.ext` o `assets/images/products/{slug}.ext`), poi usa quel path locale nel front-matter invece dell'URL esterno.

**Perche'**: un URL esterno (Wikimedia, CDN di terzi, ecc.) puo' rompersi in qualsiasi momento — rate limit, hotlink protection, URL che cambia, file rinominato/cancellato. Un'immagine dentro il repo e' definitiva, non dipende da nessun servizio esterno, e viene servita da GitHub Pages come tutto il resto del sito.

Se il download fallisce (HTTP diverso da 200, o il Content-Type non e' un'immagine), la funzione solleva `PublishError` PRIMA di scrivere qualsiasi file — mai un link rotto silenzioso.

**Bug corretto lo stesso giorno**: il primo articolo con immagine (Ada Lovelace) e' stato pubblicato con un URL Wikimedia thumbnail costruito a mano (hash di directory indovinato, es. `/e/e0/`) — sbagliato, dava 400. L'hash di directory Wikimedia NON si puo' indovinare dal nome file: va sempre preso dalla vera pagina del file o dalla API (`action=query&prop=imageinfo`), mai costruito a mano. Ora comunque il problema e' risolto alla radice: l'immagine viene scaricata una sola volta e salvata nel repo, quindi anche se l'URL sorgente era quello giusto, da quel momento in poi il sito non dipende piu' da Wikimedia.

---

## 🔒 Protezioni automatiche del motore (stabilizzato 2026-07-04)

`publish.py` ora valida TUTTO da solo prima di scrivere o pushare qualsiasi file — Claude non deve piu controllare queste cose a mano:

1. **Categoria inesistente** → blocca con `PublishError` ed elenca le categorie valide lette da `_data/categorie.json` (articoli) o `_data/shop-categorie.json` (prodotti). Nessun file viene scritto.
2. **Caratteri YAML pericolosi** (`&`, `?`, `[`, `]`, `{`, `}`) in titolo/categoria/excerpt/sku/descrizione/badge/colors/sizes/shipping → blocca con `PublishError` prima di scrivere.
3. **Duplicati** → se esiste gia' un file con lo stesso slug (`_posts/` o `_products/`), blocca invece di sovrascrivere silenziosamente.
4. **Verifica live automatica** → dopo il push, `verifica_live(url)` fa polling reale (fino a ~3 minuti) sull'URL pubblico finche' non risponde 200, e stampa il risultato vero (non assunto). Se dopo il timeout non è ancora 200, lo dice chiaramente invece di dare per scontato che sia andato tutto bene.
5. **Log persistente** → ogni pubblicazione riuscita viene registrata in `automation\publish_log.jsonl` (timestamp, tipo, titolo, slug, file, url) — utile per controllare lo storico senza rileggere tutto agent.md.
6. **URL sempre corretto** → generato da `SITE_BASE` + schema permalink reale del sito (`/:categorie/:titolo/` per articoli, `/shop/:nome/` per prodotti), mai lo schema Jekyll di default.

Se una `PublishError` viene sollevata, Claude legge il messaggio (contiene gia' la lista delle categorie valide o il motivo esatto) e chiede a Mirco come procedere — non aggira la validazione con codice improvvisato.

## Regole fisse (da non violare)

1. **MAI scrivere XML/HTML manuali o script da zero** — usare sempre `pubblica_articolo` / `pubblica_prodotto`. Se serve un campo che la funzione non supporta, si estende `publish.py` una volta sola (non si aggira con codice improvvisato).
2. **Categorie**: controllare sempre `_data/categorie.json` (articoli) o `_data/shop-categorie.json` (prodotti) prima di usarne una. Se la categoria non esiste, chiedere a Mirco se crearla (aggiungerla al JSON) prima di pubblicare — non inventare categorie a caso.
3. **YAML — niente caratteri speciali** nei valori frontmatter (`&`, `?`, `[`, `]`) — rompono il parser Jekyll. Il codice di `publish.py` gia' gestisce le stringhe tra virgolette, ma il testo passato non deve contenere questi simboli nei campi singoli (es. `shipping`, `sku`).
4. **Prezzo**: sempre stringa tipo `"24.90"`, punto come separatore decimale, niente simbolo €.
5. **Slug**: generato automaticamente da `slugify()` — minuscolo, spazi/accenti/simboli rimossi. Non serve calcolarlo a mano.
6. **Git push**: gestito da `_git_push()` dentro publish.py — fa da solo `pull --rebase` + retry se il push viene rifiutato. Nessuna azione manuale richiesta.
7. **File temporanei di test/pubblicazione** vanno nella root del progetto (`tmp_*.py`), mai dentro `automation\` (quella resta solo per il motore stabile).
8. **Notifica sonora**: a fine pubblicazione (ultima azione della risposta), seguire la regola generale del progetto (`sound-notification:send_notification`).

---

## Cosa manca / da valutare in futuro

- `create_product`/prodotti: nessun controllo automatico di duplicati SKU o slug — verificare a mano se serve.
- Nessuna verifica automatica "200 OK" post-pubblicazione (a differenza di PrestaClaude/florbook) — GitHub Pages ha build differito (~1-2 min), quindi il check immediato non avrebbe senso. Se serve, si puo' aggiungere un polling GitHub Actions come gia' fatto per cmspush (vedi `..\.claude.md`, sezione "Script polling").
- Se in futuro servono altre categorie prodotto oltre "abbigliamento", aggiornare `_data/shop-categorie.json` E creare la pagina `_pages/shop-cat-{slug}.md` (vedi istruzioni in `..\.claude.md`).

---

## ⚠️ BUG CRITICO RISOLTO (2026-07-04) — carrello mescolava prodotti diversi

**Sintomo**: aggiungendo 2 prodotti diversi al carrello (es. Camicia + Mazzo di Carte), il carrello mostrava **1 solo prodotto con quantità 2** invece di 2 righe distinte. Anche l'immagine prodotto nel carrello appariva come 📦 invece della foto vera.

**Causa radice**: in Liquid/Jekyll, `page.name` (o `p.name` su un item di collection) **NON è il filename** — è quasi sempre vuoto o non affidabile per generare uno slug. Il pattern sbagliato era:
```liquid
{{ p.name | remove: '.md' }}
```
Con `p.name` vuoto, TUTTI i prodotti finivano con lo stesso "slug" (stringa vuota), quindi la logica del carrello (`cart.find(i => i.slug === item.slug)`) li trattava come lo stesso prodotto e sommava le quantità invece di creare righe separate.

**Fix corretto — usare SEMPRE**:
```liquid
{{ p.path | split: '/' | last | remove: '.md' }}
```
`page.path` è il path reale del file sorgente (es. `_products/mazzo-di-carte-magiche-pro.md`), affidabile al 100%.

**File coinvolti e già corretti** (controllare qui per primi se il bug si ripresenta):
1. `_layouts\product.html` — riga `const SLUG = ...` nello script della pagina prodotto singola
2. `_pages\shop-cat-abbigliamento.md` — funzione `aggiungiCarrello()`, generata dal bottone "Aggiungi" nella card prodotto della pagina categoria. Aveva anche un secondo bug: non passava il parametro `image` alla funzione, quindi il carrello non aveva mai la foto per i prodotti aggiunti da questa pagina (fix: aggiunto 4° parametro `image` sia nel chiamante Liquid che nella funzione JS).

**REGOLA PERMANENTE — controllare SEMPRE prima di pubblicare nuove feature carrello/shop**:
- Cercare in tutto il progetto `p.name` o `page.name` usati per generare slug/id di prodotti → vanno SEMPRE sostituiti con `p.path | split: '/' | last | remove: '.md'`
- Comando di verifica rapido:
  ```powershell
  Get-ChildItem "_layouts","_pages","_includes" -Recurse -Filter "*.html" | Select-String -Pattern "p\.name|page\.name"
  Get-ChildItem "_layouts","_pages","_includes" -Recurse -Filter "*.md" | Select-String -Pattern "p\.name|page\.name"
  ```
  Se compare qualcosa → è un bug, va corretto subito con `p.path | split: '/' | last | remove: '.md'`
- Se in futuro si aggiungono altre pagine categoria (`_pages/shop-cat-*.md`), copiare la logica CORRETTA da `shop-cat-abbigliamento.md` aggiornata, non da versioni vecchie/cache.
- Ogni volta che si tocca il flusso "Aggiungi al carrello" (in qualsiasi file), verificare che la chiamata passi TUTTI e 4 i campi: `slug` (via `p.path`), `title`, `price`, `image` — un campo mancante rompe silenziosamente la visualizzazione nel carrello senza errori JS visibili.

---

## Ripresa sessione — sequenza boot per lavorare qui

1. Leggi questo file (`automation\agent.md`)
2. Leggi `automation\publish.py` solo se serve modificarlo (altrimenti non serve rileggerlo ogni volta)
3. Se serve contesto piu ampio sul progetto (struttura, layout, regole CSS, ecommerce) leggi `..\.claude.md`
4. Procedi con la pubblicazione richiesta, senza chiedere conferma se categoria/prezzo sono gia' chiari
