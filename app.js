"use strict";
/* Coach Hub v2 — cinematic, voice-first. Demo-Daten; im echten System: Whoop, Gym-App, Kalender, Cloud-Gehirn. */

const COACHES = {
  viktor:{ name:"Viktor", role:"Head Coach", vibe:"ruhig · strategisch", hex:"#8b7ff0", ini:"V", rate:0.97, pitch:0.9 },
  deniz:{ name:"Deniz", role:"Sport", vibe:"energisch · direkt", hex:"#ff7a4d", ini:"D", rate:1.08, pitch:1.0 },
  lena:{ name:"Lena", role:"Ernährung", vibe:"pragmatisch · locker", hex:"#96d94e", ini:"L", rate:1.03, pitch:1.1 },
  peter:{ name:"Peter", role:"Beruf", vibe:"klar · ermutigend", hex:"#5aa9f5", ini:"P", rate:1.0, pitch:0.9 },
  elias:{ name:"Elias", role:"Mental", vibe:"warm · guter Zuhörer", hex:"#f06a9e", ini:"E", rate:0.94, pitch:0.95 },
  mara:{ name:"Mara", role:"Anker", vibe:"entschleunigend · weise", hex:"#3fd6ad", ini:"M", rate:0.92, pitch:1.05 },
};
const ORDER = Object.keys(COACHES);

const DEMO = {
  recovery: 64, sleep:"5 h 40 min", hrv:"38 ms",
  lastWorkout:{ name:"Bankdrücken", top:"82,5 kg × 8", pr:"+2,5 kg PR" },
  calendar:[
    { t:"09:00", title:"Team-Meeting Projekt Nord", sub:"Peter bereitet dich vor", id:"peter" },
    { t:"12:30", title:"Freier Slot", sub:"Deniz schlägt vor: 45 min Beine", id:"deniz" },
    { t:"15:00", title:"Kundengespräch", sub:"Dein Fokus heute · Push um 14:45", id:"peter" },
    { t:"19:30", title:"Abendessen mit Anna", sub:"Mara: bewusst offline", id:"mara" },
  ],
};

