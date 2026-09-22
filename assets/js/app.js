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

  function render(){

    ctx.clearRect(0,0,W,H);

    drawCircuit();

    drawConnections();

    for(const p of particles){

      p.update();
      p.draw();

    }

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
