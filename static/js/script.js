// Initialize EmailJS
(function () {
  emailjs.init("Pla1639G2wqY9uDNG"); // Replace with your actual EmailJS public key
})();

// Google Analytics Event Tracking Functions
function trackEvent(eventName, parameters = {}) {
  if (typeof gtag !== "undefined") {
    gtag("event", eventName, parameters);
  }
}

function trackBusinessGoal(goalType, details = {}) {
  trackEvent("business_goal", {
    goal_type: goalType,
    ...details,
  });
}

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
function showPage(pageId, updateHistory = true) {
  // Update URL hash if requested
  if (updateHistory && window.location.hash !== "#" + pageId) {
    window.location.hash = pageId;
  }

  // Track page navigation
  trackEvent("page_view", {
    page_title: pageId,
    page_location: window.location.href,
  });

  // Hide all pages
  const pages = document.querySelectorAll(".page");
  pages.forEach((page) => page.classList.remove("active"));

  // Show selected page
  const targetPage = document.getElementById(pageId);
  if (targetPage) {
    targetPage.classList.add("active");
    targetPage.classList.add("fade-in");

    // Remove animation class after animation completes
    setTimeout(() => {
      targetPage.classList.remove("fade-in");
    }, 500);
  }

  // Update active navigation state
  updateActiveNavigation(pageId);

  // Scroll to top
  window.scrollTo({ top: 0, behavior: "smooth" });

  // Close mobile menu if open
  const navMenu = document.getElementById("nav-menu");
  navMenu.classList.remove("active");
}

// Update active navigation state
function updateActiveNavigation(pageId) {
  // Remove active class from all navigation links
  const navLinks = document.querySelectorAll(".nav-menu a");
  navLinks.forEach((link) => link.classList.remove("nav-active"));

  // Add active class to current page link (only in nav menu)
  const activeLink = document.querySelector(`.nav-menu a[href="#${pageId}"]`);
  if (activeLink) {
    activeLink.classList.add("nav-active");
  }
}

// Function to load page based on URL hash
function loadPageFromHash() {
  const hash = window.location.hash.substring(1); // Remove the '#'
  const validPages = ["home", "services", "plan", "about", "blog", "contact"];
  const blogPosts = [
    "fagaras-ridge",
    "via-transilvanica",
    "transfagarasan-transalpina",
  ];

  // Check if hash is a blog post
  if (hash && blogPosts.includes(hash)) {
    showPage("blog", false);
    setTimeout(() => {
      showBlogPost(hash);
    }, 100);
  } else if (hash && validPages.includes(hash)) {
    showPage(hash, false); // Don't update history when loading from hash
  } else {
    showPage("home", false); // Default to home page
  }
}

// Handle browser back/forward navigation
window.addEventListener("hashchange", function () {
  loadPageFromHash();
});

// Blog post navigation functions
function showBlogPost(postId) {
  // Hide blog post list
  const blogPosts = document.querySelector(".blog-posts");
  const blogPost = document.getElementById(postId);

  if (blogPosts && blogPost) {
    blogPosts.style.display = "none";
    blogPost.style.display = "block";

    // Update URL hash for direct linking
    if (window.location.hash !== "#" + postId) {
      window.location.hash = postId;
    }

    // Scroll to top of blog post
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Track blog post view
    trackEvent("blog_post_view", {
      post_id: postId,
      post_title: blogPost.querySelector("h2")?.textContent || postId,
    });
  }
}

