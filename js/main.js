const navLinks = document.getElementById("navLinks");
const themeToggle = document.getElementById("themeToggle");
const printBtn = document.getElementById("printBtn");
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const liveClock = document.getElementById("liveClock");
const quoteLine = document.getElementById("quoteLine");
const portfolioData = window.portfolioData || {};
const ui = portfolioData.ui || {};
const icons = ui.icons || {};
const formCopy = portfolioData.contactForm || {};
const icon = (name) => name ? `<i class="${name}"></i>` : "";

const savedTheme = localStorage.getItem("portfolio-theme");
if (savedTheme) {
  document.documentElement.dataset.theme = savedTheme;
  themeToggle.innerHTML = savedTheme === "light" ? icon(icons.themeLight) : icon(icons.themeDark);
}

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    if (targetId && targetId.startsWith("#")) {
      event.preventDefault();
      const target = document.querySelector(targetId);
      if (target) {
        window.scrollTo({ top: target.offsetTop - 82, behavior: "smooth" });
      }
    }
    navLinks.classList.remove("show");
  });
});

themeToggle.addEventListener("click", () => {
  const isLight = document.documentElement.dataset.theme === "light";
  const nextTheme = isLight ? "dark" : "light";
  document.documentElement.dataset.theme = nextTheme;
  localStorage.setItem("portfolio-theme", nextTheme);
  themeToggle.innerHTML = isLight ? icon(icons.themeDark) : icon(icons.themeLight);
});

printBtn.addEventListener("click", () => window.print());

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    formStatus.textContent = formCopy.invalidEmail || "";
    formStatus.classList.add("show");
    return;
  }

  const subject = formCopy.subject || "";
  const body = (formCopy.bodyLines || []).map((line) => (
    line.replace("{{name}}", name).replace("{{email}}", email).replace("{{message}}", message)
  )).join("\n");

  window.location.href = "mailto:" + formCopy.recipient + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  formStatus.textContent = (formCopy.success || "").replace("{{name}}", name);
  formStatus.classList.add("show");
  contactForm.reset();
});

const counters = document.querySelectorAll("[data-count]");
const counterObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const item = entry.target;
    const target = Number(item.dataset.count);
    const isCgpa = target === 799;
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 48));
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      item.textContent = isCgpa ? (current / 100).toFixed(2) : current + "+";
    }, 26);
    observer.unobserve(item);
  });
}, { threshold: 0.4 });

counters.forEach((counter) => counterObserver.observe(counter));

function updateClock() {
  liveClock.textContent = portfolioData.footer.clockPrefix + " " + new Date().toLocaleTimeString(portfolioData.ui.time.locale, { timeZone: portfolioData.ui.time.timeZone });
}
updateClock();
setInterval(updateClock, 1000);

const quotes = portfolioData.footer.quotes || [];
quoteLine.textContent = quotes[new Date().getDate() % quotes.length];