const SCRIPTS = {
  elias: {
    intro:[["elias","Marco, kurz ehrlich unter uns: Ich seh in deinen Whoop-Daten, dass die Nacht kurz war — 5 Stunden 40, HRV deutlich unter deinem Schnitt. Und die Woche ist voll. Wie geht's dir gerade wirklich?"]],
    chips:[
      { t:"Ehrlich? Bin ziemlich durch.", next:"tired" },
      { t:"Geht schon, nur viel los.", next:"busy" },
    ],
    branches:{
      tired:{ m:[["elias","Danke, dass du's nicht wegdrückst. Durch sein ist ein Signal, kein Versagen. Lass uns den Tag nicht perfekt machen, sondern überstehbar: Was ist heute das EINE, das wirklich zählen würde?"]],
        chips:[{ t:"Das Kundengespräch um 15 Uhr.", next:"tired2" }] },
      tired2:{ m:[["elias","Gut. Dann ist alles andere heute Kür. Ich hab zwei Gedanken: Peter kann dir für 15 Uhr drei klare Punkte vorbereiten — und ich würde Deniz bitten, das Beintraining auf morgen zu schieben. Einverstanden?"]],
        chips:[{ t:"Ja, mach das bitte.", next:"tired3" },{ t:"Training will ich trotzdem.", next:"tired4" }] },
      tired3:{ m:[["sys","Elias stimmt sich mit Peter und Deniz ab"],["elias","Erledigt. Peter meldet sich um 14:45 mit deinen drei Punkten, Deniz hat verschoben — er lässt ausrichten: „Morgen dafür richtig.“ Und heute Abend beim Essen mit Anna: Handy weg, Kopf aus. Das ist dein eigentliches Training heute."]],
        chips:[{ t:"Danke, Elias.", next:"end_warm" }] },
      tired4:{ m:[["elias","Okay, ich hör dich. Dann lass es uns wenigstens smart machen — ich geb an Deniz weiter, dass er die Intensität an deine Erholung anpasst. Deal?"]],
        chips:[{ t:"Deal.", next:"handoff_deniz" }] },
      busy:{ m:[["elias","„Viel los“ kenn ich von dir — meistens stimmt's, manchmal ist es auch die höfliche Version von „zu viel“. Deine Daten sagen eher Letzteres. Magst du mir in einem Satz sagen, was dir am meisten Druck macht?"]],
        chips:[{ t:"Das Kundengespräch heute.", next:"tired2" },{ t:"Ehrlich gesagt: alles zusammen.", next:"tired" }] },
      end_warm:{ m:[["elias","Immer. Dafür bin ich da. Ich meld mich heute Abend nochmal kurz — nicht um zu kontrollieren, nur um zu fragen, wie's war. Ab 22 Uhr ist Ruhezeit, danach hörst du nichts mehr von uns."]], chips:[] },
      handoff_deniz:{ m:[["sys","Elias hat Deniz gebrieft — Übergabe"],["deniz","Marco, Deniz hier. Elias hat mir Bescheid gegeben. Recovery ist bei 64 Prozent — wir machen heute Technik statt Tonnage: 4 Sätze, RPE 7, kein Grinden. Du gehst raus mit dem Gefühl, trainiert zu haben, nicht zerstört. Passt?"]],
        chips:[{ t:"Passt. Danke euch.", next:"end_deniz" }] },
      end_deniz:{ m:[["deniz","So machen wir das. Zielgewichte hab ich in deiner Trainings-App angepasst — steht im Logbuch, kannst du jederzeit zurückdrehen."],["sys","Aktion: Zielgewichte angepasst (widerrufbar) → Logbuch"]], chips:[] },
    },
  },
  deniz: {
    intro:[["deniz","Marco! Gestern Bankdrücken: 82,5 Kilo mal 8 — neuer Rekord, plus 5 Prozent Volumen. Das war stark. Aber ich hab deine Whoop-Daten gesehen: Recovery 64 Prozent. Deshalb Vorschlag für heute: Technik-Session statt schwere Beine."]],
    chips:[
      { t:"Was heißt das konkret?", next:"plan" },
      { t:"Ich fühl mich eigentlich fit.", next:"pushback" },
    ],
    branches:{
      plan:{ m:[["deniz","Kniebeuge 4 mal 6 bei 70 Prozent — sauber und explosiv, kein Grinden. Dazu Bulgarian Split Squats und Core. 45 Minuten, du bist um Viertel nach eins fertig. Soll ich dir den 12:30-Slot im Kalender eintragen?"]],
        chips:[{ t:"✓ Ja, eintragen", next:"confirm" },{ t:"Lieber morgen früh.", next:"tomorrow" }] },
      confirm:{ m:[["sys","Vorschlag bestätigt — Kalendereintrag 12:30 „Beine (Technik)“ erstellt"],["deniz","Drin! Und in deiner Trainings-App hab ich die Zielgewichte schon hinterlegt — beim ersten Satz siehst du alles. Lena weiß Bescheid und plant dein Mittagessen fürs Training. Läuft."]],
        chips:[{ t:"Top.", next:"end" }] },
      tomorrow:{ m:[["deniz","Auch gut — morgen ist die Recovery wahrscheinlich besser, dann können wir mehr draufpacken. Ich schlag dir morgen 7 Uhr vor und frag dich heute Abend nochmal. Nichts wird eingetragen, ohne dass du bestätigst."]],
        chips:[{ t:"Perfekt so.", next:"end" }] },
      pushback:{ m:[["deniz","Und genau deshalb liebe ich deinen Antrieb — aber die Zahlen sind die Zahlen: HRV runter, Schlaf kurz. Weißt du, was Top-Athleten von Hobby-Athleten unterscheidet? Sie trainieren hart, wenn der Körper bereit ist — und smart, wenn nicht. Heute ist smart."]],
        chips:[{ t:"Okay, überzeugt.", next:"plan" },{ t:"Was sagt Mara dazu?", next:"mara_in" }] },
      mara_in:{ m:[["sys","Deniz hat Mara dazugeholt"],["mara","Marco, Mara hier. Ich sag's dir einfacher als Deniz: Du hast diese Woche schon genug bewiesen. Ein lockerer Tag nimmt dir nichts weg — er gibt dir morgen zurück. Der Rekord von gestern läuft dir nicht davon."]],
        chips:[{ t:"Ihr habt ja recht.", next:"plan" }] },
      end:{ m:[["deniz","Bis später!"]], chips:[] },
    },
  },
  viktor: {
    intro:[["viktor","Morgen, Marco. Kurzer Lagebericht: Recovery 64 Prozent — die Nacht war kurz. Dein Tag hat zwei berufliche Schwerpunkte, das Kundengespräch um 15 Uhr ist der wichtigste. Deniz will das Training anpassen, Elias hat ein Auge auf dich, Mara und ich diskutieren gerade die Belastung für nächste Woche. Womit soll ich anfangen?"]],
    chips:[
      { t:"Was ist heute Priorität?", next:"prio" },
      { t:"Worüber diskutiert ihr?", next:"debate_teaser" },
    ],
    branches:{
      prio:{ m:[["viktor","Eine Sache: das Kundengespräch. Wenn das gut läuft, war der Tag ein Erfolg — unabhängig vom Rest. Peter bereitet dich um 14:45 vor, das Training ist auf „smart“ gestellt, und der Abend gehört Anna. Mehr muss heute nicht passieren."]],
        chips:[{ t:"Klingt nach einem Plan.", next:"end" }] },
      debate_teaser:{ m:[["viktor","Mara und ich sind uns über nächste Woche nicht einig — ich will einen Trainingsblock draufsetzen, sie bremst. Wir tragen das gerade im Team aus. Hör einfach rein: Im Team-Tab findest du die Runde live."]],
        chips:[{ t:"Ja, da hör ich rein.", next:"end2" }] },
      end:{ m:[["viktor","So ist es. Ich melde mich am Abend mit dem Tagesabschluss."]], chips:[] },
      end2:{ m:[["viktor","Gut. Deine Meinung zählt am Ende sowieso am meisten."]], chips:[] },
    },
  },
  peter: {
    intro:[["peter","Marco, um 15 Uhr ist das Kundengespräch — ich hab dich vorbereitet. Drei Punkte: Erstens, führe mit dem Ergebnis vom letzten Quartal, das ist deine stärkste Karte. Zweitens, wenn der Preis kommt: nicht rechtfertigen, rückfragen. Drittens, du willst mit einem konkreten nächsten Termin rausgehen. Willst du die Einwände kurz durchspielen?"]],
    chips:[
      { t:"Ja, spiel den Preis-Einwand.", next:"roleplay" },
      { t:"Nein, die 3 Punkte reichen.", next:"done" },
    ],
    branches:{
      roleplay:{ m:[["peter","Okay, ich bin der Kunde: „Das ist deutlich teurer als das Angebot Ihres Mitbewerbers.“ — Und jetzt du. Denk dran: rückfragen, nicht rechtfertigen."]],
        chips:[{ t:"„Verstehe — was genau vergleichen Sie?“", next:"rp2" }] },
      rp2:{ m:[["peter","Genau so. Du drehst das Gespräch von Preis auf Inhalt — dort gewinnst du. Im fertigen System machen wir sowas komplett per Sprache, mit echtem Hin und Her. Du bist bereit. Ich ping dich um 14:45 nochmal an."]],
        chips:[{ t:"Danke, Peter.", next:"end" }] },
      done:{ m:[["peter","Reicht auch. Du kannst das. Um 14:45 kommt ein kurzer Fokus-Push von mir — danach Flugmodus-Mentalität bis 16 Uhr."]], chips:[] },
      end:{ m:[["peter","Gern. Und nach dem Gespräch will ich's wissen: Was lief gut? Das notieren wir uns fürs nächste Mal."]], chips:[] },
    },
  },
  lena: {
    intro:[["lena","Hey Marco! Kurze Sache: Wenn du um 12:30 trainierst, iss vorher nicht schwer — dein Speiseplan hat heute die Bowl, die passt perfekt danach als spätes Mittag. Und heute Abend bist du bei Anna essen: Genieß das einfach. Kein Tracking, kein schlechtes Gewissen. Versprochen?"]],
    chips:[
      { t:"Versprochen!", next:"end" },
      { t:"Was esse ich vor dem Training?", next:"pre" },
    ],
    branches:{
      pre:{ m:[["lena","Was Kleines, schnell Verfügbares: Banane plus ein paar Nüsse, oder ein Joghurt mit Honig — 60 bis 90 Minuten vorher. Nichts Großes, sonst liegt's dir in der Kniebeuge im Magen. Die Bowl danach hat dann Protein und Kohlenhydrate für die Erholung."]],
        chips:[{ t:"Easy, mach ich.", next:"end" }] },
      end:{ m:[["lena","Sehr gut. Guten Hunger später!"]], chips:[] },
    },
  },
  mara: {
    intro:[["mara","Marco. Bevor dieser Tag losrennt — atme einmal durch. Gestern hast du einen Rekord aufgestellt. Hast du dir eigentlich einen Moment genommen, das zu würdigen? Oder war der Kopf sofort beim Nächsten?"]],
    chips:[
      { t:"…sofort beim Nächsten.", next:"pause" },
      { t:"Hab ich, kurz.", next:"good" },
    ],
    branches:{
      pause:{ m:[["mara","Dacht ich mir. Dann jetzt, dreißig Sekunden: 82,5 Kilo. Vor einem halben Jahr hättest du das nicht geglaubt. Das bist du gewesen — nicht dein Plan, nicht deine App, du. Es zählt schon jetzt, nicht erst, wenn's hundert sind."]],
        chips:[{ t:"Danke. Tut gut, das zu hören.", next:"end" }] },
      good:{ m:[["mara","Gut. Das ist keine Kleinigkeit — die meisten rennen von Ziel zu Ziel und wundern sich, warum es sich leer anfühlt. Du lernst das gerade. Heute Abend bei Anna: Da ist dein Leben, nicht in der App."]],
        chips:[{ t:"So machen wir's.", next:"end" }] },
      end:{ m:[["mara","Ich bin da, wenn's schneller wird, als dir guttut. Bis dahin: Genieß den Tag."]], chips:[] },
    },
  },
  marathon: {
    isTeam:true,
    parts:["viktor","deniz","lena","peter","elias","mara"],
    intro:[
      ["sys","Sonderbesprechung · dein Thema: Marathon im Herbst"],
      ["viktor","Marco hat ein Thema mitgebracht: Er überlegt, im Herbst einen Marathon zu laufen. Zehn Wochen Vorbereitung. Ich will von jedem eine ehrliche Einschätzung. Deniz?"],
      ["deniz","Ich liebe die Idee! Aber ehrlich: Zehn Wochen von null auf Marathon ist sportlich grenzwertig. Sein Kraft-Fundament ist top, die Ausdauerbasis nicht. Machbar wäre ein Halbmarathon im Herbst — und der volle im Frühjahr."],
      ["lena","Ernährungsseitig kein Problem, das kriegen wir hin — Laufumfänge heißen mehr Kohlenhydrate, das plane ich ein. Beim vollen Marathon in zehn Wochen würde ich aber ein Energiedefizit-Risiko sehen."],
      ["elias","Mir ist wichtig, warum Marco das will. Wenn es ein echtes Herzensziel ist, trägt das durch harte Wochen. Wenn es Beweis-Druck ist, wird es zur Belastung. Das würde ich vorher mit ihm klären."],
      ["mara","Ich bin nicht gegen den Traum — ich bin gegen den Termin. Der Herbst gehört schon dem Kundengeschäft und dem Krafttraining. Ein Frühjahrs-Marathon lässt dich ankommen statt hetzen."],
      ["viktor","Bemerkenswert einig. Empfehlung des Teams: Halbmarathon im Herbst als Etappenziel, voller Marathon im Frühjahr mit sauberem Aufbau. Deniz hätte den Plan in einer Woche fertig. Marco — dein Wort."],
    ],
    chips:[
      { t:"✓ Halbmarathon im Herbst", next:"half" },
      { t:"Ich will den vollen im Herbst.", next:"full" },
    ],
    branches:{
      half:{ m:[["sys","Entscheidung gespeichert → Logbuch · Deniz erstellt den Halbmarathon-Plan"],["deniz","Stark! Das wird richtig gut — erster Longrun am Samstag?"],["mara","Und der Frühjahrs-Marathon wird umso schöner."]], chips:[] },
      full:{ m:[["mara","Dann mit offenen Augen: Elias checkt wöchentlich dein Warum, Deniz baut maximal behutsam auf, und wenn der Körper Stopp sagt, hören wir hin. Einverstanden?"]],
        chips:[{ t:"Einverstanden.", next:"full2" }] },
      full2:{ m:[["sys","Entscheidung gespeichert → Logbuch · Plan mit wöchentlichem Check-in"],["viktor","Mutig. Wir stehen hinter dir — mit Leitplanken."]], chips:[] },
    },
  },
  team: {
    isTeam:true,
    parts:["viktor","mara","deniz"],
    intro:[
      ["sys","Team-Runde · Belastung nächste Woche · du hörst live mit"],
      ["viktor","Zur Sache: Marcos Kraftwerte steigen seit sechs Wochen stabil, der Rekord gestern bestätigt den Trend. Ich schlage vor, nächste Woche einen Intensivierungsblock zu fahren — vier Einheiten statt drei."],
      ["mara","Und ich schlage vor, dass wir erst auf den Menschen schauen statt auf die Kurve. Recovery heute: 64 Prozent. Schlaf unter sechs Stunden, dazu eine volle Arbeitswoche. Das ist kein Fundament für einen Block, Viktor."],
      ["viktor","Der Zeitpunkt ist günstig — Momentum ist real. Wer im Aufwind nicht steigert, verschenkt Anpassung."],
      ["mara","Und wer im Sturm das Segel vergrößert, kentert. Momentum nützt nichts, wenn der Körper die Rechnung schreibt. Ein einziger schlechter Block kostet mehr als eine ruhige Woche je kosten würde."],
      ["deniz","Wenn ich kurz darf — ich seh's in den Daten: Die Leistung kommt, aber die Erholungswerte werden seit zehn Tagen langsam schlechter. Beides ist wahr."],
      ["viktor","Gut. Dann der Mittelweg: Wir halten drei Einheiten, aber gestalten eine davon intensiver — und koppeln das an eine Bedingung: Recovery im Wochenschnitt über 70 Prozent, sonst fällt die Intensivierung."],
      ["mara","Damit kann ich leben. Eine Bedingung noch: Der Sonntag bleibt komplett frei. Kein Training, keine Optimierung, nichts."],
      ["viktor","Einverstanden. Marco — das ist unsere Empfehlung: drei Einheiten, eine davon intensiv, gekoppelt an deine Erholung, Sonntag frei. Das letzte Wort hast du."],
    ],
    chips:[
      { t:"✓ Empfehlung annehmen", next:"accept" },
      { t:"Ich will den vollen Block.", next:"full" },
    ],
    branches:{
      accept:{ m:[["sys","Entscheidung gespeichert → Logbuch · Deniz plant die Woche entsprechend"],["viktor","Gute Entscheidung. So gewinnt man auf Dauer."],["mara","Und der Sonntag gehört dir."]], chips:[] },
      full:{ m:[["mara","Dein gutes Recht — es ist dein Training. Dann wenigstens mit Sicherheitsnetz: Elias checkt täglich rein, und wenn die Recovery zwei Tage unter 60 fällt, brechen wir ab. Deal?"]],
        chips:[{ t:"Deal.", next:"full2" }] },
      full2:{ m:[["sys","Entscheidung gespeichert → Logbuch · Abbruch bei Recovery unter 60 an zwei Tagen"],["viktor","So machen wir's. Mutig, aber mit Leitplanken — das respektiere ich."]], chips:[] },
    },
  },
};

/* ===== Helpers ===== */
function el(h){ const d=document.createElement("div"); d.innerHTML=h.trim(); return d.firstChild; }
function esc(s){ return s.replace(/&/g,"&amp;").replace(/</g,"&lt;"); }
function orbStyle(id){
  const c=COACHES[id];
  return `background:radial-gradient(circle at 32% 28%, ${c.hex} 0%, ${shade(c.hex,-38)} 78%);box-shadow:0 10px 26px ${c.hex}2e, 0 3px 10px rgba(0,0,0,.10)`;
}
function shade(hex,p){
  const n=parseInt(hex.slice(1),16), a=x=>Math.min(255,Math.max(0,x+Math.round(255*p/100)));
  return "#"+[a(n>>16&255),a(n>>8&255),a(n&255)].map(x=>x.toString(16).padStart(2,"0")).join("");
}

