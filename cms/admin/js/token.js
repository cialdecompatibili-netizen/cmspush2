// ============ TOKEN ============
function salvaToken(){
  const t=document.getElementById('token-input').value.trim();
  if(!t)return;
  localStorage.setItem('gh_token',t);
  showMsg('msg-token','✅ Token salvato!','ok');
  document.getElementById('token-input').value='';
}
function cancellaToken(){localStorage.removeItem('gh_token');showMsg('msg-token','🗑 Token rimosso.','ok');}
function toggleToken(){const i=document.getElementById('token-input');i.type=i.type==='password'?'text':'password';}

function salvaTokenOnboarding(){
  var t=document.getElementById('onboarding-token').value.trim();
  if(!t||!t.startsWith('ghp_'))return showMsg('msg-onboarding','Incolla un token valido (inizia con ghp_)','err');
  localStorage.setItem('gh_token',t);
  document.getElementById('onboarding-overlay').style.display='none';
  document.getElementById('token-input').value=t;
  initCMS();
}
