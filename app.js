/* Renders the classic-profile homage from site.config.json.
   Wall posts + poke count persist in localStorage (this browser only),
   with an in-memory fallback when storage is unavailable (private mode,
   quota exceeded). All config-driven text is rendered via textContent —
   no innerHTML on dynamic data — so malformed config can't inject markup. */
(async function () {
  'use strict';

  // ---------- Safe storage ----------
  const store = (() => {
    const mem = {};
    let ok = false;
    try {
      const k = '__mathhue_probe__';
      localStorage.setItem(k, '1');
      localStorage.removeItem(k);
      ok = true;
    } catch { ok = false; }
    return {
      get(k, fb) {
        try {
          const v = ok ? localStorage.getItem(k) : mem[k];
          return v == null ? fb : v;
        } catch {
          return mem[k] != null ? mem[k] : fb;
        }
      },
      set(k, v) {
        try {
          if (ok) localStorage.setItem(k, v);
          else mem[k] = v;
        } catch {
          try { mem[k] = v; } catch { /* storage fully unavailable */ }
        }
      },
    };
  })();

  // ---------- Visible failure instead of a hollow page ----------
  function fail(msg) {
    const bar = document.getElementById('config-error');
    if (bar) {
      bar.hidden = false;
      bar.textContent = msg;
    }
    console.error('[MathHue]', msg);
  }

  // ---------- Load + validate config ----------
  let cfg;
  try {
    const res = await fetch('site.config.json');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    cfg = await res.json();
  } catch (e) {
    fail('Could not load the site configuration. Check your connection and refresh the page.');
    return;
  }
  if (!cfg || typeof cfg !== 'object' || Array.isArray(cfg)) {
    fail('The site configuration is malformed and could not be displayed.');
    return;
  }
  const str = v => (typeof v === 'string' ? v : '');
  const arr = v => (Array.isArray(v) ? v : []);
  const stripTags = s => str(s).replace(/<[^>]*>/g, '');

  const name = str(cfg.siteName) || 'MathHue';
  document.title = `${name} | ${str(cfg.tagline)}`;

  document.querySelectorAll('[data-config]').forEach(el => {
    const key = el.getAttribute('data-config');
    if (typeof cfg[key] === 'string') el.textContent = cfg[key];
  });

  // ---------- Placeholder links: dim + disable, never dead-navigate ----------
  // Dropping a real URL into site.config.json activates them automatically.
  function wireLink(el, url) {
    el.href = str(url) || '#';
    if (!str(url) || str(url).startsWith('#')) {
      el.classList.add('placeholder');
      el.addEventListener('click', e => e.preventDefault());
    }
  }

  // Portrait
  const portrait = document.getElementById('portrait');
  if (str(cfg.portrait)) portrait.src = cfg.portrait;

  // Status (third person, classic style)
  document.getElementById('status-text').textContent = str(cfg.status);

  // Discord + PayPal links
  const discordUrl = str(cfg.discord && cfg.discord.url);
  const discordBtn = document.getElementById('discord-btn');
  wireLink(discordBtn, discordUrl);
  discordBtn.textContent = str(cfg.discord && cfg.discord.label) || 'Join the Discord';
  wireLink(document.getElementById('discord-link-2'), discordUrl);
  wireLink(document.getElementById('paypal-btn'), str(cfg.donate && cfg.donate.paypalUrl));

  // Information box
  const infoRows = document.getElementById('info-rows');
  arr(cfg.info).forEach(row => {
    if (!row || typeof row !== 'object') return;
    const dt = document.createElement('dt');
    dt.textContent = str(row.label);
    const dd = document.createElement('dd');
    if (str(row.url) && !str(row.url).startsWith('#')) {
      const a = document.createElement('a');
      a.href = str(row.url);
      a.textContent = str(row.value);
      dd.appendChild(a);
    } else {
      dd.textContent = str(row.value);
    }
    infoRows.appendChild(dt, dd);
  });

  // Websites (social dock)
  const dock = document.getElementById('social-dock');
  arr(cfg.socials).forEach(s => {
    if (!s || typeof s !== 'object') return;
    const a = document.createElement('a');
    wireLink(a, str(s.url));
    a.title = str(s.name);
    a.setAttribute('aria-label', str(s.name) || 'social link');
    const icon = typeof SOCIAL_ICONS !== 'undefined' && SOCIAL_ICONS[s.icon];
    if (icon) a.innerHTML = icon; // fixed trusted icon set only
    else a.textContent = str(s.name);
    dock.appendChild(a);
  });

  // Community + photos placeholder grids
  const thumb = () => {
    const wrap = document.createElement('div');
    const img = document.createElement('img');
    img.src = portraitPlaceholderSVG();
    img.alt = '';
    const label = document.createElement('div');
    label.className = 'thumb-label';
    label.textContent = 'Member';
    wrap.append(img, label);
    return wrap;
  };
  const community = document.getElementById('community-grid');
  for (let i = 0; i < 6; i++) community.appendChild(thumb());
  const photos = document.getElementById('photos-strip');
  for (let i = 0; i < 3; i++) {
    const t = thumb();
    t.querySelector('.thumb-label').textContent = 'Album';
    photos.appendChild(t);
  }

  // Mini-Feed
  const feed = document.getElementById('mini-feed');
  arr(cfg.miniFeed).forEach(item => {
    if (!item || typeof item !== 'object') return;
    const li = document.createElement('li');
    const who = document.createElement('strong');
    who.textContent = name;
    const what = document.createElement('span');
    what.append(who, document.createTextNode(' ' + stripTags(item.text)));
    const time = document.createElement('span');
    time.className = 'time';
    time.textContent = str(item.time);
    li.append(what, time);
    feed.appendChild(li);
  });

  // Boxes (feature tiles)
  const boxes = document.getElementById('boxes');
  arr(cfg.tiles).filter(t => t && t.enabled).forEach(t => {
    const div = document.createElement('div');
    div.className = 'app-box';
    div.id = 'box-' + stripTags(t.id);
    const h3 = document.createElement('h3');
    h3.textContent = str(t.title);
    const p = document.createElement('p');
    p.textContent = str(t.blurb);
    div.append(h3, p);
    if (arr(t.features).length) {
      const ul = document.createElement('ul');
      arr(t.features).forEach(f => {
        const li = document.createElement('li');
        li.textContent = str(f);
        ul.appendChild(li);
      });
      div.appendChild(ul);
    }
    boxes.appendChild(div);
  });

  // Poke (storage-backed counter, classic style)
  const pokeKey = 'mathhue_pokes';
  const pokeNote = document.getElementById('poke-note');
  const renderPokes = () => {
    const n = parseInt(store.get(pokeKey, '0'), 10) || 0;
    if (n > 0) {
      pokeNote.hidden = false;
      pokeNote.textContent = `You have poked ${name} ${n} time${n === 1 ? '' : 's'}.`;
    }
  };
  document.getElementById('poke-link').addEventListener('click', () => {
    const n = parseInt(store.get(pokeKey, '0'), 10) || 0;
    store.set(pokeKey, String(n + 1));
    renderPokes();
  });
  renderPokes();

  // The Wall (storage-backed guestbook)
  const wallKey = 'mathhue_wall';
  const wallPosts = document.getElementById('wall-posts');
  const wallEmpty = document.getElementById('wall-empty');
  const getPosts = () => {
    try {
      const v = JSON.parse(store.get(wallKey, '[]'));
      return Array.isArray(v) ? v : [];
    } catch { return []; }
  };
  const renderWall = () => {
    const posts = getPosts().filter(p => p && typeof p.text === 'string').slice(0, 50);
    wallEmpty.style.display = posts.length ? 'none' : '';
    wallPosts.textContent = '';
    posts.forEach(p => {
      const li = document.createElement('li');
      const img = document.createElement('img');
      img.className = 'wall-thumb';
      img.src = portraitPlaceholderSVG();
      img.alt = '';
      const body = document.createElement('div');
      body.className = 'wall-body';
      const who = document.createElement('span');
      who.className = 'wall-name';
      const whoLink = document.createElement('a');
      whoLink.href = '#wall';
      whoLink.textContent = 'Guest';
      who.appendChild(whoLink);
      const text = document.createElement('span');
      text.className = 'wall-text';
      text.textContent = p.text;
      const when = document.createElement('span');
      when.className = 'wall-time';
      const ts = Number(p.ts);
      when.textContent = Number.isFinite(ts) ? new Date(ts).toLocaleString() : '';
      body.append(who, document.createTextNode(' '), text, when);
      li.append(img, body);
      wallPosts.appendChild(li);
    });
  };
  document.getElementById('wall-post').addEventListener('click', () => {
    const input = document.getElementById('wall-input');
    const text = input.value.trim().slice(0, 500);
    if (!text) return;
    const posts = getPosts();
    posts.unshift({ text, ts: Date.now() });
    store.set(wallKey, JSON.stringify(posts.slice(0, 50)));
    input.value = '';
    renderWall();
  });
  renderWall();

  document.getElementById('year').textContent = new Date().getFullYear();
})();