/* ===== Voice engine ===== */
const store={ get(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } },
  set(k,v){ try{ localStorage.setItem(k,v); }catch(e){} } };
let voiceOn = store.get("voiceOn") !== "0";
let elKey = store.get("elKey")||"", elFail = false;
let anthKey = store.get("anthKey")||"";
let curHex="#8b7ff0";
let voices=[];
function loadVoices(){
  if(!window.speechSynthesis) return;
  const all=(speechSynthesis.getVoices()||[]).filter(v=>v.lang && v.lang.toLowerCase().startsWith("de"));
  const score=v=>{ const n=v.name.toLowerCase(); let s=0;
    if(n.includes("premium")) s+=40;
    if(n.includes("enhanced")||n.includes("erweitert")) s+=30;
    if(n.includes("siri")) s+=25;
    if(v.localService) s+=5;
    if(n.includes("eloquence")) s-=25;
    if(n.includes("compact")) s-=10;
    return s; };
  voices=all.sort((a,b)=>score(b)-score(a));
}
const MALE=["martin","markus","yannick","viktor","reed","aaron","rocko","hans","daniel","google deutsch"];
const FEMALE=["anna","helena","sandra","shelley","petra","marlene","zoe","katja","flo"];
function pickVoice(coachId){
  if(!voices.length) return null;
  const wantMale=["viktor","deniz","peter","elias"].includes(coachId);
  const names=wantMale?MALE:FEMALE;
  const pool=voices.filter(v=>names.some(x=>v.name.toLowerCase().includes(x)));
  const best=voices.slice(0, Math.max(3, Math.ceil(voices.length/2)));
  const list=pool.length?pool:best;
  return list[ORDER.indexOf(coachId)%list.length];
}
if(window.speechSynthesis){ loadVoices(); speechSynthesis.onvoiceschanged=loadVoices; }
function syncToggles(){
  document.querySelectorAll("#vtoggle,#vtoggle2").forEach(t=>t.classList.toggle("off",!voiceOn));
  const l=document.getElementById("vlabel");
  if(l) l.textContent = !voiceOn?"Stimmen aus":(elKey&&!elFail?"Studio an":"Stimmen an");
}
function toggleVoice(){ voiceOn=!voiceOn; store.set("voiceOn",voiceOn?"1":"0"); syncToggles();
  if(!voiceOn && window.speechSynthesis) speechSynthesis.cancel(); }
document.getElementById("vtoggle").onclick=toggleVoice;
document.getElementById("vtoggle2").onclick=toggleVoice;
syncToggles();

function estMs(text, rate){ return Math.max(1300, (text.split(/\s+/).length*330)/(rate||1)); }

/* ---- Studio-Stimmen (ElevenLabs) ---- */
const EL_VOICES={ viktor:"onwK4e9ZLuTAKqWW03F9", deniz:"TxGEqnHWrfWFTfGW9XjX", peter:"JBFqnCBsd6RMkjVDRZzb",
  elias:"ErXwobaYiN019PkySvjV", lena:"XrExE9yKIg1WjnnlVkGX", mara:"XB0fDUnXU5powFXDhCwa" };
const audioCache=new Map();
const player=new Audio();
let audioUnlocked=false;
function unlockAudio(){
  if(audioUnlocked) return; audioUnlocked=true;
  try{ player.src="data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAAAA=";
    player.play().catch(()=>{}); }catch(e){}
  initGraph();
  try{ if(window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission==="function"){
    DeviceOrientationEvent.requestPermission().then(st=>{ if(st==="granted") attachTilt(); }).catch(()=>{});
  } }catch(e){}
}
document.addEventListener("pointerdown", unlockAudio, { once:true, capture:true });

/* ---- Audio-reaktive Aura ---- */
let actx=null,analyser=null,ampData=null,ampRaf=null;
function initGraph(){
  if(actx || !(window.AudioContext||window.webkitAudioContext)) return;
  try{
    actx=new (window.AudioContext||window.webkitAudioContext)();
    const src=actx.createMediaElementSource(player);
    analyser=actx.createAnalyser(); analyser.fftSize=64;
    src.connect(analyser); analyser.connect(actx.destination);
    ampData=new Uint8Array(analyser.frequencyBinCount);
  }catch(e){ analyser=null; }
}
function startAmp(){
  if(!analyser) return;
  if(actx&&actx.state==="suspended") actx.resume().catch(()=>{});
  stopAmp();
  const vr=document.getElementById("voicering"), orb=document.getElementById("bigorb");
  const loop=()=>{
    if(!callOpen){ stopAmp(); return; }
    analyser.getByteFrequencyData(ampData);
    let sum=0; for(let i=0;i<ampData.length;i++) sum+=ampData[i];
    const amp=Math.min(1,(sum/ampData.length/255)*2.4);
    if(vr){ vr.style.opacity=(amp*.9).toFixed(2); vr.style.transform="scale("+(1+amp*.45).toFixed(3)+")"; vr.style.borderColor=curHex; }
    if(orb) orb.style.boxShadow="0 6px "+(22+amp*60).toFixed(0)+"px "+curHex+"55, 0 3px 12px rgba(0,0,0,.12)";
    ampRaf=requestAnimationFrame(loop);
  };
  ampRaf=requestAnimationFrame(loop);
}
function stopAmp(){
  if(ampRaf){ cancelAnimationFrame(ampRaf); ampRaf=null; }
  const vr=document.getElementById("voicering"); if(vr) vr.style.opacity="0";
}