function showBlogList() {
  // Show blog post list and hide individual posts
  const blogPosts = document.querySelector(".blog-posts");
  const blogPostFull = document.querySelectorAll(".blog-post-full");

  if (blogPosts) {
    blogPosts.style.display = "block";
  }

  blogPostFull.forEach((post) => {
    post.style.display = "none";
  });

  // Reset filters to show all posts
  const filterButtons = document.querySelectorAll(".filter-btn");
  const blogPostPreviews = document.querySelectorAll(".blog-post-preview");

  // Reset active filter button to "All Posts"
  filterButtons.forEach((btn) => btn.classList.remove("active"));
  const allPostsButton = document.querySelector(
    '.filter-btn[data-filter="all"]',
  );
  if (allPostsButton) {
    allPostsButton.classList.add("active");
  }

  // Show all blog posts
  blogPostPreviews.forEach((post) => {
    post.classList.remove("hidden");
    post.classList.add("visible");
    post.style.display = "block";
  });

  // Update URL hash back to blog
  if (window.location.hash !== "#blog") {
    window.location.hash = "blog";
  }

  // Scroll to top
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Ensure proper blog post visibility on page load
function ensureBlogPostVisibility() {
  const blogPosts = document.querySelector(".blog-posts");
  const blogPostFull = document.querySelectorAll(".blog-post-full");
  const blogPostPreviews = document.querySelectorAll(".blog-post-preview");

  // Hide all full blog posts by default
  blogPostFull.forEach((post) => {
    if (!post.style.display || post.style.display !== "block") {
      post.style.display = "none";
    }
  });

  // If we're on the blog page and no specific post is shown, ensure blog list is visible
  if (document.getElementById("blog").style.display === "block") {
    const anyPostVisible = Array.from(blogPostFull).some(
      (post) => post.style.display === "block",
    );

    if (!anyPostVisible && blogPosts) {
      blogPosts.style.display = "block";
      // Make sure all blog post previews are visible
      blogPostPreviews.forEach((post) => {
        post.classList.remove("hidden");
        post.classList.add("visible");
        post.style.display = "block";
      });
    }
  }
}

// Blog filtering functionality
function initializeBlogFilters() {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const blogPosts = document.querySelectorAll(".blog-post-preview");

  // Ensure all posts are visible by default
  blogPosts.forEach((post) => {
    post.classList.remove("hidden");
    post.classList.add("visible");
  });

  // Ensure "All Posts" button is active by default
  filterButtons.forEach((btn) => btn.classList.remove("active"));
  const allPostsButton = document.querySelector(
    '.filter-btn[data-filter="all"]',
  );
  if (allPostsButton) {
    allPostsButton.classList.add("active");
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.getAttribute("data-filter");

      // Update active button
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      // Filter posts
      filterBlogPosts(filter, blogPosts);

      // Track filter usage
      trackEvent("blog_filter_used", {
        filter: filter,
        posts_shown: document.querySelectorAll(".blog-post-preview.visible")
          .length,
      });
    });
  });
}

function filterBlogPosts(filter, posts) {
  posts.forEach((post) => {
    const postType = post.getAttribute("data-type");

    if (filter === "all" || postType === filter) {
      post.classList.remove("hidden");
      post.classList.add("visible");
      post.style.display = "block";
    } else {
      post.classList.remove("visible");
      post.classList.add("hidden");
      post.style.display = "none";
    }
  });
}

// Blog sharing functionality
function copyBlogLink(postId) {
  const currentUrl = window.location.origin + window.location.pathname;
  const blogUrl = currentUrl + "#" + postId;

  if (navigator.clipboard && window.isSecureContext) {
    // Use modern clipboard API
    navigator.clipboard
      .writeText(blogUrl)
      .then(() => {
        showCopyFeedback("Link copied to clipboard!");
      })
      .catch(() => {
        fallbackCopyLink(blogUrl);
      });
  } else {
    fallbackCopyLink(blogUrl);
  }

  // Track copy link usage
  trackEvent("blog_share", {
    post_id: postId,
    share_method: "copy_link",
    url: blogUrl,
  });
}

function fallbackCopyLink(text) {
  // Fallback for older browsers
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.left = "-999999px";
  textArea.style.top = "-999999px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    document.execCommand("copy");
    showCopyFeedback("Link copied to clipboard!");
  } catch (err) {
    showCopyFeedback("Please copy the link manually: " + text);
  }

  document.body.removeChild(textArea);
}

