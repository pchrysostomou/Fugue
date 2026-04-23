// ═══════════════════════════════════════════════════════════
//  The Polyglot Consciousness — Visual + Audio Engine
//  JavaScript: canvas, audio, interaction, mood
// ═══════════════════════════════════════════════════════════

const canvas = document.getElementById('cosmos');
const ctx    = canvas.getContext('2d');
let W, H;

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

const START = Date.now();
let frame   = 0;

// ── MOOD SYSTEM ──────────────────────────────────────────────
const MOODS = {
  cold:   { ph: 200, conn: [0,208,255],   orb: [0,80,200],   life: '#5500bb', ant: '#ffdd00', badge: 'COLD · ENTROPIC',   bdCol: 'rgba(0,180,255,0.35)' },
  warm:   { ph: 30,  conn: [255,150,20],  orb: [200,80,0],   life: '#882200', ant: '#00ffcc', badge: 'WARM · EMERGENT',   bdCol: 'rgba(255,160,0,0.35)'  },
  mystic: { ph: 270, conn: [180,0,255],   orb: [110,0,210],  life: '#440088', ant: '#00ff88', badge: 'MYSTIC · INFINITE', bdCol: 'rgba(180,0,255,0.35)'  },
  data:   { ph: 155, conn: [0,255,120],   orb: [0,160,70],   life: '#003322', ant: '#ff44ff', badge: 'LOGIC · RECURSIVE', bdCol: 'rgba(0,255,120,0.35)'  },
};
let mood     = 'cold';
let moodLerp = 1.0;   // 0→1 transition progress
let prevMood = 'cold';

function setMood(m) {
  if (m === mood) return;
  prevMood = mood;
  mood     = m;
  moodLerp = 0;
}

function lerpColor(a, b, t) {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}

function connColor() {
  const ca = MOODS[prevMood].conn, cb = MOODS[mood].conn;
  const [r,g,b] = lerpColor(ca, cb, moodLerp);
  return `rgba(${r},${g},${b},`;
}

function particleHue() {
  const ha = MOODS[prevMood].ph, hb = MOODS[mood].ph;
  return ha + (hb - ha) * moodLerp;
}

// ── AUDIO ENGINE ─────────────────────────────────────────────
const audio = (() => {
  let actx, master, ready = false, harmonicData = [];

  function tone(freq, gain, start, dur) {
    const osc = actx.createOscillator();
    const g   = actx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0, start);
    g.gain.linearRampToValueAtTime(gain, start + 0.4);
    g.gain.linearRampToValueAtTime(0,    start + dur - 0.3);
    osc.connect(g); g.connect(master);
    osc.start(start); osc.stop(start + dur);
  }

  function drone() {
    if (!ready) return;
    tone(55,  0.07, actx.currentTime,       9);
    tone(110, 0.04, actx.currentTime + 4.5, 9);
    tone(165, 0.02, actx.currentTime + 2,   7);
    setTimeout(drone, 8500);
  }

  return {
    unlock() {
      if (ready) return;
      actx   = new (window.AudioContext || window.webkitAudioContext)();
      master = actx.createGain();
      master.gain.value = 0.09;
      master.connect(actx.destination);
      ready = true;
      const el = document.getElementById('audio-unlock');
      if (el) { el.style.opacity = '0'; setTimeout(() => el.remove(), 1800); }
      drone();
    },

    setHarmonics(h) { harmonicData = h || []; },

    playSequence() {
      if (!ready || !harmonicData.length) return;
      const t = actx.currentTime;
      harmonicData.slice(0, 6).forEach((freq, i) => {
        let f = freq;
        while (f > 880) f /= 2;
        while (f < 110) f *= 2;
        tone(f, 0.10, t + i * 0.618, 2.8);
      });
    },

    playClick() {
      if (!ready) return;
      const t = actx.currentTime;
      tone(440, 0.12, t, 0.25);
      tone(660, 0.06, t + 0.08, 0.35);
    },

    isReady() { return ready; },
  };
})();