/* ---- Gyro-/Maus-Parallax ---- */
let _px=0,_py=0,_tx=0,_ty=0,_paraOn=false;
function startParallax(){
  if(_paraOn) return; _paraOn=true;
  const loop=()=>{
    _px+=(_tx-_px)*.07; _py+=(_ty-_py)*.07;
    const ow=document.getElementById("orbitwrap");
    const sy=window.scrollY||0;
    const base=Math.min(1.04,(Math.min(window.innerWidth,480)-16)/330);
    const shr=base*Math.max(.62,1-sy/560), op=Math.max(.2,1-sy/520);
    if(ow){ ow.style.transform="translate("+_px.toFixed(2)+"px,"+_py.toFixed(2)+"px) scale("+shr.toFixed(3)+")";
      ow.style.opacity=op.toFixed(2); }
    const bg=document.getElementById("bg-aura");
    if(bg) bg.style.transform="translate("+(-_px*.55).toFixed(2)+"px,"+(-_py*.55).toFixed(2)+"px)";
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
  window.addEventListener("mousemove",e=>{
    _tx=(e.clientX-window.innerWidth/2)*.018; _ty=(e.clientY-window.innerHeight/2)*.018; });
  if(window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission!=="function") attachTilt();
}
function attachTilt(){
  window.addEventListener("deviceorientation",e=>{
    if(e.gamma==null||e.beta==null) return;
    _tx=Math.max(-12,Math.min(12,e.gamma*.5));
    _ty=Math.max(-12,Math.min(12,(e.beta-45)*.3));
  });
}

/* ---- Tageszeit-Stimmung ---- */
function applyMood(){
  const now=new Date(); const hh=now.getHours()+now.getMinutes()/60;
  const night=(hh>=22||hh<6.5);
  document.body.classList.toggle("night",night);
  if(night) window.__mood={c1:[.34,.31,.62],c2:[.18,.5,.44],dim:.28};
  else if(hh<11) window.__mood={c1:[.35,.66,.96],c2:[.25,.84,.68],dim:.5};
  else if(hh<18) window.__mood={c1:[.55,.5,.94],c2:[.25,.84,.68],dim:.55};
  else window.__mood={c1:[.94,.55,.35],c2:[.94,.42,.62],dim:.5};
}
/* ---- WebGL-Nebel ---- */
function initGL(){
  const cv=document.getElementById("gl"); if(!cv||!cv.getContext) return;
  let gl=null; try{ gl=cv.getContext("webgl",{alpha:false}); }catch(e){}
  if(!gl){ cv.style.display="none"; return; }
  const vs="attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}";
  const fs="precision mediump float;uniform float t;uniform vec2 r;uniform vec3 A;uniform vec3 B;uniform float d;uniform vec2 p;"+
  "float h(vec2 x){return fract(sin(dot(x,vec2(127.1,311.7)))*43758.5453);}"+
  "float n(vec2 x){vec2 i=floor(x),f=fract(x);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1.,0.)),f.x),mix(h(i+vec2(0.,1.)),h(i+vec2(1.,1.)),f.x),f.y);}"+
  "float fb(vec2 x){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*n(x);x*=2.03;a*=.5;}return v;}"+
  "void main(){vec2 uv=gl_FragCoord.xy/r;uv.x*=r.x/r.y;vec2 q=uv*1.5+p*.05;"+
  "float m1=fb(q+vec2(t*.016,-t*.011));float m2=fb(q*1.9-vec2(t*.007,t*.013)+m1*.7);"+
  "vec3 base=vec3(.962,.962,.969);"+
  "vec3 c=mix(base,A,smoothstep(.55,1.05,m1)*.09*d);"+
  "c=mix(c,B,smoothstep(.6,1.1,m2)*.07*d);"+
  "float vg=smoothstep(1.4,.3,distance(uv,vec2(r.x/r.y*.5,.6)));"+
  "c=mix(base*.992,c,vg);"+
  "gl_FragColor=vec4(c,1.);}";
  function mk(ty,src){ const sh=gl.createShader(ty); gl.shaderSource(sh,src); gl.compileShader(sh); return sh; }
  const pr=gl.createProgram();
  gl.attachShader(pr,mk(gl.VERTEX_SHADER,vs)); gl.attachShader(pr,mk(gl.FRAGMENT_SHADER,fs));
  gl.linkProgram(pr);
  if(!gl.getProgramParameter(pr,gl.LINK_STATUS)){ cv.style.display="none"; return; }
  gl.useProgram(pr);
  const buf=gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER,buf);
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
  const loc=gl.getAttribLocation(pr,"a"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
  const uT=gl.getUniformLocation(pr,"t"),uR=gl.getUniformLocation(pr,"r"),uA=gl.getUniformLocation(pr,"A"),
        uB=gl.getUniformLocation(pr,"B"),uD=gl.getUniformLocation(pr,"d"),uP=gl.getUniformLocation(pr,"p");
  function rs(){ const sc=Math.min(window.devicePixelRatio||1,2)*.5;
    cv.width=Math.max(2,innerWidth*sc); cv.height=Math.max(2,innerHeight*sc);
    gl.viewport(0,0,cv.width,cv.height); }
  rs(); window.addEventListener("resize",rs);
  const st=performance.now();
  (function draw(){
    const m=window.__mood||{c1:[.55,.5,.94],c2:[.25,.84,.68],dim:1};
    gl.uniform1f(uT,(performance.now()-st)/1000);
    gl.uniform2f(uR,cv.width,cv.height);
    gl.uniform3fv(uA,m.c1); gl.uniform3fv(uB,m.c2); gl.uniform1f(uD,m.dim);
    gl.uniform2f(uP,_px*.02,_py*.02);
    gl.drawArrays(gl.TRIANGLES,0,3);
    requestAnimationFrame(draw);
  })();
  const aura=document.getElementById("bg-aura"); if(aura) aura.style.display="none";
}
applyMood(); startParallax(); initGL(); loadAvatars();

const AUDIO_CACHE="coach-audio-v1";
function cacheKeyURL(coachId, clean){
  let h=0; for(let i=0;i<clean.length;i++){ h=(h*31+clean.charCodeAt(i))>>>0; }
  return "https://audio.local/"+coachId+"/"+h;
}
async function getCachedAudio(coachId, clean){
  const mem=audioCache.get(coachId+"|"+clean);
  if(mem) return mem;
  try{
    if(!window.caches) return null;
    const c=await caches.open(AUDIO_CACHE);
    const hit=await c.match(cacheKeyURL(coachId,clean));
    if(!hit) return null;
    const url=URL.createObjectURL(await hit.blob());
    audioCache.set(coachId+"|"+clean,url);
    return url;
  }catch(e){ return null; }
}
async function putCachedAudio(coachId, clean, blob){
  try{
    if(!window.caches) return;
    const c=await caches.open(AUDIO_CACHE);
    await c.put(cacheKeyURL(coachId,clean), new Response(blob,{headers:{"Content-Type":"audio/mpeg"}}));
  }catch(e){}
}
function speakStudio(coachId, clean, onDur){
  return new Promise((res,rej)=>{
    const start=(url)=>{
      player.src=url;
      player.onloadedmetadata=()=>{ if(onDur && isFinite(player.duration)) onDur(player.duration*1000); };
      player.onended=()=>res();
      player.onerror=()=>rej(new Error("audio"));
      document.getElementById("call").classList.add("live");
      player.play().then(()=>startAmp()).catch(rej);
    };
    getCachedAudio(coachId,clean).then(cached=>{
      if(cached){ start(cached); return; }
      fetch("https://api.elevenlabs.io/v1/text-to-speech/"+EL_VOICES[coachId]+"?output_format=mp3_44100_64",{
        method:"POST",
        headers:{ "xi-api-key":elKey, "Content-Type":"application/json" },
        body:JSON.stringify({ text:clean, model_id:"eleven_flash_v2_5",
          voice_settings:{ stability:0.5, similarity_boost:0.75, style:0.35, use_speaker_boost:true } })
      }).then(r=>{ if(!r.ok) throw new Error("http "+r.status); return r.blob(); })
        .then(b=>{ putCachedAudio(coachId,clean,b);
          const url=URL.createObjectURL(b); audioCache.set(coachId+"|"+clean,url); start(url); })
        .catch(rej);
    });
  });
}
function speakSystem(coachId, clean, onDur){
  const _c=document.getElementById("call"); if(_c) _c.classList.remove("live");
  return new Promise(res=>{
    const c=COACHES[coachId];
    const est=estMs(clean,c.rate);
    if(onDur) onDur(est);
    const fallback=setTimeout(res, est+600);
    if(!window.speechSynthesis){ return; }
    try{
      const u=new SpeechSynthesisUtterance(clean);
      u.lang="de-DE";
      const v=pickVoice(coachId); if(v) u.voice=v;
      u.rate=c.rate; u.pitch=c.pitch;
      u.onend=()=>{ clearTimeout(fallback); res(); };
      u.onerror=()=>{ clearTimeout(fallback); res(); };
      speechSynthesis.cancel();
      speechSynthesis.speak(u);
    }catch(e){ /* Fallback-Timer läuft */ }
  });
}
function speak(coachId, text, onDur){
  const c=COACHES[coachId];
  const clean=text.replace(/[„“✓]/g,"").replace(/—/g,",");
  if(!voiceOn){ if(onDur) onDur(Math.min(estMs(clean,c.rate),2200));
    return new Promise(r=>setTimeout(r, Math.min(estMs(clean,c.rate),2200))); }
  if(elKey && !elFail){
    return speakStudio(coachId, clean, onDur).catch((e)=>{
      elFail=true;
      ping(coachId,"Studio-Stimme nicht erreichbar", elErrorText(e)+" Details im ⚙︎ unter „Stimme testen“.");
      return speakSystem(coachId, clean, onDur);
    });
  }
  return speakSystem(coachId, clean, onDur);
}

/* ===== Call view (das Herzstück) ===== */
let currentScript=null, seqToken=0, callOpen=false, isTeam=false, paused=false, resumeFn=null;

function addMsg(who,text){
  const log=document.getElementById("transcript"); if(!log) return;
  if(who==="sys"){ log.appendChild(el('<div class="tsys">'+esc(text)+'</div>')); }
  else if(who==="me"){ log.appendChild(el('<div class="tme">'+esc(text)+'</div>')); }
  else if(COACHES[who]){ const c=COACHES[who];
    log.appendChild(el('<div class="tline"><span class="twho" style="color:'+c.hex+'">'+c.name+'</span>'+
      esc(text).split(" ").map(x=>'<span class="w on">'+x+'</span>').join(" ")+'</div>')); }
  log.scrollTop=log.scrollHeight;
}
function openCall(id){
  paused=false; resumeFn=null; liveMode=false; liveCoachId=null;
  const _cb=document.getElementById("chatbar"); if(_cb) _cb.style.display="none";
  const pb=document.getElementById("pausebtn"); if(pb) pb.textContent="❚❚";
  currentScript=SCRIPTS[id]; isTeam=!!(currentScript&&currentScript.isTeam); callOpen=true;
  liveMode = !isTeam && !!anthKey && !!COACHES[id];
  if(liveMode) liveCoachId=id;
  if(COACHES[id]) orbPulse(id,false);
  const call=document.getElementById("call");
  document.getElementById("transcript").innerHTML="";
  document.getElementById("chips").innerHTML="";
  const tr=document.getElementById("teamrow");
  tr.style.display=isTeam?"flex":"none";
  if(isTeam){
    const rowIds=(currentScript&&currentScript.parts)||ORDER;
    tr.innerHTML=rowIds.map(cid=>`<div class="orb" data-c="${cid}" style="${orbStyle(cid)}">${avatarInner(cid)}</div>`).join("");
  }
  setSpeaker(isTeam?"viktor":id, true);
  call.classList.add("open");
  if(isTeam){ const t=++seqToken; runSequence(currentScript.intro, ()=>showChips(currentScript.chips), t); }
  else if(liveMode){ enterLive(id); }
  else { showNoKey(id); }
}
function showNoKey(id){
  addMsg(id, "Ich würde dich wirklich gern kennenlernen — dafür fehlt nur noch mein Zugang: der Coach-Intelligenz-Key (Anthropic). Richte ihn kurz ein, dann bin ich für dich da.");
  const box=document.getElementById("chips"); box.innerHTML="";
  const b=el('<button class="chip action">Coach-Intelligenz einrichten</button>');
  b.onclick=()=>{ closeCall();
    const sb=document.getElementById("settingsbtn"); if(sb&&sb.onclick) sb.onclick();
    setTimeout(()=>{ const inp=document.getElementById("anthkeyinput");
      if(inp){ try{ inp.scrollIntoView({block:"center"}); inp.focus(); }catch(e){} } }, 120);
  };
  box.appendChild(b);
}
function setPaused(p){
  paused=p;
  const b=document.getElementById("pausebtn");
  if(b) b.textContent=p?"▶":"❚❚";
  try{ if(window.speechSynthesis){ p?speechSynthesis.pause():speechSynthesis.resume(); } }catch(e){}
  try{ if(p){ player.pause(); } else if(player.src && !player.ended){ player.play().catch(()=>{}); } }catch(e){}
  if(!p && resumeFn){ const f=resumeFn; resumeFn=null; f(); }
}
function closeCall(){
  callOpen=false; seqToken++; paused=false; resumeFn=null;
  const b=document.getElementById("pausebtn"); if(b) b.textContent="❚❚";
  document.getElementById("call").classList.remove("open");
  document.getElementById("call").classList.remove("speaking");
  if(window.speechSynthesis) speechSynthesis.cancel();
  try{ player.pause(); player.currentTime=0; }catch(e){}
  stopAmp(); document.getElementById("call").classList.remove("live");
  liveMode=false; const _cb2=document.getElementById("chatbar"); if(_cb2) _cb2.style.display="none";
}
function setSpeaker(id, instant){
  const c=COACHES[id];
  const orb=document.getElementById("bigorb");
  orb.setAttribute("style", orbStyle(id));
  orb.classList.toggle("hasimg",!!AVOK[id]);
  orb.innerHTML=avatarInner(id)+'<i class="sheen"></i><span class="ring" style="border-color:'+c.hex+'40"></span>';
  curHex=c.hex;
  document.getElementById("cname").textContent=c.name;
  document.getElementById("crole").textContent=c.role+" · "+c.vibe;
  document.getElementById("call-aura").style.background=
    `radial-gradient(620px 480px at 50% 4%, ${c.hex}1f, transparent 66%)`;
  document.querySelectorAll(".ringp").forEach(r=>r.style.setProperty("--ring", c.hex+"88"));
  if(isTeam){
    document.querySelectorAll("#teamrow .orb").forEach(o=>{
      const on=o.dataset.c===id;
      o.classList.toggle("activeSpk",on);
      if(on) o.style.setProperty("--spk", c.hex+"66");
    });
  }
}
function setSpeakingUI(on, id){
  document.getElementById("call").classList.toggle("speaking",on);
  document.getElementById("cstate").innerHTML = on
    ? `<span class="eq"><i></i><i></i><i></i><i></i></span> spricht`
    : `hört zu`;
  if(on && id){ const c=COACHES[id];
    document.querySelectorAll(".eq i").forEach(i=>i.style.background=c.hex); }
}
function addOldify(){
  document.querySelectorAll("#transcript .tline:not(.old)").forEach(n=>n.classList.add("old"));
}
function runSequence(msgs, done, token, i=0){
  if(token!==seqToken || !callOpen) return;
  if(paused){ resumeFn=()=>runSequence(msgs,done,token,i); return; }
  if(i>=msgs.length){ done&&done(); return; }
  const [who,text]=msgs[i];
  const log=document.getElementById("transcript");
  if(who==="sys"){
    log.appendChild(el(`<div class="tsys">${text}</div>`));
    log.scrollTop=log.scrollHeight;
    setTimeout(()=>runSequence(msgs,done,token,i+1), 900);
    return;
  }
  addOldify();
  setSpeaker(who);
  const c=COACHES[who];
  const words=text.split(" ");
  const line=el(`<div class="tline">${isTeam?`<span class="twho" style="color:${c.hex}">${c.name}</span>`:""}${
    words.map(w=>`<span class="w">${esc(w)}</span>`).join(" ")}</div>`);
  log.appendChild(line); log.scrollTop=log.scrollHeight;
  const spans=line.querySelectorAll(".w");
  let per=Math.max(60, estMs(text,c.rate)/words.length);
  let wi=0, rev=null;
  const tick=()=>{
    if(token!==seqToken){ clearInterval(rev); return; }
    if(wi<spans.length){ spans[wi++].classList.add("on"); log.scrollTop=log.scrollHeight; }
    else clearInterval(rev);
  };
  const startRev=()=>{ rev=setInterval(tick, per); };
  startRev();
  setSpeakingUI(true, who);
  speak(who,text,(ms)=>{
    if(token!==seqToken) return;
    per=Math.max(45,(ms*0.92)/words.length);
    clearInterval(rev); startRev();
  }).then(()=>{
    if(token!==seqToken) return;
    clearInterval(rev); spans.forEach(s=>s.classList.add("on"));
    setSpeakingUI(false);
    setTimeout(()=>runSequence(msgs,done,token,i+1), 420);
  });
}
function showChips(chips){
  if(!callOpen) return;
  const box=document.getElementById("chips");
  box.innerHTML="";
  (chips&&chips.length?chips:[{t:"Gespräch beenden",end:true}]).forEach(ch=>{
    const b=el(`<button class="chip${ch.t.startsWith("✓")?" action":""}">${ch.t}</button>`);
    b.onclick=()=>{
      if(ch.end){ closeCall(); return; }
      box.innerHTML="";
      const log=document.getElementById("transcript");
      if(!ch.t.startsWith("✓")){ addOldify(); log.appendChild(el(`<div class="tme">${esc(ch.t)}</div>`)); log.scrollTop=log.scrollHeight; }
      const br=currentScript.branches[ch.next];
      const t=++seqToken;
      if(br) runSequence(br.m, ()=>showChips(br.chips), t);
    };
    box.appendChild(b);
  });
}

/* ===== Orbit ===== */
const OCX=165, OCY=151, ORX=128, ORY=52, OW=(2*Math.PI)/140000;
let dragSpin=0, mouseSpin=0, mouseSpinT=0, _dragLast=null, _dragMoved=0;
let orbEls=[], orbitT0=0, frontId="";
const AVOK={};
function avatarInner(id){ return AVOK[id] ? '<img src="avatars/'+id+'.png" alt="">' : COACHES[id].ini; }
function refreshOrbFaces(){
  orbEls.forEach(o=>{ const id=o.dataset.c;
    o.classList.toggle("hasimg",!!AVOK[id]);
    o.innerHTML=avatarInner(id)+'<i class="sheen"></i><span class="ring" style="border-color:'+COACHES[id].hex+'40"></span>'; });
  if(typeof renderStaticOrbs==="function") try{ renderStaticOrbs(); }catch(e){}
  if(typeof renderPicker==="function") try{ renderPicker(); }catch(e){}
  if(typeof renderCoachCards==="function") try{ renderCoachCards(); }catch(e){}
}
function loadAvatars(){
  ORDER.forEach(id=>{ try{
    const im=new Image();
    im.onload=()=>{ AVOK[id]=true; refreshOrbFaces(); };
    im.src="avatars/"+id+".png";
  }catch(e){} });
}
function easeOutBack(x){ const c=1.70158; return 1+(c+1)*Math.pow(x-1,3)+c*Math.pow(x-1,2); }
function renderOrbit(){
  const now=new Date();
  const days=["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"];
  const months=["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];
  document.getElementById("datum").textContent=days[now.getDay()]+", "+now.getDate()+". "+months[now.getMonth()];
  const h=now.getHours();
  document.getElementById("greeting").textContent=(h<11?"Guten Morgen":h<18?"Hallo":"Guten Abend")+", Marco";
  const wrap=document.getElementById("orbs"); wrap.innerHTML=""; orbEls=[];
  ORDER.forEach((id,i)=>{
    const o=el('<div class="orb oorb" data-c="'+id+'" style="'+orbStyle(id)+';opacity:0">'+
      avatarInner(id)+'<i class="sheen" style="animation-delay:-'+(i*3)+'s"></i><span class="ring"></span></div>');
    o.onclick=()=>flyOpen(id,o);
    wrap.appendChild(o); orbEls.push(o);
  });
  const cen=document.getElementById("centerorb");
  cen.style.background="radial-gradient(circle at 32% 28%,#ffffff,#e4e4e9 80%)";
  cen.style.boxShadow="0 8px 28px rgba(0,0,0,.10)";
  cen.style.color="#1d1d1f";
  cen.innerHTML='M<i class="sheen"></i>';
  cen.onclick=()=>flyOpen("viktor",cen);
  orbitT0=performance.now();
  requestAnimationFrame(orbitLoop);
  orbitSay("viktor","Willkommen","Dein Team ist neu hier — und <b>neugierig auf dich</b>. Tippe einen Coach an.","viktor");
}
function orbitLoop(nowT){
  const t=nowT-orbitT0;
  mouseSpin+=(mouseSpinT-mouseSpin)*0.06;
  let bestZ=-2, bestId="", allIn=true;
  orbEls.forEach((o,i)=>{
    const pe=Math.min(1,Math.max(0,(t-160-i*95)/850));
    if(pe<1) allIn=false;
    const sp=pe<=0?0:easeOutBack(pe);
    const ang=Math.PI/2+i*Math.PI/3+t*OW+dragSpin+mouseSpin;
    const z=Math.sin(ang), f=(z+1)/2;
    const x=OCX+Math.cos(ang)*ORX*sp, y=OCY+Math.sin(ang)*ORY*sp;
    const sc=(.72+.42*f)*(.3+.7*Math.min(1,pe*1.15));
    o.style.left=(x-38).toFixed(1)+"px";
    o.style.top=(y-38).toFixed(1)+"px";
    o.style.transform="scale("+sc.toFixed(3)+")";
    o.style.opacity=(pe<=0?0:(.45+.55*f)*Math.min(1,pe*1.6)).toFixed(2);
    o.style.zIndex=String(20+Math.round(z*10));
    if(z>bestZ){ bestZ=z; bestId=o.dataset.c; }
  });
  if(allIn && bestId && bestId!==frontId){
    frontId=bestId;
    const fn=document.getElementById("frontname");
    if(fn){ fn.style.opacity="0";
      setTimeout(()=>{ fn.textContent=COACHES[frontId].name+" · "+COACHES[frontId].role; fn.style.opacity="1"; },220); }
  }
  requestAnimationFrame(orbitLoop);
}
function flyOpen(id, srcEl){
  if(_dragMoved>8){ return; }
  if(!srcEl || !srcEl.getBoundingClientRect){ openCall(id); return; }
  const r=srcEl.getBoundingClientRect();
  if(!r.width){ openCall(id); return; }
  const cl=el('<div class="orb" style="position:fixed;z-index:75;margin:0;left:'+r.left+'px;top:'+r.top+'px;width:'+r.width+'px;height:'+r.height+'px;font-size:18px;'+orbStyle(id)+';transition:all .5s cubic-bezier(.3,1,.3,1)">'+avatarInner(id)+'</div>');
  document.body.appendChild(cl);
  requestAnimationFrame(()=>{ requestAnimationFrame(()=>{
    cl.style.left=(window.innerWidth/2-78)+"px";
    cl.style.top=(86+window.innerHeight*0.025)+"px";
    cl.style.width="124px"; cl.style.height="124px"; cl.style.fontSize="44px";
  }); });
  setTimeout(()=>openCall(id), 280);
  setTimeout(()=>{ try{cl.remove();}catch(e){} }, 660);
}
function orbitSay(coachId,title,html,target){
  const m=document.getElementById("orbitmsg");
  const c=COACHES[coachId];
  m.innerHTML='<span class="from" style="color:'+c.hex+'">'+c.name.toUpperCase()+' · '+title.toUpperCase()+'</span>'+html;
  m.onclick=()=>openCall(target||coachId);
}
function orbPulse(coachId,on){
  const o=document.querySelector('.oorb[data-c="'+coachId+'"]');
  if(!o) return;
  o.classList.toggle("pinging",!!on);
  o.style.setProperty("--pc",COACHES[coachId].hex);
}
function renderDay(){
  document.getElementById("tagtl").innerHTML='<div style="font-size:13px;color:var(--text3);padding:6px 0 2px">Noch kein Kalender verbunden.</div>';
}

/* ===== Log & Feed ===== */
const ACTIONS=[
  { ico:"🏋️", t:"Deniz · Zielgewichte in der Trainings-App angepasst (Technik-Tag)", time:"heute 08:12 · autonom · widerrufbar" },
  { ico:"📅", t:"Deniz · Kalendereintrag „Beine (Technik)“ 12:30 vorgeschlagen", time:"heute 08:12 · wartet auf ✓" },
  { ico:"🧠", t:"Elias · Check-in ausgelöst (Schlaf < 6 h, HRV ↓)", time:"heute 07:58 · Regel „Fürsorge“" },
  { ico:"🥗", t:"Lena · Speiseplan an Trainingszeit angepasst", time:"heute 07:55 · autonom" },
  { ico:"🤝", t:"Viktor & Mara · Team-Runde „Belastung nächste Woche“ gestartet", time:"gestern 21:40" },
];
function renderLog(){
  document.getElementById("actionlog").innerHTML=ACTIONS.map(a=>`
    <div class="logrow"><div class="lr-ico">${a.ico}</div>
    <div><div>${a.t}</div><div class="lr-t">${a.time}</div></div></div>`).join("");
}
function feedItem(coachId,title,body,time,target){
  const c=COACHES[coachId];
  const n=el(`<div class="feed-item">
    <div class="orb" style="${orbStyle(coachId)}">${avatarInner(coachId)}</div>
    <div style="flex:1"><div class="fi-t">${c.name} · ${title}</div><div class="fi-b">${body}</div><div class="fi-time">${time}</div></div>
    <div style="color:var(--text3)">›</div></div>`);
  n.onclick=()=>openCall(target||coachId);
  document.getElementById("tagfeed").prepend(n);
}
function ping(coachId,title,body,target){
  const c=COACHES[coachId];
  document.getElementById("toastinner").innerHTML=`
    <div class="orb" style="${orbStyle(coachId)}">${avatarInner(coachId)}</div>
    <div style="flex:1"><div class="t-title">${c.name} · ${title}</div><div class="t-body">${body}</div></div>`;
  document.getElementById("toastinner").onclick=()=>{ hideToast(); openCall(target||coachId); };
  document.getElementById("toast").classList.add("show");
  if(navigator.vibrate) navigator.vibrate(60);
  setTimeout(hideToast, 9000);
}
function hideToast(){ document.getElementById("toast").classList.remove("show"); }

const MISSIONS={
  viktor:"Hält das große Ganze — priorisiert, koordiniert und löst Zielkonflikte im Team.",
  deniz:"Plant dein Training, steuert Progression und schützt deine Erholung.",
  lena:"Macht Ernährung alltagstauglich — Energie für Training und Beruf, ohne Dogma.",
  peter:"Schärft deine Karriereziele und bereitet dich auf große Momente vor.",
  elias:"Achtet auf deinen Kopf — Druck, Schlaf, Selbstgespräch. Fragt nach, wenn's zählt.",
  mara:"Erdet dich. Bremst, wenn es zu viel wird — und schützt das Hier und Jetzt."
};
const QUOTES={
  viktor:"„Wenn das Wichtigste gut läuft, war der Tag ein Erfolg.“",
  deniz:"„Hart, wenn der Körper bereit ist — smart, wenn nicht.“",
  lena:"„Essen soll dich tragen, nicht beschäftigen.“",
  peter:"„Rückfragen, nicht rechtfertigen.“",
  elias:"„Durch sein ist ein Signal, kein Versagen.“",
  mara:"„Es zählt schon jetzt — nicht erst bei hundert.“"
};
const TAGS={
  viktor:["Strategie","Priorisierung","Ruhe"],
  deniz:["Krafttraining","Progression","Motivation"],
  lena:["Ernährung","Energie","Alltagstauglich"],
  peter:["Karriere","Verhandlung","Fokus"],
  elias:["Mentale Stärke","Schlaf","Reflexion"],
  mara:["Erdung","Balance","Genuss"]
};
function updateMemUI(){
  const c=document.getElementById("memcount"); if(c) c.textContent=memFacts.length+" gemerkt";
  const list=document.getElementById("memlist");
  if(list) list.innerHTML = memFacts.length
    ? memFacts.map(f=>'<div class="logrow"><div class="lr-ico">•</div><div>'+esc(f)+'</div></div>').join("")
    : '<div style="font-size:13px;color:var(--text3);padding:6px 0">Noch nichts gemerkt. Sprich mit einem Coach — was du teilst, landet hier.</div>';
}
function renderCoachCards(){
  const car=document.getElementById("coachcarousel"); if(!car) return;
  car.innerHTML=ORDER.map(id=>{
    const c=COACHES[id];
    const photo=AVOK[id]
      ? '<img src="avatars/'+id+'.png" alt="'+c.name+'">'
      : '<span class="bigini">'+c.ini+'</span>';
    return '<div class="ccard" data-c="'+id+'">'+
      '<div class="photo" style="background:radial-gradient(circle at 35% 25%,'+c.hex+','+shade(c.hex,-40)+')">'+photo+
      '<div class="scrim"></div>'+
      '<div class="rolepill" style="background:'+c.hex+'">'+c.role+'</div>'+
      '<div class="pname"><div class="n">'+c.name+'</div></div></div>'+
      '<div class="cbody">'+
      '<div class="cm">'+MISSIONS[id]+'</div>'+
      '<div class="cq" style="border-color:'+c.hex+'">'+QUOTES[id]+'</div>'+
      '<div class="tags">'+TAGS[id].map(t=>'<span class="tag">'+t+'</span>').join("")+'</div>'+
      '<div class="acts">'+
      '<button class="chip action" data-act="call" style="flex:1">▶ Gespräch starten</button>'+
      '<button class="chip" data-act="invite">Zur Sitzung</button>'+
      '</div></div></div>';
  }).join("");
  const dots=document.getElementById("coachdots");
  dots.innerHTML=ORDER.map((_,i)=>'<i class="'+(i===0?"on":"")+'"></i>').join("");
  car.querySelectorAll(".ccard").forEach(card=>{
    const id=card.dataset.c;
    card.querySelector('[data-act="call"]').onclick=()=>openCall(id);
    card.querySelector('[data-act="invite"]').onclick=()=>{
      showView("runde");
      setTimeout(()=>{ setPickerSelection([id]); },80);
    };
  });
  car.onscroll=()=>{
    const cards=[...car.querySelectorAll(".ccard")];
    const mid=car.scrollLeft+car.clientWidth/2;
    let best=0,bd=1e9;
    cards.forEach((cd,i)=>{
      const cm=cd.offsetLeft+cd.offsetWidth/2, d=Math.abs(cm-mid);
      cd.classList.toggle("dim", d>cd.offsetWidth*0.4);
      if(d<bd){bd=d;best=i;}
    });
    [...dots.children].forEach((x,i)=>x.classList.toggle("on",i===best));
  };
}
function setPickerSelection(ids){
  const row=document.getElementById("pickrow"); if(!row) return;
  row.querySelectorAll(".pick").forEach(p=>p.classList.toggle("sel", ids.includes(p.dataset.c)));
  selectedParts=ids.slice();
}

/* ===== Sitzungs-Baukasten ===== */
const SESSION_TOPICS={
  marathon:{
    title:"Marathon im Herbst",
    opener:["viktor","Marco hat ein Thema mitgebracht: Er überlegt, im Herbst einen Marathon zu laufen. Zehn Wochen Vorbereitung. Ich will ehrliche Einschätzungen."],
    statements:{
      deniz:"Ich liebe die Idee! Aber ehrlich: Zehn Wochen von null auf Marathon ist grenzwertig. Das Kraft-Fundament ist top, die Ausdauerbasis nicht. Machbar: Halbmarathon im Herbst, der volle im Frühjahr.",
      lena:"Ernährungsseitig kriegen wir das hin — Laufumfänge heißen mehr Kohlenhydrate. Beim vollen Marathon in zehn Wochen sehe ich aber ein Energiedefizit-Risiko.",
      peter:"Aus Karrieresicht: Der Herbst ist deine dichteste Kundenphase. Ein Frühjahrslauf nimmt dir Druck raus, statt welchen draufzupacken.",
      elias:"Mir ist wichtig, warum du das willst. Ein echtes Herzensziel trägt durch harte Wochen. Beweis-Druck wird zur Belastung. Das würde ich vorher klären.",
      mara:"Ich bin nicht gegen den Traum — ich bin gegen den Termin. Ein Frühjahrs-Marathon lässt dich ankommen statt hetzen."
    },
    closer:["viktor","Danke euch. Marco — du hast die Perspektiven gehört. Dein Wort."],
    decisions:[
      { t:"✓ Halbmarathon im Herbst", sys:"Entscheidung gespeichert → Logbuch · Halbmarathon-Plan folgt", ack:"Starke Wahl. Das wird richtig gut." },
      { t:"✓ Voller Marathon — mit Leitplanken", sys:"Entscheidung gespeichert → Logbuch · wöchentlicher Check-in als Leitplanke", ack:"Mutig. Wir stehen hinter dir — mit offenen Augen." }
    ]
  },
  energy:{
    title:"Mehr Energie am Nachmittag",
    opener:["viktor","Marcos Thema heute: das Nachmittagstief gegen 15 Uhr. Jeder aus seiner Sicht — was ist der Hebel?"],
    statements:{
      lena:"Meist ist es das Mittagessen: zu schwer, zu viele schnelle Kohlenhydrate. Ich würde auf einen proteinlastigen Lunch umstellen, dazu ein kleiner Snack gegen halb vier.",
      deniz:"Bevor du zum Kaffee greifst: zehn Minuten Bewegung um halb drei — Spaziergang oder zwanzig Kniebeugen. Kreislauf schlägt Koffein.",
      elias:"Das Tief ist oft mental, nicht körperlich: Nach Stunden ohne echte Pause macht der Kopf zu. Neunzig-Minuten-Blöcke mit echten Pausen — nicht Handy-Pausen.",
      peter:"Kalenderarchitektur: Deep Work vormittags, Meetings und Routinearbeit nach 15 Uhr. Dann fällt das Tief in die Aufgaben, die es verträgt.",
      mara:"Oder die unbequeme Frage: Vielleicht will der Nachmittag dir was sagen. Nicht jede Delle muss wegoptimiert werden — manchmal ist weniger reinpacken die Antwort."
    },
    closer:["viktor","Gute Runde. Nimm dir zwei Hebel raus und teste sie zwei Wochen — dann schauen wir gemeinsam auf die Wirkung."],
    decisions:[
      { t:"✓ Plan übernehmen", sys:"Entscheidung gespeichert → Logbuch · Zwei-Wochen-Test startet morgen", ack:"Sehr gut — wir begleiten dich dabei." }
    ]
  }
};
let selectedParts=ORDER.slice();
function buildSession(topicKey){
  const T=SESSION_TOPICS[topicKey];
  const parts=selectedParts.length?selectedParts.slice():ORDER.slice();
  const msgs=[["sys","Sonderbesprechung · "+T.title+" · "+parts.length+" Teilnehmer"]];
  const hasViktor=parts.includes("viktor");
  if(hasViktor) msgs.push(T.opener);
  ORDER.forEach(id=>{ if(id!=="viktor" && parts.includes(id) && T.statements[id]) msgs.push([id,T.statements[id]]); });
  if(hasViktor) msgs.push(T.closer);
  const spokesman=hasViktor?"viktor":parts[0];
  const branches={};
  const chips=T.decisions.map((d,i)=>{
    branches["d"+i]={ m:[["sys",d.sys],[spokesman,d.ack]], chips:[] };
    return { t:d.t, next:"d"+i };
  });
  return { isTeam:true, parts:parts, intro:msgs, chips:chips, branches:branches };
}
function renderPicker(){
  const row=document.getElementById("pickrow"); if(!row) return;
  row.innerHTML=ORDER.map(id=>
    '<div class="pick sel" data-c="'+id+'"><div class="orb" style="'+orbStyle(id)+'">'+avatarInner(id)+
    '<span class="chk">✓</span></div><div class="pn">'+COACHES[id].name+'</div></div>').join("");
  row.querySelectorAll(".pick").forEach(p=>{
    p.onclick=()=>{
      const id=p.dataset.c;
      if(p.classList.contains("sel") && selectedParts.length<=1) return;
      p.classList.toggle("sel");
      selectedParts=[...row.querySelectorAll(".pick.sel")].map(x=>x.dataset.c);
    };
  });
  selectedParts=ORDER.slice();
}
function openSession(topicKey){
  SCRIPTS._session=buildSession(topicKey);
  openCall("_session");
}

/* ===== Live-Coaching (Claude-API) ===== */
let memFacts=[];
try{ memFacts=JSON.parse(store.get("memFacts")||"[]"); if(!Array.isArray(memFacts)) memFacts=[]; }catch(e){ memFacts=[]; }
function saveMem(){ store.set("memFacts", JSON.stringify(memFacts)); }
function addFacts(arr){
  let ch=false;
  (arr||[]).forEach(f=>{ f=(f||"").trim();
    if(f && f.length<220 && !memFacts.some(x=>x.toLowerCase()===f.toLowerCase())){ memFacts.push(f); ch=true; } });
  if(ch){ saveMem(); updateMemUI(); }
}
function processReply(t){
  const facts=[];
  const clean=(t||"").replace(/<\s*remember\s*>([\s\S]*?)<\s*\/\s*remember\s*>/gi,(m,p)=>{ facts.push(p); return " "; })
    .replace(/\s{2,}/g," ").trim();
  return { clean:clean||"…", facts };
}
function memoryBlock(){
  if(!memFacts.length) return "Du kennst Marco noch gar nicht — dies ist einer eurer allerersten Momente. Sei aufrichtig neugierig: stelle ihm warme, offene Fragen über sein Leben, seine Ziele und was ihn bewegt — immer eine nach der anderen, nie wie ein Fragebogen. ";
  return "Das weißt du bereits über Marco:\n- "+memFacts.join("\n- ")+"\nBeziehe dich natürlich darauf und lerne behutsam mehr über ihn. ";
}
function systemPrompt(id){
  const c=COACHES[id];
  let p="Du bist "+c.name+", "+c.role+" in Marcos persoenlichem Coaching-Team, wie das Trainerteam eines Spitzensportlers. "+
    "Wesen: "+c.vibe+". Dein Auftrag: "+MISSIONS[id]+" Dein Leitsatz: "+QUOTES[id]+" "+
    "Sprich Deutsch, per Du, warm, ehrlich und konkret. Antworte wie im echten Gespräch gesprochen: kurz, 2 bis 4 Sätze, keine Aufzählungen, keine Überschriften. "+
    "Du bist diese Person mit echtem Charakter, keine allgemeine KI. "+
    memoryBlock()+
    "Wenn du etwas Dauerhaftes über Marco erfährst (Fakten, Ziele, Vorlieben, Wichtiges), hänge es ganz am Ende deiner Antwort unsichtbar an in der Form <remember>kurzer Fakt</remember>. Höchstens ein bis zwei pro Antwort, nur wirklich Merkenswertes, in dritter Person. Marco sieht diesen Teil nicht. ";
  if(id==="elias") p+="Wichtig: Du bist Mental-Coach für Alltag und Leistung, kein Therapeut. Zeigt Marco Anzeichen ernster seelischer Not, sprich es warm an und ermutige ihn, sich echte menschliche Hilfe oder eine Fachperson zu suchen. Keine Diagnosen. ";
  if(id==="deniz"||id==="lena") p+="Bei Schmerz, Verletzung oder gesundheitlichen Themen: zu ärztlicher Abklärung raten, nicht diagnostizieren. ";
  return p;
}

let convHistory=[], liveCoachId=null, liveMode=false;
function anthErr(e){
  const m=String(e&&e.message||e);
  if(m.includes("401")) return "Key ungueltig (401).";
  if(m.includes("400")) return "Anfrage abgelehnt (400) — Key/Modell pruefen.";
  if(m.includes("402")||m.includes("credit")) return "Kein Guthaben (402) — im Anthropic-Konto aufladen.";
  if(m.includes("429")) return "Zu viele Anfragen (429) — kurz warten.";
  if(m.toLowerCase().includes("fetch")||m.toLowerCase().includes("network")) return "Netzwerk/CORS — online? Ueber https geoeffnet?";
  return "Fehler: "+m;
}
function askClaude(id, history, key){
  return fetch("https://api.anthropic.com/v1/messages",{
    method:"POST",
    headers:{ "content-type":"application/json", "x-api-key":key||anthKey,
      "anthropic-version":"2023-06-01", "anthropic-dangerous-direct-browser-access":"true" },
    body:JSON.stringify({ model:"claude-sonnet-5", max_tokens:320, system:systemPrompt(id), messages:history })
  }).then(r=>{ if(!r.ok) return r.text().then(t=>{ throw new Error("HTTP "+r.status+" "+t.slice(0,140)); }); return r.json(); })
    .then(d=>{ const parts=(d.content||[]).filter(x=>x.type==="text").map(x=>x.text); return (parts.join(" ")||"…").trim(); });
}
function showChatbar(){
  const bar=document.getElementById("chatbar"); if(bar) bar.style.display="flex";
  const inp=document.getElementById("chatinput"); if(inp) setTimeout(()=>{ try{inp.focus();}catch(e){} },200);
}
function coachThinking(){
  const log=document.getElementById("transcript");
  const t=el('<div class="tsys">'+COACHES[liveCoachId].name+' denkt nach …</div>');
  log.appendChild(t); log.scrollTop=log.scrollHeight; return t;
}
function enterLive(id){
  liveCoachId=id; convHistory=[];
  document.getElementById("chips").innerHTML="";
  showChatbar();
  const trigger="(Interner Hinweis, nicht anzeigen: Marco hat gerade das Gespräch mit dir geöffnet. Begrüße ihn kurz und herzlich in deinem Charakter und stelle ihm aus echter Neugier EINE offene Frage, um ihn besser kennenzulernen. Halte es kurz.)";
  convHistory.push({ role:"user", content:trigger });
  const typ=coachThinking();
  askClaude(id, convHistory).then(r=>{
    typ.remove();
    const pr=processReply(r); addFacts(pr.facts);
    convHistory.push({ role:"assistant", content:pr.clean });
    runSequence([[id,pr.clean]], null, ++seqToken);
  }).catch(e=>{ typ.remove(); addMsg("sys","⚠︎ "+anthErr(e)); });
}
function sendChat(){
  const inp=document.getElementById("chatinput");
  const txt=(inp.value||"").trim(); if(!txt || !liveMode || !liveCoachId) return;
  inp.value="";
  addOldify();
  const log=document.getElementById("transcript");
  log.appendChild(el('<div class="tme">'+esc(txt)+'</div>')); log.scrollTop=log.scrollHeight;
  convHistory.push({ role:"user", content:txt });
  const typ=el('<div class="tsys">'+COACHES[liveCoachId].name+' denkt nach …</div>');
  log.appendChild(typ); log.scrollTop=log.scrollHeight;
  askClaude(liveCoachId, convHistory).then(reply=>{
    typ.remove();
    const pr=processReply(reply); addFacts(pr.facts);
    convHistory.push({ role:"assistant", content:pr.clean });
    runSequence([[liveCoachId,pr.clean]], null, ++seqToken);
  }).catch(e=>{
    typ.remove();
    addMsg("sys","⚠︎ "+anthErr(e));
  });
}

/* ===== Start: Tabs + FX-Engine ===== */
function countUp(el){
  const target=parseFloat(el.dataset.count), dec=(el.dataset.count.includes(".")?1:0);
  const t0=performance.now(), dur=950;
  (function step(now){
    const p=Math.min(1,(now-t0)/dur), e=1-Math.pow(1-p,3);
    el.textContent=(target*e).toFixed(dec).replace(".",",");
    if(p<1) requestAnimationFrame(step);
  })(performance.now());
}
function drawArc(){
  const arc=document.getElementById("recarc"); if(!arc) return;
  const t0=performance.now(), dur=1200, target=209;
  (function step(now){
    const p=Math.min(1,(now-t0)/dur), e=1-Math.pow(1-p,3);
    arc.setAttribute("stroke-dasharray",(target*e).toFixed(1)+" 327");
    if(p<1) requestAnimationFrame(step);
  })(performance.now());
}
const BAR_DATA={ recbars:[55,70,62,80,74,58,64], prbars:[60,68,74,80,80,88,100] };
function fillBars(id){
  const box=document.getElementById(id); if(!box) return;
  if(!box.children.length){
    BAR_DATA[id].forEach(()=>box.appendChild(el('<i></i>')));
  }
  [...box.children].forEach((b,i)=>{
    const v=BAR_DATA[id][i];
    b.className=v>=67?"g":"";
    b.style.height="4px";
    setTimeout(()=>{ b.style.height=Math.round(v*0.6)+"px"; }, 60+i*70);
  });
}
function runFX(viewId){
  const view=document.getElementById("view-"+viewId); if(!view) return;
  const fx=view.querySelectorAll(".fx");
  fx.forEach(x=>x.classList.remove("in"));
  const tll=view.querySelector(".tlline"); if(tll) tll.classList.remove("in");
  view.querySelectorAll(".metric.open").forEach(m=>m.classList.remove("open"));
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    fx.forEach(x=>x.classList.add("in"));
    view.querySelectorAll("[data-count]").forEach(countUp);
    if(tll) setTimeout(()=>tll.classList.add("in"),250);
  }));
}
function showView(v){
  document.querySelectorAll(".view").forEach(x=>x.classList.toggle("active",x.id==="view-"+v));
  document.querySelectorAll(".pillbtn").forEach(p=>p.classList.toggle("tabactive",p.dataset.v===v));
  window.scrollTo(0,0);
  runFX(v);
}
document.querySelectorAll(".pillbtn").forEach(p=>{ p.onclick=()=>showView(p.dataset.v); });

