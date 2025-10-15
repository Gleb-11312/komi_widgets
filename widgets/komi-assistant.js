
;(function(){
  const SCRIPT = [
    { user: "Поздоровайся", bot: "Салют! Ме нöм Коми‑ассистент." },
    { user: "Как дела?", bot: "Йӧна! А тэ кыдзи?" },
    { user: "Я учусь коми языку", bot: "Бура! Коми кыв — йӧн. Видзöд, если нуöн помог." }
  ];
  function mountAssistant(targetSelector){
    const el = document.querySelector(targetSelector);
    if(!el) return;
    el.innerHTML = `
      <div class="komi-assistant" style="border:1px solid #e5e7eb;border-radius:16px;padding:12px;display:grid;gap:.75rem">
        <div style="display:flex;align-items:center;gap:.6rem">
          <div style="width:32px;height:32px;border-radius:50%;background:#111"></div>
          <div><b>Коми‑ассистент (демо)</b><div style="font-size:.85em;opacity:.7">A1‑уровень, сценарные ответы</div></div>
        </div>
        <div class="log" style="display:grid;gap:.5rem;max-height:260px;overflow:auto;background:#fafafa;border-radius:12px;padding:8px"></div>
        <div class="actions" style="display:flex;flex-wrap:wrap;gap:.5rem"></div>
      </div>
    `;
    const $log = el.querySelector('.log');
    const $actions = el.querySelector('.actions');
    function push(role, text){
      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.justifyContent = role==='user' ? 'flex-end':'flex-start';
      const bubble = document.createElement('div');
      bubble.textContent = text;
      bubble.style.padding = '.5rem .7rem';
      bubble.style.borderRadius = '14px';
      bubble.style.maxWidth = '80%';
      bubble.style.background = role==='user' ? '#dbeafe' : '#e5e7eb';
      row.appendChild(bubble);
      $log.appendChild(row);
      $log.scrollTop = $log.scrollHeight;
    }
    SCRIPT.forEach(s=>{
      const b = document.createElement('button');
      b.textContent = s.user;
      b.style.padding = '.5rem .8rem';
      b.style.borderRadius='12px';
      b.style.border='1px solid #ccc';
      b.style.cursor='pointer';
      b.addEventListener('click', ()=>{
        push('user', s.user);
        setTimeout(()=>{
          push('bot', s.bot);
          if(window.KomiTTS) window.KomiTTS.speak(s.bot);
        }, 500);
      });
      $actions.appendChild(b);
    });
    // Greeting
    push('bot', 'Салют! Тадзи помога кытчöдны Коми кыв.');
  }
  window.KomiAssistant = { mount: mountAssistant };
})();
