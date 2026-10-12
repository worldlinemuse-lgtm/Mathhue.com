# Mathhue.com

A design homage to the classic 2007-era Facebook profile — built for the
"Free World Creator & Researcher" spec. Not affiliated with Facebook.

## Design language (from research)

- Era recreated: **2007–early 2008**, the most iconic classic Facebook.
- Palette: `#3B5998` header/links/buttons, `#6D84B4`, `#D8DFEA` hairlines,
  `#BDC7D8` borders, `#ECEFF5` tinted boxes, `#333` body text,
  `#DD3C10` notification red, `#FFF9D7` highlights. Flat colors, 1px
  borders, square corners — no gradients, no shadows.
- Type: `"lucida grande", tahoma, verdana, arial, sans-serif`; body 11px;
  profile name 20px bold; section headers 13px bold.
- Anatomy: blue header bar with lowercase wordmark + tabs; centered ~800px
  page on gray; left column (photo ~200px, Poke / Send Message actions,
  tinted Information box, Websites, Community grid, Photos strip); main
  column (name, third-person status — "Mathhue is …", Mini-Feed, Boxes,
  The Wall with composer).

## Filling in the real assets later

Edit **`site.config.json`** only:

| Field | What to put |
|---|---|
| `siteName` / `tagline` / `status` | Name, tagline, "is …" status text |
| `portrait` | Drop the photo in `assets/` (silhouette shows until then) |
| `discord.url` / `discord.label` | Invite link + button text |
| `donate.paypalUrl` | PayPal donation link |
| `info[]` | `{ label, value, url? }` rows for the Information box |
| `miniFeed[]` | `{ text, time }` activity stories |
| `socials[]` | `{ name, icon, url }` per profile |
| `tiles[]` | One entry per Box — `link` points at the hub page/URL |

Tiles with `"enabled": false` are hidden. Placeholder links start with `#`
and render faded so it's obvious what still needs a real URL.

## Interactive bits (client-side only)

- **The Wall**: visitors can post; stored in the browser's localStorage.
- **Poke**: "Poke Mathhue" increments a localStorage counter, classic style.

No build step, no backend. Deploys anywhere static (GitHub Pages, etc.).
