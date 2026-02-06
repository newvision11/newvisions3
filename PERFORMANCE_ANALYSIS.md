# Performance Analysis Report - newvisions.ma

**Date:** 2026-02-06
**Scope:** Full static site performance audit of the New Visions Agency website

---

## Executive Summary

The site employs several modern performance techniques (lazy loading, deferred scripts, `requestIdleCallback` for analytics), but carries significant overhead from **unused libraries, duplicate resources, an oversized HTML document, and missing GSAP dependency**. Addressing the issues below would materially improve LCP, FCP, TBT, and CLS scores.

**Estimated total transferable savings: ~350 KB+ of unnecessary JavaScript/CSS.**

---

## 1. Critical Issues

### 1.1 Missing GSAP Dependency (Broken Feature)

`assets/js/app.min.js` references `gsap` 12 times (service row hover animations at line 154+), but **GSAP is never loaded** via any `<script>` tag. This means:
- The `initServiceHover()` function silently fails
- The service row mouse-tracking image reveal does nothing
- 30+ lines of dead code execute and bail on the `typeof gsap === "undefined"` guard

**Fix:** Either load GSAP (~25 KB gzipped) or remove the dead code path from `app.min.js`.

### 1.2 Duplicate Meta Tags

`index.html` contains duplicate declarations:
- `<meta charset="UTF-8">` appears on lines 5 and 194
- `<meta http-equiv="X-UA-Compatible">` appears on lines 178 and 195
- `<meta name="viewport">` appears on lines 179 and 196

This doesn't break anything, but signals sloppy head management and adds bytes.

### 1.3 Slick Carousel Loaded but Never Used

- `slick.css` is loaded and preloaded (lines 289-291)
- `slick.min.js` is loaded via CDN (line 6032)
- **Zero references to `.slick()` exist in any project JavaScript file**

**Wasted:** ~42 KB of JS + ~4 KB of CSS (uncompressed) loaded for nothing.

---

## 2. JavaScript Analysis

### 2.1 Bundle Size Summary

| File | Size | Notes |
|------|------|-------|
| swiper-bundle.min.js | 143 KB | Largest JS file |
| jquery-3.6.0.min.js | 89.5 KB | Used for Magnific Popup + minor DOM |
| bootstrap.bundle.min.js | 78.1 KB | Full bundle including Popper |
| nvp-script-v3.js | 37.4 KB | Custom form/quiz logic (unminified) |
| website-translations.js | 36.7 KB | Translation strings (unminified) |
| jquery.magnific-popup.min.js | 20.2 KB | Used for 1 video popup |
| menu.js | 14.7 KB | Custom menu (unminified) |
| app.min.js | 10.4 KB | Main app logic |
| wow.min.js | 8.2 KB | Used on only 3 elements |
| hiring-form-v3.js | 7.9 KB | Hiring page form |
| language-manager.js | 5.9 KB | Language switching |
| faq.js | 0.6 KB | FAQ accordion |
| **Total** | **~453 KB** | Before gzip |

Plus external:
- Font Awesome Kit (~100 KB+ dynamically loaded) for only 11 icons
- Slick Carousel (~42 KB) **unused**

### 2.2 Key Findings

- **15 `<script>` tags** with external sources in the footer
- **5 inline `<script>` blocks** in the head (blocking first paint)
- **WOW.js (8.2 KB)** loaded for only 3 animated elements -- a CSS-only `@keyframes` + `IntersectionObserver` approach would eliminate this dependency
- **jQuery (89.5 KB)** primarily used for Magnific Popup and minor `is_exist()` checks -- could be replaced with vanilla JS
- **Magnific Popup (20.2 KB)** used for a single video popup -- a lightweight `<dialog>` element approach would save this entire library
- **Font Awesome Kit (dynamic ~100 KB+)** loaded for 11 icons -- subsetting or using inline SVGs would cut this dramatically
- **nvp-script-v3.js and website-translations.js are unminified** -- minification alone would save ~30-40%

### 2.3 Script Loading Strategy

Good: All footer scripts use `defer` attribute.
Bad: 5 inline scripts in `<head>` execute synchronously and block parsing (~180 lines of JS).

---

## 3. CSS Analysis

### 3.1 File Size Summary

