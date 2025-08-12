// Initialize EmailJS
(function () {
  emailjs.init("Pla1639G2wqY9uDNG"); // Replace with your actual EmailJS public key
})();

// Navigation scroll effect
window.addEventListener("scroll", function () {
  const navbar = document.getElementById("navbar");
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// Page navigation
function showPage(pageId) {
  // Hide all pages
  const pages = document.querySelectorAll(".page");
  pages.forEach((page) => page.classList.remove("active"));

  // Show selected page
  const targetPage = document.getElementById(pageId);
  targetPage.classList.add("active");
  targetPage.classList.add("fade-in");

  // Remove animation class after animation completes
  setTimeout(() => {
    targetPage.classList.remove("fade-in");
  }, 500);

  // Scroll to top
  window.scrollTo({ top: 0, behavior: "smooth" });

  // Close mobile menu if open
  const navMenu = document.getElementById("nav-menu");
  navMenu.classList.remove("active");
}

// Mobile menu toggle
function toggleMobileMenu() {
  const navMenu = document.getElementById("nav-menu");
  navMenu.classList.toggle("active");
}

// Close mobile menu when clicking outside
document.addEventListener("click", function (event) {
  const navMenu = document.getElementById("nav-menu");
  const mobileMenuBtn = document.querySelector(".mobile-menu");

  if (
    !navMenu.contains(event.target) &&
    !mobileMenuBtn.contains(event.target)
  ) {
    navMenu.classList.remove("active");
  }
});

// Form handling with EmailJS
document
  .getElementById("contact-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const submitBtn = document.getElementById("submit-btn");
    const formStatus = document.getElementById("form-status");
    const form = event.target;

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";
    formStatus.style.display = "none";

    // Get form data
    const formData = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value || "Not provided",
      route: document.getElementById("route").value,
      weight: document.getElementById("weight").value,
      requests: document.getElementById("requests").value || "None",
    };

    // Email template parameters
    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      phone: formData.phone,
      route_details: formData.route,
      gear_weight: formData.weight + " kg",
      special_requests: formData.requests,
      to_email: "contact@lightpackadventures.com", // Your business email
    };

    // Send email via EmailJS
    emailjs
      .send("service_miomecn", "template_contact", templateParams)
      .then(function (response) {
        console.log("SUCCESS!", response.status, response.text);
        showFormStatus(
          "success",
          "✓ Thank you! Your inquiry has been sent successfully. We'll get back to you within 48 hours.",
        );
        form.reset();
      })
      .catch(function (error) {
        console.log("FAILED...", error);
        showFormStatus(
          "error",
          "✗ Sorry, there was an error sending your message. Please try again or contact us directly at contact@lightpackadventures.com",
        );
      })
      .finally(function () {
        // Reset button state
        submitBtn.disabled = false;
        submitBtn.textContent = "Request a Quote";
      });
  });

// Show form status messages
function showFormStatus(type, message) {
  const formStatus = document.getElementById("form-status");
  formStatus.className = type;
  formStatus.textContent = message;
  formStatus.style.display = "block";

  // Auto-hide success messages after 5 seconds
  if (type === "success") {
    setTimeout(() => {
      formStatus.style.display = "none";
    }, 5000);
  }
}

// Smooth scrolling for anchor links (if any are added later)
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Add loading states for better UX
function addLoadingState(element) {
  element.classList.add("loading");
}

function removeLoadingState(element) {
  element.classList.remove("loading");
}

// Form validation enhancements
function validateForm() {
  const requiredFields = document.querySelectorAll("#contact-form [required]");
  let isValid = true;

  requiredFields.forEach((field) => {
    if (!field.value.trim()) {
      field.style.borderColor = "var(--error)";
      isValid = false;
    } else {
      field.style.borderColor = "var(--border)";
    }
  });

  // Email validation
  const emailField = document.getElementById("email");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailField.value && !emailRegex.test(emailField.value)) {
    emailField.style.borderColor = "var(--error)";
    isValid = false;
  }

  return isValid;
}

// Real-time form validation
document
  .querySelectorAll("#contact-form input, #contact-form textarea")
  .forEach((field) => {
    field.addEventListener("blur", validateForm);
    field.addEventListener("input", function () {
      if (this.style.borderColor === "var(--error)") {
        this.style.borderColor = "var(--border)";
      }
    });
  });

// Intersection Observer for scroll animations (optional enhancement)
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver(function (entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("fade-in");
    }
  });
}, observerOptions);

// Observe elements for scroll animations
document
  .querySelectorAll(".service-card, .field-note, .team-member")
  .forEach((el) => {
    observer.observe(el);
  });

// Console message for developers
console.log(
  "🏔️ LightPack Carpathian Adventures - Website loaded successfully!",
);
console.log(
  "📧 Don't forget to set up your EmailJS configuration in script.js",
);

// Performance monitoring (optional)
window.addEventListener("load", function () {
  const loadTime =
    performance.timing.domContentLoadedEventEnd -
    performance.timing.navigationStart;
  console.log(`⚡ Page loaded in ${loadTime}ms`);
});
