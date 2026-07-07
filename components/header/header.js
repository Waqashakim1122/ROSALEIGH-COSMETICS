/**
 * Rosaleigh — Header Component Engine
 * Handles premium menu flows, structural layout states, and asset visibility.
 */
(function () {
  'use strict';

  // ==================== CART BADGE ZERO-STATE ====================
  // A "0" badge on an empty cart looks unfinished, so hide it until there's
  // at least one item. Re-run this if/when cart state updates dynamically.
  document.querySelectorAll('.cart-bubble, .cart-bubble-mobile').forEach(function (badge) {
    const count = parseInt(badge.textContent.trim(), 10);
    if (!count || count <= 0) {
      badge.style.display = 'none';
    }
  });

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
    window.addEventListener('scroll', function () {
      const hasScrolled = window.scrollY > 30;
      siteHeader.style.boxShadow = hasScrolled
        ? '0 4px 24px rgba(31, 53, 42, 0.08)'
        : 'none';
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