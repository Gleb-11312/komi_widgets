
;(function(){
  async function probe(url){
    try{ const r = await fetch(url, {method:'HEAD'}); return r.ok; }catch(e){ return false; }
  }
  function speakSynth(text){
    try{
      if('speechSynthesis' in window){
        const u = new SpeechSynthesisUtterance(text);
        u.rate = 0.95;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(u);
        return true;
      }
    }catch(e){}
    return false;
  }
  async function speak(text, opts){
    const base = opts?.audioBaseUrl || './audio/';
    const slug = text.trim().toLowerCase().replace(/\s+/g,'_').replace(/[^\w\u0400-\u04FF_]/g,'');
    const candidate = base + slug + '.mp3';
    // try explicit map first
    let map = null;
    try { map = opts?.audioMap || null; } catch(e){}
    if(map && map[text]){
      const url = base + map[text];
      if(await probe(url)){
        const a = new Audio(url); a.play(); return true;
      }
    }
    // then by slug
    if(await probe(candidate)){
      const a = new Audio(candidate); a.play(); return true;
    }
    // fallback
    return speakSynth(text);
  }
  window.KomiTTS = { speak };
})();
