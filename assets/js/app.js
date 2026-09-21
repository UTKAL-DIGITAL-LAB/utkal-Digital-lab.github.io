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


/* ================= UDL ENQUIRY FORM ================= */

document.addEventListener("DOMContentLoaded", function () {

  const form = document.getElementById("enquiryForm");
  const status = document.getElementById("formStatus");

  if (!form || !status) return;

  form.addEventListener("submit", function (event) {

    event.preventDefault();

    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const service = document.getElementById("service");
    const details = document.getElementById("details");

    if (!name.value.trim()) {
      status.textContent = "Please enter your full name.";
      name.focus();
      return;
    }

    if (!email.value.trim() || !email.checkValidity()) {
      status.textContent = "Please enter a valid email address.";
      email.focus();
      return;
    }

    if (!service.value) {
      status.textContent = "Please select a service.";
      service.focus();
      return;
    }

    if (!details.value.trim()) {
      status.textContent = "Please describe your project.";
      details.focus();
      return;
    }

    const enquiry = {
      name: name.value.trim(),
      business: document.getElementById("business").value.trim(),
      email: email.value.trim(),
      phone: document.getElementById("phone").value.trim(),
      service: service.value,
      budget: document.getElementById("budget").value,
      details: details.value.trim(),
      createdAt: new Date().toISOString()
    };

    const enquiryText =
      "UDL PROJECT ENQUIRY\n\n" +
      "Name: " + enquiry.name + "\n" +
      "Business / Project: " + (enquiry.business || "Not provided") + "\n" +
      "Email: " + enquiry.email + "\n" +
      "Phone / WhatsApp: " + (enquiry.phone || "Not provided") + "\n" +
      "Service: " + enquiry.service + "\n" +
      "Budget: " + (enquiry.budget || "Not provided") + "\n\n" +
      "Project Details:\n" +
      enquiry.details;

    try {
      localStorage.setItem(
        "udl_last_enquiry",
        JSON.stringify(enquiry)
      );

      const blob = new Blob(
        [enquiryText],
        { type: "text/plain;charset=utf-8" }
      );

      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = downloadUrl;
      link.download = "UDL-Project-Enquiry.txt";
      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(downloadUrl);

      status.textContent =
        "Enquiry prepared successfully. Your enquiry file has been downloaded.";

      form.reset();

    } catch (error) {

      console.error("UDL enquiry error:", error);

      status.textContent =
        "Unable to prepare the enquiry on this device. Please try again.";

    }

  });

});