function renderStaticOrbs(){
  const lo=document.getElementById("lobbyorbs");
  if(lo) lo.innerHTML=["viktor","mara","deniz"].map((id,i)=>
    '<div class="orb" style="width:34px;height:34px;font-size:12px;'+(i?'margin-left:-9px;':'')+'border:2px solid #fff;'+orbStyle(id)+'">'+avatarInner(id)+'</div>').join("");
  const vv=document.getElementById("vsviktor");
  if(vv){ vv.setAttribute("style",orbStyle("viktor")); vv.classList.toggle("hasimg",!!AVOK.viktor); vv.innerHTML=avatarInner("viktor"); }
  const vm=document.getElementById("vsmara");
  if(vm){ vm.setAttribute("style",orbStyle("mara")); vm.classList.toggle("hasimg",!!AVOK.mara); vm.innerHTML=avatarInner("mara"); }
}
var _tr=document.getElementById("teaser-runde"); if(_tr) _tr.onclick=()=>showView("runde");
document.getElementById("lobbyplay").onclick=()=>openCall("team");
document.getElementById("lobbyread").onclick=()=>{
  const sm=document.getElementById("lobbysummary");
  sm.style.display = sm.style.display==="none" ? "block" : "none"; };
document.getElementById("topic-marathon").onclick=()=>openSession("marathon");
document.getElementById("topic-energy").onclick=()=>openSession("energy");
document.getElementById("topic-own").onclick=()=>{ document.getElementById("topichint").style.display="block"; };
document.getElementById("rundenarchiv").innerHTML='<div style="font-size:13px;color:var(--text3);padding:6px 0">Noch keine Runden — sie erscheinen hier, sobald dein Team welche haelt.</div>';

