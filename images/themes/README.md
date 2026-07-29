# Theme-matched images

This folder holds **alternate photos** for each color theme. When a visitor
picks a theme from the theme switcher (top of the site), `js/site.js`
automatically looks here first for a matching image, and only falls back to
the original photo in `/images/...` if a themed version doesn't exist yet.
Nothing breaks if a file is missing — it just quietly uses the default photo.

## How it works

Every swappable `<img>` on the site has `class="theme-img"`. For an image
whose normal (default) path is:

```
images/products/tallow-balm.jpg
```

the site will try to load the **rosegold** version from:

```
images/themes/rosegold/products/tallow-balm.jpg
```

So: same filename, same sub-folder, just nested under
`images/themes/<theme-name>/`.

## Themes to fill in

- `rosegold`
- `lavender`
- `terracotta`
- `vintage`

(There's no folder for `default` — that's just the original `/images` files.)

## Exact files each theme can override

Drop images with these **exact same filenames** into the matching
`images/themes/<theme>/...` folder:

```
hero/hero-products-natural.jpg

products/tallow-balm.jpg
products/spf50-sunscreen.jpg
products/pdrn-anti-wrinkle-stick.jpg
products/lip-balm.jpg
products/deodorant-stick.jpg
products/magnesium-zinc-foot-cream.jpg
products/clarifying-balm.jpg
products/cleansing-balm.jpg
products/shop-all-collection.jpg

ingredients/tallow-honey.jpg
```

> **Note:** These filenames match the current product catalog (Tallow Balm,
> Sun Screen SPF 50+, PDRN Anti-Wrinkle Core Stick, Lip Balm, Deodorant
> Stick, Magnesium & Zinc Foot Cream, Clarifying Balm, Cleansing Balm). If
> you renamed or added products again later, update this list — and rename
> any existing themed files in this folder to match, or the theme switch
> will silently keep showing the default photo for anything with an
> outdated filename.

You don't have to fill in every file for every theme — add them gradually.
Any image you haven't made a themed version of will simply keep showing the
original.

## Tips for shooting/generating themed sets

- Keep the **same crop/aspect ratio** as the original so layouts don't shift.
- Match the theme's mood via props, styling, or color grading:
  - **rosegold** – warm pink/rose tones, blush backdrops
  - **lavender** – soft purple tones, lilac backdrops
  - **terracotta** – warm orange/clay tones, earthy backdrops
  - **vintage** – sepia/muted tones, aged paper or antique props
- Same file format/extension as the original (e.g. `.png` stays `.png`,
  `.jpg` stays `.jpg`).