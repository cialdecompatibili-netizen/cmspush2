// ============ SHOP — CATEGORIE ============
let _shopcatSha=null;
let _shopcats=[];

async function caricaCatShop(){
  const el=document.getElementById('lista-cat-shop');
  const sel=document.getElementById('prod-categoria');
  if(!tok()){el.innerHTML='<em style="color:#bbb;font-size:13px">Token mancante.</em>';return;}
  let res;
  try{res=await ghGet('_data/shop-categorie.json');}
  catch(e){el.innerHTML='<em style="color:#bbb;font-size:13px">Errore di rete.</em>';return;}
  if(!res.ok){
    _shopcats=[];_shopcatSha=null;
    el.innerHTML='<em style="color:#bbb;font-size:13px">Nessuna categoria. Aggiungine una.</em>';
    sel.innerHTML='<option value="">— Seleziona —</option>';return;
  }
  const d=await res.json();_shopcatSha=d.sha;
  _shopcats=JSON.parse(dec(d.content));
  el.innerHTML=_shopcats.length?_shopcats.map(c=>`
    <div class="cat-row" style="display:flex;justify-content:space-between;align-items:center">
      <span style="font-size:13px;font-weight:600">${c.nome} <span style="color:#bbb;font-weight:400">(${c.slug})</span></span>
      <button class="btn btn-danger btn-sm" onclick="eliminaCatShop('${c.slug}')">🗑</button>
    </div>`).join(''):'<em style="color:#bbb;font-size:13px">Nessuna categoria.</em>';
  sel.innerHTML='<option value="">— Seleziona —</option>'+_shopcats.map(c=>`<option value="${c.slug}">${c.nome}</option>`).join('');
}

async function salvaCatShop(){
  const res=await ghPut('_data/shop-categorie.json','Aggiorna categorie shop',JSON.stringify(_shopcats,null,2),_shopcatSha||undefined);
  const j=await res.json();
  if(res.ok){_shopcatSha=j.content.sha;return true;}
  return false;
}

async function aggiungiCatShop(){
  const nome=document.getElementById('shopcat-nome').value.trim();
  const slug=document.getElementById('shopcat-slug').value.trim();
  if(!nome||!slug)return showMsg('msg-shopcat','⚠️ Nome e slug obbligatori.','err');
  if(!tok())return showMsg('msg-shopcat','⚠️ Token mancante.','err');
  _shopcats.push({nome,slug});
  const ok=await salvaCatShop();
  if(ok){showMsg('msg-shopcat','✅ Categoria aggiunta!','ok');document.getElementById('shopcat-nome').value='';document.getElementById('shopcat-slug').value='';caricaCatShop();}
  else showMsg('msg-shopcat','❌ Errore salvataggio.','err');
}

async function eliminaCatShop(slug){
  if(!confirm('Eliminare la categoria?'))return;
  _shopcats=_shopcats.filter(c=>c.slug!==slug);
  const ok=await salvaCatShop();
  if(ok){showMsg('msg-shopcat','✅ Eliminata!','ok');caricaCatShop();}
  else showMsg('msg-shopcat','❌ Errore.','err');
}

// ============ SHOP — PRODOTTI ============
let _prodPath=null;

function nuovoProdotto(){
  ['prod-titolo','prod-prezzo','prod-stock','prod-sku','prod-immagine','prod-corpo'].forEach(id=>document.getElementById(id).value='');
  document.getElementById('prod-categoria').value='';
  _prodPath=null;showMsg('msg-prod','','');
}

async function caricaProdotti(){
  const el=document.getElementById('lista-prodotti');
  if(!tok()){el.innerHTML='<em style="color:#bbb;font-size:13px">Token mancante.</em>';return;}
  let res;
  try{res=await ghGet('_products');}
  catch(e){el.innerHTML='<em style="color:#bbb;font-size:13px">Errore di rete.</em>';return;}
  if(!res.ok){el.innerHTML='<em style="color:#bbb;font-size:13px">Cartella _products non trovata.</em>';return;}
  const files=await res.json();
  const prods=files.filter(f=>f.name.endsWith('.md'));
  if(!prods.length){el.innerHTML='<em style="color:#bbb;font-size:13px">Nessun prodotto ancora.</em>';return;}
  el.innerHTML=prods.map(f=>`
    <div class="list-row">
      <span style="font-size:13px">🛒 ${f.name.replace('.md','')}</span>
      <div style="display:flex;gap:8px">
        <button class="btn btn-secondary btn-sm" onclick="modificaProdotto('${f.path}')">✏️ Modifica</button>
        <button class="btn btn-danger btn-sm" onclick="eliminaProdotto('${f.path}','${f.sha}')">🗑</button>
      </div>
    </div>`).join('');
}

async function modificaProdotto(path){
  const res=await ghGet(path);if(!res.ok)return;
  const d=await res.json();const raw=dec(d.content);
  const fm=raw.match(/^---\n([\s\S]+?)\n---\n?([\s\S]*)$/);
  if(!fm)return;
  const meta={};
  fm[1].split('\n').forEach(l=>{const m=l.match(/^(\w+):\s*"?(.+?)"?\s*$/);if(m)meta[m[1]]=m[2];});
  document.getElementById('prod-titolo').value=meta.title||'';
  document.getElementById('prod-prezzo').value=meta.price||'';
  document.getElementById('prod-stock').value=meta.stock||'';
  document.getElementById('prod-sku').value=meta.sku||'';
  document.getElementById('prod-immagine').value=meta.image||'';
  document.getElementById('prod-categoria').value=meta.category||'';
  document.getElementById('prod-corpo').value=fm[2].trim();
  _prodPath=path;showMsg('msg-prod','','');
}

async function pubblicaProdotto(){
  if(!tok())return showMsg('msg-prod','⚠️ Token mancante.','err');
  const titolo=document.getElementById('prod-titolo').value.trim();
  if(!titolo)return showMsg('msg-prod','⚠️ Titolo obbligatorio.','err');
  const prezzo=document.getElementById('prod-prezzo').value.trim();
  const stock=document.getElementById('prod-stock').value.trim();
  const sku=document.getElementById('prod-sku').value.trim();
  const immagine=document.getElementById('prod-immagine').value.trim();
  const categoria=document.getElementById('prod-categoria').value;
  const corpo=document.getElementById('prod-corpo').value.trim();
  const slug=slugify(titolo);
  const path=_prodPath||`_products/${slug}.md`;
  let sha=undefined;
  if(_prodPath){const r=await ghGet(_prodPath);if(r.ok){const d=await r.json();sha=d.sha;}}
  const md=`---\ntitle: "${titolo}"\nprice: ${prezzo||0}\nstock: ${stock||''}\nsku: "${sku}"\ncategory: "${categoria}"\nimage: "${immagine}"\nlayout: product\n---\n${corpo}`;
  showMsg('msg-prod','⏳ Salvataggio...','');
  const res=await ghPut(path,`Prodotto: ${titolo}`,md,sha);
  if(res.ok){showMsg('msg-prod','✅ Prodotto salvato!','ok');_prodPath=path;caricaProdotti();}
  else{const j=await res.json();showMsg('msg-prod','❌ '+j.message,'err');}
}

async function eliminaProdotto(path,sha){
  if(!confirm('Eliminare questo prodotto?'))return;
  if(!tok())return;
  const res=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{
    method:'DELETE',headers:{'Authorization':`token ${tok()}`,'Content-Type':'application/json'},
    body:JSON.stringify({message:`Elimina prodotto ${path}`,sha})
  });
  if(res.ok){showMsg('msg-prod','✅ Eliminato!','ok');caricaProdotti();}
}
