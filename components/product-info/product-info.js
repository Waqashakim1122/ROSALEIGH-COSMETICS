// PRODUCT INFO + GALLERY component behaviour: renders the correct product
// based on ?id=<slug> in the URL (using the shared catalog from
// js/products-data.js), then wires up gallery swap, qty stepper,
// accordion, size pills and add-to-cart.

// ---- RENDER SELECTED PRODUCT ----
(function(){
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id') || 'tallow-balm';
  const product = (window.PRODUCTS && window.PRODUCTS[id]) || (window.PRODUCTS && window.PRODUCTS['tallow-balm']);
  if(!product) return;

  window.currentProductId = window.PRODUCTS[id] ? id : 'tallow-balm';

  document.title = product.name.replace('&amp;','&') + ' — Rosaleigh Natural Skincare';

  const mainImg = document.getElementById('pd-main-img');
  if(mainImg){
    mainImg.src = product.image;
    mainImg.alt = product.name.replace('&amp;','&');
  }

  const thumbsWrap = document.getElementById('pd-thumbs');
  if(thumbsWrap){
    thumbsWrap.innerHTML = '';
    (product.thumbs && product.thumbs.length ? product.thumbs : [product.image]).forEach(function(src, i){
      const isLocal = src.indexOf('images/') === 0;
      const div = document.createElement('div');
      div.className = 'pd-thumb' + (i === 0 ? ' active' : '');
      div.setAttribute('onclick', "swapImg(this,'" + src + "')");
      const img = document.createElement('img');
      img.loading = 'lazy';
      img.decoding = 'async';
      if(isLocal) img.className = 'theme-img';
      img.src = isLocal ? src : src.replace('w=800', 'w=200');
      div.appendChild(img);
      thumbsWrap.appendChild(div);
    });
  }

  function setHTML(elId, html){
    const el = document.getElementById(elId);
    if(el) el.innerHTML = html;
  }

  setHTML('pd-eyebrow', product.eyebrow || '');
  setHTML('pd-title', product.name);
  setHTML('pd-review-text', product.rating + ' &middot; ' + product.reviews + ' reviews');
  setHTML('pd-desc', product.description);
  setHTML('pd-size', product.size || '');
  setHTML('pd-ingredients', product.ingredients || '');
  setHTML('pd-howtouse', product.howToUse || '');
  setHTML('pd-add-btn', 'Add to Cart — $' + product.price.toFixed(2));

  const priceEl = document.getElementById('pd-price');
  if(priceEl){
    priceEl.innerHTML = (product.wasPrice ? '<span class="was">$' + product.wasPrice.toFixed(2) + '</span>' : '') + '$' + product.price.toFixed(2);
  }

  // Now that the real product image is in the DOM, let the theme switcher
  // (site.js, which loads right after this file) pick up the correct
  // default + themed version for the currently active theme.
})();

// PRODUCT INFO component behaviour: gallery swap, qty stepper, accordion, size pills
function swapImg(el, src){
  document.getElementById('pd-main-img').src = src;
  document.querySelectorAll('.pd-thumb').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
}
let qty = 1;
function stepQty(delta){
  qty = Math.max(1, qty + delta);
  document.getElementById('qty-val').textContent = qty;
}
function toggleAcc(el){
  const item = el.parentElement;
  document.querySelectorAll('.acc-item').forEach(a => { if(a !== item) a.classList.remove('open'); });
  item.classList.toggle('open');
}
function addToCartDetail(btn){
  const orig = btn.textContent;
  btn.textContent = 'Added ✓';
  if(window.RosaleighCart){
    window.RosaleighCart.addToCart(window.currentProductId || 'tallow-balm', qty);
  }
  setTimeout(() => { btn.textContent = orig; }, 1800);
}
document.addEventListener('click', function(e){
  const pill = e.target.closest('.size-pill');
  if(!pill) return;
  document.querySelectorAll('.size-pill').forEach(s => s.classList.remove('active'));
  pill.classList.add('active');
});
