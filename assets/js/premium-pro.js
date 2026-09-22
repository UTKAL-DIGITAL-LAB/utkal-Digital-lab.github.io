(() => {
  "use strict";

  const reduceMotion =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------
     Scroll reveal
  --------------------------------------------- */

  const revealItems = document.querySelectorAll(
    ".service-card,.project-card,.price-card,.live-panel,.inquiry-card,.portal-box,.section-heading"
  );

  if ("IntersectionObserver" in window && !reduceMotion) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("pro-reveal");
            requestAnimationFrame(() => {
              entry.target.classList.add("is-visible");
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.10 }
    );

    revealItems.forEach(el => observer.observe(el));
  } else {
    revealItems.forEach(el => {
      el.classList.add("pro-reveal", "is-visible");
    });
  }

  /* ---------------------------------------------
     Touch ripple
  --------------------------------------------- */

  document.addEventListener("pointerdown", event => {
    const ripple = document.createElement("span");

    ripple.style.cssText = `
      position:fixed;
      left:${event.clientX}px;
      top:${event.clientY}px;
      width:10px;
      height:10px;
      border:1px solid rgba(103,232,249,.8);
      border-radius:50%;
      pointer-events:none;
      z-index:99999;
      transform:translate(-50%,-50%);
      box-shadow:0 0 18px rgba(39,199,255,.6);
      transition:all .65s ease;
    `;

    document.body.appendChild(ripple);

    requestAnimationFrame(() => {
      ripple.style.width = "120px";
      ripple.style.height = "120px";
      ripple.style.opacity = "0";
    });

    setTimeout(() => ripple.remove(), 700);
  });

  /* ---------------------------------------------
     3D card tilt
  --------------------------------------------- */

  if (!reduceMotion) {
    document
      .querySelectorAll(".service-card,.project-card,.price-card")
      .forEach(card => {

        card.addEventListener("pointermove", event => {
          if (window.innerWidth < 800) return;

          const rect = card.getBoundingClientRect();

          const x =
            (event.clientX - rect.left) / rect.width - 0.5;

          const y =
            (event.clientY - rect.top) / rect.height - 0.5;

          card.style.transform =
            `perspective(900px)
             rotateX(${y * -6}deg)
             rotateY(${x * 6}deg)
             translateY(-7px)`;
        });

        card.addEventListener("pointerleave", () => {
          card.style.transform = "";
        });
      });
  }

  /* ---------------------------------------------
     Magnetic buttons
  --------------------------------------------- */

  if (!reduceMotion) {
    document
      .querySelectorAll(".btn,.nav-cta")
      .forEach(button => {

        button.addEventListener("pointermove", event => {
          if (window.innerWidth < 800) return;

          const rect = button.getBoundingClientRect();

          const x =
            (event.clientX - rect.left - rect.width / 2) * 0.12;

          const y =
            (event.clientY - rect.top - rect.height / 2) * 0.12;

          button.style.transform =
            `translate(${x}px,${y}px)`;
        });

        button.addEventListener("pointerleave", () => {
          button.style.transform = "";
        });
      });
  }

  /* ---------------------------------------------
     Inquiry form
  --------------------------------------------- */

  const inquiryForm =
    document.querySelector("#inquiryForm");

  if (inquiryForm) {
    inquiryForm.addEventListener("submit", event => {
      event.preventDefault();

      const data =
        new FormData(inquiryForm);

      const name =
        data.get("name") || "";

      const service =
        data.get("service") || "";

      const budget =
        data.get("budget") || "";

      const message =
        data.get("message") || "";

      const text =
`Hello UTKAL DIGITAL LAB,

Name: ${name}
Service: ${service}
Budget: ${budget}

Project:
${message}`;

      const whatsapp =
        "https://wa.me/?text=" +
        encodeURIComponent(text);

      window.open(whatsapp, "_blank");

      const status =
        document.querySelector("#inquiryStatus");

      if (status) {
        status.textContent =
          "Inquiry prepared. WhatsApp is opening...";
      }
    });
  }

  /* ---------------------------------------------
     Demo client portal
     Frontend prototype only
  --------------------------------------------- */

  const loginForm =
    document.querySelector("#clientLogin");

  if (loginForm) {
    loginForm.addEventListener("submit", event => {
      event.preventDefault();

      const email =
        loginForm.querySelector("[name=email]").value.trim();

      const status =
        document.querySelector("#loginStatus");

      if (!email) {
        if (status) {
          status.textContent =
            "Please enter your email.";
        }
        return;
      }

      localStorage.setItem(
        "udl_demo_client",
        email
      );

      if (status) {
        status.textContent =
          "Demo client portal unlocked.";
      }

      setTimeout(() => {
        window.location.hash = "dashboard";
      }, 500);
    });
  }

  /* ---------------------------------------------
     Live clock
  --------------------------------------------- */

  const clocks =
    document.querySelectorAll("[data-live-time]");

  function updateClock() {
    const now = new Date();

    clocks.forEach(clock => {
      clock.textContent =
        now.toLocaleTimeString([], {
          hour:"2-digit",
          minute:"2-digit",
          second:"2-digit"
        });
    });
  }

  updateClock();

  if (clocks.length) {
    setInterval(updateClock, 1000);
  }

  console.log(
    "UDL Premium Pro V2 loaded."
  );

})();
