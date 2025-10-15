
;(function(){
  async function j(u){ const r=await fetch(u); return r.json(); }
  function mount(target, opts){
    const el=(typeof target==='string')?document.querySelector(target):target; if(!el) return;
    const base=(opts?.widgetsBaseUrl||'./widgets/');
    el.innerHTML = `<link rel="stylesheet" href="${base+'komi-theme.css'}"/><div class="komi-card fade-in">
      <div style="display:flex;justify-content:space-between;align-items:center"><b>Mini-quiz</b><span class="stat komi-muted"></span></div>
      <div class="q" style="font-size:1.1rem;margin:.6rem 0"></div>
      <div class="opts" style="display:grid;gap:.5rem"></div>
      <div class="res komi-muted" style="min-height:1.4rem"></div>
      <button class="next komi-btn">Next</button></div>`;
    const $q=el.querySelector('.q'), $o=el.querySelector('.opts'), $r=el.querySelector('.res'), $s=el.querySelector('.stat'), $n=el.querySelector('.next');
    j((opts?.dataBaseUrl||'./data/')+'lessons.json').then(d=>{
      const items=(d.quiz||[]).slice(); let i=0, score=0; $s.textContent=`0 / ${items.length}`;
      function render(){
        if(i>=items.length){ $q.textContent='Done!'; $o.innerHTML=''; $r.textContent=`Score: ${score}/${items.length}`; $n.style.display='none'; return; }
        const it=items[i]; $q.textContent=it.q; $o.innerHTML=''; $r.textContent='';
        it.options.forEach((opt,idx)=>{ const b=document.createElement('button'); b.className='komi-btn'; b.textContent=opt;
          b.addEventListener('click',()=>{ if(idx===it.answer){ score++; $r.textContent='Correct!'; } else { $r.textContent='Wrong'; } $s.textContent=`${i+1} / ${items.length}`; });
          $o.appendChild(b); });
      } $n.addEventListener('click',()=>{ i++; render(); }); render();
    });
  }
  window.KomiQuiz = { mount };
})();