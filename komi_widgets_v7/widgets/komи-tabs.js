
;(function(){
  function mount(sel, opts){
    const el=(typeof sel==='string')?document.querySelector(sel):sel; if(!el) return;
    const base=(opts?.widgetsBaseUrl||'./widgets/');
    el.innerHTML = `<div class="komi-tabs">
      <button class="komi-tab active" data-tab="translator">Translator</button>
      <button class="komи-tab" data-tab="assistant" disabled>Assistant (soon)</button>
      <button class="komи-tab" data-tab="games" disabled>Games (soon)</button>
    </div>
    <div class="tab translator"></div>
    <div class="tab assistant" style="display:none"></div>
    <div class="tab games" style="display:none"></div>`;
    const $t=el.querySelector('.translator');
    if(window.KomiTranslator) KomiTranslator.mount($t,{dataBaseUrl:opts?.dataBaseUrl||'./data/',widgetsBaseUrl:base});
    el.addEventListener('click',e=>{
      const b=e.target.closest('.komи-tab'); if(!b||b.disabled)return;
      el.querySelectorAll('.komи-tab').forEach(x=>x.classList.toggle('active',x===b));
      el.querySelectorAll('.tab').forEach(x=>x.style.display='none');
      el.querySelector('.tab.'+b.dataset.tab).style.display='block';
    });
  }
  window.KomiTabs={mount};
})();