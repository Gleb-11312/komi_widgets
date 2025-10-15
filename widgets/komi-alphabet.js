
;(function(){
  async function loadJSON(url){ const r = await fetch(url); return r.json(); }
  function mountAlphabet(targetSelector, opts){
    const el = document.querySelector(targetSelector);
    if(!el) return;
    const base = opts?.dataBaseUrl || './data/';
    loadJSON(base+'lessons.json').then(data=>{
      const letters = (data.alphabet?.letters)||[];
      el.innerHTML = `<div class="komi-alpha" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(90px,1fr));gap:.6rem"></div>`;
      const grid = el.firstChild;
      letters.forEach(L=>{
        const card = document.createElement('button');
        card.style.padding='16px';
        card.style.border='1px solid #e5e7eb';
        card.style.borderRadius='14px';
        card.style.cursor='pointer';
        card.innerHTML = `<div style="font-size:1.4rem">${L.char}</div><div style="opacity:.7;font-size:.85em">${L.name}</div>`;
        card.addEventListener('click', ()=>{
          if(window.KomiTTS) window.KomiTTS.speak(L.char.split(' ')[0]);
        });
        grid.appendChild(card);
      });
    });
  }
  window.KomiAlphabet = { mount: mountAlphabet };
})();
