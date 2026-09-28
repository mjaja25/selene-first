const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const PAGE = document.body.dataset.page || '';

const money = n => Store.money(n);

function showToast(msg) {
  const t = $('#toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => t.classList.remove('show'), 2400);
}

function starsHTML(r) {
  const full = Math.round(r);
  let out = '<span class="stars" aria-label="' + r + ' out of 5">';
  for (let i = 1; i <= 5; i++) out += '<i class="' + (i <= full ? 'on' : '') + '">★</i>';
  return out + '</span>';
}

function badgeHTML(p) {
  if (!p.tag) return '';
  const cls = p.tag === 'Sale' ? 'is-sale' : p.tag === 'New' ? 'is-new' : '';
  return '<span class="badge ' + cls + '">' + p.tag + '</span>';
}

function productCard(p, extraClass) {
  const wished = Store.isWished(p.id);
  const low = p.stock <= 4;
  return '<article class="card ' + (extraClass || '') + ' reveal" data-cat="' + p.cat + '" data-id="' + p.id + '">' +
    '<div class="card-media">' +
      '<a href="product.html?id=' + p.id + '" class="card-link"><img src="' + p.img + '" alt="' + p.name + '" loading="lazy"></a>' +
      badgeHTML(p) +
      '<button class="wish ' + (wished ? 'is-on' : '') + '" data-wish="' + p.id + '" aria-label="Save to wishlist">&#9825;</button>' +
      '<button class="card-add" data-add="' + p.id + '">Add to bag</button>' +
      (low ? '<span class="low-stock">Only ' + p.stock + ' left</span>' : '') +
    '</div>' +
    '<div class="card-info">' +
      '<a href="product.html?id=' + p.id + '"><h3>' + p.name + '</h3></a>' +
      '<span class="card-cat">' + p.catLabel + ' · ' + p.sub.split('·')[0].trim() + '</span>' +
      '<div class="card-rate">' + starsHTML(p.rating) + '<span>(' + p.reviews.length + ')</span></div>' +
      '<p class="price">' + money(p.price) + (p.mrp > p.price ? '<s>' + money(p.mrp) + '</s>' : '') + '</p>' +
    '</div>' +
  '</article>';
}

function observeReveals(root) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal', root || document).forEach(el => io.observe(el));
}

function updateBadges() {
  const bc = $('#bagCount');
  if (bc) {
    const n = Store.count();
    if (bc.textContent !== String(n)) { bc.textContent = n; bc.classList.add('pop'); setTimeout(() => bc.classList.remove('pop'), 300); }
  }
  const wc = $('#wishCount');
  if (wc) wc.textContent = Store.wish.length;
  const mw = $('#mmWish');
  if (mw) mw.textContent = Store.wish.length;
}

function chromeHTML() {
  return `
  <div class="scrim" id="scrim"></div>
  <aside class="drawer" id="drawer" aria-label="Shopping bag">
    <div class="drawer-head"><h3>Your bag <span id="drawerCount"></span></h3><button class="x" id="drawerClose" aria-label="Close">&times;</button></div>
    <div class="drawer-body" id="drawerBody"></div>
    <div class="drawer-foot" id="drawerFoot"></div>
  </aside>
  <div class="search-panel" id="searchPanel">
    <div class="search-inner">
      <div class="search-bar">
        <input type="search" id="searchInput" placeholder="Search rings, necklaces, gifts…" aria-label="Search products" autocomplete="off">
        <button class="x" id="searchClose" aria-label="Close search">&times;</button>
      </div>
      <div class="search-sugs" id="searchSugs"></div>
      <div class="search-results grid" id="searchResults"></div>
    </div>
  </div>
  <div class="quick" id="quick">
    <div class="quick-card">
      <button class="x quick-x" id="quickClose" aria-label="Close">&times;</button>
      <div class="quick-media"><img id="quickImg" src="" alt=""></div>
      <div class="quick-info">
        <p class="card-cat" id="quickCat"></p>
        <h3 id="quickName"></h3>
        <p class="price" id="quickPrice"></p>
        <div class="opt-head"><span id="quickOptLabel">Choose an option</span></div>
        <div class="opt-vals" id="quickSizes"></div>
        <p class="opt-hint" id="quickHint" hidden>Please make a selection.</p>
        <div class="pdp-buy">
          <div class="qty big" id="quickQty"><button data-step="-1" aria-label="Decrease">−</button><span id="quickQtyN">1</span><button data-step="1" aria-label="Increase">+</button></div>
          <button class="btn btn-solid" id="quickAdd">Add to bag</button>
        </div>
        <a class="link-btn" id="quickLink" href="#">View full details</a>
      </div>
    </div>
  </div>
  <div class="toast" id="toast">Added to bag</div>`;
}

