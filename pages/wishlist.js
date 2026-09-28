PAGES.wishlist = () => {
  const grid = $('#wishGrid'), empty = $('#wishEmpty');

  function render() {
    const items = Store.wish;
    grid.hidden = !items.length;
    empty.hidden = items.length > 0;
    grid.innerHTML = items.map(p => productCard(p) +
      `<div class="wish-tools">
        <button class="link-btn" data-moveall="${p.id}">Move to bag</button>
        <button class="link-btn" data-wish="${p.id}">Remove</button>
      </div>`).join('');
    $$('.reveal', grid).forEach(el => el.classList.add('in'));
  }

  grid.addEventListener('click', e => {
    const b = e.target.closest('[data-moveall]'); if (!b) return;
    const p = byId(b.dataset.moveall);
    if (!p) return;
    if (p.sizes.length > 1) { window.__moveFromWish = p.id; window.openQuick(p); return; }
    Store.add(p.id, p.sizes[0], 1);
    Store.toggleWish(p.id);
    showToast(p.name + ' moved to bag');
    openDrawer(true);
  });

  Store.subscribe(render);
  render();
};
