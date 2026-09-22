(() => {
"use strict";

/* UDL PREMIUM INTERACTION ENGINE */

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* scanline */
if (!reduceMotion) {
  const scan = document.createElement("div");
  scan.className = "udl-scanline";
  document.body.appendChild(scan);
}

/* ripple touch / click */
document.addEventListener("pointerdown", (event) => {
  const target = event.target.closest(".btn, .service-card, .project-card, .price-card");
  if (!target) return;

  const rect = target.getBoundingClientRect();
  const ripple = document.createElement("span");
  ripple.className = "udl-ripple";

  ripple.style.left = `${event.clientX - rect.left}px`;
  ripple.style.top = `${event.clientY - rect.top}px`;

  target.style.position = "relative";
  target.appendChild(ripple);

  setTimeout(() => ripple.remove(), 750);
});

/* 3D tilt */
if (!reduceMotion) {
  document.querySelectorAll("[data-tilt]").forEach((card) => {

    card.addEventListener("pointermove", (event) => {
      if (window.innerWidth < 800) return;

      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;

      const rotateY = (x - 0.5) * 8;
      const rotateX = (0.5 - y) * 8;

      card.style.transform =
        `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });
}

/* mouse glow */
if (!reduceMotion) {
  document.addEventListener("pointermove", (event) => {
    document.documentElement.style.setProperty(
      "--mouse-x",
      `${event.clientX}px`
    );

    document.documentElement.style.setProperty(
      "--mouse-y",
      `${event.clientY}px`
    );
  });
}

/* inquiry */
const inquiry = document.getElementById("projectInquiry");

if (inquiry) {
  const params = new URLSearchParams(window.location.search);
  const selectedPlan = params.get("plan");

  if (selectedPlan) {
    const budget = inquiry.querySelector('[name="budget"]');

    if (budget) {
      const map = {
        Basic: "₹5K – ₹15K",
        Standard: "₹15K – ₹30K",
        Premium: "₹30K – ₹60K",
        Pro: "₹60K – ₹1L"
      };

      if (map[selectedPlan]) budget.value = map[selectedPlan];
    }
  }

  inquiry.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(inquiry);
    const payload = Object.fromEntries(data.entries());

    localStorage.setItem(
      "udl_latest_inquiry",
      JSON.stringify({
        ...payload,
        createdAt: new Date().toISOString()
      })
    );

    const result = document.getElementById("inquiryResult");

    if (result) {
      result.style.display = "block";
      result.innerHTML =
        "<strong>Inquiry saved.</strong><br>" +
        "Your project requirement is ready for the next communication step.";
    }
  });
}

/* demo client login */
const login = document.getElementById("loginForm");

if (login) {
  login.addEventListener("submit", (event) => {
    event.preventDefault();

    const result = document.getElementById("loginResult");

    if (result) {
      result.style.display = "block";
      result.innerHTML =
        "<strong>Client portal demo.</strong><br>" +
        "Authentication backend can be connected here for production.";
    }
  });
}

})();
