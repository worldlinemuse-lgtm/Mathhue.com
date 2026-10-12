# Site scaffold

Static site — no build step, no backend. Deploy anywhere (GitHub Pages, Netlify, etc.).

## Filling in the real assets later

Edit **`site.config.json`** only. Everything on the page reads from it:

| Field | What to put |
|---|---|
| `siteName` | The person's name |
| `tagline` | Tagline under the portrait |
| `portrait` | Path to the photo (drop the file in `assets/`) |
| `discord.url` / `discord.label` | Invite link + button text |
| `donate.paypalUrl` | PayPal donation link |
| `socials[]` | `{ name, icon, url }` per profile — delete or add rows |
| `tiles[]` | One entry per feature tile — `link` points at the hub page/URL |

Tiles with `"enabled": false` are hidden. Three optional tiles from the spec
(fuel conversions, research papers, local services) are already in the config,
switched off.

Placeholder links start with `#` and render slightly faded so it's obvious
what still needs a real URL.
