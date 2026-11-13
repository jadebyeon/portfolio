// Match Wearby's confirmation celebration, driven by the outfit timeline so
// pause, reduced motion, and offscreen suspension also freeze every paper piece.
const confettiLayer=document.createElement('div');confettiLayer.className='confetti';confettiLayer.setAttribute('aria-hidden','true');document.body.append(confettiLayer);
let confettiAnimations=[];
function prepareConfetti(){
 confettiAnimations.forEach(a=>a.cancel());confettiLayer.replaceChildren();confettiAnimations=[];
 const colors=['#A38CE0','#F0CF55','#89AA91','#F2BE9B','#C7B9E9'];
 for(let i=0;i<52;i++){
  const piece=document.createElement('span');piece.className='confetti-piece';
  const width=6+Math.random()*6,height=12+Math.random()*10;
  Object.assign(piece.style,{left:8+Math.random()*84+'%',width:width+'px',height:height+'px',background:colors[i%colors.length],backfaceVisibility:'visible'});confettiLayer.append(piece);
  const start=Math.random()*360,direction=Math.random()>.5?1:-1,spin=direction*(160+Math.random()*280);
  const amplitude=18+Math.random()*28,phase=Math.random()*Math.PI*2,drift=(Math.random()-.5)*70,turns=1+Math.random();
  const frames=Array.from({length:25},(_,step)=>{
   const t=step/24,x=drift*t+amplitude*(Math.sin(phase+t*Math.PI*2*turns)-Math.sin(phase));
   const y=(innerHeight*1.18+height)*t;
   return{offset:t,opacity:t>.9?(1-t)/.1:1,transform:`perspective(400px) translate3d(${x}px,${y}px,0) rotateZ(${start+spin*t}deg) rotateY(${direction*t*720}deg) rotateX(${Math.sin(t*Math.PI*4+phase)*35}deg)`};
  });
  const a=piece.animate(frames,{delay:Math.random()*750,duration:3200+Math.random()*1200,easing:'linear',fill:'forwards'});
  a.pause();a.currentTime=0;confettiAnimations.push(a);
 }

}
function renderConfetti(){
 const time=elapsed-4650;confettiLayer.hidden=time<0||time>5200||reduce.matches;
 confettiAnimations.forEach(a=>a.currentTime=Math.max(0,time));
}
function fitTile(){document.documentElement.style.setProperty('--tile-scale',Math.min(1,(innerWidth-32)/360,(innerHeight-32)/420))}fitTile();window.addEventListener('resize',fitTile);
const outfits=[{name:'01 / Everyday',top:['tee-black',{left:5.5,top:31.1,width:89}],bottom:['jeans-blue',{left:26.4,top:54.7,width:48}],shoes:['sneakers-white',{left:20.5,bottom:.4,width:59}],face:['glasses-sunblack',{left:5,top:17.4,width:90}]},{name:'02 / Off duty',top:['hoodie-gray',{left:1.3,top:30.2,width:97.4}],bottom:['skirt-black',{left:26.4,top:54.7,width:48}],shoes:['boots-black',{left:18.5,bottom:0,width:63}],face:['glasses-sunwhite',{left:5,top:17.4,width:90}]}];
const slots=['bottom','top','shoes','face'],reduce=matchMedia('(prefers-reduced-motion: reduce)'),pause=document.querySelector('#pause');let paused=reduce.matches,visible=true,elapsed=0,last=0,look=0,animations=[],ready=false,version=0;
function label(){pause.firstElementChild.textContent=paused?'▷':'Ⅱ';pause.setAttribute('aria-label',paused?'Play animation':'Pause animation');pause.setAttribute('aria-pressed',String(paused))}label();pause.onclick=()=>{paused=!paused;label()};
async function prepare(){const token=++version;ready=false;animations.forEach(a=>a.cancel());animations=[];const outfit=outfits[look];prepareConfetti();
 await Promise.all(slots.map(async slot=>{const card=document.querySelector(`.card.${slot}`),img=document.querySelector(`.garment[data-slot="${slot}"]`),[name,p]=outfit[slot];card.classList.remove('applied','dealing');card.style.visibility='visible';card.setAttribute('aria-label',`Apply ${name.replaceAll('-',' ')}`);card.querySelector('img').src=name+'.png';img.src=name+'.png';img.style.cssText='';for(const key of ['left','top','bottom','width'])if(p[key]!=null)img.style[key]=p[key]+'%';img.style.zIndex={bottom:3,top:4,shoes:2,face:6}[slot];card.style.zIndex=String(4-slots.indexOf(slot));card.querySelector('img').style.width=(document.querySelector('.ear').offsetWidth*p.width/100*1.3)+'px';await Promise.all([img.decode(),card.querySelector('img').decode()])}));
 if(token!==version)return;
 slots.forEach((slot,i)=>{
 const img=document.querySelector(`.garment[data-slot="${slot}"]`),sourceImage=document.querySelector(`.card.${slot} img`),source=sourceImage.getBoundingClientRect(),target=img.getBoundingClientRect();
 const stageScale=document.querySelector('.stage').getBoundingClientRect().width/360;
 const dx=(source.x+source.width/2-target.x-target.width/2)/stageScale,dy=(source.y+source.height/2-target.y-target.height/2)/stageScale,scale=source.width/target.width;
 const rotation={bottom:-10,top:-17,shoes:10,face:16}[slot];
 const a=img.animate([
 {transform:`translate(${dx}px,${dy}px) scale(${scale}) rotate(${rotation}deg)`,offset:0},
 {transform:'translate(0,0) scale(1)',offset:1}
 ],{duration:1050,fill:'both',easing:'cubic-bezier(.22,1,.36,1)'});
 a.pause();a.currentTime=0;animations.push(a);
 });elapsed=reduce.matches?5000:(paused?300:0);ready=true;render();window.dispatchEvent(new Event("wearby-motion-change"))
}
function render(){
 const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t)};
 const opacity=elapsed>10100?1-smooth((elapsed-10100)/600):smooth(elapsed/550);
 document.querySelector('.stage').style.opacity=1;renderConfetti();
 animations.forEach((a,i)=>{
 const started=elapsed>=750+i*950,t=Math.max(0,Math.min(1050,elapsed-750-i*950));a.currentTime=t;
 const card=document.querySelector(`.card.${slots[i]}`),img=document.querySelector(`.garment[data-slot="${slots[i]}"]`);
 // One visible copy: transfer the artwork from its source to the character layer.
 card.style.visibility=started?'hidden':'visible';
 card.style.setProperty('opacity',String(opacity),'important');
 img.style.opacity=started?String(opacity):'0';
 });
}

function next(){look=0;prepare()}
slots.forEach((slot,i)=>document.querySelector(`.card.${slot}`).onclick=()=>{elapsed=750+i*950+1050;render()});
new IntersectionObserver(e=>visible=e[0].isIntersecting).observe(document.querySelector('.stage'));
reduce.addEventListener('change',()=>{paused=reduce.matches;label();prepare()});let resizeTimer;window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(prepare,150)});
function frame(now){const dt=Math.min(40,now-(last||now));last=now;if(ready&&!paused&&visible&&!document.hidden){elapsed+=dt;render();if(elapsed>10700)next()}}prepare();window.wearbyMotion(frame,()=>ready&&!paused);
