// ============ EDITOR PAGINE ============
let _pagEditorMode='visuale';
let _paginaPath='';
let _paginaSha='';

function setPagEditor(mode){
  _pagEditorMode=mode;
  document.getElementById('btn-pag-visuale').classList.toggle('active',mode==='visuale');
  document.getElementById('btn-pag-html').classList.toggle('active',mode==='html');
  if(mode==='visuale'){
    const html=document.getElementById('pag-corpo').value;
    if(html)document.getElementById('pag-vis-editor').innerHTML=html;
    document.getElementById('pag-quill-box').style.display='block';
    document.getElementById('pag-corpo').style.display='none';
  } else {
    document.getElementById('pag-corpo').value=document.getElementById('pag-vis-editor').innerHTML;
    document.getElementById('pag-quill-box').style.display='none';
    document.getElementById('pag-corpo').style.display='block';
  }
}
function getPagCorpo(){
  if(_pagEditorMode==='visuale')return document.getElementById('pag-vis-editor').innerHTML;
  return document.getElementById('pag-corpo').value;
}
function setPagCorpo(html){
  const isLegacyMd=html&&!html.trim().startsWith('<')&&html.includes('\n');
  const content=isLegacyMd?legacyMdToHtml(html):html;
  document.getElementById('pag-corpo').value=content;
  document.getElementById('pag-vis-editor').innerHTML=content;
}
function fmtPag(tag){
  if(!tag)return;
  document.getElementById('pag-vis-editor').focus();
  document.execCommand('formatBlock',false,tag);
}
function insertLinkPag(){
  const url=prompt('URL del link:');
  if(!url)return;
  document.getElementById('pag-vis-editor').focus();
  document.execCommand('createLink',false,url);
}

// ============ PAGINE ============
async function caricaPagine(){
  if(!tok())return;
  const res=await ghGet('_pages');if(!res.ok)return;
  const files=await res.json();
  const homeRow=`<div class="list-row" style="background:#fffbeb;border-radius:7px;padding:10px;margin-bottom:8px">
    <span>🏠 <strong>home</strong> <span style="font-size:11px;color:#aaa">— pagina principale del sito</span></span>
    <button class="btn btn-secondary btn-sm" onclick="modificaHomeContent()">✏️ Modifica</button>
  </div>`;
  document.getElementById('lista-pagine').innerHTML=homeRow+files.map(f=>`
    <div class="list-row">
      <span>${f.name.replace(/\.md$/,'')}</span>
      <button class="btn btn-secondary btn-sm" onclick="modificaPagina('${f.path}','${f.sha}')">✏️ Modifica</button>
    </div>`).join('');
}

async function modificaHomeContent(){
  const res=await ghGet('_includes/home-content.html');
  if(!res.ok)return showMsg('msg-pag','❌ Errore caricamento home.','err');
  const d=await res.json();
  _paginaPath='_includes/home-content.html';
  _paginaSha=d.sha;
  document.getElementById('pag-titolo').value='Home';
  setPagCorpo(dec(d.content));
  setPagEditor('html');
  document.getElementById('nome-pagina').textContent='home-content.html (Home)';
  document.getElementById('editor-pagina').style.display='block';
  document.getElementById('editor-pagina').scrollIntoView({behavior:'smooth'});
}

async function modificaPagina(path,sha){
  const res=await ghGet(path);const d=await res.json();
  const content=dec(d.content);
  const fm=content.match(/^---\n([\s\S]*?)\n---/);
  const corpo=content.replace(/^---[\s\S]*?---\n\n?/,'');
  const titleMatch=(fm?fm[1]:'').match(/title:\s*"?([^"\n]+)"?/);
  _paginaPath=d.path||path;_paginaSha=d.sha;
  document.getElementById('pag-titolo').value=titleMatch?titleMatch[1].trim():'';
  setPagCorpo(corpo);
  document.getElementById('nome-pagina').textContent=path.split('/').pop();
  document.getElementById('editor-pagina').style.display='block';
  document.getElementById('editor-pagina').scrollIntoView({behavior:'smooth'});
}

async function salvaPagina(){
  if(!tok())return showMsg('msg-pag','⚠️ Token mancante.','err');
  const titolo=document.getElementById('pag-titolo').value.trim();
  const corpo=getPagCorpo();
  let content;
  if(_paginaPath==='_includes/home-content.html'){
    content=corpo;
  } else {
    const slug=_paginaPath.split('/').pop().replace('.md','');
    content=`---\nlayout: single\ntitle: "${titolo}"\npermalink: /${slug}/\nauthor_profile: true\n---\n\n${corpo}`;
  }
  showMsg('msg-pag','⏳ Salvataggio...','');
  const res=await ghPut(_paginaPath,`Aggiorna pagina: ${titolo}`,content,_paginaSha);
  const j=await res.json();
  if(res.ok){_paginaSha=j.content.sha;showMsg('msg-pag','✅ Salvata! Live in ~60s.','ok');}
  else showMsg('msg-pag','❌ '+j.message,'err');
}

function anteprimaPagina(){
  const base=location.origin+location.pathname.replace(/\/admin\/?.*$/,'/');
  const urlMap={
    '_includes/home-content.html':base,
    '_pages/about.md':base+'about/',
    '_pages/blog.md':base+'blog/',
  };
  const slug=_paginaPath.split('/').pop().replace('.md','');
  const url=urlMap[_paginaPath]||`${base}${slug}/`;
  const box=document.getElementById('preview-pagina-box');
  document.getElementById('preview-pagina-frame').src=url;
  box.style.display='block';
  box.scrollIntoView({behavior:'smooth'});
}

function chiudiPagina(){
  document.getElementById('editor-pagina').style.display='none';
  document.getElementById('preview-pagina-box').style.display='none';
}
