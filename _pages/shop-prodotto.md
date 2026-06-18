---
layout: single
title: "Prodotto"
permalink: /shop/prodotto/
classes: wide
author_profile: false
---

<style>
*{box-sizing:border-box}
#page-title{display:none}
.sp-wrap{display:grid;grid-template-columns:1fr 1fr;gap:2.5em;max-width:1000px;margin:0 auto}
@media(max-width:700px){.sp-wrap{grid-template-columns:1fr}}

/* Gallery */
.sp-gallery{}
.sp-main-img{width:100%;height:420px;object-fit:cover;border-radius:14px;cursor:zoom-in;transition:opacity .2s}
.sp-thumbs{display:flex;gap:.6em;margin-top:.8em;flex-wrap:wrap}
.sp-thumb{width:72px;height:72px;object-fit:cover;border-radius:8px;cursor:pointer;border:2px solid transparent;transition:border-color .2s;opacity:.7}
.sp-thumb:hover,.sp-thumb.active{border-color:#6c63ff;opacity:1}
.sp-no-img{width:100%;height:420px;background:#f5f5f5;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:4em;color:#ccc}

/* Info */
.sp-info{}
.sp-breadcrumb{font-size:12px;color:#999;margin-bottom:.8em}
.sp-breadcrumb a{color:#6c63ff;text-decoration:none}
.sp-badge{display:inline-block;font-size:11px;font-weight:700;background:#6c63ff;color:#fff;padding:3px 10px;border-radius:20px;margin-bottom:.7em;letter-spacing:.5px;text-transform:uppercase}
.sp-title{font-size:1.7em;font-weight:800;color:#1a1a2e;margin:0 0 .4em;line-height:1.2}
.sp-rating{display:flex;align-items:center;gap:.5em;margin-bottom:1em;font-size:14px}
.sp-stars{color:#f4b942;letter-spacing:1px}
.sp-rating-num{font-weight:700;color:#333}
.sp-rating-count{color:#999}
.sp-price-row{display:flex;align-items:baseline;gap:.8em;margin-bottom:.3em}
.sp-price{font-size:2.2em;font-weight:800;color:#1a1a2e}
.sp-price-orig{font-size:1.1em;color:#bbb;text-decoration:line-through}
.sp-discount{font-size:.85em;background:#ff4757;color:#fff;padding:2px 8px;border-radius:6px;font-weight:700}
.sp-shipping{font-size:12px;color:#27ae60;margin-bottom:1.2em}
.sp-divider{border:none;border-top:1px solid #eee;margin:1.2em 0}

/* Selettori */
.sp-label{font-size:12px;font-weight:700;color:#555;text-transform:uppercase;letter-spacing:.5px;margin-bottom:.5em}
.sp-options{display:flex;flex-wrap:wrap;gap:.5em;margin-bottom:1.1em}
.sp-opt{padding:6px 16px;border:1.5px solid #ddd;border-radius:8px;font-size:13px;cursor:pointer;color:#333;background:#fff;transition:all .15s}
.sp-opt:hover{border-color:#6c63ff;color:#6c63ff}
.sp-opt.selected{border-color:#6c63ff;background:#6c63ff;color:#fff}

/* Qty e CTA */
.sp-qty-row{display:flex;align-items:center;gap:1em;margin-bottom:1.2em}
.sp-qty{display:flex;align-items:center;border:1.5px solid #ddd;border-radius:8px;overflow:hidden}
.sp-qty button{width:36px;height:40px;border:none;background:#fff;font-size:1.2em;cursor:pointer;color:#333;transition:background .15s}
.sp-qty button:hover{background:#f5f5f5}
.sp-qty input{width:44px;height:40px;border:none;border-left:1.5px solid #ddd;border-right:1.5px solid #ddd;text-align:center;font-size:15px;font-weight:700;color:#1a1a2e;outline:none}
.sp-btn-cart{flex:1;padding:12px 20px;background:#6c63ff !important;color:#fff !important;border:none !important;border-radius:10px !important;font-size:15px !important;font-weight:700 !important;cursor:pointer !important;transition:background .2s;letter-spacing:.3px;display:inline-block !important;visibility:visible !important;opacity:1 !important;line-height:1.4 !important;text-decoration:none !important;box-shadow:none !important}
.sp-btn-cart:hover{background:#5a52e0 !important;color:#fff !important}
.sp-btn-wish{width:46px !important;height:46px !important;border:1.5px solid #ddd !important;border-radius:10px !important;background:#fff !important;cursor:pointer !important;font-size:1.3em !important;color:#e74c3c !important;transition:all .2s;display:inline-flex !important;align-items:center;justify-content:center;visibility:visible !important}
.sp-btn-wish:hover{border-color:#e74c3c !important;background:#fff5f5 !important}
.sp-qty-row{display:flex !important;align-items:center !important;gap:1em !important;margin-bottom:1.2em !important;visibility:visible !important}
.sp-qty button{width:36px !important;height:40px !important;border:none !important;background:#fff !important;font-size:1.2em !important;cursor:pointer !important;color:#333 !important;display:inline-flex !important;align-items:center !important;justify-content:center !important;visibility:visible !important}

.sp-stock{font-size:13px;color:#27ae60;margin-bottom:.8em}
.sp-stock.low{color:#e67e22}

/* Tabs descrizione */
.sp-tabs{display:flex;gap:0;border-bottom:2px solid #eee;margin-bottom:1.5em}
.sp-tab{padding:10px 18px;font-size:13px;font-weight:600;color:#999;cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-2px;transition:all .2s}
.sp-tab.active{color:#6c63ff;border-bottom-color:#6c63ff}
.sp-tab-content{display:none;font-size:14px;line-height:1.8;color:#444}
.sp-tab-content.active{display:block}

/* Recensioni */
.sp-review{background:#f9f9f9;border-radius:10px;padding:1em;margin-bottom:.8em}
.sp-review-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:.4em}
.sp-review-name{font-weight:700;font-size:13px;color:#333}
.sp-review-stars{color:#f4b942;font-size:12px}
.sp-review-date{font-size:11px;color:#bbb}
.sp-review-text{font-size:13px;color:#555}

/* Toast */
.sp-toast{position:fixed;bottom:2em;left:50%;transform:translateX(-50%) translateY(60px);background:#1a1a2e;color:#fff;padding:12px 24px;border-radius:10px;font-size:14px;font-weight:600;opacity:0;transition:all .3s;z-index:9999;pointer-events:none}
.sp-toast.show{opacity:1;transform:translateX(-50%) translateY(0)}

.sp-sku{font-size:11px;color:#bbb;margin-top:1em}
.sp-short-desc{font-size:14px;color:#555;line-height:1.6;margin-bottom:.8em}
</style>

<div id="prod-container" style="color:#aaa;padding:3em 0;text-align:center">
  <div style="font-size:2em;margin-bottom:.5em">⏳</div>
  Caricamento prodotto...
</div>

<div id="sp-toast" class="sp-toast"></div>

<script>
const BASE  = window.location.origin + (window.SITE_BASE || '');
const OWNER = window.location.hostname.split('.')[0];
const REPO  = (window.SITE_BASE || '').replace(/^\//,'') || OWNER + '.github.io';

const REVIEWS_DEMO = [
  { name: "Marco R.", stars: 5, date: "12 apr 2026", text: "Qualità eccezionale, l'ho regalata al mio dentista e ha riso per una settimana intera. 😂" },
  { name: "Giulia T.", stars: 5, date: "3 mar 2026", text: "Cotone morbidissimo, la stampa tiene benissimo dopo 10 lavaggi. Super consigliata!" },
  { name: "Paolo M.", stars: 4, date: "18 feb 2026", text: "Bella maglietta, taglia leggermente larga. Prendete una taglia in meno." },
  { name: "Sara B.", stars: 5, date: "2 feb 2026", text: "Originalissima, unica nel suo genere. Ho ricevuto mille complimenti al lavoro." },
];

function parseFrontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const body = text.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '');
  if (!m) return { _body: body };
  const obj = { _body: body };
  m[1].split('\n').forEach(line => {
    const i = line.indexOf(':');
    if (i < 0) return;
    const k = line.slice(0,i).trim();
    let v = line.slice(i+1).trim().replace(/^["']|["']$/g,'');
    obj[k] = v;
  });
  return obj;
}

function stars(n) {
  const full = Math.round(n);
  return '★'.repeat(full) + '☆'.repeat(5 - full);
}

function discount(orig, curr) {
  if (!orig || !curr) return '';
  const p = Math.round((1 - parseFloat(curr)/parseFloat(orig)) * 100);
  return p > 0 ? `-${p}%` : '';
}

function markdownToHtml(md) {
  return md
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>[\s\S]+?<\/li>)/g, '<ul>$1</ul>')
    .replace(/<\/ul>\s*<ul>/g, '')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<)/gm, '')
    .trim();
}

function showToast(msg) {
  const t = document.getElementById('sp-toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

function selectOpt(group, el) {
  document.querySelectorAll(`.sp-opt[data-group="${group}"]`).forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
}

async function loadProduct() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');
  const container = document.getElementById('prod-container');

  if (!slug) {
    container.innerHTML = '<p style="color:#e74c3c;text-align:center">Nessun prodotto specificato.</p>';
    return;
  }

  try {
    const r = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/_products/${slug}.md`);
    if (!r.ok) throw new Error();
    const f = await r.json();
    const text = atob(f.content.replace(/\n/g,''));
    const p = parseFrontmatter(text);

    document.title = (p.title || slug) + ' — Shop CMSPush';

    // Gallery
    let galleryImgs = [];
    if (p.gallery) {
      galleryImgs = p.gallery.split(',').map(s => s.trim().replace(/^["'\[\]]+|["'\[\]]+$/g,''));
    } else if (p.image) {
      galleryImgs = [p.image];
    }

    const galleryHtml = galleryImgs.length > 0 ? `
      <img id="sp-main-img" class="sp-main-img" src="${galleryImgs[0]}" alt="${p.title||slug}">
      ${galleryImgs.length > 1 ? `<div class="sp-thumbs">${galleryImgs.map((img,i)=>`<img class="sp-thumb${i===0?' active':''}" src="${img}" data-idx="${i}" onclick="switchImg(this,'${img}')" alt="img ${i+1}">`).join('')}</div>` : ''}
    ` : `<div class="sp-no-img">📦</div>`;

    // Colori e taglie
    const colors = p.colors ? p.colors.split(',').map(s=>s.trim()) : [];
    const sizes  = p.sizes  ? p.sizes.split(',').map(s=>s.trim())  : [];

    const colorsHtml = colors.length ? `
      <div class="sp-label">Colore</div>
      <div class="sp-options">${colors.map((c,i)=>`<button class="sp-opt${i===0?' selected':''}" data-group="color" onclick="selectOpt('color',this)">${c}</button>`).join('')}</div>
    ` : '';

    const sizesHtml = sizes.length ? `
      <div class="sp-label">Taglia</div>
      <div class="sp-options">${sizes.map((s,i)=>`<button class="sp-opt${i===0?' selected':''}" data-group="size" onclick="selectOpt('size',this)">${s}</button>`).join('')}</div>
    ` : '';

    // Prezzo
    const disc = discount(p.price_original, p.price);
    const priceVal = p.price && parseFloat(p.price) > 0 ? `€ ${parseFloat(p.price).toFixed(2)}` : '<span style="color:#e74c3c;font-size:1em">Prezzo non impostato</span>';
    const priceHtml = `
      <div class="sp-price-row">
        <span class="sp-price">${priceVal}</span>
        ${p.price_original ? `<span class="sp-price-orig">€ ${p.price_original}</span>` : ''}
        ${disc ? `<span class="sp-discount">${disc}</span>` : ''}
      </div>
    `;

    // Stock
    const stockN = parseInt(p.stock)||0;
    const stockHtml = stockN > 0
      ? `<div class="sp-stock${stockN < 10 ? ' low' : ''}">
          ${stockN < 10 ? `⚠️ Ultimi ${stockN} pezzi disponibili!` : `✅ Disponibile — ${stockN} pezzi in magazzino`}
         </div>`
      : `<div class="sp-stock" style="color:#e74c3c">❌ Esaurito</div>`;

    // Rating
    const rat = parseFloat(p.rating)||0;
    const revN = parseInt(p.reviews)||0;
    const ratingHtml = rat > 0 ? `
      <div class="sp-rating">
        <span class="sp-stars">${stars(rat)}</span>
        <span class="sp-rating-num">${rat}</span>
        <span class="sp-rating-count">(${revN} recensioni)</span>
      </div>
    ` : '';

    // Recensioni
    const reviewsHtml = REVIEWS_DEMO.map(rv => `
      <div class="sp-review">
        <div class="sp-review-head">
          <span class="sp-review-name">${rv.name}</span>
          <span class="sp-review-stars">${stars(rv.stars)}</span>
        </div>
        <div class="sp-review-date">${rv.date}</div>
        <div class="sp-review-text">${rv.text}</div>
      </div>
    `).join('');

    // Body
    const bodyHtml = markdownToHtml(p._body || '');

    container.innerHTML = `
      <p class="sp-breadcrumb">
        <a href="${BASE}/shop/">Shop</a> /
        ${p.category ? `<a href="${BASE}/shop/categoria/${p.category}/">${p.category}</a> / ` : ''}
        ${p.title||slug}
      </p>

      <div class="sp-wrap">
        <div class="sp-gallery">${galleryHtml}</div>

        <div class="sp-info">
          ${p.badge ? `<div class="sp-badge">${p.badge}</div>` : ''}
          <h1 class="sp-title">${p.title||slug}</h1>
          ${ratingHtml}
          ${priceHtml}
          ${p.description ? `<p class="sp-short-desc">${p.description}</p>` : ''}
          ${p.shipping ? `<div class="sp-shipping">🚚 ${p.shipping}</div>` : ''}
          <hr class="sp-divider">
          ${colorsHtml}
          ${sizesHtml}
          ${stockHtml}
          <div class="sp-qty-row">
            <div class="sp-qty">
              <button onclick="changeQty(-1)">−</button>
              <input type="number" id="sp-qty" value="1" min="1" max="${stockN||99}">
              <button onclick="changeQty(1)">+</button>
            </div>
            <a href="javascript:void(0)" class="sp-btn-cart" onclick="addToCart()">🛒 Aggiungi al carrello</a>
            <a href="javascript:void(0)" class="sp-btn-wish" title="Wishlist" onclick="addWish()">♡</a>
          </div>
          <hr class="sp-divider">
          <div class="sp-sku">SKU: ${p.sku||'—'} &nbsp;|&nbsp; Categoria: <a href="${BASE}/shop/categoria/${p.category}/" style="color:#6c63ff">${p.category||'—'}</a></div>
        </div>
      </div>

      <div style="max-width:1000px;margin:2.5em auto 0">
        <div class="sp-tabs">
          <div class="sp-tab active" onclick="switchTab('descrizione',this)">Descrizione</div>
          <div class="sp-tab" onclick="switchTab('recensioni',this)">Recensioni (${revN||REVIEWS_DEMO.length})</div>
          <div class="sp-tab" onclick="switchTab('spedizione',this)">Spedizione & Resi</div>
        </div>
        <div id="tab-descrizione" class="sp-tab-content active"><p>${bodyHtml}</p></div>
        <div id="tab-recensioni" class="sp-tab-content">${reviewsHtml}</div>
        <div id="tab-spedizione" class="sp-tab-content">
          <p>🚚 <strong>Spedizione standard</strong> in 3-5 giorni lavorativi — €4,90</p>
          <p>⚡ <strong>Spedizione express</strong> in 1-2 giorni — €9,90</p>
          <p>🎁 <strong>Spedizione gratuita</strong> per ordini superiori a €35</p>
          <hr style="margin:1em 0;border:none;border-top:1px solid #eee">
          <p>↩️ <strong>Resi gratuiti</strong> entro 30 giorni dall'acquisto. Il prodotto deve essere nelle condizioni originali.</p>
        </div>
      </div>

      <div style="max-width:1000px;margin:2em auto">
        <a href="${BASE}/shop/" style="font-size:13px;color:#6c63ff;text-decoration:none">← Torna allo Shop</a>
      </div>
    `;

  } catch(e) {
    container.innerHTML = '<p style="color:#e74c3c;text-align:center;padding:3em 0">Prodotto non trovato.</p>';
  }
}

function switchImg(el, src) {
  document.getElementById('sp-main-img').src = src;
  document.querySelectorAll('.sp-thumb').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
}

function changeQty(delta) {
  const inp = document.getElementById('sp-qty');
  if (!inp) return;
  let v = parseInt(inp.value) + delta;
  inp.value = Math.max(1, v);
}

function getCart() {
  const CART_KEY = (window.SITE_BASE || 'default') + '_cart';
  try { return JSON.parse(sessionStorage.getItem(CART_KEY) || '[]'); } catch(e){ return []; }
}
function saveCart(cart) {
  const CART_KEY = (window.SITE_BASE || 'default') + '_cart';
  sessionStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart() {
  const sizeEl  = document.querySelector('.sp-opt[data-group="size"].selected');
  const colorEl = document.querySelector('.sp-opt[data-group="color"].selected');
  const qtyEl   = document.getElementById('sp-qty');
  const qty     = parseInt(qtyEl?.value || 1);
  const slug    = new URLSearchParams(window.location.search).get('slug');

  // Recupera dati dal DOM già renderizzato
  const title = document.querySelector('.sp-title')?.textContent || slug;
  const price = document.querySelector('.sp-price')?.textContent?.replace('€','').trim() || '0';
  const imgSrc = document.getElementById('sp-main-img')?.src || '';

  const item = {
    slug, title, price,
    image: imgSrc,
    color: colorEl?.textContent || '',
    size:  sizeEl?.textContent  || '',
    qty
  };

  const cart = getCart();
  const existing = cart.find(i => i.slug === item.slug && i.color === item.color && i.size === item.size);
  if (existing) { existing.qty = (existing.qty||1) + qty; }
  else { cart.push(item); }
  saveCart(cart);

  let msg = `✅ Aggiunto! Qtà: ${qty}`;
  if (item.color) msg += ` | ${item.color}`;
  if (item.size)  msg += ` | ${item.size}`;
  showToast(msg);

  // Dopo 1.5s vai al carrello
  setTimeout(() => { window.location.href = BASE + '/shop/carrello/'; }, 1600);
}

function addWish() {
  const btn = document.querySelector('.sp-btn-wish');
  btn.textContent = '♥';
  btn.style.color = '#e74c3c';
  btn.style.background = '#fff5f5';
  showToast('❤️ Aggiunto alla wishlist!');
}

function switchTab(id, el) {
  document.querySelectorAll('.sp-tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.sp-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('tab-'+id).classList.add('active');
  el.classList.add('active');
}

loadProduct();
</script>
