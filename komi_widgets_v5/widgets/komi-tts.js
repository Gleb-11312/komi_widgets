
;(function(){
  async function pickVoice(){
    return new Promise(resolve=>{
      const choose=()=>{
        const v = speechSynthesis.getVoices()||[];
        const pref = v.find(x=>/ru|uk|bg|sr|pl|cs/i.test(x.lang||"")) || v.find(x=>/en/i.test(x.lang||""));
        resolve(pref||null);
      };
      const v = speechSynthesis.getVoices(); if(v && v.length) choose(); else speechSynthesis.onvoiceschanged = choose;
    });
  }
  async function speak(text){ 
    if(window.KomiAudio && await window.KomiAudio.play(text)) return true;
    if(!('speechSynthesis' in window)) return false;
    const u = new SpeechSynthesisUtterance(text); u.rate=0.95; u.pitch=1.05; const voice = await pickVoice(); if(voice) u.voice=voice;
    speechSynthesis.cancel(); speechSynthesis.speak(u); return true;
  }
  async function preloadAudioMap(base, map){
    window.KomiAudio = {
      async play(text){
        const slug = text.trim().toLowerCase().replace(/\s+/g,'_').replace(/[^\w\u0400-\u04FF_]/g,'');
        const explicit = map && map[text];
        const file = explicit || (slug + '.mp3');
        try{
          const url = base + file; const head = await fetch(url, {method:'HEAD'});
          if(!head.ok) return false; const a = new Audio(url); a.play(); return true;
        }catch(e){ return false; }
      }
    };
  }
  window.KomiTTS = { speak, preloadAudioMap };
})();
