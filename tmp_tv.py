import sys
sys.path.insert(0, r"C:\Users\mirco\Desktop\cmspush2\automation")
from publish import pubblica_prodotto

pubblica_prodotto(
    nome="Televisore 18 pollici",
    prezzo="100.00",
    categoria="abbigliamento",
    sku="TV-18-001",
    descrizione="Televisore compatto da 18 pollici, ideale per cucina, camera o ufficio.",
    corpo="""## Televisore 18 pollici

Un televisore compatto e pratico, perfetto per chi cerca uno schermo aggiuntivo senza ingombro.

### Caratteristiche
- Schermo 18 pollici
- Design compatto e leggero
- Facile da posizionare in qualsiasi ambiente
- Ottimo rapporto qualita prezzo

### Ideale per
Cucina, camera da letto, ufficio o come secondo televisore in casa.
""",
    stock=15,
)
