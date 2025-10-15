
;(function(){
  async function j(u){ const r=await fetch(u); return r.json(); }
  const norm = s => s.toLowerCase().replace(/[.,!?;:()"“”]/g,' ').replace(/\s+/g,' ').trim();
  const toks = s => norm(s).split(' ').filter(Boolean);
  function mapLongest(tokens, dict, n=3){
    const out=[]; const unk=[]; let i=0;
    while(i<tokens.length){
      let hit=null, k=0;
      for(let m=Math.min(n,tokens.length-i); m>=1; m--){
        const p = tokens.slice(i,i+m).join(' ');
        if(dict[p]!==undefined){ hit=dict[p]; k=m; break; }
      }
      if(hit!==null){ out.push(hit); i+=k; } else { out.push({__u:tokens[i]}); unk.push(tokens[i]); i++; }
    }
    return {out, unk};
  }
  function finalize(chunks, mode){
    const parts=[]; for(const c of chunks){
      if(typeof c==='string') parts.push(c);
      else if(c && c.__u){ if(mode==='drop'){} else if(mode==='mark'){ parts.push('‹?'+c.__u+'›'); } else { parts.push(c.__u); } }
    }
    return parts.join(' ').replace(/\s+/g,' ').trim();
  }
  function dl(filename, data){
    const blob = new Blob([data], {type:'application/json'});
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = filename; a.click();
  }
  async function mount(target, opts){
    const el = (typeof target==='string')?document.querySelector(target):target; if(!el) return;
    const base=opts?.dataBaseUrl||'./data/'; const strict=opts?.strictUnknown||'drop';
    const [enru, rukomi, amap] = await Promise.all([ j(base+'en_ru.json'), j(base+'ru_komi.json'), j(base+'audio_map.json').catch(()=>({})) ]);
    el.innerHTML = `
      <link rel="stylesheet" href="${(opts?.widgetsBaseUrl||'./widgets/')+'komi-theme.css'}"/>
      <div class="komi-card fade-in">
        <div class="komi-title">English → Komi</div>
        <div class="komi-row" style="margin:.35rem 0"><span class="badge">Internal EN→RU→Komi</span><span class="komi-muted">Unknown words: ${strict}</span></div>
        <textarea class="src" rows="3" placeholder="Type a short phrase in English…" style="padding:.75rem;border:1px solid var(--k-border);border-radius:12px;width:100%"></textarea>
        <div class="komi-row" style="margin-top:.6rem">
          <button class="do komi-btn primary">Translate</button>
          <button class="say komi-btn">Play audio</button>
          <button class="exp komi-btn">Export unknowns</button>
          <span class="hint komi-muted"></span>
          <span class="spinner" style="display:none"></span>
        </div>
        <div class="komi-result out" style="margin-top:.6rem"></div>
      </div>`;
    if(window.KomiTTS && window.KomiTTS.preloadAudioMap){ window.KomiTTS.preloadAudioMap(opts?.audioBaseUrl||'./audio/', amap); }
    const $src=el.querySelector('.src'), $out=el.querySelector('.out'), $hint=el.querySelector('.hint'), $spin=el.querySelector('.spinner');
    function translate(){
      const text=$src.value||''; if(text.length>500){ $hint.textContent='Too long (max 500 chars).'; return; }
      $spin.style.display='inline-block';
      const ru = mapLongest(toks(text), enru, 3); const ruText = finalize(ru.out, strict);
      const km = mapLongest(toks(ruText), rukomi, 3); const kmText = finalize(km.out, strict);
      $out.textContent=kmText; el.dataset.last=kmText; const u = ru.unk.concat(km.unk);
      $hint.textContent = u.length ? `Dropped unknown: ${u.join(', ')}` : 'Ready';
      $spin.style.display='none'; el.dataset.unknown = JSON.stringify(u);
    }
    el.querySelector('.do').addEventListener('click', translate);
    el.querySelector('.say').addEventListener('click', async ()=>{
      const t = el.dataset.last || $out.textContent || ''; if(!t) return; const ok = await (window.KomiTTS ? window.KomiTTS.speak(t) : Promise.resolve(false));
      if(!ok) $hint.textContent='Audio not available.';
    });
    el.querySelector('.exp').addEventListener('click', ()=>{
      const u = el.dataset.unknown ? JSON.parse(el.dataset.unknown) : []; const uniq=[...new Set(u)];
      const obj = { unknown_english: uniq, created_at: new Date().toISOString() };
      dl('unknowns.json', JSON.stringify(obj, null, 2));
    });
  }
  window.KomiTranslator = { mount };
})();