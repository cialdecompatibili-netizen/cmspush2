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

### Procedura pratica per ogni richiesta
1. Scrivo uno script minimo `tmp_xxx.py` nella root del progetto con l'import + i dati del contenuto
2. Lancio con `Windows-MCP:PowerShell`: `cd "C:\Users\mirco\Desktop\cmspush2"; python tmp_xxx.py`
3. Cancello lo script temporaneo dopo la pubblicazione riuscita (`Remove-Item tmp_xxx.py`) e pusho la pulizia
4. Do a Mirco il link pubblico del contenuto

---

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

## Ripresa sessione — sequenza boot per lavorare qui

1. Leggi questo file (`automation\agent.md`)
2. Leggi `automation\publish.py` solo se serve modificarlo (altrimenti non serve rileggerlo ogni volta)
3. Se serve contesto piu ampio sul progetto (struttura, layout, regole CSS, ecommerce) leggi `..\.claude.md`
4. Procedi con la pubblicazione richiesta, senza chiedere conferma se categoria/prezzo sono gia' chiari