function renderDrawer() {
  const body = $('#drawerBody'), foot = $('#drawerFoot');
  if (!body) return;
  const items = Store.cart;
  $('#drawerCount').textContent = items.length ? '(' + Store.count() + ')' : '';
  if (!items.length) {
    body.innerHTML = '<div class="empty"><span class="empty-mark">✦</span><p>Your bag is empty.</p><a class="btn btn-line" href="shop.html">Shop the edit</a></div>';
    foot.innerHTML = '';
    return;
  }
  body.innerHTML = items.map(i =>
    '<div class="d-line" data-id="' + i.id + '" data-size="' + i.size + '">' +
      '<a href="product.html?id=' + i.id + '"><img src="' + i.product.img + '" alt=""></a>' +
      '<div class="d-info"><a href="product.html?id=' + i.id + '"><strong>' + i.product.name + '</strong></a>' +
        '<span class="d-size">' + (i.size ? 'Size ' + i.size : '') + '</span>' +
        '<div class="qty"><button data-dq="-1" aria-label="Decrease">−</button><span>' + i.qty + '</span><button data-dq="1" aria-label="Increase">+</button></div>' +
      '</div>' +
      '<div class="d-right"><span class="d-line-price">' + money(i.line) + '</span><button class="d-rm" data-drm aria-label="Remove">&times;</button></div>' +
    '</div>').join('');
  foot.innerHTML =
    '<div class="d-sum"><span>Subtotal</span><strong>' + money(Store.subtotal()) + '</strong></div>' +
    '<p class="d-note">' + (Store.shipping() === 0 ? 'Shipping free on this order ✦' : 'Free shipping over ' + money(FREE_SHIP_THRESHOLD)) + '</p>' +
    '<div class="d-actions"><a class="btn btn-line" href="cart.html">View bag</a><a class="btn btn-solid" href="checkout.html">Checkout</a></div>';
}

function openDrawer(open) {
  const d = $('#drawer'), s = $('#scrim');
  if (!d) return;
  d.classList.toggle('open', open);
  s.classList.toggle('on', open);
  document.body.classList.toggle('lock', open);
  if (open) renderDrawer();
}

function renderSearch(q) {
  const sugs = $('#searchSugs'), res = $('#searchResults');
  const term = (q || '').trim().toLowerCase();
  if (!term) {
    res.innerHTML = '';
    sugs.innerHTML = '<span class="sug-label">Popular</span>' + ['Rings', 'Necklaces', 'Huggies', 'Tennis bracelet', 'Gifting']
      .map(s => '<button class="sug" data-sug="' + s + '">' + s + '</button>').join('');
    return;
  }
  sugs.innerHTML = '';
  const hits = PRODUCTS.filter(p => (p.name + ' ' + p.cat + ' ' + p.catLabel + ' ' + p.sub).toLowerCase().includes(term));
  res.innerHTML = hits.length
    ? hits.map(p => productCard(p, 'card-sm')).join('')
    : '<p class="search-empty">No pieces match “' + term + '”. Try “ring”, “gold” or “bracelet”.</p>';
  $$('.reveal', res).forEach(el => el.classList.add('in'));
}

function openSearch(open) {
  const p = $('#searchPanel'), s = $('#scrim');
  if (!p) return;
  p.classList.toggle('open', open);
  s.classList.toggle('on', open || ($('#drawer') && $('#drawer').classList.contains('open')));
  document.body.classList.toggle('lock', open);
  if (open) { renderSearch(''); setTimeout(() => $('#searchInput').focus(), 60); }
}

