
;(function(){
  async function j(u){ const r=await fetch(u); return r.json(); }
  function shuffle(a){ const x=a.slice(); for(let i=x.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [x[i],x[j]]=[x[j],x[i]]; } return x; }
  function mount(target, opts){
    const el=(typeof target==='string')?document.querySelector(target):target; if(!el) return;
    const base=(opts?.widgetsBaseUrl||'./widgets/');
    el.innerHTML = `<link rel="stylesheet" href="${base+'komi-theme.css'}"/><div class="komi-card fade-in">
      <b>Scramble (unscramble Komi word)</b>
      <div class="word komi-muted" style="margin:.4rem 0"></div>
      <div class="letters" style="display:flex;gap:.4rem;flex-wrap:wrap"></div>
      <div class="answer komi-result" style="margin-top:.5rem"></div>
      <div class="komi-row" style="margin-top:.5rem">
        <button class="check komi-btn primary">Check</button>
        <button class="next komi-btn">Next</button>
        <span class="hint komi-muted"></span>
      </div></div>`;
    const $w=el.querySelector('.word'), $let=el.querySelector('.letters'), $ans=el.querySelector('.answer'), $hint=el.querySelector('.hint');
    let current=null;
    function setWord(w){
      current=w; $w.textContent = 'Arrange letters to form a Komi word';
      $ans.textContent=''; $let.innerHTML='';
      shuffle(w.split('')).forEach(ch=>{ const b=document.createElement('button'); b.className='komi-btn'; b.textContent=ch;
        b.addEventListener('click',()=>{ $ans.textContent=($ans.textContent||'')+ch; }); $let.appendChild(b); });
    }
    function next(words){ const w = words[Math.floor(Math.random()*words.length)]; setWord(w); }
    j((opts?.dataBaseUrl||'./data/')+'games_words.json').then(words=>{ next(words); el.querySelector('.next').addEventListener('click',()=>next(words)); el.querySelector('.check').addEventListener('click',()=>{ if(($ans.textContent||'').trim()===current){ $hint.textContent='Correct!'; } else { $hint.textContent='Try again'; } }); });
  }
  window.KomiScramble = { mount };
})();