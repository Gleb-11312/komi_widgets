
;(function(){
  const SCRIPT = [
    { user: "Поздоровайся", bot: "Салют! Ме нöм Коми-ассистент." },
    { user: "Доброе утро", bot: "Бур асыва!" },
    { user: "Как дела?", bot: "Йӧна! А тэ кыдзи?" }
  ];
  function mount(targetSelector, opts){
    const el=document.querySelector(targetSelector); if(!el) return;
    el.innerHTML = `<link rel="stylesheet" href="${(opts?.widgetsBaseUrl||'./widgets/')+'komi-styles.css'}"/>
    <div class="komi-card">
      <div style="display:flex;align-items:center;gap:.6rem;margin-bottom:.4rem">
        <div style="width:32px;height:32px;border-radius:50%;background:#111"></div>
        <div><b>Коми-ассистент</b><div class="komi-muted" style="font-size:.85em">Сценарные ответы, A1</div></div>
      </div>
      <div class="log" style="display:grid;gap:.5rem;max-height:260px;overflow:auto;background:#f8fafc;border-radius:12px;padding:8px;margin-bottom:.5rem"></div>
      <div class="actions" style="display:flex;flex-wrap:wrap;gap:.5rem"></div>
    </div>`;
    const $log=el.querySelector('.log'), $act=el.querySelector('.actions');
    function push(role,text){
      const row=document.createElement('div'); row.style.display='flex'; row.style.justifyContent= role==='user'?'flex-end':'flex-start';
      const b=document.createElement('div'); b.textContent=text; b.className='komi-btn'; b.style.background= role==='user'?'#dbeafe':'#fff';
      row.appendChild(b); $log.appendChild(row); $log.scrollTop=$log.scrollHeight;
    }
    SCRIPT.forEach(s=>{
      const b=document.createElement('button'); b.className='komi-btn'; b.textContent=s.user;
      b.addEventListener('click', async ()=>{ push('user', s.user); setTimeout(async ()=>{ push('bot', s.bot); if(window.KomiTTS) await window.KomiTTS.speak(s.bot, opts); }, 400); });
      $act.appendChild(b);
    });
    push('bot','Салют! Тадзи помога кытчöдны Коми кыв.');
  }
  window.KomiAssistant = { mount };
})();
