# STACKLY — Machine Learning Platform

A complete, production-quality static website for **Stackly**, a premium enterprise
machine-learning platform. Built with pure HTML5, CSS3 and vanilla JavaScript —
no frameworks — with GSAP, GSAP ScrollTrigger and AOS for motion.

## Pages

| File | Purpose |
|---|---|
| `index.html` | Landing page: hero, trusted strip, bento grid, workflow, capabilities, live dashboard preview, use cases, stats, architecture, testimonials, pricing preview, FAQ, CTA |
| `about.html` | Story, mission/vision, technology, team, stats |
| `service.html` | 8 service lines with feature lists + studio imagery |
| `blog.html` | Featured article, category filter, live search, 9 original posts |
| `pricing.html` | Monthly/yearly toggle with animated prices + comparison table |
| `faq.html` | Categorized accordion (13 questions) |
| `contact.html` | Validated contact form + company info |
| `login.html` | Split-screen login, USER/ADMIN roles → routes to dashboards |
| `register.html` | Account creation with full validation |
| `dashboard.html` | ML workspace: stats, canvas charts, models table, training jobs, system status |
| `seller-dashboard.html` | Marketplace: revenue, orders, listings, customer health |
| `404.html` | Animated neural-network error page with `history.back()` |

## Tech

- **No frameworks** — vanilla JS modules in `js/` (preloader, cursor, navigation, main, animations, forms, dashboard)
- **GSAP + ScrollTrigger** — hero choreography, split text, counters, parallax, workflow scrub
- **AOS** — supporting section reveals
- **Charts** — hand-rolled Canvas 2D (line/area/bar/donut), no chart library
- **Images** — original AI-generated artwork, optimized WebP (<100 KB each)
- **Logo** — official Stackly mark, vectorized to `svg/logo.svg` / `svg/logo-mark.svg` (black on transparent)

## Structure

```
├── index.html, about.html, service.html, blog.html, contact.html,
│   pricing.html, faq.html, login.html, register.html,
│   dashboard.html, seller-dashboard.html, 404.html
├── css/   style.css · responsive.css · animations.css · dashboard.css · pages.css
├── js/    main.js · animations.js · cursor.js · preloader.js · navigation.js · dashboard.js · form.js
├── img/   hero.webp · about.webp · service-01..03.webp · blog-01..03.webp · stackly-logo.webp · stackly-mark.webp
└── svg/   logo.svg · logo-mark.svg · hero-network.svg · neural-network.svg · data-flow.svg · grid.svg · icons/
```

## Run

Any static server works:

```bash
python3 -m http.server 8080
# open http://localhost:8080
```

Accessibility: semantic HTML, ARIA on interactive controls, keyboard-friendly menus,
`prefers-reduced-motion` respected throughout.
