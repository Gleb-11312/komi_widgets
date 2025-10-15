
;(function(){
  function speak(text){
    try {
      if ('speechSynthesis' in window) {
        const u = new SpeechSynthesisUtterance(text);
        // don't set voice/language explicitly to avoid missing voices, let browser choose
        u.rate = 0.95;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(u);
        return true;
      }
    } catch(e){}
    return false;
  }
  window.KomiTTS = { speak };
})();
