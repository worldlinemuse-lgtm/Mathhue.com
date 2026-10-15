/* Renders the classic-profile homage from site.config.json.
   Wall posts + poke count persist in localStorage (this browser only). */
(async function () {
  let cfg;
  try {
    cfg = await (await fetch('site.config.json')).json();
  } catch (e) {
    console.error('Could not load site.config.json', e);
    return;
  }

  const name = cfg.siteName || 'MathHue';
  document.title = `${name} | ${cfg.tagline || ''}`;

  document.querySelectorAll('[data-config]').forEach(el => {
    const key = el.getAttribute('data-config');
    if (cfg[key]) el.textContent = cfg[key];
  });

  // Portrait
  const portrait = document.getElementById('portrait');
  if (cfg.portrait) portrait.src = cfg.portrait;

  // Status (third person, classic style)
  document.getElementById('status-text').textContent = cfg.status || '';

  // Placeholder links: dim + disable instead of dead-navigating.
  // Dropping a real URL into site.config.json activates them automatically.
  function wireLink(el, url) {
    el.href = url || '#';
    if (!url || url.startsWith('#')) {
      el.classList.add('placeholder');
      el.addEventListener('click', e => e.preventDefault());
    }
  }

  // Discord + PayPal links
  const discordUrl = (cfg.discord && cfg.discord.url) || '#';
  const discordLabel = (cfg.discord && cfg.discord.label) || 'Join the Discord';
  const discordBtn = document.getElementById('discord-btn');
  wireLink(discordBtn, discordUrl);
  discordBtn.textContent = discordLabel;
  wireLink(document.getElementById('discord-link-2'), discordUrl);
  const paypalUrl = (cfg.donate && cfg.donate.paypalUrl) || '#';
  wireLink(document.getElementById('paypal-btn'), paypalUrl);

  // Information box
  const infoRows = document.getElementById('info-rows');
  (cfg.info || []).forEach(row => {
    const dt = document.createElement('dt');
    dt.textContent = row.label;
    const dd = document.createElement('dd');
    if (row.url && !row.url.startsWith('#')) {
      const a = document.createElement('a');
      a.href = row.url;
      a.textContent = row.value;
      dd.appendChild(a);
    } else {
      dd.textContent = row.value;
    }
    infoRows.appendChild(dt, dd);
  });

  // Websites (social dock)
  const dock = document.getElementById('social-dock');
  (cfg.socials || []).forEach(s => {
    const a = document.createElement('a');
    a.href = s.url || '#';
    a.title = s.name;
    a.setAttribute('aria-label', s.name);
    if (!s.url || s.url.startsWith('#')) {
      a.classList.add('placeholder');
      a.addEventListener('click', e => e.preventDefault());
    }
    a.innerHTML = (typeof SOCIAL_ICONS !== 'undefined' && SOCIAL_ICONS[s.icon]) || s.name;
    dock.appendChild(a);
  });

  // Community + photos placeholder grids
  const thumb = () =>
    `<div><img src="${portraitPlaceholderSVG()}" alt=""><div class="thumb-label">Member</div></div>`;
  document.getElementById('community-grid').innerHTML = Array(6).fill(thumb()).join('');
  document.getElementById('photos-strip').innerHTML =
    Array(3).fill(`<div><img src="${portraitPlaceholderSVG()}" alt=""><div class="thumb-label">Album</div></div>`).join('');

  // Mini-Feed
  const feed = document.getElementById('mini-feed');
  (cfg.miniFeed || []).forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `<span><strong>${name}</strong> ${item.text}</span><span class="time">${item.time || ''}</span>`;
    feed.appendChild(li);
  });

  // Boxes (feature tiles)
  const boxes = document.getElementById('boxes');
  (cfg.tiles || []).filter(t => t.enabled).forEach(t => {
    const div = document.createElement('div');
    div.className = 'app-box';
    div.id = 'box-' + t.id;
    const feats = (t.features || []).map(f => `<li>${f}</li>`).join('');
    div.innerHTML = `
      <h3>${t.title}</h3>
      <p>${t.blurb || ''}</p>
      ${feats ? `<ul>${feats}</ul>` : ''}`;
    boxes.appendChild(div);
  });

  // Poke (localStorage counter, classic style)
  const pokeKey = 'mathhue_pokes';
  const pokeNote = document.getElementById('poke-note');
  const renderPokes = () => {
    const n = parseInt(localStorage.getItem(pokeKey) || '0', 10);
    if (n > 0) {
      pokeNote.hidden = false;
      pokeNote.textContent = `You have poked ${name} ${n} time${n === 1 ? '' : 's'}.`;
    }
  };
  document.getElementById('poke-link').addEventListener('click', e => {
    e.preventDefault();
    localStorage.setItem(pokeKey, String((parseInt(localStorage.getItem(pokeKey) || '0', 10)) + 1));
    renderPokes();
  });
  renderPokes();

  // The Wall (localStorage guestbook)
  const wallKey = 'mathhue_wall';
  const wallPosts = document.getElementById('wall-posts');
  const wallEmpty = document.getElementById('wall-empty');
  const getPosts = () => {
    try { return JSON.parse(localStorage.getItem(wallKey) || '[]'); } catch { return []; }
  };
  const renderWall = () => {
    const posts = getPosts();
    wallEmpty.style.display = posts.length ? 'none' : '';
    wallPosts.innerHTML = '';
    posts.forEach(p => {
      const li = document.createElement('li');
      const when = new Date(p.ts).toLocaleString();
      li.innerHTML = `
        <img class="wall-thumb" src="${portraitPlaceholderSVG()}" alt="">
        <div class="wall-body">
          <span class="wall-name">Guest</span>
          <span class="wall-text"></span>
          <span class="wall-time">${when}</span>
        </div>`;
      li.querySelector('.wall-text').textContent = p.text;
      wallPosts.appendChild(li);
    });
  };
  document.getElementById('wall-post').addEventListener('click', () => {
    const input = document.getElementById('wall-input');
    const text = input.value.trim();
    if (!text) return;
    const posts = getPosts();
    posts.unshift({ text, ts: Date.now() });
    localStorage.setItem(wallKey, JSON.stringify(posts.slice(0, 50)));
    input.value = '';
    renderWall();
  });
  renderWall();

  document.getElementById('year').textContent = new Date().getFullYear();
})();
