// RELATED-PRODUCTS.JS — fills "You May Also Like" with random products,
// excluding whichever product is currently being viewed.
(function(){
  const container = document.getElementById('related-products');
  if(!container || !window.PRODUCTS) return;

  const currentId = window.currentProductId ||
    new URLSearchParams(window.location.search).get('id') ||
    'tallow-balm';

  const allIds = Object.keys(window.PRODUCTS).filter(id => id !== currentId);

  // Shuffle so it's a different set/order each time
  for(let i = allIds.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [allIds[i], allIds[j]] = [allIds[j], allIds[i]];
  }

  const pick = allIds.slice(0, 4); // show up to 4 related products

  container.innerHTML = pick.map(id => {
    const p = window.PRODUCTS[id];
    const badge = p.wasPrice ? '<span class="badge new-badge">Sale</span>' : '';
    return `
      <div class="product-card">
        <a href="product.html?id=${id}"><div class="product-thumb">${badge}<img loading="lazy" decoding="async" class="theme-img" src="${p.image}" alt="${p.name}"></div></a>
        <div class="product-info">
          <a href="product.html?id=${id}" style="color:inherit;"><div class="pname">${p.name}</div></a>
          <div class="stars">★★★★★ <span>(${p.reviews})</span></div>
          <div class="price-row">
            <div class="price">$${p.price.toFixed(2)}</div>
            <button class="btn-add" data-product-id="${id}">+ Add to Cart</button>
          </div>
        </div>
      </div>`;
  }).join('');
})();