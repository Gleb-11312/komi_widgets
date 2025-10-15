
;(function(){
  async function loadJSON(url){ const r = await fetch(url); return r.json(); }
  function mount(targetSelector, opts){
    const el = document.querySelector(targetSelector);
    if(!el) return;
    const base = opts?.dataBaseUrl || './data/';
    loadJSON(base+'lessons.json').then(data=>{
      const items = (data.quiz||[]).slice();
      let i=0, score=0;
      el.innerHTML = `<link rel="stylesheet" href="${(opts?.widgetsBaseUrl||'./widgets/')+'komi-styles.css'}"/>
      <div class="komi-card">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <b>Мини-викторина</b><span class="stat komi-muted">0 / ${items.length}</span>
        </div>
        <div class="q" style="font-size:1.1rem;margin:.6rem 0"></div>
        <div class="opts" style="display:grid;gap:.5rem"></div>
        <div class="res komi-muted" style="min-height:1.4rem"></div>
        <button class="next komi-btn">Дальше</button>
      </div>`;
      const $q=el.querySelector('.q'), $opts=el.querySelector('.opts'), $res=el.querySelector('.res'), $stat=el.querySelector('.stat'), $next=el.querySelector('.next');
      function render(){
        if(i>=items.length){ $q.textContent='Готово!'; $opts.innerHTML=''; $res.textContent=`Результат: ${score}/${items.length}`; $next.style.display='none'; return; }
        const it = items[i]; $q.textContent = it.q; $opts.innerHTML=''; $res.textContent='';
        it.options.forEach((opt,idx)=>{
          const b=document.createElement('button'); b.className='komi-btn'; b.textContent=opt;
          b.addEventListener('click',()=>{ if(idx===it.answer){ score++; $res.textContent='Верно!'; } else { $res.textContent='Неверно'; } $stat.textContent=`${i+1} / ${items.length}`; });
          $opts.appendChild(b);
        });
      }
      $next.addEventListener('click',()=>{ i++; render(); });
      render();
    });
  }
  window.KomiQuiz = { mount };
})();
