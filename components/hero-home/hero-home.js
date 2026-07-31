(function () {
  const banner = document.querySelector('.hero-banner');
  if (!banner) return;

  const slides = Array.from(banner.querySelectorAll('.hero-slide'));
  const dots = Array.from(banner.querySelectorAll('.hero-dot'));
  const prevBtn = banner.querySelector('.hero-arrow-prev');
  const nextBtn = banner.querySelector('.hero-arrow-next');

  let current = slides.findIndex((s) => s.classList.contains('is-active'));
  if (current === -1) current = 0;

  const AUTOPLAY_MS = 5000;
  let timer = null;

  function goTo(index) {
    const next = (index + slides.length) % slides.length;
    slides[current].classList.remove('is-active');
    dots[current] && dots[current].classList.remove('is-active');
    dots[current] && dots[current].setAttribute('aria-selected', 'false');

    current = next;

    slides[current].classList.add('is-active');
    dots[current] && dots[current].classList.add('is-active');
    dots[current] && dots[current].setAttribute('aria-selected', 'true');
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAutoplay() {
    stopAutoplay();
    timer = setInterval(next, AUTOPLAY_MS);
  }
  function stopAutoplay() {
    if (timer) clearInterval(timer);
  }

  nextBtn && nextBtn.addEventListener('click', () => { next(); startAutoplay(); });
  prevBtn && prevBtn.addEventListener('click', () => { prev(); startAutoplay(); });
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goTo(i); startAutoplay(); });
  });

  banner.addEventListener('mouseenter', stopAutoplay);
  banner.addEventListener('mouseleave', startAutoplay);

  // Pause when tab is hidden, resume when visible
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopAutoplay();
    else startAutoplay();
  });

  // Respect reduced-motion preference: no autoplay, controls still work
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion) startAutoplay();
})();