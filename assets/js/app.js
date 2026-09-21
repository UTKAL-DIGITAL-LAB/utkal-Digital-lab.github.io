document.addEventListener("DOMContentLoaded", () => {

  const loader = document.getElementById("loader");
  const navbar = document.getElementById("navbar");
  const menuBtn = document.getElementById("menuBtn");
  const navMenu = document.getElementById("navMenu");
  const year = document.getElementById("year");
  const particles = document.getElementById("particles");
  const form = document.getElementById("projectForm");

  setTimeout(() => {
    loader.classList.add("hide");
  }, 700);

  year.textContent = new Date().getFullYear();

  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 40);
  }, { passive:true });

  menuBtn.addEventListener("click", () => {
    navMenu.classList.toggle("open");
  });

  navMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("open");
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold:.12
  });

  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

  if(particles){
    for(let i = 0; i < 45; i++){
      const p = document.createElement("span");

      p.style.position = "absolute";
      p.style.width = `${Math.random() * 2 + 1}px`;
      p.style.height = p.style.width;
      p.style.borderRadius = "50%";
      p.style.background = "rgba(160,190,255,.5)";
      p.style.left = `${Math.random() * 100}%`;
      p.style.top = `${Math.random() * 100}%`;
      p.style.opacity = `${Math.random() * .5 + .15}`;
      p.style.animation = `particleFloat ${Math.random() * 8 + 5}s ease-in-out infinite`;
      p.style.animationDelay = `-${Math.random() * 8}s`;

      particles.appendChild(p);
    }

    const style = document.createElement("style");

    style.textContent = `
      @keyframes particleFloat {
        0%,100% { transform:translate3d(0,0,0); }
        50% { transform:translate3d(${Math.random() * 50 - 25}px,${Math.random() * 60 - 30}px,0); }
      }
    `;

    document.head.appendChild(style);
  }

  document.querySelectorAll(".service-card,.product-card,.price-card").forEach(card => {

    card.addEventListener("pointermove", e => {

      if(window.innerWidth < 900) return;

      const rect = card.getBoundingClientRect();

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const rotateY = ((x / rect.width) - .5) * 5;
      const rotateX = ((y / rect.height) - .5) * -5;

      card.style.transform =
        `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });

    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });

  });

  if(form){

    form.addEventListener("submit", e => {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const project = document.getElementById("project").value.trim();
      const email = document.getElementById("email").value.trim();
      const whatsapp = document.getElementById("whatsapp").value.trim();
      const service = document.getElementById("service").value;
      const budget = document.getElementById("budget").value;
      const details = document.getElementById("details").value.trim();

      const message =
`Hello UTKAL DIGITAL LAB,

I want to discuss a project.

Name: ${name}
Project / Business: ${project}
Email: ${email}
WhatsApp: ${whatsapp}
Service: ${service}
Budget: ${budget}

Project Details:
${details}`;

      const whatsappNumber = "919000000000";

      const url =
        `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

      window.open(url, "_blank");

    });

  }

});
