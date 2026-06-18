---
layout: single
title: "Categoria"
permalink: /shop/categoria/abbigliamento/
classes: wide
author_profile: false
shop_category: abbigliamento
shop_category_name: Abbigliamento
---

<style>
.shop-list{display:flex;flex-direction:column;gap:1em;margin-top:1.5em}
.prod-card{background:white;border:1.5px solid #eee;border-radius:12px;padding:1.2em 1.5em;color:#1a1a2e;display:flex;gap:1.2em;align-items:center}
.prod-card:hover{border-color:#6c63ff;box-shadow:0 4px 16px rgba(108,99,255,.12)}
.prod-card img{width:90px;height:90px;object-fit:cover;border-radius:8px;flex-shrink:0}
.prod-card-body{flex:1;min-width:0}
.prod-card h3{font-size:1em;font-weight:700;margin:0 0 .3em}
.prod-card .desc{font-size:13px;color:#666;margin-bottom:.5em;line-height:1.5}
.prod-card .price{font-size:1.05em;font-weight:700;color:#6c63ff}
.btn-cart{background:#6c63ff;color:white;border:none;border-radius:8px;padding:8px 18px;font-size:13px;font-weight:600;cursor:pointer;white-space:nowrap;flex-shrink:0}
.btn-cart:hover{background:#574fd6}
</style>

<p style="margin-bottom:.5em"><a href="{{ '/shop/' | relative_url }}" style="color:#6c63ff;font-size:13px;text-decoration:none">← Torna allo Shop</a></p>
<p style="color:#666;font-size:14px">Prodotti nella categoria <strong>{{ page.shop_category_name }}</strong></p>

<div id="prods-loading" style="color:#aaa;font-size:14px">Caricamento prodotti...</div>
<div class="shop-list" id="prods-grid"></div>

<script>
const BASE  = window.location.origin + (window.SITE_BASE || '');
const OWNER = window.location.hostname.split('.')[0];
const REPO  = (window.SITE_BASE || '').replace(/^\//,'') || OWNER + '.github.io';
const FILTER_CAT = '{{ page.shop_category }}';

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

async function loadCat() {
  const pGrid = document.getElementById('prods-grid');
  const loading = document.getElementById('prods-loading');
  try {
    const r = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/_products`);
    if (!r.ok) throw new Error();
    const files = await r.json();
    const mdFiles = files.filter(f => f.name.endsWith('.md'));
    const products = [];
    for (const f of mdFiles) {
      const fr = await fetch(f.download_url);
      const text = await fr.text();
      const meta = parseFrontmatter(text);
      meta._slug = f.name.replace('.md','');
      if (meta.category === FILTER_CAT) products.push(meta);
    }
    loading.style.display = 'none';
    if (products.length === 0) {
      pGrid.innerHTML = '<p style="color:#bbb">Nessun prodotto in questa categoria.</p>';
    } else {
      products.forEach(p => {
        const card = document.createElement('div');
        card.className = 'prod-card';
        card.innerHTML = `
          ${p.image ? `<img src="${p.image}" alt="${p.title||p._slug}">` : ''}
          <div class="prod-card-body">
            <h3><a href="${BASE}/shop/prodotto/?slug=${p._slug}" style="color:inherit;text-decoration:none">${p.title||p._slug}</a></h3>
            ${p.description ? `<div class="desc">${p.description.slice(0,120)}${p.description.length>120?'…':''}</div>` : ''}
            <div class="price">€ ${p.price||'—'}</div>
          </div>
          <button class="btn-cart" onclick="aggiungiCarrello('${p._slug}','${(p.title||p._slug).replace(/'/g,"\\'")}',${p.price||0})">🛒 Aggiungi</button>`;
        pGrid.appendChild(card);
      });
    }
  } catch(e) {
    loading.innerHTML = '<p style="color:#e74c3c">Errore caricamento prodotti.</p>';
  }
}
function aggiungiCarrello(slug, title, price) {
  const CART_KEY = (window.SITE_BASE || 'default') + '_cart';
  let cart = JSON.parse(sessionStorage.getItem(CART_KEY) || '[]');
  const idx = cart.findIndex(i => i.slug === slug);
  if (idx >= 0) cart[idx].qty++;
  else cart.push({slug, title, price, qty: 1});
  sessionStorage.setItem(CART_KEY, JSON.stringify(cart));
  const tot = cart.reduce((s,i) => s + i.qty, 0);
  alert(`✅ "${title}" aggiunto al carrello (tot. ${tot} articoli)`);
}

loadCat();
</script>
