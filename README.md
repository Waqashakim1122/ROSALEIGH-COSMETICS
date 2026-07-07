# Rosaleigh Site — Component Structure

Aapki site ab chhote-chhote **components** mein baant di gayi hai. Har section
(Header, Footer, Hero, Products, etc.) ka apna alag folder hai jisme uska
**HTML + CSS** (aur agar zaroorat ho to JS) hai.

## Folder Structure

```
rosaleigh-site/
├── components/              ← HAR SECTION YAHAN HAI (alag-alag folder)
│   ├── header/
│   │   ├── header.html      ← sirf iska HTML
│   │   ├── header.css       ← sirf iska CSS
│   │   └── header.js        ← sirf iska JS
│   ├── footer/
│   │   ├── footer.html
│   │   └── footer.css
│   ├── hero-home/
│   ├── collections/
│   ├── bestsellers/
│   ├── ...                  ← (33 components total — har section ka apna folder)
│   └── notfound/
│
├── pages/                    ← Page ke TEMPLATES (yeh final files NAHI hain)
│   ├── index.template.html
│   ├── about.template.html
│   ├── shop.template.html
│   ├── product.template.html
│   ├── contact.template.html
│   ├── cart.template.html
│   └── 404.template.html
│
├── css/base.css              ← Sirf global cheezein: colors, fonts, buttons
├── js/site.js                ← Sirf global JS: scroll bar, animations
├── images/                   ← Same as pehle
│
├── build.js                  ← Yeh script sab kuch jodta (assemble) hai
│
└── index.html, shop.html, ...  ← FINAL banayi hui files (build.js se banti hain)
```

## Kaam Kaise Karta Hai

1. `pages/*.template.html` files mein sirf itna likha hota hai:
   `<!--include:header-->`, `<!--include:footer-->` waghera.
2. Jab aap `node build.js` chalate ho, yeh script har
   `<!--include:NAME-->` ko `components/NAME/NAME.html` ke asli content se
   badal deta hai — aur uska CSS/JS bhi khud-ba-khud `<head>` aur page ke
   end mein link kar deta hai.
3. Result: final `index.html`, `shop.html`, `about.html` waghera ban jaate
   hain jo browser mein seedha khulte hain.

## Jab Kisi Ek Cheez Mein Change Karna Ho

**Sirf uska component folder replace/edit karo, phir rebuild chala do:**

1. Jaise agar Header change karna hai → `components/header/` folder khol kar
   `header.html` ya `header.css` edit karo (ya poora folder replace kar do).
2. Terminal mein site ke root folder (`rosaleigh-site/`) mein jaake likho:
   ```
   node build.js
   ```
3. Bas — saari pages jo Header use karti hain (Home, Shop, About, Cart,
   Contact, Product, 404) khud-ba-khud update ho jayengi. Aapko har HTML
   file mein manually jaake copy-paste nahi karna padega.

> Node.js zaroori hai (`node -v` se check kar lo). Koi internet ya
> `npm install` ki zaroorat nahi — build.js sirf built-in Node se chalta hai.

## Component List (kaunsa naam kis section ka hai)

| Component folder | Section | Kin pages pe |
|---|---|---|
| `announce` | Top free-shipping bar | Home, Shop, About, Contact, Product, Cart |
| `header` | Nav bar + logo + mobile menu | Sab pages |
| `hero-home` | Home ka bada banner | Home |
| `trustbar` | "100% Grass-Fed Tallow" strip | Home |
| `collections` | Featured Collections grid | Home |
| `bestsellers` | Best Sellers products | Home |
| `why` | "The Rosaleigh Difference" (dark section) | Home |
| `ingredient-spotlight-home` / `-about` | Grass-Fed Tallow spotlight | Home / About |
| `science` | Stats (95%, 97%, 4.9★) | Home, About |
| `testimonials` | Customer reviews | Home |
| `natureband-home` / `-about` | Full-width pasture image | Home / About |
| `press` | "As Seen In" logos | Home |
| `founder-home` / `-about` | Founder quote section | Home / About |
| `about-hero` | About page top banner | About |
| `timeline` | 2021–2025 journey | About |
| `values` | Our Values cards | About |
| `page-header-shop/-contact/-cart/-product` | Small breadcrumb banner | Shop / Contact / Cart / Product |
| `contact-info` | Email/Call/Studio cards | Contact |
| `contact-form` | Contact form | Contact |
| `faq` | FAQ accordion text | Contact |
| `shop-filters` | Left sidebar filters | Shop |
| `shop-grid` | Product grid | Shop |
| `product-gallery` | Image gallery | Product |
| `product-info` | Price/size/accordion | Product |
| `product-related` | "You May Also Like" | Product |
| `cart-items` | Cart line items | Cart |
| `cart-summary` | Order total box | Cart |
| `notfound` | 404 message | 404 |
| `newsletter` | "Join the Community" | Sab pages |
| `footer` | Bottom footer | Sab pages |

## Note

`css/base.css` mein sirf woh cheezein hain jo **poori site** use karti hai
(rang, fonts, `.container`, buttons, product-card grid). Yeh ek professional
practice hai — agar brand ka color badalna ho to sirf `base.css` mein ek
jagah badlo, 30 alag files mein nahi.
