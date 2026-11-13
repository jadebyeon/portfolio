const cards=[...document.querySelectorAll('.deck img')],button=document.querySelector('#pause'),reduced=matchMedia('(prefers-reduced-motion: reduce)');let paused=reduced.matches,visible=true,index=0,time=0,last=0;
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t)},mix=(a,b,t)=>a+(b-a)*t;
const poses=[{x:0,y:20,r:0,s:1},{x:-15,y:0,r:-8,s:.97},{x:12,y:-20,r:5,s:.94},{x:0,y:-35,r:-2,s:.91}];
function blend(a,b,t){return{x:mix(a.x,b.x,t),y:mix(a.y,b.y,t),r:mix(a.r,b.r,t),s:mix(a.s,b.s,t)}}
const exits=[
 {x:-.55,y:-30,r:-17,s:1.02},
 {x:.55,y:12,r:15,s:1.01},
 {x:-.42,y:65,r:11,s:.98},
 {x:.48,y:-65,r:-12,s:1.02}
];
function render(){const progress=Math.max(0,Math.min(1,(time-1100)/1000)),advance=smooth(progress);
 cards.forEach((card,i)=>{const rank=(i-index+4)%4;let pose,z;
 if(rank===0){
  // Move clear of the stack before passing behind it; the artwork never fades.
  const exit=exits[i];
  const side={...exit,x:card.clientWidth*exit.x};
  if(progress<.48){pose=blend(poses[0],side,smooth(progress/.48));z=5}
  else{pose=blend(side,poses[3],smooth((progress-.48)/.52));z=0}
 }else{pose=blend(poses[rank],poses[rank-1],advance);z=4-rank}
 card.style.zIndex=z;card.style.transform=`translate(${pose.x}px,${pose.y}px) rotate(${pose.r}deg) scale(${pose.s})`;card.style.opacity='1';
 });
}
function label(){button.firstElementChild.textContent=paused?'▷':'Ⅱ';button.setAttribute('aria-label',paused?'Play animation':'Pause animation');button.setAttribute('aria-pressed',String(paused))}button.onclick=()=>{paused=!paused;label()};reduced.addEventListener('change',()=>{paused=reduced.matches;label()});new IntersectionObserver(e=>visible=e[0].isIntersecting).observe(document.querySelector('main'));
function frame(now){const delta=Math.min(50,now-(last||now));last=now;if(!paused&&visible&&!document.hidden){time+=delta;if(time>=2100){index=(index+1)%4;time=0}render()}}render();label();window.wearbyMotion(frame,()=>!paused);
