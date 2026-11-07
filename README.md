# purimladpli.net

Personal site — Hugo, no JavaScript framework, no build tooling beyond a single binary.

## Local build

```bash
../bin/hugo server --buildDrafts     # preview on :1313
../bin/hugo --minify                 # build to public/
```

Hugo **extended 0.147.0** is what the site is built with; the binary lives in `../bin/hugo`.

## Structure

```
content/
  _index.md            landing page (copy lives in layouts/index.html)
  about.md             About prose — edit paragraphs here
  work.md              Interests / Expertise / Experience sections
  travel.md            Travel intro
  life.md              Life intro
  photos/_index.md     Photos index intro
  photos/<album>.md    one file per album: title, album key, weight
data/
  albums.json          album manifest: cover index, order, photo list with sizes
  papers.json          journal + conference papers
  patents.json         patent families
  thesis.json          thesis title / venue / purl
  visited.yaml         countries visited — one entry per country
layouts/               templates (baseof, header, footer, one per section)
static/
  css/main.css         all styling
  js/ui.js             header + mobile menu
  js/gallery.js        album justified grid + lightbox
  js/book.js           Life flip book
  js/map.js            Travel map
  js/page-flip.browser.js  vendored StPageFlip
  vendor/leaflet.*     vendored Leaflet
  albums/<slug>/       album images: 01.webp … (1600px) and 01-t.webp … (600px)
  book/p01…p26.webp    photo-book spreads
  cv/ladpli-cv.pdf     the CV download
  img/                 hero, hero-mobile, about portrait
```

## Adding an album

1. Put the folder in `static/albums/<slug>/` with `NN.webp` and `NN-t.webp` pairs.
2. Add an entry to `data/albums.json` (title, count, cover, order, photos with w/h).
3. Add `content/photos/<slug>.md` with `album: "<slug>"` and a `weight`.
4. Build. The album appears on `/photos/` and gets its own page with prev/next.

## Editing text

Everything a reader sees as prose is Markdown in `content/`: About paragraphs, Work's three sections, section intros. Papers, patents and countries come from `data/`.

## Deploy — Cloudflare Pages

| Setting | Value |
|---|---|
| Build command | `hugo --minify` |
| Output directory | `public` |
| Environment variable | `HUGO_VERSION = 0.147.0` |

Push to GitHub, then connect the repo in Cloudflare Pages. Custom domain `purimladpli.net` is added in Pages; the DNS nameservers move to Cloudflare so the apex works (a registrar CNAME only covers `www`).
