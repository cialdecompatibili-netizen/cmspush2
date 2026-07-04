import sys
sys.path.insert(0, r"C:\Users\mirco\Desktop\cmspush2\automation")
from publish import pubblica_articolo, pubblica_prodotto

pubblica_articolo(
    titolo="Articolo di Test",
    categoria="tecnica",
    excerpt="Contenuto di prova per verificare il motore di pubblicazione, con immagine.",
    corpo="## Test\n\nQuesto e' un articolo di **test** con immagine hero, generato per verificare il motore di pubblicazione.",
    image="https://picsum.photos/id/237/1200/630",
    image_caption="Immagine di test",
)

pubblica_prodotto(
    nome="Prodotto di Test",
    prezzo="10.00",
    categoria="abbigliamento",
    sku="TEST-001",
    descrizione="Prodotto di prova per testare il flusso di pubblicazione, con immagine.",
    corpo="Descrizione lunga di **prova** per la scheda prodotto di test, con immagine.",
    stock=5,
    image="https://picsum.photos/id/1025/800/800",
)
