
;(function(){
  async function loadJSON(url){ const r = await fetch(url); return r.json(); }
  function createQuiz(targetSelector, opts){
    const el = document.querySelector(targetSelector);
    if(!el) return;
    const base = opts?.dataBaseUrl || './data/';
    loadJSON(base+'lessons.json').then(data=>{
      const items = (data.quiz||[]).slice();
      let i = 0, score = 0;
      el.innerHTML = `
        <div class="komi-quiz" style="display:grid;gap:.8rem">
          <div class="row" style="display:flex;justify-content:space-between;align-items:center">
            <div><b>Мини‑викторина</b></div>
            <div class="stat">0 / ${items.length}</div>
          </div>
          <div class="q" style="font-size:1.1rem"></div>
          <div class="opts" style="display:grid;gap:.5rem"></div>
          <div class="res" style="min-height:1.6rem;opacity:.8"></div>
          <button class="next" style="padding:.5rem .8rem;border-radius:12px;border:1px solid #ccc;cursor:pointer">Дальше</button>
        </div>`;
      const $q = el.querySelector('.q');
      const $opts = el.querySelector('.opts');
      const $stat = el.querySelector('.stat');
      const $res = el.querySelector('.res');
      const $next = el.querySelector('.next');
      function render(){
        if(i>=items.length){
          $q.textContent = 'Готово!';
          $opts.innerHTML='';
          $res.textContent = `Ваш результат: ${score} из ${items.length}`;
          $next.style.display='none';
          return;
        }
        const it = items[i];
        $q.textContent = it.q;
        $opts.innerHTML = '';
        it.options.forEach((opt,idx)=>{
          const b = document.createElement('button');
          b.textContent = opt;
          b.style.padding = '.5rem .8rem';
          b.style.borderRadius='12px';
          b.style.border='1px solid #ccc';
          b.style.cursor='pointer';
          b.addEventListener('click', ()=>{
            if(idx===it.answer){ score++; $res.textContent='Верно!'; }
            else { $res.textContent='Неверно'; }
            $stat.textContent = `${i+1} / ${items.length}`;
          });
          $opts.appendChild(b);
        });
      }
      $next.addEventListener('click', ()=>{ i++; $res.textContent=''; render(); });
      render();
    });
  }
  window.KomiQuiz = { mount: createQuiz };
})();