function showCopyFeedback(message) {
  // Create or update feedback element
  let feedback = document.getElementById("copy-feedback");
  if (!feedback) {
    feedback = document.createElement("div");
    feedback.id = "copy-feedback";
    feedback.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--cta);
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 5px;
      z-index: 1000;
      font-weight: 500;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transform: translateX(400px);
      transition: transform 0.3s ease;
    `;
    document.body.appendChild(feedback);
  }

  feedback.textContent = message;
  feedback.style.transform = "translateX(0)";

  setTimeout(() => {
    feedback.style.transform = "translateX(400px)";
  }, 3000);
}

function shareBlogPost(postId, platform) {
  const currentUrl = window.location.origin + window.location.pathname;
  const blogUrl = encodeURIComponent(currentUrl + "#" + postId);
  const blogTitle = encodeURIComponent(
    document.querySelector(`#${postId} h2`)?.textContent ||
      "LightPack Adventures Blog",
  );

  let shareUrl = "";

  switch (platform) {
    case "facebook":
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${blogUrl}`;
      break;
    case "twitter":
      shareUrl = `https://twitter.com/intent/tweet?url=${blogUrl}&text=${blogTitle}`;
      break;
  }

  if (shareUrl) {
    // Update the href before the link is clicked
    event.currentTarget.href = shareUrl;
  }

  // Track social media sharing
  trackEvent("blog_share", {
    post_id: postId,
    share_method: platform,
    url: decodeURIComponent(blogUrl),
  });
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

    // Validate form before sending
    if (!validateForm()) {
      showFormStatus("error", "Please fill in all required fields correctly.");
      return;
    }

    // Show enhanced loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Sending...</span> <div class="spinner"></div>';
    submitBtn.classList.add("loading");
    formStatus.style.display = "none";

    // Get form data
    const formData = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value || "Not provided",
      route: document.getElementById("route").value,
      weight: "NaN",
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

        // Track successful lead generation
        trackBusinessGoal("lead_generated", {
          route: formData.route,
          gear_weight: formData.weight,
          customer_location: "unknown", // Could be enhanced with geolocation
        });

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

        // Track successful form completion
        trackEvent("form_submit", {
          form_name: "contact_form",
          success: true,
        });

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
          // Track form submission failure
          trackEvent("form_submit", {
            form_name: "contact_form",
            success: false,
            error_type: "email_service_failure",
          });

          showFormStatus(
            "error",
            "✗ Sorry, there was an error sending your message. Please try again or contact us directly at contact@lightpackadventures.com or +40 711 545 03",
          );
        }
      })
      .finally(function () {
        // Reset button state with animation
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = "Request a Quote";
          submitBtn.classList.remove("loading");
        }, 500);
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

