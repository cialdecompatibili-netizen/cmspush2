import sys
sys.path.insert(0, r"C:\Users\mirco\Desktop\cmspush2\automation")
from publish import pubblica_articolo, pubblica_prodotto

pubblica_articolo(
    titolo="Articolo di Test",
    categoria="tecnica",
    excerpt="Contenuto di prova per verificare il motore di pubblicazione.",
    corpo="## Test\n\nQuesto e' un articolo di **test** generato per verificare che il motore di pubblicazione funzioni correttamente.\n\nNessun contenuto reale, solo verifica tecnica.",
)

pubblica_prodotto(
    nome="Prodotto di Test",
    prezzo="10.00",
    categoria="abbigliamento",
    sku="TEST-001",
    descrizione="Prodotto di prova per testare il flusso di pubblicazione.",
    corpo="Descrizione lunga di **prova** per la scheda prodotto di test. Nessun prodotto reale.",
    stock=5,
)