renderOrbit(); renderDay(); renderLog(); renderStaticOrbs(); renderPicker(); renderCoachCards(); updateMemUI();
document.getElementById("tagfeed").innerHTML='<div style="font-size:13px;color:var(--text3)">Noch ruhig hier. Sobald dein Team dich kennt, meldet es sich von selbst.</div>';
const _sb=document.getElementById("startbtn"); if(_sb) _sb.onclick=()=>openCall("viktor");
(function(){
  const ow=document.getElementById("orbitwrap"); if(!ow) return;
  ow.addEventListener("pointerdown",e=>{ _dragLast=e.clientX; _dragMoved=0; });
  window.addEventListener("pointermove",e=>{ if(_dragLast!=null){ const dx=e.clientX-_dragLast; dragSpin+=dx*0.007; _dragMoved+=Math.abs(dx); _dragLast=e.clientX; } });
  window.addEventListener("pointerup",()=>{ _dragLast=null; });
  window.addEventListener("mousemove",e=>{ mouseSpinT=(e.clientX/window.innerWidth-0.5)*1.3; });
})();
runFX("home");

setTimeout(()=>{
  if(callOpen || !anthKey) return;
  const who = memFacts.length ? "elias" : "viktor";
  ping(who,"Kennenlernen","Ich bin neugierig auf dich — hast du kurz Zeit?",who);
  orbPulse(who,true);
  orbitSay(who,"Neugierig","<b>"+COACHES[who].name+" moechte dich kennenlernen.</b> Antippen zum Sprechen.");
}, 9000);

