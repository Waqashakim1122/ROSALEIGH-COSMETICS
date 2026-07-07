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
  const bubble = document.querySelector('.cart-bubble');
  if(bubble) bubble.textContent = parseInt(bubble.textContent||0) + qty;
  setTimeout(() => { btn.textContent = orig; }, 1800);
}
document.querySelectorAll('.size-pill').forEach(p => {
  p.addEventListener('click', function(){
    document.querySelectorAll('.size-pill').forEach(s => s.classList.remove('active'));
    this.classList.add('active');
  });
});
