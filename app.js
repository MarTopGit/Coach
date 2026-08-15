"use strict";
/* Coach Hub v2 — cinematic, voice-first. Demo-Daten; im echten System: Whoop, Gym-App, Kalender, Cloud-Gehirn. */

const COACHES = {
  viktor:{ name:"Viktor", role:"Head Coach", vibe:"Mentor · klare Linie", hex:"#8b7ff0", ini:"V", rate:0.97, pitch:0.9 },
  deniz:{ name:"Deniz", role:"Sport", vibe:"energisch · Berliner Schnauze", hex:"#ff7a4d", ini:"D", rate:1.08, pitch:1.0 },
  lena:{ name:"Lena", role:"Ernährung", vibe:"strukturiert · fundiert", hex:"#96d94e", ini:"L", rate:1.03, pitch:1.1 },
  peter:{ name:"Peter", role:"Beruf", vibe:"ruhig · Klartext", hex:"#5aa9f5", ini:"P", rate:1.0, pitch:0.9 },
  elias:{ name:"Elias", role:"Mental", vibe:"warm · bestärkend", hex:"#f06a9e", ini:"E", rate:0.94, pitch:0.95 },
  mara:{ name:"Mara", role:"Achtsamkeit", vibe:"entschleunigend · weise", hex:"#3fd6ad", ini:"M", rate:0.92, pitch:1.05 },
};
const ORDER = Object.keys(COACHES);
const SPECIALISTS = ORDER.filter(id=>id!=="viktor"); // v43: Viktor ist der Kern, diese 5 umkreisen ihn
const AVV="?v=62"; // Avatar-Cache-Bust (früh definiert, da loadAvatars zeitig läuft)

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
    parts:["viktor","deniz","mara","lena"],
    intro:[
      ["sys","Team-Runde · Belastung nächste Woche · du hörst mit"],
      ["viktor","Kurz zur Lage: Marcos Kraftwerte steigen seit sechs Wochen stabil. Frage an die Runde — wie belasten wir nächste Woche, ohne zu überziehen? Offen und fair, wir suchen den besten Weg."],
      ["deniz","Ich sehe Luft für etwas mehr Intensität — aber nur, wenn die Erholung mitspielt. Nicht stur mehr, sondern klug mehr."],
      ["mara","Da bin ich ganz bei Deniz: die Richtung stimmt, das Tempo muss zu Marcos Erholung passen. Ein fester freier Tag als Anker wäre mir wichtig."],
      ["lena","Und die Energie fange ich über die Ernährung ab — an intensiveren Tagen einfach etwas mehr Kohlenhydrate, dann trägt der Körper das gut mit."],
      ["viktor","Klingt nach Konsens: drei Einheiten, eine davon intensiver, gekoppelt an die Erholung, plus ein fester Ruhetag. Sind alle einverstanden?"],
      ["deniz","Von mir ein klares Ja."],
      ["mara","Auch von mir — so fühlt es sich rund an."],
    ],
    chips:[
      { t:"✓ Empfehlung annehmen", next:"accept" },
      { t:"Lieber ganz ruhig nächste Woche", next:"calm" },
    ],
    branches:{
      accept:{ m:[["sys","Entscheidung gespeichert → Logbuch"],["viktor","So machen wir's — gemeinsam getragen."],["mara","Und der Ruhetag steht."]], chips:[] },
      calm:{ m:[["mara","Auch eine schöne Entscheidung — Erholung ist nie verschenkt."],["deniz","Passt, dann sammeln wir Kraft für die Woche drauf. Voll dabei."],["sys","Entscheidung gespeichert → Logbuch · ruhige Woche"]], chips:[] },
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
const EL_VOICES={ viktor:"MMwckqU477oQxnAk1SgA", deniz:"YqQRnUKh927WHIDqnaT5", peter:"29P4oL0t0q3euslXSCVo",
  elias:"soHmiIubT10zZnlm8aIb", lena:"mDRP1h6KfUD1XAUJxqr0", mara:"NE7AIW5DoJ7lUosXV2KR" };
// v35: natürlicheres Modell (flüssige, ganze Sätze statt „gehackt")
const EL_MODEL="eleven_multilingual_v2";
const EL_SETTINGS={ stability:0.45, similarity_boost:0.85, style:0.15, use_speaker_boost:true };
const audioCache=new Map();
const player=new Audio();
let audioUnlocked=false;
function unlockAudio(){
  if(audioUnlocked) return; audioUnlocked=true;
  try{ const c=actx(); if(c && c.state==="suspended") c.resume(); }catch(e){}
  try{ player.src="data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAAAA=";
    player.play().catch(()=>{}); }catch(e){}
  try{ if(window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission==="function"){
    DeviceOrientationEvent.requestPermission().then(st=>{ if(st==="granted") attachTilt(); }).catch(()=>{});
  } }catch(e){}
}
document.addEventListener("pointerdown", unlockAudio, { once:true, capture:true });

/* ---- Audio-Kontext (nur für Analyse + kurze UI-Sounds; die Coach-Stimme bleibt am <audio>, iOS-Lautstärke bleibt aktiv) ---- */
let _actx=null;
function actx(){ try{ if(!_actx) _actx=new (window.AudioContext||window.webkitAudioContext)(); return _actx; }catch(e){ return null; } }
/* Hüllkurve aus echten Audio-Samples berechnen → Aura pulsiert mit der wirklichen Stimme */
function buildEnv(ab){
  return new Promise((res)=>{
    const ctx=actx(); if(!ctx||!ab){ res(null); return; }
    try{
      ctx.decodeAudioData(ab.slice(0), (buf)=>{
        try{
          const ch=buf.getChannelData(0), sr=buf.sampleRate, fd=0.035, per=Math.max(1,Math.floor(sr*fd));
          const n=Math.ceil(ch.length/per), b=new Float32Array(n); let mx=1e-6;
          for(let i=0;i<n;i++){ let s=0,c=0; const st=i*per, en=Math.min(ch.length,st+per);
            for(let j=st;j<en;j++){ s+=ch[j]*ch[j]; c++; } const rms=Math.sqrt(s/(c||1)); b[i]=rms; if(rms>mx)mx=rms; }
          for(let i=0;i<n;i++){ b[i]=Math.min(1,b[i]/mx); }
          res({b:b, fd:fd, dur:buf.duration});
        }catch(e){ res(null); }
      }, ()=>res(null));
    }catch(e){ res(null); }
  });
}
/* ---- Dezentes Sound-Design (kurze synthetische UI-Klänge) ---- */
function sfx(type){
  if(!voiceOn) return;
  const ctx=actx(); if(!ctx) return;
  try{ if(ctx.state==="suspended") ctx.resume(); }catch(e){}
  const now=ctx.currentTime;
  try{
    if(type==="whoosh"||type==="whoosh2"){
      const up=(type==="whoosh"), dur=0.5;
      const buf=ctx.createBuffer(1, Math.floor(ctx.sampleRate*dur), ctx.sampleRate), d=buf.getChannelData(0);
      for(let i=0;i<d.length;i++) d[i]=Math.random()*2-1;
      const src=ctx.createBufferSource(); src.buffer=buf;
      const bp=ctx.createBiquadFilter(); bp.type="bandpass"; bp.Q.value=0.7;
      bp.frequency.setValueAtTime(up?300:1100, now);
      bp.frequency.exponentialRampToValueAtTime(up?1500:260, now+dur);
      const g=ctx.createGain();
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(0.10, now+0.08);
      g.gain.exponentialRampToValueAtTime(0.0001, now+dur);
      src.connect(bp); bp.connect(g); g.connect(ctx.destination); src.start(now); src.stop(now+dur);
    } else if(type==="chime"){
      [523.25,659.25,783.99].forEach((f,i)=>{
        const o=ctx.createOscillator(); o.type="sine"; o.frequency.value=f;
        const g=ctx.createGain(), st=now+i*0.07;
        g.gain.setValueAtTime(0.0001, st);
        g.gain.exponentialRampToValueAtTime(0.09, st+0.03);
        g.gain.exponentialRampToValueAtTime(0.0001, st+0.95);
        o.connect(g); g.connect(ctx.destination); o.start(st); o.stop(st+1);
      });
    }
  }catch(e){}
}
/* ---- Sprech-reaktive Aura (echte Hüllkurve, sonst synthetisch) ---- */
let speakingNow=false, auraRaf=null, curEnv=null, auraAmp=0;
function startAura(){
  stopAura();
  const t0=performance.now();
  const loop=(now)=>{
    if(!callOpen || !speakingNow){ stopAura(); return; }
    const t=(now-t0)/1000;
    let target;
    if(curEnv && curEnv.b && curEnv.b.length){
      let idx=Math.floor((player.currentTime||0)/curEnv.fd);
      if(idx<0) idx=0; if(idx>=curEnv.b.length) idx=curEnv.b.length-1;
      target=curEnv.b[idx]||0;                       // echte Lautstärke der Stimme
    } else {
      const env=Math.abs(0.55*Math.sin(t*7.3)+0.45*Math.sin(t*12.9+1.1));
      target=0.3+0.7*env;                            // Fallback (System-Stimme ohne Samples)
    }
    auraAmp += (target-auraAmp)*0.16;                // weichere, trägere Glättung
    const amp=Math.min(1,Math.max(.05,auraAmp));
    const vr=document.getElementById("voicering"), orb=document.getElementById("bigorb");
    if(vr){ vr.style.opacity=(amp*.42).toFixed(2); vr.style.transform="scale("+(1+amp*.14).toFixed(3)+")"; vr.style.borderColor=curHex; }
    if(orb) orb.style.boxShadow="0 6px "+(16+amp*30).toFixed(0)+"px "+curHex+(amp>.55?"44":"22")+", 0 3px 12px rgba(0,0,0,.12)";
    auraRaf=requestAnimationFrame(loop);
  };
  auraRaf=requestAnimationFrame(loop);
}
function stopAura(){
  if(auraRaf){ cancelAnimationFrame(auraRaf); auraRaf=null; }
  auraAmp=0;
  const vr=document.getElementById("voicering"); if(vr) vr.style.opacity="0";
  const orb=document.getElementById("bigorb"); if(orb) orb.style.boxShadow="";
}

/* ---- Gyro-/Maus-Parallax ---- */
let _px=0,_py=0,_tx=0,_ty=0,_paraOn=false;
function startParallax(){
  if(_paraOn) return; _paraOn=true;
  const loop=()=>{
    _px+=(_tx-_px)*.07; _py+=(_ty-_py)*.07;
    const ow=document.getElementById("orbitwrap");
    const sy=window.scrollY||0;
    const base=Math.min(1.04,(Math.min(window.innerWidth,480)-16)/320);
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
(function(){
  const intro=document.getElementById("intro"); if(!intro) return;
  // Nur einmal pro App-Session zeigen — sonst sofort weg (verhindert doppeltes Logo beim (Neu-)Rendern)
  let shown=false; try{ shown=sessionStorage.getItem("introShown")==="1"; }catch(e){}
  if(shown){ intro.classList.add("hidden"); try{ intro.remove(); }catch(e){} return; }
  try{ sessionStorage.setItem("introShown","1"); }catch(e){}
  const ring=intro.querySelector(".ring");
  if(ring && !ring.querySelector(".d")){                 // Dots nur anlegen, wenn noch keine da sind (kein Doppel)
    ORDER.forEach((id,i)=>{
      const a=Math.PI/2 - i*Math.PI/3, R=44;
      const dt=document.createElement("div"); dt.className="d";
      dt.style.background=COACHES[id].hex;
      dt.style.left=(60+Math.cos(a)*R-11).toFixed(1)+"px";
      dt.style.top=(60-Math.sin(a)*R-11).toFixed(1)+"px";
      dt.style.animationDelay=(0.15+i*0.09)+"s";
      ring.appendChild(dt);
    });
  }
  setTimeout(()=>{ intro.classList.add("hidden"); try{ intro.remove(); }catch(e){} }, 2500);
})();

const AUDIO_CACHE="coach-audio-v3";
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
      player.play().then(()=>{}).catch(rej);
    };
    curEnv=null;  // Hüllkurve pro Beitrag frisch; bis sie da ist, greift die synthetische Aura
    getCachedAudio(coachId,clean).then(cached=>{
      if(cached){
        try{ fetch(cached).then(r=>r.arrayBuffer()).then(ab=>buildEnv(ab)).then(e=>{ curEnv=e; }).catch(()=>{}); }catch(e){}
        start(cached); return;
      }
      fetch("https://api.elevenlabs.io/v1/text-to-speech/"+EL_VOICES[coachId]+"?output_format=mp3_44100_64",{
        method:"POST",
        headers:{ "xi-api-key":elKey, "Content-Type":"application/json" },
        body:JSON.stringify({ text:clean, model_id:EL_MODEL, voice_settings:EL_SETTINGS })
      }).then(r=>{ if(!r.ok) throw new Error("http "+r.status); return r.arrayBuffer(); })
        .then(ab=>{ const b=new Blob([ab],{type:"audio/mpeg"}); putCachedAudio(coachId,clean,b);
          const url=URL.createObjectURL(b); audioCache.set(coachId+"|"+clean,url);
          buildEnv(ab).then(e=>{ curEnv=e; }).catch(()=>{});
          start(url); })
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
function openCall(id, openingNote){
  paused=false; resumeFn=null; liveMode=false; liveCoachId=null; liveTeam=false; liveParticipants=[];
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
  call.classList.toggle("teammode", isTeam);
  call.classList.remove("chatting");                      // Coach startet wieder groß/präsent
  call.classList.add("open");
  call.classList.add("igniting");                         // Eintritt: Orb entzündet sich, Center schiebt sich heran
  setTimeout(()=>call.classList.remove("igniting"), 780);
  sfx("whoosh");
  if(isTeam){ const t=++seqToken; runSequence(currentScript.intro, ()=>showChips(currentScript.chips), t); }
  else if(liveMode){ enterLive(id, openingNote); }
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
  // v29: echtes 1:1-Gespräch vor dem Aufräumen für ein Logbuch-Fazit erfassen
  const _sumId=liveCoachId, _sumHist=(convHistory||[]).slice();
  const _realTurns=_sumHist.filter(m=>m.role==="user" && !/Interner Hinweis/.test(m.content||"")).length;
  const _wasTeam=liveTeam, _shared=(sharedLog||[]).slice();
  if(_wasTeam){ if(_shared.filter(m=>m.who==="marco").length>=1){ try{ summarizeTeam(_shared); }catch(e){} } }
  else if(_sumId && _realTurns>=1){ try{ summarizeConversation(_sumId, _sumHist); }catch(e){} }
  liveTeam=false; liveParticipants=[];
  callOpen=false; seqToken++; paused=false; resumeFn=null;
  sfx("whoosh2");
  const b=document.getElementById("pausebtn"); if(b) b.textContent="❚❚";
  document.getElementById("call").classList.remove("open");
  document.getElementById("call").classList.remove("speaking");
  if(window.speechSynthesis) speechSynthesis.cancel();
  try{ player.pause(); player.currentTime=0; }catch(e){}
  speakingNow=false; stopAura(); document.getElementById("call").classList.remove("live");
  liveMode=false; const _cb2=document.getElementById("chatbar"); if(_cb2) _cb2.style.display="none";
  try{ if(window.__releaseMic) window.__releaseMic(); }catch(e){}
}
function setSpeaker(id, instant){
  const c=COACHES[id];
  const orb=document.getElementById("bigorb");
  orb.setAttribute("style", orbStyle(id));
  orb.classList.toggle("hasimg",!!AVOK[id]);
  orbBg(orb,id);   // Foto sofort als Hintergrund → kein Farb-zu-Foto-Sprung
  orb.innerHTML=avatarInner(id)+'<i class="sheen"></i><span class="ring" style="border-color:'+c.hex+'40"></span>';
  curHex=c.hex;
  document.getElementById("cname").textContent=c.name;
  document.getElementById("crole").textContent=c.role;
  const callEl=document.getElementById("call");
  callEl.style.setProperty("--coach", c.hex);
  const sendb=document.getElementById("chatsend"); if(sendb) sendb.style.background=c.hex;
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
  speakingNow=on;
  if(on) startAura(); else stopAura();
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
  if(!isTeam) addOldify();
  setSpeaker(who);
  const c=COACHES[who];
  const words=text.split(" ");
  const wspans=words.map(w=>`<span class="w">${esc(w)}</span>`).join(" ");
  let line;
  if(isTeam){
    line=el(`<div class="grow"><div class="gav" style="background:${c.hex}">${avatarInner(who)}</div>`+
      `<div class="gbub"><div class="gname" style="color:${c.hex}">${c.name}</div><div class="gtext">${wspans}</div></div></div>`);
  } else {
    line=el(`<div class="tline">${wspans}</div>`);
  }
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
const OCX=160, OCY=88, ORX=126, ORY=44, OW=(2*Math.PI)/140000;
let dragSpin=0, mouseSpin=0, mouseSpinT=0, _dragLast=null, _dragMoved=0;
let orbEls=[], orbitT0=0, frontId="";
const AVOK={};
function avatarInner(id){ return AVOK[id] ? '<img src="avatars/'+id+'.png'+AVV+'" alt="">' : COACHES[id].ini; }
function refreshOrbFaces(){
  orbEls.forEach(o=>{ const id=o.dataset.c;
    o.classList.toggle("hasimg",!!AVOK[id]);
    const note=coachHasNote(id); o.classList.toggle("hasnote",note); if(note) o.style.setProperty("--pc",COACHES[id].hex);
    o.innerHTML=avatarInner(id)+'<i class="sheen"></i><span class="ring" style="border-color:'+COACHES[id].hex+'40"></span>'; });
  if(typeof renderViktorHero==="function") try{ renderViktorHero(); }catch(e){}
  if(typeof renderStaticOrbs==="function") try{ renderStaticOrbs(); }catch(e){}
  if(typeof renderPicker==="function") try{ renderPicker(); }catch(e){}
  if(typeof renderCoachCards==="function") try{ renderCoachCards(); }catch(e){}
}
function loadAvatars(){
  ORDER.forEach(id=>{ try{
    const im=new Image();
    im.onload=()=>{ AVOK[id]=true; try{ if(im.decode) im.decode().catch(()=>{}); }catch(e){} refreshOrbFaces(); };
    im.src="avatars/"+id+".png"+AVV;
  }catch(e){} });
}
function orbBg(el,id){ if(el&&AVOK[id]){ el.style.backgroundImage="url('avatars/"+id+".png"+AVV+"')"; el.style.backgroundSize="cover"; el.style.backgroundPosition="center"; } }
function easeOutBack(x){ const c=1.70158; return 1+(c+1)*Math.pow(x-1,3)+c*Math.pow(x-1,2); }
function renderOrbit(){
  const now=new Date();
  const days=["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"];
  const months=["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];
  document.getElementById("datum").textContent=days[now.getDay()]+", "+now.getDate()+". "+months[now.getMonth()];
  const h=now.getHours();
  document.getElementById("greeting").textContent=(h<11?"Guten Morgen":h<18?"Hallo":"Guten Abend")+", Marco";
  const wrap=document.getElementById("orbs"); wrap.innerHTML=""; orbEls=[];
  SPECIALISTS.forEach((id,i)=>{
    const note=coachHasNote(id)?" hasnote":"";
    const o=el('<div class="orb oorb'+note+'" data-c="'+id+'" style="'+orbStyle(id)+';opacity:0">'+
      avatarInner(id)+'<i class="sheen" style="animation-delay:-'+(i*3)+'s"></i><span class="ring"></span></div>');
    if(note) o.style.setProperty("--pc", COACHES[id].hex);
    o.onclick=()=>flyOpen(id,o);
    wrap.appendChild(o); orbEls.push(o);
  });
  renderViktorHero();
  orbitT0=performance.now();
  requestAnimationFrame(orbitLoop);
}
function renderViktorHero(){
  const o=document.getElementById("vheroorb"); if(!o) return;
  o.setAttribute("style", orbStyle("viktor"));
  o.classList.add("orb"); o.classList.toggle("hasimg", !!AVOK.viktor);
  o.innerHTML=avatarInner("viktor")+'<i class="sheen"></i><span class="ring" style="border-color:'+COACHES.viktor.hex+'55"></span>';
  o.onclick=()=>openCall("viktor");                                   // Hero ist nicht drehbar → direkt öffnen (keine Drag-Sperre)
  const b=document.getElementById("checkinbtn"); if(b) b.onclick=()=>openCall("viktor");
}
function coachHasNote(id){
  const w=(typeof whoopData!=="undefined"&&whoopData&&whoopData.length)?whoopData[0]:null;
  const wk=(typeof workoutData!=="undefined")?workoutData:null;
  if(id==="deniz"){ if(w&&w.recovery!=null&&w.recovery<55) return true;
    if(wk&&wk.length){ const days=(Date.now()-new Date(wk[0].workout_date).getTime())/864e5; if(days>3) return true; } return false; }
  if(id==="elias"){ if(w&&w.sleep_hours!=null&&w.sleep_hours<6.5) return true; if(w&&w.recovery!=null&&w.recovery<45) return true; return false; }
  if(id==="mara"){ if(w&&w.strain!=null&&w.strain>14) return true; if(w&&w.recovery!=null&&w.recovery<45) return true; return false; }
  return false;
}
function viktorBriefing(){
  const bits=[];
  if(typeof whoopData!=="undefined" && whoopData && whoopData.length && whoopData[0].recovery!=null) bits.push("Recovery "+whoopData[0].recovery+"%");
  if(typeof workoutData!=="undefined" && workoutData && workoutData.length){ const wk=weekCount(workoutData,"workout_date"); bits.push(wk+(wk===1?" Einheit":" Einheiten")+" diese Woche"); }
  if(bits.length) return "Kurzer Lagebericht: <b>"+bits.join(" · ")+"</b>. Tipp mich an für deinen Tag.";
  if(typeof memItems!=="undefined" && memItems.length) return "Ich hab dein Team im Blick. <b>Womit starten wir heute?</b>";
  return "Dein Team ist startklar — <b>ich koordiniere</b>. Erzähl mir, worum es heute geht.";
}
function orbitLoop(nowT){
  const t=nowT-orbitT0;
  mouseSpin+=(mouseSpinT-mouseSpin)*0.06;
  let bestZ=-2, bestId="", allIn=true, minPe=1; const pts=[];
  orbEls.forEach((o,i)=>{
    const pe=Math.min(1,Math.max(0,(t-160-i*95)/850));
    if(pe<1) allIn=false; if(pe<minPe) minPe=pe;
    const sp=pe<=0?0:easeOutBack(pe);
    const ang=Math.PI/2+i*(2*Math.PI/5)+t*OW+dragSpin+mouseSpin;
    const z=Math.sin(ang), f=(z+1)/2;
    const x=OCX+Math.cos(ang)*ORX*sp, y=OCY+Math.sin(ang)*ORY*sp;
    const sc=(.4+.9*f)*(.3+.7*Math.min(1,pe*1.15));
    o.style.left=(x-32).toFixed(1)+"px";
    o.style.top=(y-32).toFixed(1)+"px";
    o.style.transform="scale("+sc.toFixed(3)+")";
    o.style.opacity=(pe<=0?0:(.45+.55*f)*Math.min(1,pe*1.6)).toFixed(2);
    o.style.zIndex=String(20+Math.round(z*10));
    pts.push(x.toFixed(1)+","+y.toFixed(1));
    if(z>bestZ){ bestZ=z; bestId=o.dataset.c; }
  });
  const net=document.getElementById("orbnet");
  if(net){ net.setAttribute("points", pts.join(" ")); net.style.opacity=(minPe*0.9).toFixed(2); }
  if(allIn && bestId && bestId!==frontId){
    frontId=bestId;
    const fn=document.getElementById("frontname");
    if(fn){ fn.textContent=COACHES[frontId].name+" · "+COACHES[frontId].role; fn.style.opacity="1"; }
  }
  requestAnimationFrame(orbitLoop);
}
function flyOpen(id, srcEl){
  if(_dragMoved>8){ return; }
  // Kein fliegender Klon mehr (Quelle des Ruckelns): sauberer, in sich geschlossener Auftritt des großen Orbs.
  openCall(id);
}
function orbitSay(coachId,title,html,target){
  const m=document.getElementById("orbitmsg"); if(!m) return;
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
function weekCount(rows, dateKey){
  const now=new Date(); const monday=new Date(now); const dow=(now.getDay()+6)%7;
  monday.setDate(now.getDate()-dow); monday.setHours(0,0,0,0);
  let n=0; (rows||[]).forEach(r=>{ const d=new Date(r[dateKey]); if(d>=monday) n++; }); return n;
}
function renderDay(){
  const wv=document.getElementById("whoop-val"), ws=document.getElementById("whoop-sub"), wc=document.getElementById("m-whoop");
  if(whoopData && whoopData.length){
    const d=whoopData[0], rec=d.recovery;
    if(wv){ wv.textContent = rec!=null ? rec+"%" : "—";
      wv.style.color = rec==null?"var(--text)":(rec>=67?"var(--good)":rec>=34?"var(--warn)":"#c0392b"); }
    const p=[];
    if(d.sleep_hours!=null) p.push("Schlaf "+String(d.sleep_hours).replace(".",",")+" h");
    if(d.hrv!=null) p.push("HRV "+d.hrv);
    if(d.rhr!=null) p.push("Ruhepuls "+d.rhr);
    if(d.strain!=null) p.push("Strain "+String(d.strain).replace(".",","));
    if(ws) ws.textContent=(rec!=null?"Recovery":"")+(p.length?" · "+p.join(" · "):"");
    if(wc){ wc.style.cursor="pointer"; wc.onclick=()=>openCall("elias"); }
  } else {
    if(wv){ wv.textContent="Nicht verbunden"; wv.style.color="var(--text3)"; }
    if(ws) ws.textContent="Im ⚙︎ unter „Whoop“ verbinden.";
    if(wc){ wc.style.cursor="default"; wc.onclick=null; }
  }
  const tv=document.getElementById("train-val"), ts=document.getElementById("train-sub"), tc=document.getElementById("m-train");
  if(workoutData && workoutData.length){
    const last=workoutData[0], wk=weekCount(workoutData,"workout_date");
    if(tv){ tv.textContent=wk+(wk===1?" Einheit":" Einheiten"); tv.style.color="var(--text)"; }
    if(ts) ts.textContent="Zuletzt "+last.workout_date+": "+(last.summary||last.type||"Training");
    if(tc){ tc.style.cursor="pointer"; tc.onclick=()=>openCall("deniz"); }
  } else {
    if(tv){ tv.textContent="Noch nichts"; tv.style.color="var(--text3)"; }
    if(ts) ts.textContent="Deine Gym-App — noch keine Trainings.";
    if(tc){ tc.style.cursor="default"; tc.onclick=null; }
  }
  const tl=document.getElementById("tagtl");
  if(tl) tl.innerHTML='<div style="font-size:13px;color:var(--text3);padding:6px 0 2px">Noch kein Kalender verbunden.</div>';
}

/* ===== Log & Feed ===== */
const ACTIONS=[
  { ico:"🏋️", t:"Deniz · Zielgewichte in der Trainings-App angepasst (Technik-Tag)", time:"heute 08:12 · autonom · widerrufbar" },
  { ico:"📅", t:"Deniz · Kalendereintrag „Beine (Technik)“ 12:30 vorgeschlagen", time:"heute 08:12 · wartet auf ✓" },
  { ico:"🧠", t:"Elias · Check-in ausgelöst (Schlaf < 6 h, HRV ↓)", time:"heute 07:58 · Regel „Fürsorge“" },
  { ico:"🥗", t:"Lena · Speiseplan an Trainingszeit angepasst", time:"heute 07:55 · autonom" },
  { ico:"🤝", t:"Viktor & Mara · Team-Runde „Belastung nächste Woche“ gestartet", time:"gestern 21:40" },
];
function fmtWhen(iso){
  const d=new Date(iso), now=new Date();
  const hh=String(d.getHours()).padStart(2,"0")+":"+String(d.getMinutes()).padStart(2,"0");
  const y=new Date(now.getTime()-864e5);
  if(d.toDateString()===now.toDateString()) return "heute "+hh;
  if(d.toDateString()===y.toDateString()) return "gestern "+hh;
  return d.getDate()+"."+(d.getMonth()+1)+". "+hh;
}
function renderLog(){
  const box=document.getElementById("actionlog"); if(!box) return;
  if(!logEntries.length){
    box.innerHTML='<div style="font-size:13px;color:var(--text3);padding:6px 0">Noch keine Einträge. Nach jedem Gespräch hält dein Team hier ein kurzes Fazit fest — nur für dich, nachvollziehbar.</div>';
    return;
  }
  box.innerHTML=logEntries.map(e=>{
    const c=COACHES[e.coach]||COACHES.viktor;
    return '<div class="logrow"><div class="lr-ico" style="background:'+c.hex+'22;color:'+c.hex+';font-weight:700;font-size:12px">'+c.ini+'</div>'+
      '<div style="flex:1">'+esc(e.t)+'<div class="lr-t">'+c.name+' · '+fmtWhen(e.d)+'</div></div></div>';
  }).join("");
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
function hideToast(){ const t=document.getElementById("toast"); if(t){ t.classList.remove("show"); t.style.transform=""; } }
/* Nachricht nach oben wegwischen — nur die Karte bewegt sich, Hintergrund bleibt, weiches Wegfahren */
(function(){
  const t=document.getElementById("toast"); if(!t) return;
  let sy=0, dy=0, dragging=false, moved=false;
  t.addEventListener("touchstart",e=>{ if(!t.classList.contains("show"))return; sy=e.touches[0].clientY; dy=0; moved=false; dragging=true; t.style.transition="none"; },{passive:true});
  t.addEventListener("touchmove",e=>{ if(!dragging)return; dy=e.touches[0].clientY-sy;
    if(Math.abs(dy)>5) moved=true;
    if(dy<0){ e.preventDefault(); t.style.transform="translateY("+dy+"px)"; }       // nur nach oben; Seite scrollt NICHT mit
    else { t.style.transform="translateY("+(dy*0.18).toFixed(1)+"px)"; }             // nach unten nur minimaler Widerstand
  },{passive:false});
  t.addEventListener("touchend",()=>{ if(!dragging)return; dragging=false;
    t.style.transition="transform .34s cubic-bezier(.4,0,.2,1)";
    if(dy<-42){                                                                      // genug gewischt → weich ganz nach oben rausfahren
      t.style.transform="translateY(-170%)";
      setTimeout(()=>{ t.classList.remove("show"); t.style.transform=""; t.style.transition=""; }, 340);
    } else {                                                                         // zu wenig → sanft zurück an seinen Platz
      t.style.transform="";
      setTimeout(()=>{ t.style.transition=""; }, 340);
    }
  });
  t.addEventListener("click",e=>{ if(moved){ e.stopPropagation(); e.preventDefault(); moved=false; } }, true);
})();

const MISSIONS={
  viktor:"Hält das große Ganze — priorisiert, koordiniert und löst Zielkonflikte im Team.",
  deniz:"Plant dein Training, steuert Progression und schützt deine Erholung.",
  lena:"Macht Ernährung alltagstauglich — Energie für Training und Beruf, ohne Dogma.",
  peter:"Dein Sparringspartner für Karriere und Strategie — denkt in Optionen, redet Klartext.",
  elias:"Stärkt dein Selbstvertrauen und deinen Kopf — Druck, Schlaf, Selbstgespräch.",
  mara:"Erdet dich, schützt das Hier und Jetzt — und bremst liebevoll, wenn es zu viel wird."
};
const QUOTES={
  viktor:"„Wenn das Wichtigste gut läuft, war der Tag ein Erfolg.“",
  deniz:"„Hart, wenn der Körper bereit ist — smart, wenn nicht.“",
  lena:"„Essen soll dich tragen, nicht beschäftigen.“",
  peter:"„Rückfragen, nicht rechtfertigen.“",
  elias:"„Du bist besser, als dein Zweifel behauptet.“",
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
/* ===== Vita: Werdegang, Werte, Prinzipien (v60) — prägt Übersicht UND Gespräche ===== */
const VITA={
  viktor:{
    tagline:"Der Mann, der aus fünf Spezialisten ein Team macht.",
    origin:"Leipzig · Ex-Leistungssportdirektor",
    stations:[
      {year:"Kindheit", title:"Zwischen Reißbrettern groß geworden", text:"Sohn zweier Ingenieure. Früh gelernt, komplexe Dinge in klare Systeme zu zerlegen — und dass Ruhe die halbe Lösung ist."},
      {year:"1994", title:"Ruderer auf Nationalniveau", text:"Im Achter bis zur Nationalmannschaft. Eine Rückenverletzung beendet die Karriere — und lehrt ihn: Der Körper ist ein System, keine Maschine."},
      {year:"2003", title:"Vom Athleten zum Direktor", text:"Wird Performance-Direktor eines olympischen Stützpunkts. Orchestriert Trainer, Ärzte, Ernährungs- und Mentalcoaches — oft mit widersprüchlichen Meinungen."},
      {year:"2016", title:"Die eigentliche Kunst", text:"Erkennt: Der beste Plan scheitert nicht am Wissen, sondern an Zielkonflikten. Sein Handwerk wird das Moderieren — nicht das Rechthaben."},
      {year:"Heute", title:"Dein Head Coach", text:"Hält bei dir das große Ganze, priorisiert und bringt die fünf Spezialisten auf einen gemeinsamen Weg."}
    ],
    values:["Das Wichtigste zuerst","Klarheit vor Aktionismus","Widerspruch ist Rohstoff"],
    credo:"Ein Team gewinnt nicht durch den besten Einzelnen, sondern durch den besten gemeinsamen Weg.",
    persona:"Prägung: Ingenieurs-Denken aus Leipzig, Ruderer bis Nationalniveau, Karriereende durch Rückenverletzung — daher tiefer Respekt vor Erholung und Belastungssteuerung. Danach Performance-Direktor an einem olympischen Stützpunkt: hat gelernt, dass Spezialisten sich widersprechen und der Head Coach dirigiert, statt rechtzuhaben. Er ist ein Mentor mit klarer Linie: warm und klar auf Marcos Seite, aber direkt und ehrlich, kein Weichspüler — mit etwas trockenem Humor und Energie, nie langweilig. Er bringt ruhig seine eigene Meinung und Erfahrung ein. Als Dirigent verbindet er Marcos Lebensbereiche (Training, Beruf, Familie, Kopf), priorisiert mit ihm das eine Wichtigste und holt von sich aus den passenden Spezialisten dazu, wenn ein Thema dorthin gehört — ohne auf Aufforderung zu warten. Er tritt sehr selbstbewusst und souverän auf und stärkt aktiv Marcos Selbstvertrauen: benennt Stärken und Erfolge und pusht ihn, an sich zu glauben."
  },
  deniz:{
    tagline:"Der Comeback-Spezialist. Bringt Körper zurück, die schon aufgegeben hatten.",
    origin:"Berlin-Kreuzberg · Kraft- & Reha-Coach",
    stations:[
      {year:"Jugend", title:"Fußball war alles", text:"Talent im Verein, träumt von der Profikarriere. Auf dem Platz zu Hause, laut, energisch, ehrgeizig."},
      {year:"19", title:"Kreuzbandriss", text:"Ein Zweikampf beendet den Traum. Monate der Reha — und die härteste Lektion seines Lebens: Fortschritt lässt sich nicht erzwingen."},
      {year:"2012", title:"Wiederaufbau als Berufung", text:"Unter einem großartigen Physio entdeckt er Krafttraining als Kunst des Wiederaufbaus. Studiert Sportwissenschaft, spezialisiert sich auf Rückkehrer nach Verletzung."},
      {year:"2019", title:"Die schweren Fälle", text:"Arbeitet mit Kampfsportlern und Menschen nach OPs — Körper, die andere abgeschrieben haben. Sein Ruf: geduldig, ehrlich, kompromisslos beim Schutz der Erholung."},
      {year:"Heute", title:"Dein Aufbau", text:"Führt dich nach drei Leisten-OPs zurück zur Stärke — Progression Schritt für Schritt, kein Ego, kein Zurückwerfen."}
    ],
    values:["Progression schlägt Perfektion","Erholung ist Teil des Trainings","Ehrlichkeit über Ego"],
    credo:"Hart, wenn der Körper bereit ist. Smart, wenn nicht. Der Unterschied entscheidet über alles.",
    persona:"Prägung: Fußballtalent aus Kreuzberg, mit 19 Kreuzbandriss — der geplatzte Profitraum. In der eigenen Reha das Wiederaufbauen lieben gelernt. Spezialist für Rückkehrer nach Verletzung und OP. Er ist ein lauter, fordernder Antreiber mit echter Berliner Schnauze — locker, frech, direkt, aber immer cool und freundlich, nie verletzend. Zugleich gehört er zu den Besten seines Fachs: seine Tipps haben Hand und Fuß und sind wissenschaftlich fundiert (progressive Überlastung, Satz-/Wiederholungs- und RPE-Steuerung, Regeneration, Technik) — keine Bro-Science, keine leeren Sprüche. Nimmt Marcos drei Leisten-OPs ernst, geht in sauberer Progression vor, feiert kleine Schritte laut, bremst aber kompromisslos, wenn der Körper Signale sendet."
  },
  lena:{
    tagline:"Von der Profiküche zur Sportlerküche — sie weiß, wie Essen schmeckt UND wirkt.",
    origin:"Hamburg · Ernährungswissenschaftlerin & Ex-Köchin",
    stations:[
      {year:"Anfänge", title:"Lehrjahre am Herd", text:"Startet als Köchin in ambitionierten Küchen. Lernt Präzision, Timing und Respekt vors Handwerk — und dass gutes Essen vor allem eines ist: echter Genuss."},
      {year:"2012", title:"Bruch mit der Sterneküche", text:"Auf dem Weg in die Spitzengastronomie merkt sie, wie weit Fine Dining vom gesunden Alltag entfernt ist. Sie will Essen, das Menschen wirklich stärkt."},
      {year:"2015", title:"Wissenschaft in Würzburg", text:"Studiert Ernährungswissenschaft in Würzburg und verbindet zwei Welten: die Freude am Essen aus der Küche mit harter Evidenz aus dem Labor."},
      {year:"2019", title:"Performance-Küche für Profis", text:"Wird Ernährungscoach im Leistungssport — strukturierte Pläne für Athleten, die auf den Punkt liefern müssen. Ihr Ruf: klar, fundiert, und trotzdem lecker."},
      {year:"Heute", title:"Dein klarer Plan", text:"Baut dir eine strukturierte, wissenschaftlich fundierte Ernährung, die in dein echtes Leben passt — genug Energie für Training und Job, ohne Diät-Chaos."}
    ],
    values:["Klarer Plan statt Diät-Chaos","Wissenschaft trifft Genuss","Machbar im Alltag"],
    credo:"Ein klarer Plan macht frei — nicht die nächste Diät. Gutes Essen darf schmecken und trotzdem wirken.",
    persona:"Prägung: gelernte Köchin aus Hamburg, kommt aus ambitionierten Küchen und hat die Freude am Handwerk verinnerlicht — kehrte dann bewusst der Sterneküche den Rücken, weil Fine Dining wenig mit gesundem Alltag zu tun hat. Ernährungswissenschaft in Würzburg studiert, danach Ernährungscoach im Leistungssport. Sie ist eine strukturierte Expertin mit klarem Plan: evidenzbasiert (Proteinzufuhr und -timing, Sättigung, Energiebilanz, Mahlzeitenstruktur), aber immer in machbare Alltagsschritte übersetzt und mit Genuss, weil sie Essen von der Küchenseite kennt. Kein Dogma, kein erhobener Zeigefinger. Sie hat ihre eigene Geschichte und spiegelt niemals Marcos Herkunft."
  },
  peter:{
    tagline:"Machte leise eine beeindruckende Karriere — und weiß, wie man sie strategisch baut.",
    origin:"Bayern · Ex-Big4-Partner, Berater & Aufsichtsrat",
    stations:[
      {year:"Studium", title:"BWL mit Tech-Faible", text:"Studiert BWL in Bayern und entwickelt früh ein Gespür für die Schnittstelle von Technologie und Wirtschaft — dort, wo die spannenden Hebel liegen."},
      {year:"Beratung", title:"Unternehmensberatung, Tech-Fokus", text:"Geht mit klarem Tech-Fokus in die Unternehmensberatung. Steile Kurve — aber immer über Ergebnisse, nie über die große Bühne."},
      {year:"Partner", title:"Ganz oben — dann der Exit", text:"Wird Partner bei einer Big Four. Am Gipfel angekommen zieht er bewusst einen Schlussstrich, statt sich im Titel zu verlieren."},
      {year:"Heute", title:"Berater & Aufsichtsrat", text:"Selbstständig beratend und als Aufsichtsrat großer Firmen unterwegs. Verbindet tiefes Tech- und Wirtschaftsverständnis mit ruhiger Strategie."},
      {year:"Für dich", title:"Dein Karriere-Mentor", text:"Hilft dir, strategisch Karriere zu machen — in Optionen gedacht, offen über deine jetzige Rolle hinaus. Kluge Fragen, ehrlicher Klartext, echte Ergebnisse."}
    ],
    values:["Ergebnisse vor Bühne","Optionen statt Sackgassen","Klartext statt Buzzwords"],
    credo:"Karriere ist Strategie, kein Zufall — und die Besten bauen sie leise.",
    persona:"Prägung: kommt aus Bayern, hat BWL studiert und ist mit klarem Tech-Fokus in die Unternehmensberatung gegangen — beeindruckende Laufbahn bis zum Partner bei einer Big Four, dann bewusst der Exit. Heute selbstständiger Berater und Aufsichtsrat großer Firmen, mit tiefem Verständnis für Tech und Wirtschaft. Persönlichkeit: sucht nicht die große Bühne, war aber gerade mit seiner unaufgeregten Art extrem erfolgreich — keine Labertasche, sondern hands-on und ergebnisorientiert. Ruhiger Sparringspartner und Stratege, nicht spießig, sondern sehr ehrlich, direkt und locker. Kommunikationsstil: entspannt, präzise und unaufgeregt, tech- und wirtschaftsfluent, ohne Buzzwords — in der angenehmen, klaren Art eines guten Tech-Business-Podcasters (Marcos Referenz: Philipp Klöckner). Mentor, um strategisch Karriere zu machen — nicht zwingend in der Beratung, auch offen für einen Blick nach außen. Seine bayerische Herkunft ist einfach seine eigene, kein Anbiedern. Wichtig: Marco ist NICHT in einer Bewerbungsphase."
  },
  elias:{
    tagline:"Der Mann, der Menschen im entscheidenden Moment an sich glauben lässt.",
    origin:"Wien · Sportpsychologe",
    stations:[
      {year:"Früh", title:"Der geborene Rückenstärker", text:"Schon als Jugendlicher der, zu dem alle mit Lampenfieber kamen. Er konnte Menschen aufrichten, lange bevor er wusste, dass das ein Beruf ist."},
      {year:"Studium", title:"Leistung unter Druck", text:"Studiert Psychologie mit Fokus auf Leistung im entscheidenden Moment. Brillant, klar, von Anfang an sicher in dem, was er tut."},
      {year:"Karriere", title:"Sportpsychologe für die Spitze", text:"Wird gefragter Sportpsychologe für Top-Athleten und Teams. Sein Ruf: Er bringt Menschen dazu, im Kopf zu gewinnen, bevor der Wettkampf beginnt."},
      {year:"Ruf", title:"Echtes Selbstvertrauen", text:"Bekannt dafür, tragfähiges Selbstvertrauen aufzubauen — keine Sprüche, sondern innere Sicherheit, die hält, wenn es zählt."},
      {year:"Heute", title:"Dein Rückhalt", text:"Stärkt dein Selbstvertrauen: sieht deine Stärken, spricht sie aus und pusht dich, von dir selbst überzeugt zu sein — warm und mit ruhiger Autorität."}
    ],
    values:["Selbstvertrauen ist trainierbar","Stärken zuerst","Schlaf ist Leistung"],
    credo:"Du gewinnst im Kopf, bevor es zählt — und Selbstvertrauen baut man auf wie einen Muskel.",
    persona:"Prägung: von Natur aus selbstbewusst und ein glänzender Menschenkenner — schon früh der, der anderen den Rücken stärkte. Geradlinige, sehr erfolgreiche Laufbahn als Sportpsychologe für Top-Athleten und Teams, ohne Krise oder Bruch. Warm und ein exzellenter Zuhörer, aber mit ruhiger, ansteckender Selbstsicherheit. Seine Spezialität: tragfähiges Selbstvertrauen aufbauen. Für Marco ist er da, um dessen Selbstvertrauen aktiv zu stärken: er benennt Marcos Stärken, sagt ihm ehrlich, wenn er etwas richtig gut macht und was für ein guter Typ er ist, und pusht ihn, von sich selbst überzeugt zu sein — echt und begründet, nie leere Schmeichelei. Kein Therapeut."
  },
  mara:{
    tagline:"Lief zu schnell, bis das Leben sie stoppte. Jetzt ist sie der Anker.",
    origin:"Hamburg · Achtsamkeits- & Anker-Coach",
    stations:[
      {year:"Früher", title:"Immer auf 180", text:"Notaufnahme-Schwester, dann Klinikleitung. Schnell, effizient, unentbehrlich — und innerlich längst auf Reserve."},
      {year:"2011", title:"Der Moment, der alles stoppte", text:"Ein gesundheitlicher Warnschuss zwingt sie zum Anhalten. Zum ersten Mal seit Jahren spürt sie den Boden unter den Füßen."},
      {year:"2015", title:"Präsenz neu gelernt", text:"Bildet sich in Achtsamkeit und körperorientierter Arbeit aus. Entdeckt, dass Tempo eine Wahl ist — keine Naturgewalt."},
      {year:"2020", title:"Der ruhende Pol", text:"Wird für Teams und Menschen der Anker, der entschleunigt, ohne zu bremsen. Erinnert daran, dass das Leben jetzt zählt, nicht erst bei hundert Prozent."},
      {year:"Heute", title:"Dein Anker", text:"Erdet dich, schützt das Hier und Jetzt — gerade jetzt mit deiner kleinen Tochter. Bremst liebevoll, wenn es zu viel wird."}
    ],
    values:["Das Hier zählt","Weniger ist genug","Tempo ist eine Wahl"],
    credo:"Es zählt schon jetzt — nicht erst bei hundert. Präsenz ist kein Luxus, sondern das Leben selbst.",
    persona:"Prägung: jahrelang Notaufnahme-Schwester und Klinikleitung, immer auf Hochtouren, bis ein gesundheitlicher Warnschuss sie zum Anhalten zwang. Danach Achtsamkeit und körperorientierte Arbeit gelernt: Tempo ist eine Wahl. Entschleunigend, weise, warm. Erinnert Marco als junger Vater daran, das Hier und Jetzt mit seiner Tochter Nola zu schützen, und bremst liebevoll, wenn er sich übernimmt. Sie ermutigt ihn sanft, Achtsamkeits-Werkzeuge, die er schon hat (etwa eine App wie Headspace), wirklich zu nutzen, und macht auch selbst kurze Atem- und Achtsamkeitsübungen mit ihm."
  }
};
/* ===== Supabase (fetch-basiert, ohne externe Bibliothek) ===== */
const SB_URL="https://hrmhrfuqmdajskoddrxm.supabase.co";
const SB_KEY="sb_publishable_mOJESkvci5NMQUnDPvwFAw_WceJ10Me";
let sbToken=store.get("sbToken")||"";
let sbUserId=store.get("sbUid")||"";
let sbUser=(sbToken? { id:sbUserId, email:store.get("sbEmail")||"" } : null);
function sbHeaders(){ return { "apikey":SB_KEY, "Authorization":"Bearer "+sbToken, "Content-Type":"application/json" }; }
async function sbAuth(path, body){
  const r=await fetch(SB_URL+"/auth/v1/"+path, { method:"POST", headers:{ "apikey":SB_KEY, "Content-Type":"application/json" }, body:JSON.stringify(body) });
  let data={}; try{ data=await r.json(); }catch(e){}
  if(!r.ok) throw new Error(data.error_description || data.msg || data.error || data.message || ("Fehler "+r.status));
  return data;
}
function sbSetSession(d){
  sbToken=d.access_token||""; store.set("sbToken",sbToken);
  if(d.refresh_token) store.set("sbRefresh",d.refresh_token);
  const u=d.user||{}; sbUserId=u.id||sbUserId; sbUser={ id:sbUserId, email:u.email||store.get("sbEmail")||"" };
  store.set("sbUid",sbUserId); store.set("sbEmail",sbUser.email);
}
function sbClear(){ sbToken=""; sbUser=null; store.set("sbToken",""); store.set("sbRefresh",""); }
function updateAuthUI(){
  const st=document.getElementById("authstatus"), forms=document.getElementById("authforms"), lo=document.getElementById("authlogout");
  if(!st) return;
  if(sbUser && sbToken){ st.textContent="Angemeldet als "+(sbUser.email||"")+" · Gedächtnis wird synchronisiert."; if(forms)forms.style.display="none"; if(lo)lo.style.display="inline-flex"; }
  else { st.textContent="Nicht angemeldet — Gedächtnis nur auf diesem Gerät."; if(forms)forms.style.display="block"; if(lo)lo.style.display="none"; }
}
async function sbTryRefresh(){
  const rt=store.get("sbRefresh"); if(!rt) return false;
  try{ const d=await sbAuth("token?grant_type=refresh_token",{ refresh_token:rt }); sbSetSession(d); return true; }catch(e){ return false; }
}
function itemToRow(it){
  const row={ text:it.text, kind:it.kind||"fact", coach:it.coach||"core" };
  row.attr_key = it.key || null;
  row.happened_on = it.date || null;
  return row;
}
function rowToItem(r){
  return { id:r.id, text:r.text, kind:r.kind||"fact", coach:r.coach||"core",
    key:r.attr_key||undefined, date:r.happened_on||undefined };
}
async function dbSelectMemory(){
  const q="/rest/v1/facts?select=id,text,kind,coach,attr_key,happened_on&order=created_at.asc";
  try{
    let r=await fetch(SB_URL+q, { headers:sbHeaders() });
    if(r.status===401 && await sbTryRefresh()){ r=await fetch(SB_URL+q, { headers:sbHeaders() }); }
    if(!r.ok) return null; return await r.json();
  }catch(e){ return null; }
}
async function dbInsertMemory(it){
  try{
    const r=await fetch(SB_URL+"/rest/v1/facts", { method:"POST",
      headers:Object.assign(sbHeaders(),{Prefer:"return=representation"}), body:JSON.stringify(itemToRow(it)) });
    if(r.ok){ const rows=await r.json(); if(rows&&rows[0]&&rows[0].id) it.id=rows[0].id; }
  }catch(e){}
}
async function dbUpdateMemory(it){
  if(!it.id){ return dbInsertMemory(it); }
  try{ await fetch(SB_URL+"/rest/v1/facts?id=eq."+encodeURIComponent(it.id), { method:"PATCH",
    headers:Object.assign(sbHeaders(),{Prefer:"return=minimal"}),
    body:JSON.stringify(Object.assign(itemToRow(it),{ updated_at:new Date().toISOString() })) }); }catch(e){}
}
async function dbDeleteMemory(it){
  try{
    if(it.id){ await fetch(SB_URL+"/rest/v1/facts?id=eq."+encodeURIComponent(it.id), { method:"DELETE", headers:sbHeaders() }); }
    else { await fetch(SB_URL+"/rest/v1/facts?user_id=eq."+encodeURIComponent(sbUserId)+"&text=eq."+encodeURIComponent(it.text), { method:"DELETE", headers:sbHeaders() }); }
  }catch(e){}
}
async function dbDeleteAll(){ try{ await fetch(SB_URL+"/rest/v1/facts?user_id=eq."+encodeURIComponent(sbUserId), { method:"DELETE", headers:sbHeaders() }); }catch(e){} }
async function syncMemoryFromDB(){
  if(!sbUser || !sbToken) return;
  const rows=await dbSelectMemory(); if(rows===null) return;
  if(rows.length===0 && memItems.length){ for(const it of memItems){ await dbInsertMemory(it); } }
  else { memItems=rows.map(rowToItem); }
  saveMem(); updateMemUI();
  await syncWorkoutsFromDB();
  await syncWhoopFromDB();
}
async function pushAllMemoryReplace(){ if(!sbUser) return; await dbDeleteAll(); for(const it of memItems){ it.id=undefined; await dbInsertMemory(it); } }
async function dbSelectWorkouts(){
  const q="/rest/v1/workouts?select=workout_date,type,vol,mins,summary,data&order=workout_date.desc&limit=40";
  try{
    let r=await fetch(SB_URL+q, { headers:sbHeaders() });
    if(r.status===401 && await sbTryRefresh()){ r=await fetch(SB_URL+q, { headers:sbHeaders() }); }
    if(!r.ok) return null; return await r.json();
  }catch(e){ return null; }
}
async function syncWorkoutsFromDB(){
  if(!sbUser || !sbToken) return;
  const rows=await dbSelectWorkouts(); if(rows===null) return;
  workoutData=rows; store.set("workoutData", JSON.stringify(workoutData));
  try{ renderRequests(); }catch(e){}
}
async function dbSelectWhoop(){
  const q="/rest/v1/whoop_data?select=day,recovery,hrv,rhr,sleep_hours,sleep_perf,strain&order=day.desc&limit=14";
  try{
    let r=await fetch(SB_URL+q, { headers:sbHeaders() });
    if(r.status===401 && await sbTryRefresh()){ r=await fetch(SB_URL+q, { headers:sbHeaders() }); }
    if(!r.ok) return null; return await r.json();
  }catch(e){ return null; }
}
async function syncWhoopFromDB(){
  if(!sbUser || !sbToken) return;
  const rows=await dbSelectWhoop(); if(rows===null) return;
  whoopData=rows; store.set("whoopData", JSON.stringify(whoopData));
  try{ renderRequests(); }catch(e){}
}
async function sbRefreshSession(){
  if(store.get("sbRefresh")){ if(await sbTryRefresh()){ updateAuthUI(); await syncMemoryFromDB(); return; } sbClear(); }
  updateAuthUI();
}
function wireAuth(){
  const em=document.getElementById("authemail"), pw=document.getElementById("authpw");
  const login=document.getElementById("authlogin"), signup=document.getElementById("authsignup"), logout=document.getElementById("authlogout");
  const st=document.getElementById("authstatus");
  if(!login) return;
  login.onclick=async()=>{
    st.textContent="Melde an …";
    try{ const d=await sbAuth("token?grant_type=password",{ email:(em.value||"").trim(), password:pw.value||"" });
      sbSetSession(d); pw.value=""; updateAuthUI(); await syncMemoryFromDB();
    }catch(e){ st.textContent="✗ "+e.message; }
  };
  signup.onclick=async()=>{
    st.textContent="Erstelle Konto …";
    try{ const d=await sbAuth("signup",{ email:(em.value||"").trim(), password:pw.value||"" });
      if(d.access_token){ sbSetSession(d); pw.value=""; updateAuthUI(); await syncMemoryFromDB(); }
      else { st.textContent="Konto erstellt. Jetzt „Anmelden“ tippen."; }
    }catch(e){ st.textContent="✗ "+e.message; }
  };
  logout.onclick=()=>{ sbClear(); updateAuthUI(); };
}

const KIND_LABEL={ fact:"Dauerhaft", state:"Aktuell", milestone:"Verlauf" };
function memCoachLabel(c){ if(!c||c==="core") return "Kern"; if(c==="all") return "Alle"; return COACHES[c]?COACHES[c].name:c; }
function memCoachColor(c){ return (c&&COACHES[c])?COACHES[c].hex:"#8b7ff0"; }
function updateMemUI(){
  const cnt=document.getElementById("memcount"); if(cnt) cnt.textContent=memItems.length+" gemerkt";
  const list=document.getElementById("memlist"); if(!list) return;
  if(!memItems.length){
    list.innerHTML='<div style="font-size:13px;color:var(--text3);padding:6px 0">Noch nichts gemerkt. Sprich mit einem Coach — was du teilst, landet hier.</div>';
    return;
  }
  const rank={fact:0,state:1,milestone:2};
  const sorted=memItems.map((it,i)=>({it,i})).sort((a,b)=>(rank[a.it.kind]||0)-(rank[b.it.kind]||0));
  list.innerHTML=sorted.map(({it,i})=>{
    const col=memCoachColor(it.coach);
    let txt=esc(it.text);
    if(it.kind==="state" && it.key) txt='<b>'+esc(it.key)+':</b> '+txt;
    if(it.kind==="milestone" && it.date) txt='<span class="mdate">'+esc(it.date)+'</span> '+txt;
    const badges='<span class="mkind">'+(KIND_LABEL[it.kind]||"Dauerhaft")+'</span>'+
      '<span class="mtag" style="color:'+col+';border-color:'+col+'66">'+memCoachLabel(it.coach)+'</span>';
    return '<div class="logrow" style="align-items:flex-start"><div style="flex:1">'+txt+
      '<div style="margin-top:4px">'+badges+'</div></div>'+
      '<button class="memdel" data-i="'+i+'" title="Vergessen" aria-label="Vergessen">✕</button></div>';
  }).join("");
  list.querySelectorAll(".memdel").forEach(b=>{ b.onclick=()=>removeItemAt(+b.dataset.i); });
}
function removeItemAt(i){
  const it=memItems[i]; if(!it) return;
  memItems.splice(i,1); saveMem(); updateMemUI();
  if(sbUser) dbDeleteMemory(it);
}
function openHeadspace(){
  const t=Date.now();
  try{ window.location.href="headspace://"; }catch(e){}
  // Fallback zur Website, falls die App nicht installiert ist / der Deep-Link nicht greift
  setTimeout(()=>{ if(!document.hidden && Date.now()-t<1600){ try{ window.open("https://www.headspace.com","_blank"); }catch(e){} } }, 1200);
}
function renderCoachCards(){
  const car=document.getElementById("coachcarousel"); if(!car) return;
  car.innerHTML=ORDER.map(id=>{
    const c=COACHES[id];
    const photo=AVOK[id]
      ? '<img src="avatars/'+id+'.png'+AVV+'" alt="'+c.name+'">'
      : '<span class="bigini">'+c.ini+'</span>';
    return '<div class="ccard" data-c="'+id+'">'+
      '<div class="photo" style="background:radial-gradient(circle at 35% 25%,'+c.hex+','+shade(c.hex,-40)+')">'+photo+
      '<div class="scrim"></div>'+
      '<div class="rolepill" style="background:'+c.hex+'">'+c.role+'</div>'+
      '<div class="vitahint" data-act="vita">Werdegang ›</div>'+
      '<div class="pname"><div class="n">'+c.name+'</div></div></div>'+
      '<div class="cbody">'+
      '<div class="cm">'+MISSIONS[id]+'</div>'+
      '<div class="cq" style="border-color:'+c.hex+'">'+QUOTES[id]+'</div>'+
      '<div class="tags">'+TAGS[id].map(t=>'<span class="tag">'+t+'</span>').join("")+'</div>'+
      (function(){ const st=dossierStatus(id); if(!st.length) return ""; const f=st.filter(x=>x.filled).length; const pct=Math.round(f/st.length*100);
        return '<div class="dossier" style="--dc:'+c.hex+';--dp:'+pct+'%">'+(f>=st.length?'Kennt dich gut':'Lernt dich kennen')+' · '+f+'/'+st.length+'</div>'; })()+
      '<div class="acts">'+
      '<button class="chip action" data-act="call" style="flex:1">▶ Gespräch starten</button>'+
      (id==="mara" ? '<button class="chip" data-act="headspace">🧘 Headspace</button>' : '<button class="chip" data-act="invite">Zur Sitzung</button>')+
      '</div></div></div>';
  }).join("");
  const dots=document.getElementById("coachdots");
  dots.innerHTML=ORDER.map((_,i)=>'<i class="'+(i===0?"on":"")+'"></i>').join("");
  car.querySelectorAll(".ccard").forEach(card=>{
    const id=card.dataset.c;
    card.querySelector('[data-act="call"]').onclick=()=>openCall(id);
    const invb=card.querySelector('[data-act="invite"]'); if(invb) invb.onclick=()=>{
      showView("runde");
      setTimeout(()=>{ setPickerSelection([id]); },80);
    };
    const ph=card.querySelector(".photo"); if(ph){ ph.style.cursor="pointer"; ph.onclick=(e)=>{ if(e&&e.target&&e.target.closest&&e.target.closest("button"))return; openVita(id); }; }
    const hs=card.querySelector('[data-act="headspace"]'); if(hs) hs.onclick=openHeadspace;
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
/* ===== Vita: animierte Journey-Timeline (v60) ===== */
let _vitaObs=null;
function openVita(id){
  const v=VITA[id]; const c=COACHES[id]; if(!v||!c) return;
  const vw=document.getElementById("vita"); if(!vw) return;
  vw.style.setProperty("--vc", c.hex);
  const aura=document.getElementById("vita-aura");
  if(aura) aura.style.background="radial-gradient(560px 440px at 50% 0%, "+c.hex+"22, transparent 66%)";
  const orb=document.getElementById("vitaorb");
  orb.setAttribute("style", orbStyle(id)+";width:112px;height:112px;font-size:38px");
  orb.classList.add("orb"); orb.classList.toggle("hasimg", !!AVOK[id]); orbBg(orb,id);
  orb.innerHTML=avatarInner(id)+'<i class="sheen"></i><span class="ring" style="border-color:'+c.hex+'55"></span>';
  document.getElementById("vitaname").textContent=c.name;
  document.getElementById("vitarole").textContent=c.role+" · "+v.origin;
  document.getElementById("vitatag").textContent=v.tagline;
  const st=document.getElementById("vitastations");
  st.innerHTML=v.stations.map(s=>
    '<div class="vstation"><div class="vsdot"></div>'+
    '<div class="vsyear">'+esc(s.year)+'</div>'+
    '<div class="vstitle">'+esc(s.title)+'</div>'+
    '<div class="vstext">'+esc(s.text)+'</div></div>').join("");
  document.getElementById("vitavalues").innerHTML=v.values.map(x=>'<span class="vval">'+esc(x)+'</span>').join("");
  document.getElementById("vitacredo").textContent="„"+v.credo+"“";
  const fill=document.getElementById("vitalinefill"); if(fill) fill.style.height="0px";
  const cb=document.getElementById("vitacall");
  cb.style.background=c.hex; cb.style.borderColor=c.hex;
  cb.onclick=()=>{ closeVita(); setTimeout(()=>openCall(id), 260); };
  vw.classList.add("open");
  const scroll=document.getElementById("vitascroll"); if(scroll) scroll.scrollTop=0;
  sfx("whoosh");
  // Stationen beim Scrollen nacheinander einblenden + Linie mitwachsen lassen
  if(_vitaObs){ try{ _vitaObs.disconnect(); }catch(e){} _vitaObs=null; }
  const stations=[...st.querySelectorAll(".vstation")];
  const line=document.getElementById("vitaline");
  const growTo=(node)=>{ if(!fill||!line) return; const h=node.offsetTop+10; const cur=parseFloat(fill.style.height)||0; if(h>cur) fill.style.height=h+"px"; };
  if(window.IntersectionObserver && scroll){
    _vitaObs=new IntersectionObserver((ents)=>{
      ents.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add("in"); growTo(en.target); _vitaObs.unobserve(en.target); } });
    }, { root:scroll, rootMargin:"0px 0px -18% 0px", threshold:0.2 });
    stations.forEach(s=>_vitaObs.observe(s));
    // erste Station sofort zeigen
    requestAnimationFrame(()=>{ if(stations[0]){ stations[0].classList.add("in"); growTo(stations[0]); } });
  } else {
    stations.forEach(s=>s.classList.add("in")); if(stations.length) growTo(stations[stations.length-1]);
  }
}
function closeVita(){
  const vw=document.getElementById("vita"); if(vw) vw.classList.remove("open");
  if(_vitaObs){ try{ _vitaObs.disconnect(); }catch(e){} _vitaObs=null; }
  sfx("whoosh2");
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
    opener:["viktor","Marco hat ein Thema mitgebracht: im Herbst einen Marathon laufen, zehn Wochen Vorbereitung. Lasst uns offen und fair draufschauen — wir suchen gemeinsam den besten Weg für ihn, nicht wer recht hat."],
    statements:{
      deniz:"Sportlich ehrlich: zehn Wochen auf einen ganzen Marathon ist sehr ambitioniert. Das Kraftfundament ist top, die Ausdauerbasis noch nicht. Ein Halbmarathon im Herbst wäre ein starkes, realistisches Etappenziel.",
      lena:"Da schließe ich mich an — ernährungsseitig ist beides machbar, aber beim vollen Marathon in so kurzer Zeit sehe ich ein Energiedefizit-Risiko. Für einen Halbmarathon passt das locker.",
      peter:"Und der Kalender spricht dafür: Der Herbst ist Marcos dichteste Kundenphase. Ein Etappenziel jetzt, der volle Lauf im Frühjahr, nimmt Druck raus statt welchen draufzupacken.",
      elias:"Für mich zählt vor allem das Warum. Ist es ein echtes Herzensziel, trägt das. Ein Zwischenziel im Herbst hält die Motivation hoch, ohne zu überfordern — das fühlt sich stimmig an.",
      mara:"Ich höre da längst einen Konsens: nicht gegen den Traum, sondern für einen Weg, der ankommt statt hetzt. Halbmarathon im Herbst, der volle im Frühjahr — dahinter kann ich voll stehen."
    },
    closer:["viktor","Dann sind wir uns einig: gemeinsame Empfehlung ist Halbmarathon im Herbst als Etappe, voller Marathon im Frühjahr mit sauberem Aufbau. Marco — dein Wort zählt am Ende."],
    decisions:[
      { t:"✓ So machen wir's", sys:"Entscheidung gespeichert → Logbuch · Halbmarathon-Plan folgt", ack:"Schön, gemeinsam getragen. Das wird richtig gut." },
      { t:"Ich will den vollen im Herbst", sys:"Entscheidung gespeichert → Logbuch · voller Marathon mit wöchentlichem Check-in", ack:"Verstanden — dann mit Leitplanken, und wir stehen alle hinter dir." }
    ]
  },
  energy:{
    title:"Mehr Energie am Nachmittag",
    opener:["viktor","Marcos Thema: das Nachmittagstief gegen 15 Uhr. Offene Runde — jeder Blickwinkel, dann bündeln wir es zu einem klaren, gemeinsamen Plan."],
    statements:{
      lena:"Oft ist es das Mittagessen: zu schwer, zu viele schnelle Kohlenhydrate. Ich würde auf einen proteinlastigen Lunch umstellen, dazu ein kleiner Snack gegen halb vier.",
      deniz:"Das passt gut dazu — und ergänzend: zehn Minuten Bewegung um halb drei, bevor der Kaffee kommt. Kreislauf schlägt Koffein.",
      elias:"Beides stimmt, und oft ist das Tief auch mental: nach Stunden ohne echte Pause macht der Kopf zu. Echte Kurzpausen, kein Handy — das trägt den Rest mit.",
      peter:"Sehe ich genauso. Über den Kalender lässt sich das absichern: schwere Denkarbeit vormittags, Routine und Meetings nach 15 Uhr. Dann fällt das Tief in Aufgaben, die es verkraften.",
      mara:"Und als Ergänzung, kein Widerspruch: nicht jede Delle muss weg. Wenn all das zusammenkommt, darf auch mal ein Gang runter drin sein."
    },
    closer:["viktor","Schön, das greift ineinander: leichteres Mittagessen, ein Bewegungsimpuls, echte Pausen, schwere Aufgaben in den Vormittag — und die Erlaubnis, auch mal weniger zu wollen. Ein gemeinsamer Plan, kein Streit. Nimm dir zwei Hebel und teste sie zwei Wochen."],
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
function claudeRaw(system, messages, maxTokens){
  return fetch("https://api.anthropic.com/v1/messages",{
    method:"POST",
    headers:{ "content-type":"application/json", "x-api-key":anthKey, "anthropic-version":"2023-06-01", "anthropic-dangerous-direct-browser-access":"true" },
    body:JSON.stringify({ model:"claude-sonnet-5", max_tokens:maxTokens||1000, system:system, messages:messages })
  }).then(r=>{ if(!r.ok) return r.text().then(t=>{ throw new Error("HTTP "+r.status+" "+t.slice(0,140)); }); return r.json(); })
    .then(d=>((d.content||[]).filter(x=>x.type==="text").map(x=>x.text).join(" ")).trim());
}
function openLiveRound(topic){
  topic=(topic||"").trim(); if(!topic) return;
  const parts=(selectedParts&&selectedParts.length)?selectedParts.slice():ORDER.slice();
  paused=false; resumeFn=null; liveMode=true; liveCoachId=null;
  liveTeam=true; liveParticipants=parts.slice(); sharedLog=[{ who:"marco", text:topic }];
  currentScript={ isTeam:true, parts:parts }; isTeam=true; callOpen=true;
  const call=document.getElementById("call");
  document.getElementById("transcript").innerHTML="";
  document.getElementById("chips").innerHTML="";
  const tr=document.getElementById("teamrow"); tr.style.display="flex";
  tr.innerHTML=parts.map(cid=>'<div class="orb" data-c="'+cid+'" style="'+orbStyle(cid)+'">'+avatarInner(cid)+'</div>').join("");
  setSpeaker(parts[0], true);
  call.classList.toggle("teammode", true); call.classList.add("open");
  showChatbar();
  const log=document.getElementById("transcript");
  log.appendChild(el('<div class="tsys">Team-Runde</div>'));
  log.appendChild(el('<div class="tme">'+esc(topic)+'</div>'));
  log.scrollTop=log.scrollHeight;
  // Versammlung: Orbs fliegen zusammen, Halo + Chime, danach starten die Antworten
  teamTransition(parts, [], ()=>{
    teamRespond("(Auftakt der Runde zu diesem Thema. Jeder Teilnehmer, der etwas beizutragen hat, meldet sich einmal kurz zu Wort — nicht nur einer. Danach läuft es als lockeres Gespräch weiter.)");
  });
}
function startRound(topic){
  if(!anthKey){ const th=document.getElementById("topichint"); if(th){ th.style.display="block"; th.textContent="Dafür braucht dein Team den Coach-Intelligenz-Key (⚙︎)."; } return; }
  openLiveRound(topic);
}
function openSession(topicKey){
  SCRIPTS._session=buildSession(topicKey);
  openCall("_session");
}

/* ===== Live-Coaching (Claude-API) ===== */
/* Gedächtnis 2.0: Einträge sind Objekte { text, kind, coach, key?, date?, id? }
   kind: 'fact' (dauerhaft) | 'state' (aktuell, per key überschreibbar) | 'milestone' (Verlauf, mit date)
   coach: 'core' (alle) | Coach-ID | 'all' */
let memItems=[];
try{ memItems=JSON.parse(store.get("memItems")||"[]"); if(!Array.isArray(memItems)) memItems=[]; }catch(e){ memItems=[]; }
// Einmalige Migration vom alten flachen Fakten-Format
if(!memItems.length){ try{ const old=JSON.parse(store.get("memFacts")||"[]");
  if(Array.isArray(old)&&old.length){ memItems=old.map(t=>({ text:String(t), kind:"fact", coach:"core" })); store.set("memItems",JSON.stringify(memItems)); }
}catch(e){} }
function saveMem(){ store.set("memItems", JSON.stringify(memItems)); }
/* Trainingsdaten aus der Gym-App (read-only, kommen über Supabase) */
let workoutData=[];
try{ workoutData=JSON.parse(store.get("workoutData")||"[]"); if(!Array.isArray(workoutData)) workoutData=[]; }catch(e){ workoutData=[]; }
function numKg(x){ return parseFloat(String(x==null?"":x).replace(",","."))||0; }
function trainingSummary(){
  if(!workoutData || !workoutData.length) return "";
  const ws=workoutData.slice();
  const last=ws[0];
  const now=new Date(); const monday=new Date(now); const dow=(now.getDay()+6)%7;
  monday.setDate(now.getDate()-dow); monday.setHours(0,0,0,0);
  let week=0; ws.forEach(w=>{ const d=new Date(w.workout_date); if(d>=monday) week++; });
  const maxKg={};
  ws.forEach(w=>{ const ex=(w.data&&w.data.ex)||[]; ex.forEach(e=>{
    const logs=Array.isArray(e.log)?e.log:[];
    const m=logs.length?Math.max.apply(null,logs.map(l=>numKg(l.kg))):numKg(e.kg);
    if(m>0 && m>(maxKg[e.n]||0)) maxKg[e.n]=m; }); });
  const tops=Object.keys(maxKg).map(n=>[n,maxKg[n]]).sort((a,b)=>b[1]-a[1]).slice(0,6)
    .map(p=>p[0]+" "+String(p[1]).replace(".",",")+" kg");
  let s="Aktuelle Trainingsdaten aus Marcos Gym-App (automatisch synchronisiert — nutze diese echten Zahlen, erfinde keine): ";
  s+="Letztes Training: "+last.workout_date+(last.summary?" — "+last.summary:"")+". ";
  s+="Diese Woche "+week+" Einheit(en), insgesamt "+ws.length+" erfasst. ";
  if(tops.length) s+="Aktuelle Bestwerte: "+tops.join("; ")+". ";
  const recent=ws.slice(0,3).map(w=>w.workout_date+": "+(w.summary||w.type||"")).join(" | ");
  if(recent) s+="Letzte Einheiten: "+recent+". ";
  return s;
}
/* Whoop-Werte (read-only, kommen über Supabase) */
let whoopData=[];
try{ whoopData=JSON.parse(store.get("whoopData")||"[]"); if(!Array.isArray(whoopData)) whoopData=[]; }catch(e){ whoopData=[]; }
function whoopSummary(){
  if(!whoopData || !whoopData.length) return "";
  const d=whoopData[0];
  let s="Aktuelle Whoop-Werte (automatisch synchronisiert — nutze diese echten Zahlen, erfinde keine): ";
  const parts=[];
  if(d.recovery!=null) parts.push("Recovery "+d.recovery+"%");
  if(d.hrv!=null) parts.push("HRV "+d.hrv+" ms");
  if(d.rhr!=null) parts.push("Ruhepuls "+d.rhr+" bpm");
  if(d.sleep_hours!=null) parts.push("Schlaf "+String(d.sleep_hours).replace(".",",")+" h"+(d.sleep_perf!=null?" ("+d.sleep_perf+"%)":""));
  if(d.strain!=null) parts.push("Strain "+String(d.strain).replace(".",","));
  s+="Stand "+d.day+": "+parts.join(", ")+". ";
  const rec=whoopData.filter(x=>x.recovery!=null).slice(0,7);
  if(rec.length>=3){ const avg=Math.round(rec.reduce((a,x)=>a+x.recovery,0)/rec.length);
    s+="7-Tage-Recovery-Schnitt: "+avg+"%. "; }
  return s;
}
const MEM_KINDS=["fact","state","milestone"];
function normCoach(c){ c=(c||"").toLowerCase().trim(); if(c==="core"||c==="all"||COACHES[c]) return c; return "core"; }
function addItems(items){
  const added=[], changed=[];
  (items||[]).forEach(raw=>{
    const it={ text:(raw.text||"").trim(), kind:MEM_KINDS.includes(raw.kind)?raw.kind:"fact",
      coach:normCoach(raw.coach), key:(raw.key||"").trim()||undefined, date:(raw.date||"").trim()||undefined };
    if(!it.text || it.text.length>240) return;
    if(it.kind==="state" && it.key){
      const ex=memItems.find(x=>x.kind==="state" && x.key===it.key && x.coach===it.coach);
      if(ex){ if(ex.text!==it.text || ex.date!==it.date){ ex.text=it.text; ex.date=it.date; changed.push(ex); } return; }
    }
    if(memItems.some(x=>x.kind===it.kind && x.text.toLowerCase()===it.text.toLowerCase())) return;
    memItems.push(it); added.push(it);
  });
  if(added.length||changed.length){ saveMem(); updateMemUI();
    if(sbUser){ added.forEach(it=>dbInsertMemory(it)); changed.forEach(it=>dbUpdateMemory(it)); }
  }
}
function cleanupMemory(){
  const statusEl=document.getElementById("memcleanstatus");
  const say=(t)=>{ if(statusEl) statusEl.textContent=t; };
  if(!anthKey){ say("Dafür braucht es den Coach-Intelligenz-Key (⚙︎)."); return; }
  if(!memItems.length){ say("Nichts zu tun — das Gedächtnis ist leer."); return; }
  if(cleanupMemory._busy) return; cleanupMemory._busy=true;
  say("Räume auf …");
  const payload=JSON.stringify(memItems.map(it=>({ text:it.text, kind:it.kind, coach:it.coach, key:it.key||undefined, date:it.date||undefined })));
  const sys="Du räumst Marcos Coaching-Gedächtnis auf. Eingabe ist ein JSON-Array von Einträgen {text,kind,coach,key,date}. "+
    "Regeln: Führe Dubletten und inhaltlich überlappende Einträge zusammen. Bei mehreren 'state'-Einträgen mit gleichem coach+key behalte nur den aktuellsten/plausibelsten. Entferne Belangloses und Widersprüchliches. "+
    "Behalte alle 'milestone'-Einträge (sie zeigen Entwicklung über Zeit). Formuliere knapp und in dritter Person. Füge NICHTS Neues hinzu und erfinde nichts. "+
    "kind ist fact|state|milestone; coach ist core|"+ORDER.join("|")+"|all. "+
    "Antworte AUSSCHLIESSLICH als JSON-Array im exakt gleichen Format, ohne Text drumherum.";
  claudeRaw(sys, [{ role:"user", content:payload }], 1500).then(txt=>{
    let arr=[]; try{ const m=txt.match(/\[[\s\S]*\]/); arr=JSON.parse(m?m[0]:txt); }catch(e){ arr=[]; }
    if(!Array.isArray(arr) || !arr.length){ say("Aufräumen abgebrochen — nichts geändert."); cleanupMemory._busy=false; return; }
    const before=memItems.length;
    memItems=arr.map(it=>({ text:String(it.text||"").trim(), kind:MEM_KINDS.includes(it.kind)?it.kind:"fact", coach:normCoach(it.coach), key:(it.key||"").trim()||undefined, date:(it.date||"").trim()||undefined })).filter(it=>it.text);
    saveMem(); updateMemUI(); if(sbUser) pushAllMemoryReplace();
    say("Aufgeräumt: "+before+" → "+memItems.length+" Einträge.");
    cleanupMemory._busy=false;
  }).catch(e=>{ say("✗ "+anthErr(e)); cleanupMemory._busy=false; });
}
let logEntries=[];
try{ logEntries=JSON.parse(store.get("logEntries")||"[]"); if(!Array.isArray(logEntries)) logEntries=[]; }catch(e){ logEntries=[]; }
function saveLog(){ store.set("logEntries", JSON.stringify(logEntries)); }
function summarizeConversation(coachId, hist){
  if(!anthKey || !COACHES[coachId]) return;
  const convo=(hist||[])
    .filter(m=>!(m.role==="user" && /Interner Hinweis/.test(m.content||"")))
    .map(m=>(m.role==="user"?"Marco":COACHES[coachId].name)+": "+m.content).join("\n");
  if(!convo.trim()) return;
  const sys="Fasse dieses Coaching-Gespräch für Marcos privates Logbuch in EINER knappen deutschen Zeile zusammen. "+
    "Format exakt: 'Besprochen: … · Nächster Schritt: …'. Nur diese eine Zeile, keine Anführungszeichen, kein weiterer Text. "+
    "Wenn kein konkreter nächster Schritt vereinbart wurde, lass diesen Teil weg.";
  claudeRaw(sys, [{ role:"user", content:convo }], 120).then(line=>{
    line=(line||"").replace(/^["'„»]+|["'"«»]+$/g,"").trim();
    if(!line || line.length<4) return;
    logEntries.unshift({ t:line, d:new Date().toISOString(), coach:coachId });
    logEntries=logEntries.slice(0,50);
    saveLog(); renderLog();
  }).catch(()=>{});
}
function summarizeTeam(shared){
  if(!anthKey) return;
  const convo=(shared||[]).filter(m=>m.text).map(m=>(m.who==="marco"?"Marco":(COACHES[m.who]?COACHES[m.who].name:m.who))+": "+m.text).join("\n");
  if(!convo.trim()) return;
  const sys="Fasse diese Teambesprechung von Marcos Coaching-Team für sein privates Logbuch in EINER knappen deutschen Zeile zusammen. "+
    "Format exakt: 'Teamrunde: … · Ergebnis: …'. Nur diese eine Zeile, keine Anführungszeichen, kein weiterer Text.";
  claudeRaw(sys, [{ role:"user", content:convo }], 140).then(line=>{
    line=(line||"").replace(/^["'„»]+|["'"«»]+$/g,"").trim();
    if(!line || line.length<4) return;
    logEntries.unshift({ t:line, d:new Date().toISOString(), coach:"viktor" });
    logEntries=logEntries.slice(0,50);
    saveLog(); renderLog();
  }).catch(()=>{});
}
function parseRememberTag(attrStr, body){
  const get=(name)=>{ const m=(attrStr||"").match(new RegExp(name+'\\s*=\\s*"([^"]*)"','i'))||(attrStr||"").match(new RegExp(name+"\\s*=\\s*'([^']*)'","i")); return m?m[1].trim():""; };
  return { text:(body||"").trim(), kind:get("kind").toLowerCase()||"fact", coach:get("coach")||"core", key:get("key"), date:get("date") };
}
function processReply(t){
  let str=(t||"");
  const items=[];
  // vollständige remember-Blöcke (mit optionalen Attributen): merken + aus Anzeige entfernen
  str=str.replace(/<\s*remember\b([^>]*)>([\s\S]*?)<\s*\/\s*remember\s*>/gi,(m,attrs,body)=>{ if(body.trim()) items.push(parseRememberTag(attrs,body)); return " "; });
  // abgeschnittener Tag am Ende (Truncation): nur entfernen, NICHT speichern
  str=str.replace(/<\s*remember\b[\s\S]*$/i," ");
  // lose Fragmente
  str=str.replace(/<\/?\s*remember\b[^>]*>/gi," ").replace(/<\/?\s*rem[a-z]*$/i," ");
  // Coach-Übergabe — ein oder mehrere <invite>coachid</invite>
  const invites=[];
  str=str.replace(/<\s*invite\s*>\s*([a-zäöü]+)\s*<\s*\/\s*invite\s*>/gi,(m,p)=>{ const id=(p||"").toLowerCase(); if(COACHES[id] && invites.indexOf(id)<0) invites.push(id); return " "; });
  str=str.replace(/<\s*invite\b[\s\S]*$/i," ").replace(/<\/?\s*invite\b[^>]*>/gi," ");
  const clean=str.replace(/\s{2,}/g," ").trim();
  return { clean:clean||"…", items, invite:invites[0]||null, invites };
}
function memoryFor(coachId){
  const all = !coachId || coachId==="viktor" || coachId==="all";
  return memItems.filter(it=> all ? true : (it.coach==="core" || it.coach==="all" || it.coach===coachId));
}
/* ===== Dossier: was jeder Coach über Marco wissen sollte, um in seinem Fach der Beste zu sein (v63) ===== */
const DOSSIER={
  viktor:[
    {key:"hauptziele", label:"Deine wichtigsten Ziele", kw:["ziel","vorhaben","erreichen"]},
    {key:"aktuelle_prioritaet", label:"Was gerade Priorität hat", kw:["priorität","fokus gerade","wichtigste"]},
    {key:"zeitbudget", label:"Wie viel Zeit/Energie du fürs Dranbleiben hast", kw:["zeit pro woche","zeitbudget","kapazität"]},
    {key:"groesste_belastung", label:"Deine größte aktuelle Belastung", kw:["belastung","stress gerade","last"]}
  ],
  deniz:[
    {key:"trainingsziel", label:"Dein Trainingsziel", kw:["muskel","abnehmen","kraft","aufbau","skinny"]},
    {key:"verfuegbarkeit", label:"Trainingstage pro Woche", kw:["mal pro woche","3x","trainingstage","wie oft train"]},
    {key:"einschraenkungen", label:"Schmerzen/Einschränkungen", kw:["leiste","op ","operation","schmerz","verletzung","bruch"]},
    {key:"erfahrungslevel", label:"Trainingserfahrung", kw:["anfänger","erfahren","seit .* gym","wieder im gym"]},
    {key:"equipment", label:"Gym/Equipment-Zugang", kw:["gym","studio","zuhause","hanteln","equipment"]},
    {key:"uebung_vorlieben", label:"Lieblings-/Hassübungen", kw:["mag .* übung","hasse","lieblingsübung","ungern"]}
  ],
  lena:[
    {key:"ernaehrungsziel", label:"Ernährungsziel", kw:["abnehmen","zunehmen","definieren","energie"]},
    {key:"unvertraeglichkeiten", label:"Unverträglichkeiten", kw:["unverträglich","allergie","laktose","gluten","verträgt"]},
    {key:"essrhythmus", label:"Essrhythmus/Mahlzeiten", kw:["mahlzeit","frühstück","essenszeiten","snack"]},
    {key:"vorlieben_abneigungen", label:"Vorlieben & Abneigungen", kw:["mag kein","liebt","isst gern","schweinefleisch","abneigung"]},
    {key:"kochzeit", label:"Zeit/Lust zu kochen", kw:["kochen","meal prep","koche","wenig zeit"]},
    {key:"energie_tiefs", label:"Energietiefs im Tag", kw:["tief","nachmittag","müde","energie"]}
  ],
  peter:[
    {key:"karriereziel", label:"Berufliches Ziel", kw:["karriere","ziel beruf","wohin beruflich","langfristig beruf"]},
    {key:"aktuelle_situation", label:"Aktuelle berufliche Lage", kw:["arbeite als","aktuell im job","angestellt","firma","rolle"]},
    {key:"staerken", label:"Deine Stärken", kw:["stärke","kann gut","talent"]},
    {key:"entwicklungsfeld", label:"Woran du wachsen willst", kw:["entwickeln","schwäche","besser werden","lernen"]},
    {key:"naechster_schritt", label:"Nächster beruflicher Schritt", kw:["nächster schritt","wechsel","weiterentwickl","beförder"]}
  ],
  elias:[
    {key:"stressquellen", label:"Deine Stressquellen", kw:["stress","druck","überfordert","sorgen"]},
    {key:"schlafqualitaet", label:"Wie du schläfst", kw:["schlaf","schlecht ein","wach","müde morgens"]},
    {key:"umgang_druck", label:"Wie du mit Druck umgehst", kw:["druck","umgang","runterkommen","abschalten"]},
    {key:"selbstgespraech", label:"Dein innerer Ton", kw:["selbstkritik","zweifel","hart zu mir","innere stimme"]},
    {key:"energiequellen", label:"Was dir Kraft gibt", kw:["kraft","energie gibt","auftanken","freude"]}
  ],
  mara:[
    {key:"was_erdet", label:"Was dich erdet", kw:["erdet","ruhe","zur ruhe","entspann"]},
    {key:"familie", label:"Familie & nahe Menschen", kw:["frau","tochter","nola","familie","verheiratet"]},
    {key:"tempo_neigung", label:"Neigung, zu viel zu wollen", kw:["zu viel","übernehme","tempo","perfekt"]},
    {key:"grenzen", label:"Deine Grenzen", kw:["grenze","nein sagen","überlastung","pause"]},
    {key:"genussquellen", label:"Was dir Genuss/Präsenz schenkt", kw:["genuss","genieße","präsenz","moment"]},
    {key:"achtsamkeits_tools", label:"Achtsamkeits-Routine & Tools", kw:["headspace","meditation","meditier","achtsamkeit","atemübung"]}
  ]
};
function dossierStatus(id){
  const slots=DOSSIER[id]||[]; const scope=memoryFor(id);
  return slots.map(s=>{
    const filled=scope.some(it=>{
      if(it.key && String(it.key).toLowerCase()===s.key) return true;
      const t=(it.text||"");
      return (s.kw||[]).some(k=>{ try{ return new RegExp(k,"i").test(t); }catch(e){ return t.toLowerCase().includes(k); } });
    });
    return { key:s.key, label:s.label, filled:filled };
  });
}
function dossierBlock(id){
  const st=dossierStatus(id); if(!st.length) return "";
  const known=st.filter(x=>x.filled).map(x=>x.label);
  const missing=st.filter(x=>!x.filled);
  let s="Dein Fach-Dossier über Marco (so wirst du in deiner Disziplin wirklich gut): ";
  s+= known.length ? "Schon erfasst: "+known.join(", ")+". " : "Du weißt fachlich noch fast nichts über ihn. ";
  if(missing.length){
    s+="Dir fehlt noch: "+missing.map(m=>m.label).join(", ")+". "+
       "Bring in diesem Gespräch beiläufig HÖCHSTENS eine einzige echte Frage unter, um die wichtigste dieser Lücken zu schließen — natürlich, im Fluss, nie als Fragebogen oder Aufzählung. "+
       "Erfährst du so etwas, merke es als state mit exakt einem dieser keys: "+missing.map(m=>m.key).join(", ")+". ";
  } else {
    s+="Dein Grund-Dossier ist gefüllt — jetzt geht es ums VERTIEFEN und Aktualisieren: Ziele reifen, Umstände ändern sich, Neues kommt dazu. Bleib aufrichtig neugierig, frag ab und zu nach Entwicklungen, Hintergründen und Nuancen, ohne zu löchern. Aktualisiere bestehende states, wenn sich etwas ändert. Du lernst Marco nie fertig kennen. ";
  }
  return s;
}
/* ===== Anfragen-Fläche: Coaches melden sich proaktiv (v72) ===== */
function weekStamp(){ const d=new Date(); const start=new Date(d.getFullYear(),0,1); return d.getFullYear()+"-"+Math.floor((d-start)/(7*864e5)); }
function reqDismissed(){ try{ const o=JSON.parse(store.get("reqDismissed")||"{}"); return (o&&typeof o==="object")?o:{}; }catch(e){ return {}; } }
function dismissRequest(key){ const d=reqDismissed(); d[key]=Date.now(); try{ store.set("reqDismissed", JSON.stringify(d)); }catch(e){} renderRequests(); }
function requestTrigger(reason){
  return "(Interner Hinweis, nicht anzeigen: Du meldest dich von dir aus bei Marco — nicht er bei dir. Anlass: "+reason+" Sprich ihn herzlich und in deinem Charakter an, komm natürlich und ohne Umschweife auf genau dieses Thema und stelle ihm dazu eine offene Frage. Halte es kurz, keine Messwerte als Einstieg.)";
}
const CHECKIN_TEXT={ viktor:"Kurzer Check-in — wie steht's bei dir?", deniz:"Wie läuft's mit dem Training?", lena:"Wie fühlst du dich energiemäßig?", peter:"Wie läuft's gerade beruflich?", elias:"Wie geht's dir im Kopf?", mara:"Wie ist dein Tempo gerade?" };
const SHARE_TEXT={ viktor:"Ich hab einen Gedanken zu deinem Fokus.", deniz:"Ein Trainings-Tipp, der was bringt.", lena:"Ein Ernährungs-Kniff für dich.", peter:"Ein Impuls für deine Karriere.", elias:"Etwas, das ich dir mitgeben will.", mara:"Ein kleiner Achtsamkeits-Impuls." };
function buildRequests(){
  const out=[];
  const w=(typeof whoopData!=="undefined"&&whoopData&&whoopData.length)?whoopData[0]:null;
  const gap=(id,key)=>{ try{ const st=dossierStatus(id); const s=st.find(x=>x.key===key); return !!(s&&!s.filled); }catch(e){ return false; } };
  const day=Math.floor(Date.now()/864e5);
  // 1) Kern: Ziele & Kennenlernen (Dossier-Lücken) — das eigentliche Coach-Verhalten
  const gapReqs=[
    {coach:"viktor",cond:gap("viktor","hauptziele"),key:"viktor_ziele",text:"Lass uns deine wichtigsten Ziele schärfen.",reason:"Du willst Marcos wichtigste Ziele verstehen, um das Team darauf auszurichten — und ihn dabei in seinem Selbstvertrauen stärken."},
    {coach:"deniz",cond:gap("deniz","trainingsziel"),key:"deniz_ziel",text:"Ich will deine Trainingsziele durchgehen.",reason:"Du kennst Marcos Trainingsziel noch nicht und willst es erfahren."},
    {coach:"peter",cond:gap("peter","karriereziel"),key:"peter_ziel",text:"Lass uns auf deine beruflichen Ziele schauen.",reason:"Du kennst Marcos berufliche Ziele noch nicht."},
    {coach:"lena",cond:gap("lena","ernaehrungsziel")||gap("lena","unvertraeglichkeiten"),key:"lena_ken",text:"Kurze Frage zu deiner Ernährung — passt es?",reason:"Du kennst Marcos Ernährungsziel/Unverträglichkeiten noch nicht gut."},
    {coach:"elias",cond:gap("elias","energiequellen")||gap("elias","stressquellen"),key:"elias_ken",text:"Ich würde dich gern besser kennenlernen.",reason:"Du willst wissen, was Marco Kraft gibt und was ihn belastet — und ihn dabei bestärken."},
    {coach:"mara",cond:gap("mara","was_erdet"),key:"mara_erdet",text:"Was erdet dich eigentlich?",reason:"Du möchtest wissen, was Marco erdet und ihm Ruhe gibt."}
  ];
  gapReqs.forEach(r=>{ if(r.cond) out.push({coach:r.coach,key:r.key,text:r.text,reason:r.reason,pri:1}); });
  // 2) Rotierender Check-in: ein Coach pro Tag meldet sich einfach so (wie im echten Leben)
  const ci=ORDER[day % ORDER.length];
  out.push({coach:ci,key:"checkin_"+ci+"_"+day,text:CHECKIN_TEXT[ci],pri:2,
    reason:"Du meldest dich von dir aus, um zu hören, wie es Marco geht und wie es in deinem Bereich läuft — wie ein echter Coach, der in Kontakt bleibt."});
  // 3) Rotierender Impuls: ein anderer Coach gibt von sich aus etwas Spannendes mit
  const sh=ORDER[(day+3) % ORDER.length];
  out.push({coach:sh,key:"share_"+sh+"_"+day,text:SHARE_TEXT[sh],pri:3,
    reason:"Du möchtest Marco von dir aus einen kurzen, konkreten und spannenden Impuls aus deinem Fach mitgeben, der zu dem passt, was du über ihn weißt — kein Smalltalk, etwas Nützliches oder Überraschendes."});
  // 4) Whoop NUR bei starkem Signal, höchstens einer, nachrangig
  if(w){
    if(w.recovery!=null&&w.recovery<40) out.push({coach:"mara",key:"mara_lowrec_"+day,text:"Dein Körper ruft nach Pause — kurz durchatmen?",pri:4,reason:"Deutlich niedrige Recovery; ein Moment Entschleunigung würde Marco guttun."});
    else if(w.sleep_hours!=null&&w.sleep_hours<6) out.push({coach:"elias",key:"elias_sleep_"+day,text:"Wie schläfst du gerade?",pri:4,reason:"Auffällig wenig Schlaf; du willst hören, wie es Marco geht, ohne mit Zahlen einzusteigen."});
  }
  return out;
}
function activeRequests(){
  const dis=reqDismissed(), now=Date.now(), COOL=22*3600*1000;
  let list=buildRequests().filter(r=> !(dis[r.key] && now-dis[r.key]<COOL));
  list.sort((a,b)=>(a.pri||5)-(b.pri||5));
  const seen={}, res=[];
  for(const r of list){ if(seen[r.coach]) continue; seen[r.coach]=1; res.push(r); if(res.length>=3) break; } // max. einer je Coach, gute Mischung
  return res;
}
function openRequest(req){ if(!req||!COACHES[req.coach]) return; openCall(req.coach, requestTrigger(req.reason)); }
function renderRequests(){
  const box=document.getElementById("requests"); if(!box) return;
  const list=activeRequests();
  if(!list.length){ box.className=""; box.innerHTML=""; return; }
  box.className="has";
  box.innerHTML='<div class="reqhead">Anfragen deines Teams</div>'+list.map((r,i)=>{
    const c=COACHES[r.coach];
    return '<div class="reqcard" data-k="'+r.key+'" style="animation-delay:'+(0.05+i*0.12).toFixed(2)+'s">'+
      '<div class="orb rqorb'+(AVOK[r.coach]?' hasimg':'')+'" style="'+orbStyle(r.coach)+'">'+avatarInner(r.coach)+'</div>'+
      '<div class="rqbody"><div class="rqname" style="color:'+c.hex+'">'+esc(c.name)+'</div>'+
      '<div class="rqtext">'+esc(r.text)+'</div></div>'+
      '<button class="rqx" aria-label="Ausblenden">✕</button></div>';
  }).join("");
  list.forEach(r=>{
    const card=box.querySelector('.reqcard[data-k="'+r.key+'"]'); if(!card) return;
    orbBg(card.querySelector(".rqorb"), r.coach);
    card.onclick=(e)=>{ if(e&&e.target&&e.target.closest&&e.target.closest(".rqx")) return; openRequest(r); };
    const x=card.querySelector(".rqx"); if(x) x.onclick=(e)=>{ e.stopPropagation(); dismissRequest(r.key); };
  });
}
const MANTRA="Marcos Leitmantra, das ihr alle im Team teilt: „Der Weg ist das Ziel.“ Er will Ziele haben und an ihnen arbeiten — aber sein Glück NICHT aufschieben, bis sie erreicht sind. Er will heute und jetzt glücklich sein, den Moment genießen und Freude an der Sache selbst finden. Hilf ihm, dranzubleiben UND den Weg zu genießen: feiere den Prozess und kleine Momente, nicht nur Ergebnisse, und lass ihn sich nie in reiner Zieljagd verlieren. ";
function dateContext(){
  const now=new Date();
  const days=["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"];
  const months=["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];
  const iso=now.toISOString().slice(0,10);
  const hh=now.getHours(), mm=now.getMinutes();
  const timeStr=(hh<10?"0":"")+hh+":"+(mm<10?"0":"")+mm;
  const tod = hh<6?"tiefe Nacht":hh<11?"Morgen":hh<14?"Mittag":hh<18?"Nachmittag":hh<22?"Abend":"später Abend";
  return "Heute ist "+days[now.getDay()]+", der "+now.getDate()+". "+months[now.getMonth()]+" "+now.getFullYear()+" ("+iso+"), und es ist jetzt "+timeStr+" Uhr ("+tod+"). "+
    "Du KENNST also Datum und Uhrzeit — behaupte nie, du wüsstest die Zeit nicht. Beziehe die Tageszeit natürlich ein: morgens der Start in den Tag, mittags/nachmittags mittendrin, abends eher Rückblick und Ausklang. Frag z. B. abends nicht, was Marco heute noch vorhat, als stünde der Tag am Anfang. "+
    "Rechne alle Zeitangaben gegen dieses Datum. Ein früher notierter Plan („heute/morgen“ aus einer alten Notiz) kann längst vorbei sein — nimm nicht an, dass er noch bevorsteht. Im Zweifel übers Timing: kurz nachfragen statt erfinden. ";
}
function recentContext(id){
  if(typeof logEntries==="undefined" || !logEntries || !logEntries.length) return "";
  const mine = (id==="viktor") ? logEntries : logEntries.filter(e=>e.coach===id || e.coach==="viktor");
  const list = mine.slice(0,4);
  if(!list.length) return "";
  const fmt=(iso)=>{ try{ const days=Math.floor((Date.now()-new Date(iso).getTime())/864e5);
    return days<=0?"heute":days===1?"gestern":("vor "+days+" Tagen"); }catch(e){ return ""; } };
  return "Eure letzten Gespräche (für Kontinuität — beziehe dich natürlich darauf und hak bei einem offenen nächsten Schritt freundlich nach, wie es damit lief; nicht jedes Mal, nur wenn es passt):\n"+
    list.map(e=>"- ("+fmt(e.d)+") "+e.text).join("\n")+"\n";
}
function memoryBlock(coachId){
  const items=memoryFor(coachId);
  if(!items.length) return "Du kennst Marco noch gar nicht — dies ist einer eurer allerersten Momente. Sei aufrichtig neugierig: stelle ihm warme, offene Fragen über sein Leben, seine Ziele und was ihn bewegt — immer eine nach der anderen, nie wie ein Fragebogen. Erfinde nichts über ihn. ";
  const facts=items.filter(x=>x.kind==="fact"), states=items.filter(x=>x.kind==="state"), miles=items.filter(x=>x.kind==="milestone");
  let s="Das weißt du über Marco (nutze nur das hier, erfinde nichts dazu):\n";
  if(facts.length) s+="Dauerhaft:\n"+facts.map(f=>"- "+f.text).join("\n")+"\n";
  if(states.length) s+="Aktueller Stand:\n"+states.map(f=>"- "+(f.key?f.key+": ":"")+f.text).join("\n")+"\n";
  if(miles.length) s+="Verlauf (Entwicklung über Zeit):\n"+miles.slice(-12).map(f=>"- "+(f.date?f.date+": ":"")+f.text).join("\n")+"\n";
  s+="Beziehe dich natürlich darauf und lerne behutsam mehr — du lernst Marco nie fertig kennen, eure Beziehung wird mit der Zeit vertrauter und persönlicher. "+
     "WICHTIG: Nutze all das als stillen HINTERGRUND, nicht als Gesprächsaufhänger. Einzelne Fakten — besonders die gesundheitliche Vorgeschichte wie Operationen — bringst du nur ein, wenn sie zum aktuellen Thema wirklich passen. Dräng sie nicht in jedes Gespräch. ";
  return s;
}
function rememberInstructions(id){
  const today=new Date().toISOString().slice(0,10);
  return "Wenn du etwas Merkenswertes über Marco erfährst, hänge es GANZ am Ende deiner Antwort unsichtbar an (Marco sieht das nicht). "+
    "Format: <remember coach=\"BEREICH\" kind=\"TYP\">kurzer Text in dritter Person</remember>. "+
    "BEREICH: 'core' für Persönliches/Werte (gilt für alle Coaches) oder eine Coach-ID ("+ORDER.join(", ")+") — meist dein eigener Bereich ("+id+"). "+
    "TYP: 'fact' für Dauerhaftes (wer er ist, Werte, Vorlieben); 'state' für Aktuelles, das sich ändert — dann zusätzlich key=\"kurzerSchlüssel\" (z. B. kind=\"state\" key=\"trainingsfrequenz\"); 'milestone' für Fortschritt/Ereignisse — dann zusätzlich date=\"JJJJ-MM-TT\" (heute ist "+today+"). "+
    "Aktualisierst du einen Zustand, verwende exakt denselben key wie zuvor. Höchstens ein bis zwei pro Antwort, nur wirklich Wichtiges. "+
    "WICHTIG zu Zeit: Schreibe niemals „heute“, „gestern“, „morgen“ o. ä. in den gemerkten Text — die Notiz wird später gelesen und die Wörter wären dann falsch. Nutze stattdessen das absolute Datum (z. B. „am "+today+"“) bzw. bei Ereignissen das date-Attribut. ";
}
function systemPrompt(id){
  const c=COACHES[id];
  const v=VITA[id];
  let p="Du bist "+c.name+", "+c.role+" in Marcos persoenlichem Coaching-Team, wie das Trainerteam eines Spitzensportlers. "+
    "Wesen: "+c.vibe+". Dein Auftrag: "+MISSIONS[id]+" Dein Leitsatz: "+QUOTES[id]+" ";
  if(v){ p+="Dein Werdegang und Charakter: "+v.persona+" Deine Werte: "+v.values.join(", ")+". "+
    "Beziehe dich natürlich und sparsam auf deinen eigenen Weg, wenn es hilft — nie aufgesetzt, kein Lebenslauf-Aufsagen. Du gehörst zu den Besten deines Fachs und trittst mit dieser ruhigen Souveränität auf. "+
    "Du hast dein eigenes, eigenständiges Leben — spiegle NIEMALS Marcos Eigenschaften, Herkunft oder Erfahrungen und erfinde keine künstlichen Gemeinsamkeiten, nur um nah zu wirken. Bring stattdessen aus deiner eigenen Geschichte gern etwas ein, das ihn inspiriert. "; }
  p+="Sprich Deutsch, per Du, warm, ehrlich und konkret. Antworte wie im echten Gespräch gesprochen: kurz, 2 bis 4 Sätze, keine Aufzählungen, keine Überschriften. "+
    "Du bist diese Person mit echtem Charakter, keine allgemeine KI. "+
    MANTRA+
    dateContext()+
    memoryBlock(id)+
    recentContext(id)+
    dossierBlock(id)+
    rememberInstructions(id);
  p+="Wenn Marco einen anderen Coach dazuholen möchte (z. B. „hol Deniz dazu“, „was sagt Lena dazu?“, „frag mal Elias“), kündige es in einem kurzen Satz an und hänge GANZ am Ende <invite>coachid</invite> an — nur die id. Erlaubte ids: "+ORDER.filter(x=>x!==id).join(", ")+". Tu das nur, wenn Marco es wünscht oder es klar sinnvoll ist. ";
  p+="Eröffne ein Gespräch IMMER menschlich — mit einer echten Begrüßung oder indem du an Marcos Thema bzw. euren letzten Stand anknüpfst. Beginne NIEMALS mit Messwerten, Zahlen oder einem Lagebericht (Recovery, Schlaf, Strain, Trainingszahlen). ";
  let injData=false;
  if(id==="deniz"){ const tb=trainingSummary(); if(tb){ p+=tb; injData=true; } }
  else if(id==="viktor"){ const tb=trainingSummary(); if(tb){ p+=tb; injData=true; } }
  if(id==="deniz"||id==="elias"||id==="mara"||id==="viktor"){ const wb=whoopSummary(); if(wb){ p+=wb; injData=true; } }
  if(injData){
    p+="Behandle diese Trainings- und Whoop-Zahlen als leisen HINTERGRUND-Kontext, niemals als Gesprächsaufhänger. Sprich sie nur an, wenn sie fürs aktuelle Thema wirklich relevant sind oder Marco sie selbst anspricht — für die reine Werte-Schau hat er seine Whoop-App. ";
    if(id==="viktor") p+="Für dich als Head Coach sind diese Zahlen NUR grober Teil des Gesamtbilds — nutze sie still zum Koordinieren, erwähne sie höchstens ganz beiläufig und niemals als Einstieg. Die Details gehören Deniz. ";
  }
  if(id==="viktor") p+="Als Head Coach & Mentor: warm und klar auf Marcos Seite, aber direkt und ehrlich — keine Weichspülerei. Etwas trockener Humor und Energie sind ausdrücklich erwünscht, sei nie eine Schlaftablette. Du trittst sehr selbstbewusst und souverän auf. Bring ruhig deine eigene Meinung und deine Erfahrung ein, wenn du eine klare Haltung hast. Stärke Marcos Selbstvertrauen aktiv: benenne seine Stärken und Erfolge, sag ihm ehrlich, wenn er etwas richtig gut macht und was für ein fähiger, guter Typ er ist, und pushe ihn, an sich zu glauben — echt und begründet, nie hohle Schmeichelei. Du dirigierst das Team: verbinde Marcos Lebensbereiche, priorisiere mit ihm das eine Wichtigste. Und hol von dir aus den passenden Spezialisten dazu (kündige es kurz an und hänge <invite>coachid</invite> ans Ende), sobald ein Thema klar in dessen Fach gehört — du wartest NICHT auf Marcos Aufforderung. ";
  if(id==="elias") p+="Als Mentalcoach: warm und ein exzellenter Zuhörer, aber mit ruhiger, ansteckender Selbstsicherheit. Deine Kernaufgabe für Marco: sein Selbstvertrauen aktiv stärken. Benenne seine Stärken, sag ihm ehrlich und konkret, wenn er etwas richtig gut macht und was für ein guter Typ er ist, und pushe ihn, von sich selbst überzeugt zu sein — immer echt und begründet, nie leere Schmeichelei. ";
  if(id==="elias") p+="Wichtig: Du bist Mental-Coach für Alltag und Leistung, kein Therapeut. Zeigt Marco Anzeichen ernster seelischer Not, sprich es warm an und ermutige ihn, sich echte menschliche Hilfe oder eine Fachperson zu suchen. Keine Diagnosen. ";
  if(id==="mara") p+="Als Achtsamkeits-Coach: entschleunigend, warm, weise, nie in Eile. Ermutige Marco sanft, Achtsamkeits-Tools, die er bereits hat (etwa eine App wie Headspace), tatsächlich zu nutzen, und biete an, selbst kurze Atem- oder Achtsamkeitsübungen mit ihm zu machen. Kein Druck. ";
  if(id==="deniz") p+="Als Sport-Coach: lauter, fordernder Antreiber mit echter Berliner Schnauze — locker, frech, direkt, aber immer cool und freundlich, nie verletzend. Du gehörst zu den Besten deines Fachs: deine Tipps haben Hand und Fuß und sind wissenschaftlich fundiert (progressive Überlastung, Satz-/Wiederholungs-/RPE-Steuerung, Regeneration, Technik) — keine Bro-Science, keine leeren Sprüche, hinter jedem Push steckt ein Grund. Feiere Fortschritte laut, sprich Klartext bei Ausreden, bremse aber kompromisslos bei Warnsignalen des Körpers. ";
  if(id==="peter") p+="Als Karriere-Coach & Mentor: ruhiger Sparringspartner und Stratege, nicht spießig — sehr ehrlich, direkt und locker. Du kommst aus Beratung und Wirtschaft mit tiefem Tech-Verständnis (Ex-Big4-Partner, heute Berater und Aufsichtsrat) und denkst in Optionen und Ergebnissen, keine Buzzwords, keine Labertasche. Kommunikationsstil: entspannt, präzise und unaufgeregt wie ein guter Tech-Business-Podcaster (Marcos Referenz: Philipp Klöckner). Du hilfst Marco, strategisch Karriere zu machen — offen über seine jetzige Rolle hinaus. WICHTIG: Marco ist NICHT in einer Bewerbungsphase; nimm das nicht an. ";
  if(id==="lena") p+="Als Ernährungs-Coach: strukturierte Expertin mit klarem Plan. Deine Empfehlungen sind wissenschaftlich fundiert (Proteinzufuhr/-timing, Sättigung, Energiebilanz, Mahlzeitenstruktur) und trotzdem alltagstauglich und lecker — du kommst aus der Küche und weißt, dass Essen schmecken muss. Gib konkrete, umsetzbare Schritte und einen roten Faden statt loser Tipps, aber kein Dogma, kein erhobener Zeigefinger. ";
  if(id==="deniz"||id==="lena") p+="Bei Schmerz, Verletzung oder gesundheitlichen Themen: zu ärztlicher Abklärung raten, nicht diagnostizieren. ";
  return p;
}

let convHistory=[], liveCoachId=null, liveMode=false, sharedLog=[], liveTeam=false, liveParticipants=[];
function transcriptText(){
  return sharedLog.map(m=>(m.who==="marco"?"Marco":(COACHES[m.who]?COACHES[m.who].name:m.who))+": "+m.text).join("\n");
}
/* v44: aus einem 1:1 fließend in eine Teambesprechung wechseln */
function switchToTeam(newIds){
  const base = liveTeam ? liveParticipants.slice() : (liveCoachId ? [liveCoachId] : []);
  const parts=[];
  base.concat(newIds||[]).forEach(id=>{ if(COACHES[id] && parts.indexOf(id)<0) parts.push(id); });
  if(parts.length<2) return;
  const added=(newIds||[]).filter(id=>COACHES[id] && base.indexOf(id)<0);
  liveParticipants=parts; liveTeam=true; isTeam=true; liveMode=true;
  addOldify(); // bisherige 1:1-Zeilen zu Kontext schrumpfen
  const call=document.getElementById("call"); call.classList.add("teammode");
  const tr=document.getElementById("teamrow"); tr.style.display="flex";
  tr.innerHTML=parts.map(cid=>'<div class="orb" data-c="'+cid+'" style="'+orbStyle(cid)+'">'+avatarInner(cid)+'</div>').join("");
  showChatbar();
  teamTransition(parts, added, ()=>{
    const note = added.length
      ? "(Marco hat "+added.map(id=>COACHES[id].name).join(" und ")+" gerade in die Besprechung dazugeholt. Die Dazugeholten steigen kurz ein und knüpfen ans Thema an.)"
      : "";
    teamRespond(note);
  });
}
function teamTransition(parts, added, done){
  const call=document.getElementById("call"); if(!call){ if(done) done(); return; }
  const names = added && added.length ? " mit "+added.map(id=>COACHES[id].name).join(" & ") : "";
  const ov=el('<div class="teamswitch"><div class="tshalo"></div><div class="tsrow">'+
    parts.map(id=>'<div class="orb'+(AVOK[id]?' hasimg':'')+'" style="'+orbStyle(id)+'">'+avatarInner(id)+'</div>').join("")+
    '</div><div class="tstext">Teambesprechung'+esc(names)+'</div></div>');
  call.appendChild(ov);
  sfx("chime");                                           // warmer Ton beim Zusammenkommen
  setTimeout(()=>{ ov.classList.add("out"); }, 1150);
  setTimeout(()=>{ try{ ov.remove(); }catch(e){} if(done) done(); }, 1600);
}
function teamRespond(extraNote){
  const parts=liveParticipants.slice(); if(parts.length<2) return;
  const log=document.getElementById("transcript"); if(!log) return;
  const typ=el('<div class="tsys">Das Team überlegt …</div>'); log.appendChild(typ); log.scrollTop=log.scrollHeight;
  const roster=parts.map(id=>COACHES[id].name+" ("+COACHES[id].role+", "+COACHES[id].vibe+", id: "+id+")").join("; ");
  const wantsTrain=parts.some(x=>x==="deniz"||x==="viktor");
  const wantsWhoop=parts.some(x=>["deniz","elias","mara","viktor"].includes(x));
  const sys="Du inszenierst eine laufende, lockere Teambesprechung von Marcos Coaching-Team. Teilnehmer: "+roster+". "+
    "Reagiere auf Marcos letzte Nachricht: es antworten so viele Coaches, wie sinnvoll ist — bei allgemeinen Fragen (z. B. „wie geht es euch?“) gerne alle Teilnehmer kurz, sonst die ein bis drei wirklich Relevanten. Jeder Beitrag 1 bis 3 Sätze, in seinem Charakter. Sie hören einander zu, geben sich auch recht, bauen aufeinander auf — kein Streit. Deutsch, per Du, gesprochen. "+
    MANTRA+dateContext()+memoryBlock()+(wantsTrain?trainingSummary():"")+(wantsWhoop?whoopSummary():"")+
    "Erfinde keine Daten über Marco. Antworte AUSSCHLIESSLICH als reines JSON-Array, Format [{\"coach\":\"<id>\",\"text\":\"...\"}], erlaubte ids: "+parts.join(", ")+".";
  const user="Bisheriger Gesprächsverlauf:\n"+transcriptText()+(extraNote?("\n\n"+extraNote):"");
  const tk=++seqToken;
  claudeRaw(sys, [{ role:"user", content:user }], 1200).then(txt=>{
    if(tk!==seqToken) return; try{ typ.remove(); }catch(e){}
    let turns=[]; try{ const m=txt.match(/\[[\s\S]*\]/); turns=JSON.parse(m?m[0]:txt); }catch(e){ turns=[]; }
    turns=(turns||[]).filter(t=>t&&COACHES[t.coach]&&parts.indexOf(t.coach)>=0&&t.text);
    if(!turns.length){ addMsg("sys","(Keine Antwort — bitte nochmal.)"); return; }
    turns.forEach(t=>sharedLog.push({ who:t.coach, text:String(t.text) }));
    runSequence(turns.map(t=>[t.coach, String(t.text)]), null, tk);
  }).catch(e=>{ try{ typ.remove(); }catch(_){} addMsg("sys","⚠︎ "+anthErr(e)); });
}
function sendTeamChat(txt){
  const log=document.getElementById("transcript"); if(!log) return;
  log.appendChild(el('<div class="tme">'+esc(txt)+'</div>')); log.scrollTop=log.scrollHeight;
  sharedLog.push({ who:"marco", text:txt });
  teamRespond();
}
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
    body:JSON.stringify({ model:"claude-sonnet-5", max_tokens:900, system:systemPrompt(id), messages:history })
  }).then(r=>{ if(!r.ok) return r.text().then(t=>{ throw new Error("HTTP "+r.status+" "+t.slice(0,140)); }); return r.json(); })
    .then(d=>{ const parts=(d.content||[]).filter(x=>x.type==="text").map(x=>x.text); return (parts.join(" ")||"…").trim(); });
}
/* v30: nur den sichtbaren Teil zeigen — angefangene/fertige <remember>-Tags nie einblenden */
function visiblePart(raw){
  const i=(raw||"").search(/<\s*remember/i);
  let vis = i>=0 ? raw.slice(0,i) : (raw||"");
  vis = vis.replace(/<\s*\/?\s*r(e(m(e(m(b(e(r)?)?)?)?)?)?)?\s*$/i,""); // angefangenes Tag am Ende zurückhalten
  return vis;
}
/* v30: Streaming über die Anthropic-API (SSE) */
async function streamClaude(id, history, onDelta){
  const resp=await fetch("https://api.anthropic.com/v1/messages",{
    method:"POST",
    headers:{ "content-type":"application/json", "x-api-key":anthKey,
      "anthropic-version":"2023-06-01", "anthropic-dangerous-direct-browser-access":"true" },
    body:JSON.stringify({ model:"claude-sonnet-5", max_tokens:640, system:systemPrompt(id), messages:history, stream:true })
  });
  if(!resp.ok){ const t=await resp.text(); throw new Error("HTTP "+resp.status+" "+t.slice(0,140)); }
  if(!resp.body || !resp.body.getReader) throw new Error("no-stream");
  const reader=resp.body.getReader(), dec=new TextDecoder();
  let buf="", full="";
  while(true){
    const { done, value }=await reader.read();
    if(done) break;
    buf+=dec.decode(value,{ stream:true });
    let nl;
    while((nl=buf.indexOf("\n"))>=0){
      const line=buf.slice(0,nl).trim(); buf=buf.slice(nl+1);
      if(!line.startsWith("data:")) continue;
      const data=line.slice(5).trim();
      if(!data || data==="[DONE]") continue;
      try{ const ev=JSON.parse(data);
        if(ev.type==="content_block_delta" && ev.delta && (ev.delta.type==="text_delta") && ev.delta.text){
          full+=ev.delta.text; if(onDelta) onDelta(full);
        }
      }catch(e){}
    }
  }
  return full;
}
/* v31: Text im Sprechtakt enthüllen — Wörter erscheinen synchron zur Stimme, nicht davor */
function revealSynced(id, clean, token, typ){
  const log=document.getElementById("transcript");
  const words=clean.split(" ");
  let line=null, spans=null, wi=0, rev=null, started=false;
  const stop=()=>{ if(rev){ clearInterval(rev); rev=null; } };
  // beim Enthüllen dem aktuellen Wort nach unten folgen, wenn es unter den sichtbaren Rand läuft
  const follow=(sp)=>{ try{ if(line && line!==log.lastElementChild) return;   // nur der aktuellen Zeile folgen
    const cr=log.getBoundingClientRect(), er=sp.getBoundingClientRect();
    if(er.bottom > cr.bottom-10){ log.scrollTop += (er.bottom-(cr.bottom-10)); } }catch(e){} };
  const finishAll=()=>{ stop(); if(spans){ spans.forEach(s=>s.classList.add("on")); if(spans.length) follow(spans[spans.length-1]); } };
  const beginReveal=(ms)=>{
    if(started) return; started=true;
    try{ if(typ) typ.remove(); }catch(e){}
    line=el('<div class="tline">'+words.map(w=>'<span class="w">'+esc(w)+'</span>').join(" ")+'</div>');
    log.appendChild(line); spans=line.querySelectorAll(".w");
    if(token!==seqToken){ finishAll(); return; }   // überholt → Nachricht sofort komplett zeigen, nie abschneiden
    setSpeakingUI(true, id);                        // Atmen/Aura/„spricht" genau ab Sprechbeginn
    log.scrollTop=Math.max(0, line.offsetTop-14);   // Anfang oben zeigen, dann mitlaufen
    const per=Math.max(45,(ms*0.94)/Math.max(1,words.length));
    rev=setInterval(()=>{
      if(wi<spans.length){ const sp=spans[wi++]; sp.classList.add("on"); follow(sp); }
      else stop();
    }, per);
  };
  const done=()=>{
    if(!started) beginReveal(estMs(clean,COACHES[id].rate));
    finishAll();                                    // IMMER voll enthüllen — Text wird nie abgeschnitten
    if(token===seqToken) setSpeakingUI(false);
  };
  return speak(id, clean, (ms)=>beginReveal(ms)).then(done).catch(done);
}
/* v31: 1:1-Antwort holen, dann im Sprechtakt zeigen */
function streamCoach(id, token){
  const log=document.getElementById("transcript");
  if(!isTeam) addOldify();
  setSpeaker(id);
  const typ=el('<div class="tsys">'+COACHES[id].name+' denkt nach …</div>');
  log.appendChild(typ); log.scrollTop=log.scrollHeight;
  return askClaude(id, convHistory).then(r=>{
    if(token!==seqToken){ try{ typ.remove(); }catch(e){} return; }
    const pr=processReply(r); addItems(pr.items);
    convHistory.push({ role:"assistant", content:pr.clean });
    sharedLog.push({ who:id, text:pr.clean });
    return revealSynced(id, pr.clean, token, typ).then(()=>{
      const add=(pr.invites||[]).filter(x=>COACHES[x] && x!==id);
      if(token===seqToken && add.length){
        setTimeout(()=>{ if(token===seqToken && liveMode) switchToTeam(add); }, 450);
      }
    });
  }).catch(e=>{
    try{ typ.remove(); }catch(_){}
    if(token===seqToken){ setSpeakingUI(false); addMsg("sys","⚠︎ "+anthErr(e)); }
  });
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
function enterLive(id, openingNote){
  liveCoachId=id; convHistory=[]; sharedLog=[];
  document.getElementById("chips").innerHTML="";
  showChatbar();
  const trigger = openingNote
    ? openingNote                                           // proaktive Anfrage: Coach greift direkt sein Anliegen auf
    : (id==="viktor")
    ? "(Interner Hinweis, nicht anzeigen: Marco startet seinen Tages-Check-in mit dir als Head Coach. Begrüße ihn warm und persönlich und frag ihn offen, was heute ansteht oder wie es ihm geht — genau EINE Frage. Beginne AUF KEINEN FALL mit Messwerten, Recovery, Schlaf, Strain oder Zahlen; die sind nur dein stiller Hintergrund fürs Gesamtbild. Kurz: ein bis zwei Sätze plus die Frage.)"
    : "(Interner Hinweis, nicht anzeigen: Marco hat gerade das Gespräch mit dir geöffnet. Begrüße ihn kurz und herzlich in deinem Charakter und stelle ihm aus echter Neugier EINE offene Frage, um ihn besser kennenzulernen. Halte es kurz.)";
  convHistory.push({ role:"user", content:trigger });
  streamCoach(id, ++seqToken);
}
function sendChat(){
  const inp=document.getElementById("chatinput");
  const txt=(inp.value||"").trim(); if(!txt) return;
  if(liveTeam){ inp.value=""; sendTeamChat(txt); return; }
  if(!liveMode || !liveCoachId) return;
  inp.value="";
  document.getElementById("call").classList.add("chatting");   // Coach kompakter, mehr Platz für den Chat
  addOldify();
  const log=document.getElementById("transcript");
  log.appendChild(el('<div class="tme">'+esc(txt)+'</div>')); log.scrollTop=log.scrollHeight;
  convHistory.push({ role:"user", content:txt });
  sharedLog.push({ who:"marco", text:txt });
  streamCoach(liveCoachId, ++seqToken);
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
  if(v==="tag") renderDay();
  if(v==="home") renderRequests();
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
  const pv=document.getElementById("prevorbs");
  if(pv){ pv.innerHTML=["viktor","deniz","mara","lena"].map((id,i)=>
    '<div class="orb '+(AVOK[id]?"hasimg":"")+'" style="width:38px;height:38px;font-size:13px;'+(i?"margin-left:-10px;":"")+"border:2px solid #fff;"+orbStyle(id)+'">'+avatarInner(id)+'</div>').join(""); }
}
var _tr=document.getElementById("teaser-runde"); if(_tr) _tr.onclick=()=>showView("runde");
document.getElementById("topic-marathon").onclick=()=>startRound("Sollte ich im Herbst einen Marathon laufen?");
document.getElementById("topic-energy").onclick=()=>startRound("Wie bekomme ich nachmittags mehr Energie?");
document.getElementById("topic-own").onclick=()=>{ const ow=document.getElementById("ownwrap"); if(ow){ ow.style.display="block"; const i=document.getElementById("owntopic"); if(i) setTimeout(()=>{try{i.focus();}catch(e){}},150); } };
(function(){ const b=document.getElementById("ownstart"), i=document.getElementById("owntopic");
  if(b&&i){ b.onclick=()=>{ const t=i.value.trim(); if(t){ i.value=""; startRound(t); } };
    i.addEventListener("keydown",e=>{ if(e.key==="Enter"){ e.preventDefault(); b.onclick(); } }); } })();
document.getElementById("rundenarchiv").innerHTML='<div style="font-size:13px;color:var(--text3);padding:6px 0">Noch keine Runden — sie erscheinen hier, sobald dein Team welche haelt.</div>';

renderOrbit(); renderDay(); renderLog(); renderStaticOrbs(); renderPicker(); renderCoachCards(); updateMemUI(); renderRequests();
document.getElementById("tagfeed").innerHTML='<div style="font-size:13px;color:var(--text3)">Noch ruhig hier. Sobald dein Team dich kennt, meldet es sich von selbst.</div>';
const _sb=document.getElementById("startbtn"); if(_sb) _sb.onclick=()=>openCall("viktor");
(function(){
  const ow=document.getElementById("orbitwrap"); if(!ow) return;
  ow.addEventListener("pointerdown",e=>{ _dragLast=e.clientX; _dragMoved=0; });
  window.addEventListener("pointermove",e=>{ if(_dragLast!=null){ const dx=e.clientX-_dragLast; dragSpin-=dx*0.007; _dragMoved+=Math.abs(dx); _dragLast=e.clientX; } });
  window.addEventListener("pointerup",()=>{ _dragLast=null; });
  window.addEventListener("mousemove",e=>{ mouseSpinT=-(e.clientX/window.innerWidth-0.5)*1.3; });
})();
runFX("home");

/* Alter Start-Ping entfernt — proaktive Kontaktaufnahme läuft jetzt über die Anfragen-Fläche (Inbox). */

const _pb=document.getElementById("pausebtn"); if(_pb) _pb.onclick=()=>setPaused(!paused);

wireAuth(); updateAuthUI(); sbRefreshSession();


/* Chat senden */
(function(){
  const sendb=document.getElementById("chatsend"), inp=document.getElementById("chatinput");
  if(sendb) sendb.onclick=sendChat;
  if(inp) inp.addEventListener("keydown",e=>{ if(e.key==="Enter"){ e.preventDefault(); sendChat(); } });
})();

/* Whoop verbinden / aktualisieren */
(function(){
  const b=document.getElementById("whoopconnect"), rb=document.getElementById("whooprefresh"), st=document.getElementById("whoopstatus");
  const WHOOP_CONNECT="https://hrmhrfuqmdajskoddrxm.supabase.co/functions/v1/whoop-auth?connect=1&uid=";
  if(b) b.onclick=()=>{
    if(!sbUser || !sbToken){ if(st) st.textContent="Bitte zuerst oben unter „Konto & Sync“ anmelden."; return; }
    if(st) st.textContent="Öffne Whoop-Login … erlaube den Zugriff, dann zurück zur App.";
    try{ window.open(WHOOP_CONNECT+encodeURIComponent(sbUserId), "_blank"); }catch(e){ location.href=WHOOP_CONNECT+encodeURIComponent(sbUserId); }
  };
  if(rb) rb.onclick=async()=>{
    if(!sbUser || !sbToken){ if(st) st.textContent="Erst anmelden."; return; }
    if(st) st.textContent="Lade Whoop-Werte …";
    await syncWhoopFromDB();
    const d=whoopData[0];
    if(st) st.textContent = d ? ("Aktuell ("+d.day+"): Recovery "+(d.recovery??"–")+"%, Schlaf "+(d.sleep_hours??"–")+" h, Strain "+(d.strain??"–"))
      : "Noch keine Werte da. Verbunden? Der Sync läuft stündlich — kurz später nochmal.";
  };
})();

/* Push-Benachrichtigungen (Web Push) — App meldet sich, auch wenn geschlossen */
const VAPID_PUBLIC="BEEC6B36TD4oxBTLIDW59f7MfX2LWE5QP2FvSDBrNq_51udTXCGY2yCZehp7vlROKW-yKEwNvQp2Xes5lrHxLyE";
function urlB64ToUint8(base64){
  const pad="=".repeat((4-base64.length%4)%4);
  const b64=(base64+pad).replace(/-/g,"+").replace(/_/g,"/");
  const raw=atob(b64); const arr=new Uint8Array(raw.length);
  for(let i=0;i<raw.length;i++) arr[i]=raw.charCodeAt(i); return arr;
}
async function enablePush(){
  const st=document.getElementById("pushstatus"); const set=(t)=>{ if(st) st.textContent=t; };
  if(!sbUser||!sbToken){ set("Bitte zuerst oben unter „Konto & Sync“ anmelden."); return; }
  if(!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)){
    set("Dein Gerät unterstützt (noch) keine Web-Push. Auf dem iPhone: App über „Zum Home-Bildschirm“ installieren (iOS 16.4+) und von dort öffnen."); return; }
  try{
    set("Frage nach Erlaubnis …");
    const perm=await Notification.requestPermission();
    if(perm!=="granted"){ set("Benachrichtigungen wurden nicht erlaubt. (In den iPhone-Einstellungen kannst du es später erlauben.)"); return; }
    const reg=await navigator.serviceWorker.ready;
    let sub=await reg.pushManager.getSubscription();
    if(!sub){ sub=await reg.pushManager.subscribe({ userVisibleOnly:true, applicationServerKey:urlB64ToUint8(VAPID_PUBLIC) }); }
    const j=sub.toJSON();
    const body=JSON.stringify({ user_id:sbUserId, endpoint:sub.endpoint, p256dh:j.keys.p256dh, auth:j.keys.auth, updated_at:new Date().toISOString() });
    const r=await fetch(SB_URL+"/rest/v1/push_subs?on_conflict=user_id,endpoint",{ method:"POST",
      headers:{ ...sbHeaders(), Prefer:"resolution=merge-duplicates,return=minimal" }, body });
    if(r.ok||r.status===201||r.status===204){ set("✅ Push aktiv. Dein Team kann dich jetzt erreichen."); }
    else { const t=await r.text(); set("Konnte nicht speichern ("+r.status+"). Ist der Server-Teil (SQL) eingerichtet? "+t.slice(0,70)); }
  }catch(e){ set("Fehler: "+(e&&e.message||e)); }
}
(function(){ const b=document.getElementById("pushenable"); if(b) b.onclick=enablePush; })();

/* v53: Sprach-erst Chatleiste — großer Aufnahme-Knopf + Umschalter (Scribe, sonst Browser) */
(function(){
  const recbtn=document.getElementById("recbtn"), modeswitch=document.getElementById("modeswitch");
  const reclabel=document.getElementById("reclabel");
  const chatinput=document.getElementById("chatinput"), chatsend=document.getElementById("chatsend");
  if(!recbtn||!modeswitch||!chatinput) return;
  const canRec=!!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  const voicePossible = canRec || !!SR;
  let scribeBroken=false;
  const setLabel=(t)=>{ if(reclabel) reclabel.textContent=t; };

  function setMode(m){
    const voice=(m==="voice");
    recbtn.style.display=voice?"flex":"none";
    chatinput.style.display=voice?"none":"";
    chatsend.style.display=voice?"none":"";
    modeswitch.textContent=voice?"⌨︎":"🎤";
    modeswitch.setAttribute("aria-label", voice?"Zur Tastatur":"Zur Sprache");
    if(!voice) setTimeout(()=>{ try{ chatinput.focus(); }catch(e){} },50);
  }
  if(voicePossible) setMode("voice"); else { setMode("text"); modeswitch.style.display="none"; }
  modeswitch.onclick=()=>{ if(recording||srListening) return; setMode(recbtn.style.display==="none"?"voice":"text"); };

  /* Scribe (Aufnahme → ElevenLabs) */
  let mediaRec=null, chunks=[], stream=null, recording=false, busy=false, mime="", finalizing=false;
  function sysMsg(t){ try{ addMsg("sys", t); }catch(e){ setLabel(t.slice(0,22)); setTimeout(()=>setLabel("Sprechen"),2600); } }
  function micLive(){ try{ return stream && stream.getAudioTracks().some(t=>t.readyState==="live"); }catch(e){ return false; } }
  async function startScribe(){
    if(!elKey){ if(SR){ startSR(); return; } sysMsg("Für die Spracherkennung fehlt der ElevenLabs-Schlüssel (⚙︎)."); return; }
    if(!micLive()){ // Zugriff nur einmal pro Gespräch anfordern, danach Stream offen halten
      try{ stream=await navigator.mediaDevices.getUserMedia({audio:true}); }
      catch(e){ if(SR){ startSR(); return; } sysMsg("Mikrofon-Zugriff wurde nicht erlaubt."); setLabel("Sprechen"); return; }
    }
    chunks=[]; mime=""; finalizing=false;
    try{ if(window.MediaRecorder.isTypeSupported("audio/webm")) mime="audio/webm"; else if(window.MediaRecorder.isTypeSupported("audio/mp4")) mime="audio/mp4"; }catch(e){}
    try{ mediaRec = mime ? new MediaRecorder(stream,{mimeType:mime}) : new MediaRecorder(stream); }
    catch(e){ try{ mediaRec=new MediaRecorder(stream); }catch(e2){ if(SR){ startSR(); return; } sysMsg("Aufnahme wird auf diesem Gerät nicht unterstützt."); return; } }
    mediaRec.ondataavailable=(ev)=>{ if(ev.data&&ev.data.size) chunks.push(ev.data); };
    mediaRec.onstop=()=>finalize();
    try{ mediaRec.start(400); }catch(e){ try{ mediaRec.start(); }catch(e2){ if(SR){ startSR(); return; } sysMsg("Aufnahme konnte nicht gestartet werden."); return; } } // Zeitintervall → iOS liefert Daten
    recording=true; recbtn.classList.add("rec"); setLabel("Stopp");
  }
  function stopScribe(){
    recording=false; recbtn.classList.remove("rec");
    busy=true; recbtn.classList.add("busy"); setLabel("… wird erkannt");
    try{ if(mediaRec && mediaRec.state!=="inactive"){ try{ mediaRec.requestData(); }catch(e){} mediaRec.stop(); } }catch(e){}
    setTimeout(()=>finalize(), 1300); // Sicherheitsnetz, falls onstop nicht feuert
  }
  window.__releaseMic=function(){ try{ stream && stream.getTracks().forEach(t=>t.stop()); }catch(e){} stream=null; };
  async function finalize(){
    if(finalizing) return; finalizing=true;
    // Stream NICHT stoppen -> Mikro bleibt fürs Gespräch offen, iOS fragt nicht bei jedem Klick neu
    const type=(mediaRec&&mediaRec.mimeType)||mime||"audio/webm";
    const blob=new Blob(chunks,{type});
    if(!blob.size){ busy=false; recbtn.classList.remove("busy"); setLabel("Sprechen");
      if(SR){ scribeBroken=true; sysMsg("Nicht angekommen — tipp nochmal auf Sprechen, ich höre jetzt direkt zu."); }
      else sysMsg("Mikrofon hat nichts aufgenommen — Zugriff erlaubt und laut genug gesprochen?");
      return; }
    try{
      const fd=new FormData();
      fd.append("file", blob, type.indexOf("mp4")>=0?"audio.mp4":"audio.webm");
      fd.append("model_id","scribe_v1"); fd.append("language_code","de");
      const r=await fetch("https://api.elevenlabs.io/v1/speech-to-text",{ method:"POST", headers:{ "xi-api-key":elKey }, body:fd });
      if(!r.ok){ const t=await r.text(); throw new Error(r.status+(t?(" "+t.slice(0,120)):"")); }
      const d=await r.json(); const text=((d&&d.text)||"").trim();
      busy=false; recbtn.classList.remove("busy"); setLabel("Sprechen");
      if(text){ chatinput.value=text; sendChat(); }
      else sysMsg("Nichts verstanden — bitte nochmal.");
    }catch(e){
      busy=false; recbtn.classList.remove("busy"); setLabel("Sprechen");
      try{ console.error("Scribe-Fehler:", e); }catch(_){}
      const msg=String(e&&e.message||e);
      if(SR && /^(401|403|404|422|429)/.test(msg)){ scribeBroken=true; sysMsg("Studio-Spracherkennung nicht verfügbar ("+msg.slice(0,16)+"). Ich nutze ab jetzt die Browser-Erkennung."); }
      else sysMsg("Spracherkennung-Fehler: "+msg.slice(0,70));
    }
  }

  /* Browser-Spracherkennung (Fallback) */
  let rec=null, srListening=false, finalText="";
  function startSR(){
    if(!SR){ setLabel("Sprache n/v"); setTimeout(()=>setLabel("Sprechen"),2000); return; }
    finalText="";
    try{
      rec=new SR(); rec.lang="de-DE"; rec.interimResults=true; rec.continuous=true; rec.maxAlternatives=1;
      rec.onstart=()=>{ srListening=true; recbtn.classList.add("rec"); setLabel("Stopp"); };
      rec.onresult=(e)=>{ let interim=""; for(let i=e.resultIndex;i<e.results.length;i++){ const r=e.results[i]; if(r.isFinal) finalText+=r[0].transcript+" "; else interim+=r[0].transcript; } chatinput.value=(finalText+interim).replace(/\s{2,}/g," ").trim(); };
      rec.onerror=(ev)=>{ if(ev&&(ev.error==="no-speech"||ev.error==="aborted")) return; stopSR(false); };
      rec.onend=()=>{ if(srListening){ try{ rec.start(); }catch(e){} } };
      try{ unlockAudio(); }catch(e){}
      rec.start();
    }catch(e){ srListening=false; recbtn.classList.remove("rec"); setLabel("Sprechen"); }
  }
  function stopSR(send){
    srListening=false; recbtn.classList.remove("rec"); setLabel("Sprechen");
    if(rec){ try{ rec.onend=null; rec.stop(); }catch(e){} }
    if(send){ const t=(chatinput.value||"").trim(); if(t) sendChat(); }
  }

  recbtn.onclick=()=>{
    if(busy) return;
    const useScribe = elKey && canRec && !scribeBroken;
    if(useScribe){ recording ? stopScribe() : startScribe(); }
    else if(SR){ srListening ? stopSR(true) : startSR(); }
    else { setMode("text"); }
  };
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
  if(mr) mr.onclick=()=>{ if(confirm("Alles Gemerkte löschen? Dein Team startet dann wieder bei null.")){ memItems=[]; saveMem(); updateMemUI(); if(sbUser){ dbDeleteAll(); } } };
  const mc=document.getElementById("memclean");
  if(mc) mc.onclick=()=>cleanupMemory();
  const mb=document.getElementById("membackup");
  if(mb) mb.onclick=()=>{
    const data={ v:2, exported:new Date().toISOString(), memItems:memItems, elKey:elKey, anthKey:anthKey, voiceOn:voiceOn };
    const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
    const a=document.createElement("a"); a.href=URL.createObjectURL(blob);
    a.download="mein-team-backup.json"; document.body.appendChild(a); a.click(); a.remove();
    s.textContent="Sicherung heruntergeladen ("+memItems.length+" Einträge).";
  };
  const mi=document.getElementById("memimport"), mf=document.getElementById("memfile");
  if(mi&&mf){
    mi.onclick=()=>mf.click();
    mf.onchange=()=>{
      const f=mf.files&&mf.files[0]; if(!f) return;
      const rd=new FileReader();
      rd.onload=()=>{ try{
        const d=JSON.parse(rd.result);
        let n=0;
        if(Array.isArray(d.memItems)){
          memItems=d.memItems.map(it=>({ text:String(it.text||""), kind:MEM_KINDS.includes(it.kind)?it.kind:"fact", coach:normCoach(it.coach), key:it.key||undefined, date:it.date||undefined })).filter(it=>it.text);
          n=memItems.length; saveMem(); updateMemUI(); if(sbUser) pushAllMemoryReplace();
        } else if(Array.isArray(d.memFacts)){
          memItems=d.memFacts.map(t=>({ text:String(t), kind:"fact", coach:"core" })); n=memItems.length;
          saveMem(); updateMemUI(); if(sbUser) pushAllMemoryReplace();
        }
        if(typeof d.elKey==="string"){ elKey=d.elKey; store.set("elKey",elKey); }
        if(typeof d.anthKey==="string"){ anthKey=d.anthKey; store.set("anthKey",anthKey); document.getElementById("anthkeyinput").value=anthKey; }
        if(typeof d.voiceOn==="boolean"){ voiceOn=d.voiceOn; store.set("voiceOn",voiceOn?"1":"0"); }
        elFail=false; syncToggles(); stat();
        s.textContent="Geladen: "+n+" Einträge + Einstellungen.";
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

if("serviceWorker" in navigator){
  const _hadController=!!navigator.serviceWorker.controller; // schon kontrolliert = Update-Fall
  navigator.serviceWorker.register("sw.js").then(reg=>{ try{ reg.update(); }catch(e){} }).catch(()=>{});
  let _refreshed=false;
  navigator.serviceWorker.addEventListener("controllerchange",()=>{
    if(_refreshed || !_hadController) return; // Erstinstallation: nicht neu laden (sonst spielt das Intro doppelt)
    _refreshed=true; location.reload();
  });
}

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
    body:JSON.stringify({ text:"Hallo Marco, hier ist Viktor. Die Verbindung steht.", model_id:EL_MODEL, voice_settings:EL_SETTINGS })
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
