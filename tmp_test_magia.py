import sys
sys.path.insert(0, r"C:\Users\mirco\Desktop\cmspush2")
from publish import pubblica_prodotto

corpo = """Kit di **magia professionale** pensato sia per chi muove i primi passi nell'illusionismo sia per chi vuole ampliare il proprio repertorio con un mazzo dal feel professionale.

**Caratteristiche:**
- Mazzo in carta patinata resistente alla piega (air-cushion finish)
- Bordo laminato per il "riffle shuffle" senza usura
- Include guida illustrata con 10 trucchi base
- Confezione rigida richiudibile, comoda da trasportare
- Adatto sia a spettacoli dal vivo che a pratica quotidiana
"""

pubblica_prodotto(
    nome="Mazzo di Carte Magiche Pro",
    prezzo="24.90",
    categoria="abbigliamento",
    sku="MAGIA-001",
    descrizione="Mazzo professionale per illusionismo, finitura air-cushion, guida con 10 trucchi inclusa.",
    corpo=corpo,
    image="https://images.unsplash.com/photo-1541278107931-e006523892df?w=800&q=80",
    stock=30,
    badge="Novita",
)
