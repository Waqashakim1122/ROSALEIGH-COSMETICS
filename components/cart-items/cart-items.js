// CART ITEMS + CART SUMMARY shared behaviour (qty stepper, remove row, recalc totals)
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
  document.getElementById('sum-subtotal').textContent = '$' + subtotal.toFixed(2);
  document.getElementById('sum-tax').textContent = '$' + tax.toFixed(2);
  document.getElementById('sum-total').textContent = '$' + (subtotal + tax).toFixed(2);
  const bubble = document.querySelector('.cart-bubble');
  let count = 0;
  document.querySelectorAll('.row-qty').forEach(q => count += parseInt(q.textContent));
  if(bubble) bubble.textContent = count;
  if(subtotal === 0){
    document.getElementById('cart-items-wrap').innerHTML = `
      <div class="cart-empty">
        <div class="ce-icon">🛒</div>
        <h3 style="margin-bottom:12px;">Your cart is empty</h3>
        <p style="color:var(--muted);margin-bottom:28px;">Looks like you haven't added anything yet.</p>
        <a href="shop.html"><button class="btn-primary">Start Shopping</button></a>
      </div>`;
  }
}
function rowQty(btn, delta){
  const span = btn.parentElement.querySelector('.row-qty');
  let val = Math.max(1, parseInt(span.textContent) + delta);
  span.textContent = val;
  calcTotals();
}
function removeRow(el){
  el.closest('.cart-row').remove();
  calcTotals();
}
calcTotals();
