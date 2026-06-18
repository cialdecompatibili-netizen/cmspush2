// ============ EDITOR VISUALE — ARTICOLI ============
let _editorMode='visuale';

function fmt(cmd){document.getElementById('vis-editor').focus();document.execCommand(cmd,false,null);}
function fmtBlock(tag){if(!tag)return;document.getElementById('vis-editor').focus();document.execCommand('formatBlock',false,tag);}
function insertLink(){
  const url=prompt('URL del link:');
  if(!url)return;
  document.getElementById('vis-editor').focus();
  document.execCommand('createLink',false,url);
}
function setEditor(mode){
  _editorMode=mode;
  document.getElementById('btn-visuale').classList.toggle('active',mode==='visuale');
  document.getElementById('btn-markdown').classList.toggle('active',mode==='markdown');
  if(mode==='visuale'){
    const html=document.getElementById('corpo').value;
    if(html)document.getElementById('vis-editor').innerHTML=html;
    document.getElementById('quill-box').style.display='block';
    document.getElementById('corpo').style.display='none';
  } else {
    document.getElementById('corpo').value=document.getElementById('vis-editor').innerHTML;
    document.getElementById('quill-box').style.display='none';
    document.getElementById('corpo').style.display='block';
  }
}
// Aggiunge righe vuote prima/dopo i tag block-level HTML
// così kramdown (Jekyll) li riconosce come blocchi HTML puri
// e non li tratta come testo da escapare.
function fixHtmlSpacing(html){
  if(!html)return html;
  const blockTags='div|p|ul|ol|li|h1|h2|h3|h4|h5|h6|blockquote|table|tr|td|th|thead|tbody|pre|figure|section|article|header|footer';
  html=html.replace(new RegExp(`(?!^)(<(?:${blockTags})(?:\\s[^>]*)?>)`,'gi'),'\n\n$1');
  html=html.replace(new RegExp(`(<\\/(?:${blockTags})>)(?!$)`,'gi'),'$1\n\n');
  html=html.replace(/\n{3,}/g,'\n\n');
  return html.trim();
}
function getCorpo(){
  if(_editorMode==='visuale')return fixHtmlSpacing(document.getElementById('vis-editor').innerHTML);
  return document.getElementById('corpo').value;
}
function setCorpo(html){
  const isLegacyMd=html&&!html.trim().startsWith('<')&&html.includes('\n');
  const content=isLegacyMd?legacyMdToHtml(html):html;
  document.getElementById('corpo').value=content;
  document.getElementById('vis-editor').innerHTML=content;
}

