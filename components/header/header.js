/**
 * Rosaleigh — Header Component Engine
 * Handles premium menu flows, structural layout states, and asset visibility.
 */
(function () {
  'use strict';

  // ==================== CART BADGE ZERO-STATE ====================
  // FIX: this used to unconditionally hide the badge if it read "0" in the
  // static HTML, regardless of whether cart.js had already written the
  // real count. Depending on script load order, that could hide the badge
  // and leave it hidden forever, since cart.js's old updateHeaderBubble
  // only touched textContent, never display. cart.js now owns showing/
  // hiding the badge as part of updateHeaderBubble, so this just calls
  // into that (falling back to the old one-time behavior only if cart.js
  // isn't loaded on a given page for some reason).
  if (window.RosaleighCart && typeof window.RosaleighCart.updateHeaderBubble === 'function') {
    window.RosaleighCart.updateHeaderBubble();
  } else {
    document.querySelectorAll('.cart-bubble, .cart-bubble-mobile').forEach(function (badge) {
      const count = parseInt(badge.textContent.trim(), 10);
      if (!count || count <= 0) {
        badge.style.display = 'none';
      }
    });
  }

  // ==================== ACTIVE LINK HIGH-RANKING HIGHLIGHT ====================
  const currentPage = location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('.nav-left a, .nav-right a').forEach(function (link) {
    const href = link.getAttribute('href');
    if (!href) return;
    const hrefPage = href.split('#')[0];
    if (hrefPage === currentPage) {
      link.classList.add('active');
    }
  });

  // ==================== SCROLL INTERACTION MATRIX ====================
  const siteHeader = document.getElementById('site-header');
  if (siteHeader) {
    // Keep --header-h in sync with the header's real rendered height, since
    // #site-header.header-hidden (in header.css) hides the header by
    // translating it up by exactly this custom property's value.
    function setHeaderHeightVar() {
      document.documentElement.style.setProperty('--header-h', siteHeader.offsetHeight + 'px');
    }
    setHeaderHeightVar();
    window.addEventListener('resize', setHeaderHeightVar);

    let lastScrollY = window.scrollY;
    let ticking = false;
    const HIDE_THRESHOLD = 10; // ignores tiny jitter scrolls (trackpads, etc.)

    function updateHeaderOnScroll() {
      const currentScrollY = window.scrollY;
      const diff = currentScrollY - lastScrollY;

      // Box-shadow: on once the page has scrolled a little, off at the top.
      siteHeader.style.boxShadow = currentScrollY > 30
        ? '0 4px 24px rgba(31, 53, 42, 0.08)'
        : 'none';

      // Hide-on-scroll-down / reveal-on-scroll-up, using .header-hidden
      // from header.css. Never hide while the mobile drawer is open, so
      // the drawer's own header/close button stays reachable.
      if (!isDrawerOpen) {
        if (currentScrollY <= 0) {
          siteHeader.classList.remove('header-hidden'); // always show at the very top
        } else if (diff > HIDE_THRESHOLD) {
          siteHeader.classList.add('header-hidden'); // scrolling down -> hide
        } else if (diff < -HIDE_THRESHOLD) {
          siteHeader.classList.remove('header-hidden'); // scrolling up -> show
        }
      }

      lastScrollY = currentScrollY;
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(updateHeaderOnScroll);
        ticking = true;
      }
    }, { passive: true });
  }

  // ==================== DRAWER CONTROL FLUIDITY ====================
  const menuToggle = document.getElementById('menu-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerBackdrop = document.getElementById('mobile-drawer-backdrop');
  const drawerCloseBtn = document.getElementById('drawer-close');

  if (!menuToggle || !mobileDrawer || !drawerBackdrop) return;

  let isDrawerOpen = false;

  function openDrawer() {
    isDrawerOpen = true;
    mobileDrawer.classList.add('open');
    drawerBackdrop.classList.add('open');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('drawer-open');

    // Make sure the header is visible (not scrolled-away) while the drawer is open.
    if (siteHeader) siteHeader.classList.remove('header-hidden');

    const firstFocusable = mobileDrawer.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (firstFocusable) {
      setTimeout(() => firstFocusable.focus(), 50);
    }
  }

  function closeDrawer() {
    isDrawerOpen = false;
    mobileDrawer.classList.remove('open');
    drawerBackdrop.classList.remove('open');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('drawer-open');

    menuToggle.focus();

    document.querySelectorAll('.drawer-parent').forEach(function (btn) {
      btn.setAttribute('aria-expanded', 'false');
    });
  }

  menuToggle.addEventListener('click', function (e) {
    e.stopPropagation();
    if (isDrawerOpen) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  drawerBackdrop.addEventListener('click', closeDrawer);

  // NEW: explicit in-drawer close (X) button, since users expect a visible
  // close affordance inside the panel itself, not just the backdrop/hamburger.
  if (drawerCloseBtn) {
    drawerCloseBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      closeDrawer();
    });
  }

  mobileDrawer.querySelectorAll('.drawer-link').forEach(function (link) {
    link.addEventListener('click', closeDrawer);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && isDrawerOpen) {
      event.preventDefault();
      closeDrawer();
    }
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 1024 && isDrawerOpen) {
      closeDrawer();
    }
  });

  // ==================== ACCORDION SLIDE INTERACTION ====================
  mobileDrawer.querySelectorAll('.drawer-parent').forEach(function (button) {
    button.addEventListener('click', function (event) {
      event.stopPropagation();

      const isExpanded = button.getAttribute('aria-expanded') === 'true';

      mobileDrawer.querySelectorAll('.drawer-parent').forEach(function (btn) {
        if (btn !== button) btn.setAttribute('aria-expanded', 'false');
      });

      button.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
    });
  });

  mobileDrawer.querySelectorAll('.drawer-child-link').forEach(function (link) {
    link.addEventListener('click', function () {
      setTimeout(closeDrawer, 200);
    });
  });

  // ==================== LUXURY SEARCH INTEGRATION ====================
  const searchInput = mobileDrawer.querySelector('.drawer-search input');
  if (searchInput) {
    searchInput.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
          window.location.href = 'shop.html?search=' + encodeURIComponent(query);
        }
        closeDrawer();
      }
    });
  }

  // ==================== TOUCH-SWIPE CLEAN DISMISSAL ====================
  let touchStartX = 0;
  let touchCurrentX = 0;
  let isSwiping = false;

  mobileDrawer.addEventListener('touchstart', function (event) {
    if (event.target.closest('.drawer-parent') || event.target.closest('.drawer-children')) {
      return;
    }
    touchStartX = event.touches[0].clientX;
    isSwiping = true;
  }, { passive: true });

  mobileDrawer.addEventListener('touchmove', function (event) {
    if (!isSwiping) return;
    touchCurrentX = event.touches[0].clientX;
  }, { passive: true });

  mobileDrawer.addEventListener('touchend', function () {
    if (!isSwiping) return;
    const swipeDistance = touchStartX - touchCurrentX;
    if (swipeDistance > 70) {
      closeDrawer();
    }
    isSwiping = false;
  });
})();
