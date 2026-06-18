---
layout: single
title: "Carrello"
permalink: /shop/carrello/
classes: wide
author_profile: false
---

<style>
*{box-sizing:border-box}
.cart-wrap{max-width:900px;margin:0 auto}
.cart-empty{text-align:center;padding:4em 0;color:#bbb}
.cart-empty .icon{font-size:4em;margin-bottom:.5em}
.cart-empty p{font-size:1.1em}
.cart-empty a{color:#6c63ff;text-decoration:none;font-weight:600}

/* Lista prodotti */
.cart-item{display:grid;grid-template-columns:80px 1fr auto;gap:1.2em;align-items:center;padding:1.2em 0;border-bottom:1px solid #eee}
.cart-item-img{width:80px;height:80px;object-fit:cover;border-radius:10px;background:#f5f5f5;display:flex;align-items:center;justify-content:center;font-size:2em;color:#ccc}
.cart-item-img img{width:80px;height:80px;object-fit:cover;border-radius:10px}
.cart-item-info{}
.cart-item-title{font-weight:700;font-size:15px;color:#1a1a2e;margin-bottom:.3em}
.cart-item-meta{font-size:12px;color:#999}
.cart-item-price{font-weight:700;color:#6c63ff;font-size:15px}
.cart-item-right{display:flex;flex-direction:column;align-items:flex-end;gap:.6em}
.cart-qty{display:flex;align-items:center;border:1.5px solid #ddd;border-radius:8px;overflow:hidden}
.cart-qty button{width:30px;height:32px;border:none;background:#fff;font-size:1.1em;cursor:pointer;color:#333}
.cart-qty button:hover{background:#f5f5f5}
.cart-qty input{width:38px;height:32px;border:none;border-left:1.5px solid #ddd;border-right:1.5px solid #ddd;text-align:center;font-size:13px;font-weight:700;outline:none}
.cart-remove{font-size:11px;color:#e74c3c;cursor:pointer;text-decoration:none;background:none;border:none;padding:0}
.cart-remove:hover{text-decoration:underline}

/* Riepilogo */
.cart-summary{background:#f9f9f9;border-radius:14px;padding:1.5em;margin-top:1.5em}
.cart-summary-row{display:flex;justify-content:space-between;font-size:14px;color:#555;margin-bottom:.7em}
.cart-summary-row.total{font-size:1.2em;font-weight:800;color:#1a1a2e;border-top:2px solid #eee;padding-top:.7em;margin-top:.3em}
.cart-coupon{display:flex;gap:.6em;margin:1em 0}
.cart-coupon input{flex:1;padding:9px 14px;border:1.5px solid #ddd;border-radius:8px;font-size:13px;outline:none}
.cart-coupon input:focus{border-color:#6c63ff}
.cart-coupon button{padding:9px 16px;background:#f0f0f0;border:none;border-radius:8px;font-size:13px;cursor:pointer;font-weight:600;color:#555}
.cart-coupon button:hover{background:#e8e8e8}
.btn-checkout{width:100%;padding:14px;background:#6c63ff;color:#fff;border:none;border-radius:12px;font-size:16px;font-weight:700;cursor:pointer;margin-top:1em;transition:background .2s;letter-spacing:.3px}
.btn-checkout:hover{background:#5a52e0}
.btn-continue{display:block;text-align:center;margin-top:.8em;font-size:13px;color:#6c63ff;text-decoration:none}

/* Badge carrello nel menu */
.cart-badge-count{background:#e74c3c;color:#fff;font-size:10px;font-weight:700;border-radius:50%;width:16px;height:16px;display:inline-flex;align-items:center;justify-content:center;margin-left:3px;vertical-align:middle}

/* Toast */
.sp-toast{position:fixed;bottom:2em;left:50%;transform:translateX(-50%) translateY(60px);background:#1a1a2e;color:#fff;padding:12px 24px;border-radius:10px;font-size:14px;font-weight:600;opacity:0;transition:all .3s;z-index:9999;pointer-events:none}
.sp-toast.show{opacity:1;transform:translateX(-50%) translateY(0)}

@media(max-width:600px){
  .cart-item{grid-template-columns:60px 1fr;gap:.8em}
  .cart-item-right{flex-direction:row;align-items:center;grid-column:1/-1}
}
</style>

<div class="cart-wrap">
  <div id="cart-container">
    <p style="color:#aaa;text-align:center;padding:2em">Caricamento carrello...</p>
  </div>
</div>

<div id="sp-toast" class="sp-toast"></div>

<script>
const BASE = window.location.origin + (window.SITE_BASE || '');
const CART_KEY = (window.SITE_BASE || 'default') + '_cart';

function getCart() {
  try { return JSON.parse(sessionStorage.getItem(CART_KEY) || '[]'); } catch(e){ return []; }
}
function saveCart(cart) {
  sessionStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}
function updateCartBadge() {
  const cart = getCart();
  const total = cart.reduce((s,i) => s + (i.qty||1), 0);
  document.querySelectorAll('.cart-badge').forEach(el => {
    el.textContent = total > 0 ? `🛒 Carrello (${total})` : '🛒 Carrello';
  });
}
function showToast(msg) {
  const t = document.getElementById('sp-toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

function renderCart() {
  const cart = getCart();
  const container = document.getElementById('cart-container');

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <div class="icon">🛒</div>
        <p>Il tuo carrello è vuoto.</p>
        <a href="${BASE}/shop/">→ Vai allo Shop</a>
      </div>`;
    return;
  }

  const subtotal = cart.reduce((s,i) => s + (parseFloat(i.price)||0) * (i.qty||1), 0);
  const shipping = subtotal >= 35 ? 0 : 4.90;
  const total = subtotal + shipping;

  const itemsHtml = cart.map((item, idx) => `
    <div class="cart-item" id="cart-item-${idx}">
      <div class="cart-item-img">
        ${item.image ? `<img src="${item.image}" alt="${item.title}">` : '📦'}
      </div>
      <div class="cart-item-info">
        <div class="cart-item-title">${item.title}</div>
        <div class="cart-item-meta">
          ${item.color ? `Colore: ${item.color}` : ''}
          ${item.size  ? ` &nbsp;|&nbsp; Taglia: ${item.size}` : ''}
          ${item.sku   ? ` &nbsp;|&nbsp; SKU: ${item.sku}` : ''}
        </div>
      </div>
      <div class="cart-item-right">
        <div class="cart-item-price">€ ${(parseFloat(item.price) * (item.qty||1)).toFixed(2)}</div>
        <div class="cart-qty">
          <button onclick="changeItemQty(${idx}, -1)">−</button>
          <input type="number" value="${item.qty||1}" min="1" onchange="setItemQty(${idx}, this.value)">
          <button onclick="changeItemQty(${idx}, 1)">+</button>
        </div>
        <button class="cart-remove" onclick="removeItem(${idx})">✕ Rimuovi</button>
      </div>
    </div>
  `).join('');

  container.innerHTML = `
    <h2 style="font-size:1.3em;font-weight:800;margin-bottom:1.2em">Il tuo carrello <span style="font-size:.7em;font-weight:400;color:#999">(${cart.length} articol${cart.length===1?'o':'i'})</span></h2>
    ${itemsHtml}

    <div class="cart-summary">
      <div class="cart-coupon">
        <input type="text" id="coupon-input" placeholder="Codice sconto (prova: DENTE10)">
        <button onclick="applyCoupon()">Applica</button>
      </div>
      <div id="coupon-msg" style="font-size:12px;margin-bottom:.5em;min-height:16px"></div>
      <div class="cart-summary-row"><span>Subtotale</span><span>€ ${subtotal.toFixed(2)}</span></div>
      <div class="cart-summary-row"><span>Spedizione</span><span>${shipping === 0 ? '<span style="color:#27ae60">Gratuita 🎉</span>' : '€ ' + shipping.toFixed(2)}</span></div>
      <div id="discount-row" style="display:none" class="cart-summary-row"><span>Sconto</span><span id="discount-val" style="color:#27ae60"></span></div>
      <div class="cart-summary-row total"><span>Totale</span><span id="total-val">€ ${total.toFixed(2)}</span></div>
      ${shipping > 0 ? `<div style="font-size:11px;color:#e67e22;text-align:center;margin-top:.5em">Aggiungi € ${(35-subtotal).toFixed(2)} per la spedizione gratuita 🚚</div>` : ''}
      <button class="btn-checkout" onclick="checkout()">💳 Procedi al checkout</button>
      <a href="${BASE}/shop/" class="btn-continue">← Continua lo shopping</a>
    </div>
  `;
}

function changeItemQty(idx, delta) {
  const cart = getCart();
  cart[idx].qty = Math.max(1, (cart[idx].qty||1) + delta);
  saveCart(cart); renderCart();
}
function setItemQty(idx, val) {
  const cart = getCart();
  cart[idx].qty = Math.max(1, parseInt(val)||1);
  saveCart(cart); renderCart();
}
function removeItem(idx) {
  const cart = getCart();
  const name = cart[idx].title;
  cart.splice(idx, 1);
  saveCart(cart); renderCart();
  showToast(`🗑️ "${name}" rimosso dal carrello`);
}
function applyCoupon() {
  const code = document.getElementById('coupon-input').value.trim().toUpperCase();
  const msg = document.getElementById('coupon-msg');
  const discRow = document.getElementById('discount-row');
  const discVal = document.getElementById('discount-val');
  const totalEl = document.getElementById('total-val');
  const cart = getCart();
  const subtotal = cart.reduce((s,i) => s + (parseFloat(i.price)||0) * (i.qty||1), 0);
  const shipping = subtotal >= 35 ? 0 : 4.90;

  if (code === 'DENTE10') {
    const disc = subtotal * 0.10;
    msg.innerHTML = '<span style="color:#27ae60">✅ Codice applicato! Sconto 10%</span>';
    discRow.style.display = 'flex';
    discVal.textContent = '- € ' + disc.toFixed(2);
    totalEl.textContent = '€ ' + (subtotal + shipping - disc).toFixed(2);
  } else {
    msg.innerHTML = '<span style="color:#e74c3c">❌ Codice non valido</span>';
    discRow.style.display = 'none';
  }
}
function checkout() {
  showToast('🎉 Checkout demo — integra il tuo gateway di pagamento!');
}

// Aggiungi prodotto al carrello (chiamato dalla pagina prodotto)
window.addToCartGlobal = function(item) {
  const cart = getCart();
  const existing = cart.find(i => i.slug === item.slug && i.color === item.color && i.size === item.size);
  if (existing) { existing.qty = (existing.qty||1) + (item.qty||1); }
  else { cart.push({ ...item, qty: item.qty||1 }); }
  saveCart(cart);
};

renderCart();
updateCartBadge();
</script>
