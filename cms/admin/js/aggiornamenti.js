// ============ AGGIORNAMENTI ============
const CMS_SOURCE_REPO='cialdecompatibili-netizen/cmspush';
const CMS_SOURCE_PATH='admin/index.html';
const CMS_VERSION_PATH='version.json';

async function controllaAggiornamenti(){
  showMsg('msg-update','⏳ Controllo in corso...','');
  let verLocale=null;
  const resL=await ghGet(CMS_VERSION_PATH);
  if(resL.ok){
    const dL=await resL.json();
    verLocale=JSON.parse(dec(dL.content));
  } else {
    try{
      const base=location.href.replace(/\/admin\/.*$/,'/');
      const resF=await fetch(base+'version.json?_='+Date.now());
      if(resF.ok)verLocale=await resF.json();
    }catch(e){}
  }
  if(!verLocale)return showMsg('msg-update','⚠️ Apri il CMS dal tuo sito GitHub Pages per controllare gli aggiornamenti.','err');
  document.getElementById('ver-locale').textContent=verLocale.version||'–';
  const resR=await fetch(`https://api.github.com/repos/${CMS_SOURCE_REPO}/contents/${CMS_VERSION_PATH}`);
  if(!resR.ok)return showMsg('msg-update','❌ Impossibile raggiungere il server di aggiornamento.','err');
  const dR=await resR.json();
  const verRemota=JSON.parse(dec(dR.content));
  document.getElementById('ver-remota').textContent=verRemota.version||'–';
  if(verRemota.version===verLocale.version){
    showMsg('msg-update','✅ Sei già alla versione più recente!','ok');
    document.getElementById('update-card-new').style.display='none';
    document.getElementById('update-badge').style.display='none';
  } else {
    showMsg('msg-update','','');
    document.getElementById('update-notes').innerHTML=`<strong>Cosa c'è di nuovo:</strong><br>${verRemota.changelog||verRemota.notes||'Miglioramenti generali.'}`;
    document.getElementById('update-card-new').style.display='block';
    document.getElementById('update-badge').style.display='inline-block';
  }
}

async function eseguiAggiornamento(){
  if(!tok())return showMsg('msg-update2','⚠️ Token mancante!','err');
  document.getElementById('btn-aggiorna').disabled=true;
  showMsg('msg-update2','⏳ Download aggiornamento...','');
  const resSrc=await fetch(`https://api.github.com/repos/${CMS_SOURCE_REPO}/contents/${CMS_SOURCE_PATH}`);
  if(!resSrc.ok){document.getElementById('btn-aggiorna').disabled=false;return showMsg('msg-update2','❌ Errore download.','err');}
  const dSrc=await resSrc.json();
  const nuovoContenuto=dec(dSrc.content);
  const resLoc=await ghGet(CMS_SOURCE_PATH);
  if(!resLoc.ok){document.getElementById('btn-aggiorna').disabled=false;return showMsg('msg-update2','❌ Errore lettura file locale.','err');}
  const dLoc=await resLoc.json();
  showMsg('msg-update2','⏳ Installazione...','');
  const resPut=await ghPut(CMS_SOURCE_PATH,'Aggiornamento CMS',nuovoContenuto,dLoc.sha);
  if(!resPut.ok){document.getElementById('btn-aggiorna').disabled=false;return showMsg('msg-update2','❌ Errore installazione.','err');}
  const resVer=await fetch(`https://api.github.com/repos/${CMS_SOURCE_REPO}/contents/${CMS_VERSION_PATH}`);
  const dVer=await resVer.json();
  const resVerLoc=await ghGet(CMS_VERSION_PATH);
  const dVerLoc=await resVerLoc.json();
  await ghPut(CMS_VERSION_PATH,'Aggiorna versione CMS',dec(dVer.content),dVerLoc.sha);
  showMsg('msg-update2','✅ Aggiornato! La pagina si ricarica in 3 secondi...','ok');
  setTimeout(()=>location.reload(),3000);
}
