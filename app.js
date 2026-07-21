
let stations=[], lang=localStorage.getItem('lang')||'de', current=0;
const state=JSON.parse(localStorage.getItem('rallyeState')||'{}');
const views=[...document.querySelectorAll('.view')];
function t(el){const v=el.dataset[lang]; if(v!==undefined) el.textContent=v}
function translate(){document.documentElement.lang=lang;document.querySelectorAll('[data-de]').forEach(t);document.getElementById('langBtn').textContent=lang==='de'?'FR':'DE';renderList();if(document.getElementById('station').classList.contains('active'))renderStation(current)}
function show(id){views.forEach(v=>v.classList.toggle('active',v.id===id));scrollTo(0,0);if(id==='list')renderList()}
function save(){localStorage.setItem('rallyeState',JSON.stringify(state))}
function renderList(){
 const box=document.getElementById('stationList'); if(!box||!stations.length)return;
 box.innerHTML=stations.map((s,i)=>`<div class="station-item ${state[s.id]?.done?'done':''}" data-open="${i}">
 <div class="station-num">${state[s.id]?.done?'✓':s.id}</div><div class="station-main">
 <h3>${lang==='de'?s.title_de:s.title_fr}</h3><p>${lang==='de'?s.motto_de:s.motto_fr}</p></div><b>›</b></div>`).join('');
 box.querySelectorAll('[data-open]').forEach(x=>x.onclick=()=>{current=+x.dataset.open;renderStation(current);show('station')});
 const score=stations.filter(s=>state[s.id]?.done).length*10;document.getElementById('score').textContent=score;
}
function renderStation(i){
 const s=stations[i], saved=state[s.id]||{answers:[]};
 document.getElementById('stationCounter').textContent=`${s.id} / ${stations.length}`;
 const qs=lang==='de'?s.questions_de:s.questions_fr;
 document.getElementById('stationCard').innerHTML=`
 <div class="badge" style="background:#17324d;color:white">📍 ${lang==='de'?'Station':'Étape'} ${s.id}</div>
 <h2>${lang==='de'?s.title_de:s.title_fr}</h2><div class="motto">${lang==='de'?s.motto_de:s.motto_fr}</div>
 <div class="info">💡 ${lang==='de'?s.info_de:s.info_fr}</div>
 ${qs.map((q,n)=>`<div class="task"><label>${n+1}. ${q}</label><textarea rows="2" data-answer="${n}">${saved.answers?.[n]||''}</textarea></div>`).join('')}
 <div class="photo">📷 <b>${lang==='de'?'Foto-Challenge':'Défi photo'}:</b><br>${lang==='de'?s.photo_de:s.photo_fr}</div>
 <div class="actions"><a class="maplink" href="${s.map}" target="_blank">🗺️ ${lang==='de'?'Karte':'Carte'}</a>
 <button class="complete ${saved.done?'completed':''}">${saved.done?(lang==='de'?'Erledigt ✓':'Terminé ✓'):(lang==='de'?'Abhaken':'Valider')}</button></div>`;
 document.querySelectorAll('[data-answer]').forEach(a=>a.oninput=()=>{state[s.id]=state[s.id]||{answers:[]};state[s.id].answers[a.dataset.answer]=a.value;save()});
 document.querySelector('.complete').onclick=()=>{state[s.id]=state[s.id]||{answers:[]};state[s.id].done=!state[s.id].done;save();renderStation(i);if(stations.every(x=>state[x.id]?.done)){document.getElementById('finishText').textContent=(lang==='de'?'Euer Team hat alle Stationen abgeschlossen und 100 Punkte gesammelt.':'Votre équipe a terminé toutes les étapes et obtenu 100 points.');show('finish')}};
}
fetch('stations.json').then(r=>r.json()).then(d=>{stations=d;translate()});
document.getElementById('langBtn').onclick=()=>{lang=lang==='de'?'fr':'de';localStorage.setItem('lang',lang);translate()};
document.getElementById('startBtn').onclick=()=>{localStorage.setItem('teamName',document.getElementById('teamName').value);show('list')};
document.querySelectorAll('[data-nav]').forEach(b=>b.onclick=()=>show(b.dataset.nav));
document.getElementById('resetBtn').onclick=()=>{localStorage.removeItem('rallyeState');location.reload()};
let deferredPrompt;window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;document.getElementById('installBtn').hidden=false});
document.getElementById('installBtn').onclick=async()=>{if(deferredPrompt){deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null}};
if('serviceWorker'in navigator)navigator.serviceWorker.register('sw.js');