// ============ ARTICOLI ============
function nuovoArticolo(){
  ['titolo','excerpt','teaser','tags','corpo'].forEach(id=>document.getElementById(id).value='');
  document.getElementById('categorie').value='';
  document.getElementById('data').value=new Date().toISOString().split('T')[0];
  document.getElementById('preview-box').style.display='none';
  window._editSha=null;window._editPath=null;
  document.getElementById('msg-art').style.display='none';
  window.scrollTo({top:0,behavior:'smooth'});
}
function buildContent(){
  const titolo=document.getElementById('titolo').value.trim();
  const data=document.getElementById('data').value;
  const cat=document.getElementById('categorie').value;
  const tags=document.getElementById('tags').value.split(',').map(s=>s.trim()).filter(Boolean);
  const excerpt=document.getElementById('excerpt').value.trim();
  const teaser=document.getElementById('teaser').value.trim();
  const corpo=getCorpo();
  let fm=`---\nlayout: single\ntitle: "${titolo}"\ndate: ${data}\n`;
  if(excerpt)fm+=`excerpt: "${excerpt}"\n`;
  if(teaser)fm+=`header:\n  teaser: "${teaser}"\n`;
  if(cat)fm+=`categories:\n  - ${cat}\n`;
  if(tags.length)fm+=`tags:\n${tags.map(t=>`  - ${t}`).join('\n')}\n`;
  return fm+`---\n\n${corpo}`;
}
function anteprima(){
  document.getElementById('preview-content').textContent=buildContent();
  document.getElementById('preview-box').style.display='block';
  document.getElementById('preview-box').scrollIntoView({behavior:'smooth'});
}
async function caricaLista(){
  if(!tok())return;
  document.getElementById('lista-articoli').innerHTML='<span style="color:#bbb;font-size:13px">⏳ Caricamento...</span>';
  const res=await ghGet('_posts');if(!res.ok)return;
  const files=await res.json();
  document.getElementById('lista-articoli').innerHTML=files.reverse().map(f=>`
    <div class="list-row">
      <span>${f.name.replace(/\.md$/,'')}</span>
      <div style="display:flex;gap:6px">
        <button class="btn btn-secondary btn-sm" onclick="modificaArticolo('${f.path}')">✏️ Modifica</button>
        <button class="btn btn-danger btn-sm" onclick="eliminaArticolo('${f.path}','${f.sha}','${f.name}')">🗑️ Elimina</button>
      </div>
    </div>`).join('');
}
async function modificaArticolo(path){
  const res=await ghGet(path);const data=await res.json();
  const content=dec(data.content);
  const fm=content.match(/^---\n([\s\S]*?)\n---/);
  const body=content.replace(/^---[\s\S]*?---\n\n?/,'');
  const get=(k)=>{const m=(fm?fm[1]:'').match(new RegExp(`${k}:\\s*"?([^"\\n]+)"?`));return m?m[1].trim():'';}
  document.getElementById('titolo').value=get('title');
  document.getElementById('data').value=get('date');
  document.getElementById('excerpt').value=get('excerpt');
  document.getElementById('teaser').value=get('teaser')||'';
  const catM=(fm?fm[1]:'').match(/categories:\n\s*-\s*(.+)/);
  if(catM)document.getElementById('categorie').value=catM[1].trim();
  const tagsM=(fm?fm[1]:'').match(/tags:\n([\s\S]*?)(?=\n\w|\n---)/);
  if(tagsM)document.getElementById('tags').value=tagsM[1].replace(/\s*-\s*/g,'').trim().split('\n').join(', ');
  setCorpo(body);
  window._editSha=data.sha;window._editPath=path;
  showMsg('msg-art','✏️ Articolo caricato — modifica e pubblica.','ok');
  window.scrollTo({top:0,behavior:'smooth'});
}
async function pubblica(){
  if(!tok())return showMsg('msg-art','⚠️ Token mancante!','err');
  const titolo=document.getElementById('titolo').value.trim();
  const cat=document.getElementById('categorie').value;
  const corpo=getCorpo().trim();
  if(!titolo)return showMsg('msg-art','⚠️ Inserisci un titolo!','err');
  if(!cat)return showMsg('msg-art','⚠️ Seleziona una categoria!','err');
  if(!corpo)return showMsg('msg-art','⚠️ Scrivi il contenuto!','err');
  const data=document.getElementById('data').value;
  const filename=window._editPath||`_posts/${data}-${slugify(titolo)}.md`;
  const body={message:`${window._editSha?'Aggiorna':'Nuovo'} articolo: ${titolo}`,content:enc(buildContent())};
  if(window._editSha)body.sha=window._editSha;
  showMsg('msg-art','⏳ Pubblicazione...','');
  try{
    const res=await fetch(`https://api.github.com/repos/${REPO}/contents/${filename}`,{method:'PUT',headers:{'Authorization':`token ${tok()}`,'Content-Type':'application/json'},body:JSON.stringify(body)});
    const json=await res.json();
    if(res.ok){showMsg('msg-art','✅ Pubblicato! Live in ~60 secondi.','ok');window._editSha=null;window._editPath=null;caricaLista();}
    else showMsg('msg-art','❌ '+json.message,'err');
  }catch(e){showMsg('msg-art','❌ Errore di rete.','err');}
}
async function eliminaArticolo(path,sha,nome){
  if(!tok())return showMsg('msg-art','⚠️ Token mancante!','err');
  if(!confirm(`Eliminare definitivamente "${nome}"?\n\nQuesta azione non è reversibile.`))return;
  showMsg('msg-art','⏳ Eliminazione in corso...','');
  try{
    const res=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{
      method:'DELETE',
      headers:{'Authorization':`token ${tok()}`,'Content-Type':'application/json'},
      body:JSON.stringify({message:`Elimina articolo: ${nome}`,sha:sha})
    });
    const json=await res.json();
    if(res.ok){showMsg('msg-art','✅ Articolo eliminato!','ok');caricaLista();}
    else showMsg('msg-art','❌ '+json.message,'err');
  }catch(e){showMsg('msg-art','❌ Errore di rete.','err');}
}
