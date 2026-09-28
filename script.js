// Mingle Tennis WhatsApp (054 902 9200) in international format, digits only
const WHATSAPP_NUMBER = "233549029200";

// ---------- Header: solid background after scrolling ----------
const header = document.querySelector(".site-header");
const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 20);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

// ---------- Mobile menu ----------
const menuBtn = document.querySelector(".menu-btn");
const mobileMenu = document.getElementById("mobile-menu");

function setMenu(open) {
  menuBtn.setAttribute("aria-expanded", String(open));
  menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  mobileMenu.hidden = !open;
  document.body.classList.toggle("menu-open", open);
}

menuBtn.addEventListener("click", () => setMenu(menuBtn.getAttribute("aria-expanded") !== "true"));
mobileMenu.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !mobileMenu.hidden) { setMenu(false); menuBtn.focus(); }
});
window.matchMedia("(min-width: 1100px)").addEventListener("change", (e) => { if (e.matches) setMenu(false); });

// ---------- Reveal on scroll ----------
const revealTargets = document.querySelectorAll(
  ".section-head, .schedule-card, .program-card, .coach-photo, .coach-copy, .price-card, .gallery-grid, .testimonial, .faq-list, .book-form"
);
if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("in"); io.unobserve(entry.target); }
    });
  }, { rootMargin: "0px 0px -10% 0px" });
  revealTargets.forEach((el) => {
    // Stagger cards that sit side by side in a grid
    const siblings = [...el.parentElement.children].filter((c) => c.matches(".schedule-card, .program-card, .price-card, .testimonial"));
    const i = siblings.indexOf(el);
    if (i > 0) el.style.setProperty("--d", `${i * 90}ms`);
    el.classList.add("reveal");
    io.observe(el);
  });
}

// ---------- Mobile quick-contact bar: show after the hero, hide at the booking section ----------
const mobileCta = document.getElementById("mobile-cta");
const hero = document.querySelector(".hero");
const bookSection = document.getElementById("book");
if (mobileCta && "IntersectionObserver" in window) {
  let pastHero = false, atBook = false;
  const update = () => mobileCta.classList.toggle("show", pastHero && !atBook);
  new IntersectionObserver(([e]) => { pastHero = !e.isIntersecting; update(); }).observe(hero);
  new IntersectionObserver(([e]) => { atBook = e.isIntersecting; update(); }).observe(bookSection);
}

// ---------- Booking form → WhatsApp ----------
const form = document.getElementById("book-form");

function validate(input, errorEl) {
  const ok = input.value.trim().length > 0;
  input.setAttribute("aria-invalid", String(!ok));
  if (ok) input.removeAttribute("aria-describedby");
  else input.setAttribute("aria-describedby", errorEl.id);
  errorEl.hidden = ok;
  return ok;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = form.elements.name;
  const phone = form.elements.phone;
  const nameOk = validate(name, document.getElementById("f-name-err"));
  const phoneOk = validate(phone, document.getElementById("f-phone-err"));
  if (!nameOk) return name.focus();
  if (!phoneOk) return phone.focus();

  const lines = [
    "Hi Mingle Tennis! I'd like to book a spot.",
    `Name: ${name.value.trim()}`,
    `Phone: ${phone.value.trim()}`,
    `Session: ${form.elements.program.value}`,
    `Preferred day: ${form.elements.day.value}`,
  ];
  const msg = form.elements.message.value.trim();
  if (msg) lines.push(`Notes: ${msg}`);

  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank", "noopener");
});

["name", "phone"].forEach((field) => {
  form.elements[field].addEventListener("input", (e) => {
    if (e.target.getAttribute("aria-invalid") === "true") validate(e.target, document.getElementById(`f-${field}-err`));
  });
});

document.getElementById("year").textContent = new Date().getFullYear();
