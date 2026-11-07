# purimladpli.net

Personal site: a single-page landing, a work/CV page, seven photo albums, a travel map and a photo-book flip book.

**Live:** https://purimladpli.net · **Repo:** https://github.com/poomsar/personal-website

Hugo builds it, Cloudflare Pages serves it, GitHub triggers the build. No JavaScript framework, no database, no CMS, no build tooling beyond one binary.

---

## How a change gets published

```
edit a file → git commit → git push → Cloudflare builds (hugo --minify) → live in ~60s
```

There is no manual deploy step and no upload. If a push doesn't appear live after a couple of minutes, check the project's **Deployments** tab in Cloudflare for a failed build.

---

## Repository map

```
content/                 every word a reader sees, as Markdown
  _index.md              landing page (title only — copy lives in layouts/index.html)
  about.md               About prose + Contact
  work.md                Interests / Expertise / Experience
  travel.md              Travel intro line
  life.md                Life intro line
  photos/_index.md       Photos index intro line
  photos/<slug>.md       one file per album: title, album key, weight

data/                    structured content, edited as data not prose
  albums.json            album manifest (cover index, order, photos with w/h)
  papers.json            22 papers: kind (Journal|Conference), year, title, authors, venue, detail, doi
  patents.json           7 patent families
  thesis.json            thesis title, venue, year, PURL
  visited.yaml           41 countries: name, iso2, region, lat, lon

layouts/
  _default/baseof.html   <head>, header, footer, script slots
  partials/header.html   nav + mobile menu markup
  partials/footer.html   email / Instagram / LinkedIn / year
  partials/lightbox.html lightbox markup
  index.html             landing page
  about/single.html      About layout (prose + sticky portrait)
  work/single.html       lede, CV link, prose, then thesis → journal → conference → patents
  photos/list.html       album index (covers from data/albums.json)
  photos/single.html     one album: lead image, justified grid, lightbox, prev/next
  travel/single.html     map + region columns + window.PLACES
  life/single.html       flip book pages
  404.html

static/                  files served as-is
  css/main.css           all styling (one file, ~16 KB)
  js/ui.js               sticky header, mobile menu, scroll lock
  js/gallery.js          justified rows + lightbox
  js/book.js             flip book init
  js/map.js              Leaflet init
  js/page-flip.browser.js  vendored StPageFlip (MIT)
  vendor/leaflet.*       vendored Leaflet 1.9.4
  albums/<slug>/         NN.webp (1600px) + NN-t.webp (600px)
  book/p01…p26.webp      13 spreads rendered from the photo-book PDF
  cv/ladpli-cv.pdf       the CV the "CV (PDF)" link serves
  img/                   hero.webp, hero-mobile.webp, about.webp
```

---

## Common tasks

### Change text

Edit the relevant file in `content/`. About paragraphs, Work's three sections and the section intros are plain Markdown; `## Heading` in `work.md` becomes the small mono section label.

### Add or update a paper

`data/papers.json` — append an object with `kind` set to `Journal` or `Conference`. The Work page groups by that field and numbers the lists automatically, so no template change is needed.

### Update the CV

Replace `static/cv/ladpli-cv.pdf`. Keep the filename so the link doesn't break. The currently published copy has the mobile number redacted; if you send a new one, redact it before committing (a phone number in a public repo is scraped).

### Add an album

1. Create `static/albums/<slug>/` with `01.webp …` (long edge ~1600 px) and matching `01-t.webp …` (long edge 600 px).
2. Add an entry to `data/albums.json`:

```json
"08-iceland": {
  "title": "Iceland", "count": 10, "cover": 3, "order": 8,
  "photos": [ { "file": "01.webp", "thumb": "01-t.webp", "w": 1600, "h": 1067 }, … ]
}
```
`cover` is the 1-based index of the photo used as the lead image. It is excluded from the grid and opens as the first lightbox frame.
3. Add `content/photos/iceland.md`:

```yaml
---
title: "Iceland"
album: "08-iceland"
weight: 8
---
```
4. Push. The album appears on `/photos/` and gets `/photos/iceland/` with prev/next wired by `weight`.

Note: gallery images are served from `static/`, not Hugo's image pipeline — the derivatives are pre-made, so builds stay at ~70 ms instead of minutes.

### Update the travel map

Edit `data/visited.yaml` — one entry per country:

```yaml
- name: Iceland
  iso2: IS
  region: Europe
  lat: 65
  lon: -18
```
`region` must be one of `Asia`, `Europe`, `Africa`, `Americas`, `Oceania` — the template renders those groups in that order and spans a second column when a region has more than 13 entries. Pins are placed at the coordinates given, so a country's centroid is usually better than its capital.

### Replace the photo book

The flip book uses 26 rendered pages in `static/book/`, produced from the PDF's 13 interior spreads (the two covers are exported rotated and are deliberately skipped). To re-render from a new PDF, the original pipeline resized each page to ~950×1228 WebP at quality 82 and split nothing — one PDF page = one book page pair.

### Preview locally

```bash
cd purimladpli
../bin/hugo --minify --destination public   # build
python3 -m http.server 1315 --directory public
```

Or `../bin/hugo server` for live reload. Hugo **extended 0.147.0** is required — the binary is in `../bin/hugo`, and the deployed build pins the same version.

---

## Infrastructure

| Thing | Where |
|---|---|
| Source | `github.com/poomsar/personal-website` (public, `main`) |
| Hosting | Cloudflare Pages project `purimladpli`, Git-connected |
| Build | `hugo --minify` → `public`, env `HUGO_VERSION=0.147.0` |
| DNS | `purimladpli.net` zone on Cloudflare, nameservers `mariah.ns.cloudflare.com` / `stanley.ns.cloudflare.com` (registrar: Squarespace) |
| Custom domains | apex + `www`, both with issued certificates |
| Canonical | apex — a Redirect Rule 301s `www.*` → `https://purimladpli.net/$1`, query string preserved |

`public/` is gitignored; Cloudflare builds from source.

### Traps worth knowing

- **Use the Pages flow, not Workers.** Cloudflare's "Create application" leads to Workers Builds, which has Node but no Hugo — `hugo --minify` fails there. The Pages route is the "legacy Pages workflow" link on that screen.
- **Hugo version must be pinned.** Cloudflare's Hugo preset can default to an older release; the templates assume 0.147 behaviour.
- **Load order matters for Leaflet.** `leaflet.css` is linked before `main.css` (the `head` block renders first in `baseof.html`), otherwise the map's controls revert to Leaflet's white defaults.
- **`.PrevInSection` runs forward** in weight order, so the "previous" link on the first album points at the second. `photos/single.html` swaps them deliberately.
- **Album images are in `static/`**, so `hugo --minify` does not resize them — they must arrive pre-sized.

---

## Local copies not in git

`../archive/` holds the source PDFs — the photo book (both the 2020 original and the typo-fixed re-export) and the unredacted CV. `../bin/hugo` is the local Hugo binary.
