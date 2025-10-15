
;(function(){
  async function loadJSON(url){ const r = await fetch(url); return r.json(); }
  function mountAlphabet(targetSelector, opts){
    const el = document.querySelector(targetSelector);
    if(!el) return;
    const base = opts?.dataBaseUrl || './data/';
    loadJSON(base+'lessons.json').then(data=>{
      const letters = (data.alphabet?.letters)||[];
      el.innerHTML = `<link rel="stylesheet" href="${(opts?.widgetsBaseUrl||'./widgets/')+'komi-styles.css'}"/>
      <div class="komi-card"><div style="font-weight:700;margin-bottom:.5rem">Алфавит</div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(90px,1fr));gap:.6rem"></div></div>`;
      const grid = el.querySelector('div[style*="grid"]');
      letters.forEach(L=>{
        const card = document.createElement('button');
        card.className = 'komi-btn';
        card.style.padding='16px';
        card.innerHTML = `<div style="font-size:1.4rem">${L.char}</div><div class="komi-muted" style="font-size:.85em">${L.name}</div>`;
        card.addEventListener('click', ()=>{ if(window.KomiTTS) window.KomiTTS.speak(L.char.split(' ')[0]); });
        grid.appendChild(card);
      });
    });
  }
  window.KomiAlphabet = { mount: mountAlphabet };
})();