const _pb=document.getElementById("pausebtn"); if(_pb) _pb.onclick=()=>setPaused(!paused);


/* Chat senden */
(function(){
  const sendb=document.getElementById("chatsend"), inp=document.getElementById("chatinput");
  if(sendb) sendb.onclick=sendChat;
  if(inp) inp.addEventListener("keydown",e=>{ if(e.key==="Enter"){ e.preventDefault(); sendChat(); } });
})();

/* Anthropic-Einstellungen */
(function(){
  const s=document.getElementById("anthstatus");
  function stat(){ s.textContent = anthKey ? "Aktiv — 1:1-Gespräche denken wirklich." : "Kein Key — Coaches nutzen feste Antworten."; }
  const open=document.getElementById("settingsbtn");
  const prev=open.onclick;
  open.onclick=()=>{ if(prev) prev(); document.getElementById("anthkeyinput").value=anthKey; stat(); };
  document.getElementById("anthsave").onclick=()=>{
    anthKey=document.getElementById("anthkeyinput").value.trim(); store.set("anthKey",anthKey); stat();
    if(anthKey) document.getElementById("settings").style.display="none";
  };
  document.getElementById("anthremove").onclick=()=>{
    anthKey=""; store.set("anthKey",""); document.getElementById("anthkeyinput").value=""; stat();
  };
  const mr=document.getElementById("memreset");
  if(mr) mr.onclick=()=>{ if(confirm("Alles Gemerkte löschen? Dein Team startet dann wieder bei null.")){ memFacts=[]; saveMem(); updateMemUI(); } };
  const mb=document.getElementById("membackup");
  if(mb) mb.onclick=()=>{
    const data={ v:1, exported:new Date().toISOString(), memFacts:memFacts, elKey:elKey, anthKey:anthKey, voiceOn:voiceOn };
    const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
    const a=document.createElement("a"); a.href=URL.createObjectURL(blob);
    a.download="mein-team-backup.json"; document.body.appendChild(a); a.click(); a.remove();
    s.textContent="Sicherung heruntergeladen ("+memFacts.length+" Fakten).";
  };
  const mi=document.getElementById("memimport"), mf=document.getElementById("memfile");
  if(mi&&mf){
    mi.onclick=()=>mf.click();
    mf.onchange=()=>{
      const f=mf.files&&mf.files[0]; if(!f) return;
      const rd=new FileReader();
      rd.onload=()=>{ try{
        const d=JSON.parse(rd.result);
        if(Array.isArray(d.memFacts)){ memFacts=d.memFacts.slice(); saveMem(); updateMemUI(); }
        if(typeof d.elKey==="string"){ elKey=d.elKey; store.set("elKey",elKey); }
        if(typeof d.anthKey==="string"){ anthKey=d.anthKey; store.set("anthKey",anthKey); document.getElementById("anthkeyinput").value=anthKey; }
        if(typeof d.voiceOn==="boolean"){ voiceOn=d.voiceOn; store.set("voiceOn",voiceOn?"1":"0"); }
        elFail=false; syncToggles(); stat();
        s.textContent="Geladen: "+((d.memFacts||[]).length)+" Fakten + Einstellungen.";
      }catch(e){ s.textContent="Konnte Datei nicht lesen."; } mf.value=""; };
      rd.readAsText(f);
    };
  }
  document.getElementById("anthtest").onclick=()=>{
    const key=(document.getElementById("anthkeyinput").value||"").trim()||anthKey;
    if(!key){ s.textContent="Bitte zuerst einen Key einfuegen."; return; }
    s.textContent="Teste …";
    askClaude("viktor",[{role:"user",content:"Sag in einem kurzen Satz Hallo zu Marco."}],key)
      .then(r=>{ anthKey=key; store.set("anthKey",key); s.textContent="✓ Verbindung ok — "+r.slice(0,60); })
      .catch(e=>{ s.textContent="✗ "+anthErr(e); });
  };
})();

