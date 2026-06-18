// ============ TEMA ============
const SKINS=[
  {id:'default', label:'Default', bg:'#fff', accent:'#6c63ff', text:'#222'},
  {id:'dark',    label:'Dark',    bg:'#1a1a2e', accent:'#a89fff', text:'#eee'},
  {id:'mint',    label:'Mint',    bg:'#f0faf5', accent:'#2ecc71', text:'#222'},
  {id:'sunrise', label:'Sunrise', bg:'#fff8f0', accent:'#e67e22', text:'#222'},
  {id:'aqua',    label:'Aqua',    bg:'#e8f8ff', accent:'#00bcd4', text:'#222'},
  {id:'neon',    label:'Neon',    bg:'#0d0d0d', accent:'#39ff14', text:'#eee'},
  {id:'plum',    label:'Plum',    bg:'#2d1b4e', accent:'#c39bd3', text:'#eee'},
  {id:'dirt',    label:'Dirt',    bg:'#f5f0e8', accent:'#8B4513', text:'#222'},
  {id:'air',     label:'Air',     bg:'#f7f9fc', accent:'#4a90e2', text:'#222'},
];
let _temaCorrente='default';
let _configSha=null;

function renderTemaGrid(){
  document.getElementById('tema-grid').innerHTML=SKINS.map(s=>`
    <div onclick="selezionaTema('${s.id}')" id="skin-${s.id}" style="
      cursor:pointer;border-radius:10px;padding:14px 10px;text-align:center;
      background:${s.bg};border:3px solid ${_temaCorrente===s.id?s.accent:'#e0e0e0'};
      transition:border .15s;box-shadow:0 1px 4px rgba(0,0,0,.08)">
      <div style="font-size:22px;margin-bottom:6px;background:${s.accent};width:36px;height:36px;border-radius:50%;margin:0 auto 8px;"></div>
      <div style="font-size:12px;font-weight:700;color:${s.text==='#eee'?'#555':s.text}">${s.label}</div>
      ${_temaCorrente===s.id?`<div style="font-size:10px;color:${s.accent};font-weight:700;margin-top:3px">✓ Attivo</div>`:''}
    </div>`).join('');
}
function selezionaTema(id){_temaCorrente=id;renderTemaGrid();}
async function caricaTema(){
  const res=await ghGet('_config.yml');
  if(!res.ok)return;
  const d=await res.json();_configSha=d.sha;
  const yaml=dec(d.content);
  const m=yaml.match(/minimal_mistakes_skin:\s*(\S+)/);
  if(m)_temaCorrente=m[1];
  renderTemaGrid();
}
async function salvaTema(){
  if(!tok())return showMsg('msg-tema','⚠️ Token mancante.','err');
  showMsg('msg-tema','⏳ Caricamento config...','');
  const res=await ghGet('_config.yml');
  if(!res.ok)return showMsg('msg-tema','❌ Impossibile leggere _config.yml','err');
  const d=await res.json();_configSha=d.sha;
  let yaml=dec(d.content);
  yaml=yaml.replace(/minimal_mistakes_skin:\s*\S+/,`minimal_mistakes_skin: ${_temaCorrente}`);
  showMsg('msg-tema','⏳ Salvataggio...','');
  const putRes=await ghPut('_config.yml',`Cambia tema: ${_temaCorrente}`,yaml,_configSha);
  const j=await putRes.json();
  if(putRes.ok){_configSha=j.content.sha;showMsg('msg-tema',`✅ Tema "${_temaCorrente}" salvato!`,'ok');}
  else showMsg('msg-tema','❌ '+j.message,'err');
}

// ============ IMPOSTAZIONI ============
let _configShaImp=null;

