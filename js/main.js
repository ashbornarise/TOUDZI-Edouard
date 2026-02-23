/* ============================================================
   ATTOH-MENSAH Portfolio — main.js
   Charge les données et rend toutes les sections dynamiquement.
   Ordre de priorité : portfolio-data.json > localStorage > DEFAULT_DATA
   ============================================================ */

/* ── DONNÉES PAR DÉFAUT ── */
const DEFAULT_DATA = {
  hero: {
    subtitle: "Portfolio Professionnel",
    name: "ATTOH-MENSAH",
    firstname: "Yao Pédro-Ebenezer",
    title: "Ingénieur | Innovateur",
    description: "Passionné par les solutions techniques innovantes et les défis complexes. Toujours prêt à relever de nouveaux défis et à contribuer à des projets ambitieux.",
    cvLink: "Media/cv.pdf",
    photo: "",
    stats: [
      { num: "5+", label: "Projets réalisés" },
      { num: "3+", label: "Ans d'études" },
      { num: "∞", label: "Motivation" }
    ]
  },
  introduction: {
    title: "Qui suis-je ?",
    text: "Je suis Yao Pédro-Ebenezer ATTOH-MENSAH, un ingénieur passionné par l'innovation et les nouvelles technologies. Mon parcours m'a permis de développer des compétences solides dans mon domaine, alliant rigueur technique et créativité.\n\nJe crois profondément en la puissance de la collaboration et de l'apprentissage continu. Chaque projet est pour moi une opportunité de repousser mes limites et de créer de la valeur.",
    image: ""
  },
  about: {
    text: "Étudiant et professionnel ambitieux, je combine expertise technique et vision stratégique pour concevoir des solutions innovantes. Mon approche rigoureuse et créative me permet de relever les défis les plus complexes avec détermination.\n\nEngagé dans une démarche d'amélioration continue, je cherche constamment à élargir mes connaissances et à appliquer les meilleures pratiques dans chacun de mes projets.",
    image: "",
    qualities: ["Rigoureux", "Créatif", "Autonome", "Curieux", "Leadership"],
    values: ["Excellence", "Intégrité", "Innovation", "Collaboration", "Impact"]
  },
  education: [
    {
      school: "Université / Grande École",
      degree: "Diplôme d'Ingénieur / Master",
      year: "2023 — En cours",
      description: "Formation en ingénierie avec spécialisation dans votre domaine. Acquisition de compétences théoriques et pratiques à travers des projets concrets et des stages professionnels."
    },
    {
      school: "Lycée d'Excellence",
      degree: "Baccalauréat Série C",
      year: "2022",
      description: "Baccalauréat scientifique avec mention, spécialisation mathématiques et sciences physiques."
    }
  ],
  skills: [
    {
      name: "Compétence Technique 1",
      category: "Domaine Principal",
      icon: "⚙️",
      tags: ["Outil A", "Outil B", "Méthode C"]
    },
    {
      name: "Compétence Technique 2",
      category: "Domaine Secondaire",
      icon: "💻",
      tags: ["Langage X", "Framework Y", "Technologie Z"]
    },
    {
      name: "Analyse & Méthode",
      category: "Méthodologie",
      icon: "📐",
      tags: ["Analyse système", "Rapport technique", "Gestion de projet"]
    },
    {
      name: "Compétences Transversales",
      category: "Soft Skills",
      icon: "👥",
      tags: ["Travail en équipe", "Communication", "Adaptabilité", "Rigueur"]
    }
  ],
  experience: [
    {
      role: "Votre poste ici",
      company: "Entreprise / Organisation",
      period: "2024 — Présent",
      type: "Stage / CDI / CDD",
      description: "Description de vos missions, responsabilités et réalisations durant cette expérience. Mettez en avant vos accomplissements et l'impact de votre travail.",
      tags: ["Compétence 1", "Compétence 2", "Outil X"]
    }
  ],
  projects: [
    {
      name: "Projet Phare 1",
      category: "Catégorie",
      description: "Description de votre projet le plus important. Expliquez le contexte, vos contributions et les résultats obtenus.",
      image: "",
      tags: ["Technologie", "Méthode", "Outil"]
    },
    {
      name: "Projet 2",
      category: "Catégorie",
      description: "Description d'un autre projet significatif de votre parcours.",
      image: "",
      tags: ["Tag 1", "Tag 2"]
    }
  ],
  testimonials: [
    {
      author: "Prénom Nom",
      role: "Poste, Entreprise",
      text: "Témoignage positif sur votre travail et votre professionnalisme. Un collaborateur, professeur ou encadrant parle de votre sérieux et de vos compétences.",
      rating: 5,
      initials: "PN"
    }
  ],
  blog: [
    {
      title: "Mon premier article — À personnaliser",
      date: "2025-01-15",
      tag: "Ingénierie",
      summary: "Résumé de votre article. Partagez vos réflexions, vos apprentissages ou vos expériences dans votre domaine d'expertise.",
      link: "#"
    }
  ],
  roadmap: [
    {
      icon: "🎓",
      date: "2022",
      title: "Obtention du Baccalauréat",
      description: "Début du parcours supérieur après l'obtention du baccalauréat avec mention.",
      done: true
    },
    {
      icon: "📚",
      date: "2023",
      title: "Entrée en formation d'ingénieur",
      description: "Intégration d'une formation d'excellence pour acquérir les bases techniques solides.",
      done: true
    },
    {
      icon: "🚀",
      date: "2025",
      title: "Premier stage professionnel",
      description: "Mise en pratique des compétences acquises dans un environnement professionnel stimulant.",
      done: false
    },
    {
      icon: "🎯",
      date: "2026",
      title: "Diplôme & Insertion professionnelle",
      description: "Obtention du diplôme et intégration dans une entreprise innovante pour contribuer à des projets d'envergure.",
      done: false
    }
  ],
  inspirations: [
    {
      name: "Elon Musk",
      role: "Entrepreneur, Innovateur",
      description: "Sa vision à long terme et sa capacité à transformer des industries entières à travers des projets ambitieux m'inspirent profondément."
    },
    {
      name: "Votre Inspiration",
      role: "Rôle & Organisation",
      description: "Décrivez ce qui vous inspire chez cette personne et comment cela influence votre propre parcours et vos ambitions."
    }
  ],
  objective: {
    title: "Mon Objectif Professionnel",
    text: "Mon objectif est de mettre mes compétences techniques et ma créativité au service de projets innovants qui ont un impact positif réel sur la société. Je souhaite continuer à apprendre, à progresser et à collaborer avec des équipes passionnées pour relever les défis technologiques de demain.\n\nÀ court terme, je vise à intégrer une entreprise dynamique où je pourrai contribuer significativement tout en développant mon expertise. À long terme, j'aspire à occuper un rôle de leadership et à impulser des innovations majeures dans mon domaine."
  },
  contact: {
    email: "votre.email@exemple.com",
    phone: "+00 00 00 00 00",
    address: "Lomé, Togo",
    instagram: "https://instagram.com/",
    linkedin: "https://linkedin.com/in/"
  }
};