| File | Size | Notes |
|------|------|-------|
| bootstrap.min.css | 219 KB | Full framework |
| app.min.css | 184 KB | Main compiled styles |
| fontawesome.css | 73.6 KB | Icon definitions (local, separate from Kit) |
| main.css | 19.9 KB | Custom (unminified) |
| responsive-improvements.css | 19.2 KB | Responsive overrides |
| swiper-bundle.min.css | 18.5 KB | Carousel styles |
| nvp-style.css | 13.2 KB | Agency styles (unminified) |
| magnific-popup.css | 7.0 KB | Popup styles |
| language-switcher.css | 3.7 KB | Language toggle |
| pricing-cards.css | 2.9 KB | Pricing section |
| icomoon.css | 2.9 KB | Icon font (3 icons used) |
| custom-font.css | 0.5 KB | Font declarations |
| **Total** | **~564 KB** | Before gzip |

Plus: Slick CSS (~4 KB) loaded from CDN (**unused**)

### 3.2 Key Findings

- **20 inline `<style>` blocks** scattered throughout `index.html` -- increases HTML size and prevents caching
- **437 `!important` declarations** in inline styles within the HTML
- **222 `!important` declarations** in `responsive-improvements.css` alone -- indicates CSS specificity issues
- **fontawesome.css (73.6 KB)** loaded locally AND Font Awesome Kit loaded via JS -- double loading
- **icomoon.css (2.9 KB)** loaded for only 3 icon references
- **12 separate CSS files** loaded, each requiring an HTTP request
- Non-critical CSS uses smart `media="print" onload="this.media='all'"` pattern (good)
- `bootstrap.min.css` is render-blocking (loaded with `media="all"`)

---

## 4. Image & Media Analysis

### 4.1 Summary

- **36 `<img>` tags** in `index.html`
- **31 images** use `loading="lazy"` (good)
- **5 images** load eagerly (4 avatar thumbnails + preloader logo -- acceptable)
- **13 images** missing explicit `width`/`height` attributes -- causes CLS (layout shift)
- **4 MP4 videos** in `assets/images/v1/` totaling ~1.5 MB (lazy loaded via IntersectionObserver)

### 4.2 Format Distribution

- **PNG:** 34 references (many could be WebP/AVIF for 50-80% savings)
- **JPEG:** 8 references
- **WebP:** 6 references
- No `<picture>` elements with format fallbacks

### 4.3 Largest Assets

| File | Size |
|------|------|
| vvvv.mp4 | 491 KB |
| vvvvv.mp4 | 486 KB |
| v13.mp4 | 252 KB |
| vvv.mp4 | 250 KB |
| huilezaman.jpeg | 95 KB |
| sklothing.jpeg | 86 KB |
| yoink1.png | 62 KB |
| 122-01.webp | 55 KB |

### 4.4 Image Optimization Opportunities

- **logo-white-01.png (43 KB)** is loaded as preloader, logo, and footer logo -- convert to WebP (~10 KB) or inline as SVG
- **PNG images (1.png through 4.png)** are ~8 KB each while their WebP equivalents are ~1.7 KB -- the WebP versions already exist but PNG is used in several places
- No responsive `srcset` usage for different screen sizes
- Star rating images (`star3.png`) repeated 8 times -- could use CSS or inline SVG

---

## 5. HTML Document Analysis

### 5.1 Key Metrics

| Metric | Value |
|--------|-------|
| Total lines | 6,284 |
| File size | 236 KB |
| Inline `<style>` blocks | 20 |
| Inline `<script>` blocks | ~13 |
| `style=` attributes | 291 |
| `!important` in inline styles | 437 |
| DOM elements (estimated) | 2,000+ |

### 5.2 Findings

- **236 KB HTML** is very large for a marketing page -- much of this is inline CSS/JS that could be externalized and cached
- **291 inline style attributes** indicate CSS architecture issues; these override stylesheets and prevent caching
- **437 `!important` in HTML** combined with 255+ in CSS files shows a specificity war
- Sections that are below the fold are fully rendered in HTML instead of being lazy-loaded

---

## 6. Third-Party Dependencies

| Resource | Load Method | Impact |
|----------|-------------|--------|
| Google Fonts (5 families) | Preload + async swap | Moderate (multiple font files) |
| Font Awesome Kit | Deferred `<script>` | High (~100 KB+ JS/CSS/fonts for 11 icons) |
| Remix Icon (CDN woff2) | Inline `@font-face` | Low (single font file, but 0 icons used) |
| Google Analytics | Deferred via `requestIdleCallback` | Low (well-optimized) |
| Slick Carousel (CDN) | Deferred `<script>` + preloaded CSS | **Waste** (never used) |
| YouTube embeds | Lazy facade pattern | Low (good implementation) |

