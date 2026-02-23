/* ============================================================
   ATTOH-MENSAH Portfolio — admin.js
   Panneau d'administration : login, éditeurs, localStorage, GitHub.
   ============================================================ */

const ADMIN_PASSWORD_KEY = 'portfolio_admin_auth';
const DATA_KEY = 'portfolio_data';
const GITHUB_CONFIG_KEY = 'portfolio_github_config';
const DEFAULT_PASSWORD = 'admin2026';

/* ── TOAST ── */
function toast(msg, type = 'success') {
  const icons = { success: '✓', error: '✕', info: '●' };
  const container = document.querySelector('.toast-container') || (() => {
    const c = document.createElement('div');
    c.className = 'toast-container';
    document.body.appendChild(c);
    return c;
  })();
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<span class="toast-icon">${icons[type] || '●'}</span><span>${msg}</span>`;
  container.appendChild(t);
  setTimeout(() => t.remove(), 4000);
}

/* ── AUTH ── */
function isLoggedIn() {
  return sessionStorage.getItem(ADMIN_PASSWORD_KEY) === 'true';
}
function login(password) {
  const stored = localStorage.getItem('portfolio_admin_password') || DEFAULT_PASSWORD;
  if (password === stored) {
    sessionStorage.setItem(ADMIN_PASSWORD_KEY, 'true');
    return true;
  }
  return false;
}
function logout() {
  sessionStorage.removeItem(ADMIN_PASSWORD_KEY);
  location.reload();
}

/* ── DATA ── */
function loadData() {
  try {
    const raw = localStorage.getItem(DATA_KEY);
    return raw ? JSON.parse(raw) : getDefaultData();
  } catch (_) {
    return getDefaultData();
  }
}
function saveData(data) {
  localStorage.setItem(DATA_KEY, JSON.stringify(data));
}

/* ── SECTION NAV ── */
function switchPanel(name) {
  document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.sidebar-nav-item').forEach(i => i.classList.remove('active'));
  const panel = document.getElementById('panel-' + name);
  if (panel) panel.classList.add('active');
  const navItem = document.querySelector(`.sidebar-nav-item[data-section="${name}"]`);
  if (navItem) navItem.classList.add('active');
  document.querySelector('.topbar-title').textContent = navItem?.textContent?.trim() || name;
}

/* ── HELPERS ── */
function val(id) { return (document.getElementById(id) || {}).value || ''; }
function setVal(id, v) { const el = document.getElementById(id); if (el) el.value = v || ''; }
function buildTagsInput(id, tags) {
  const wrap = document.getElementById(id);
  if (!wrap) return;
  wrap.innerHTML = '';
  const display = document.createElement('div');
  display.className = 'tags-display';
  display.id = id + '-display';
  const input = document.createElement('input');
  input.className = 'tag-chip-input';
  input.placeholder = 'Ajouter et Entrée…';
  let currentTags = [...(tags || [])];

  function renderChips() {
    display.innerHTML = '';
    currentTags.forEach((tag, i) => {
      const chip = document.createElement('span');
      chip.className = 'tag-chip';
      chip.innerHTML = `${tag}<button class="tag-chip-remove" data-i="${i}">×</button>`;
      display.appendChild(chip);
    });
    display.appendChild(input);
    display.querySelectorAll('.tag-chip-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        currentTags.splice(parseInt(btn.dataset.i), 1);
        renderChips();
      });
    });
  }
  input.addEventListener('keydown', e => {
    if ((e.key === 'Enter' || e.key === ',') && input.value.trim()) {
      e.preventDefault();
      currentTags.push(input.value.trim());
      input.value = '';
      renderChips();
    } else if (e.key === 'Backspace' && !input.value && currentTags.length) {
      currentTags.pop();
      renderChips();
    }
  });
  wrap.dataset.getTags = '';
  wrap._getTags = () => currentTags;
  renderChips();
  wrap.appendChild(display);
}

function getTags(id) {
  const wrap = document.getElementById(id);
  return wrap && wrap._getTags ? wrap._getTags() : [];
}

function buildStarsInput(id, current) {
  const wrap = document.getElementById(id);
  if (!wrap) return;
  let rating = parseInt(current) || 5;
  wrap.innerHTML = '';
  wrap.className = 'stars-input';
  for (let i = 1; i <= 5; i++) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = '★';
    btn.dataset.star = i;
    if (i <= rating) btn.classList.add('active');
    btn.addEventListener('click', () => {
      rating = i;
      wrap.querySelectorAll('button').forEach((b, j) => b.classList.toggle('active', j < i));
    });
    wrap.appendChild(btn);
  }
  wrap._getRating = () => rating;
}
function getRating(id) {
  const wrap = document.getElementById(id);
  return wrap && wrap._getRating ? wrap._getRating() : 5;
}

function buildImageField(containerId, currentSrc, onchange) {
  const container = document.getElementById(containerId);
  if (!container) return;
  let currentImg = currentSrc || '';
  container.innerHTML = `
    <div class="image-field-wrap">
      <div class="image-preview" id="${containerId}-preview">
        ${currentImg
          ? `<img src="${currentImg}" alt="">`
          : `<div class="img-placeholder">Aucune image</div>`}
      </div>
      <label class="image-upload-btn">
        📂 Choisir une image
        <input class="image-upload-input" type="file" accept="image/*">
      </label>
      ${currentImg ? `<button class="image-clear-btn" id="${containerId}-clear">✕ Supprimer</button>` : ''}
    </div>
  `;
  container.querySelector('.image-upload-input').addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      currentImg = ev.target.result;
      const preview = container.querySelector('.image-preview');
      preview.innerHTML = `<img src="${currentImg}" alt="">`;
      let clearBtn = container.querySelector('.image-clear-btn');
      if (!clearBtn) {
        clearBtn = document.createElement('button');
        clearBtn.className = 'image-clear-btn';
        clearBtn.id = containerId + '-clear';
        container.querySelector('.image-field-wrap').appendChild(clearBtn);
      }
      clearBtn.textContent = '✕ Supprimer';
      clearBtn.onclick = () => {
        currentImg = '';
        buildImageField(containerId, '', onchange);
        if (onchange) onchange('');
      };
      if (onchange) onchange(currentImg);
    };
    reader.readAsDataURL(file);
  });
  const clearBtn = container.querySelector('.image-clear-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      currentImg = '';
      buildImageField(containerId, '', onchange);
      if (onchange) onchange('');
    });
  }
  container._getImage = () => currentImg;
}
function getImage(containerId) {
  const el = document.getElementById(containerId);
  return el && el._getImage ? el._getImage() : '';
}

/* ── HERO PANEL ── */
function initHeroPanel(data) {
  setVal('hero-subtitle', data.hero?.subtitle);
  setVal('hero-name', data.hero?.name);
  setVal('hero-firstname', data.hero?.firstname);
  setVal('hero-title', data.hero?.title);
  setVal('hero-description', data.hero?.description);
  setVal('hero-cvlink', data.hero?.cvLink);
  buildImageField('hero-photo-field', data.hero?.photo || '');

  // Stats
  const statsContainer = document.getElementById('hero-stats-list');
  const stats = data.hero?.stats || [];
  renderStatsList(statsContainer, stats);

  document.getElementById('hero-stats-add')?.addEventListener('click', () => {
    const container2 = document.getElementById('hero-stats-list');
    const list = getStatsList(container2);
    list.push({ num: '', label: '' });
    renderStatsList(container2, list);
  });
}

function renderStatsList(container, stats) {
  if (!container) return;
  container.innerHTML = stats.map((s, i) => `
    <div class="form-grid" style="margin-bottom:0.8rem;" data-stat="${i}">
      <div class="admin-field">
        <label>Valeur (ex: 5+)</label>
        <input id="stat-num-${i}" value="${esc(s.num)}">
      </div>
      <div class="admin-field">
        <label>Label</label>
        <input id="stat-label-${i}" value="${esc(s.label)}">
      </div>
      <div style="display:flex;align-items:flex-end;">
        <button class="admin-btn admin-btn-danger admin-btn-sm" data-remove-stat="${i}">✕</button>
      </div>
    </div>
  `).join('');
  container.querySelectorAll('[data-remove-stat]').forEach(btn => {
    btn.addEventListener('click', () => {
      const list = getStatsList(container);
      list.splice(parseInt(btn.dataset.removeStat), 1);
      renderStatsList(container, list);
    });
  });
}

function getStatsList(container) {
  const items = [];
  container.querySelectorAll('[data-stat]').forEach(row => {
    const i = row.dataset.stat;
    items.push({
      num: document.getElementById(`stat-num-${i}`)?.value || '',
      label: document.getElementById(`stat-label-${i}`)?.value || ''
    });
  });
  return items;
}

function collectHero() {
  return {
    subtitle: val('hero-subtitle'),
    name: val('hero-name'),
    firstname: val('hero-firstname'),
    title: val('hero-title'),
    description: val('hero-description'),
    cvLink: val('hero-cvlink'),
    photo: getImage('hero-photo-field'),
    stats: getStatsList(document.getElementById('hero-stats-list'))
  };
}

/* ── INTRODUCTION PANEL ── */
function initIntroPanel(data) {
  setVal('intro-title', data.introduction?.title);
  setVal('intro-text', data.introduction?.text);
  buildImageField('intro-image-field', data.introduction?.image || '');
}
function collectIntro() {
  return {
    title: val('intro-title'),
    text: val('intro-text'),
    image: getImage('intro-image-field')
  };
}

/* ── À PROPOS PANEL ── */
function initAboutPanel(data) {
  setVal('about-text', data.about?.text);
  buildImageField('about-image-field', data.about?.image || '');
  buildTagsInput('about-qualities-wrap', data.about?.qualities || []);
  buildTagsInput('about-values-wrap', data.about?.values || []);
}
function collectAbout() {
  return {
    text: val('about-text'),
    image: getImage('about-image-field'),
    qualities: getTags('about-qualities-wrap'),
    values: getTags('about-values-wrap')
  };
}

/* ── ÉDUCATION PANEL ── */
function initEducationPanel(data) {
  renderEducationList(data.education || []);
  document.getElementById('edu-add')?.addEventListener('click', () => {
    const list = collectEducationList();
    list.push({ school: '', degree: '', year: '', description: '' });
    renderEducationList(list);
  });
}
function renderEducationList(items) {
  const container = document.getElementById('edu-list');
  if (!container) return;
  container.innerHTML = items.map((item, i) => `
    <div class="list-card open" data-edu="${i}">
      <div class="list-card-header">
        <span class="list-card-title">${esc(item.degree || 'Nouvelle formation')}</span>
        <div class="list-card-actions">
          <button class="admin-btn admin-btn-danger admin-btn-sm" data-remove-edu="${i}">✕ Supprimer</button>
          <span class="list-card-toggle">▼</span>
        </div>
      </div>
      <div class="list-card-body">
        <div class="form-grid">
          <div class="admin-field"><label>École / Université</label><input id="edu-school-${i}" value="${esc(item.school)}"></div>
          <div class="admin-field"><label>Diplôme</label><input id="edu-degree-${i}" value="${esc(item.degree)}"></div>
          <div class="admin-field"><label>Période (ex: 2023 — En cours)</label><input id="edu-year-${i}" value="${esc(item.year)}"></div>
        </div>
        <div class="admin-field"><label>Description</label><textarea id="edu-desc-${i}">${esc(item.description)}</textarea></div>
      </div>
    </div>
  `).join('');
  container.querySelectorAll('[data-remove-edu]').forEach(btn => {
    btn.addEventListener('click', () => {
      const list = collectEducationList();
      list.splice(parseInt(btn.dataset.removeEdu), 1);
      renderEducationList(list);
    });
  });
  initCardToggles(container);
}
function collectEducationList() {
  const container = document.getElementById('edu-list');
  return [...container.querySelectorAll('[data-edu]')].map(row => {
    const i = row.dataset.edu;
    return {
      school: document.getElementById(`edu-school-${i}`)?.value || '',
      degree: document.getElementById(`edu-degree-${i}`)?.value || '',
      year: document.getElementById(`edu-year-${i}`)?.value || '',
      description: document.getElementById(`edu-desc-${i}`)?.value || ''
    };
  });
}

/* ── COMPÉTENCES PANEL ── */
function initSkillsPanel(data) {
  renderSkillsList(data.skills || []);
  document.getElementById('skill-add')?.addEventListener('click', () => {
    const list = collectSkillsList();
    list.push({ name: '', category: '', icon: '⚙️', description: '', tags: [] });
    renderSkillsList(list);
  });
}
function renderSkillsList(items) {
  const container = document.getElementById('skills-list');
  if (!container) return;
  container.innerHTML = items.map((item, i) => `
    <div class="list-card open" data-skill="${i}">
      <div class="list-card-header">
        <span class="list-card-title">${esc(item.icon || '⚙️')} ${esc(item.category || 'Nouvelle compétence')}</span>
        <div class="list-card-actions">
          <button class="admin-btn admin-btn-danger admin-btn-sm" data-remove-skill="${i}">✕</button>
          <span class="list-card-toggle">▼</span>
        </div>
      </div>
      <div class="list-card-body">
        <div class="form-grid">
          <div class="admin-field"><label>Catégorie</label><input id="skill-cat-${i}" value="${esc(item.category)}"></div>
          <div class="admin-field"><label>Icône (emoji)</label><input id="skill-icon-${i}" value="${esc(item.icon || '⚙️')}" style="font-size:1.2rem;"></div>
        </div>
        <div class="admin-field" style="margin-bottom:1rem;"><label>Description (optionnel)</label><textarea id="skill-desc-${i}">${esc(item.description || '')}</textarea></div>
        <div class="admin-field"><label>Compétences / Tags</label><div id="skill-tags-${i}"></div></div>
      </div>
    </div>
  `).join('');
  items.forEach((item, i) => buildTagsInput(`skill-tags-${i}`, item.tags || []));
  container.querySelectorAll('[data-remove-skill]').forEach(btn => {
    btn.addEventListener('click', () => {
      const list = collectSkillsList();
      list.splice(parseInt(btn.dataset.removeSkill), 1);
      renderSkillsList(list);
    });
  });
  initCardToggles(container);
}
function collectSkillsList() {
  const container = document.getElementById('skills-list');
  return [...container.querySelectorAll('[data-skill]')].map(row => {
    const i = row.dataset.skill;
    return {
      category: document.getElementById(`skill-cat-${i}`)?.value || '',
      icon: document.getElementById(`skill-icon-${i}`)?.value || '⚙️',
      description: document.getElementById(`skill-desc-${i}`)?.value || '',
      tags: getTags(`skill-tags-${i}`)
    };
  });
}

/* ── EXPÉRIENCE PANEL ── */
function initExperiencePanel(data) {
  renderExperienceList(data.experience || []);
  document.getElementById('exp-add')?.addEventListener('click', () => {
    const list = collectExperienceList();
    list.push({ role: '', company: '', period: '', type: '', description: '', tags: [] });
    renderExperienceList(list);
  });
}
function renderExperienceList(items) {
  const container = document.getElementById('exp-list-admin');
  if (!container) return;
  container.innerHTML = items.map((item, i) => `
    <div class="list-card open" data-exp="${i}">
      <div class="list-card-header">
        <span class="list-card-title">${esc(item.role || 'Nouvelle expérience')} — ${esc(item.company || '')}</span>
        <div class="list-card-actions">
          <button class="admin-btn admin-btn-danger admin-btn-sm" data-remove-exp="${i}">✕</button>
          <span class="list-card-toggle">▼</span>
        </div>
      </div>
      <div class="list-card-body">
        <div class="form-grid">
          <div class="admin-field"><label>Poste / Rôle</label><input id="exp-role-${i}" value="${esc(item.role)}"></div>
          <div class="admin-field"><label>Entreprise</label><input id="exp-company-${i}" value="${esc(item.company)}"></div>
          <div class="admin-field"><label>Période</label><input id="exp-period-${i}" value="${esc(item.period)}" placeholder="2023 — 2024"></div>
          <div class="admin-field"><label>Type</label><input id="exp-type-${i}" value="${esc(item.type)}" placeholder="Stage / CDI / Projet"></div>
        </div>
        <div class="admin-field" style="margin-bottom:1rem;"><label>Description</label><textarea id="exp-desc-${i}">${esc(item.description)}</textarea></div>
        <div class="admin-field"><label>Compétences / Tags</label><div id="exp-tags-${i}"></div></div>
      </div>
    </div>
  `).join('');
  items.forEach((item, i) => buildTagsInput(`exp-tags-${i}`, item.tags || []));
  container.querySelectorAll('[data-remove-exp]').forEach(btn => {
    btn.addEventListener('click', () => {
      const list = collectExperienceList();
      list.splice(parseInt(btn.dataset.removeExp), 1);
      renderExperienceList(list);
    });
  });
  initCardToggles(container);
}
function collectExperienceList() {
  const container = document.getElementById('exp-list-admin');
  return [...container.querySelectorAll('[data-exp]')].map(row => {
    const i = row.dataset.exp;
    return {
      role: document.getElementById(`exp-role-${i}`)?.value || '',
      company: document.getElementById(`exp-company-${i}`)?.value || '',
      period: document.getElementById(`exp-period-${i}`)?.value || '',
      type: document.getElementById(`exp-type-${i}`)?.value || '',
      description: document.getElementById(`exp-desc-${i}`)?.value || '',
      tags: getTags(`exp-tags-${i}`)
    };
  });
}

/* ── PROJETS PANEL ── */
function initProjectsPanel(data) {
  renderProjectsList(data.projects || []);
  document.getElementById('proj-add')?.addEventListener('click', () => {
    const list = collectProjectsList();
    list.push({ name: '', category: '', description: '', image: '', tags: [] });
    renderProjectsList(list);
  });
}
function renderProjectsList(items) {
  const container = document.getElementById('proj-list-admin');
  if (!container) return;
  container.innerHTML = items.map((item, i) => `
    <div class="list-card open" data-proj="${i}">
      <div class="list-card-header">
        <span class="list-card-title">${esc(item.name || 'Nouveau projet')}</span>
        <div class="list-card-actions">
          <button class="admin-btn admin-btn-danger admin-btn-sm" data-remove-proj="${i}">✕</button>
          <span class="list-card-toggle">▼</span>
        </div>
      </div>
      <div class="list-card-body">
        <div class="form-grid">
          <div class="admin-field"><label>Nom du projet</label><input id="proj-name-${i}" value="${esc(item.name)}"></div>
          <div class="admin-field"><label>Catégorie</label><input id="proj-cat-${i}" value="${esc(item.category)}"></div>
        </div>
        <div class="admin-field" style="margin-bottom:1rem;"><label>Description</label><textarea id="proj-desc-${i}">${esc(item.description)}</textarea></div>
        <div class="admin-field" style="margin-bottom:1rem;"><label>Image du projet</label><div id="proj-img-${i}"></div></div>
        <div class="admin-field"><label>Tags / Compétences</label><div id="proj-tags-${i}"></div></div>
      </div>
    </div>
  `).join('');
  items.forEach((item, i) => {
    buildImageField(`proj-img-${i}`, item.image || '');
    buildTagsInput(`proj-tags-${i}`, item.tags || []);
  });
  container.querySelectorAll('[data-remove-proj]').forEach(btn => {
    btn.addEventListener('click', () => {
      const list = collectProjectsList();
      list.splice(parseInt(btn.dataset.removeProj), 1);
      renderProjectsList(list);
    });
  });
  initCardToggles(container);
}
function collectProjectsList() {
  const container = document.getElementById('proj-list-admin');
  return [...container.querySelectorAll('[data-proj]')].map(row => {
    const i = row.dataset.proj;
    return {
      name: document.getElementById(`proj-name-${i}`)?.value || '',
      category: document.getElementById(`proj-cat-${i}`)?.value || '',
      description: document.getElementById(`proj-desc-${i}`)?.value || '',
      image: getImage(`proj-img-${i}`),
      tags: getTags(`proj-tags-${i}`)
    };
  });
}

/* ── TÉMOIGNAGES PANEL ── */
function initTestimonialsPanel(data) {
  renderTestimonialsList(data.testimonials || []);
  document.getElementById('testi-add')?.addEventListener('click', () => {
    const list = collectTestimonialsList();
    list.push({ author: '', role: '', text: '', rating: 5, initials: '' });
    renderTestimonialsList(list);
  });
}
function renderTestimonialsList(items) {
  const container = document.getElementById('testi-list');
  if (!container) return;
  container.innerHTML = items.map((item, i) => `
    <div class="list-card open" data-testi="${i}">
      <div class="list-card-header">
        <span class="list-card-title">${esc(item.author || 'Nouveau témoignage')}</span>
        <div class="list-card-actions">
          <button class="admin-btn admin-btn-danger admin-btn-sm" data-remove-testi="${i}">✕</button>
          <span class="list-card-toggle">▼</span>
        </div>
      </div>
      <div class="list-card-body">
        <div class="form-grid">
          <div class="admin-field"><label>Auteur</label><input id="testi-author-${i}" value="${esc(item.author)}"></div>
          <div class="admin-field"><label>Rôle / Poste</label><input id="testi-role-${i}" value="${esc(item.role)}"></div>
          <div class="admin-field"><label>Initiales (ex: JD)</label><input id="testi-initials-${i}" value="${esc(item.initials)}" maxlength="3"></div>
          <div class="admin-field"><label>Note</label><div id="testi-rating-${i}"></div></div>
        </div>
        <div class="admin-field"><label>Témoignage</label><textarea id="testi-text-${i}">${esc(item.text)}</textarea></div>
      </div>
    </div>
  `).join('');
  items.forEach((item, i) => buildStarsInput(`testi-rating-${i}`, item.rating));
  container.querySelectorAll('[data-remove-testi]').forEach(btn => {
    btn.addEventListener('click', () => {
      const list = collectTestimonialsList();
      list.splice(parseInt(btn.dataset.removeTesti), 1);
      renderTestimonialsList(list);
    });
  });
  initCardToggles(container);
}
function collectTestimonialsList() {
  const container = document.getElementById('testi-list');
  return [...container.querySelectorAll('[data-testi]')].map(row => {
    const i = row.dataset.testi;
    return {
      author: document.getElementById(`testi-author-${i}`)?.value || '',
      role: document.getElementById(`testi-role-${i}`)?.value || '',
      initials: document.getElementById(`testi-initials-${i}`)?.value || '',
      text: document.getElementById(`testi-text-${i}`)?.value || '',
      rating: getRating(`testi-rating-${i}`)
    };
  });
}

/* ── BLOG PANEL ── */
function initBlogPanel(data) {
  renderBlogList(data.blog || []);
  document.getElementById('blog-add')?.addEventListener('click', () => {
    const list = collectBlogList();
    list.push({ title: '', date: '', tag: '', summary: '', link: '' });
    renderBlogList(list);
  });
}
function renderBlogList(items) {
  const container = document.getElementById('blog-list-admin');
  if (!container) return;
  container.innerHTML = items.map((item, i) => `
    <div class="list-card open" data-blog="${i}">
      <div class="list-card-header">
        <span class="list-card-title">${esc(item.title || 'Nouvel article')}</span>
        <div class="list-card-actions">
          <button class="admin-btn admin-btn-danger admin-btn-sm" data-remove-blog="${i}">✕</button>
          <span class="list-card-toggle">▼</span>
        </div>
      </div>
      <div class="list-card-body">
        <div class="form-grid">
          <div class="admin-field"><label>Titre</label><input id="blog-title-${i}" value="${esc(item.title)}"></div>
          <div class="admin-field"><label>Date (AAAA-MM-JJ)</label><input id="blog-date-${i}" type="date" value="${esc(item.date)}"></div>
          <div class="admin-field"><label>Tag / Catégorie</label><input id="blog-tag-${i}" value="${esc(item.tag)}"></div>
          <div class="admin-field"><label>Lien (optionnel)</label><input id="blog-link-${i}" value="${esc(item.link || '')}" placeholder="https://..."></div>
        </div>
        <div class="admin-field"><label>Résumé</label><textarea id="blog-summary-${i}">${esc(item.summary)}</textarea></div>
      </div>
    </div>
  `).join('');
  container.querySelectorAll('[data-remove-blog]').forEach(btn => {
    btn.addEventListener('click', () => {
      const list = collectBlogList();
      list.splice(parseInt(btn.dataset.removeBlog), 1);
      renderBlogList(list);
    });
  });
  initCardToggles(container);
}
function collectBlogList() {
  const container = document.getElementById('blog-list-admin');
  return [...container.querySelectorAll('[data-blog]')].map(row => {
    const i = row.dataset.blog;
    return {
      title: document.getElementById(`blog-title-${i}`)?.value || '',
      date: document.getElementById(`blog-date-${i}`)?.value || '',
      tag: document.getElementById(`blog-tag-${i}`)?.value || '',
      link: document.getElementById(`blog-link-${i}`)?.value || '',
      summary: document.getElementById(`blog-summary-${i}`)?.value || ''
    };
  });
}

/* ── FEUILLE DE ROUTE PANEL ── */
function initRoadmapPanel(data) {
  renderRoadmapList(data.roadmap || []);
  document.getElementById('road-add')?.addEventListener('click', () => {
    const list = collectRoadmapList();
    list.push({ icon: '🎯', date: '', title: '', description: '', done: false });
    renderRoadmapList(list);
  });
}
function renderRoadmapList(items) {
  const container = document.getElementById('road-list');
  if (!container) return;
  container.innerHTML = items.map((item, i) => `
    <div class="list-card open" data-road="${i}">
      <div class="list-card-header">
        <span class="list-card-title">${esc(item.icon)} ${esc(item.title || 'Nouvelle étape')}</span>
        <div class="list-card-actions">
          <button class="admin-btn admin-btn-danger admin-btn-sm" data-remove-road="${i}">✕</button>
          <span class="list-card-toggle">▼</span>
        </div>
      </div>
      <div class="list-card-body">
        <div class="form-grid">
          <div class="admin-field"><label>Icône (emoji)</label><input id="road-icon-${i}" value="${esc(item.icon || '🎯')}"></div>
          <div class="admin-field"><label>Date / Année</label><input id="road-date-${i}" value="${esc(item.date)}"></div>
          <div class="admin-field"><label>Titre</label><input id="road-title-${i}" value="${esc(item.title)}"></div>
          <div class="admin-field" style="display:flex;align-items:flex-end;">
            <label class="admin-checkbox">
              <input type="checkbox" id="road-done-${i}" ${item.done ? 'checked' : ''}>
              <span>Accompli</span>
            </label>
          </div>
        </div>
        <div class="admin-field"><label>Description</label><textarea id="road-desc-${i}">${esc(item.description)}</textarea></div>
      </div>
    </div>
  `).join('');
  container.querySelectorAll('[data-remove-road]').forEach(btn => {
    btn.addEventListener('click', () => {
      const list = collectRoadmapList();
      list.splice(parseInt(btn.dataset.removeRoad), 1);
      renderRoadmapList(list);
    });
  });
  initCardToggles(container);
}
function collectRoadmapList() {
  const container = document.getElementById('road-list');
  return [...container.querySelectorAll('[data-road]')].map(row => {
    const i = row.dataset.road;
    return {
      icon: document.getElementById(`road-icon-${i}`)?.value || '🎯',
      date: document.getElementById(`road-date-${i}`)?.value || '',
      title: document.getElementById(`road-title-${i}`)?.value || '',
      description: document.getElementById(`road-desc-${i}`)?.value || '',
      done: document.getElementById(`road-done-${i}`)?.checked || false
    };
  });
}

/* ── INSPIRATIONS PANEL ── */
function initInspirationsPanel(data) {
  renderInspirationsList(data.inspirations || []);
  document.getElementById('insp-add')?.addEventListener('click', () => {
    const list = collectInspirationsList();
    list.push({ name: '', role: '', description: '' });
    renderInspirationsList(list);
  });
}
function renderInspirationsList(items) {
  const container = document.getElementById('insp-list');
  if (!container) return;
  container.innerHTML = items.map((item, i) => `
    <div class="list-card open" data-insp="${i}">
      <div class="list-card-header">
        <span class="list-card-title">${esc(item.name || 'Nouvelle inspiration')}</span>
        <div class="list-card-actions">
          <button class="admin-btn admin-btn-danger admin-btn-sm" data-remove-insp="${i}">✕</button>
          <span class="list-card-toggle">▼</span>
        </div>
      </div>
      <div class="list-card-body">
        <div class="form-grid">
          <div class="admin-field"><label>Nom</label><input id="insp-name-${i}" value="${esc(item.name)}"></div>
          <div class="admin-field"><label>Rôle / Titre</label><input id="insp-role-${i}" value="${esc(item.role)}"></div>
        </div>
        <div class="admin-field"><label>Description / Ce qui vous inspire</label><textarea id="insp-desc-${i}">${esc(item.description)}</textarea></div>
      </div>
    </div>
  `).join('');
  container.querySelectorAll('[data-remove-insp]').forEach(btn => {
    btn.addEventListener('click', () => {
      const list = collectInspirationsList();
      list.splice(parseInt(btn.dataset.removeInsp), 1);
      renderInspirationsList(list);
    });
  });
  initCardToggles(container);
}
function collectInspirationsList() {
  const container = document.getElementById('insp-list');
  return [...container.querySelectorAll('[data-insp]')].map(row => {
    const i = row.dataset.insp;
    return {
      name: document.getElementById(`insp-name-${i}`)?.value || '',
      role: document.getElementById(`insp-role-${i}`)?.value || '',
      description: document.getElementById(`insp-desc-${i}`)?.value || ''
    };
  });
}

/* ── OBJECTIF PANEL ── */
function initObjectivePanel(data) {
  setVal('obj-title', data.objective?.title);
  setVal('obj-text', data.objective?.text);
}
function collectObjective() {
  return { title: val('obj-title'), text: val('obj-text') };
}

/* ── CONTACT PANEL ── */
function initContactPanel(data) {
  setVal('ct-email', data.contact?.email);
  setVal('ct-phone', data.contact?.phone);
  setVal('ct-address', data.contact?.address);
  setVal('ct-instagram', data.contact?.instagram);
  setVal('ct-linkedin', data.contact?.linkedin);
}
function collectContact() {
  return {
    email: val('ct-email'),
    phone: val('ct-phone'),
    address: val('ct-address'),
    instagram: val('ct-instagram'),
    linkedin: val('ct-linkedin')
  };
}

/* ── GITHUB PUBLISH PANEL ── */
function initGithubPanel() {
  const cfg = loadGithubConfig();
  setVal('gh-user', cfg.user);
  setVal('gh-repo', cfg.repo);
  setVal('gh-branch', cfg.branch || 'main');
  setVal('gh-token', cfg.token);

  document.getElementById('gh-save')?.addEventListener('click', () => {
    const config = { user: val('gh-user'), repo: val('gh-repo'), branch: val('gh-branch') || 'main', token: val('gh-token') };
    localStorage.setItem(GITHUB_CONFIG_KEY, JSON.stringify(config));
    toast('Paramètres GitHub enregistrés', 'success');
    updateGithubStatus();
  });

  document.getElementById('gh-test')?.addEventListener('click', () => {
    // Afficher le panel de log avant le test
    const progress = document.querySelector('.publish-progress');
    if (progress) progress.classList.add('visible');
    const log = document.querySelector('.progress-log');
    if (log) log.innerHTML = '';
    testGithubConnection();
  });

  document.getElementById('gh-publish')?.addEventListener('click', publishToGitHub);
  updateGithubStatus();
}

function loadGithubConfig() {
  try {
    return JSON.parse(localStorage.getItem(GITHUB_CONFIG_KEY) || '{}');
  } catch (_) { return {}; }
}

function updateGithubStatus() {
  const cfg = loadGithubConfig();
  const dot = document.querySelector('.github-status-dot');
  const text = document.querySelector('.github-status-text');
  if (!dot || !text) return;
  if (cfg.user && cfg.repo && cfg.token) {
    dot.className = 'github-status-dot connected';
    text.textContent = `Connecté à ${cfg.user}/${cfg.repo} (${cfg.branch || 'main'})`;
  } else {
    dot.className = 'github-status-dot';
    text.textContent = 'Non configuré — renseignez vos informations ci-dessous';
  }
}

function logProgress(msg, type = '') {
  const log = document.querySelector('.progress-log');
  if (!log) return;
  const line = document.createElement('div');
  if (type) line.className = 'log-' + type;
  line.textContent = msg;
  log.appendChild(line);
  log.scrollTop = log.scrollHeight;
}

function setProgress(pct) {
  const bar = document.querySelector('.progress-bar-fill');
  if (bar) bar.style.width = pct + '%';
}

/* Encodage base64 fiable pour l'API GitHub (supporte é è ê ç etc.) */
function toBase64(str) {
  const bytes = new TextEncoder().encode(str);
  const binary = Array.from(bytes, b => String.fromCharCode(b)).join('');
  return btoa(binary);
}

/* Construit les headers GitHub — compatible tokens classic ET fine-grained */
function githubHeaders(token) {
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28'
  };
}

/* Récupère le SHA d'un fichier existant (null si inexistant) */
async function getFileSha(apiUrl, headers) {
  try {
    const r = await fetch(apiUrl, { headers });
    if (r.status === 404) return null;
    if (r.ok) {
      const j = await r.json();
      return j.sha || null;
    }
  } catch (_) {}
  return null;
}

/* Décode un message d'erreur GitHub en texte lisible */
async function githubErrorMsg(response) {
  try {
    const j = await response.json();
    const detail = j.errors?.map(e => e.message).join(', ') || '';
    return `HTTP ${response.status} — ${j.message || 'Erreur inconnue'}${detail ? ' (' + detail + ')' : ''}`;
  } catch (_) {
    return `HTTP ${response.status}`;
  }
}

async function testGithubConnection() {
  const cfg = loadGithubConfig();
  if (!cfg.user || !cfg.repo || !cfg.token) {
    toast('Remplissez et enregistrez d\'abord les paramètres', 'error');
    return;
  }
  const btn = document.getElementById('gh-test');
  if (btn) { btn.disabled = true; btn.textContent = '⏳ Test…'; }
  try {
    const url = `https://api.github.com/repos/${cfg.user}/${cfg.repo}`;
    const r = await fetch(url, { headers: githubHeaders(cfg.token) });
    if (r.ok) {
      const j = await r.json();
      toast(`✓ Connexion OK — dépôt "${j.full_name}" trouvé`, 'success');
      logProgress(`✓ Connexion réussie : ${j.full_name} (branche par défaut : ${j.default_branch})`, 'ok');
    } else {
      const msg = await githubErrorMsg(r);
      toast(`Connexion échouée : ${msg}`, 'error');
      logProgress(`✕ ${msg}`, 'err');
      if (r.status === 401) logProgress('→ Votre token est invalide ou expiré.', 'err');
      if (r.status === 403) logProgress('→ Le token n\'a pas les permissions nécessaires (scope "repo" manquant).', 'err');
      if (r.status === 404) logProgress('→ Dépôt introuvable. Vérifiez le nom d\'utilisateur et du dépôt.', 'err');
    }
  } catch (e) {
    toast('Erreur réseau : ' + e.message, 'error');
    logProgress('✕ Erreur réseau — vérifiez votre connexion internet.', 'err');
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = '🔌 Tester la connexion'; }
  }
}

