
;(function(){
  function mount(sel, opts){
    const el=(typeof sel==='string')?document.querySelector(sel):sel; if(!el) return;
    const base=(opts?.widgetsBaseUrl||'./widgets/');
    el.innerHTML = `<link rel="stylesheet" href="${base+'komi-theme.css'}"/>
      <div class="komi-tabs">
        <button class="komi-tab active" data-tab="translator">Translator</button>
        <button class="komi-tab" data-tab="assistant" disabled>Assistant (soon)</button>
        <button class="komi-tab" data-tab="games" disabled>Games (soon)</button>
      </div>
      <div class="tab translator"></div>
      <div class="tab assistant" style="display:none"></div>
      <div class="tab games" style="display:none"></div>`;
    const $t=el.querySelector('.translator');
    if(window.KomiTranslator) KomiTranslator.mount($t, { dataBaseUrl: opts?.dataBaseUrl||'./data/', widgetsBaseUrl: base, strictUnknown: 'drop' });
  }
  window.KomiTabs = { mount };
})();