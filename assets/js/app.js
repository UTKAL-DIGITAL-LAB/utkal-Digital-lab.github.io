(() => {

  "use strict";

  const canvas = document.getElementById("digitalCanvas");
  const ctx = canvas.getContext("2d");

  let W = 0;
  let H = 0;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  const mouse = {
    x: -9999,
    y: -9999,
    active: false
  };

  const particles = [];
  const pulses = [];
  const bursts = [];

  const MAX_PARTICLES =
    window.innerWidth < 700 ? 75 : 125;

  const rand = (a,b) =>
    Math.random() * (b-a) + a;



  /* ================= DIGITAL PULSE API ================= */

  window.digitalPulse = function(x, y){

    x = Number.isFinite(x) ? x : W / 2;
    y = Number.isFinite(y) ? y : H / 2;

    pulses.push({
      x,
      y,
      r: 4,
      max: Math.max(W, H) * 0.38,
      alpha: 0.95,
      speed: 8
    });

    bursts.push({
      x,
      y,
      life: 1,
      count: 18
    });

    mouse.x = x;
    mouse.y = y;
    mouse.active = true;
  };


  /* =========================================================
     UDL V5.2 // PARTICLE RECONSTRUCTION ENGINE
     Original futuristic electronic reconstruction system
     ========================================================= */

  const reconstructionObjects = [];
  const reconstructionParticles = [];

  const reconstructionCount =
    window.innerWidth < 700 ? 3 : 5;

  const reconstructionSizes =
    window.innerWidth < 700
      ? ["medium", "big", "small"]
      : ["small", "medium", "medium", "big", "big"];

  function makeReconstructionObject(size, index){

    const scale =
      size === "small" ? 0.65 :
      size === "medium" ? 0.95 : 1.35;

    const count =
      size === "small" ? 18 :
      size === "medium" ? 28 : 42;

    return {
      x: rand(80, Math.max(81, W - 80)),
      y: rand(120, Math.max(121, H - 120)),
      vx: rand(-0.16, 0.16),
      vy: rand(-0.12, 0.12),
      angle: rand(0, Math.PI * 2),
      rotation: rand(-0.0018, 0.0018),
      scale,
      size,
      seed: rand(0, 1000),
      phase: rand(0, Math.PI * 2),
      energy: 0,
      reconstruct: 0,
      cooldown: rand(180, 520),
      count,
      index
    };
  }

  for(let i = 0; i < reconstructionCount; i++){
    reconstructionObjects.push(
      makeReconstructionObject(
        reconstructionSizes[i],
        i
      )
    );
  }

  function createReconstructionParticles(){

    reconstructionParticles.length = 0;

    for(const obj of reconstructionObjects){

      for(let i = 0; i < obj.count; i++){

        const a = rand(0, Math.PI * 2);
        const radius =
          rand(24, 70) * obj.scale;

        reconstructionParticles.push({
          object: obj,
          index: i,
          ox: Math.cos(a) * radius,
          oy: Math.sin(a) * radius * 0.62,
          x: 0,
          y: 0,
          vx: rand(-0.08, 0.08),
          vy: rand(-0.08, 0.08),
          size: rand(0.7, 1.8),
          alpha: rand(0.25, 0.75),
          phase: rand(0, Math.PI * 2)
        });
      }
    }
  }

  createReconstructionParticles();

  function circuitNode(ctx, x, y, r, alpha){

    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);

    ctx.fillStyle =
      `rgba(0,235,255,${alpha})`;

    ctx.fill();

    ctx.beginPath();
    ctx.arc(x, y, r * 2.8, 0, Math.PI * 2);

    ctx.strokeStyle =
      `rgba(0,190,255,${alpha * 0.25})`;

    ctx.lineWidth = 0.7;
    ctx.stroke();
  }

  function drawReconstructionObject(obj, time){

    const wobbleX =
      Math.sin(time * 0.00035 + obj.phase) * 18;

    const wobbleY =
      Math.cos(time * 0.00028 + obj.phase) * 14;

    const cx = obj.x + wobbleX;
    const cy = obj.y + wobbleY;

    obj.angle += obj.rotation;

    ctx.save();

    ctx.translate(cx, cy);
    ctx.rotate(obj.angle);

    const s = obj.scale;

    /*
      3D electronic chassis
    */

    ctx.strokeStyle =
      `rgba(0,180,255,${0.16 + obj.energy * 0.25})`;

    ctx.lineWidth = 1.1;

    ctx.beginPath();

    ctx.moveTo(-58*s, -34*s);
    ctx.lineTo(35*s, -42*s);
    ctx.lineTo(64*s, -8*s);
    ctx.lineTo(48*s, 38*s);
    ctx.lineTo(-38*s, 43*s);
    ctx.lineTo(-62*s, 12*s);
    ctx.closePath();

    ctx.stroke();

    /*
      Internal PCB traces
    */

    const traces = [
      [-45,-20, -15,-20, -2,-8],
      [-38,12, -10,12, 8,28],
      [-10,-30, 12,-30, 28,-12],
      [18,20, 38,20, 48,7],
      [-5,4, 20,4, 35,-10]
    ];

    for(const t of traces){

      ctx.beginPath();

      ctx.moveTo(t[0]*s, t[1]*s);
      ctx.lineTo(t[2]*s, t[3]*s);
      ctx.lineTo(t[4]*s, t[5]*s);

      ctx.strokeStyle =
        `rgba(0,210,255,${0.22 + obj.energy * 0.45})`;

      ctx.stroke();
    }

    /*
      Electronic nodes
    */

    circuitNode(ctx, -45*s, -20*s, 1.8*s, 0.7);
    circuitNode(ctx, -38*s, 12*s, 1.8*s, 0.65);
    circuitNode(ctx, -10*s, -30*s, 1.8*s, 0.65);
    circuitNode(ctx, 18*s, 20*s, 2*s, 0.8);
    circuitNode(ctx, 48*s, 7*s, 2*s, 0.8);

    /*
      Holographic depth layer
    */

    ctx.strokeStyle =
      `rgba(80,220,255,${0.055 + obj.energy * 0.08})`;

    ctx.lineWidth = 0.7;

    ctx.strokeRect(
      -48*s,
      -27*s,
      96*s,
      54*s
    );

    /*
      Reconstruction energy ring
    */

    if(obj.reconstruct > 0){

      ctx.beginPath();

      ctx.arc(
        0,
        0,
        (65 + obj.reconstruct * 18) * s,
        0,
        Math.PI * 2
      );

      ctx.strokeStyle =
        `rgba(0,235,255,${obj.reconstruct * 0.32})`;

      ctx.stroke();
    }

    ctx.restore();
  }

  function updateReconstructionObjects(time){

    for(const obj of reconstructionObjects){

      obj.x += obj.vx;
      obj.y += obj.vy;

      if(obj.x < 50 || obj.x > W - 50)
        obj.vx *= -1;

      if(obj.y < 80 || obj.y > H - 70)
        obj.vy *= -1;

      obj.energy *= 0.965;

      if(obj.cooldown > 0){
        obj.cooldown--;
      }else{

        obj.reconstruct =
          Math.min(1, obj.reconstruct + 0.012);

        if(obj.reconstruct >= 1){

          obj.reconstruct = 0;

          obj.cooldown =
            rand(420, 900);

          obj.energy = 1;
        }
      }
    }

    for(const p of reconstructionParticles){

      const obj = p.object;

      const breathe =
        1 +
        Math.sin(time * 0.001 + p.phase) * 0.035;

      const targetX =
        obj.x +
        p.ox * breathe;

      const targetY =
        obj.y +
        p.oy * breathe;

      const reconstruct =
        obj.reconstruct;

      const scatter =
        reconstruct > 0
          ? reconstruct * 42
          : 0;

      const tx =
        targetX +
        Math.sin(time * 0.0014 + p.phase) * scatter;

      const ty =
        targetY +
        Math.cos(time * 0.0012 + p.phase) * scatter;

      p.x += (tx - p.x) * 0.025;
      p.y += (ty - p.y) * 0.025;

      p.alpha =
        0.22 +
        Math.sin(time * 0.002 + p.phase) * 0.16 +
        obj.energy * 0.45;
    }
  }

  function drawReconstructionParticles(){

    for(const p of reconstructionParticles){

      ctx.beginPath();

      ctx.arc(
        p.x,
        p.y,
        p.size,
        0,
        Math.PI * 2
      );

      ctx.fillStyle =
        `rgba(0,225,255,${Math.max(0.05, p.alpha)})`;

      ctx.fill();
    }
  }

  window.triggerReconstruction = function(x, y){

    let nearest = null;
    let distance = Infinity;

    for(const obj of reconstructionObjects){

      const dx = obj.x - x;
      const dy = obj.y - y;
      const d = Math.sqrt(dx*dx + dy*dy);

      if(d < distance){
        distance = d;
        nearest = obj;
      }
    }

    if(nearest){

      nearest.energy = 1;
      nearest.reconstruct = 1;
      nearest.cooldown = rand(280, 520);

      window.digitalPulse(x, y);
    }
  };

  /* ================= RESIZE ================= */

  function resize(){

    dpr = Math.min(window.devicePixelRatio || 1, 2);

    W = window.innerWidth;
    H = window.innerHeight;

    canvas.width = W * dpr;
    canvas.height = H * dpr;

    canvas.style.width = W + "px";
    canvas.style.height = H + "px";

    ctx.setTransform(dpr,0,0,dpr,0,0);
  }

  resize();

  window.addEventListener("resize", resize);


  /* ================= PARTICLE ================= */

  class Particle {

    constructor(){

      this.x = rand(0,W);
      this.y = rand(0,H);

      this.vx = rand(-.18,.18);
      this.vy = rand(-.18,.18);

      this.size = rand(.6,1.7);
      this.alpha = rand(.25,.8);

      this.life = rand(100,400);
    }

    update(){

      this.x += this.vx;
      this.y += this.vy;

      this.life--;

      if(
        this.x < -20 ||
        this.x > W+20 ||
        this.y < -20 ||
        this.y > H+20 ||
        this.life <= 0
      ){
        this.x = rand(0,W);
        this.y = rand(0,H);
        this.life = rand(150,450);
      }

      /* mouse gravity */

      if(mouse.active){

        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;

        const distance = Math.sqrt(dx*dx + dy*dy);

        if(distance < 150){

          const force =
            (150-distance) / 150;

          this.vx += dx * force * .00035;
          this.vy += dy * force * .00035;

        }

      }

      this.vx *= .995;
      this.vy *= .995;
    }

    draw(){

      ctx.beginPath();

      ctx.arc(
        this.x,
        this.y,
        this.size,
        0,
        Math.PI*2
      );

      ctx.fillStyle =
        `rgba(0,210,255,${this.alpha})`;

      ctx.fill();
    }
  }


  for(let i=0;i<MAX_PARTICLES;i++){
    particles.push(new Particle());
  }


  /* ================= DIGITAL CONNECTIONS ================= */

  function drawConnections(){

    const maxDistance =
      window.innerWidth < 700 ? 95 : 135;

    for(let i=0;i<particles.length;i++){

      const a = particles[i];

      for(let j=i+1;j<particles.length;j++){

        const b = particles[j];

        const dx = a.x-b.x;
        const dy = a.y-b.y;

        const distance =
          Math.sqrt(dx*dx+dy*dy);

        if(distance < maxDistance){

          const opacity =
            (1-distance/maxDistance) * .16;

          ctx.beginPath();

          ctx.moveTo(a.x,a.y);
          ctx.lineTo(b.x,b.y);

          ctx.strokeStyle =
            `rgba(0,180,255,${opacity})`;

          ctx.lineWidth=.5;

          ctx.stroke();
        }
      }
    }
  }


  /* ================= CIRCUIT GRID ================= */

  function drawCircuit(){

    const spacing =
      window.innerWidth < 700 ? 90 : 120;

    const offset =
      (performance.now() * .015) % spacing;

    ctx.lineWidth = .7;

    for(let x=-spacing;x<W+spacing;x+=spacing){

      ctx.beginPath();

      ctx.moveTo(x+offset,0);

      ctx.lineTo(x+offset,H);

      ctx.strokeStyle =
        "rgba(0,150,220,.035)";

      ctx.stroke();
    }

    for(let y=-spacing;y<H+spacing;y+=spacing){

      ctx.beginPath();

      ctx.moveTo(0,y+offset);

      ctx.lineTo(W,y+offset);

      ctx.strokeStyle =
        "rgba(0,150,220,.035)";

      ctx.stroke();
    }
  }


  /* ================= ENERGY PULSES ================= */

  function createPulse(x,y){

    pulses.push({
      x,
      y,
      radius:2,
      life:1
    });
  }

  function drawPulses(){

    for(let i=pulses.length-1;i>=0;i--){

      const p=pulses[i];

      p.radius += 2.5;
      p.life -= .018;

      ctx.beginPath();

      ctx.arc(
        p.x,
        p.y,
        p.radius,
        0,
        Math.PI*2
      );

      ctx.strokeStyle =
        `rgba(0,230,255,${p.life})`;

      ctx.lineWidth=1;

      ctx.stroke();

      if(p.life<=0){
        pulses.splice(i,1);
      }
    }
  }


  /* ================= BURST ================= */

  function createBurst(x,y){

    const count =
      window.innerWidth < 700 ? 28 : 50;

    for(let i=0;i<count;i++){

      const angle =
        Math.random()*Math.PI*2;

      const speed =
        rand(1.5,6);

      bursts.push({
        x,
        y,
        vx:Math.cos(angle)*speed,
        vy:Math.sin(angle)*speed,
        life:1,
        size:rand(.7,2)
      });
    }
  }

  function drawBursts(){

    for(let i=bursts.length-1;i>=0;i--){

      const b=bursts[i];

      b.x += b.vx;
      b.y += b.vy;

      b.vx *= .97;
      b.vy *= .97;

      b.life -= .025;

      ctx.beginPath();

      ctx.arc(
        b.x,
        b.y,
        b.size,
        0,
        Math.PI*2
      );

      ctx.fillStyle =
        `rgba(0,235,255,${b.life})`;

      ctx.fill();

      if(b.life<=0){
        bursts.splice(i,1);
      }
    }
  }


  /* ================= RENDER ================= */

  
/* =========================================================
   UDL V5.3 // VISIBLE 3D PARTICLE CUBE RECONSTRUCTION
   ========================================================= */

/* =========================================================
   UDL V5.3 FINAL
   VISIBLE 3D PARTICLE RECONSTRUCTION OBJECTS
   ========================================================= */

const cubeObjects = [];

function cubeRandom(a,b){
  return Math.random() * (b-a) + a;
}

function createParticleCube(index){

  const sizeList =
    window.innerWidth < 700
      ? [42,58,72]
      : [48,64,78,88,96];

  const size = sizeList[index % sizeList.length];

  const margin = size * 1.6;

  const obj = {
    x: cubeRandom(margin, Math.max(margin + 1, W - margin)),
    y: cubeRandom(margin, Math.max(margin + 1, H - margin)),

    size:size,

    vx:cubeRandom(-0.22,0.22),
    vy:cubeRandom(-0.16,0.16),

    rotation:cubeRandom(0,Math.PI*2),

    timer:cubeRandom(180,360),

    state:"solid",
    progress:0,

    particles:[]
  };

  const particleCount =
    window.innerWidth < 700 ? 65 : 115;

  for(let i=0;i<particleCount;i++){

    const face=Math.floor(Math.random()*6);

    let x=cubeRandom(-1,1);
    let y=cubeRandom(-1,1);
    let z=cubeRandom(-1,1);

    if(face===0) x=-1;
    if(face===1) x=1;
    if(face===2) y=-1;
    if(face===3) y=1;
    if(face===4) z=-1;
    if(face===5) z=1;

    obj.particles.push({
      x:x,
      y:y,
      z:z,

      ox:x,
      oy:y,
      oz:z,

      dx:cubeRandom(-1,1),
      dy:cubeRandom(-1,1),
      dz:cubeRandom(-1,1),

      r:cubeRandom(1.0,2.4)
    });
  }

  return obj;
}

function initParticleCubes(){

  cubeObjects.length=0;

  const count =
    window.innerWidth < 700 ? 3 : 5;

  for(let i=0;i<count;i++){
    cubeObjects.push(createParticleCube(i));
  }

  console.log(
    "UDL V5.3 FINAL CUBES:",
    cubeObjects.length,
    "W:",
    W,
    "H:",
    H
  );
}

function cubePoint(obj,x,y,z){

  const c=Math.cos(obj.rotation);
  const s=Math.sin(obj.rotation);

  const rx=x*c-z*s;

  return {
    x:obj.x+rx*obj.size,
    y:obj.y+y*obj.size
  };
}

function updateParticleCubes(){

  for(const obj of cubeObjects){

    obj.x+=obj.vx;
    obj.y+=obj.vy;

    obj.rotation+=0.006;

    const m=obj.size*1.4;

    if(obj.x<m || obj.x>W-m){
      obj.vx*=-1;
      obj.x=Math.max(m,Math.min(W-m,obj.x));
    }

    if(obj.y<m || obj.y>H-m){
      obj.vy*=-1;
      obj.y=Math.max(m,Math.min(H-m,obj.y));
    }

    obj.timer--;

    if(obj.timer<=0 && obj.state==="solid"){
      obj.state="scatter";
      obj.progress=0;
    }

    if(obj.state==="scatter"){

      obj.progress+=0.025;

      if(obj.progress>=1){
        obj.progress=1;
        obj.state="rebuild";
      }
    }

    if(obj.state==="rebuild"){

      obj.progress-=0.018;

      if(obj.progress<=0){
        obj.progress=0;
        obj.state="solid";
        obj.timer=cubeRandom(220,460);
      }
    }
  }
}

function drawParticleCubes(){

  ctx.save();

  /* Force a clean drawing state */
  ctx.globalAlpha=1;
  ctx.globalCompositeOperation="source-over";
  ctx.filter="none";

  for(const obj of cubeObjects){

    const p=obj.progress;

    /* ================= PARTICLES ================= */

    for(const part of obj.particles){

      const scatter =
        obj.state==="solid" ? 0 : p;

      const q=cubePoint(
        obj,
        part.ox + part.dx*scatter*3,
        part.oy + part.dy*scatter*3,
        part.oz + part.dz*scatter*3
      );

      const alpha =
        obj.state==="solid"
          ? 0.95
          : Math.max(0.12,1-p*0.8);

      ctx.beginPath();

      ctx.arc(
        q.x,
        q.y,
        part.r,
        0,
        Math.PI*2
      );

      ctx.fillStyle=
        `rgba(0,220,255,${alpha})`;

      ctx.shadowColor=
        "rgba(0,220,255,1)";

      ctx.shadowBlur=10;

      ctx.fill();
    }

    /* ================= 3D CUBE EDGES ================= */

    if(
      obj.state==="solid" ||
      obj.state==="rebuild"
    ){

      const v=[
        [-1,-1,-1],
        [ 1,-1,-1],
        [ 1, 1,-1],
        [-1, 1,-1],
        [-1,-1, 1],
        [ 1,-1, 1],
        [ 1, 1, 1],
        [-1, 1, 1]
      ].map(a=>cubePoint(
        obj,a[0],a[1],a[2]
      ));

      const edges=[
        [0,1],[1,2],[2,3],[3,0],
        [4,5],[5,6],[6,7],[7,4],
        [0,4],[1,5],[2,6],[3,7]
      ];

      ctx.strokeStyle=
        "rgba(0,210,255,0.75)";

      ctx.lineWidth=1.2;

      ctx.shadowColor=
        "rgba(0,210,255,1)";

      ctx.shadowBlur=12;

      for(const [a,b] of edges){

        ctx.beginPath();

        ctx.moveTo(v[a].x,v[a].y);
        ctx.lineTo(v[b].x,v[b].y);

        ctx.stroke();
      }
    }

    /* ================= RECONSTRUCTION RING ================= */

    if(
      obj.state==="scatter" ||
      obj.state==="rebuild"
    ){

      ctx.beginPath();

      ctx.arc(
        obj.x,
        obj.y,
        obj.size*(1.2+p*0.9),
        0,
        Math.PI*2
      );

      ctx.strokeStyle=
        "rgba(0,225,255,0.9)";

      ctx.lineWidth=2;

      ctx.shadowColor=
        "rgba(0,225,255,1)";

      ctx.shadowBlur=18;

      ctx.stroke();
    }
  }

  ctx.restore();
}

/* Initialize AFTER canvas dimensions exist */
requestAnimationFrame(()=>{
  initParticleCubes();
});

function render(){

    /* CLEAR FIRST — THEN DRAW EVERYTHING */
    ctx.clearRect(0,0,W,H);

    drawCircuit();

    updateReconstructionObjects(performance.now());

    for(const obj of reconstructionObjects){
      drawReconstructionObject(obj, performance.now());
    }

    drawReconstructionParticles();

    drawConnections();

    for(const p of particles){

      p.update();
      p.draw();

    }

    /* UDL V5.3 PARTICLE CUBE RENDER */
    updateParticleCubes();
    drawParticleCubes();

    drawPulses();
    drawBursts();

    requestAnimationFrame(render);
  }

  render();


  /* ================= POINTER ================= */

  window.addEventListener("pointermove",event=>{

    mouse.x=event.clientX;
    mouse.y=event.clientY;
    mouse.active=true;

  },{passive:true});


  window.addEventListener("pointerleave",()=>{

    mouse.active=false;

  });


  /* ================= TOUCH / CLICK ================= */

  function digitalReaction(x,y){

    mouse.x=x;
    mouse.y=y;

    createBurst(x,y);
    createPulse(x,y);

    createTouchVisual(x,y);

  }

  window.addEventListener("pointerdown",event=>{

    digitalReaction(
      event.clientX,
      event.clientY
    );

  });


  function createTouchVisual(x,y){

    const el =
      document.createElement("div");

    el.className="touch-burst";

    el.style.left=x+"px";
    el.style.top=y+"px";

    document.body.appendChild(el);

    setTimeout(()=>{
      el.remove();
    },750);
  }


  /* ================= TIME ================= */

  const systemTime =
    document.getElementById("systemTime");

  function updateTime(){

    const now=new Date();

    systemTime.textContent =
      now.toLocaleTimeString(
        "en-GB",
        {hour12:false}
      );

  }

  updateTime();
  setInterval(updateTime,1000);


  /* ================= MOBILE MENU ================= */

  const menuButton =
    document.getElementById("menuButton");

  const mainNav =
    document.getElementById("mainNav");

  menuButton.addEventListener("click",()=>{

    mainNav.classList.toggle("open");

  });


  /* ================= TRANSITION ================= */

  const transition =
    document.getElementById("transitionLayer");

  function transitionTo(target){

    const element =
      document.querySelector(target);

    if(!element)return;

    transition.style.setProperty(
      "--tx",
      "50%"
    );

    transition.style.setProperty(
      "--ty",
      "50%"
    );

    transition.classList.remove("active");

    void transition.offsetWidth;

    transition.classList.add("active");

    setTimeout(()=>{

      element.scrollIntoView({
        behavior:"smooth"
      });

    },280);

    setTimeout(()=>{

      transition.classList.remove("active");

    },900);
  }


  /* ================= NAV LINKS ================= */

  document
    .querySelectorAll(".nav-link")
    .forEach(link=>{

      link.addEventListener("click",event=>{

        const href =
          link.getAttribute("href");

        if(!href || !href.startsWith("#"))
          return;

        event.preventDefault();

        mainNav.classList.remove("open");

        const rect =
          link.getBoundingClientRect();

        transition.style.setProperty(
          "--tx",
          (rect.left+rect.width/2)+"px"
        );

        transition.style.setProperty(
          "--ty",
          (rect.top+rect.height/2)+"px"
        );

        transitionTo(href);

      });

    });


  /* ================= HERO BUTTONS ================= */

  document
    .querySelectorAll(".interactive-action")
    .forEach(button=>{

      button.addEventListener("click",()=>{

        const target =
          button.dataset.target;

        transitionTo(target);

      });

    });


  /* ================= ACTIVE SECTION ================= */

  const sections =
    document.querySelectorAll(
      "main section[id]"
    );

  const navLinks =
    document.querySelectorAll(
      ".nav-link"
    );

  const observer =
    new IntersectionObserver(
      entries=>{

        entries.forEach(entry=>{

          if(!entry.isIntersecting)
            return;

          navLinks.forEach(link=>{
            link.classList.remove("active");
          });

          const active =
            document.querySelector(
              `.nav-link[href="#${entry.target.id}"]`
            );

          if(active){
            active.classList.add("active");
          }

        });

      },
      {
        threshold:.35
      }
    );

  sections.forEach(section=>{
    observer.observe(section);
  });


})();

