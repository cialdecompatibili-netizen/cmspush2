---
layout: single
title: "Shop"
permalink: /shop/
classes: wide
author_profile: false
---

<style>
.shop-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:1.5em;margin-top:1.5em}
.shop-cat-card{background:white;border:1.5px solid #eee;border-radius:12px;padding:1.5em;text-decoration:none;color:#1a1a2e;transition:all .2s;display:block}
.shop-cat-card:hover{border-color:#6c63ff;box-shadow:0 4px 16px rgba(108,99,255,.12);transform:translateY(-2px)}
.shop-cat-card .icon{font-size:2em;margin-bottom:.5em}
.shop-cat-card h3{font-size:1em;font-weight:700;margin:0 0 .3em}
.shop-cat-card .count{font-size:12px;color:#888}
.prod-card{background:white;border:1.5px solid #eee;border-radius:12px;padding:1.5em;text-decoration:none;color:#1a1a2e;transition:all .2s;display:block;cursor:pointer}
.prod-card:hover{border-color:#6c63ff;box-shadow:0 4px 16px rgba(108,99,255,.12);transform:translateY(-2px)}
.prod-card h3{font-size:1em;font-weight:700;margin:0 0 .4em}
.prod-card .price{font-size:1.1em;font-weight:700;color:#6c63ff}
</style>

<p style="color:#666;font-size:14px">Sfoglia i prodotti per categoria</p>

<div id="cats-loading" style="color:#aaa;font-size:14px">Caricamento categorie...</div>
<div class="shop-grid" id="cats-grid"></div>

<hr style="margin:2.5em 0">
<h2 style="font-size:1.1em;font-weight:700;margin-bottom:1em">Tutti i prodotti</h2>

<div id="prods-loading" style="color:#aaa;font-size:14px">Caricamento prodotti...</div>
<div class="shop-grid" id="prods-grid"></div>

<script>
const OWNER = 'cialdecompatibili-netizen';
const REPO  = 'cmspush';
const BASE  = 'https://cialdecompatibili-netizen.github.io/cmspush';

function parseFrontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return {};
  const obj = {};
  m[1].split('\n').forEach(line => {
    const i = line.indexOf(':');
    if (i < 0) return;
    const k = line.slice(0,i).trim();
    let v = line.slice(i+1).trim().replace(/^["']|["']$/g,'');
    obj[k] = v;
  });
  return obj;
}

async function loadShop() {
  // Carica categorie
  let cats = [];
  try {
    const r = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/_data/shop-categorie.json`);
    if (r.ok) {
      const f = await r.json();
      cats = JSON.parse(atob(f.content));
    }
  } catch(e) {}

  // Carica prodotti
  let products = [];
  try {
    const r = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/_products`);
    if (r.ok) {
      const files = await r.json();
      const mdFiles = files.filter(f => f.name.endsWith('.md'));
      for (const f of mdFiles) {
        const fr = await fetch(f.download_url);
        const text = await fr.text();
        const meta = parseFrontmatter(text);
        meta._slug = f.name.replace('.md','');
        products.push(meta);
      }
    }
  } catch(e) {}

  // Render categorie
  const cGrid = document.getElementById('cats-grid');
  document.getElementById('cats-loading').style.display = 'none';
  if (cats.length === 0) {
    cGrid.innerHTML = '<p style="color:#bbb">Nessuna categoria ancora.</p>';
  } else {
    cats.forEach(cat => {
      const count = products.filter(p => p.category === cat.slug).length;
      const card = document.createElement('a');
      card.className = 'shop-cat-card';
      card.href = BASE + '/shop/categoria/' + cat.slug + '/';
      card.innerHTML = `<div class="icon">📦</div><h3>${cat.nome}</h3><div class="count">${count} prodott${count===1?'o':'i'}</div>`;
      cGrid.appendChild(card);
    });
  }

  // Render prodotti
  const pGrid = document.getElementById('prods-grid');
  document.getElementById('prods-loading').style.display = 'none';
  if (products.length === 0) {
    pGrid.innerHTML = '<p style="color:#bbb">Nessun prodotto ancora.</p>';
  } else {
    products.forEach(p => {
      const card = document.createElement('a');
      card.className = 'prod-card';
      card.href = BASE + '/shop/prodotto/?slug=' + p._slug;
      card.innerHTML = `
        ${p.image ? `<img src="${p.image}" alt="${p.title}" style="width:100%;height:140px;object-fit:cover;border-radius:8px;margin-bottom:.8em">` : ''}
        <h3>${p.title||p._slug}</h3>
        <div class="price">€ ${p.price||'—'}</div>
        <div style="font-size:12px;color:#888;margin-top:.3em">${p.category||''}</div>`;
      pGrid.appendChild(card);
    });
  }
}

loadShop();
</script>
