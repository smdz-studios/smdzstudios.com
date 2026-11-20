# SMDZ Studios — Official Website

https://smdzstudios.com/

Independent development studio specializing in systems and assets for Grand Theft Auto V and Red Dead Redemption 2 through FiveM and RedM.

Proprietary website. Copyright (c) 2025–2026 SMDZ Studios. All rights reserved. No open-source license is granted. See [LICENSE](LICENSE). Third-party material remains subject to its respective rights and licenses.

## Structure

```text
/
├── index.html                Home
├── status/index.html         Service status
├── status.html               Legacy redirect to /status/
├── discord/index.html        Discord invitation
├── maintenance/index.html    Maintenance screen
├── 404.html                  GitHub Pages error handler
├── errors/                   Other HTTP error templates
├── assets/
│   ├── config/               Site settings
│   ├── css/
│   │   ├── core/             Boldline, shared styles, commands and footer
│   │   ├── motion/           Scroll and cinematic effects
│   │   └── pages/            Page-specific styles
│   ├── js/
│   │   ├── core/             Shared controls, language menu, PWA and maintenance gate
│   │   ├── motion/           Scroll, cinematic effects and transitions
│   │   └── pages/            Home, status, errors, invitation and maintenance
│   ├── images/               Branding and artwork
│   ├── icons/                favicons and technology icons
│   ├── flags/                Language flags
│   └── data/                 Health and probe definitions
├── tools/                    Domain helper and uptime monitor
├── .github/workflows/        Scheduled monitoring
├── CNAME                     GitHub Pages custom domain
├── .nojekyll                 Static deployment
├── favicon.ico
├── manifest.webmanifest
├── sw.js
├── robots.txt
├── sitemap.xml
├── LICENSE
└── README.md
```

Status uses the canonical URL `https://smdzstudios.com/status/`. Once that path is deployed, configure Hostinger HTTPS URL forwarding from `status.smdzstudios.com` to `https://smdzstudios.com/status/` using HTTP 302. The browser will show the destination domain. Do not assign a second custom domain to this GitHub Pages site. The root CNAME remains `smdzstudios.com`. Internal links go directly to the canonical page (also works on Live Server); sharing Status uses `statusPublicUrl` in the site configuration. The legacy `/status.html` URL redirects to the new page. No extra repository, build process or history migration is required.

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

The independent technologies panel uses `assets/css/pages/technologies-layout.css`. Styles and scripts are checked against the network first, with a cached offline fallback, to reduce stale-layout mismatches after deployment.


## Maintenance and scheduled monitoring

- In `assets/config/site-config.js`, set `maintenance.enabled` to `true` and edit the six translated `message` values. Set it to `false` to restore normal navigation. Status remains accessible and the maintenance screen links directly to Discord support. This is a client-side public maintenance screen, not access control or an HTTP 503 response.
- Upload **all** files, including the hidden `.github/workflows/uptime.yml` folder, to `main`. Enable GitHub Actions if needed. In Actions → SMDZ Service Monitor → Run workflow, select `main` and run it once. The workflow creates/updates the `uptime-data` branch with `history.json`. Do not replace or delete that branch on future uploads. The current GitHub Pages deployment configuration stays unchanged. GitHub Actions needs repository contents write permission (declared in the workflow).
- The runner checks six public endpoints every hour at minute 17 UTC (24 planned runs/day), including the Discord invite API, not the Discord platform as a whole. HTTP 401/403/429 are unverified rather than outages. No Cfx.re checks. Uptime is successful / conclusive samples, not continuous availability. Request timing remains in the history schema for compatibility but is not displayed. Tebex Store Services reads Webstores and Checkout from https://status.tebex.io/index.json. It does not probe the individual shop. Unknown feed results do not indicate a platform outage. No fabricated history; 24-hour and 7/14/30/90 UTC-day charts fill as checks arrive. Missing intervals are not treated as successes; stale results are unverified after 120 minutes. Incidents represent observed failure and recovery checks, not exact outage times.
- The status UI reads the public JSON from `raw.githubusercontent.com` using `uptimeDataUrl`; brief CDN delays are possible. GitHub scheduled workflows can be delayed or disabled after 60 days of inactivity; check Actions if monitoring stops. No new repository, DNS change, API token or external paid monitor is required for this setup on the public repository.

## Custom HTTP error pages

The root `404.html` is automatically served by GitHub Pages for missing paths. Additional branded templates are available in `errors/` for HTTP 400, 401, 403, 405, 408, 410, 429, 500, 502, 503 and 504. They share the 404 layout, existing local assets, six translations, theme and language preferences, reduced-motion support, quick commands and page transitions. All are marked noindex.

GitHub Pages only offers a custom missing-page (404) handler; direct requests to `/errors/503.html` and the other templates normally return HTTP 200. These are visual templates, not actual server error handlers. A server or reverse proxy that supports custom error responses can use them with the appropriate HTTP status, serving the assets independently; the additional templates expect to be served at `/errors/<code>.html`. No DNS or GitHub Actions changes are necessary. The existing maintenance gate remains in effect.

Error pages use their own localized HTTP title and description. The service monitor uses actions/checkout@v5 (Node.js 24); the existing uptime-data branch is unchanged.

### Shared footer and public Worker checks
All 16 content pages share the main footer layout, with page-relative links. Error pages use an open layout and staged animations. The monitor tracks six services, including the loyalty configuration endpoint and live giveaway snapshot; both checks use public GET routes only. A disabled loyalty program or an empty giveaway list does not mean the public endpoint is down. New services accumulate history from the first run; existing samples remain unchanged. No Worker source, credentials or user-specific data are included. The monitor records only the enabled flag or the active giveaway count as optional sample metadata. These are API checks, not end-to-end purchase, redemption or participation tests.


Status update: removed right yellow rails, added redesigned uptime tooltips, and improved monitor loading with fallback history source and clearer states.


### Monitor refresh and diagnostics

The monitor runs on the existing hourly schedule, on manual dispatch, and on changes to its workflow, probe or configuration on main. GitHub may delay scheduled runs. The Status refresh button reloads measured history; it does not trigger checks. Samples older than 120 minutes are shown as unverified, and their last result is available in the status tooltip. HTTP 403 or 429 remains unverified. No changes to the uptime-data branch are required.

## Status and landing update

The overview ring and legend support hover and selection. Red indicates failed checks. The landing selects one of ten localized slogans per visit, retaining its meaning when the language changes. All error pages use the same service-status icon as the footer. The Tebex row now reports the official Webstores and Checkout component status. No Worker changes are required. The 24-hour view uses 24 rolling hourly buckets; the other views use UTC days. Historical individual-store samples remain under the legacy store key, separate from the new tebex key. Degraded checks count as not fully operational; maintenance and unknown checks are excluded from the reported ratio. Past samples are preserved. Change the cron schedule on main to refresh the scheduling actor; GitHub may still delay or omit scheduled runs.
