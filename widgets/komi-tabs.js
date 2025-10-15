
;(function(){
  function mount(sel, opts){
    const el=(typeof sel==='string')?document.querySelector(sel):sel; if(!el) return;
    const base=(opts?.widgetsBaseUrl||'./widgets/');
    el.innerHTML = `<link rel="stylesheet" href="${base+'komi-theme.css'}"/>
      <div class="komi-tabs">
        <button class="komi-tab active" data-tab="translator">Translator</button>
        <button class="komi-tab" data-tab="assistant">Assistant</button>
        <button class="komi-tab" data-tab="games">Games</button>
      </div>
      <div class="tab translator"></div>
      <div class="tab assistant" style="display:none"></div>
      <div class="tab games" style="display:none"></div>`;
    const $t=el.querySelector('.translator'), $a=el.querySelector('.assistant'), $g=el.querySelector('.games');
    // Mount sub-widgets with ELEMENT targets (works in v4.1)
    if(window.KomiTranslator) KomiTranslator.mount($t, { dataBaseUrl: opts?.dataBaseUrl||'./data/', widgetsBaseUrl: base, audioBaseUrl: opts?.audioBaseUrl||'./audio/', strictUnknown: 'drop' });
    if(window.KomiAssistant) KomiAssistant.mount($a, { widgetsBaseUrl: base });
    if(window.KomiQuiz && window.KomiScramble){
      const quiz = document.createElement('div'); const scramble = document.createElement('div'); $g.appendChild(quiz); $g.appendChild(scramble);
      KomiQuiz.mount(quiz, { dataBaseUrl: opts?.dataBaseUrl||'./data/', widgetsBaseUrl: base });
      KomiScramble.mount(scramble, { dataBaseUrl: opts?.dataBaseUrl||'./data/', widgetsBaseUrl: base });
    }
    el.querySelectorAll('.komi-tab').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        el.querySelectorAll('.komi-tab').forEach(b=>b.classList.remove('active')); btn.classList.add('active');
        $t.style.display = btn.dataset.tab==='translator'?'block':'none';
        $a.style.display = btn.dataset.tab==='assistant'?'block':'none';
        $g.style.display = btn.dataset.tab==='games'?'block':'none';
      });
    });
  }
  window.KomiTabs = { mount };
})();