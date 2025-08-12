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

// Form handling with EmailJS and Auto-Reply
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

    // Email template parameters for business notification
    const businessEmailParams = {
      from_name: formData.name,
      from_email: formData.email,
      phone: formData.phone,
      route_details: formData.route,
      gear_weight: formData.weight + " kg",
      special_requests: formData.requests,
      to_email: "contact@lightpackadventures.com", // Your business email
    };

    // Auto-reply template parameters for customer
    const autoReplyParams = {
      to_name: formData.name,
      to_email: formData.email,
      customer_route: formData.route,
      customer_weight: formData.weight + " kg",
      customer_phone: formData.phone,
      customer_requests: formData.requests,
    };

    // Send business notification email first
    emailjs
      .send("service_miomecn", "template_contact", businessEmailParams)
      .then(function (response) {
        console.log(
          "Business notification sent successfully!",
          response.status,
          response.text,
        );

        // Send auto-reply to customer
        return emailjs.send(
          "service_miomecn",
          "template_autoreply",
          autoReplyParams,
        );
      })
      .then(function (response) {
        console.log(
          "Auto-reply sent successfully!",
          response.status,
          response.text,
        );
        showFormStatus(
          "success",
          "✓ Thank you! Your inquiry has been sent successfully. Check your email for a confirmation and we'll get back to you within 48 hours with a detailed quote.",
        );
        form.reset();
      })
      .catch(function (error) {
        console.log("Email sending failed...", error);

        // Try to send at least the business notification if auto-reply fails
        if (error.text && error.text.includes("auto-reply")) {
          showFormStatus(
            "success",
            "✓ Your inquiry has been sent successfully! We'll get back to you within 48 hours. (Note: Confirmation email may be delayed)",
          );
          form.reset();
        } else {
          showFormStatus(
            "error",
            "✗ Sorry, there was an error sending your message. Please try again or contact us directly at contact@lightpackadventures.com or +40 711 545 03",
          );
        }
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

  // Auto-hide success messages after 8 seconds (longer for auto-reply confirmation)
  if (type === "success") {
    setTimeout(() => {
      formStatus.style.display = "none";
    }, 8000);
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
  "🔄 Auto-reply functionality enabled - remember to create both email templates",
);

// Performance monitoring (optional)
window.addEventListener("load", function () {
  const loadTime =
    performance.timing.domContentLoadedEventEnd -
    performance.timing.navigationStart;
  console.log(`⚡ Page loaded in ${loadTime}ms`);
});
