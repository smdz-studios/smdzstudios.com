# SMDZ Studios Landing

Static landing page based on SMDZ BOLDLINE UI v1.8. Upload the contents of this folder to a static web host. No build process is required.

## Latest update

- Slightly thicker brush underline and stronger pointer-down button ripple, physical press and subtle background click pulse. System reduced-motion preferences remain honored.

- Distinct saturated navigation colors: Boldline yellow for Store, blue for Documentation, Discord blurple and Cfx/FiveM-inspired orange. Text and hover colors are adjusted for contrast. Compact illustrated ribbon with smaller typography and folds.

- Local cinematic background image compressed to WebP, with subtle CSS blur, responsive cover positioning and theme-specific contrast overlay. Replaces the animated grid.

- Studio ribbon moved to the top of the page, above the floating header controls.
- Removed the manual global motion toggle and its saved setting. System reduced-motion accessibility preferences are still honored.

- Updated cartoon Boldline ribbon with illustrated folded tails, bold black outlines, solid shadows and localized scrolling text. Ribbon pause control and system reduced-motion support remain.

- Interactive 3D logo parallax with mouse-driven tilt, subtle depth, and smooth reset. Disabled for touch and reduced motion.

- Floating header controls without a surrounding bar.
- Finer animated yellow brush underline below the Roleplay word.
- Source comments removed from HTML, CSS, JavaScript and SVG assets, including the bundled Boldline styles and scrollbar controller.
- Preserved English, Spanish, French and German, both themes, and copyright 2025.

Boldline design system and overlay scrollbar controller are retained with functional rules unchanged except for comment removal. Typography uses Google Fonts with local fallbacks.

## Studio expansion

- Interactive ambient geometric particles, capped at 38, with mouse repulsion, visibility-aware animation and system reduced-motion support.
- Madrid clock uses the device clock and the IANA `Europe/Madrid` time zone including daylight saving time. It does not need an external API.
- Custom development section with localized copy, Discord contact and custom work terms.
- SEO title, descriptions, robots.txt, Open Graph, Twitter metadata and Organization structured data. English content is present in the HTML before JavaScript loads; metadata updates when visitors select another language. Languages share a single URL, not separate indexable routes.
- Custom `404.html` with the same theme, language preferences and original Boldline styling. Upload all files, including `404.html`, to the domain root. Ensure your hosting serves this file for missing routes with HTTP status 404, rather than returning a 200 or redirecting to the home page. Cloudflare Pages can use a top-level 404.html; for other hosts, configure the equivalent error document. The 404 has `noindex` metadata and root-relative assets, so it also renders for deeply nested missing paths.
- Production domain: `https://smdzstudios.com/`. Canonical URLs, social image URLs, JSON-LD, share link, robots.txt and sitemap.xml are configured for this domain.

## Cinematic experience

- The opening preloader is indeterminate and waits for the window load event and font readiness, with a fail-open timeout of 8.5 seconds. It does not enforce a minimum loading duration. The opening wipe and synchronized hero animation play after loading; system reduced motion skips these animations.
- Slow photographic zoom, a local SVG grain overlay, vignette and smoothed mouse-controlled camera movement.
- Cartoon logo reveal with elastic rotation, burst lines and stars, independently layered over the existing interactive 3D logo.
- Magnetic main navigation and custom contact buttons, a decorative cursor ring, click rays and translated Boldline tooltips. The native pointer remains visible. Fine-pointer effects are disabled on touch devices and with reduced motion; pointer animations stop when the document is hidden.
- Section indicators for Home, About me and Custom development reflect scrolling and support keyboard navigation. On mobile they sit in a compact dock at bottom right to avoid the overlay scrollbar.
- Short branded external-link wipe in the source page. Existing external links keep native new-tab behavior without a delayed popup or modified link target. A browser that immediately focuses the new tab may hide the animation there; the destination is not modified.
- New resources: `assets/immersive.css`, `assets/immersive.js`, `assets/grain.svg`. Existing UI kit, SEO, 404, theme, localizations and asset paths are preserved. No new external dependencies.

## Studio experience update

- Section outlines draw once when About me and Custom development enter the viewport. Original borders remain in reduced-motion mode.
- Five consecutive logo clicks (or Enter/Space with keyboard focus) trigger a short cartoon burst. System reduced motion suppresses it. Navigation links have a sweeping highlight on hover and keyboard focus.
- Language initially follows the first supported browser language (English, Spanish, French, German). Explicit choices are saved and override automatic detection on home, status and 404.
- PWA manifest, 192/512 icons and a maskable icon. The service worker caches the local public site shell and uses network-first navigation. External platforms require internet. The footer install button appears when the browser exposes its install prompt; otherwise use the browser's install menu where available. HTTPS or localhost and a root deployment are required. No backend or build step is required. External font files are not cached by this worker; local fallbacks are used offline. Increase the cache version in `sw.js` when publishing another release.
- `status.html` checks the site's own uncached `health.json` and reachable public endpoints in `status-config.json`. Browser CORS restrictions, timeouts or offline conditions can prevent external verification; unverified is not an outage. Discord has no configured probe by default. Configure authorized HTTPS/CORS-enabled endpoints for services you control if available. The page is not a global uptime monitor and does not report historical incidents. A true monitoring history requires a monitoring service/backend. Health and configuration requests bypass the service worker cache.
- Social preview: `https://smdzstudios.com/assets/social-preview.jpg` (1200 × 630). The production domain is configured; the optional `configure-domain.py` only changes the home-page metadata if needed.

