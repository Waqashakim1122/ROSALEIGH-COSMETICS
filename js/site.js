/* =========================================================
   SITE.JS — global behaviour, HAR page pe chalta hai.
   Component-specific JS uske apne components/<name>/ folder mein hai.
   ========================================================= */

// ==================== COLOR THEME SWITCHER ====================
// Works site-wide because it lives in site.js (loaded on every page) and
// targets the theme-switcher markup that ships inside the shared header
// component. Valid values match the [data-theme="..."] blocks in base.css.
(function(){
  const STORAGE_KEY = 'rosaleigh-theme';
  const VALID_THEMES = ['default', 'rosegold', 'lavender', 'terracotta', 'vintage'];

  function applyTheme(theme){
    if(theme && theme !== 'default'){
      document.documentElement.setAttribute('data-theme', theme);
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    document.querySelectorAll('.theme-swatch').forEach(function(btn){
      btn.classList.toggle('active', btn.getAttribute('data-set-theme') === (theme || 'default'));
    });
    applyThemedImages(theme);
  }

  // ---- THEMED IMAGES ----
  // Har <img class="theme-img"> ke liye, default src ko yaad rakha jata hai
  // (data-default-src). Jab koi non-default theme choose hoti hai, to yeh
  // "images/..." ko "images/themes/<theme>/..." se replace karke woh image
  // load karne ki koshish karta hai. Agar us theme ke liye woh image abhi
  // maujood nahi (file missing / 404), to chup-chaap original image par
  // wapas gir jata hai — site kabhi tooti hui image nahi dikhati.
  //
  // Naya theme-specific image add karne ke liye: bas original image ka
  // hi naam/size rakh kar usko "images/themes/<theme>/..." wale
  // matching path par rakh do (see images/themes/README.md).
  function applyThemedImages(theme){
    const activeTheme = theme || 'default';
    document.querySelectorAll('img.theme-img').forEach(function(img){
      let defaultSrc = img.getAttribute('data-default-src');
      if(!defaultSrc){
        defaultSrc = img.getAttribute('src');
        img.setAttribute('data-default-src', defaultSrc);
      }

      if(activeTheme === 'default'){
        img.src = defaultSrc;
        return;
      }

      const themedSrc = defaultSrc.replace(/^images\//, 'images/themes/' + activeTheme + '/');
      const probe = new Image();
      probe.onload = function(){
        // Theme ki apni image maujood hai — usse dikhao.
        // (Agar tab tak theme dobara badal chuki hai to skip kar do.)
        if(document.documentElement.getAttribute('data-theme') === activeTheme || (activeTheme === 'default' && !document.documentElement.getAttribute('data-theme'))){
          img.src = themedSrc;
        }
      };
      probe.onerror = function(){
        // Us theme ke liye custom image nahi mili — original par rakho.
        img.src = defaultSrc;
      };
      probe.src = themedSrc;
    });
  }

  // Apply saved theme immediately (before other setup) to avoid a flash
  // of the default palette on load.
  const saved = localStorage.getItem(STORAGE_KEY);
  if(saved && VALID_THEMES.includes(saved)){
    applyTheme(saved);
  } else {
    applyTheme('default');
  }

  document.addEventListener('click', function(e){
    const swatch = e.target.closest('.theme-swatch');
    if(swatch){
      const theme = swatch.getAttribute('data-set-theme');
      applyTheme(theme);
      try { localStorage.setItem(STORAGE_KEY, theme); } catch(err){ /* storage unavailable, theme still applies for this session */ }
      const panel = document.getElementById('theme-panel');
      const toggleBtn = document.getElementById('theme-toggle-btn');
      if(panel && panel.classList.contains('open')){
        panel.classList.remove('open');
        panel.setAttribute('aria-hidden', 'true');
        if(toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
      }
      return;
    }

    const toggleBtn = document.getElementById('theme-toggle-btn');
    const panel = document.getElementById('theme-panel');
    if(!panel || !toggleBtn) return;

    if(toggleBtn.contains(e.target)){
      const isOpen = panel.classList.toggle('open');
      panel.setAttribute('aria-hidden', String(!isOpen));
      toggleBtn.setAttribute('aria-expanded', String(isOpen));
    } else if(!panel.contains(e.target)){
      panel.classList.remove('open');
      panel.setAttribute('aria-hidden', 'true');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape'){
      const panel = document.getElementById('theme-panel');
      const toggleBtn = document.getElementById('theme-toggle-btn');
      if(panel && panel.classList.contains('open')){
        panel.classList.remove('open');
        panel.setAttribute('aria-hidden', 'true');
        if(toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
      }
    }
  });
})();

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
