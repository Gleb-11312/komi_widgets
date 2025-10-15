
;(function(){
  async function loadJSON(url){ const r = await fetch(url); return r.json(); }
  function norm(s){ return s.toLowerCase().replace(/[.,!?;:()"“”]/g,' ').replace(/\s+/g,' ').trim(); }
  function toTokens(s){ return norm(s).split(' ').filter(Boolean); }
  function longestMap(tokens, dict, maxN){
    const out = []; const align=[]; let i=0;
    while(i<tokens.length){
      let hit=null, phrase=null, k=0;
      for(let n=Math.min(maxN, tokens.length-i); n>=1; n--){
        const p = tokens.slice(i,i+n).join(' ');
        if(dict[p]!==undefined){ hit=dict[p]; phrase=p; k=n; break; }
      }
      if(hit!==null){ out.push(hit); align.push([phrase, hit]); i+=k; }
      else { out.push(tokens[i]); align.push([tokens[i], tokens[i]]); i+=1; }
    }
    return { out, align };
  }
  async function mount(selector, opts){
    const el=document.querySelector(selector); if(!el) return;
    const dataBase = opts?.dataBaseUrl || './data/';
    const widgetsBase = opts?.widgetsBaseUrl || './widgets/';
    const [enru, rukomi, audiomap] = await Promise.all([
      loadJSON(dataBase+'en_ru.json'), loadJSON(dataBase+'ru_komi.json'),
      loadJSON(dataBase+'audio_map.json').catch(()=>({}))
    ]);
    el.innerHTML = `
      <link rel="stylesheet" href="${widgetsBase+'komi-theme.css'}"/>
      <div class="komi-card">
        <div class="komi-title">English → Komi (demo)</div>
        <div class="komi-muted" style="margin:.35rem 0">Short learner phrases. Internally EN→RU→Komi (RU step hidden).</div>
        <textarea class="src" rows="3" placeholder="Type a short phrase in English…" style="padding:.75rem;border:1px solid #dce7f2;border-radius:12px;width:100%"></textarea>
        <div class="komi-row" style="margin-top:.6rem">
          <button class="do komi-btn primary">Translate</button>
          <button class="say komi-btn">Play audio</button>
          <span class="hint komi-muted"></span>
        </div>
        <div class="komi-result out" style="margin-top:.6rem"></div>
      </div>`;
    if(window.KomiTTS && window.KomiTTS.preloadAudioMap){
      window.KomiTTS.preloadAudioMap(opts?.audioBaseUrl||'./audio/', audiomap);
    }
    const $src = el.querySelector('.src');
    const $out = el.querySelector('.out');
    const $hint = el.querySelector('.hint');
    el.querySelector('.do').addEventListener('click', ()=>{
      const t = $src.value||'';
      if(t.length>220){ $hint.textContent='Too long (max 220 chars).'; return; }
      const toks = toTokens(t);
      const ru = longestMap(toks,enru,3).out.join(' ');
      const ruToks = toTokens(ru);
      const komi = longestMap(ruToks,rukomi,3).out.join(' ').replace(/\s+/g,' ').trim();
      $out.textContent = komi;
      el.dataset.last = komi;
      $hint.textContent = komi ? 'Ready' : 'Try simpler phrasing';
    });
    el.querySelector('.say').addEventListener('click', async ()=>{
      const text = el.dataset.last || $out.textContent || '';
      if(!text) return;
      const ok = await window.KomiTTS.speak(text);
      if(!ok) $hint.textContent='Audio not available in this browser.';
    });
  }
  window.KomiTranslator = { mount };
})();