function initChrome() {
  document.body.insertAdjacentHTML('beforeend', chromeHTML());

  const nav = $('#nav');
  addEventListener('scroll', () => nav && nav.classList.toggle('is-scrolled', scrollY > 30), { passive: true });

  const burger = $('#burger'), navLinks = $('#navLinks');
  if (burger) burger.addEventListener('click', () => navLinks.classList.toggle('open'));
  if (navLinks && !$('.only-mobile', navLinks)) {
    navLinks.insertAdjacentHTML('beforeend',
      '<a href="wishlist.html" class="only-mobile">Saved <span class="mm-count" id="mmWish">' + Store.wish.length + '</span></a>' +
      '<button type="button" class="only-mobile" id="mmSearch">Search</button>');
    $('#mmSearch').addEventListener('click', () => { navLinks.classList.remove('open'); openSearch(true); });
  }
  $$('#navLinks a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

  const bagBtn = $('#bagBtn');
  if (bagBtn) bagBtn.addEventListener('click', e => { e.preventDefault(); openDrawer(true); });
  $('#drawerClose').addEventListener('click', () => openDrawer(false));

  const searchBtn = $('#searchBtn');
  if (searchBtn) searchBtn.addEventListener('click', () => openSearch(true));
  $('#searchClose').addEventListener('click', () => openSearch(false));

  $('#scrim').addEventListener('click', () => { openDrawer(false); openSearch(false); closeQuick(); });
  addEventListener('keydown', e => {
    if (e.key === 'Escape') { openDrawer(false); openSearch(false); closeQuick(); }
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); openSearch(true); }
  });

  let quickProduct = null, quickSize = null, quickQty = 1;

  function openQuick(p) {
    quickProduct = p; quickSize = p.sizes.length === 1 ? p.sizes[0] : null; quickQty = 1;
    $('#quickImg').src = p.img;
    $('#quickImg').alt = p.name;
    $('#quickCat').textContent = p.catLabel + ' · ' + p.sub;
    $('#quickName').textContent = p.name;
    $('#quickPrice').innerHTML = money(p.price) + (p.mrp > p.price ? '<s>' + money(p.mrp) + '</s>' : '');
    $('#quickOptLabel').textContent = p.cat === 'rings' ? 'Size' : p.sizes.length > 1 ? 'Length' : 'Option';
    $('#quickSizes').innerHTML = p.sizes.map(s => `<button class="opt-val ${p.sizes.length === 1 ? 'is-on' : ''}" data-qsize="${s}">${s}</button>`).join('');
    $('#quickQtyN').textContent = '1';
    $('#quickHint').hidden = true;
    $('#quickLink').href = 'product.html?id=' + p.id;
    $('#quick').classList.add('open');
    $('#scrim').classList.add('on');
    document.body.classList.add('lock');
  }

  function closeQuick() {
    const q = $('#quick');
    if (!q || !q.classList.contains('open')) return;
    window.__moveFromWish = null;
    q.classList.remove('open');
    if (!$('#drawer').classList.contains('open') && !$('#searchPanel').classList.contains('open')) {
      $('#scrim').classList.remove('on');
      document.body.classList.remove('lock');
    }
  }

  $('#quickClose').addEventListener('click', closeQuick);
  window.openQuick = openQuick;
  $('#quickSizes').addEventListener('click', e => {
    const b = e.target.closest('[data-qsize]'); if (!b) return;
    quickSize = b.dataset.qsize;
    $$('#quickSizes .opt-val').forEach(v => v.classList.toggle('is-on', v === b));
    $('#quickHint').hidden = true;
  });
  $('#quickQty').addEventListener('click', e => {
    const s = e.target.closest('[data-step]'); if (!s || !quickProduct) return;
    quickQty = Math.max(1, Math.min(quickQty + Number(s.dataset.step), quickProduct.stock));
    $('#quickQtyN').textContent = quickQty;
  });
  $('#quickAdd').addEventListener('click', () => {
    if (!quickProduct) return;
    if (!quickSize) { $('#quickHint').hidden = false; return; }
    Store.add(quickProduct.id, quickSize, quickQty);
    if (window.__moveFromWish === quickProduct.id) {
      window.__moveFromWish = null;
      if (Store.isWished(quickProduct.id)) Store.toggleWish(quickProduct.id);
      showToast(quickProduct.name + ' moved to bag');
    } else {
      showToast(quickProduct.name + ' added to bag');
    }
    closeQuick();
    openDrawer(true);
  });

  const si = $('#searchInput');
  si.addEventListener('input', () => renderSearch(si.value));
  $('#searchSugs').addEventListener('click', e => {
    const b = e.target.closest('[data-sug]'); if (!b) return;
    si.value = b.dataset.sug; renderSearch(si.value); si.focus();
  });

  $('#drawerBody').addEventListener('click', e => {
    const line = e.target.closest('.d-line'); if (!line) return;
    const { id, size } = line.dataset;
    if (e.target.closest('[data-drm]')) { Store.remove(id, size); showToast('Removed from bag'); return; }
    const q = e.target.closest('[data-dq]');
    if (q) {
      const cur = Store.cart.find(i => i.id === id && i.size === size);
      Store.setQty(id, size, cur.qty + Number(q.dataset.dq));
    }
  });

  document.addEventListener('click', e => {
    const add = e.target.closest('[data-add]');
    if (add) {
      e.preventDefault();
      const p = byId(add.dataset.add);
      if (!p) return;
      if (p.stock <= 0) { showToast('Sold out — join the waitlist'); return; }
      const single = p.sizes.length === 1;
      if (!single && PAGE !== 'product') { openQuick(p); return; }
      const size = add.dataset.size || p.sizes[0];
      Store.add(p.id, size, Number(add.dataset.qty) || 1);
      showToast(p.name + ' added to bag');
      openDrawer(true);
      return;
    }
    const wish = e.target.closest('[data-wish]');
    if (wish) {
      e.preventDefault();
      const on = Store.toggleWish(wish.dataset.wish);
      showToast(on ? 'Saved to wishlist' : 'Removed from wishlist');
      $$('[data-wish="' + wish.dataset.wish + '"]').forEach(b => b.classList.toggle('is-on', on));
    }
  });

  const cta = $('#ctaForm');
  if (cta) cta.addEventListener('submit', e => {
    e.preventDefault();
    e.target.reset();
    localStorage.setItem('selene_news', '1');
    const note = $('#ctaNote');
    if (note) note.textContent = 'Welcome to the list — your first order ships free ✦';
    showToast('You’re on the list');
  });

  Store.subscribe(() => { updateBadges(); if ($('#drawer').classList.contains('open')) renderDrawer(); });
}

function initPage() {
  initChrome();
  observeReveals();
  const fn = PAGES[PAGE];
  if (fn) fn();
}

const PAGES = {};
