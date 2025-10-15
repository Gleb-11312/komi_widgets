
;(function(){
  const SCRIPT = [
    { user:"Say hello", bot:"Видза оланыд!" },
    { user:"Casual hi", bot:"Чолӧн!" },
    { user:"Good morning", bot:"Бур асыва!" },
    { user:"How are you?", bot:"Йӧна! А тэ кыдзи?" },
    { user:"Thank you", bot:"Бурай!" }
  ];
  function mount(target, opts){
    const el=(typeof target==='string')?document.querySelector(target):target; if(!el) return;
    const base=(opts?.widgetsBaseUrl||'./widgets/');
    el.innerHTML = `<link rel="stylesheet" href="${base+'komi-theme.css'}"/>
    <div class="komi-card fade-in">
      <div style="display:flex;align-items:center;gap:.6rem;margin-bottom:.4rem">
        <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#10b981,#2563eb)"></div>
        <div><b>Komi Assistant</b><div class="komi-muted" style="font-size:.85em">Scripted A1 demo • can translate & speak simple phrases • in development</div></div>
      </div>
      <div class="log" style="display:grid;gap:.5rem;max-height:260px;overflow:auto;background:#f2f8ff;border-radius:12px;padding:8px;margin-bottom:.5rem"></div>
      <div class="actions" style="display:flex;flex-wrap:wrap;gap:.5rem"></div>
    </div>`;
    const $log=el.querySelector('.log'), $act=el.querySelector('.actions');
    function push(role,text){
      const row=document.createElement('div'); row.style.display='flex'; row.style.justifyContent= role==='user'?'flex-end':'flex-start';
      const b=document.createElement('div'); b.textContent=text; b.className='komi-btn'; b.style.background= role==='user'?'#d1fae5':'#fff';
      row.appendChild(b); $log.appendChild(row); $log.scrollTop=$log.scrollHeight;
    }
    push('bot',"Hello! I can translate and speak short Komi phrases. I'm still in development.");
    SCRIPT.forEach(s=>{
      const b=document.createElement('button'); b.className='komi-btn'; b.textContent=s.user;
      b.addEventListener('click', async ()=>{ push('user', s.user); setTimeout(async ()=>{ push('bot', s.bot); if(window.KomiTTS) await window.KomiTTS.speak(s.bot); }, 350); });
      $act.appendChild(b);
    });
  }
  window.KomiAssistant = { mount };
})();