# SMDZ Studios — Official Website

https://smdzstudios.com/

Independent development studio specializing in systems and assets for Grand Theft Auto V and Red Dead Redemption 2 through FiveM and RedM.

Proprietary website. Copyright (c) 2025–2026 SMDZ Studios. All rights reserved. No open-source license is granted. See [LICENSE](LICENSE). Third-party material remains subject to its respective rights and licenses.

## Structure

```text
/
├── index.html                 Home
├── status.html                Service status
├── 404.html                   Custom error page
├── CNAME                      GitHub Pages custom domain
├── .nojekyll                  Static deployment
├── favicon.ico                Browser fallback
├── manifest.webmanifest       PWA manifest and scope
├── sw.js                      Root-scoped service worker
├── robots.txt                 Search engine instructions
├── sitemap.xml                Canonical page URLs
├── LICENSE                    Proprietary copyright notice
├── README.md                  Project documentation
├── assets/
│   ├── config/                Site settings
│   ├── css/                   Styles and Boldline UI
│   ├── js/                    Page logic and interactions
│   ├── images/                Branding, backgrounds and artwork
│   ├── icons/                 Browser and PWA icons
│   ├── flags/                 Language flags
│   └── data/                  Health and status configuration
└── tools/                     Optional metadata helper
```

## Deployment

Publish the complete contents of this directory to the root of the GitHub Pages `main` branch. Keep `CNAME`, `.nojekyll`, `sw.js`, `manifest.webmanifest`, `robots.txt`, `sitemap.xml` and the root HTML files in place. Remove obsolete files from the previous layout; uploading the new files alone does not delete old paths. Preserve repository history and unrelated files. Pages must use the root of `main`, custom domain `smdzstudios.com` and HTTPS. No build, server runtime or package installation is required.

For local development, open this folder in VS Code and launch `index.html` using Live Server. Localhost disables the production service worker. The custom 404 supports nested missing routes at the production domain root.

## Configuration

- `assets/config/site-config.js`: public URL and custom work availability (`available`, `limited`, `closed`, `inquire`). Current setting: available.
- `assets/data/status-config.json`: service probe endpoints. `assets/data/health.json` is the local health response. The status donut chart reflects the latest external monitor samples, including refreshes in progress. Current service states are displayed directly alongside their uptime history, with no duplicate service cards. Unverified does not mean down. Cfx.re is not monitored.
- `sw.js`: update cache version when releasing changed cached assets. Health/config JSON requests bypass the service worker cache.
- `tools/configure-domain.py`: optional home metadata helper only; the production domain is already configured. If changing domain, also update CNAME, sitemap, robots, status metadata and site settings manually.

## Experience

Dark theme by default, six languages (EN, ES, FR, DE, PT, IT), per-browser persistent preferences and cross-tab synchronization. Animated ribbon, cinematic background, logo effects, synchronized language and page transitions, bidirectional scroll effects with staged child reveals, directional translation, subtle scale and rotation, floating section navigation with directional active-label transitions, Madrid clock, quick commands (Ctrl/Cmd+K) with animated opening/closing and a single search focus ring, structured multilingual footer with navigation, support and legal links, sharing, custom work availability and service status. Respects system reduced motion. PWA installation depends on browser support and HTTPS. Fonts are served by Google Fonts with local fallbacks.

Site metadata, sitemap and social cards are set for the official domain. Social preview: `https://smdzstudios.com/assets/images/social-preview.jpg`.

## Discord community gateway

The invitation page is located at `discord/index.html`, publicly accessible at `https://smdzstudios.com/discord/`. It uses the same saved language and theme as the main site, and redirects to `https://discord.gg/6HPcHR4N8m` after five visible seconds. Visitors can pause or join immediately. Approximate Discord member counts are shown only when a public invitation API response is available. A confirmed unknown/expired invitation stops the automatic redirect.

After deploying this repository, change the existing Hostinger URL forwarding for `discord.smdzstudios.com` to `https://smdzstudios.com/discord/` (302 recommended while testing). Do not point the subdomain directly to GitHub Pages or change the main domain DNS. No additional repository is required.

### Studio specialties and technology stack

The About me section includes four specialty rows, including beginner-level 3D modeling. The languages and technologies stack is a separate responsive, localized panel between About me and Custom development, with its own navigation, footer and quick-command link. The panels and their inner elements use the same bidirectional scroll timeline, with staggered transitions and animated borders. SVG brand icons are stored locally in `assets/icons/technologies/`; see the included Devicon MIT license. Technology names are brand names and remain unchanged across languages.

The beginner 3D & GTA V asset tools group lists Blender, Sollumz, CodeWalker and OpenIV as learning tools, not claims of professional proficiency. Blender artwork comes from Devicon; Sollumz uses its upstream icon with its separate license notice. CodeWalker and OpenIV use illustrative, non-brand SVG symbols.

The independent technologies panel uses `assets/css/technologies-layout.css`. Styles and scripts are checked against the network first, with a cached offline fallback, to reduce stale-layout mismatches after deployment.


## Maintenance and scheduled monitoring

- In `assets/config/site-config.js`, set `maintenance.enabled` to `true` and edit the six translated `message` values. Set it to `false` to restore normal navigation. Status remains accessible and the maintenance screen links directly to Discord support. This is a client-side public maintenance screen, not access control or an HTTP 503 response.
- Upload **all** files, including the hidden `.github/workflows/uptime.yml` folder, to `main`. Enable GitHub Actions if needed. In Actions → SMDZ Service Monitor → Run workflow, select `main` and run it once. The workflow creates/updates the `uptime-data` branch with `history.json`. Do not replace or delete that branch on future uploads. The current GitHub Pages deployment configuration stays unchanged. GitHub Actions needs repository contents write permission (declared in the workflow).
- The runner checks four public endpoints every 15 minutes, including the Discord invite API, not the Discord platform as a whole. HTTP 401/403/429 are unverified rather than outages. No Cfx.re checks. Uptime is successful / conclusive samples, not continuous availability. Latency is successful request response time from the runner. No fabricated history; 30/90 UTC-day charts fill as checks arrive. Missing intervals are not treated as successes; stale results are unverified after 45 minutes. Incidents represent observed failure and recovery checks, not exact outage times.
- The status UI reads the public JSON from `raw.githubusercontent.com` using `uptimeDataUrl`; brief CDN delays are possible. GitHub scheduled workflows can be delayed or disabled after 60 days of inactivity; check Actions if monitoring stops. No new repository, DNS change, API token or external paid monitor is required for this setup on the public repository.

## Custom HTTP error pages

The root `404.html` is automatically served by GitHub Pages for missing paths. Additional branded templates are available in `errors/` for HTTP 400, 401, 403, 405, 408, 410, 429, 500, 502, 503 and 504. They share the 404 layout, existing local assets, six translations, theme and language preferences, reduced-motion support, quick commands and page transitions. All are marked noindex.

GitHub Pages only offers a custom missing-page (404) handler; direct requests to `/errors/503.html` and the other templates normally return HTTP 200. These are visual templates, not actual server error handlers. A server or reverse proxy that supports custom error responses can use them with the appropriate HTTP status, serving the assets independently; the additional templates expect to be served at `/errors/<code>.html`. No DNS or GitHub Actions changes are necessary. The existing maintenance gate remains in effect.

Error pages use their own localized HTTP title and description. The service monitor uses actions/checkout@v5 (Node.js 24); the existing uptime-data branch is unchanged.