// Enhanced form validation with better UX
function validateForm() {
  const requiredFields = document.querySelectorAll("#contact-form [required]");
  let isValid = true;
  let firstErrorField = null;

  requiredFields.forEach((field) => {
    const fieldContainer = field.closest(".form-group");
    let errorMsg = fieldContainer.querySelector(".field-error");

    if (!field.value.trim()) {
      field.style.borderColor = "var(--error)";
      field.setAttribute("aria-invalid", "true");

      if (!errorMsg) {
        errorMsg = document.createElement("div");
        errorMsg.className = "field-error";
        fieldContainer.appendChild(errorMsg);
      }
      errorMsg.textContent = `${field.labels[0].textContent} is required`;

      if (!firstErrorField) firstErrorField = field;
      isValid = false;
    } else {
      field.style.borderColor = "var(--border)";
      field.setAttribute("aria-invalid", "false");
      if (errorMsg) errorMsg.remove();
    }
  });

  // Enhanced email validation
  const emailField = document.getElementById("email");
  const emailFieldContainer = emailField.closest(".form-group");
  let emailErrorMsg = emailFieldContainer.querySelector(".field-error");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (emailField.value && !emailRegex.test(emailField.value)) {
    emailField.style.borderColor = "var(--error)";
    emailField.setAttribute("aria-invalid", "true");

    if (!emailErrorMsg) {
      emailErrorMsg = document.createElement("div");
      emailErrorMsg.className = "field-error";
      emailFieldContainer.appendChild(emailErrorMsg);
    }
    emailErrorMsg.textContent = "Please enter a valid email address";

    if (!firstErrorField) firstErrorField = emailField;
    isValid = false;
  }

  // Focus first error field for better accessibility
  if (firstErrorField) {
    firstErrorField.focus();
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

// Blog Post button functionality with animation
document.addEventListener("DOMContentLoaded", function () {
  const blogPostButton = document.getElementById("blogPost");
  if (blogPostButton) {
    blogPostButton.addEventListener("click", function (e) {
      e.preventDefault();

      // Track blog interest
      trackEvent("blog_interest", {
        button_location: "about_page",
        feature_status: "coming_soon",
      });

      // Add loading animation
      this.innerHTML =
        '<span>Loading...</span> <div class="spinner-small"></div>';
      this.classList.add("loading");

      setTimeout(() => {
        this.textContent = "Coming soon";
        this.classList.remove("loading");
        this.style.pointerEvents = "none";
        this.style.opacity = "0.7";
        this.setAttribute("aria-disabled", "true");
      }, 1000);
    });
  }
});

// Console message for developers
console.log(
  "🏔️ LightPack Carpathian Adventures - Website loaded successfully!",
);
console.log(
  "🔄 Auto-reply functionality enabled - remember to create both email templates",
);

// Enhanced performance monitoring and error handling
window.addEventListener("load", function () {
  const loadTime =
    performance.timing.domContentLoadedEventEnd -
    performance.timing.navigationStart;
  console.log(`⚡ Page loaded in ${loadTime}ms`);

  // Check for critical resource loading issues
  if (loadTime > 5000) {
    console.warn("⚠️ Page load time is slow. Consider optimizing resources.");

    // Track slow page loads for optimization
    trackEvent("performance", {
      metric_name: "slow_page_load",
      load_time: loadTime,
      threshold: 5000,
    });
  }

  // Track general page performance
  trackEvent("performance", {
    metric_name: "page_load_time",
    load_time: loadTime,
  });
});

// Global error handler for better debugging
window.addEventListener("error", function (e) {
  console.error("🚨 JavaScript Error:", e.error);

  // Optional: Send error to analytics or logging service
  if (typeof gtag !== "undefined") {
    gtag("event", "exception", {
      description: e.error.message,
      fatal: false,
    });
  }
});

// Unhandled promise rejection handler
window.addEventListener("unhandledrejection", function (e) {
  console.error("🚨 Unhandled Promise Rejection:", e.reason);

  // Prevent the default browser error handling
  e.preventDefault();

  // Show user-friendly message for email sending failures
  if (e.reason && e.reason.toString().includes("emailjs")) {
    showFormStatus(
      "error",
      "Email service temporarily unavailable. Please try again later or contact us directly.",
    );
  }
});

// Network status monitoring
window.addEventListener("online", function () {
  console.log("🌐 Connection restored");
  const offlineMsg = document.querySelector(".offline-message");
  if (offlineMsg) offlineMsg.remove();
});

window.addEventListener("offline", function () {
  console.log("📡 Connection lost");

  // Show offline message
  const offlineMsg = document.createElement("div");
  offlineMsg.className = "offline-message important error";
  offlineMsg.innerHTML =
    "📡 You appear to be offline. Please check your internet connection.";
  document.body.insertBefore(offlineMsg, document.body.firstChild);

  // Track connectivity issues
  trackEvent("connectivity", {
    status: "offline",
    timestamp: new Date().toISOString(),
  });
});

// Track clicks on contact information
document.addEventListener("DOMContentLoaded", function () {
  // Track phone clicks
  const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
  phoneLinks.forEach((link) => {
    link.addEventListener("click", function () {
      trackBusinessGoal("contact_attempt", {
        contact_method: "phone",
        phone_number: this.href.replace("tel:", ""),
      });
    });
  });

  // Track email clicks
  const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
  emailLinks.forEach((link) => {
    link.addEventListener("click", function () {
      trackBusinessGoal("contact_attempt", {
        contact_method: "email",
        email_address: this.href.replace("mailto:", ""),
      });
    });
  });

  // Track service card interactions
  const serviceCards = document.querySelectorAll(".service-card");
  serviceCards.forEach((card, index) => {
    card.addEventListener("click", function () {
      const serviceTitle = this.querySelector("h3").textContent;
      const serviceClass = this.className
        .split(" ")
        .find((cls) => cls !== "service-card");

      trackEvent("service_interest", {
        service_name: serviceTitle,
        service_type: serviceClass,
        card_position: index + 1,
      });
    });
  });

  // Track CTA button clicks
  const ctaButtons = document.querySelectorAll(".btn");
  ctaButtons.forEach((button) => {
    button.addEventListener("click", function () {
      if (!this.disabled && this.textContent.includes("Request")) {
        trackBusinessGoal("cta_clicked", {
          button_text: this.textContent.trim(),
          button_location: this.closest("section")?.className || "unknown",
        });
      }
    });
  });

  // Track navigation menu usage
  const navLinks = document.querySelectorAll(".nav-menu a");
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      trackEvent("navigation", {
        menu_item: this.textContent.trim(),
        destination: this.getAttribute("onclick") || this.href,
      });
    });
  });
});

