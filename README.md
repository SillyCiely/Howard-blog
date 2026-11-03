# Dr Howard Fan — website

A complete static website: plain HTML, CSS and a small JavaScript file. No build tools, database or plugins are needed — any web host can serve this folder as-is.

## What's inside

| File | Page |
|---|---|
| `index.html` | Homepage |
| `laparoscopy.html`, `endoscopy.html`, `minor-operations.html` | Procedures |
| `operation-risks.html`, `post-operative-instructions.html`, `faqs.html` | Patient information |
| `useful-links.html`, `other-resources.html` | Resources |
| `contact.html` | Contact Us and all locations |
| `404.html` | "Page not found" page |
| `assets/css/styles.css` | All styling (colours are at the top as variables, e.g. `--brand: #3134CF`) |
| `assets/js/main.js` | Menus, carousels, steps, locations, FAQs and scroll animations |
| `assets/img/` | Logo, favicon, photos |
| `sitemap.xml`, `robots.txt` | For Google |
| `_source/build.py` | Optional: regenerates every page from one file (for a developer) |

## Preview it

Open `index.html` in any browser. Everything works offline except the Google Fonts and the location maps, which need an internet connection.

## Before going live — things to replace

1. **Portrait** — replace `assets/img/portrait.jpg` with Dr Fan's portrait (portrait shape, 4:5, at least 1200 × 1500 px). Keep the same file name.
2. **About photo** — replace `assets/img/about-photo.jpg` the same way.
3. **Logo** — `assets/img/logo.jpg`. A transparent PNG or SVG version will look better on the dark footer; if you get one, save it as `logo.png` and update the `logo.jpg` references in the HTML files.
4. **Affiliation logos** (homepage) — logos live in `assets/img/affiliations/`, named after each tile (`racs`, `gsa`, `gesa`, `canrefer`, `researchgate`, `csu`, `unsw`, `svph`, `kareena`; `.svg` or `.png`). Add or replace a file with the same name and run `python _source/build.py`; a tile without a file shows a grey "Logo" placeholder. Still missing: `csu.svg` and `kareena.png` (those sites block automated downloads).
5. **Social links** (footer, every page) — already set to the profiles linked from the current drfan.com.au site. To change them, edit `SOCIALS` in `_source/build.py` and rebuild. The icons are SVGs in `assets/img/social/` (Font Awesome Free 6.7.2, CC BY 4.0; the credit comment inside each file must stay).
6. **Bowel preparation PDF** (optional) — save the PDF as `assets/docs/bowel-preparation-instructions.pdf` and link to it from `other-resources.html`.
7. **Wording check** — the homepage bio says "Royal Australian College of Surgery". The college's name is the Royal Australasian College of Surgeons.

Tip: because the header and footer appear on every page, a find-and-replace across all `.html` files is the quickest way to change them. A developer can instead edit `_source/build.py` and run `python3 build.py` to regenerate all pages at once.

## Hosting (when you're ready)

- **Netlify, Cloudflare Pages or Vercel** (free): drag this folder into their dashboard, then point `drfan.com.au` at it in your domain settings.
- **Any traditional web host**: upload the contents of this folder to the public web root.

The old Google Sites addresses (e.g. `drfan.com.au/home/laparoscopy`) will change to `drfan.com.au/laparoscopy.html`. Ask your host to add redirects so old links and Google results keep working:

```
/home                              /
/home/laparoscopy                  /laparoscopy.html
/home/endoscopy                    /endoscopy.html
/home/minor-operations             /minor-operations.html
/home/operation-risks              /operation-risks.html
/home/post-operative-instructions  /post-operative-instructions.html
/home/faqs                         /faqs.html
/home/contact-us                   /contact.html
/home/useful-links                 /useful-links.html
/home/other-resources              /other-resources.html
```

(On Netlify or Cloudflare Pages, put these lines, each followed by ` 301`, in a file named `_redirects` in this folder.)

## Accessibility and performance notes

- Works with keyboard only; menus, carousels, steps and FAQs have proper labels.
- Carousels pause on hover/focus, and all motion is switched off for visitors who set "reduce motion" on their device.
- Responsive from small phones to large desktops; on phones a "Call / Book" bar appears after scrolling.
