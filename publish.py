#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
publish.py - motore unico per pubblicare ARTICOLI e PRODOTTI su cmspush2 (Jekyll/GitHub Pages).
Uso da riga di comando o import. Fa slug, file .md, git add/commit/push automatico.

USO ARTICOLO:
    python publish.py articolo "Titolo Articolo" "categoria" "Excerpt breve." "Corpo markdown..."

USO PRODOTTO:
    python publish.py prodotto "Nome Prodotto" prezzo "categoria" "sku" "descrizione breve" "Corpo markdown..." [image_url]

Oppure importa le funzioni pubblica_articolo() / pubblica_prodotto() da un altro script.
"""
import sys
import os
import re
import subprocess
import unicodedata
from datetime import date

REPO = r"C:\Users\mirco\Desktop\cmspush2"


def slugify(text):
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode("ascii")
    text = text.lower()
    text = re.sub(r"[^a-z0-9]+", "-", text).strip("-")
    text = re.sub(r"-+", "-", text)
    return text


def _git_push(msg):
    subprocess.run(["git", "add", "."], cwd=REPO, check=True)
    r = subprocess.run(["git", "commit", "-m", msg], cwd=REPO, capture_output=True, text=True)
    # se non c'e' nulla da committare, non e' un errore
    if r.returncode != 0 and "nothing to commit" not in (r.stdout + r.stderr):
        print("COMMIT WARNING:", r.stdout, r.stderr)
    push = subprocess.run(["git", "push"], cwd=REPO, capture_output=True, text=True)
    if push.returncode != 0:
        # fetch first -> pull --rebase e riprova
        subprocess.run(["git", "pull", "--rebase"], cwd=REPO, check=True)
        subprocess.run(["git", "push"], cwd=REPO, check=True)


def pubblica_articolo(titolo, categoria, excerpt, corpo, data=None):
    """Crea _posts/YYYY-MM-DD-slug.md con front-matter pulito, fa commit+push."""
    d = data or date.today().isoformat()
    slug = slugify(titolo)
    fname = f"{d}-{slug}.md"
    fpath = os.path.join(REPO, "_posts", fname)

    fm = (
        "---\n"
        "layout: single\n"
        f'title: "{titolo}"\n'
        f"date: {d}\n"
        f'excerpt: "{excerpt}"\n'
        "categories:\n"
        f"  - {categoria}\n"
        "---\n\n"
    )
    with open(fpath, "w", encoding="utf-8", newline="\n") as f:
        f.write(fm + corpo.strip() + "\n")

    _git_push(f"Nuovo articolo: {titolo}")
    print(f"OK ARTICOLO -> {fname}")
    return fname


def pubblica_prodotto(nome, prezzo, categoria, sku, descrizione, corpo,
                       image=None, stock=20, badge=None, price_original=None,
                       colors=None, sizes=None, shipping=None):
    """Crea _products/slug.md con front-matter pulito, fa commit+push."""
    slug = slugify(nome)
    fname = f"{slug}.md"
    fpath = os.path.join(REPO, "_products", fname)

    lines = [
        "---",
        f'title: "{nome}"',
        f"price: {prezzo}",
    ]
    if price_original:
        lines.append(f"price_original: {price_original}")
    lines.append(f"stock: {stock}")
    lines.append(f'sku: "{sku}"')
    lines.append(f'category: "{categoria}"')
    if badge:
        lines.append(f'badge: "{badge}"')
    if colors:
        lines.append(f'colors: "{colors}"')
    if sizes:
        lines.append(f'sizes: "{sizes}"')
    if shipping:
        lines.append(f'shipping: "{shipping}"')
    if image:
        lines.append(f'image: "{image}"')
    lines.append(f'description: "{descrizione}"')
    lines.append("layout: product")
    lines.append("---")
    fm = "\n".join(lines) + "\n\n"

    with open(fpath, "w", encoding="utf-8", newline="\n") as f:
        f.write(fm + corpo.strip() + "\n")

    _git_push(f"Nuovo prodotto: {nome}")
    print(f"OK PRODOTTO -> {fname}")
    return fname


if __name__ == "__main__":
    args = sys.argv[1:]
    if not args:
        print(__doc__)
        sys.exit(1)

    kind = args[0]
    if kind == "articolo":
        _, titolo, categoria, excerpt, corpo = args
        pubblica_articolo(titolo, categoria, excerpt, corpo)
    elif kind == "prodotto":
        _, nome, prezzo, categoria, sku, descrizione, corpo, *rest = args
        image = rest[0] if rest else None
        pubblica_prodotto(nome, prezzo, categoria, sku, descrizione, corpo, image=image)
    else:
        print("Primo argomento deve essere 'articolo' o 'prodotto'")
        sys.exit(1)
