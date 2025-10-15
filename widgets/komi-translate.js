
;(function(){
  async function loadJSON(url){
    const res = await fetch(url);
    return await res.json();
  }
  function tokenize(s, stripPunctuation=true, lowercase=true){
    let t = s;
    if (lowercase) t = t.toLowerCase();
    if (stripPunctuation) t = t.replace(/[.,!?;:()"“”]/g, ' ');
    return t.split(/\s+/).filter(Boolean);
  }
  function translateTokens(tokens, dict){
    const out = [];
    const unknown = [];
    for(const tok of tokens){
      if(dict[tok]) out.push(dict[tok]);
      else { out.push(tok); unknown.push(tok); }
    }
    return { out, unknown };
  }
  async function createTranslator(targetSelector, opts){
    const el = document.querySelector(targetSelector);
    if(!el) return;
    const base = opts?.dataBaseUrl || './data/';
    const [dict, rules] = await Promise.all([
      loadJSON(base+'dictionary.json'),
      loadJSON(base+'rules.json')
    ]);
    el.innerHTML = `
      <div class="komi-translator" style="display:grid;gap:.75rem">
        <label style="font-weight:600">Английский → Коми (демо)</label>
        <textarea class="src" rows="3" placeholder="Type a short phrase in English…" style="padding:.6rem;border:1px solid #ddd;border-radius:12px"></textarea>
        <div style="display:flex;gap:.5rem;flex-wrap:wrap">
          <button class="btn-translate" style="padding:.5rem .8rem;border-radius:12px;border:1px solid #ccc;cursor:pointer">Перевести</button>
          <button class="btn-speak" style="padding:.5rem .8rem;border-radius:12px;border:1px solid #ccc;cursor:pointer">Прослушать</button>
          <span class="hint" style="opacity:.6"></span>
        </div>
        <div class="result" style="min-height:2.2rem;padding:.6rem;border:1px dashed #bbb;border-radius:12px;background:#fafafa"></div>
        <div class="debug" style="font-size:.9em;opacity:.8"></div>
      </div>
    `;
    const $src = el.querySelector('.src');
    const $res = el.querySelector('.result');
    const $hint = el.querySelector('.hint');
    const $dbg = el.querySelector('.debug');
    el.querySelector('.btn-translate').addEventListener('click', ()=>{
      const text = $src.value || '';
      if(text.length > (rules.maxChars||200)){
        $hint.textContent = `Слишком длинно: максимум ${(rules.maxChars||200)} символов.`;
        return;
      }
      const toks = tokenize(text, !!rules.stripPunctuation, !!rules.lowercase);
      const {out, unknown} = translateTokens(toks, dict);
      const joined = out.join(rules.joiner||' ');
      $res.textContent = joined.trim();
      $hint.textContent = unknown.length ? `Неизвестно: ${unknown.join(', ')}. ${rules.unknownHint||''}` : 'Готово';
      $dbg.innerHTML = `<b>Токены:</b> ${toks.join(' · ')}<br/><b>Соответствия:</b> ${out.join(' · ')}`;
    });
    el.querySelector('.btn-speak').addEventListener('click', ()=>{
      const t = $res.textContent || '';
      if(!t) return;
      const ok = window.KomiTTS ? window.KomiTTS.speak(t) : false;
      if(!ok) {
        $hint.textContent = 'Речь недоступна в этом браузере.';
      }
    });
  }
  window.KomiTranslator = { mount: createTranslator };
})();
