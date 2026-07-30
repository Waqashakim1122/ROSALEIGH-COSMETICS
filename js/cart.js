/* =========================================================
   CART.JS — real, persistent shopping cart (localStorage-based).
   Loaded on EVERY page, right after js/products-data.js.

   Storage shape: [{ id: "tallow-balm", qty: 2 }, ...]
   Works across pages/reloads with no backend needed. Any page
   can call window.RosaleighCart.addToCart(id, qty) and every
   other page will see the updated cart + header count.
   ========================================================= */
(function(){
  const CART_KEY = 'rosaleigh-cart';

  function getCart(){
    try {
      const raw = localStorage.getItem(CART_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch(e){
      return [];
    }
  }

  function saveCart(cart){
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch(e){ /* localStorage unavailable — cart just won't persist */ }
    updateHeaderBubble();
  }

  function addToCart(productId, qty){
    qty = qty || 1;
    if(!window.PRODUCTS || !window.PRODUCTS[productId]) return;
    const cart = getCart();
    const existing = cart.find(item => item.id === productId);
    if(existing){
      existing.qty += qty;
    } else {
      cart.push({ id: productId, qty: qty });
    }
    saveCart(cart);
  }

  function removeFromCart(productId){
    const cart = getCart().filter(item => item.id !== productId);
    saveCart(cart);
  }

  function setQty(productId, qty){
    const cart = getCart();
    const item = cart.find(i => i.id === productId);
    if(!item) return;
    item.qty = Math.max(1, qty);
    saveCart(cart);
  }

  function getCartCount(){
    return getCart().reduce((sum, item) => sum + item.qty, 0);
  }

  // Merge stored {id, qty} with live product data (name/price/image),
  // skipping any id that no longer exists in the catalog.
  function getCartDetailed(){
    const products = window.PRODUCTS || {};
    return getCart()
      .filter(item => products[item.id])
      .map(item => Object.assign({}, products[item.id], { id: item.id, qty: item.qty }));
  }

  function getCartTotal(){
    return getCartDetailed().reduce((sum, item) => sum + item.price * item.qty, 0);
  }

  function clearCart(){
    saveCart([]);
  }

  function updateHeaderBubble(){
    const count = getCartCount();
    // FIX: this now explicitly shows/hides the badge every time it runs,
    // instead of only writing the number. Previously, header.js hid the
    // badge once on page load if it read "0", and this function only ever
    // updated textContent — so if that hide ran before this set a real
    // (>0) count, the badge stayed invisible even with items in the cart.
    // Making this the single source of truth for both the number and the
    // visibility removes that load-order dependency entirely.
    document.querySelectorAll('.cart-bubble, .cart-bubble-mobile').forEach(function(el){
      el.textContent = count;
      el.style.display = count > 0 ? '' : 'none';
    });
  }

  // Run on every page load so the header count is always accurate,
  // even on pages that never touch the cart directly.
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', updateHeaderBubble);
  } else {
    updateHeaderBubble();
  }

  window.RosaleighCart = {
    getCart: getCart,
    addToCart: addToCart,
    removeFromCart: removeFromCart,
    setQty: setQty,
    getCartCount: getCartCount,
    getCartDetailed: getCartDetailed,
    getCartTotal: getCartTotal,
    clearCart: clearCart,
    updateHeaderBubble: updateHeaderBubble
  };
})();