/* ── CHARGEMENT DES DONNÉES ── */
async function loadData() {
  // 1. Essayer portfolio-data.json (version publiée)
  try {
    const res = await fetch('portfolio-data.json?t=' + Date.now());
    if (res.ok) {
      const data = await res.json();
      return mergeDeep(DEFAULT_DATA, data);
    }
  } catch (_) {}

  // 2. localStorage (prévisualisation admin)
  try {
    const stored = localStorage.getItem('portfolio_data');
    if (stored) {
      const data = JSON.parse(stored);
      return mergeDeep(DEFAULT_DATA, data);
    }
  } catch (_) {}

  // 3. Données par défaut
  return DEFAULT_DATA;
}

function mergeDeep(target, source) {
  if (typeof source !== 'object' || source === null) return source ?? target;
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (Array.isArray(source[key])) {
      result[key] = source[key];
    } else if (typeof source[key] === 'object' && source[key] !== null) {
      result[key] = mergeDeep(target[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
}

/* ── HELPERS HTML ── */
function esc(str) {
  return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function renderTags(tags) {
  if (!tags || !tags.length) return '';
  return `<div class="tag-list">${tags.map(t => `<span class="tag">${esc(t)}</span>`).join('')}</div>`;
}

function renderStars(rating) {
  const r = Math.min(5, Math.max(1, parseInt(rating) || 5));
  return '★'.repeat(r) + '☆'.repeat(5 - r);
}

function imgSrc(src) {
  if (!src) return '';
  // base64 data URL ou chemin relatif
  return src;
}

/* ── RENDERERS ── */

function renderHero(d) {
  const hero = d.hero || {};
  // label
  document.querySelector('#hero .hero-label').textContent = hero.subtitle || DEFAULT_DATA.hero.subtitle;
  // name
  const nameEl = document.querySelector('#hero .hero-name');
  const parts = (hero.name || '').split(' ');
  const first = parts[0] || '';
  const rest = parts.slice(1).join(' ');
  nameEl.innerHTML = `${esc(first)}<span class="highlight">${esc(hero.firstname || '')}</span>${rest ? esc(rest) : ''}`;
  // title
  document.querySelector('#hero .hero-title').textContent = hero.title || '';
  // desc
  document.querySelector('#hero .hero-desc').textContent = hero.description || '';
  // cv button
  const cvBtn = document.querySelector('#hero .btn-cv');
  if (cvBtn) {
    cvBtn.href = hero.cvLink || '#';
    cvBtn.style.display = hero.cvLink ? '' : 'none';
  }
  // photo
  const frame = document.querySelector('#hero .photo-frame-inner');
  if (frame) {
    if (hero.photo) {
      frame.innerHTML = `<img src="${esc(imgSrc(hero.photo))}" alt="${esc(hero.firstname)} ${esc(hero.name)}">`;
    } else {
      frame.innerHTML = `<div class="photo-placeholder">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
          <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
        </svg>
        <p>Votre photo</p>
        <p>Media/photo.jpg</p>
      </div>`;
    }
  }
  // caption
  const cap = document.querySelector('#hero .photo-caption');
  if (cap) cap.textContent = hero.subtitle || '';
  // stats
  const statsContainer = document.querySelector('#hero .hero-stats');
  if (statsContainer && hero.stats) {
    statsContainer.innerHTML = hero.stats.map(s =>
      `<div><div class="stat-num">${esc(s.num)}</div><div class="stat-label">${esc(s.label)}</div></div>`
    ).join('');
  }
}

function renderIntroduction(d) {
  const intro = d.introduction || {};
  document.querySelector('#introduction .intro-title').textContent = intro.title || '';
  const textEl = document.querySelector('#introduction .intro-text');
  textEl.innerHTML = (intro.text || '').split('\n\n').map(p => `<p>${esc(p)}</p>`).join('');
  const imgWrap = document.querySelector('#introduction .intro-img-wrap');
  if (imgWrap) {
    if (intro.image) {
      imgWrap.innerHTML = `<img src="${esc(imgSrc(intro.image))}" alt="Introduction">`;
    } else {
      imgWrap.innerHTML = `<div class="intro-img-placeholder">Photo d'introduction</div>`;
    }
  }
}

function renderAbout(d) {
  const about = d.about || {};
  const textEl = document.querySelector('#about .about-text');
  if (textEl) textEl.innerHTML = (about.text || '').split('\n\n').map(p => `<p>${esc(p)}</p>`).join('');
  const imgSide = document.querySelector('#about .about-img-side');
  if (imgSide) {
    if (about.image) {
      imgSide.innerHTML = `<img src="${esc(imgSrc(about.image))}" alt="À propos">`;
    } else {
      imgSide.innerHTML = `<div class="about-img-placeholder">Votre photo</div>`;
    }
  }
  const qualList = document.querySelector('#about .about-qualities');
  if (qualList && about.qualities) {
    qualList.innerHTML = about.qualities.map(q => `<li>${esc(q)}</li>`).join('');
  }
  const valList = document.querySelector('#about .about-values');
  if (valList && about.values) {
    valList.innerHTML = about.values.map(v => `<li>${esc(v)}</li>`).join('');
  }
}

function renderEducation(d) {
  const items = d.education || [];
  const container = document.querySelector('#education .timeline');
  if (!container) return;
  if (!items.length) {
    container.innerHTML = '<div class="empty-state">Aucune formation renseignée</div>';
    return;
  }
  container.innerHTML = items.map(item => `
    <div class="timeline-item reveal">
      <div class="timeline-dot"></div>
      <div class="timeline-date">${esc(item.year)}</div>
      <div class="timeline-title">${esc(item.degree)}</div>
      <div class="timeline-org">${esc(item.school)}</div>
      <div class="timeline-desc">${esc(item.description)}</div>
    </div>
  `).join('');
}

function renderSkills(d) {
  const items = d.skills || [];
  const container = document.querySelector('#skills .skills-grid');
  if (!container) return;
  if (!items.length) {
    container.innerHTML = '<div class="empty-state">Aucune compétence renseignée</div>';
    return;
  }
  container.innerHTML = items.map(skill => `
    <div class="skill-card reveal">
      <div class="skill-head">
        <div class="skill-icon">${esc(skill.icon || '⚙️')}</div>
        <span class="skill-cat">${esc(skill.category)}</span>
      </div>
      ${skill.description ? `<div class="skill-desc">${esc(skill.description)}</div>` : ''}
      ${renderTags(skill.tags)}
    </div>
  `).join('');
}

function renderExperience(d) {
  const items = d.experience || [];
  const container = document.querySelector('#experience .exp-list');
  if (!container) return;
  if (!items.length) {
    container.innerHTML = '<div class="empty-state">Aucune expérience renseignée</div>';
    return;
  }
  container.innerHTML = items.map(exp => `
    <div class="exp-card reveal">
      <div>
        <div class="exp-role">${esc(exp.role)}</div>
        <div class="exp-company">${esc(exp.company)}</div>
        <div class="exp-period">${esc(exp.period)}</div>
      </div>
      ${exp.type ? `<div class="exp-badge">${esc(exp.type)}</div>` : ''}
      <div class="exp-desc">${esc(exp.description)}</div>
      ${exp.tags && exp.tags.length ? `<div class="exp-tags">${exp.tags.map(t => `<span class="tag">${esc(t)}</span>`).join('')}</div>` : ''}
    </div>
  `).join('');
}

function renderProjects(d) {
  const items = d.projects || [];
  const container = document.querySelector('#projects .projects-grid');
  if (!container) return;
  if (!items.length) {
    container.innerHTML = '<div class="empty-state">Aucun projet renseigné</div>';
    return;
  }
  container.innerHTML = items.map((proj, i) => `
    <div class="proj-card reveal">
      <div class="proj-thumb">
        ${proj.image
          ? `<img src="${esc(imgSrc(proj.image))}" alt="${esc(proj.name)}">`
          : `<div class="proj-thumb-inner">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.7">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
              </svg>
            </div>`
        }
        <div class="proj-num">${String(i + 1).padStart(2, '0')}</div>
        <span class="proj-tag-top">${esc(proj.category)}</span>
      </div>
      <div class="proj-body">
        <div class="proj-title">${esc(proj.name)}</div>
        <div class="proj-desc">${esc(proj.description)}</div>
        ${proj.tags && proj.tags.length ? `
          <div class="proj-footer">
            <div class="proj-footer-label">Compétences</div>
            ${renderTags(proj.tags)}
          </div>
        ` : ''}
      </div>
    </div>
  `).join('');
}

function renderTestimonials(d) {
  const items = d.testimonials || [];
  const container = document.querySelector('#testimonials .testimonials-grid');
  if (!container) return;
  if (!items.length) {
    container.innerHTML = '<div class="empty-state">Aucun témoignage renseigné</div>';
    return;
  }
  container.innerHTML = items.map(t => `
    <div class="testimonial-card reveal">
      <div class="testimonial-stars">${renderStars(t.rating)}</div>
      <div class="testimonial-text">"${esc(t.text)}"</div>
      <div class="testimonial-author">
        <div class="testimonial-initials">${esc(t.initials || t.author.substring(0,2).toUpperCase())}</div>
        <div>
          <div class="testimonial-name">${esc(t.author)}</div>
          <div class="testimonial-role">${esc(t.role)}</div>
        </div>
      </div>
    </div>
  `).join('');
}

function renderBlog(d) {
  const items = d.blog || [];
  const container = document.querySelector('#blog .blog-grid');
  if (!container) return;
  if (!items.length) {
    container.innerHTML = '<div class="empty-state">Aucun article renseigné</div>';
    return;
  }
  container.innerHTML = items.map(article => `
    <div class="blog-card reveal">
      <div class="blog-meta">
        <span class="blog-tag">${esc(article.tag)}</span>
        <span class="blog-date">${esc(formatDate(article.date))}</span>
      </div>
      <div class="blog-title">${esc(article.title)}</div>
      <div class="blog-summary">${esc(article.summary)}</div>
      ${article.link && article.link !== '#'
        ? `<a href="${esc(article.link)}" class="blog-read-more" target="_blank">Lire la suite →</a>`
        : '<span class="blog-read-more" style="opacity:0.4">À venir →</span>'
      }
    </div>
  `).join('');
}

function renderRoadmap(d) {
  const items = d.roadmap || [];
  const container = document.querySelector('#roadmap .roadmap-list');
  if (!container) return;
  if (!items.length) {
    container.innerHTML = '<div class="empty-state">Aucune étape renseignée</div>';
    return;
  }
  container.innerHTML = items.map(item => `
    <div class="roadmap-item reveal${item.done ? ' done' : ''}">
      <div class="roadmap-dot">${esc(item.icon || '●')}</div>
      <div>
        <div class="roadmap-date">
          ${esc(item.date)}
          ${item.done ? '<span class="roadmap-done-badge">Accompli</span>' : ''}
        </div>
        <div class="roadmap-title">${esc(item.title)}</div>
        <div class="roadmap-desc">${esc(item.description)}</div>
      </div>
    </div>
  `).join('');
}

function renderInspirations(d) {
  const items = d.inspirations || [];
  const container = document.querySelector('#inspirations .inspirations-grid');
  if (!container) return;
  if (!items.length) {
    container.innerHTML = '<div class="empty-state">Aucune inspiration renseignée</div>';
    return;
  }
  container.innerHTML = items.map(ins => `
    <div class="inspiration-card reveal">
      <div class="inspiration-name">${esc(ins.name)}</div>
      <div class="inspiration-role">${esc(ins.role)}</div>
      <div class="inspiration-desc">${esc(ins.description)}</div>
    </div>
  `).join('');
}

function renderObjective(d) {
  const obj = d.objective || {};
  const titleEl = document.querySelector('#objective .objective-title');
  const textEl = document.querySelector('#objective .objective-text');
  if (titleEl) titleEl.textContent = obj.title || '';
  if (textEl) textEl.innerHTML = (obj.text || '').split('\n\n').map(p => `<p>${esc(p)}</p>`).join('');
}

function renderContact(d) {
  const c = d.contact || {};
  const set = (sel, val, isLink) => {
    const el = document.querySelector(sel);
    if (!el) return;
    if (isLink) {
      el.href = isLink === 'mail' ? `mailto:${val}` : isLink === 'tel' ? `tel:${val}` : val;
      el.textContent = val;
    } else {
      el.textContent = val || '—';
    }
  };
  set('#contact-email .contact-val', c.email);
  const emailLink = document.querySelector('#contact-email .contact-val a');
  if (emailLink && c.email) { emailLink.href = `mailto:${c.email}`; emailLink.textContent = c.email; }
  const phoneLink = document.querySelector('#contact-phone .contact-val a');
  if (phoneLink && c.phone) { phoneLink.href = `tel:${c.phone}`; phoneLink.textContent = c.phone; }
  const addr = document.querySelector('#contact-address .contact-val');
  if (addr) addr.textContent = c.address || '—';

  // Social links
  const igLink = document.querySelector('#contact-ig');
  if (igLink) {
    igLink.href = c.instagram || '#';
    igLink.style.display = c.instagram ? '' : 'none';
  }
  const liLink = document.querySelector('#contact-li');
  if (liLink) {
    liLink.href = c.linkedin || '#';
    liLink.style.display = c.linkedin ? '' : 'none';
  }
  // Form target email
  window._contactEmail = c.email || '';
}

function formatDate(str) {
  if (!str) return '';
  try {
    return new Date(str).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch (_) { return str; }
}

/* ── SCROLL REVEAL ── */
function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const siblings = Array.from(entry.target.parentElement.children);
        const delay = siblings.indexOf(entry.target) * 80;
        setTimeout(() => entry.target.classList.add('visible'), delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ── CUSTOM CURSOR ── */
function initCursor() {
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');
  if (!cursor || !ring) return;
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });
  (function animateCursor() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animateCursor);
  })();
  document.querySelectorAll('a, button, .btn, .proj-card, .skill-card, .exp-card, .contact-item').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width = '20px'; cursor.style.height = '20px';
      ring.style.width = '60px'; ring.style.height = '60px';
      ring.style.borderColor = 'rgba(57,211,83,0.7)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width = '12px'; cursor.style.height = '12px';
      ring.style.width = '40px'; ring.style.height = '40px';
      ring.style.borderColor = 'rgba(57,211,83,0.4)';
    });
  });
}