if("serviceWorker" in navigator){ navigator.serviceWorker.register("sw.js").catch(()=>{}); }

/* ===== Studio-Stimmen: Einstellungen ===== */
const settingsEl=document.getElementById("settings");
function elStatus(){
  const s=document.getElementById("elstatus");
  s.textContent = elKey ? (elFail?"Key gespeichert — letzter Versuch fehlgeschlagen":"Aktiv — deine Coaches sprechen mit Studio-Stimmen")
    : "Kein Key — es werden Systemstimmen genutzt";
}
document.getElementById("settingsbtn").onclick=()=>{
  document.getElementById("elkeyinput").value=elKey;
  elStatus(); settingsEl.style.display="flex";
};
document.getElementById("elsave").onclick=()=>{
  elKey=document.getElementById("elkeyinput").value.trim();
  store.set("elKey",elKey); elFail=false; audioCache.clear();
  elStatus(); syncToggles();
  if(elKey) settingsEl.style.display="none";
};
document.getElementById("elremove").onclick=()=>{
  elKey=""; store.set("elKey",""); document.getElementById("elkeyinput").value="";
  elStatus(); syncToggles();
};
document.getElementById("elclose").onclick=()=>{ settingsEl.style.display="none"; };
function elErrorText(e){
  const m=String(e&&e.message||e);
  if(m.includes("401")) return "Key ungültig oder unvollständig kopiert (401).";
  if(m.includes("402")||m.includes("credits")) return "Kein Guthaben auf dem Konto (402) — Abo/Credits prüfen.";
  if(m.includes("403")) return "Key hat keine Text-to-Speech-Berechtigung (403).";
  if(m.includes("429")) return "Limit erreicht — kurz warten (429).";
  if(m.includes("404")) return "Stimme/Modell nicht gefunden (404).";
  if(m.toLowerCase().includes("fetch")||m.toLowerCase().includes("network")) return "Netzwerk/CORS blockiert die Anfrage — bist du online? Läuft die App über https (Netlify)?";
  return "Unbekannter Fehler: "+m;
}
document.getElementById("eltest").onclick=()=>{
  const s=document.getElementById("elstatus");
  const key=document.getElementById("elkeyinput").value.trim()||elKey;
  if(!key){ s.textContent="Bitte zuerst einen Key einfügen."; return; }
  s.textContent="Teste …";
  fetch("https://api.elevenlabs.io/v1/text-to-speech/"+EL_VOICES.viktor+"?output_format=mp3_44100_64",{
    method:"POST",
    headers:{ "xi-api-key":key, "Content-Type":"application/json" },
    body:JSON.stringify({ text:"Hallo Marco, hier ist Viktor. Die Verbindung steht.", model_id:"eleven_flash_v2_5" })
  }).then(r=>{
    if(!r.ok) return r.text().then(t=>{ throw new Error("HTTP "+r.status+" "+t.slice(0,120)); });
    return r.blob();
  }).then(b=>{
    s.textContent="✓ Verbindung ok — Viktor spricht.";
    elKey=key; store.set("elKey",key); elFail=false; syncToggles();
    player.src=URL.createObjectURL(b); player.play().catch(()=>{ s.textContent="✓ Audio geladen — Ton ggf. stummgeschaltet?"; });
  }).catch(e=>{ s.textContent="✗ "+elErrorText(e); });
};
settingsEl.addEventListener("click",e=>{ if(e.target===settingsEl) settingsEl.style.display="none"; });