async function publishToGitHub() {
  const cfg = loadGithubConfig();
  if (!cfg.user || !cfg.repo || !cfg.token) {
    toast('Configurez d\'abord vos paramètres GitHub', 'error');
    switchPanel('github');
    return;
  }

  const progress = document.querySelector('.publish-progress');
  if (progress) progress.classList.add('visible');
  const log = document.querySelector('.progress-log');
  if (log) log.innerHTML = '';
  setProgress(0);

  const btn = document.getElementById('gh-publish');
  if (btn) btn.disabled = true;

  const BASE = `https://api.github.com/repos/${cfg.user}/${cfg.repo}/contents`;
  const BRANCH = cfg.branch || 'main';
  const HEADERS = githubHeaders(cfg.token);

  try {
    const data = loadData();
    logProgress(`Début de la publication → ${cfg.user}/${cfg.repo} (${BRANCH})`);
    setProgress(5);

    // ── Uploader les images base64 ──
    logProgress('Analyse des images…');
    let imageCount = 0;

    async function uploadImage(dataUrl, filename) {
      const base64 = dataUrl.split(',')[1];
      if (!base64) return dataUrl;
      const filePath = `uploads/${filename}`;
      const apiUrl = `${BASE}/${filePath}`;
      logProgress(`  Upload image : ${filename}…`);
      const sha = await getFileSha(apiUrl, HEADERS);
      const body = { message: `chore: upload ${filename}`, content: base64, branch: BRANCH };
      if (sha) body.sha = sha;
      const r = await fetch(apiUrl, { method: 'PUT', headers: HEADERS, body: JSON.stringify(body) });
      if (!r.ok) {
        const msg = await githubErrorMsg(r);
        throw new Error(`Image "${filename}" : ${msg}`);
      }
      logProgress(`  ✓ ${filename} uploadée`, 'ok');
      return filePath;
    }

    async function processImages(obj) {
      if (typeof obj !== 'object' || !obj) return obj;
      if (Array.isArray(obj)) {
        const result = [];
        for (const item of obj) result.push(await processImages(item));
        return result;
      }
      const result = {};
      for (const key of Object.keys(obj)) {
        const v = obj[key];
        if (typeof v === 'string' && v.startsWith('data:image/')) {
          imageCount++;
          const ext = v.match(/data:image\/(\w+)/)?.[1] || 'jpg';
          const fname = `img_${Date.now()}_${imageCount}.${ext}`;
          result[key] = await uploadImage(v, fname);
        } else if (typeof v === 'object' && v !== null) {
          result[key] = await processImages(v);
        } else {
          result[key] = v;
        }
      }
      return result;
    }

    const processedData = await processImages(JSON.parse(JSON.stringify(data)));
    const imgMsg = imageCount > 0 ? `${imageCount} image(s) uploadée(s).` : 'Aucune image locale détectée.';
    logProgress(imgMsg, imageCount > 0 ? 'ok' : '');
    setProgress(60);

    // ── Uploader portfolio-data.json ──
    logProgress('Upload de portfolio-data.json…');
    const jsonStr = JSON.stringify(processedData, null, 2);
    const jsonContent = toBase64(jsonStr);
    const jsonApiUrl = `${BASE}/portfolio-data.json`;
    const jsonSha = await getFileSha(jsonApiUrl, HEADERS);

    const jsonBody = {
      message: 'feat: update portfolio-data.json via admin panel',
      content: jsonContent,
      branch: BRANCH
    };
    if (jsonSha) {
      jsonBody.sha = jsonSha;
      logProgress('  (fichier existant — mise à jour)');
    } else {
      logProgress('  (nouveau fichier — création)');
    }

    setProgress(80);
    const jsonRes = await fetch(jsonApiUrl, {
      method: 'PUT',
      headers: HEADERS,
      body: JSON.stringify(jsonBody)
    });

    if (!jsonRes.ok) {
      const msg = await githubErrorMsg(jsonRes);
      if (jsonRes.status === 401) throw new Error(`401 — Token invalide ou expiré. Recréez un token avec le scope "repo".`);
      if (jsonRes.status === 403) throw new Error(`403 — Permissions insuffisantes. Assurez-vous que le token a le scope "repo".`);
      if (jsonRes.status === 404) throw new Error(`404 — Dépôt introuvable. Vérifiez le nom d'utilisateur ("${cfg.user}") et du dépôt ("${cfg.repo}").`);
      if (jsonRes.status === 422) throw new Error(`422 — SHA incorrect. Réessayez (conflit de version).`);
      throw new Error(msg);
    }

    setProgress(100);
    logProgress('✓ portfolio-data.json publié avec succès !', 'ok');
    logProgress('⏳ GitHub Pages se met à jour… patientez ~2 minutes puis faites Ctrl+Shift+R sur votre site.');
    toast('Publication réussie ! Le site sera à jour dans ~2 minutes.', 'success');

  } catch (err) {
    logProgress('✕ ' + err.message, 'err');
    toast('Erreur : ' + err.message, 'error');
  } finally {
    if (btn) btn.disabled = false;
  }
}

