// Single sliding info panel — replaces the old anchored popups.
// Inserted after .collage-stack (photo grid + specimen tag)
// so it never sits inside that box's positioning context and
// can't collide with the pinned specimen tag.

document.querySelectorAll('.ingredient-collage').forEach((collage) => {
  const stack = collage.querySelector('.collage-stack') || collage.querySelector('.collage-grid');
  const buttons = Array.from(collage.querySelectorAll('.img-tag'));
  if (!stack || buttons.length === 0) return;

  const panel = document.createElement('div');
  panel.className = 'tag-info-panel';
  panel.innerHTML = `
    <button class="tag-info-close" type="button" aria-label="Close">&times;</button>
    <div class="tag-info-panel-inner">
      <div class="tag-info-text"></div>
    </div>
  `;
  stack.insertAdjacentElement('afterend', panel);

  const text = panel.querySelector('.tag-info-text');
  const closeBtn = panel.querySelector('.tag-info-close');

  let activeBtn = null;

  function closePanel() {
    panel.classList.remove('is-open');
    buttons.forEach((b) => b.setAttribute('aria-expanded', 'false'));
    activeBtn = null;
  }

  function openWith(btn) {
    const note = btn.querySelector('.tag-note');
    if (!note) return;
    const title = note.querySelector('h4');
    const desc = note.querySelector('p');

    text.innerHTML = '';
    if (title) text.appendChild(title.cloneNode(true));
    if (desc) text.appendChild(desc.cloneNode(true));

    buttons.forEach((b) => b.setAttribute('aria-expanded', 'false'));
    btn.setAttribute('aria-expanded', 'true');
    panel.classList.add('is-open');
    activeBtn = btn;
  }

  buttons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (btn === activeBtn && panel.classList.contains('is-open')) {
        closePanel();
      } else {
        openWith(btn);
      }
    });
  });

  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closePanel();
  });
});