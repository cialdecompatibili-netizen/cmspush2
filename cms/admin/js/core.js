// ============ CORE — funzioni condivise ============
function detectRepo(){
  const h=location.hostname;
  const p=location.pathname;
  const match=h.match(/^([^.]+)\.github\.io$/);
  if(!match)return localStorage.getItem('cms_repo')||'';
  const user=match[1];
  const parts=p.split('/').filter(Boolean);
  const repo=(parts.length>1 && parts[0]!=='admin')?parts[0]:'';
  return repo?`${user}/${repo}`:`${user}/${user}.github.io`;
}
const REPO=detectRepo();

(function(){
  const base=location.origin+location.pathname.replace(/\/admin\/?.*$/,'/');
  document.getElementById('topbar-site-link').href=base;
  document.getElementById('topbar-admin-link').href=base+'admin/';
  document.getElementById('topbar-deploy-link').href=`https://github.com/${REPO}/actions`;
})();

function tok(){return localStorage.getItem('gh_token');}
function enc(s){return btoa(unescape(encodeURIComponent(s)));}
function dec(s){return decodeURIComponent(escape(atob(s.replace(/\n/g,''))));}
function showMsg(id,txt,cls){const m=document.getElementById(id);m.textContent=txt;m.className='msg '+cls;}
async function ghGet(path){return fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':`token ${tok()}`}});}
async function ghPut(path,msg,content,sha){
  const body={message:msg,content:enc(content)};if(sha)body.sha=sha;
  return fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':`token ${tok()}`,'Content-Type':'application/json'},body:JSON.stringify(body)});
}

function showPage(id,btn){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(b=>b.classList.remove('active'));
  document.getElementById('page-'+id).classList.add('active');
  btn.classList.add('active');
}

function slugify(s){
  return s.toLowerCase()
    .replace(/[àáâ]/g,'a').replace(/[èéê]/g,'e')
    .replace(/[ìí]/g,'i').replace(/[òó]/g,'o').replace(/[ùú]/g,'u')
    .replace(/[^a-z0-9\s-]/g,'').trim().replace(/\s+/g,'-');
}

function legacyMdToHtml(md){
  return md
    .replace(/^### (.+)$/gm,'<h3>$1</h3>')
    .replace(/^## (.+)$/gm,'<h2>$1</h2>')
    .replace(/^# (.+)$/gm,'<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
    .replace(/\*(.+?)\*/g,'<em>$1</em>')
    .replace(/\[(.+?)\]\((.+?)\)/g,'<a href="$2">$1</a>')
    .replace(/^- (.+)$/gm,'<li>$1</li>')
    .replace(/\n\n/g,'</p><p>')
    .replace(/\n/g,'<br>');
}
