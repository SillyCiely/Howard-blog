# CLAUDE.md

Static website for Dr Howard Fan, general surgeon. Plain HTML, one stylesheet and one script, with no framework and no npm. `README.md` is written for the client; this file is for working on the code.

## How the site is built

- **Every `.html` page, `sitemap.xml` and `robots.txt` is generated** by `_source/build.py`. Don't edit the generated files by hand, because the next build overwrites them. Change `build.py`, then run:
  ```
  python _source/build.py
  ```
  Commit the regenerated files together with the `build.py` change.
- Page text and data live in `build.py`: `PHONE`, `EMAIL`, `LOCATIONS`, `SOCIALS`, the affiliations list in `home()`, and one function per page (`laparoscopy()`, `book_page()` and so on). Shared parts are `head()`, `header()`, `footer()` and `book_band()`.
- `assets/css/styles.css` and `assets/js/main.js` are written by hand. The build doesn't touch them.
- Before rebuilding after someone else's changes, check that the build reproduces the current pages. Copy the HTML aside, run the build and compare. Any difference is a hand edit that should be moved into `build.py` first.
- `build.py` writes files with LF line endings. Git's "LF will be replaced by CRLF" warnings are expected.

## Code conventions

- `main.js` is a single ES5 IIFE: `var`, `function`, no arrow functions, no modules. Use the existing `$` and `$$` helpers. Respect `reduceMotion` for any animation or auto-scroll.
- CSS colours, radii and fonts are custom properties on `:root` at the top of `styles.css` (`--brand`, `--ink`, `--mist`, `--radius-s` and so on). Use them rather than new hex values.
- The mobile layout starts at `max-width: 760px`. JavaScript that changes behaviour on phones uses the same query, for example `mobileMq` in the locations code.
- Accessibility matters on this site. Keep labels, `aria-*` state and keyboard support working when changing interactive parts.

## Booking form (`book.html`)

- The fields are first name, last name, phone, email, subject, details and optional attachments.
- `FORM_ENDPOINT` in `build.py` is empty, so submitting opens the visitor's email app (`mailto:`). Attachments can't be sent this way. They only work once `FORM_ENDPOINT` points to a form service that accepts files, such as a paid Formspree plan.

## Deploying

- GitHub Pages serves the `main` branch from the repo root at https://sillyciely.github.io/Howard-blog/. Every push to `main` deploys automatically through the built-in "pages build and deployment" workflow.
- Pushes to other branches don't deploy. Merge them into `main` with a pull request.
- Canonical URLs and the sitemap use `BASE_URL` (`https://www.drfan.com.au/`), the planned custom domain.

## Caching

- `head()` and `footer()` link the stylesheet and script through `asset()` in `build.py`. It adds a content hash (`styles.css?v=…`) so browsers fetch new versions after each deploy. Rebuild after any CSS or JS change so the hash updates.

## Known issues

- **Affiliations carousel on phones:** there was extra empty space after the last logo. Wide logo images (for example `csu.png` at 700px and `gsa.png` at 512px) inflated the `max-content` width of `.aff-track`. The fix gives `.aff-tile` a fixed `width` (260px, or 200px on phones) and removes `width: max-content` from `.aff-track` (commits `25452da` and `cd50e2e`, reapplied in `3ca2d7b` and `92c3110`). Confirmed in Chrome; still to be confirmed on iPhone Safari.
