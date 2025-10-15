
;(function(){
  const SPECIALS = ["І","і","Ӧ","ӧ","Ӵ","ӵ"];
  function createIME(targetSelector){
    const root = document.querySelector(targetSelector);
    if(!root) return;
    root.innerHTML = `
      <div class="komi-ime">
        <div class="komi-ime-toolbar" style="display:flex;gap:.5rem;flex-wrap:wrap;margin-bottom:.5rem">
          <button data-char="І" class="kbtn">І</button>
          <button data-char="і" class="kbtn">і</button>
          <button data-char="Ӧ" class="kbtn">Ӧ</button>
          <button data-char="ӧ" class="kbtn">ӧ</button>
          <button data-char="Ӵ" class="kbtn">Ӵ</button>
          <button data-char="ӵ" class="kbtn">ӵ</button>
          <span style="opacity:.7">Кликните символ для вставки в активное поле ввода</span>
        </div>
      </div>
    `;
    root.querySelectorAll('.kbtn').forEach(btn=>{
      btn.style.padding = '.4rem .6rem';
      btn.style.borderRadius = '10px';
      btn.style.border = '1px solid #ccc';
      btn.style.cursor = 'pointer';
      btn.addEventListener('click', ()=>{
        const ch = btn.getAttribute('data-char');
        const el = document.activeElement;
        if(el && (el.tagName==='INPUT' || el.tagName==='TEXTAREA' || el.isContentEditable)){
          const start = el.selectionStart || 0;
          const end = el.selectionEnd || 0;
          const val = el.value || el.textContent || "";
          const next = val.slice(0,start) + ch + val.slice(end);
          if('value' in el){ el.value = next; }
          else { el.textContent = next; }
          if(el.setSelectionRange) el.setSelectionRange(start+ch.length,start+ch.length);
          el.dispatchEvent(new Event('input', {bubbles:true}));
          el.focus();
        }
      });
    });
  }
  window.KomiIME = { mount: createIME };
})();
