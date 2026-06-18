// ============ CATEGORIE ============
let _categorie=[];
let _catSha=null;

async function caricaCategorie(){
  const res=await ghGet('_data/categorie.json');
  if(res.ok){const d=await res.json();_catSha=d.sha;_categorie=JSON.parse(dec(d.content));}
  else _categorie=[{nome:'tecnica',descrizione:'Articoli tecnici, guide e tutorial'}];
  renderCategorie();renderSelect();
}
function renderCategorie(){
  const el=document.getElementById('lista-categorie');
  el.innerHTML=_categorie.map((c,i)=>`
    <div class="cat-row">
      <div style="display:flex;gap:8px;margin-bottom:6px;align-items:center">
        <div style="display:flex;flex-direction:column;gap:2px">
          <button class="btn btn-secondary btn-sm" style="padding:1px 7px;font-size:11px;line-height:1" onclick="catSu(${i})" ${i===0?"disabled":""}>▲</button>
          <button class="btn btn-secondary btn-sm" style="padding:1px 7px;font-size:11px;line-height:1" onclick="catGiu(${i})" ${i===_categorie.length-1?"disabled":""}>▼</button>
        </div>
        <input type="text" value="${c.nome}" onchange="_categorie[${i}].nome=this.value;renderSelect()" style="font-weight:600;flex:1">
        <button class="btn btn-danger btn-sm" onclick="_categorie.splice(${i},1);renderCategorie();renderSelect()">🗑</button>
      </div>
      <div style="font-size:11px;color:#aaa;margin-bottom:4px">Descrizione (supporta HTML)</div>
      <div contenteditable="true" data-cat-idx="${i}"
        onblur="_categorie[this.dataset.catIdx].descrizione=this.innerHTML"
        style="min-height:48px;border:1px solid #e0e0e0;border-radius:6px;padding:8px 10px;font-size:13px;line-height:1.6;background:#fafafa;outline:none">${c.descrizione||''}</div>
    </div>`).join('');
}
function renderSelect(){
  const sel=document.getElementById('categorie');const cur=sel.value;
  sel.innerHTML='<option value="">— Seleziona —</option>';
  _categorie.forEach(c=>{const o=document.createElement('option');o.value=c.nome;o.textContent=c.nome;if(c.nome===cur)o.selected=true;sel.appendChild(o);});
}
function catSu(i){if(i===0)return;var t=_categorie.splice(i,1)[0];_categorie.splice(i-1,0,t);renderCategorie();renderSelect();}
function catGiu(i){if(i===_categorie.length-1)return;var t=_categorie.splice(i,1)[0];_categorie.splice(i+1,0,t);renderCategorie();renderSelect();}
function aggiungiCategoria(){
  const nome=document.getElementById('cat-nome').value.trim();if(!nome)return;
  if(!_categorie.find(c=>c.nome===nome))_categorie.push({nome,descrizione:''});
  document.getElementById('cat-nome').value='';renderCategorie();renderSelect();
}
async function salvaCategorie(){
  if(!tok())return showMsg('msg-cat','⚠️ Token mancante.','err');
  showMsg('msg-cat','⏳ Salvataggio...','');
  const res=await ghPut('_data/categorie.json','Aggiorna categorie',JSON.stringify(_categorie,null,2),_catSha);
  const j=await res.json();
  if(res.ok){_catSha=j.content.sha;showMsg('msg-cat','✅ Categorie salvate!','ok');}
  else showMsg('msg-cat','❌ '+j.message,'err');
}

// ============ MENU ============
let _menuVoci=[];
let _menuSha=null;

async function caricaMenu(){
  const res=await ghGet('_data/navigation.yml');
  if(!res.ok)return showMsg('msg-menu','❌ Errore caricamento.','err');
  const d=await res.json();_menuSha=d.sha;
  const yaml=dec(d.content);_menuVoci=[];
  let titolo='';
  for(const line of yaml.split('\n')){
    const t=line.match(/^\s+-\s+title:\s+"?([^"]+)"?/);
    const u=line.match(/^\s+url:\s+(.+)/);
    if(t)titolo=t[1].trim();
    if(u&&titolo){_menuVoci.push({title:titolo,url:u[1].trim()});titolo='';}
  }
  renderMenu();
}
function renderMenu(){
  document.getElementById('lista-menu').innerHTML=_menuVoci.map((v,i)=>`
    <div class="menu-row">
      <div style="display:flex;flex-direction:column;gap:2px">
        <button class="btn btn-secondary btn-sm" style="padding:1px 7px;font-size:11px;line-height:1" onclick="menuSu(${i})" ${i===0?'disabled':''}>▲</button>
        <button class="btn btn-secondary btn-sm" style="padding:1px 7px;font-size:11px;line-height:1" onclick="menuGiu(${i})" ${i===_menuVoci.length-1?'disabled':''}>▼</button>
      </div>
      <input type="text" value="${v.title}" onchange="_menuVoci[${i}].title=this.value" placeholder="Nome">
      <input type="text" value="${v.url}" onchange="_menuVoci[${i}].url=this.value" placeholder="/url/" style="font-size:12px;color:#555">
      <button class="btn btn-danger btn-sm" onclick="_menuVoci.splice(${i},1);renderMenu()">🗑</button>
    </div>`).join('');
}
function menuSu(i){if(i===0)return;var t=_menuVoci.splice(i,1)[0];_menuVoci.splice(i-1,0,t);renderMenu();}
function menuGiu(i){if(i===_menuVoci.length-1)return;var t=_menuVoci.splice(i,1)[0];_menuVoci.splice(i+1,0,t);renderMenu();}
function aggiungiVoce(){
  const t=document.getElementById('menu-nome').value.trim();
  const u=document.getElementById('menu-url').value.trim();
  if(!t||!u)return;
  _menuVoci.push({title:t,url:u});
  document.getElementById('menu-nome').value='';document.getElementById('menu-url').value='';
  renderMenu();
}
async function salvaMenu(){
  if(!tok())return showMsg('msg-menu','⚠️ Token mancante.','err');
  showMsg('msg-menu','⏳ Salvataggio...','');
  let yaml='main:\n';_menuVoci.forEach(v=>{yaml+=`  - title: "${v.title}"\n    url: ${v.url}\n`;});
  const res=await ghPut('_data/navigation.yml','Aggiorna menu',yaml,_menuSha);
  const j=await res.json();
  if(res.ok){_menuSha=j.content.sha;showMsg('msg-menu','✅ Menu salvato! Live in ~60s.','ok');}
  else showMsg('msg-menu','❌ '+j.message,'err');
}