/* ── NAV ACTIVE ── */
function initNavActive() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }, { passive: true });
}

/* ── MOBILE NAV ── */
function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => links.classList.toggle('open'));
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => links.classList.remove('open'));
  });
}

/* ── EMAIL FORM ── */
function initContactForm() {
  const btn = document.querySelector('.form-btn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const name    = document.getElementById('cf-name')?.value || '';
    const email   = document.getElementById('cf-email')?.value || '';
    const subject = document.getElementById('cf-subject')?.value || '';
    const message = document.getElementById('cf-message')?.value || '';
    if (!name || !email || !message) {
      alert('Veuillez remplir votre nom, email et message.');
      return;
    }
    const to = window._contactEmail || '';
    const mailto = `mailto:${to}?subject=${encodeURIComponent(subject || 'Contact Portfolio')}&body=${encodeURIComponent('De: ' + name + '\nEmail: ' + email + '\n\n' + message)}`;
    window.location.href = mailto;
  });
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', async () => {
  const data = await loadData();

  renderHero(data);
  renderIntroduction(data);
  renderAbout(data);
  renderEducation(data);
  renderSkills(data);
  renderExperience(data);
  renderProjects(data);
  renderTestimonials(data);
  renderBlog(data);
  renderRoadmap(data);
  renderInspirations(data);
  renderObjective(data);
  renderContact(data);

  initReveal();
  initCursor();
  initNavActive();
  initMobileNav();
  initContactForm();

  // Scroll indicator
  const scrollDown = document.querySelector('.scroll-down');
  if (scrollDown) {
    scrollDown.addEventListener('click', () => {
      document.getElementById('introduction')?.scrollIntoView({ behavior: 'smooth' });
    });
  }
});
