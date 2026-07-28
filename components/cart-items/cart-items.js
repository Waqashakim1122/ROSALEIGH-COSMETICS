// CART ITEMS + CART SUMMARY — renders the real cart (from window.RosaleighCart,
// backed by localStorage) so what shows up here matches whatever the visitor
// actually clicked "Add to Cart" on, on any page of the site.

function renderCartRows(){
  const wrap = document.getElementById('cart-items-wrap');
  const rowsHost = document.getElementById('cart-rows');
  if(!wrap || !rowsHost || !window.RosaleighCart) return;

  const items = window.RosaleighCart.getCartDetailed();

  if(items.length === 0){
    wrap.innerHTML = `
      <div class="cart-empty">
        <div class="ce-icon">🛒</div>
        <h3 style="margin-bottom:12px;">Your cart is empty</h3>
        <p style="color:var(--muted);margin-bottom:28px;">Looks like you haven't added anything yet.</p>
        <a href="shop.html"><button class="btn-primary">Start Shopping</button></a>
      </div>`;
    calcTotals();
    return;
  }

  rowsHost.innerHTML = items.map(item => `
    <div class="cart-row" data-id="${item.id}" data-price="${item.price.toFixed(2)}">
      <div class="cart-prod">
        <div class="cart-thumb"><img loading="lazy" decoding="async" class="theme-img" src="${item.image}" alt="${item.name.replace(/&amp;/g,'&')}"></div>
        <div>
          <div class="cart-pname">${item.name.replace(/&amp;/g,'&')}</div>
          <div class="cart-pvar">${item.size || ''}</div>
          <div class="cart-remove" onclick="removeRow(this)">Remove</div>
        </div>
      </div>
      <div class="cart-price">$${item.price.toFixed(2)}</div>
      <div class="cart-qty">
        <div class="qty-box">
          <button onclick="rowQty(this,-1)">−</button>
          <span class="row-qty">${item.qty}</span>
          <button onclick="rowQty(this,1)">+</button>
        </div>
      </div>
      <div class="cart-total row-total">$${(item.price * item.qty).toFixed(2)}</div>
      <div></div>
    </div>
  `).join('');

  // Re-apply theme-matched images to the freshly injected <img class="theme-img"> tags
  if(window.RosaleighTheme && typeof window.RosaleighTheme.refresh === 'function'){
    window.RosaleighTheme.refresh();
  }

  calcTotals();
}

function calcTotals(){
  let subtotal = 0;
  document.querySelectorAll('.cart-row').forEach(row => {
    const price = parseFloat(row.dataset.price);
    const qty = parseInt(row.querySelector('.row-qty').textContent);
    const total = price * qty;
    row.querySelector('.row-total').textContent = '$' + total.toFixed(2);
    subtotal += total;
  });
  const tax = subtotal * 0.08;
  const subEl = document.getElementById('sum-subtotal');
  const taxEl = document.getElementById('sum-tax');
  const totalEl = document.getElementById('sum-total');
  if(subEl) subEl.textContent = '$' + subtotal.toFixed(2);
  if(taxEl) taxEl.textContent = '$' + tax.toFixed(2);
  if(totalEl) totalEl.textContent = '$' + (subtotal + tax).toFixed(2);
  if(window.RosaleighCart) window.RosaleighCart.updateHeaderBubble();
}

function rowQty(btn, delta){
  const row = btn.closest('.cart-row');
  const id = row.dataset.id;
  const span = row.querySelector('.row-qty');
  const newQty = Math.max(1, parseInt(span.textContent) + delta);
  if(window.RosaleighCart) window.RosaleighCart.setQty(id, newQty);
  span.textContent = newQty;
  calcTotals();
}

function removeRow(el){
  const row = el.closest('.cart-row');
  const id = row.dataset.id;
  if(window.RosaleighCart) window.RosaleighCart.removeFromCart(id);
  row.remove();
  if(document.querySelectorAll('.cart-row').length === 0){
    renderCartRows();
  } else {
    calcTotals();
  }
}

renderCartRows();
