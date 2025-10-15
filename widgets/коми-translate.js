
;(function(){
  async function j(u){ const r=await fetch(u); return r.json(); }
  const norm=s=>s.toLowerCase().replace(/[.,!?;:()"“”']/g,' ').replace(/\s+/g,' ').trim();
  const toks=s=>norm(s).split(' ').filter(Boolean);
  function mapLongest(tokens,dict,n=4){
    const out=[],unk=[]; let i=0;
    while(i<tokens.length){
      let hit=null,k=0;
      for(let m=Math.min(n,tokens.length-i); m>=1; m--){
        const p=tokens.slice(i,i+m).join(' ');
        if(dict[p]!==undefined){hit=dict[p];k=m;break;}
      }
      if(hit!==null){out.push(hit);i+=k;} else {out.push({__u:tokens[i]});unk.push(tokens[i]);i++;}
    } return {out,unk};
  }
  const dgs=[["sh","ш"],["ch","ч"],["zh","ж"],["kh","х"],["ts","ц"],["ya","я"],["yu","ю"],["yo","йо"],["ye","е"]];
  const map={"a":"а","b":"б","c":"к","d":"д","e":"е","f":"ф","g":"г","h":"х","i":"и","j":"дж","k":"к","l":"л","m":"м","n":"н","o":"о","p":"п","q":"к","r":"р","s":"с","t":"т","u":"у","v":"в","w":"в","x":"кс","y":"ы","z":"з","-":"-","'":"’"," ":" "};
  function translit(en){ let s=en.toLowerCase(); for(const [a,b] of dgs){ s=s.replaceAll(a,b) } let o=\"\"; for(const ch of s){ o+=map[ch]??ch } return o; }
  function finalize(ch){ const p=[]; for(const c of ch){ if(typeof c==='string') p.push(c); else if(c&&c.__u) p.push(translit(c.__u)); } return p.join(' ').replace(/\s+/g,' ').trim(); }
  async function mount(target,opts){
    const el=(typeof target==='string')?document.querySelector(target):target; if(!el) return;
    const base=opts?.dataBaseUrl||'./data/'; const dict=await j(base+'dictionary.json');
    el.innerHTML=`<div class="komi-card">
      <div class="komи-title">English → Komi Translator (beta)</div>
      <div class="komи-sub">Type a word or a short phrase in English. This translator returns Komi text.</div>
      <textarea class="src коми-txt" rows="3" placeholder="Type here..."></textarea>
      <div class="коми-row" style="margin-top:.6rem">
        <button class="do коми-btn primary">Translate</button>
        <span class="hint badge">ready</span>
      </div>
      <div class="коми-result out"></div>`;
    const $src=el.querySelector('.src'), $out=el.querySelector('.out'), $hint=el.querySelector('.hint');
    function tr(){ const t=$src.value||''; const {out,unk}=mapLongest(toks(t),dict,4); $out.textContent=finalize(out); $hint.textContent=unk.length?('Unknown: '+[...new Set(unk)].join(', ')):'OK'; }
    el.querySelector('.do').addEventListener('click',tr);
    $src.addEventListener('keydown',e=>{ if(e.key==='Enter'&&(e.metaKey||e.ctrlKey)) tr(); });
  }
  window.KomiTranslator={mount};
})();