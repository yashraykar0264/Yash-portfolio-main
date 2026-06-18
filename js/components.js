const menuBtn = document.getElementById("menuBtn");
const videoBtn = document.getElementById("videoBtn");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const closeLightbox = document.getElementById("closeLightbox");
const introModal = document.getElementById("introModal");
const closeIntro = document.getElementById("closeIntro");
const backTop = document.getElementById("backTop");

menuBtn.addEventListener("click", () => navLinks.classList.toggle("show"));

videoBtn.addEventListener("click", () => {
  introModal.classList.add("show");
  closeIntro.focus();
});

function hideIntro() {
  introModal.classList.remove("show");
  videoBtn.focus();
}
closeIntro.addEventListener("click", hideIntro);
introModal.addEventListener("click", (event) => {
  if (event.target === introModal) hideIntro();
});

document.querySelectorAll("section, .card, .project-card, .journey-card, .certificate-card, .blog-card, .testimonial-card, .sample-student").forEach((item) => {
  item.classList.add("reveal");
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));

document.querySelectorAll(".read-more").forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".blog-card");
    const labels = window.portfolioData.sections.blog;
    const bookOpenIcon = window.portfolioData.ui.icons.bookOpen;
    card.classList.toggle("expanded");
    button.innerHTML = '<i class="' + bookOpenIcon + '"></i> ' + (card.classList.contains("expanded") ? labels.showLessLabel : labels.readMoreLabel);
  });
});

// document.querySelectorAll(".certificate-card").forEach((card) => {
//   card.addEventListener("click", () => {
//     lightboxImage.src = card.dataset.full;
//     lightbox.classList.add("show");
//     closeLightbox.focus();
//   });
// });

function hideLightbox() {
  lightbox.classList.remove("show");
  lightboxImage.src = "";
}

closeLightbox.addEventListener("click", hideLightbox);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) hideLightbox();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") hideLightbox();
  if (event.key === "Escape" && introModal.classList.contains("show")) hideIntro();
});

backTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
window.addEventListener("scroll", () => {
  backTop.classList.toggle("show", window.scrollY > 520);
});