// Cookie Consent Management
function showCookieNotice() {
  const notice = document.getElementById("cookie-notice");
  const hasConsent = localStorage.getItem("cookie-consent");

  if (!hasConsent) {
    notice.style.display = "block";
  }
}

function acceptCookies() {
  localStorage.setItem("cookie-consent", "accepted");
  document.getElementById("cookie-notice").style.display = "none";

  // Enable analytics
  if (typeof gtag !== "undefined") {
    gtag("consent", "update", {
      analytics_storage: "granted",
    });
  }

  trackEvent("cookie_consent", {
    action: "accepted",
    timestamp: new Date().toISOString(),
  });
}

function declineCookies() {
  localStorage.setItem("cookie-consent", "declined");
  document.getElementById("cookie-notice").style.display = "none";

  // Disable analytics
  if (typeof gtag !== "undefined") {
    gtag("consent", "update", {
      analytics_storage: "denied",
    });
  }

  trackEvent("cookie_consent", {
    action: "declined",
    timestamp: new Date().toISOString(),
  });
}

function showCookieSettings() {
  document.getElementById("cookie-settings").style.display = "flex";
}

function closeCookieSettings() {
  document.getElementById("cookie-settings").style.display = "none";
}

function saveSettings() {
  const analyticsEnabled = document.getElementById("analytics-cookies").checked;

  localStorage.setItem("cookie-consent", "custom");
  localStorage.setItem("analytics-enabled", analyticsEnabled.toString());

  // Update consent based on settings
  if (typeof gtag !== "undefined") {
    gtag("consent", "update", {
      analytics_storage: analyticsEnabled ? "granted" : "denied",
    });
  }

  document.getElementById("cookie-notice").style.display = "none";
  document.getElementById("cookie-settings").style.display = "none";

  trackEvent("cookie_consent", {
    action: "custom_settings",
    analytics_enabled: analyticsEnabled,
    timestamp: new Date().toISOString(),
  });
}

// Initialize cookie notice on page load
document.addEventListener("DOMContentLoaded", function () {
  // Load the correct page based on URL hash
  loadPageFromHash();

  // Ensure proper blog post visibility
  setTimeout(() => {
    ensureBlogPostVisibility();
    initializeBlogFilters();
  }, 100);

  // Handle navigation link clicks
  const navLinks = document.querySelectorAll('a[href^="#"]');
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href && href.startsWith("#") && href.length > 1) {
        const pageId = href.substring(1);
        const validPages = [
          "home",
          "services",
          "plan",
          "about",
          "blog",
          "contact",
        ];
        if (validPages.includes(pageId)) {
          e.preventDefault();
          showPage(pageId);
        }
      }
    });
  });

  // Show cookie notice after a short delay
  setTimeout(showCookieNotice, 2000);

  // Pre-fill settings modal based on stored preferences
  const analyticsEnabled = localStorage.getItem("analytics-enabled") === "true";
  const analyticsCheckbox = document.getElementById("analytics-cookies");
  if (analyticsCheckbox) {
    analyticsCheckbox.checked = analyticsEnabled;
  }
});
