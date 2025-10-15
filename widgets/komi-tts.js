
;(function(){
  async function pickVoice(){
    return new Promise(resolve=>{
      const pick = () => {
        const voices = window.speechSynthesis.getVoices() || [];
        // Prefer Slavic/European voices that read Cyrillic better
        const preferred = voices.find(v=>/ru|uk|bg|sr|pl|cs/i.test(v.lang||"")) || voices.find(v=>/en/i.test(v.lang||""));
        resolve(preferred || null);
      };
      const v = window.speechSynthesis.getVoices();
      if(v && v.length){ pick(); }
      else { window.speechSynthesis.onvoiceschanged = pick; }
    });
  }
  async function speak(text){
    // try audio file first
    const slug = text.trim().toLowerCase().replace(/\s+/g,'_').replace(/[^\w\u0400-\u04FF_]/g,'');
    if (window.KomiAudio && await window.KomiAudio.play(slug)) return true;
    if(!('speechSynthesis' in window)) return false;
    const voice = await pickVoice();
    const u = new SpeechSynthesisUtterance(text);
    if(voice) u.voice = voice;
    u.rate = 0.95; u.pitch = 1.05;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
    return true;
  }
  async function preloadAudioMap(base, map){
    window.KomiAudio = {
      async play(slug){
        try{
          const file = Object.values(map||{}).find(n=>n.startsWith(slug)) || (slug+'.mp3');
          const url = (base||'./audio/') + file;
          const res = await fetch(url, {method:'HEAD'});
          if(!res.ok) return false;
          const a = new Audio(url); a.play(); return true;
        }catch(e){ return false; }
      }
    };
  }
  window.KomiTTS = { speak, preloadAudioMap };
})();
