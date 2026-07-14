/* ============ Versaace.com — interactions ============ */

// ---------- Mobile nav ----------
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

navToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  navToggle.classList.toggle("open", open);
  navToggle.setAttribute("aria-expanded", String(open));
});

// Close the mobile menu when a link is tapped
navLinks.addEventListener("click", (e) => {
  if (e.target.tagName === "A") {
    navLinks.classList.remove("open");
    navToggle.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

// ---------- iPhone condition filter ----------
const filterRow = document.getElementById("phoneFilters");
const phoneCards = document.querySelectorAll("#phoneGrid .product");

filterRow.addEventListener("click", (e) => {
  const chip = e.target.closest(".chip");
  if (!chip) return;
  filterRow.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
  chip.classList.add("active");
  const filter = chip.dataset.filter;
  phoneCards.forEach((card) => {
    card.classList.toggle("hidden", filter !== "all" && card.dataset.condition !== filter);
  });
});

// ---------- Trade-in estimator ----------
const tiModel = document.getElementById("tiModel");
const tiCondition = document.getElementById("tiCondition");
const tiValue = document.getElementById("tiValue");

function updateTradeIn() {
  const base = parseFloat(tiModel.value);
  const factor = parseFloat(tiCondition.value);
  const estimate = Math.round((base * factor) / 5) * 5; // round to nearest $5
  tiValue.textContent = "$" + estimate;
}
tiModel.addEventListener("change", updateTradeIn);
tiCondition.addEventListener("change", updateTradeIn);
updateTradeIn();

// ---------- "Enquire" buttons pre-select the product in the contact form ----------
const cfProduct = document.getElementById("cfProduct");
document.querySelectorAll("[data-product]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const product = btn.dataset.product;
    const option = Array.from(cfProduct.options).find((o) => o.text === product);
    cfProduct.value = option ? option.text : "Other";
  });
});

// ---------- Contact form (mailto handoff) ----------
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

contactForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("cfName").value.trim();
  const email = document.getElementById("cfEmail").value.trim();
  const product = cfProduct.value;
  const message = document.getElementById("cfMessage").value.trim();

  if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    formStatus.textContent = "Please enter your name and a valid email address.";
    return;
  }

  const subject = encodeURIComponent(`Enquiry: ${product} — ${name}`);
  const body = encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\nInterested in: ${product}\n\n${message}`
  );
  window.location.href = `mailto:sales@versaace.com?subject=${subject}&body=${body}`;
  formStatus.textContent = "Opening your email app… We'll reply within one business day.";
  contactForm.reset();
});

// ---------- Small touches ----------
document.getElementById("year").textContent = new Date().getFullYear();

// Live clock on the hero phone mock
const phoneClock = document.getElementById("phoneClock");
function tickClock() {
  const now = new Date();
  phoneClock.textContent =
    now.getHours().toString().padStart(2, "0") + ":" + now.getMinutes().toString().padStart(2, "0");
}
tickClock();
setInterval(tickClock, 30000);