### 6.1 Font Loading

- **5 Google Font families** loaded in a single request (good batching)
- Async loading with `media="print"` pattern (good)
- `font-display: swap` via Google Fonts URL (good)
- **Remix Icon font loaded but never used** (0 `ri-` classes found in HTML)

---

## 7. What's Already Done Well

1. **Video lazy loading** with IntersectionObserver and 200px rootMargin
2. **Analytics deferred** via `requestIdleCallback` with user-interaction triggers
3. **YouTube lite embeds** -- facade pattern loads iframe only on click
4. **CSS async loading** via `media="print" onload="this.media='all'"` pattern
5. **Image lazy loading** with `loading="lazy"` and `decoding="async"`
6. **Preconnect hints** for Google Fonts, Font Awesome, jsDelivr
7. **All footer scripts** use `defer` attribute
8. **Passive event listeners** on touch/scroll handlers
9. **Logo preload** with `fetchpriority="high"`
10. **FOUT prevention** for non-English languages with opacity transition

---

## 8. Prioritized Recommendations

### P0 -- Quick Wins (High Impact, Low Effort)

| # | Action | Estimated Savings |
|---|--------|-------------------|
| 1 | Remove Slick Carousel (CSS + JS) | ~46 KB |
| 2 | Remove Remix Icon `@font-face` (unused) | ~50 KB font download eliminated |
| 3 | Remove duplicate `<meta>` tags | Negligible bytes, cleaner head |
| 4 | Add `width`/`height` to 13 images missing them | Eliminates CLS |
| 5 | Minify `nvp-script-v3.js`, `website-translations.js`, `language-manager.js` | ~25-30 KB |

### P1 -- Medium Effort, High Impact

| # | Action | Estimated Savings |
|---|--------|-------------------|
| 6 | Replace Font Awesome Kit with inline SVGs for 11 icons | ~100 KB+ |
| 7 | Remove `fontawesome.css` local file (redundant with Kit, or replace Kit) | 73.6 KB |
| 8 | Convert remaining PNGs to WebP (images already exist for some) | ~60-70% per image |
| 9 | Replace jQuery + Magnific Popup with vanilla JS `<dialog>` | ~110 KB |
| 10 | Replace WOW.js with CSS `@keyframes` + IntersectionObserver | 8.2 KB |
| 11 | Extract inline `<style>` blocks into cacheable CSS files | Reduces HTML by ~30 KB+ |
| 12 | Fix or remove GSAP-dependent code in `app.min.js` | Clean dead code |

### P2 -- Architectural Improvements

| # | Action | Benefit |
|---|--------|---------|
| 13 | Consolidate 12 CSS files into 2-3 bundles | Fewer HTTP requests |
| 14 | Add responsive `srcset` for key images | Bandwidth savings on mobile |
| 15 | Subset Google Fonts to Latin only | Smaller font files |
| 16 | Reduce `!important` usage (692 total) via CSS refactoring | Maintainability + smaller CSS |
| 17 | Remove `icomoon.css` (3 icons) and use inline SVG | 2.9 KB + font download |
| 18 | Use `<picture>` elements with WebP + PNG fallback | Better format support |
| 19 | Implement critical CSS inlining and defer all CSS | Faster FCP |
| 20 | PurgeCSS on Bootstrap (219 KB, likely <30% used) | ~150 KB+ |

---

## 9. Estimated Impact Summary

| Metric | Current (Est.) | After P0+P1 (Est.) |
|--------|---------------|---------------------|
| Total JS (transferred) | ~450 KB | ~200 KB |
| Total CSS (transferred) | ~565 KB | ~350 KB |
| HTML size | 236 KB | ~200 KB |
| HTTP requests (page load) | ~35-40 | ~20-25 |
| Unused library bytes | ~170 KB+ | 0 |
| CLS-causing images | 13 | 0 |

---

*This analysis was performed via static code review. Running Lighthouse, WebPageTest, or Chrome DevTools on the live site would provide runtime metrics (LCP, FID, CLS, TTFB) to complement these findings.*