/* ── COLLECT ALL DATA ── */
function collectAllData() {
  return {
    hero: collectHero(),
    introduction: collectIntro(),
    about: collectAbout(),
    education: collectEducationList(),
    skills: collectSkillsList(),
    experience: collectExperienceList(),
    projects: collectProjectsList(),
    testimonials: collectTestimonialsList(),
    blog: collectBlogList(),
    roadmap: collectRoadmapList(),
    inspirations: collectInspirationsList(),
    objective: collectObjective(),
    contact: collectContact()
  };
}

/* ── SAVE BUTTON ── */
function initSaveButton() {
  document.getElementById('btn-save')?.addEventListener('click', () => {
    const data = collectAllData();
    saveData(data);
    toast('Données sauvegardées en local', 'success');
  });
}

/* ── CARD TOGGLES ── */
function initCardToggles(container) {
  (container || document).querySelectorAll('.list-card-header').forEach(header => {
    header.addEventListener('click', (e) => {
      if (e.target.closest('button')) return;
      header.closest('.list-card').classList.toggle('open');
    });
  });
}

/* ── ESCAPE ── */
function esc(str) {
  return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ── PASSWORD CHANGE ── */
function initPasswordChange() {
  document.getElementById('btn-change-password')?.addEventListener('click', () => {
    const cur = val('pwd-current');
    const next = val('pwd-new');
    const conf = val('pwd-confirm');
    const stored = localStorage.getItem('portfolio_admin_password') || DEFAULT_PASSWORD;
    if (cur !== stored) { toast('Mot de passe actuel incorrect', 'error'); return; }
    if (!next) { toast('Le nouveau mot de passe est vide', 'error'); return; }
    if (next !== conf) { toast('Les mots de passe ne correspondent pas', 'error'); return; }
    localStorage.setItem('portfolio_admin_password', next);
    toast('Mot de passe mis à jour', 'success');
    setVal('pwd-current', ''); setVal('pwd-new', ''); setVal('pwd-confirm', '');
  });
}

/* ── DEFAULT DATA (copy from main.js for admin init) ── */
function getDefaultData() {
  return {
    hero: { subtitle: 'GMP — ESIG Global Success', name: 'TOUDJI', firstname: 'KOKOUVI ÉDOUARD', title: 'Génie Mécanique & Productique', description: 'Étudiant en GMP, passionné par la conception mécanique, l\'automatisation industrielle et les solutions techniques innovantes. Disponible pour stages et opportunités.', cvLink: 'Media/cv.pdf', photo: '', stats: [{num:'4',label:'SAE réalisées'},{num:'2+',label:'Ans d\'études'},{num:'∞',label:'Motivation'}] },
    introduction: { title: 'Qui suis-je ?', text: 'Je suis TOUDJI Kokouvi Édouard, étudiant en BUT Génie Mécanique & Productique à l\'ESIG Global Success de Lomé, au Togo.\n\nPassionné par la mécanique, l\'automatisme et l\'électrotechnique, je suis disponible pour des stages et toute opportunité professionnelle enrichissante.', image: '' },
    about: { text: 'Étudiant en Génie Mécanique & Productique, je combine rigueur technique et créativité pour concevoir des solutions adaptées aux enjeux industriels actuels.\n\nMon parcours à l\'ESIG Global Success m\'a permis de développer des compétences solides en conception mécanique, fabrication, automatisme et électrotechnique.', image: '', qualities: ['Rigoureux', 'Créatif', 'Curieux', 'Autonome', 'Esprit d\'équipe'], values: ['Excellence', 'Sécurité', 'Innovation', 'Qualité', 'Développement durable'] },
    education: [
      { school: 'ESIG Global Success — Lomé, Togo', degree: 'BUT Génie Mécanique & Productique', year: '2023 — En cours', description: 'Formation en conception mécanique, fabrication, automatisme et électrotechnique. Réalisation de projets concrets (SAE).' },
      { school: 'Lycée — Lomé, Togo', degree: 'Baccalauréat Série C', year: '2022', description: 'Baccalauréat scientifique avec spécialisation mathématiques et sciences physiques.' }
    ],
    skills: [
      { category: 'Conception & CAO', icon: '⚙️', description: '', tags: ['SolidWorks', 'CATIA', 'AutoCAD', 'Modélisation 3D', 'Mise en plan'] },
      { category: 'Fabrication & Usinage', icon: '🔧', description: '', tags: ['Tournage', 'Fraisage', 'Tolérancement', 'Contrôle qualité', 'Ébavurage'] },
      { category: 'Électrotechnique', icon: '⚡', description: '', tags: ['Moteurs asynchrones', 'Schémas électriques', 'Appareillage', 'Câblage'] },
      { category: 'Automatisme', icon: '🤖', description: '', tags: ['Grafcet', 'Logique combinatoire', 'Systèmes séquentiels'] },
      { category: 'Analyse & Méthode', icon: '📐', description: '', tags: ['FAST', 'SADT', 'AMDEC', 'Rapport technique'] },
      { category: 'Transversales', icon: '👥', description: '', tags: ['Travail en équipe', 'Gestion de projet', 'Communication', 'Rigueur'] }
    ],
    experience: [
      { role: 'Table ergonomique motorisée', company: 'Semaine de professionnalisation — ESIG', period: '2024', type: 'Projet pratique', description: 'Réalisation complète d\'une table ergonomique, pliable et motorisée. Conception sous SolidWorks, finition et gestion de projet en équipe.', tags: ['SolidWorks', 'Conception mécanique', 'Travail en équipe', 'Traitement de surface'] }
    ],
    projects: [
      { name: 'SAE 1 — Analyse d\'un système électrotechnique simple', category: 'Électrotechnique', description: 'Analyse complète d\'un système électrotechnique monophasé : structure, fonctionnement et performances.', image: '', tags: ['Électrotechnique', 'Mesures', 'Analyse', 'Rapport technique'] },
      { name: 'SAE 2 — Conception d\'un automatisme séquentiel', category: 'Automatisme', description: 'Conception et validation d\'un automatisme séquentiel à partir d\'un cahier des charges.', image: '', tags: ['Grafcet', 'Automatisme', 'Logique séquentielle'] },
      { name: 'SAE 3 — Conception mécanique d\'un sous-ensemble', category: 'Conception', description: 'Conception et modélisation 3D d\'un sous-ensemble mécanique avec mise en plan détaillée.', image: '', tags: ['SolidWorks', 'Cotation', 'Tolérancement', 'Mise en plan'] },
      { name: 'SAE 4 — Amélioration éclairage et ventilation en atelier', category: 'Ergonomie', description: 'Solutions techniques pour optimiser les conditions de travail : systèmes LED, ventilation et conformité aux normes.', image: '', tags: ['Analyse ergonomique', 'Systèmes LED', 'Ventilation', 'Normes'] }
    ],
    testimonials: [{ author: 'Encadrant ESIG', role: 'Professeur, ESIG Global Success', text: 'Édouard fait preuve d\'une rigueur et d\'un sérieux remarquables dans tous ses projets.', rating: 5, initials: 'EE' }],
    blog: [{ title: 'Retour sur la SAE 4 : optimiser l\'éclairage et la ventilation en atelier', date: '2025-12-01', tag: 'GMP', summary: 'À travers ce projet, j\'ai découvert comment l\'ingénierie peut améliorer les conditions de travail.', link: '#' }],
    roadmap: [
      { icon: '🎓', date: '2022', title: 'Baccalauréat Série C', description: 'Obtention du baccalauréat scientifique à Lomé, Togo.', done: true },
      { icon: '📚', date: '2023', title: 'Entrée en BUT GMP — ESIG Global Success', description: 'Intégration de la formation Génie Mécanique & Productique.', done: true },
      { icon: '🔧', date: '2024', title: 'Semaine de professionnalisation', description: 'Réalisation d\'une table ergonomique motorisée en équipe.', done: true },
      { icon: '🚀', date: '2025', title: 'Stage professionnel', description: 'Mise en pratique des compétences acquises en GMP en entreprise.', done: false },
      { icon: '🎯', date: '2026', title: 'Obtention du BUT & insertion professionnelle', description: 'Validation du diplôme et intégration dans l\'industrie.', done: false }
    ],
    inspirations: [
      { name: 'Nikola Tesla', role: 'Ingénieur & Inventeur', description: 'Son génie en électrotechnique et sa capacité à transformer des concepts abstraits en innovations concrètes m\'inspirent profondément.' },
      { name: 'Elon Musk', role: 'Entrepreneur & Ingénieur', description: 'Sa vision industrielle audacieuse — de SpaceX à Tesla — démontre que l\'ingénierie peut repousser toutes les limites.' }
    ],
    objective: { title: 'Mon Objectif Professionnel', text: 'Je souhaite mettre mes compétences en GMP au service de projets innovants et durables, en contribuant à des solutions techniques rigoureuses qui ont un impact réel sur l\'industrie et la société.\n\nJe cherche à intégrer un environnement stimulant où je pourrai continuer à apprendre, à progresser et à relever des défis techniques ambitieux.' },
    contact: { email: 'edboysedouardo@gmail.com', phone: '+228 98 25 50 11', address: 'Lomé, Togo', instagram: '', linkedin: '' }
  };
}

/* ── MOBILE SIDEBAR ── */
function initMobileSidebar() {
  const menuBtn = document.querySelector('.topbar-menu-btn');
  const sidebar = document.querySelector('.admin-sidebar');
  if (!menuBtn || !sidebar) return;
  menuBtn.addEventListener('click', () => sidebar.classList.toggle('open'));
}

/* ── LOGIN FLOW ── */
function initLogin() {
  const form = document.getElementById('login-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const pw = document.getElementById('login-password')?.value || '';
    if (login(pw)) {
      document.getElementById('login-page').style.display = 'none';
      document.getElementById('admin-app').style.display = 'flex';
      initAdmin();
    } else {
      const err = document.querySelector('.login-error');
      if (err) err.classList.add('visible');
    }
  });
}

/* ── INIT ADMIN APP ── */
function initAdmin() {
  const data = loadData();

  // Init all panels
  initHeroPanel(data);
  initIntroPanel(data);
  initAboutPanel(data);
  initEducationPanel(data);
  initSkillsPanel(data);
  initExperiencePanel(data);
  initProjectsPanel(data);
  initTestimonialsPanel(data);
  initBlogPanel(data);
  initRoadmapPanel(data);
  initInspirationsPanel(data);
  initObjectivePanel(data);
  initContactPanel(data);
  initGithubPanel();
  initSaveButton();
  initPasswordChange();
  initMobileSidebar();

  // Nav items
  document.querySelectorAll('.sidebar-nav-item').forEach(item => {
    item.addEventListener('click', () => {
      switchPanel(item.dataset.section);
      document.querySelector('.admin-sidebar')?.classList.remove('open');
    });
  });

  // Logout
  document.querySelector('.sidebar-logout')?.addEventListener('click', logout);

  // Default panel
  switchPanel('hero');
}

/* ── START ── */
document.addEventListener('DOMContentLoaded', () => {
  if (isLoggedIn()) {
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('admin-app').style.display = 'flex';
    initAdmin();
  } else {
    initLogin();
  }
});
