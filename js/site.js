/* =========================================================
   SITE.JS — global behaviour, HAR page pe chalta hai.
   Component-specific JS uske apne components/<name>/ folder mein hai.
   ========================================================= */

// Scroll progress bar (top of page)
(function(){
  const bar = document.createElement('div');
  bar.id = 'scroll-progress';
  document.body.prepend(bar);
  window.addEventListener('scroll', () => {
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    bar.style.width = scrolled + '%';
  });
})();

// Smooth page-fade on internal link clicks
document.addEventListener('click', function(e){
  const link = e.target.closest('a');
  if(!link) return;
  const href = link.getAttribute('href');
  if(!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:') || link.target === '_blank') return;
  if(href.endsWith('.html') || href === '/' || href === ''){
    e.preventDefault();
    document.body.classList.add('page-exit');
    setTimeout(() => { window.location.href = href; }, 260);
  }
});

// Scroll-reveal animation for any element with class="reveal"
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
}, {threshold:0.1});
document.querySelectorAll('.reveal').forEach(r => io.observe(r));

// Generic "+ Add to Cart" button feedback (product cards on Home / Shop / Product pages)
document.querySelectorAll('.btn-add').forEach(btn => {
  btn.addEventListener('click', function(e){
    e.preventDefault();
    const orig = this.textContent;
    this.textContent = 'Added ✓';
    this.style.background = 'var(--forest)';
    this.style.color = '#FAF7F2';
    const bubble = document.querySelector('.cart-bubble');
    if(bubble) bubble.textContent = parseInt(bubble.textContent||0) + 1;
    setTimeout(() => { this.textContent = orig; this.style.background=''; this.style.color=''; }, 1800);
  });
});
