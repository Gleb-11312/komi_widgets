
;(function(){
  async function loadJSON(url){ const r = await fetch(url); return r.json(); }
  function normalize(s, lowercase=true, strip=true){
    let t = s;
    if (lowercase) t = t.toLowerCase();
    if (strip) t = t.replace(/[.,!?;:()"“”]/g, ' ');
    return t.replace(/\s+/g,' ').trim();
  }
  function tokenize(s, lowercase, strip){
    const t = normalize(s, lowercase, strip);
    return t.split(' ').filter(Boolean);
  }
  function longestTranslate(tokens, dict, maxN){
    const out = []; const align = []; const unknown = [];
    let i=0;
    while(i<tokens.length){
      let matched=null, matchedText=null, k=0;
      for(let n=Math.min(maxN, tokens.length - i); n>=1; n--){
        const phrase = tokens.slice(i, i+n).join(' ');
        if(dict[phrase]){ matched = dict[phrase]; matchedText = phrase; k=n; break; }
      }
      if(matched!==null){
        out.push(matched); align.push([tokens.slice(i,i+k).join(' '), matched]); i += k;
      } else {
        out.push(tokens[i]); align.push([tokens[i], tokens[i]]); unknown.push(tokens[i]); i += 1;
      }
    }
    return { out, unknown, align };
  }
  async function mount(targetSelector, opts){
    const el = document.querySelector(targetSelector);
    if(!el) return;
    const base = opts?.dataBaseUrl || './data/';
    const [dict, rules, audioMap] = await Promise.all([
      loadJSON(base+'dictionary.json'),
      loadJSON(base+'rules.json'),
      loadJSON(base+'audio_map.json').catch(()=>null)
    ]);
    el.innerHTML = `
      <link rel="stylesheet" href="${(opts?.widgetsBaseUrl||'./widgets/')+'komi-styles.css'}"/>
      <div class="komi-card">
        <div style="font-weight:700;font-size:1.05rem;margin-bottom:.2rem">Переводчик (EN → Коми, демо)</div>
        <div class="komi-muted" style="margin-bottom:.6rem">Ориентирован на короткие учебные фразы. Поддерживает фразы-коллокации (например: “good morning” → “бур асыва”).</div>
        <textarea class="src" rows="3" placeholder="Type a short phrase in English…" style="padding:.7rem;border:1px solid #e5e7eb;border-radius:12px;width:100%"></textarea>
        <div class="komi-row" style="margin-top:.6rem">
          <button class="btn-translate komi-btn">Перевести</button>
          <button class="btn-speak komi-btn">Прослушать</button>
          <span class="hint komi-muted"></span>
        </div>
        <div class="komi-result result" style="margin-top:.6rem"></div>
        <div class="debug komi-muted" style="font-size:.9em;margin-top:.4rem"></div>
      </div>
    `;
    const $src = el.querySelector('.src');
    const $res = el.querySelector('.result');
    const $hint = el.querySelector('.hint');
    const $dbg = el.querySelector('.debug');
    el.querySelector('.btn-translate').addEventListener('click', ()=>{
      const text = $src.value || '';
      if(text.length > (rules.maxChars||200)){
        $hint.textContent = `Слишком длинно (>${rules.maxChars} симв.).`;
        return;
      }
      const toks = tokenize(text, !!rules.lowercase, !!rules.stripPunctuation);
      const {out, unknown, align} = longestTranslate(toks, dict, rules.maxNgram||3);
      const joined = out.join(rules.joiner||' ');
      $res.textContent = joined.trim();
      $hint.textContent = unknown.length ? `Неизвестно: ${unknown.join(', ')}` : 'Готово';
      $dbg.innerHTML = '<b>Соответствия:</b> ' + align.map(p=>`[${p[0]} → ${p[1]}]`).join(' · ');
      // store last for TTS
      el.dataset.last = joined.trim();
    });
    el.querySelector('.btn-speak').addEventListener('click', async ()=>{
      const t = (el.dataset.last || $res.textContent || '').trim();
      if(!t) return;
      const ok = await (window.KomiTTS ? window.KomiTTS.speak(t, { audioBaseUrl: (opts?.audioBaseUrl||'./audio/'), audioMap }) : Promise.resolve(false));
      if(!ok) { $hint.textContent = 'Речь недоступна.'; }
    });
  }
  window.KomiTranslator = { mount };
})();
