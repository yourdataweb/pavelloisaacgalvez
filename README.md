# Pavelló Isaac Galvez — website

Static site for **Pavelló Poliesportiu Municipal Isaac Galvez**, the municipal indoor sports
hall on Ronda Ibèrica, 66, Vilanova i la Geltrú.

Three languages, server-rendered HTML per locale, no framework and no runtime dependencies.

## Live site

- Catalan (default): https://pavelloisaacgalvez.vilanovailageltru.info/
- Spanish: https://pavelloisaacgalvez.vilanovailageltru.info/es/
- English: https://pavelloisaacgalvez.vilanovailageltru.info/en/

## Structure

```
index.html                 Catalan (default locale)
es/index.html              Spanish
en/index.html              English
ca/index.html              redirect to / (the default locale used to live here)
src/template.html          single template used by the build
src/data.json              facility data (address, phone, coordinates)
src/locales.json           locale list, which one is default, hreflang codes
src/i18n/{ca,es,en}.json   all copy, per locale
scripts/build.mjs          emits the three locale pages + sitemap, robots, manifest
scripts/assets.mjs         generates app icons and the Open Graph image
scripts/card.mjs           generates assets/photos/handover.png (10.5 x 14.5 cm @ 300 dpi)
scripts/verify.mjs         checks the built output in a headless browser
assets/css/styles.css      all styles, responsive from 320 px up
assets/js/main.js          mobile navigation, scroll reveal, cookie consent, lazy map
assets/fonts/              self-hosted Fraunces and Inter (woff2 subsets)
assets/img/                mark, icons, hero photo, OG image
assets/photos/handover.png handover card with a QR to the live site
```

## Page layout

Built for a public sports facility rather than a shopfront: a full-width photo masthead, a
four-item fact strip (address, enquiries, bookings, rating), facilities as a specification
list, a grid of the sports played, visitor reviews, and a visit section with a consent-gated
map. There are no opening hours and no prices, both of which need confirming with the venue.

## Build

Requires Node 20+ and `puppeteer` for the asset scripts.

```bash
node scripts/build.mjs     # regenerate the three locale pages
node scripts/assets.mjs    # regenerate icons and og-image.jpg
node scripts/card.mjs      # regenerate the handover card
node scripts/verify.mjs    # headless verification of the built output
```

`scripts/build.mjs` fails on any unresolved template placeholder, an empty `href`/`src`, or
invalid JSON-LD, so a green build means every string was actually interpolated.

## Editing content

Text lives in `src/i18n/*.json`; shared facility facts live in `src/data.json`. Change those,
run `node scripts/build.mjs`, commit the regenerated HTML. Do not hand-edit the generated
`index.html` files — they are overwritten.

## Deploy

Pushing to `main` runs `.github/workflows/deploy-aws.yml`, which builds the site, then
authenticates to AWS with OIDC (no stored keys) and uploads it to
`s3://dr-static-websites/vilanovailageltru.info/pavelloisaacgalvez/`. The subdomain is served
from the bucket's CDN, so a deploy is live within a few minutes.

## Technical notes

- **SEO**: per-locale `<title>`, description, canonical, reciprocal `hreflang` (including
  `x-default`), Open Graph and Twitter cards, `sitemap.xml` with alternates, `robots.txt`,
  and `SportsActivityLocation` structured data with address and geo coordinates.
- **Accessibility**: single `h1` per page, skip link, landmark elements, visible focus rings,
  body text at or above 4.5:1 contrast, `aria-expanded` on the navigation toggle, Escape
  closes the drawer.
- **Performance**: self-hosted woff2 subsets preloaded, one CSS file, one deferred JS file,
  no third-party requests until the visitor opts in.
- **Privacy / GDPR**: the cookie notice has an accept and a reject choice. Nothing is fetched
  from Google — analytics script or map iframe — until the visitor accepts; rejecting loads
  neither and is remembered.
