
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
    const [enru, rukomi] = await Promise.all([ j(base+'en_ru.json'), j(base+'ru_komi.json') ]);
    el.innerHTML = `
      <link rel="stylesheet" href="${(opts?.widgetsBaseUrl||'./widgets/')+'komi-theme.css'}"/>
      <div class="komи-card">
        <div class="komи-title">Komi Translator</div>
        <div class="коми-muted" style="margin:.25rem 0">This tool translates text from <b>English to Komi</b>. It’s still in development, so some words may be missing or imperfectly translated.</div>
        <textarea class="src" rows="3" placeholder="Type a short sentence in English…" style="margin-top:.3rem;padding:.75rem;border:1px solid var(--k-border);border-radius:12px;width:100%"></textarea>
        <div class="коми-row" style="margin-top:.6rem">
          <button class="do коми-btn primary">Translate</button>
          <button class="exp коми-btn">Export unknowns</button>
          <span class="hint коми-muted"></span>
          <span class="spinner" style="display:none"></span>
        </div>
        <div class="коми-result out" style="margin-top:.6rem"></div>
      </div>`;
    const $src=el.querySelector('.src'), $out=el.querySelector('.out'), $hint=el.querySelector('.hint'), $spin=el.querySelector('.spinner');
    function translate(){
      const text=$src.value||''; if(text.length>1000){ $hint.textContent='Too long (max 1000 chars).'; return; }
      $spin.style.display='inline-block';
      // Internally: EN -> RU -> Komi
      const ru = mapLongest(toks(text), enru, 3); const ruText = finalize(ru.out, strict);
      const km = mapLongest(toks(ruText), rukomi, 3); const kmText = finalize(km.out, strict);
      $out.textContent=kmText; const u = ru.unk.concat(km.unk);
      $hint.textContent = u.length ? `Unknown: ${[...new Set(u)].join(', ')}` : 'Ready';
      $spin.style.display='none'; el.dataset.unknown = JSON.stringify(u);
    }
    el.querySelector('.do').addEventListener('click', translate);
    el.querySelector('.exp').addEventListener('click', ()=>{
      const u = el.dataset.unknown ? JSON.parse(el.dataset.unknown) : []; const uniq=[...new Set(u)];
      const obj = { unknown_english: uniq, created_at: new Date().toISOString() };
      dl('unknowns.json', JSON.stringify(obj, null, 2));
    });
  }
  window.KomiTranslator = { mount };
})();