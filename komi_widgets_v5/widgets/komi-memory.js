
;(function(){
  async function j(u){ const r=await fetch(u); return r.json(); }
  function mount(target, opts){
    const el=(typeof target==='string')?document.querySelector(target):target; if(!el) return;
    const base=(opts?.widgetsBaseUrl||'./widgets/');
    el.innerHTML = `<link rel="stylesheet" href="${base+'komi-theme.css'}"/><div class="komi-card fade-in">
      <b>Memory Match (EN ↔ Komi)</b>
      <div class="grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:.6rem;margin-top:.6rem"></div>
      <div class="komi-row" style="margin-top:.6rem"><button class="again komi-btn">Shuffle</button><span class="hint komi-muted"></span></div>
    </div>`;
    const grid=el.querySelector('.grid'), hint=el.querySelector('.hint');
    Promise.all([ j((opts?.dataBaseUrl||'./data/')+'en_ru.json'), j((opts?.dataBaseUrl||'./data/')+'ru_komi.json') ]).then(([enru, rukomi])=>{
      // Build EN->Komi pairs where path exists
      function norm(s){ return (s||'').toLowerCase().strip?.() || (s||'').lower?.() || (''+s).lower?.() }
      const pairs=[];
      for(const [en, ru] of Object.entries(enru)){
        const km = rukomi[ru];
        if(km){ pairs.push([en, km]); }
      }
      // Take up to 10 pairs
      const pool = pairs.slice(0, 12);
      function shuffle(a){ const x=a.slice(); for(let i=x.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [x[i],x[j]]=[x[j],x[i]];} return x; }
      function render(){
        grid.innerHTML=''; hint.textContent='Find matching pairs';
        const cards=[]; pool.forEach(([en,km])=>{ cards.push({text:en, pair:km, lang:'en'}); cards.push({text:km, pair:en, lang:'km'}); });
        const deck = shuffle(cards);
        let open=[]; let solved=0;
        deck.forEach((c,idx)=>{
          const b=document.createElement('button'); b.className='komi-btn'; b.style.minHeight='56px'; b.textContent='?'; b.dataset.text=c.text; b.dataset.pair=c.pair;
          b.addEventListener('click',()=>{
            if(b.classList.contains('done') || b.classList.contains('open')) return;
            b.classList.add('open'); b.textContent=c.text;
            open.push(b);
            if(open.length===2){
              const [a1,a2]=open; if(a1.dataset.text===a2.dataset.pair || a2.dataset.text===a1.dataset.pair){ a1.classList.add('done'); a2.classList.add('done'); solved+=1; hint.textContent=`Solved: ${solved}/${pool.length}`; if(solved===pool.length) hint.textContent='All pairs matched!'; }
              setTimeout(()=>{ open.forEach(x=>{ if(!x.classList.contains('done')){ x.classList.remove('open'); x.textContent='?'; } }); open=[]; }, 650);
            }
          });
          grid.appendChild(b);
        });
      }
      render(); el.querySelector('.again').addEventListener('click', render);
    });
  }
  window.KomiMemory = { mount };
})();