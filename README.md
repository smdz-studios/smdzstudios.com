# SMDZ Studios — Official Website

https://smdzstudios.com/

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
- `assets/data/status-config.json`: service probe endpoints. `assets/data/health.json` is the local health response. External browser probes may be blocked by CORS; unverified does not mean down. The status donut chart reflects the current browser check, including in-progress checks, not historical uptime. This is not historical or server-side uptime monitoring. Cfx.re is not monitored.
- `sw.js`: update cache version when releasing changed cached assets. Health/config JSON requests bypass the service worker cache.
- `tools/configure-domain.py`: optional home metadata helper only; the production domain is already configured. If changing domain, also update CNAME, sitemap, robots, status metadata and site settings manually.

## Experience

Dark theme by default, six languages (EN, ES, FR, DE, PT, IT), per-browser persistent preferences and cross-tab synchronization. Animated ribbon, cinematic background, logo effects, synchronized language and page transitions, bidirectional scroll effects, floating section navigation with directional active-label transitions, Madrid clock, quick commands (Ctrl/Cmd+K), sharing, custom work availability and service status. Respects system reduced motion. PWA installation depends on browser support and HTTPS. Fonts are served by Google Fonts with local fallbacks.

Site metadata, sitemap and social cards are set for the official domain. Social preview: `https://smdzstudios.com/assets/images/social-preview.jpg`.
