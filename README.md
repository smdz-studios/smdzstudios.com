# SMDZ Studios — Animated landing

Static landing page based on SMDZ BOLDLINE UI v1.8. Upload `index.html` and the entire `assets/` folder to your static hosting root. No build or backend required.

## Latest revision
- Removed radial ambient glows; retained the animated grid and logo orbits.
- Reused original Boldline topbar, panel, badge, button, motion and scrollbar components.
- Added a flat platform strip and personal introduction (Sergio, 23, Madrid, Spain), with no project cards.
- English (default), Spanish, French and German, with local SVG flags and persistent selection.
- Added click impact animation, disabled text selection and native dragging, retained keyboard navigation and reduced motion support.
- Light/dark themes, scroll progress and scroll-triggered reveal.

## Edited files
- `index.html`
- `assets/landing.css`
- `assets/landing.js`
- `assets/flags/fr.svg` and `assets/flags/de.svg` (new)
- `README.md`

Original `smdz-boldline.css` and `smdz-scrollbars.js` are unchanged. The original kit imports Google Fonts; system fonts are used if unavailable. The displayed age is fixed at 23 and can be edited in `index.html` when needed.
