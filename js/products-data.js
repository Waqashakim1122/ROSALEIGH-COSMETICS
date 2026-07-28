/* =========================================================
   PRODUCTS-DATA.JS — single source of truth for every product's
   name, price, description, and images. Loaded on EVERY page
   (before site.js and any component JS) so the product detail
   page, cart, and header cart-count can all read from one place.

   Add a new product here and it automatically works at
   product.html?id=<key> and can be added to the cart.
   ========================================================= */
window.PRODUCTS = {
  "tallow-balm": {
    name: "Tallow Balm",
    eyebrow: "Repair &amp; Restore",
    price: 36.00,
    wasPrice: 44.00,
    rating: "4.9",
    reviews: "4,872",
    image: "images/products/tallow-balm.jpg",
    thumbs: [
      "images/products/tallow-balm.jpg",
      "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=800&q=80",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80"
    ],
    description: "A rich, barrier-restoring face &amp; body balm handcrafted with grass-fed tallow, ceramide and hyaluronic acid. Delivers deep hydration and skin barrier support for all skin types — leaving skin soft, resilient and glowing. Net weight 70g (2.5 oz).",
    size: "Single — 70g",
    ingredients: "Grass-fed tallow, ceramide, hyaluronic acid, jojoba oil, vitamin E, calendula extract. No parabens, sulfates, phthalates or synthetic fragrance.",
    howToUse: "Warm a small amount between fingertips and massage into clean skin morning and night. A little goes a long way — start with a pea-sized amount."
  },
  "spf50-sunscreen": {
    name: "Sun Screen SPF 50+",
    eyebrow: "Daily Protection",
    price: 32.00,
    rating: "5.0",
    reviews: "1,323",
    image: "images/products/spf50-sunscreen.jpg",
    thumbs: [
      "images/products/spf50-sunscreen.jpg",
      "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=800&q=80"
    ],
    description: "A lightweight, reef-safe broad-spectrum SPF 50+ sunscreen lotion in an airless pump bottle. Absorbs quickly with no white cast, hydrates skin, and layers seamlessly under makeup for daily UVA/UVB protection.",
    size: "50ml / 1.7 fl oz",
    ingredients: "Zinc oxide, niacinamide, hyaluronic acid, vitamin E, green tea extract. Reef-safe, non-comedogenic, fragrance-free.",
    howToUse: "Apply generously as the final step of your morning routine. Reapply every 2 hours during direct sun exposure."
  },
  "pdrn-anti-wrinkle-stick": {
    name: "PDRN Core Stick",
    eyebrow: "Advanced Anti-Aging",
    price: 42.00,
    rating: "5.0",
    reviews: "967",
    image: "images/products/pdrn-anti-wrinkle-stick.jpg",
    thumbs: [
      "images/products/pdrn-anti-wrinkle-stick.jpg",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80"
    ],
    description: "A Korean-innovation twist-up stick combining PDRN (polydeoxyribonucleotide), marine collagen and NAD+ to visibly firm, smooth and renew the skin's surface. Glide directly onto fine lines for targeted, on-the-go anti-aging care.",
    size: "10g twist-up stick",
    ingredients: "PDRN, hydrolyzed collagen, NAD+, niacinamide, adenosine, panthenol.",
    howToUse: "Twist up and glide directly onto cleansed skin — focus on fine lines, forehead and under-eye area. Follow with moisturizer."
  },
  "lip-balm": {
    name: "Lip Balm",
    eyebrow: "Lip Care",
    price: 14.00,
    rating: "4.8",
    reviews: "582",
    image: "images/products/lip-balm.jpg",
    thumbs: ["images/products/lip-balm.jpg"],
    description: "A nourishing, all-natural lip balm made with shea butter, beeswax and vitamin E to soften and protect dry, chapped lips. Lightweight, non-sticky formula glides on smooth and locks in moisture all day.",
    size: "Plastic tube",
    ingredients: "Shea butter, beeswax, jojoba oil, vitamin E, calendula extract.",
    howToUse: "Apply to lips as needed throughout the day, especially before sun or cold exposure."
  },
  "deodorant-stick": {
    name: "Deodorant Stick",
    eyebrow: "Natural Deodorant",
    price: 18.00,
    rating: "4.8",
    reviews: "734",
    image: "images/products/deodorant-stick.jpg",
    thumbs: ["images/products/deodorant-stick.jpg"],
    description: "An aluminum-free deodorant stick that neutralizes odor naturally while keeping underarms fresh all day. Gentle on sensitive skin and free from parabens and baking soda irritation.",
    size: "75g / 2.65 oz twist-up stick",
    ingredients: "Coconut oil, arrowroot powder, magnesium hydroxide, tea tree oil, shea butter.",
    howToUse: "Apply to clean, dry underarms in the morning. Allow to absorb before dressing."
  },
  "magnesium-zinc-foot-cream": {
    name: "Magnesium &amp; Zinc Foot Cream",
    eyebrow: "Foot &amp; Body Care",
    price: 28.00,
    rating: "4.9",
    reviews: "411",
    image: "images/products/magnesium-zinc-foot-cream.jpg",
    thumbs: ["images/products/magnesium-zinc-foot-cream.jpg"],
    description: "A deep-relief foot cream infused with magnesium and zinc to soothe tired, achy feet and nourish rough, dry skin. Comes in a leak-proof, aluminum-lid jar that makes it travel-friendly.",
    size: "100ml / 3.38 fl oz",
    ingredients: "Magnesium chloride, zinc oxide, shea butter, peppermint oil, tallow.",
    howToUse: "Massage generously into feet, focusing on heels and soles. Best applied before bed for overnight relief."
  },
  "clarifying-balm": {
    name: "Clarifying Balm",
    eyebrow: "Clarify &amp; Balance",
    price: 30.00,
    rating: "4.7",
    reviews: "298",
    image: "images/products/clarifying-balm.jpg",
    thumbs: ["images/products/clarifying-balm.jpg"],
    description: "A gentle clarifying balm formulated to balance oily and combination skin, minimize the look of pores, and reduce excess shine without over-drying. Leak-proof packaging keeps it mess-free on the go.",
    size: "50ml / 1.7 fl oz",
    ingredients: "Tea tree oil, witch hazel, niacinamide, kaolin clay, jojoba oil.",
    howToUse: "Apply a thin layer to problem areas after cleansing, morning or night."
  },
  "cleansing-balm": {
    name: "Cleansing Balm",
    eyebrow: "Gentle Cleanse",
    price: 26.00,
    rating: "4.8",
    reviews: "356",
    image: "images/products/cleansing-balm.jpg",
    thumbs: ["images/products/cleansing-balm.jpg"],
    description: "A gentle, melt-in cleansing balm that dissolves makeup, sunscreen and daily buildup without stripping the skin's natural moisture barrier. Leak-proof packaging for easy, mess-free use.",
    size: "60ml / 2.02 fl oz",
    ingredients: "Sunflower oil, shea butter, beeswax, chamomile extract, vitamin E.",
    howToUse: "Massage onto dry skin to dissolve makeup and impurities, then rinse with warm water or remove with a damp cloth."
  }
};
