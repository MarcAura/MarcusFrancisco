# CLAUDE.md — Marcus Francisco Portfolio
## Project Instructions for Claude Code

---

## This Session Prompt: 

Let's move on to other issues and touch on some of the expansion areas that are within your power to improve without my input.

---

## Overview

This is a **multi-page personal and professional portfolio website** for Marcus H. Francisco, 
Electrical Engineer and MS student at the University at Buffalo. It is built entirely in 
**vanilla HTML, CSS, and JavaScript** — no frameworks, no build tools, no npm. It is hosted 
on **GitHub Pages** and must remain a static site deployable directly from the repository.

This portfolio is a **recruiter-facing professional document** as much as it is a website. 
Every decision should reflect that standard.

---

## Stack & Constraints

- **Vanilla HTML5, CSS3, JavaScript (ES6+)** only
- **No frameworks** — no React, Vue, Angular, Svelte, etc.
- **No build tools** — no Webpack, Vite, npm scripts, etc.
- **No external CSS frameworks** — no Bootstrap, Tailwind, etc.
- External libraries must be loaded via CDN only, and only if absolutely necessary
- Must be fully deployable as a static site on GitHub Pages with no server-side logic
- All assets (images, videos, icons, fonts) live under `assets/` and are referenced with 
  relative paths

---

## File Structure

```
/
├── index.html
├── about.html
├── projects.html
├── cv.html
├── coursework.html
├── reflections.html
├── citations.html
├── contact.html
├── CLAUDE.md
├── assets/
│   ├── images/
│   ├── icons/
│   └── videos/
├── css/
│   ├── global.css          ← shared styles: nav, footer, modals, variables
│   ├── index.css
│   ├── about.css
│   ├── projects.css
│   └── [page].css          ← one CSS file per page for page-specific styles
└── js/
    ├── global.js            ← shared JS: nav, modals, scroll behavior
    ├── index.js
    ├── projects.js
    └── [page].js            ← one JS file per page for page-specific logic
```

All inline `<style>` blocks and inline `<script>` blocks must be moved to their respective 
external files. No inline styles or scripts.

---

## Coding Standards

### HTML
- Use semantic HTML5 elements: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, 
  `<aside>`, `<footer>`
