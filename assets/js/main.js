// SPDX-License-Identifier: GPL-3.0-or-later
// RL PROJECTS — site: the deck, the catalogue and the gallery.

const $ = (s) => document.querySelector(s);

// --------------------------------------------------------------- page bits
const header = $("#site-header");
addEventListener("scroll", () => {
  header.classList.toggle("scrolled", scrollY > 40);
}, { passive: true });

// OpenShooter gallery
document.querySelectorAll("[data-gallery]").forEach((g) => {
  const main = g.querySelector("[data-gallery-main]");
  const cap = g.querySelector("[data-gallery-caption]");
  g.querySelectorAll("[data-gallery-thumb]").forEach((b) => {
    b.addEventListener("click", () => {
      g.querySelectorAll("[data-gallery-thumb]").forEach((x) => x.setAttribute("aria-current", "false"));
      b.setAttribute("aria-current", "true");
      main.src = b.dataset.src;
      main.alt = b.dataset.alt;
      cap.textContent = b.dataset.alt;
    });
  });
});

// decks: "Building the future with ..." and the 2027 roadmap.
// Each section marked [data-deck-section] runs its own carousel.
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const params = new URLSearchParams(location.search);

function setupDeck(section) {
  const deck = section.querySelector("[data-deck]");
  const slides = [...deck.querySelectorAll("[data-slide]")];
  const current = section.querySelector("[data-current]");
  const bar = section.querySelector("[data-progress]");
  const bgs = [...section.querySelectorAll("[data-bg]")];
  const credit = section.querySelector("[data-credit]");
  const DWELL = 8000;
  let index = 0;
  let auto = !reducedMotion;      // stops for good once the visitor takes over
  let inView = false;
  let timer = 0;

  function paint(i) {
    bgs.forEach((b, k) => b.classList.toggle("is-active", k === i));
    if (credit) credit.textContent = slides[i].dataset.caption || "";
  }

  function show(next) {
    next = (next + slides.length) % slides.length;
    if (next === index) return;
    const prev = slides[index];
    const incoming = slides[next];
    prev.classList.remove("is-active");
    prev.classList.add("is-leaving");
    setTimeout(() => {
      prev.classList.remove("is-leaving");
      prev.hidden = true;
    }, reducedMotion ? 0 : 700);
    incoming.hidden = false;
    void incoming.offsetWidth;          // start the slide-out from behind the edge
    incoming.classList.add("is-active");
    index = next;
    current.textContent = String(index + 1);
    paint(index);
    arm();
  }

  function arm() {
    clearTimeout(timer);
    bar.classList.remove("run");
    if (!auto || !inView || slides.length < 2) return;
    void bar.offsetWidth;
    bar.style.animationDuration = DWELL + "ms";
    bar.classList.add("run");
    timer = setTimeout(() => show(index + 1), DWELL);
  }

  function takeOver(step) {
    auto = false;
    show(index + step);
    arm();
  }

  section.querySelector("[data-prev]").addEventListener("click", () => takeOver(-1));
  section.querySelector("[data-next]").addEventListener("click", () => takeOver(1));
  section.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") { e.preventDefault(); takeOver(1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); takeOver(-1); }
  });
  let x0 = null;
  deck.addEventListener("pointerdown", (e) => { x0 = e.clientX; });
  deck.addEventListener("pointerup", (e) => {
    if (x0 !== null && Math.abs(e.clientX - x0) > 50) takeOver(e.clientX < x0 ? 1 : -1);
    x0 = null;
  });
  new IntersectionObserver(([e]) => { inView = e.isIntersecting; arm(); }, { threshold: 0.5 })
    .observe(section);

  // preview hook: ?slide=2 (vision) or ?road=2 (roadmap), no transitions
  const want = parseInt(params.get(section.dataset.deckSection), 10);
  if (want) document.documentElement.classList.add("preview");
  if (want > 1) {
    auto = false;
    slides.forEach((s, i) => { s.hidden = i !== want - 1; s.classList.toggle("is-active", i === want - 1); });
    index = want - 1;
    current.textContent = String(want);
    paint(index);
  }
}
document.querySelectorAll("[data-deck-section]").forEach(setupDeck);

// preview hook: ?only=roadmap shows a single section (screenshots)
if (params.get("only")) {
  document.querySelectorAll("main > section").forEach((sec) => { sec.hidden = sec.id !== params.get("only"); });
}

$("#year").textContent = new Date().getFullYear();
