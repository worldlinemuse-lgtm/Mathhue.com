/* Applies site.config.json to the page. To fill in real assets later,
   edit site.config.json only — no HTML changes needed. */
(async function () {
  let cfg;
  try {
    const res = await fetch('site.config.json');
    cfg = await res.json();
  } catch (e) {
    console.error('Could not load site.config.json', e);
    return;
  }

  document.title = `${cfg.siteName} — ${cfg.tagline}`;

  // Text slots
  document.querySelectorAll('[data-config]').forEach(el => {
    const key = el.getAttribute('data-config');
    if (cfg[key]) el.textContent = cfg[key];
  });

  // Portrait
  const portrait = document.getElementById('portrait');
  if (cfg.portrait) portrait.src = cfg.portrait;

  // Discord buttons
  const discordUrl = (cfg.discord && cfg.discord.url) || '#';
  const discordLabel = (cfg.discord && cfg.discord.label) || 'Join the Discord';
  ['discord-btn', 'discord-btn-2'].forEach(id => {
    const a = document.getElementById(id);
    if (a) { a.href = discordUrl; a.textContent = discordLabel; }
  });

  // Social dock
  const dock = document.getElementById('social-dock');
  (cfg.socials || []).forEach(s => {
    const a = document.createElement('a');
    a.href = s.url || '#';
    a.title = s.name;
    a.setAttribute('aria-label', s.name);
    a.className = 'social-icon' + (s.url && s.url.startsWith('#') ? ' placeholder' : '');
    a.innerHTML = (typeof SOCIAL_ICONS !== 'undefined' && SOCIAL_ICONS[s.icon]) || s.name;
    dock.appendChild(a);
  });

  // Feature tiles
  const grid = document.getElementById('tiles');
  (cfg.tiles || []).filter(t => t.enabled).forEach(t => {
    const article = document.createElement('article');
    article.className = 'tile';
    article.id = t.id;
    const feats = (t.features || []).map(f => `<li>${f}</li>`).join('');
    article.innerHTML = `
      <h2>${t.title}</h2>
      <p>${t.blurb || ''}</p>
      ${feats ? `<ul>${feats}</ul>` : ''}
      <a class="btn btn-tile" href="${t.link || '#'}">${t.cta || 'Open'}</a>`;
    grid.appendChild(article);
  });

  document.getElementById('year').textContent = new Date().getFullYear();
})();