- Every `<img>` must have a descriptive `alt` attribute
- Every page must include the viewport meta tag: 
  `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
- Use `id` for section anchors, `class` for styling targets
- IDs must be unique per page and follow kebab-case: `section-id-name`

### CSS
- **Mobile-first**: write base styles for mobile, then use `@media (min-width: 768px)` and 
  `@media (min-width: 1200px)` for larger layouts
- All color values, font sizes, spacing, and transition timing must be defined as 
  **CSS custom properties** in `:root` inside `global.css`
- No hardcoded pixel widths on layout containers — use `%`, `rem`, `clamp()`, `max-width`
- Use CSS Grid and Flexbox for layout — no floats, no absolute positioning for layout
- Class names follow BEM or clear descriptive naming: `.project-card`, `.modal-overlay`, 
  `.nav-link--active`
- All transition durations must use variables: `var(--transition-fast)`, 
  `var(--transition-normal)`, `var(--transition-slow)`

### JavaScript
- Use `const` and `let` only — never `var`
- Use `addEventListener` — never inline `onclick`, `onmouseover`, etc. in HTML
- Prefer `querySelector` / `querySelectorAll` over older DOM methods
- All shared functionality (nav, modals, scroll-to-top, image zoom) lives in `global.js` 
  and is initialized via `DOMContentLoaded`
- No duplicate function definitions across files

---

## Design & Visual Standards

### Typography
- Headings: one consistent font family (currently in use — maintain it)
- Body: one readable sans-serif, minimum 16px base size
- Line height: 1.6 minimum for body text
- Heading hierarchy: H1 = page title (one per page), H2 = section headers, H3 = subsections

### Spacing
- Consistent section padding using CSS variables: `--section-padding-y`, `--section-padding-x`
- Card and component margins follow the same spacing scale (4px base unit or 8px)

### Colors
- Maintain the existing dark/accent color palette
- All colors defined as variables in `:root` — no hardcoded hex values outside of 
  `global.css`

### Responsive Breakpoints
```
Mobile:  < 768px   (base styles, single column)
Tablet:  ≥ 768px   (two column where appropriate)
Desktop: ≥ 1200px  (full multi-column layouts)
```

Touch targets (buttons, links, nav items) must be at least 44×44px on mobile.

---

## Animations & Transitions

**This section is critical. Read carefully before touching any animation.**

Marcus has invested significant time hand-crafting specific animations. The rule is:

- **Preserve**: Any animation that looks intentional, polished, and smooth as-is
- **Improve**: Animations that are jerky, incomplete, inconsistent, or half-finished
- **Standardize**: Timing and easing should use shared CSS variables

### Known animations to audit (do not break without explicit instruction):
- Navigation menu behavior and transitions
- Section scroll reveal / fade-in effects
- Page entry animations
- The image zoom modal open/close transition
- Timeline animation on index.html
- Accordion expand/collapse on projects.html (the `+` toggle sections)

### Animation principles to apply when improving:
- Use `transform` and `opacity` for performant animations — avoid animating `width`, 
  `height`, `top`, `left`, or `margin`
- Use `will-change: transform` sparingly and only where needed
- All easing should be `cubic-bezier` or named easing (`ease-in-out`) — no `linear` for 
  UI transitions
- Scroll-based reveals: use `IntersectionObserver` — do not use scroll event listeners 
  for animation
- Never remove an animation without replacing it with something equally or more polished

---

## Modal System

The site has an image/content modal system that is currently inconsistent. The goal is a 
**single unified modal component** used site-wide.

### Modal requirements:
- One modal HTML structure in `global.css` / `global.js`, reused across all pages
- Opens with a smooth fade + subtle scale-up: `opacity 0→1`, `scale 0.95→1`
- Closes on: (1) clicking the backdrop overlay, (2) the close button, (3) pressing Escape
- Must be accessible: trap focus inside modal when open, restore focus on close
- Must prevent body scroll while open (`overflow: hidden` on `<body>`)
- Consistent close button position (top-right corner), consistent styling
- Image zoom modal must support: zoom in, zoom out, pan on desktop, pinch-to-zoom on mobile

---

## Navigation

- Navigation is shared across all pages — any change must work consistently everywhere
- Active page link must be visually indicated
- On mobile: navigation collapses to a hamburger menu
- The "Wrong Twin?" link (to Alex's site) must be preserved — it is intentional
- Sidebar/in-page nav (the anchor list on projects.html and about.html) must scroll 
  smoothly to sections and highlight the active section on scroll

---

## Content Preservation Rules

**Never remove or alter any of the following without explicit instruction:**

- All project descriptions and technical details on projects.html
- The engineering education timeline on index.html
- All images and captions currently on the site
- All embedded videos (local .mp4 files and external links)
- All citations and citation references
- Contact and social links (LinkedIn, GitHub)
- The ACM publication reference and link
- Award mentions (Russell L. Agrusa Award, UB Hackathon Grand Prize, Best Hardware)
- When removing obselete files that are not currently in use, do not delete any files, move them to an OBSELETE folder instead so no files are ever deleted. 

---

## Planned Expansion Areas

When adding new content, build it to match existing professional standards. Placeholder 
sections may be added with a "Coming Soon" state if content is not yet ready.

### 1. Professional Musician Career (HIGH PRIORITY)
- Marcus is a **professional French Horn player**
- Performs with: Amherst Symphony Orchestra, American Legion Band of Post 264
- Sings with: UB Choir, Chamber Singers
- Assistant Music Director: Enchords A Cappella group
- This section should feel as professionally presented as the engineering work
- Should include: performance photos, ensemble logos, video embeds, upcoming performances
- Suggested page: a dedicated `music.html` page with a nav link
- Section within music page dedicated to my learning under the direction of great conductors like Dr Stephen Shewan. Under his direction I went to Conference All State multiple times as both performer and composer, went to NYSBDA, and other events. also include other conductors like Matthew Cool directing the American Legion Band, community band, performance in ASO, and all Erie and All County / All State Conductors. Side note to find all the MP3s for these events and include links to Mark records respecting copyright law

### 2. Personal Projects
- Separate from academic/professional engineering projects
- May include hobbyist electronics, software experiments, creative builds
- Should be clearly distinguished from the professional projects on projects.html

### 3. YouTube Channels
- Embed or link to YouTube content
- Should include channel description, video previews, and subscribe links
- Must use YouTube's privacy-enhanced embed URL: `https://www.youtube-nocookie.com/embed/`

