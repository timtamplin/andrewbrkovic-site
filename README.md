# andrewbrkovic.com

Static site. No framework, no build step, no JavaScript.

## Files

- `index.html` — the one page. Name, positioning, list of pieces, links.
- `style.css` — all styling. System serif for body, system sans for labels.
- `pieces/<slug>/index.html` — one directory per published piece.

## Deploy (Cloudflare Pages, direct upload)

1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Upload assets**.
2. Project name: `andrewbrkovic`. Drag this whole folder in.
3. After the first deploy: **Custom domains** → add `andrewbrkovic.com` and
   `www.andrewbrkovic.com`. Cloudflare creates the DNS records itself because
   the zone is already in the account.

Free tier: unlimited requests, unlimited bandwidth, 500 builds/month. No upgrade
path needed for traffic.

## Deploy (auto on push — preferred once it happens more than once a week)

1. Push this folder to a GitHub repo.
2. Cloudflare Pages → **Connect to Git** → pick the repo → framework preset
   **None**, build command blank, output directory `/`.
3. Every push redeploys. Custom domain step is the same.

## Adding a piece

1. Write it as markdown in the vault: `Content/Pieces/YYYY-MM-DD - Title.md`.
2. Generate `pieces/<slug>/index.html` from it and add a line to the list in
   `index.html`.
3. Redeploy.

## Notes

- Name on the site is **Andrew Brkovic** — change to the legal/tribunal surname
  if that's wrong for a public byline.
- LinkedIn URL in the footer is a placeholder. Replace with the real profile.
- No analytics, no cookie banner. If analytics is ever wanted, Cloudflare Web
  Analytics is cookieless and free.