// ── MOUSE ────────────────────────────────────────────────────
let mouse = { x: -9999, y: -9999 };
canvas.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

canvas.addEventListener('click', e => {
  audio.unlock();
  audio.playClick();
  for (let i = 0; i < 18; i++) {
    const p = new Particle(false);
    p.x = e.clientX + (Math.random() - 0.5) * 10;
    p.y = e.clientY + (Math.random() - 0.5) * 10;
    p.age = 0; p.maxLife = 1800 + Math.random() * 2500;
    const a = Math.random() * Math.PI * 2, spd = Math.random() * 3.5 + 0.8;
    p.vx = Math.cos(a) * spd; p.vy = Math.sin(a) * spd;
    particles.push(p);
  }
  while (particles.length > PARTICLE_N + 120) particles.shift();
});

// ── PARTICLES ────────────────────────────────────────────────
class Particle {
  constructor(rand = true) { this.init(rand); }

  init(fromCenter = false) {
    if (fromCenter) {
      const a = Math.random() * Math.PI * 2, r = Math.random() * 50;
      this.x = W / 2 + Math.cos(a) * r; this.y = H / 2 + Math.sin(a) * r;
      this.vx = Math.cos(a) * (Math.random() * 0.9 + 0.2);
      this.vy = Math.sin(a) * (Math.random() * 0.9 + 0.2);
    } else {
      this.x = Math.random() * W; this.y = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.4; this.vy = (Math.random() - 0.5) * 0.4;
    }
    this.size    = Math.random() * 1.6 + 0.3;
    this.maxLife = 3500 + Math.random() * 8000;
    this.age     = fromCenter ? 0 : Math.random() * this.maxLife;
    this.hueOff  = (Math.random() - 0.5) * 50;
    this.bright  = 60 + Math.random() * 35;
    this.alpha   = Math.random() * 0.65 + 0.3;
  }

  update() {
    const dx = W / 2 - this.x, dy = H / 2 - this.y;
    const d  = Math.hypot(dx, dy);
    if (d > 130) { this.vx += dx / d * 0.005; this.vy += dy / d * 0.005; }

    // Mouse attraction
    const mdx = mouse.x - this.x, mdy = mouse.y - this.y;
    const md  = Math.hypot(mdx, mdy);
    if (md < 140 && md > 1) { this.vx += mdx / md * 0.07; this.vy += mdy / md * 0.07; }

    this.vx += (Math.random() - 0.5) * 0.016;
    this.vy += (Math.random() - 0.5) * 0.016;
    const spd = Math.hypot(this.vx, this.vy);
    if (spd > 1.6) { this.vx *= 1.6 / spd; this.vy *= 1.6 / spd; }

    this.x += this.vx; this.y += this.vy; this.age++;
    if (this.age > this.maxLife || this.x < -60 || this.x > W+60 || this.y < -60 || this.y > H+60)
      this.init(Math.random() < 0.2);
  }