### 4. Engineering Career Gaps
- Timeline gaps between 2020–2025 may need additional entries as content is provided
- Graduate education details to be expanded as coursework, research, and milestones are confirmed Heavy emphasis will be placed on microelectronic fabrication lab study and embedded systems study.
- Do not fabricate or infer content — only add what Marcus explicitly provides

### 5. Current personal projects page. 
- This will include the digitization music library software I'm building, the smart home system BlueLink, any apps in development, youtube channels in progress, boat restoration, car restoration, home NAS system to mimic a company level server for homeowners file storage, Media hosting software therein, mechanics business or any other speculative endeavors I'm embarking on. This page will be a low priority but keep it in mind.

### 6. Connect with Me Page
- This effort includes clear icons and links to GitHub, Linkedin, and any other social media once I see fit for them to be shared professionally. The connect page should contain some sort of legal and streamlined email handling system to forward requests to my email without disclosing my email to the public.

### 7. Scan the current website for privacy breaches.
- Anything you feel is disclosed in the website that may be a breach of my privacy or you think I may have added on accident, please notify me immediately.

### 8. Diplomas and Certifications
- The centerpiece of this will be my college diplomas, with sub features of every certification I've gotten including certificate of completion with the exception of any private matters.

### 9. Brass Quintet and Music Service
- The purpose of this page is to advertise for the brass quintet known as Buffalo Niagara brass quintet or BNBQ. It will also serve as a page to show a portfolio and performance history of the work of both BNBQ, NFBQ (Niagara frontier brass quintet) and other quintets that I am involved in organizing or playing with. It will feature a short videos of our performances at commencements, weddings, or other places, there will be some sample music that you can listen along to to get an idea of what we can perform at your event, and then a form to request a quote for us to come play at your event. Specifically, a good video clip to include is the 2026 social Work commencement UB, which was live streamed on May 16 of 2026. The Interlude, where our names are announced and we play Rondeau.
- this will also involve forming an organization where I can be the head contractor of the brass quintet and charge via invoice so that my quintet members don't need to fill out individual proprietor paperwork, and I can just disperse funds to them as employees. There's no need for a limitation of liability since it's just a brass quintet so I can go for any organization that allows me to form EIN

### 10. Contact form for both personal, engineering contracting work, and musical contracting work.
- A contact form needs to be navigatable and easily interpreted for the various services I may offer. Personal, Professional, Electrical Engineering, Music, Brass Quintet, Orchestral Work, Wind Ensemble, And many other purposes for someone to contact me. As it stands marcusfranciscoportfolio@gmail.com is a placeholder, and is not my actual email address. 

### 11. A more expansive resume and CV section:
- This enhancement will focus on creating a representative work for a Resume and extended CV that keeps private information out of the public eye while showcasing my acomplishments, career, and academic achievements and awards. I also would like to implement a certifications section with current, future, and "in progress" certifications that may pertain to engineering, electrician work, and any other lisencure that may be useful in a professional setting.

