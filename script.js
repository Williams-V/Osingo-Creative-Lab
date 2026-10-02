/* =====================================================
   OSINGO CREATIVE LAB — SCRIPT
   Handles: nav state, mobile menu, portfolio filtering,
   animated stat counters, showreel toggle, footer year,
   and sending the booking form straight to WhatsApp.
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const WHATSAPP_NUMBER = "254707426406"; // no plus sign, no leading zero

  initNavScrollState();
  initMobileMenu();
  initWorkFilters();
  initStatCounters();
  initShowreelToggle();
  initBookingForm(WHATSAPP_NUMBER);
  document.getElementById("year").textContent = new Date().getFullYear();
});

/* ---------- Nav: solid background after scrolling past hero ---------- */
function initNavScrollState() {
  const nav = document.getElementById("nav");
  if (!nav) return;

  const setState = () => {
    nav.classList.toggle("is-scrolled", window.scrollY > 40);
  };

  setState();
  window.addEventListener("scroll", setState, { passive: true });
}

/* ---------- Mobile menu toggle ---------- */
function initMobileMenu() {
  const burger = document.getElementById("navBurger");
  const links = document.getElementById("navLinks");
  if (!burger || !links) return;

  burger.addEventListener("click", () => {
    const isOpen = links.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", String(isOpen));
  });

  links.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      links.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
    });
  });
}

/* ---------- Portfolio filtering ---------- */
function initWorkFilters() {
  const buttons = document.querySelectorAll("#workFilters .filter-btn");
  const items = document.querySelectorAll("#workGrid .work-item");
  if (!buttons.length || !items.length) return;

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");

      const filter = btn.dataset.filter;

      items.forEach((item) => {
        const match = filter === "all" || item.dataset.category === filter;
        item.classList.toggle("is-hidden", !match);
      });
    });
  });
}

/* ---------- Animated stat counters (run once, on scroll into view) ---------- */
function initStatCounters() {
  const counters = document.querySelectorAll(".stat__num");
  if (!counters.length) return;

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.count, 10) || 0;
    const duration = 1200;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );

  counters.forEach((counter) => observer.observe(counter));
}

/* ---------- Showreel player (visual toggle placeholder) ---------- */
function initShowreelToggle() {
  const player = document.getElementById("showreelPlayer");
  const label = player ? player.querySelector(".showreel__label") : null;
  if (!player || !label) return;

  player.addEventListener("click", () => {
    const isPlaying = player.classList.toggle("is-playing");
    label.textContent = isPlaying
      ? "Add your showreel video source to replace this placeholder"
      : "Watch full showreel";
  });
}

/* ---------- Booking form: build a WhatsApp message and open it ---------- */
function initBookingForm(whatsappNumber) {
  const form = document.getElementById("bookingForm");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const get = (key) => (data.get(key) || "").toString().trim();

    const lines = [
      "New project enquiry — Osingo Creative Lab",
      "",
      `Name: ${get("name")}`,
      `Phone/WhatsApp: ${get("phone")}`,
    ];

    if (get("email")) lines.push(`Email: ${get("email")}`);
    if (get("company")) lines.push(`Company/Brand: ${get("company")}`);

    lines.push(`Project type: ${get("projectType")}`);
    lines.push(`Estimated budget: ${get("budget")}`);

    if (get("projectDate")) lines.push(`Project date: ${get("projectDate")}`);
    if (get("location")) lines.push(`Location: ${get("location")}`);
    if (get("details")) lines.push("", `Project details: ${get("details")}`);

    const message = encodeURIComponent(lines.join("\n"));
    const url = `https://wa.me/${whatsappNumber}?text=${message}`;

    window.open(url, "_blank", "noopener");
  });
}