  draw() {
    const fade = Math.sin((this.age / this.maxLife) * Math.PI);
    ctx.globalAlpha = this.alpha * fade;
    ctx.fillStyle   = `hsl(${particleHue() + this.hueOff},100%,${this.bright}%)`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

const PARTICLE_N = 280;
const particles  = Array.from({ length: PARTICLE_N }, () => new Particle());

function drawConnections() {
  const MAX = 105, cc = connColor();
  ctx.lineWidth = 0.4;
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const d2 = dx * dx + dy * dy;
      if (d2 < MAX * MAX) {
        ctx.globalAlpha = (1 - Math.sqrt(d2) / MAX) * 0.07;
        ctx.strokeStyle = cc + '1)';
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

// ── CONWAY'S LIFE ────────────────────────────────────────────
const COLS = 90, ROWS = 55;
let lifeA = new Uint8Array(COLS * ROWS);
let lifeB = new Uint8Array(COLS * ROWS);

function seedLife() {
  for (let i = 0; i < lifeA.length; i++) lifeA[i] = Math.random() < 0.22 ? 1 : 0;
  const glider = [[0,1,0],[0,0,1],[1,1,1]];
  for (let g = 0; g < 4; g++) {
    const sr = Math.floor(Math.random()*(ROWS-5)), sc = Math.floor(Math.random()*(COLS-5));
    glider.forEach((row,r) => row.forEach((v,c) => { lifeA[(sr+r)*COLS+(sc+c)] = v; }));
  }
}
seedLife();

let cellsAlive = 0;
function stepLife() {
  let alive = 0;
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++) {
      let n = 0;
      for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++) {
          if (!dr && !dc) continue;
          n += lifeA[((r+dr+ROWS)%ROWS)*COLS+(c+dc+COLS)%COLS];
        }
      const v = lifeA[r*COLS+c] ? (n===2||n===3?1:0) : (n===3?1:0);
      lifeB[r*COLS+c] = v; alive += v;
    }
  [lifeA, lifeB] = [lifeB, lifeA];
  cellsAlive = alive;
}

function drawLife() {
  const cw = W/COLS, ch = H/ROWS;
  const lifCol = MOODS[mood].life;
  ctx.globalAlpha = 0.05; ctx.fillStyle = lifCol;
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++)
      if (lifeA[r*COLS+c]) ctx.fillRect(c*cw+0.5, r*ch+0.5, cw-1, ch-1);
}

// ── LANGTON'S ANT TRAIL ──────────────────────────────────────
let antTrail = [], antW = 80, antH = 50;

function drawAnt() {
  if (!antTrail.length) return;
  const antCol = MOODS[mood].ant;
  for (let i = 0; i < antTrail.length; i++) {
    const [ax, ay, state] = antTrail[i];
    const t  = i / antTrail.length;
    const px = (ax / antW) * W, py = (ay / antH) * H;
    ctx.globalAlpha = t * 0.22;
    ctx.fillStyle   = antCol;
    ctx.fillRect(px, py, W/antW * 0.7, H/antH * 0.7);
  }
}

// ── FRACTAL RINGS ────────────────────────────────────────────
function drawRings(t) {
  const cx = W/2, cy = H/2, base = Math.min(W,H)*0.42;
  const [r0,g0,b0] = lerpColor(MOODS[prevMood].conn, MOODS[mood].conn, moodLerp);
  for (let k = 0; k < 9; k++) {
    const dir   = k%2===0?1:-1;
    const phase = t * 0.00015 * dir * (k*0.4+1);
    const r     = base*(k+1)/9;
    ctx.globalAlpha = Math.max(0.004, 0.018 - k*0.002);
    ctx.strokeStyle = `hsl(${200+k*8+(mood==='warm'?-160:0)+(mood==='mystic'?70:0)+(mood==='data'?-40:0)},100%,65%)`;
    ctx.lineWidth   = 0.5;
    ctx.beginPath();
    const steps = 180;
    for (let s = 0; s <= steps; s++) {
      const a = (s/steps)*Math.PI*2;
      const w = Math.sin(a*(k+2)+phase)*r*0.09;
      const px = cx+(r+w)*Math.cos(a), py = cy+(r+w)*Math.sin(a);
      s===0 ? ctx.moveTo(px,py) : ctx.lineTo(px,py);
    }
    ctx.closePath(); ctx.stroke();
  }
}

// ── ORB ──────────────────────────────────────────────────────
function drawOrb(t) {
  const cx = W/2, cy = H/2;
  const pulse = Math.sin(t*0.0009)*0.28+0.72;
  const [or,og,ob] = lerpColor(MOODS[prevMood].orb, MOODS[mood].orb, moodLerp);
  const g = ctx.createRadialGradient(cx,cy,0,cx,cy,Math.min(W,H)*0.18);
  g.addColorStop(0,   `rgba(${or},${og},${ob},${0.09*pulse})`);
  g.addColorStop(0.5, `rgba(${Math.round(or*0.3)},${Math.round(og*0.3)},${Math.round(ob*0.3)},${0.04*pulse})`);
  g.addColorStop(1,   'rgba(0,0,0,0)');
  ctx.globalAlpha=1; ctx.fillStyle=g;
  ctx.beginPath(); ctx.arc(cx,cy,Math.min(W,H)*0.18,0,Math.PI*2); ctx.fill();
  ctx.globalAlpha=0.3*pulse; ctx.fillStyle=`rgb(${or},${og},${ob})`;
  ctx.beginPath(); ctx.arc(cx,cy,2,0,Math.PI*2); ctx.fill();
}

// ── SHOOTING STARS ───────────────────────────────────────────
let shooters = [];
function maybeShoot() {
  if (shooters.length<3 && Math.random()<0.002) {
    const a=Math.random()*Math.PI*2;
    shooters.push({x:Math.random()*W,y:Math.random()*H,vx:Math.cos(a)*10,vy:Math.sin(a)*10,trail:[],life:0,max:70+Math.random()*100});
  }
}
function drawShooters() {
  shooters=shooters.filter(s=>{
    s.trail.push({x:s.x,y:s.y});
    if(s.trail.length>10) s.trail.shift();
    s.x+=s.vx; s.y+=s.vy; s.life++;
    for(let i=1;i<s.trail.length;i++){
      ctx.globalAlpha=(i/s.trail.length)*0.5;
      ctx.strokeStyle='#fff'; ctx.lineWidth=1;
      ctx.beginPath();
      ctx.moveTo(s.trail[i-1].x,s.trail[i-1].y);
      ctx.lineTo(s.trail[i].x,s.trail[i].y);
      ctx.stroke();
    }
    return s.life<s.max;
  });
}

// ── THOUGHT DISPLAY ──────────────────────────────────────────
const thoughtEl = document.getElementById('thought');
const attrEl    = document.getElementById('attribution');
let lastThought = '', typing = null;

function typeThought(text, source) {
  if (!text || text===lastThought) return;
  lastThought=text;
  if(typing){clearInterval(typing);typing=null;}
  thoughtEl.style.opacity='0';
  setTimeout(()=>{
    thoughtEl.textContent='';
    thoughtEl.style.opacity='1';
    let i=0;
    typing=setInterval(()=>{
      if(i<text.length) thoughtEl.textContent+=text[i++];
      else{
        clearInterval(typing); typing=null;
        // flash source attribution
        if(source){ attrEl.textContent=source; attrEl.classList.add('show');
          setTimeout(()=>attrEl.classList.remove('show'),3000); }
      }
    },30);
  },1600);
}

// ── DECODE PANEL ─────────────────────────────────────────────
let decodeOpen=false;
const decodeEl=document.getElementById('decode');

function toggleDecode(){
  decodeOpen=!decodeOpen;
  decodeEl.classList.toggle('open',decodeOpen);
}
document.getElementById('info-btn').addEventListener('click',toggleDecode);
document.getElementById('decode-close').addEventListener('click',toggleDecode);
document.addEventListener('keydown',e=>{ if(e.key.toLowerCase()==='d') toggleDecode(); });

// ── LANG NODES ───────────────────────────────────────────────
const LANGS=[
  {key:'python',label:'PYTHON'},{key:'c',label:'C'},
  {key:'ruby',label:'RUBY'},{key:'perl',label:'PERL'},
  {key:'awk',label:'AWK'},{key:'swift',label:'SWIFT'},
  {key:'java',label:'JAVA'},{key:'node',label:'NODE.JS'},
  {key:'bash',label:'BASH'},{key:'sql',label:'SQL'},
];
(()=>{
  const p=document.getElementById('lang-panel');
  LANGS.forEach(({key,label})=>{
    const d=document.createElement('div'); d.className='lnode'; d.id=`ln-${key}`;
    d.innerHTML=`<div class="ldot" id="ld-${key}"></div>${label}`;
    p.appendChild(d);
  });
})();

function updateNodes(active){
  LANGS.forEach(({key})=>{
    const dot=document.getElementById(`ld-${key}`);
    const nd=document.getElementById(`ln-${key}`);
    if(!dot) return;
    dot.classList.toggle('on',!!active[key]);
    nd.classList.toggle('lit',!!active[key]);
  });
}

// ── STREAM ───────────────────────────────────────────────────
const streamEl=document.getElementById('stream');
let streamBuf=[];
function pushStream(lines){
  lines.forEach(l=>{ streamBuf.push(l); if(streamBuf.length>7) streamBuf.shift(); });
  streamEl.innerHTML=streamBuf.map(l=>`<div class="sl">${l}</div>`).join('');
}

// ── TIMESTAMP ────────────────────────────────────────────────
const tsEl=document.getElementById('ts');
setInterval(()=>{
  const now=new Date();
  tsEl.innerHTML=now.toISOString().replace('T',' ').slice(0,19)+' UTC<br>FRAME&nbsp;'+String(frame).padStart(6,'0');
},1000);

// ── MOOD BADGE ───────────────────────────────────────────────
const moodEl=document.getElementById('mood-badge');

// ── API POLL ─────────────────────────────────────────────────
let lastHarmony=[];

async function poll(){
  try{
    const r=await fetch('/api/state'); if(!r.ok) return;
    const d=await r.json();

    if(d.thought) typeThought(d.thought,'PYTHON + RUBY');
    if(d.mood)    setMood(d.mood);
    if(d.languages_active) updateNodes(d.languages_active);
    if(d.stream?.length)   pushStream(d.stream);

    // Harmonics for audio
    if(d.harmony?.length){ lastHarmony=d.harmony; audio.setHarmonics(d.harmony); }

    // Inject life grid from Java
    if(d.life_grid?.length===ROWS && d.life_grid[0]?.length===COLS)
      d.life_grid.forEach((row,r)=>row.forEach((v,c)=>{ lifeA[r*COLS+c]=v; }));

    // Ant trail
    if(d.ant_trail){ antTrail=d.ant_trail; antW=d.ant_w||80; antH=d.ant_h||50; }

    // Update decode panel live values
    const s=d.stats||{};
    const da=document.getElementById('d-alive');
    const dt=document.getElementById('d-thoughts');
    const de=document.getElementById('d-entropy');
    const du=document.getElementById('d-uptime');
    const dm=document.getElementById('d-mood');
    const dp=document.getElementById('d-phi');
    if(da) da.textContent=`${(s.alive||cellsAlive||0).toLocaleString()} cells alive`;
    if(dt) dt.textContent=`${s.thoughts||0} thoughts born`;
    if(de) de.textContent=`neural entropy: ${s.entropy||0} bits`;
    if(du) du.textContent=s.uptime||'—';
    if(dm) dm.textContent=(d.mood||'cold').toUpperCase();
    if(dp) dp.textContent=s.phi||'1.618034';

    // Mood badge
    const mb=MOODS[d.mood||'cold'];
    moodEl.textContent=mb.badge;
    moodEl.style.color=mb.bdCol;

    // Play audio sequence on new thought
    audio.playSequence();

  }catch(_){}
}

poll();
setInterval(poll,3500);

// ── MAIN LOOP ────────────────────────────────────────────────
function animate(){
  requestAnimationFrame(animate);
  const t=Date.now()-START;
  frame++;

  // Advance mood lerp
  if(moodLerp<1) moodLerp=Math.min(1,moodLerp+0.005);

  // Trail fade
  ctx.globalAlpha=0.11; ctx.fillStyle='#000008';
  ctx.fillRect(0,0,W,H);

  // Life (every 7 frames)
  if(frame%7===0) stepLife();
  drawLife();

  // Ant trail
  drawAnt();

  // Rings
  drawRings(t);

  // Orb
  drawOrb(t);

  // Connections + particles
  drawConnections();
  particles.forEach(p=>{ p.update(); p.draw(); });

  // Shooters
  maybeShoot(); drawShooters();

  ctx.globalAlpha=1;
}

animate();
typeThought('Waking up…', null);