### 12. A more expansive timeline section that grows with me:
- It is difficult to track down all the things you've done as landmarks in your life. As I come to remember them and jot them down here, we will work to add them to the timeline accordingly. 

### 13: Musician performance catalog.
- This section will serve to provide access via existing youtube links or other, a catalog that will serve as a memory of all the musical works I've ever performed, that includes subsections for piano solos, horn conciertos, wind ensemble, orchestra, brass quintet, woodwind quintet, choir, a capella, and many others throughout my youth, highschool, college, and professional life.

### 14: Little-Known achievements and small works.
- This part is for achievements and work that is small and inconsequential enough to not necessarily be deserving of an entire page. The goal is to determine where to appropriately display work, taking credit, without it being weird or having too much fanfare. For example, things like "I created the design for the volleyball magnet for Williamsville East Volleyball as a student in 2018 and they're still selling". This is kinda cool that I did that as a young high school student, but it would be weird to feature it in a portfolio on its own, so it should be appropriately grouped with other things like it or another way to appropriately feature it should be considered. 

### 15: In progress musical projects
- Here is where we have ongoing project work. This would include the "Francisco Music Library" which is a digitization effort for my father's music library, along with my own compositions and arrangements. A sub-part of the project is to market and distribute my own music organizational software, so there will be a link to view the work as it progresses. 
- Another thing to feature here is musical composition and recording projects that are in progress. These will include some of my arrangements, and also some recording projects that are speculative and may require approval from composers or copyright holders before moving forward, this caviat must be made clear. An example is a french horn arrangment for the Interstellar soundtrack or some arrangements of Percy Grainger that have not yet entered public domain. 

---

## Pages Reference

| Page | Purpose |
|---|---|
| `index.html` | Hero + intro + engineering timeline |
| `about.html` | Background, education, interests, career goals, work experience, certifications |
| `projects.html` | All engineering and academic projects with expandable detail sections |
| `cv.html` | Resume / CV display |
| `coursework.html` | EE coursework with reflections |
| `reflections.html` | Personal/professional reflections |
| `citations.html` | Academic citations referenced throughout the site |
| `contact.html` | Contact form and social links |

---

## Media Guidelines

- Images must be web-optimized: JPG/PNG for photos, SVG for icons and logos
- Do not exceed 1MB per image — compress before adding
- Video: prefer embedding YouTube/Vimeo for large videos; local `.mp4` only for short clips
- All images must have `loading="lazy"` except above-the-fold hero images
- Captions should be in `<figcaption>` inside a `<figure>` element
- All elements should be considered Marcus Francisco's original work, that includes any icons created for the style and function of the website. As we add stylistic elements and images to the site, let's make sure it is of our combined creation and not stolen directly from other sources. 
- Copyright where appropriate, all rights reserved.

---

## Tone & Professionalism

This portfolio will be sent to engineering recruiters, academic committees, and 
professional contacts. Every element should reflect:

- **Precision** — no typos, no placeholder text, no broken links
- **Clarity** — content is easy to scan and understand quickly
- **Depth** — technical details are present and accurate for those who read closely
- **Personality** — Marcus's identity as both an engineer and musician should come through; 
  this is not a generic template

When writing or editing copy, maintain Marcus's voice: technical but approachable, 
confident but not arrogant, specific over vague.

---

## Before Making Any Change

1. Identify which file(s) are affected
2. Check whether the element is covered by a preservation rule above
3. Check whether the animation guidance applies
4. Make the smallest change that achieves the goal
5. Test at 375px (mobile), 768px (tablet), and 1200px (desktop) widths

---

## Git Workflow

- **Never commit directly to `main`**
- All work happens on `dev` or a feature branch (e.g. `feature/mobile-nav`, 
  `feature/music-section`)
- Commit frequently with descriptive messages: `"Standardize modal open/close animation"` 
  not `"fix stuff"`
- Open a Pull Request from `dev` → `main` for review before merging

---

*Last updated: 2025. Maintained by Marcus Francisco.*
