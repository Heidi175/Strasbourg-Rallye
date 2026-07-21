
let stations=[],lang=localStorage.getItem('lang')||'de',current=0,userPos=null,route=localStorage.getItem('route')||'compact';
const hasLanguageChoice=()=>!!localStorage.getItem('languageChosen');
let state=JSON.parse(localStorage.getItem('strasRallyeFinal')||'{}');
const V=[...document.querySelectorAll('.view')], tx=(de,fr)=>lang==='de'?de:fr;
function save(){localStorage.setItem('strasRallyeFinal',JSON.stringify(state))}
function translate(){
document.documentElement.lang=lang;
document.title=lang==='de'?'Straßburg entdecken – Stadtrallye':'Découvrir Strasbourg – Rallye urbaine';
document.querySelectorAll('[data-de]').forEach(e=>e.textContent=e.dataset[lang]);
const langBtn=document.getElementById('langBtn');
langBtn.textContent=lang==='de'?'🇩🇪 DE':'🇫🇷 FR';
langBtn.title=lang==='de'?'Sprache ändern':'Changer de langue';
renderList();
if(document.getElementById('station').classList.contains('active'))renderStation(current)
}
function show(id){V.forEach(v=>v.classList.toggle('active',v.id===id));scrollTo(0,0);if(id==='list')renderList()}
function activeStations(){return route==='compact'?stations.filter(s=>s.id!==10):stations}
function stats(){let done=0,skipped=0,q=0;activeStations().forEach(s=>{const x=state[s.id]||{};if(x.done)done++;if(x.skipped)skipped++;if(x.quizCorrect)q+=5});return{done,skipped,open:activeStations().length-done-skipped,score:done*10+q,total:activeStations().length}}
function km(a,b,c,d){const R=6371,p=Math.PI/180,x=(c-a)*p,y=(d-b)*p;const h=Math.sin(x/2)**2+Math.cos(a*p)*Math.cos(c*p)*Math.sin(y/2)**2;return 2*R*Math.asin(Math.sqrt(h))}
function distanceText(s){if(!userPos)return'';const d=km(userPos.lat,userPos.lon,s.lat,s.lon);return d<1?Math.round(d*1000)+' m':d.toFixed(1)+' km'}
function renderList(){const box=document.getElementById('stationList');if(!box||!stations.length)return;const list=activeStations();
box.innerHTML=list.map(s=>{let x=state[s.id]||{},cls=x.done?'done':x.skipped?'skipped':'',icon=x.done?'✓':x.skipped?'–':s.id;return`<div class="station-item ${cls}" data-open="${stations.indexOf(s)}"><div class="station-num">${icon}</div><div class="station-main"><h3>${lang==='de'?s.title_de:s.title_fr}</h3><p>${x.skipped?tx('Ausgelassen','Étape sautée'):(lang==='de'?s.motto_de:s.motto_fr)}</p><div class="distance">${distanceText(s)}</div></div><b>›</b></div>`}).join('');
box.querySelectorAll('[data-open]').forEach(e=>e.onclick=()=>{current=+e.dataset.open;renderStation(current);show('station')});
const a=stats();document.getElementById('score').textContent=a.score;document.getElementById('summaryBar').innerHTML=`<span>✓ ${a.done} ${tx('erledigt','terminées')}</span><span>– ${a.skipped} ${tx('ausgelassen','sautées')}</span><span>○ ${a.open} ${tx('offen','ouvertes')}</span>`;
document.getElementById('locationNote').textContent=userPos?tx('Entfernungen basieren auf eurem aktuellen Standort.','Les distances sont calculées depuis votre position actuelle.'):tx('Standortfreigabe ist optional. Ohne sie funktioniert die Rallye ebenfalls.','Le partage de position est facultatif. La rallye fonctionne aussi sans lui.')}
function speak(s){speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(lang==='de'?s.info_de:s.info_fr);u.lang=lang==='de'?'de-DE':'fr-FR';speechSynthesis.speak(u)}
function renderStation(i){const s=stations[i],x=state[s.id]||{answers:[]},qs=lang==='de'?s.questions_de:s.questions_fr,q=s.quiz;
document.getElementById('stationCounter').textContent=`${s.id} / ${activeStations().length}`;
document.getElementById('stationCard').innerHTML=`<div class="seal" style="background:#15324a;color:#fff;min-width:64px;min-height:64px">📍<br>${s.id}</div><h2>${lang==='de'?s.title_de:s.title_fr}</h2><div class="motto">${lang==='de'?s.motto_de:s.motto_fr}</div>
<div class="tools"><button class="toolbtn" id="speakBtn">🔊 ${tx('Vorlesen','Écouter')}</button>${distanceText(s)?`<span class="toolbtn">📏 ${distanceText(s)}</span>`:''}</div>
<div class="info">${lang==='de'?s.info_de:s.info_fr}</div>
${qs.map((z,n)=>`<div class="task"><label>${n+1}. ${z}</label><textarea rows="2" data-answer="${n}" ${x.skipped?'disabled':''}>${x.answers?.[n]||''}</textarea></div>`).join('')}
<div class="quiz"><b>🧩 ${tx('Quizfrage','Question quiz')}</b><p>${lang==='de'?q.q_de:q.q_fr}</p>${q.options.map((o,n)=>`<label><input type="radio" name="quiz" value="${n}" ${x.quizChoice==n?'checked':''} ${x.skipped?'disabled':''}> ${o}</label>`).join('')}<div>${x.quizChoice!==undefined?(x.quizCorrect?'✅ '+tx('Richtig!','Correct !'):'❌ '+tx('Noch einmal überlegen.','Réfléchissez encore.')):''}</div></div>
<div class="photo">📷 <b>${tx('Foto-Challenge','Défi photo')}:</b><br>${lang==='de'?s.photo_de:s.photo_fr}<input type="file" id="photoInput" accept="image/*" capture="environment" ${x.skipped?'disabled':''}>${x.photo?`<img class="preview" src="${x.photo}">`:''}</div>
<div class="actions"><a class="maplink" target="_blank" href="https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lon}">🧭 ${tx('Navigation','Itinéraire')}</a><button class="complete ${x.done?'completed':''}">${x.done?tx('Erledigt ✓','Terminé ✓'):tx('Abschließen','Valider')}</button></div>
<button class="skip full ${x.skipped?'skippedbtn':''}">${x.skipped?tx('Auslassen rückgängig','Annuler le saut'):tx('Station auslassen','Sauter cette étape')}</button><p style="font-size:.8rem;color:#68727c">${tx('Auslassen ist ausdrücklich erlaubt und wird nicht negativ gewertet.','Sauter une étape est autorisé et sans pénalité.')}</p>`;
document.getElementById('speakBtn').onclick=()=>speak(s);document.querySelectorAll('[data-answer]').forEach(a=>a.oninput=()=>{state[s.id]=state[s.id]||{answers:[]};state[s.id].answers[a.dataset.answer]=a.value;save()});
document.querySelectorAll('input[name=quiz]').forEach(r=>r.onchange=()=>{state[s.id]=state[s.id]||{answers:[]};state[s.id].quizChoice=+r.value;state[s.id].quizCorrect=+r.value===q.answer;save();renderStation(i)});
document.getElementById('photoInput').onchange=e=>{const f=e.target.files[0];if(!f)return;const rd=new FileReader();rd.onload=()=>{state[s.id]=state[s.id]||{answers:[]};state[s.id].photo=rd.result;save();renderStation(i)};rd.readAsDataURL(f)};
document.querySelector('.complete').onclick=()=>{state[s.id]=state[s.id]||{answers:[]};state[s.id].done=!state[s.id].done;if(state[s.id].done)state[s.id].skipped=false;save();renderStation(i)};
document.querySelector('.skip').onclick=()=>{state[s.id]=state[s.id]||{answers:[]};state[s.id].skipped=!state[s.id].skipped;if(state[s.id].skipped)state[s.id].done=false;save();renderStation(i)}}
function finish(){const a=stats(),team=localStorage.getItem('teamName')||tx('Euer Team','Votre équipe');document.getElementById('finishText').textContent=tx(`${team} hat ${a.done} Stationen besucht, ${a.skipped} ausgelassen und ${a.score} Punkte gesammelt.`,`${team} a visité ${a.done} étapes, en a sauté ${a.skipped} et obtenu ${a.score} points.`);show('finish')}
function exportData(){const p={team:localStorage.getItem('teamName')||'',date:new Date().toISOString(),route,summary:stats(),stations:activeStations().map(s=>({id:s.id,title:s.title_de,status:state[s.id]?.done?'done':state[s.id]?.skipped?'skipped':'open',answers:state[s.id]?.answers||[],quizCorrect:!!state[s.id]?.quizCorrect}))};const b=new Blob([JSON.stringify(p,null,2)],{type:'application/json'}),u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download='strassburg-rallye-ergebnis.json';a.click();URL.revokeObjectURL(u)}
function cert(){const a=stats(),team=localStorage.getItem('teamName')||'________________';const w=open('','_blank');w.document.write(`<!doctype html><meta charset="utf-8"><style>body{font-family:Georgia,serif;text-align:center;padding:7vh;color:#15324a}main{border:9px double #d7aa4e;padding:8vh 5vw}h1{font-size:3rem}.name{font-size:2.2rem;border-bottom:2px solid;padding:20px}p{font-size:1.25rem;line-height:1.6}@media print{button{display:none}}</style><main><h1>Certificat · Urkunde</h1><h2>Explorateur / Exploratrice de Strasbourg</h2><div class="name">${team}</div><p>${tx(`hat ${a.done} Stationen entdeckt und ${a.score} Punkte erreicht.`,`a découvert ${a.done} étapes et obtenu ${a.score} points.`)}</p><p>À bientôt Strasbourg!</p><button onclick="print()">Drucken / Imprimer</button></main>`);w.document.close()}
fetch('stations.json').then(r=>r.json()).then(d=>{stations=d;document.getElementById('teamName').value=localStorage.getItem('teamName')||'';document.querySelector(`[data-route="${route}"]`).classList.add('selected');translate();if(navigator.geolocation)navigator.geolocation.getCurrentPosition(p=>{userPos={lat:p.coords.latitude,lon:p.coords.longitude};renderList()},()=>{})});
document.querySelectorAll('[data-route]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-route]').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');route=b.dataset.route;localStorage.setItem('route',route)});
function openLanguageGate(){document.getElementById('languageGate').classList.remove('hidden')}
function chooseLanguage(chosen){
lang=chosen;
localStorage.setItem('lang',lang);
localStorage.setItem('languageChosen','yes');
document.getElementById('languageGate').classList.add('hidden');
translate()
}
document.querySelectorAll('[data-set-language]').forEach(b=>b.onclick=()=>chooseLanguage(b.dataset.setLanguage));
document.getElementById('langBtn').onclick=openLanguageGate;
if(hasLanguageChoice())document.getElementById('languageGate').classList.add('hidden');document.getElementById('startBtn').onclick=()=>{localStorage.setItem('teamName',document.getElementById('teamName').value.trim());show('list')};document.querySelectorAll('[data-nav]').forEach(b=>b.onclick=()=>show(b.dataset.nav));document.getElementById('finishBtn').onclick=finish;document.getElementById('exportBtn').onclick=exportData;document.getElementById('certificateBtn').onclick=cert;document.getElementById('resetBtn').onclick=()=>{if(confirm(tx('Wirklich alle lokalen Daten löschen?','Effacer toutes les données locales ?'))){localStorage.removeItem('strasRallyeFinal');localStorage.removeItem('teamName');location.reload()}};
let deferredPrompt;addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;document.getElementById('installBtn').hidden=false});document.getElementById('installBtn').onclick=async()=>{if(deferredPrompt){deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null}};if('serviceWorker'in navigator)navigator.serviceWorker.register('sw.js');
