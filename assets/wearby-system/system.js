const q=s=>document.querySelector(s),all=s=>[...document.querySelectorAll(s)];
const reduced=matchMedia('(prefers-reduced-motion: reduce)');let paused=reduced.matches,visible=true,tick=0,manualUntil=0;
const pause=q('#motion');
function syncPause(){document.body.classList.toggle('paused',paused);pause.firstElementChild.textContent=paused?'▷':'Ⅱ';pause.setAttribute('aria-label',paused?'Play animation':'Pause animation');pause.setAttribute('aria-pressed',String(paused));}
pause.onclick=()=>{paused=!paused;syncPause()};reduced.addEventListener('change',e=>{paused=e.matches;syncPause()});syncPause();
let navIndex=0,navAnimation=null;
function nav(n){
 const pill=q('.nav-pill'),w=pill.offsetWidth;
 const current=pill.getBoundingClientRect(),container=pill.parentElement.getBoundingClientRect();
 const from={left:current.left-container.left-7,width:current.width};
 const to={left:n*w,width:w};
 navAnimation?.cancel();pill.style.transform=`translateX(${to.left}px)`;
 if(!reduced.matches&&n!==navIndex){
  const left=Math.min(from.left,to.left),right=Math.max(from.left+from.width,to.left+to.width);
  navAnimation=pill.animate([
   {transform:`translateX(${from.left}px) scaleY(1)`,width:`${from.width}px`,easing:'cubic-bezier(0.3,0,0.2,1)'},
   {transform:`translateX(${left}px) scaleY(.92)`,width:`${right-left}px`,offset:.34,easing:'cubic-bezier(0.3,1.12,0.6,1)'},
   {transform:`translateX(${to.left}px) scaleY(1)`,width:`${w}px`}
  ],{duration:400});
 }
 navIndex=n;all('nav button').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===n)));
}
new ResizeObserver(()=>{navAnimation?.cancel();q('.nav-pill').style.transform=`translateX(${navIndex*100}%)`}).observe(q('nav'));
all('nav button').forEach((b,i)=>b.onclick=()=>nav(i));
q('.touch-target').onclick=()=>{const button=q('.touch-target');button.setAttribute('aria-pressed',String(button.getAttribute('aria-pressed')!=='true'))};
q('.board').addEventListener('pointerdown',()=>manualUntil=Date.now()+12000);q('.board').addEventListener('focusin',()=>manualUntil=Date.now()+12000);
new IntersectionObserver(entries=>{visible=entries[0].isIntersecting}).observe(q('.board'));
setInterval(()=>{if(paused||!visible||document.hidden||Date.now()<manualUntil||q('.board').contains(document.activeElement))return;tick++;nav(tick%4);},2200);