/* =========================================================
   UDL V5 // PRICING INTERACTION ENGINE
   ========================================================= */

(() => {
  const tabs = document.querySelectorAll('.pricing-tab');
  const panels = document.querySelectorAll('.pricing-panel');
  const buttons = document.querySelectorAll('.price-cta');

  if (!tabs.length) return;

  function showPricing(type){
    tabs.forEach(tab => {
      const active = tab.dataset.pricing === type;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', active ? 'true' : 'false');
    });

    panels.forEach(panel => {
      panel.classList.toggle(
        'active',
        panel.id === `pricing-${type}`
      );
    });

    if (typeof window.digitalPulse === 'function') {
      window.digitalPulse(window.innerWidth / 2, window.innerHeight / 2);
    }
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      showPricing(tab.dataset.pricing);
    });
  });

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const packageName = button.dataset.package || 'UDL Project';

      const contact = document.querySelector('#contact');

      if (contact) {
        const message = encodeURIComponent(
          `Hello UTKAL DIGITAL LAB,\n\nI am interested in: ${packageName}\n\nPlease share the project requirements and final quotation.`
        );

        const whatsappNumber = '919000000000';

        window.open(
          `https://wa.me/${whatsappNumber}?text=${message}`,
          '_blank',
          'noopener'
        );
      }

      if (typeof window.digitalPulse === 'function') {
        window.digitalPulse(
          button.getBoundingClientRect().left +
          button.offsetWidth / 2,
          button.getBoundingClientRect().top +
          button.offsetHeight / 2
        );
      }
    });
  });

  /* Card spotlight based on pointer position */
  document.querySelectorAll('.price-card').forEach(card => {
    card.addEventListener('pointermove', e => {
      const rect = card.getBoundingClientRect();

      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      card.style.setProperty('--mx', `${x}%`);
      card.style.setProperty('--my', `${y}%`);
    });
  });

})();
