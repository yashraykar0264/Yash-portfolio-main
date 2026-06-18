(async function renderPortfolio() {
  let data;
  try {
    const response = await fetch("data/portfolio.json");
    data = await response.json();
  } catch (error) {
    console.error(error);
    return;
  }
  window.portfolioData = data;
  const ui = data.ui;

  const $ = (selector) => document.querySelector(selector);
  const safe = (value = "") =>
    String(value).replace(
      /[&<>"']/g,
      (char) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#039;",
        })[char],
    );
  const icon = (name) => (name ? `<i class="${safe(name)}"></i>` : "");
  const externalAttrs = (href = "") =>
    href.startsWith("http") ? ' target="_blank" rel="noreferrer"' : "";
  const sectionHead = (section) => `
    <div class="section-head">
      <div>
        <p class="eyebrow">${icon(section.eyebrow.icon)} ${safe(section.eyebrow.text)}</p>
        <h2 class="section-title">${safe(section.title)}</h2>
      </div>
      <p class="section-note">${safe(section.note)}</p>
    </div>
  `;
  const button = (item) => {
    const classes = `btn ${item.variant === "primary" ? "btn-primary" : "btn-outline"}`;
    if (item.buttonId) {
      return `<button class="${classes}" id="${safe(item.buttonId)}" type="button">${icon(item.icon)} ${safe(item.label)}</button>`;
    }
    return `<a class="${classes}" href="${safe(item.href)}"${item.download ? " download" : ""}${externalAttrs(item.href)}>${icon(item.icon)} ${safe(item.label)}</a>`;
  };
  const tag = (label) => `<span class="tag">${safe(label)}</span>`;

  document.title = data.meta.title;
  document.documentElement.lang = ui.language;
  $("#pageTitle").textContent = data.meta.title;
  $("#pageDescription").setAttribute("content", data.meta.description);
  $("#brandLink").setAttribute("aria-label", ui.aria.brandHome);
  $("#themeToggle").setAttribute("aria-label", ui.aria.themeToggle);
  $("#themeToggle").setAttribute("title", ui.aria.themeToggle);
  $("#menuBtn").setAttribute("aria-label", ui.aria.menuButton);
  $("#menuBtn").setAttribute("title", ui.aria.menuButton);
  $("#backTop").setAttribute("aria-label", ui.aria.backToTop);
  $("#backTop").setAttribute("title", ui.aria.backToTop);
  $("#closeLightbox").setAttribute("aria-label", ui.aria.closeLightbox);
  $("#themeToggle").innerHTML = icon(ui.icons.themeDark);
  $("#menuBtn").innerHTML = icon(ui.icons.menu);
  $("#backTop").innerHTML = icon(ui.icons.backToTop);
  $("#closeLightbox").innerHTML = icon(ui.icons.close);

  $("#brandLink").innerHTML = `
    <span class="brand-mark">${safe(data.brand.mark)}</span>
    <span>${safe(data.brand.name)}</span>
  `;

  $("#navLinks").innerHTML = data.navigation
    .map(
      (item) => `
    <li><a href="#${safe(item.id)}">${icon(item.icon)} ${safe(item.label)}</a></li>
  `,
    )
    .join("");

  const hero = data.hero;
  const main = $("#home");
  main.innerHTML = `
    <section class="hero">
      <div class="container hero-grid">
        <div>
          <p class="eyebrow">${icon(hero.eyebrow.icon)} ${safe(hero.eyebrow.text)}</p>
          <div class="mobile-profile-chip" aria-label="${safe(ui.aria.mobileProfilePreview)}">
            <img src="${safe(hero.profileImage)}" alt="${safe(hero.profileImageAlt)}">
            <span>${safe(data.brand.name)}</span>
          </div>
          <h1><span class="gradient-text glitch" data-text="${safe(hero.name)}">${safe(hero.name)}</span></h1>
          <div class="typing-line" id="typingLine" aria-label="${safe(ui.aria.typingLine)}"></div>
          <p class="lead">${safe(hero.lead)}</p>
          <div class="hero-badges" aria-label="${safe(ui.aria.portfolioHighlights)}">
            ${hero.badges.map((badge) => `<span class="hero-badge">${icon(badge.icon)} ${safe(badge.text)}</span>`).join("")}
          </div>
          <div class="hero-actions">${hero.actions.map(button).join("")}</div>
          <div class="stats-grid" aria-label="${safe(ui.aria.quickStats)}">
            ${hero.stats
              .map(
                (stat) => `
              <div class="stat-card">
                <div class="stat-number" data-count="${safe(stat.count)}">0</div>
                <div class="stat-label">${icon(stat.icon)} ${safe(stat.label)}</div>
              </div>
            `,
              )
              .join("")}
          </div>
        </div>
        <aside class="profile-panel">
          <img class="profile-photo" src="${safe(hero.profileImage)}" alt="${safe(hero.profileImageAlt)}">
          <div class="profile-info">
            <p class="mono">${icon(ui.icons.mapMarker)} ${safe(hero.panel.location)}</p>
            <h2>${icon(ui.icons.layerGroup)} ${safe(hero.panel.role)}</h2>
            <p>${safe(hero.panel.stack)}</p>
          </div>
          <div class="availability-card">
            <strong>${icon(ui.icons.bolt)} ${safe(hero.panel.title)}</strong>
            <div class="mini-list">
              ${hero.panel.items.map((item) => `<span>${icon(ui.icons.checkCircle)} ${safe(item)}</span>`).join("")}
            </div>
          </div>
        </aside>
      </div>
    </section>
    ${renderAbout(data.sections.about)}
    ${renderAcademics(data.sections.academics)}
   
    ${renderJourney(data.sections.journey)}
    
    ${renderAchievements(data.sections.achievements)}
    ${renderProjects(data.sections.projects)}
    
    ${renderSkills(data.sections.skills)}
    
    
    ${renderContact(data.sections.contact)}
  `;

  $("#footer").innerHTML = `
    <div class="container">
      <p>${icon(ui.icons.copyright)} ${safe(data.footer.copyright)}</p>
      <p class="quote-line" id="quoteLine">${icon(ui.icons.quote)} </p>
      <p id="liveClock" class="mono">${icon(ui.icons.clock)} </p>
    </div>
  `;

  if (data.sections.certificates) {
    $("#lightboxImage").setAttribute("alt", data.sections.certificates.note);
  }
  $("#introModal").innerHTML = `
    <button class="icon-btn close-intro" id="closeIntro" type="button" aria-label="${safe(ui.aria.closeIntro)}">${icon(ui.icons.close)}</button>
    <div class="intro-card">
      <div class="intro-screen">${icon(ui.icons.play)}</div>
      <div class="intro-content">
        <p class="mono">${icon(ui.icons.userTie)} ${safe(data.intro.label)}</p>
        <h2 id="introTitle">${safe(data.intro.title)}</h2>
        <p>${safe(data.intro.text)}</p>
        <div class="hero-actions">${data.intro.actions.map(button).join("")}</div>
      </div>
    </div>
  `;

  loadScript(ui.scripts.main, () => {
    loadScript(ui.scripts.animations, () => loadScript(ui.scripts.components));
  });

  function renderAbout(section) {
    return `
      <section id="about">
        <div class="container">
          ${sectionHead(section)}
          <div class="two-col">
            <div class="card">
              <h3>${icon(section.objective.icon)} ${safe(section.objective.title)}</h3>
              <p>${safe(section.objective.text)}</p>
              <div class="social-row">${section.objective.links.map(button).join("")}</div>
            </div>
            <div class="card">
              <h3>${icon(ui.icons.idCard)} ${safe(section.detailsTitle)}</h3>
              <div class="info-grid">
                ${section.details.map((item) => `<div class="info-item"><span>${icon(item.icon)} ${safe(item.label)}</span>${safe(item.value)}</div>`).join("")}
              </div>
            </div>
          </div>
          <div class="recruiter-panel" aria-label="${safe(ui.aria.recruiterSnapshot)}">
            ${section.snapshot.map((item) => `<div class="recruiter-item"><span>${icon(item.icon)} ${safe(item.label)}</span><strong>${safe(item.value)}</strong></div>`).join("")}
          </div>
        </div>
      </section>
    `;
  }

  function renderAcademics(section) {
    return `
      <section id="academics">
        <div class="container">
          ${sectionHead(section)}
          <div class="two-col">
            <div class="timeline">${section.education.map(timelineCard).join("")}</div>
            <div class="card">
              <h3>${icon(ui.icons.database)} ${safe(section.assetsTitle)}</h3>
              <p>${safe(section.assetsText)}</p>
              <table class="subject-table" aria-label="${safe(ui.aria.academicProgressTable)}">
                <thead><tr>${ui.tableHeaders.academicProgress.map((heading) => `<th>${safe(heading)}</th>`).join("")}</tr></thead>
                <tbody>
                  ${section.progress.map((item) => `<tr><td>${icon(item.icon)} ${safe(item.area)}</td><td>${safe(item.level)}</td><td><div class="bar"><span style="--value: ${safe(item.value)}"></span></div></td></tr>`).join("")}
                </tbody>
              </table>
              <div class="image-strip">
                ${section.institutions.map((item) => `<div class="image-tile"><img src="${safe(item.image)}" alt="${safe(item.alt)}"><span>${icon(item.icon)} ${safe(item.label)}</span></div>`).join("")}
              </div>
              <div class="result-groups" aria-label="${safe(ui.aria.resultLinks)}">
                ${section.scorecards
                  .map(
                    (group) => `
                  <div class="result-group">
                    <h4>${icon(group.icon)} ${safe(group.title)} <span>${safe(group.subtitle)}</span></h4>
                    <div class="scorecard-links">
                      ${group.links.map((link) => `<a href="${safe(link.href)}" target="_blank" rel="noreferrer">${safe(link.label)} ${icon(ui.icons.filePdf)}</a>`).join("")}
                    </div>
                  </div>
                `,
                  )
                  .join("")}
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function timelineCard(item) {
    return `
      <article class="timeline-card">
        <span class="year-pill">${icon(ui.icons.calendar)} ${safe(item.period)}</span>
        <p class="mono">${icon(item.icon)} ${safe(item.meta)}</p>
        <h3>${icon(ui.icons.university)} ${safe(item.title)}</h3>
        <p>${safe(item.text)}</p>
      </article>
    `;
  }

  function renderJourney(section) {
    return `
      <section id="journey">
        <div class="container">
          ${sectionHead(section)}
          <div class="journey-grid">
            ${section.items.map((item) => `<article class="journey-card">${icon(item.icon)}<h3>${icon(item.titleIcon)} ${safe(item.title)}</h3><p>${safe(item.text)}</p></article>`).join("")}
          </div>
        </div>
      </section>
    `;
  }

  function renderAutomation(section) {
    return `
      <section id="automation">
        <div class="container">
          ${sectionHead(section)}
          <div class="automation-grid">
            <div class="card">
              <h3>${icon(ui.icons.layerGroup)} ${safe(section.workflowTitle)}</h3>
              <div class="journey-grid automation-steps">
                ${section.workflow.map((item) => `<article class="journey-card">${icon(item.icon)}<h3>${safe(item.title)}</h3><p>${safe(item.text)}</p></article>`).join("")}
              </div>
            </div>
            <div class="card">
              <h3>${icon(ui.icons.database)} ${safe(section.fieldsTitle)}</h3>
              <div class="tags">${section.supportedFields.map(tag).join("")}</div>
            </div>
            <div class="card">
              <h3>${icon(ui.icons.idCard)} ${safe(section.sampleTitle)}</h3>
              <div class="sample-students">
                ${section.sampleStudents
                  .map(
                    (student) => `
                  <article class="sample-student">
                    <h4>${safe(student.studentName)}</h4>
                    <div class="info-grid">
                      <div class="info-item"><span>School</span>${safe(student.school)}</div>
                      <div class="info-item"><span>Grade</span>${safe(student.grade)}</div>
                      <div class="info-item"><span>Category</span>${safe(student.category)}</div>
                      <div class="info-item"><span>Certificate</span>${safe(student.certificate)}</div>
                    </div>
                    <div class="tags">${student.mappedSections.map(tag).join("")}</div>
                  </article>
                `,
                  )
                  .join("")}
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function renderExperience(section) {
    return `
      <section id="experience">
        <div class="container">
          ${sectionHead(section)}
          <div class="timeline">${section.items.map(timelineCard).join("")}</div>
        </div>
      </section>
    `;
  }

  function renderAchievements(section) {
    return `
      <section id="achievements">
        <div class="container">
          ${sectionHead(section)}
          <div class="achievement-list">
            ${section.items.map((item) => `<div class="achievement-item">${icon(item.icon)}<div><h3>${icon(item.titleIcon)} ${safe(item.title)}</h3><p>${safe(item.text)}</p></div></div>`).join("")}
          </div>
        </div>
      </section>
    `;
  }

  function renderProjects(section) {
    return `
      <section id="projects">
        <div class="container">
          ${sectionHead(section)}
          <div class="project-grid">
            ${section.items
              .map(
                (project) => `
              <article class="project-card" data-back="${safe(project.back)}">
                ${project.image ? `<img src="${safe(project.image)}" alt="${safe(project.alt)}">` : `<div class="project-visual" role="img" aria-label="${safe(project.visualLabel)}">${icon(project.visualIcon)}<span>${safe(project.visualLabel)}</span></div>`}
                <div class="project-body">
                  <h3>${icon(project.icon)} ${safe(project.title)}</h3>
                  <p>${safe(project.description)}</p>
                  <div class="tags">${project.tags.map(tag).join("")}</div>
                  <div class="project-actions">${project.links.map(button).join("")}</div>
                </div>
              </article>
            `,
              )
              .join("")}
          </div>
        </div>
      </section>
    `;
  }

  function renderCertificates(section) {
    return `
      <section id="certificates">
        <div class="container">
          ${sectionHead(section)}
          <div class="certificate-grid">
            ${section.items.map((item) => `<button class="certificate-card" type="button" data-full="${safe(item.image)}"><img src="${safe(item.image)}" alt="${safe(item.alt)}"><span>${icon(item.icon)} ${safe(item.title)}</span></button>`).join("")}
          </div>
        </div>
      </section>
    `;
  }

  function renderSkills(section) {
    return `
      <section id="skills">
        <div class="container">
          ${sectionHead(section)}
          <div class="skills-grid">
            <div class="rings-grid" style="grid-column: 1 / -1;">
              ${section.rings.map((item) => `<div class="skill-ring"><div class="ring" style="--percent: ${safe(item.percent)}">${safe(item.percent)}%</div><strong>${icon(item.icon)} ${safe(item.label)}</strong></div>`).join("")}
            </div>
            ${section.groups.map((group) => `<div class="skill-box"><h3>${icon(group.icon)} ${safe(group.title)}</h3><div class="skill-list">${group.items.map(tag).join("")}</div></div>`).join("")}
          </div>
        </div>
      </section>
    `;
  }

  function renderBlog(section) {
    return `
      <section id="blog">
        <div class="container">
          ${sectionHead(section)}
          <div class="blog-grid">
            ${section.items.map((post) => `<article class="blog-card"><p class="date">${icon(ui.icons.calendar)} ${safe(post.date)}</p><h3>${icon(post.icon)} ${safe(post.title)}</h3><p>${safe(post.summary)}</p><p class="more">${safe(post.more)}</p><button class="btn btn-outline read-more" type="button">${icon(ui.icons.bookOpen)} ${safe(section.readMoreLabel)}</button></article>`).join("")}
          </div>
        </div>
      </section>
    `;
  }

  function renderTestimonials(section) {
    return `
      <section id="testimonials">
        <div class="container">
          ${sectionHead(section)}
          <div class="testimonial-grid">
            ${section.items.map((item) => `<article class="testimonial-card"><p class="role">${icon(item.icon)} ${safe(item.role)}</p><h3>${safe(item.title)}</h3><p>"${safe(item.text)}"</p></article>`).join("")}
          </div>
        </div>
      </section>
    `;
  }

  function renderContact(section) {
    return `
      <section id="contact">
        <div class="container">
          ${sectionHead(section)}
          <div class="contact-grid">
            <div class="card">
              <h3>${icon(ui.icons.link)} ${safe(section.linksTitle)}</h3>
              <div class="contact-list">${section.links.map((item) => `<a class="contact-link" href="${safe(item.href)}"${externalAttrs(item.href)}>${icon(item.icon)} ${safe(item.label)}</a>`).join("")}</div>
            </div>
            <div class="card">
              <h3>${icon(ui.icons.paperPlane)} ${safe(section.formTitle)}</h3>
              <form class="contact-form" id="contactForm">
                <input class="field" id="name" type="text" placeholder="${safe(section.namePlaceholder)}" required>
                <input class="field" id="email" type="email" placeholder="${safe(section.emailPlaceholder)}" required>
                <textarea class="field" id="message" placeholder="${safe(section.messagePlaceholder)}" required></textarea>
                <p class="form-status" id="formStatus" role="status" aria-live="polite"></p>
                <button class="btn btn-primary" type="submit">${icon(ui.icons.paperPlane)} ${safe(section.buttonLabel)}</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function loadScript(src, callback) {
    const script = document.createElement("script");
    script.src = src;
    script.onload = callback;
    document.body.appendChild(script);
  }
})();
