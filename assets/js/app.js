document.addEventListener("DOMContentLoaded", () => {

  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  if (navToggle && navLinks) {

    navToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");

      const isOpen = navLinks.classList.contains("active");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }


  /* Reveal animation */

  const revealItems = document.querySelectorAll(
    ".premium-card, .project-card, .process-item, .section-heading"
  );

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.08
    }
  );

  revealItems.forEach(item => {
    item.style.opacity = "0";
    item.style.transform = "translateY(22px)";
    item.style.transition = "opacity .7s ease, transform .7s ease";
    observer.observe(item);
  });


  console.log("UTKAL DIGITAL LAB Premium website loaded successfully.");

});