## Experience V3

- Added the yellow side accent to the About Me section.
- Removed the persistent cursor ring, main CTA tooltips, ribbon pause control and independent development label.
- Added Portuguese (Portugal) and Italian throughout the landing, status and 404 pages, with SVG flags and browser-language detection.
- Updated the PWA cache version and offline flag assets. System reduced-motion and offscreen animation optimisation remain supported.

## Status routing fix

- Upload all files and assets in the ZIP directly to the site's public directory, including status.html, health.json and status-config.json.
- Home and status links, status assets and PWA paths are relative to the deployed directory. The custom 404 keeps root-relative paths for domain-root hosting on nested missing URLs.
- Opening index.html directly can display the status page, but the browser may block local JSON requests. Use HTTP(S) for service checks, and HTTPS or localhost for PWA support.
- If /status.html still returns 404 on the live domain, check the deployment file list, document root and rewrite rules; clear old browser/PWA caches and redeploy.


## Experience V4

- Custom work availability indicator in the custom development section. Edit `assets/site-config.js` and set `customWorkAvailability` to `available`, `limited`, `closed`, or `inquire` (current setting: available). The supported options are documented in the configuration file. When changing a deployed configuration, bump the cache version in `sw.js` to refresh installed PWA clients.
- Quick command palette on Home, Status and 404: Ctrl+K / Cmd+K or the search button in the header. Search using the current language or English; use arrow keys, Enter and Escape. Commands open sections, services and the share action. External links open in a new tab.
- Six-language synchronized text transitions with a short fade out and fade in. The initial hero typing effect is retained; subsequent language changes update its full title during the fade. Reduced motion skips the fades.
- Madrid clock sun/moon icon is calculated from approximate solar altitude at Madrid city coordinates, using the current device date and time. The displayed clock remains Europe/Madrid with automatic daylight-saving adjustments. No API is required.
- Share website button copies the landing URL (not the current status/error route) with a short confirmation animation. `publicSiteUrl` is configured to `https://smdzstudios.com/` in `assets/site-config.js`. Otherwise the canonical URL or deployment directory is used. Clipboard permission failures fall back to a manual copy prompt; a local file path is never shared as a public URL.
- Internal Home/Status/404 links use a coordinated yellow page wipe, with reduced-motion support. The 404 is accessible directly under a subdirectory; missing nested paths served by a host still assume a domain-root deployment. Configure your host accordingly. The PWA cache version and offline shell have been updated.


## V4 navigation and UI update

- Local page links are resolved from the actual JavaScript asset directory, preserving the site folder and URL protocol for Home, Status and 404.
- For VS Code Live Server, extract the complete ZIP into a folder, open that folder in VS Code and right-click index.html > Open with Live Server. Open the HTTP address shown by Live Server, not the file:/// address. Status should use the same host, port and directory as index.html.
- PWA caching is disabled on localhost and loopback addresses; the local PWA registration and its own caches are removed if present. If an older service worker still controls the tab, unregister it in DevTools > Application > Service Workers, then reload the page. PWA installation remains available on production HTTPS.
- Availability badge uses a solid state-specific fill, Boldline outline and a reduced-motion-aware pulse for the available state.
- Quick command results use a dedicated native styled scrollbar and keyboard scrolling within the results list.

## Status and section navigation redesign

- Larger Boldline section navigation with persistent labels, SVG icons, active yellow highlight and a compact mobile bottom navigation.
- Status dashboard now shows four services with per-service panels, count summaries and existing browser-based probes. Cfx.re is excluded from status checks, but remains in the landing and quick commands. Discord remains unverified unless a supported probe is configured.
- Updated PWA cache version.

## Bidirectional scroll and production deployment

- Scroll-driven fades and vertical movement reverse naturally when scrolling upward. The home intro remains intact; section outlines redraw with viewport progress. Reduced motion and keyboard focus keep content visible.
- The default theme is dark; an explicitly saved light preference is preserved.
- Upload the project files into the repository root on `main` (not a nested directory). Keep `CNAME` and `.nojekyll`. GitHub Pages must still be enabled, with the custom domain and HTTPS configured in repository settings.
- The service worker cache is versioned for this update. Localhost development remains uncached.

### Brand icons and visitor preferences

- Official supplied ICO and PNG icons are used on all pages, including Apple touch and the existing PWA manifest. The maskable Android icon is derived from the supplied artwork with safe padding.
- Dark theme and the first supported browser language are saved in localStorage. Manual changes persist across pages, visits and tabs on the same origin. If storage is unavailable, the site still works with in-memory preferences.
- Updated the PWA cache version to load the replacement icons and copy.
