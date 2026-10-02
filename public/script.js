// ===== helpers =====
const $ = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];

// Year in footer
$("#year").textContent = new Date().getFullYear();

// Scroll progress bar
const progress = $("#progress");
window.addEventListener("scroll", () => {
  const h = document.documentElement;
  const scrolled = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
  progress.style.width = `${Math.min(100, Math.max(0, scrolled))}%`;
});

// Reveal on scroll
const obs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("show");
    });
  },
  { threshold: 0.12 }
);
$$(".reveal").forEach((el) => obs.observe(el));

// Count-up stats
function animateCount(el) {
  const target = Number(el.dataset.count || "0");
  let cur = 0;
  const step = Math.max(1, Math.floor(target / 60));
  const timer = setInterval(() => {
    cur += step;
    if (cur >= target) {
      el.textContent = target;
      clearInterval(timer);
    } else {
      el.textContent = cur;
    }
  }, 18);
}

const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      $$(".stat-num").forEach((n) => animateCount(n));
      statsObserver.disconnect();
    });
  },
  { threshold: 0.5 }
);
statsObserver.observe($(".hero-card"));

// Theme toggle (saved)
const themeBtn = $("#themeBtn");
const themeIconImg = $("#themeIconImg");
const saved = localStorage.getItem("theme");

if (saved === "light") document.body.classList.add("light");

function updateThemeIcon() {
  const isLight = document.body.classList.contains("light");

  themeIconImg.classList.add("switching");

  setTimeout(() => {
    themeIconImg.src = isLight ? "assets/sun.png" : "assets/moon.png";
    themeIconImg.classList.remove("switching");
  }, 180);
}

updateThemeIcon();

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("light");
  const isLight = document.body.classList.contains("light");
  localStorage.setItem("theme", isLight ? "light" : "dark");
  updateThemeIcon();
});

// Mobile menu
const burger = $("#burger");
const navLinks = $("#navLinks");

burger.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

$$('#navLinks a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove("open"));
});

// Contact form (Firebase Function)
const form = $("#contactForm");
const status = $("#formStatus");

const FUNCTION_URL =
  "https://us-central1-portfolio-website-74754-c042a.cloudfunctions.net/contact";

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  status.textContent = "Sending...";

  try {
    const payload = {
      name: form.elements["name"]?.value?.trim() || "",
      email: form.elements["email"]?.value?.trim() || "",
      message: form.elements["message"]?.value?.trim() || "",
      website: form.elements["website"]?.value || "" // honeypot
    };

    const res = await fetch(FUNCTION_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => null);

    status.textContent =
      data?.message ||
      "Something went wrong. Please email me directly at tharuka.ykw@outlook.com.";

    if (data?.ok) form.reset();
  } catch (err) {
    status.textContent =
      "Network error. Please email me directly at tharuka.ykw@outlook.com.";
  }
});


const resumeBtn = $("#resumeBtn");

if (resumeBtn) {
  resumeBtn.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.assign("/assets/Tharuka_Resume.pdf");
  });
}