async function caricaImpostazioni(){
  if(!tok())return;
  const res=await ghGet('_config.yml');
  if(!res.ok)return;
  const d=await res.json();
  _configShaImp=d.sha;
  const y=dec(d.content);
  const get=(k,def='')=>{const m=y.match(new RegExp(`^${k}:\\s*(.+)$`,'m'));return m?m[1].trim().replace(/^["']|["']$/g,''):def;};
  document.getElementById('cfg-title').value=get('title');
  document.getElementById('cfg-email').value=get('email');
  document.getElementById('cfg-baseurl').value=get('baseurl');
  const descM=y.match(/description:\s*>-\s*\n\s*(.+)/);
  document.getElementById('cfg-description').value=descM?descM[1].trim():get('description');
  document.getElementById('cfg-author-name').value=get('  name','');
  document.getElementById('cfg-bio').value=get('  bio','');
  document.getElementById('cfg-avatar').value=get('  avatar','');
  const socialMatch=(label)=>{const m=y.match(new RegExp(`label: "${label}"[\\s\\S]*?url: "?([^"\\n]+)"?`));return m?m[1].trim():'';}
  document.getElementById('cfg-website').value=socialMatch('Website');
  document.getElementById('cfg-twitter').value=socialMatch('Twitter');
  document.getElementById('cfg-github').value=socialMatch('GitHub');
  document.getElementById('cfg-instagram').value=socialMatch('Instagram');
  const hpM=y.match(/cms_homepage:\s*(.+)/);
  await caricaPaginePerlHome(hpM?hpM[1].trim():'');
}

async function caricaPaginePerlHome(corrente){
  const sel=document.getElementById('cfg-homepage');
  sel.innerHTML='<option value="">— Seleziona —</option>';
  try{
    const res=await ghGet('_pages');
    if(!res.ok)return;
    const files=await res.json();
    files.forEach(f=>{
      const o=document.createElement('option');
      o.value=f.path;o.textContent=f.name.replace(/\.md$/,'');
      if(f.path===corrente||f.name.replace(/\.md$/,'')===(corrente||'').replace('_pages/','').replace('.md',''))o.selected=true;
      sel.appendChild(o);
    });
  }catch(e){}
}

async function salvaImpostazioni(){
  if(!tok())return showMsg('msg-cfg','⚠️ Token mancante.','err');
  showMsg('msg-cfg','⏳ Caricamento config...','');
  const res=await ghGet('_config.yml');
  if(!res.ok)return showMsg('msg-cfg','❌ Impossibile leggere _config.yml','err');
  const d=await res.json();_configShaImp=d.sha;
  let y=dec(d.content);
  y=y.replace(/^title:.*$/m,`title: ${document.getElementById('cfg-title').value.trim()}`);
  y=y.replace(/^email:.*$/m,`email: ${document.getElementById('cfg-email').value.trim()}`);
  const buVal=document.getElementById('cfg-baseurl').value.trim();
  if(y.match(/^baseurl:/m))y=y.replace(/^baseurl:.*$/m,`baseurl: "${buVal}"`);
  else y=`baseurl: "${buVal}"\n`+y;
  const desc=document.getElementById('cfg-description').value.trim();
  y=y.replace(/description:\s*>-\s*\n\s*.+/,`description: >-\n  ${desc}`);
  y=y.replace(/(author:\s*\n\s*name\s*:\s*)(".+?"|[^\n]+)/,`$1"${document.getElementById('cfg-author-name').value.trim()}"`);
  y=y.replace(/(  avatar\s*:\s*)(".+?"|[^\n]+)/,`$1"${document.getElementById('cfg-avatar').value.trim()}"`);
  y=y.replace(/(  bio\s*:\s*)(".+?"|[^\n]+)/,`$1"${document.getElementById('cfg-bio').value.trim()}"`);
  const setSocial=(label,val)=>{y=y.replace(new RegExp(`(label: "${label}"[\\s\\S]*?url:\\s*)"?[^"\\n]+"?`),'$1"'+val+'"');};
  setSocial('Website',document.getElementById('cfg-website').value.trim());
  setSocial('Twitter',document.getElementById('cfg-twitter').value.trim());
  setSocial('GitHub',document.getElementById('cfg-github').value.trim());
  setSocial('Instagram',document.getElementById('cfg-instagram').value.trim());
  const hp=document.getElementById('cfg-homepage').value;
  if(y.match(/^cms_homepage:/m))y=y.replace(/^cms_homepage:.*$/m,`cms_homepage: ${hp}`);
  else y+=`\ncms_homepage: ${hp}\n`;
  await aggiornaIndexHome(hp);
  showMsg('msg-cfg','⏳ Salvataggio...','');
  const putRes=await ghPut('_config.yml','Aggiorna impostazioni sito',y,_configShaImp);
  const j=await putRes.json();
  if(putRes.ok){_configShaImp=j.content.sha;showMsg('msg-cfg','✅ Impostazioni salvate!','ok');}
  else showMsg('msg-cfg','❌ '+j.message,'err');
}

async function aggiornaIndexHome(pagePath){
  if(!pagePath)return;
  try{
    const res=await ghGet(pagePath);
    if(!res.ok)return;
    const d=await res.json();
    const content=dec(d.content);
    const layoutM=content.match(/^layout:\s*(.+)$/m);
    const layout=layoutM?layoutM[1].trim():'home';
    const resIdx=await ghGet('index.html');
    if(!resIdx.ok)return;
    const di=await resIdx.json();
    await ghPut('index.html','Aggiorna home page',`---\nlayout: ${layout}\n---`,di.sha);
  }catch(e){}
}
