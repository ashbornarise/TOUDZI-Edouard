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

  try {
    const data = loadData();
    const BASE = `https://api.github.com/repos/${cfg.user}/${cfg.repo}/contents`;
    const HEADERS = {
      'Authorization': `token ${cfg.token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.github.v3+json'
    };

    // Extraire et uploader les images base64
    logProgress('Analyse des images…');
    setProgress(10);
    let imageCount = 0;
    async function uploadImage(dataUrl, filename) {
      const base64 = dataUrl.split(',')[1];
      if (!base64) return dataUrl;
      const path = `uploads/${filename}`;
      const apiPath = `${BASE}/${path}`;
      let sha = null;
      try {
        const r = await fetch(apiPath, { headers: HEADERS });
        if (r.ok) { const j = await r.json(); sha = j.sha; }
      } catch (_) {}
      const body = { message: `Upload image: ${filename}`, content: base64, branch: cfg.branch || 'main' };
      if (sha) body.sha = sha;
      const r2 = await fetch(apiPath, { method: 'PUT', headers: HEADERS, body: JSON.stringify(body) });
      if (!r2.ok) throw new Error(`Upload image ${filename} échoué (${r2.status})`);
      logProgress(`✓ Image uploadée : ${filename}`, 'ok');
      return path;
    }

    async function processImages(obj) {
      if (typeof obj !== 'object' || !obj) return obj;
      if (Array.isArray(obj)) return Promise.all(obj.map(processImages));
      const result = {};
      for (const key of Object.keys(obj)) {
        const v = obj[key];
        if (typeof v === 'string' && v.startsWith('data:image/')) {
          imageCount++;
          const ext = v.match(/data:image\/(\w+)/)?.[1] || 'jpg';
          const fname = `img_${Date.now()}_${imageCount}.${ext}`;
          result[key] = await uploadImage(v, fname);
        } else if (typeof v === 'object') {
          result[key] = await processImages(v);
        } else {
          result[key] = v;
        }
      }
      return result;
    }

    const processedData = await processImages(JSON.parse(JSON.stringify(data)));
    setProgress(60);
    logProgress('Images traitées. Upload de portfolio-data.json…');

    // Upload portfolio-data.json
    const jsonContent = btoa(unescape(encodeURIComponent(JSON.stringify(processedData, null, 2))));
    let jsonSha = null;
    try {
      const r = await fetch(`${BASE}/portfolio-data.json`, { headers: HEADERS });
      if (r.ok) { const j = await r.json(); jsonSha = j.sha; }
    } catch (_) {}
    const jsonBody = {
      message: 'Update portfolio-data.json via admin panel',
      content: jsonContent,
      branch: cfg.branch || 'main'
    };
    if (jsonSha) jsonBody.sha = jsonSha;
    const jsonRes = await fetch(`${BASE}/portfolio-data.json`, {
      method: 'PUT', headers: HEADERS, body: JSON.stringify(jsonBody)
    });
    if (!jsonRes.ok) {
      const err = await jsonRes.json();
      throw new Error(err.message || `Erreur ${jsonRes.status}`);
    }
    setProgress(100);
    logProgress('✓ portfolio-data.json publié avec succès !', 'ok');
    logProgress('GitHub Pages se met à jour (~2 minutes)…');
    toast('Publication réussie ! Site mis à jour dans ~2 minutes.', 'success');
  } catch (err) {
    logProgress('✕ Erreur : ' + err.message, 'err');
    toast('Erreur de publication : ' + err.message, 'error');
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
    hero: { subtitle: 'Portfolio Professionnel', name: 'ATTOH-MENSAH', firstname: 'Yao Pédro-Ebenezer', title: 'Ingénieur | Innovateur', description: 'Passionné par les solutions techniques innovantes.', cvLink: '', photo: '', stats: [{num:'5+',label:'Projets'},{num:'3+',label:'Ans études'},{num:'∞',label:'Motivation'}] },
    introduction: { title: 'Qui suis-je ?', text: '', image: '' },
    about: { text: '', image: '', qualities: [], values: [] },
    education: [],
    skills: [],
    experience: [],
    projects: [],
    testimonials: [],
    blog: [],
    roadmap: [],
    inspirations: [],
    objective: { title: 'Mon Objectif', text: '' },
    contact: { email: '', phone: '', address: '', instagram: '', linkedin: '' }
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
