PAGES.product = () => {
  const id = new URLSearchParams(location.search).get('id');
  const p = byId(id) || PRODUCTS[0];
  const root = $('#pdp');
  document.title = p.name + ' — SELENE';

  const RV_KEY = 'selene_reviews';
  const custom = (() => { try { return JSON.parse(localStorage.getItem(RV_KEY)) || {}; } catch { return {}; } })();
  const saveCustom = () => localStorage.setItem(RV_KEY, JSON.stringify(custom));
  const allReviews = () => [...(custom[p.id] || []), ...p.reviews];
  const avgRating = () => {
    const r = allReviews();
    return r.length ? Math.round((r.reduce((s, x) => s + x.stars, 0) / r.length) * 10) / 10 : p.rating;
  };

  let size = p.sizes.length > 1 ? null : p.sizes[0];
  let qty = 1;
  let shot = 0;

  root.innerHTML = `
    <nav class="crumbs reveal"><a href="index.html">Home</a><span>/</span><a href="shop.html?cat=${p.cat}">${p.catLabel}s</a><span>/</span><em>${p.name}</em></nav>

    <section class="pdp">
      <div class="pdp-gallery reveal">
        <div class="pdp-main"><img id="pdpMain" src="${p.gallery[0]}" alt="${p.name}">
          ${p.tag ? `<span class="badge ${p.tag === 'Sale' ? 'is-sale' : p.tag === 'New' ? 'is-new' : ''}">${p.tag}</span>` : ''}
        </div>
        <div class="pdp-thumbs">${p.gallery.map((g, i) =>
          `<button class="pdp-thumb ${i === 0 ? 'is-on' : ''}" data-shot="${i}"><img src="${g}" alt="View ${i + 1}"></button>`).join('')}</div>
      </div>

      <div class="pdp-info reveal">
        <p class="card-cat">${p.catLabel} · ${p.sub}</p>
        <h1>${p.name}</h1>
        <a class="pdp-rate" href="#reviewsSection">${starsHTML(avgRating())}<span>${avgRating()} · ${allReviews().length} reviews</span></a>

        <p class="pdp-price">${money(p.price)}${p.mrp > p.price ? `<s>${money(p.mrp)}</s><span class="off">${Math.round((1 - p.price / p.mrp) * 100)}% off</span>` : ''}</p>
        <p class="pdp-tax">Inclusive of all taxes · Free shipping on your first order</p>

        <p class="pdp-desc">${p.desc}</p>

        <div class="pdp-opt">
          <div class="opt-head"><span>${p.cat === 'rings' ? 'Size' : p.sizes.length > 1 ? 'Length' : 'Option'}</span>
            ${p.cat === 'rings' ? '<a href="#" class="link-btn" id="sizeGuide">Size guide</a>' : ''}</div>
          <div class="opt-vals" id="sizeVals">
            ${p.sizes.map(s => `<button class="opt-val ${p.sizes.length === 1 ? 'is-on' : ''}" data-size="${s}">${s}</button>`).join('')}
          </div>
          <p class="opt-hint" id="sizeHint" hidden>Please choose a ${p.cat === 'rings' ? 'size' : 'length'}.</p>
        </div>

        <div class="pdp-buy">
          <div class="qty big"><button data-step="-1" aria-label="Decrease">−</button><span id="pdpQty">1</span><button data-step="1" aria-label="Increase">+</button></div>
          <button class="btn btn-solid" id="pdpAdd">Add to bag — ${money(p.price)}</button>
          <button class="wish big-wish ${Store.isWished(p.id) ? 'is-on' : ''}" data-wish="${p.id}" aria-label="Save">${Store.isWished(p.id) ? '♥' : '♡'}</button>
        </div>

        <p class="pdp-stock ${p.stock <= 4 ? 'is-low' : ''}">${p.stock > 0 ? (p.stock <= 4 ? `Only ${p.stock} left in stock` : `In stock · ships in 24h`) : 'Sold out'}</p>

        <ul class="pdp-trust">
          <li><strong>Tarnish-free</strong><span>18K PVD over 316L steel</span></li>
          <li><strong>Skin-safe</strong><span>Hypoallergenic, nickel-free</span></li>
          <li><strong>7-day returns</strong><span>Unworn, original packaging</span></li>
        </ul>

        <div class="acc">
          <details open><summary>Details &amp; materials</summary><ul>${p.details.map(d => `<li>${d}</li>`).join('')}</ul></details>
          <details><summary>Care</summary><p>${p.care}</p></details>
          <details><summary>Shipping &amp; returns</summary>
            <p>Free shipping on your first order and on orders over ${money(FREE_SHIP_THRESHOLD)}. Standard delivery 2–5 business days across India. Unworn pieces can be returned within 7 days.</p>
          </details>
        </div>
      </div>
    </section>`;

  const main = $('#pdpMain');
  $('.pdp-thumbs').addEventListener('click', e => {
    const b = e.target.closest('[data-shot]'); if (!b) return;
    shot = Number(b.dataset.shot);
    main.src = p.gallery[shot];
    $$('.pdp-thumb').forEach(t => t.classList.toggle('is-on', t === b));
  });

  $('#sizeVals').addEventListener('click', e => {
    const b = e.target.closest('[data-size]'); if (!b) return;
    size = b.dataset.size;
    $$('.opt-val').forEach(v => v.classList.toggle('is-on', v === b));
    $('#sizeHint').hidden = true;
  });

  const qtyEl = $('#pdpQty');
  $('.pdp-buy .qty').addEventListener('click', e => {
    const s = e.target.closest('[data-step]'); if (!s) return;
    qty = Math.max(1, Math.min(qty + Number(s.dataset.step), p.stock));
    qtyEl.textContent = qty;
  });

  $('#pdpAdd').addEventListener('click', () => {
    if (p.stock <= 0) { showToast('Sold out — join the waitlist'); return; }
    if (!size) { $('#sizeHint').hidden = false; $('#sizeVals').scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
    Store.add(p.id, size, qty);
    showToast(p.name + ' added to bag');
    openDrawer(true);
  });

  const guide = $('#sizeGuide');
  if (guide) guide.addEventListener('click', e => {
    e.preventDefault();
    showToast('Indian sizing: measure the inner diameter in mm — 16mm ≈ size 8');
  });

  function renderReviews() {
    const list = allReviews();
    $('#reviewList').innerHTML = list.length ? list.map(r => `
      <article class="review">
        <div class="review-top"><span class="avatar">${r.name.trim().charAt(0).toUpperCase()}</span>
          <div><strong>${r.name}</strong><span class="review-date">${r.date}</span></div>
          ${starsHTML(r.stars)}
        </div>
        <p>${r.text}</p>
        ${custom[p.id] && custom[p.id].includes(r) ? '<span class="review-tag">Your review</span>' : ''}
      </article>`).join('')
      : '<p class="muted">No reviews yet — be the first.</p>';
  }
  renderReviews();

  $('#ratePick').addEventListener('click', e => {
    const b = e.target.closest('[data-rate]'); if (!b) return;
    const n = Number(b.dataset.rate);
    $$('#ratePick button').forEach(x => x.classList.toggle('on', Number(x.dataset.rate) <= n));
    $('#ratePick').dataset.value = n;
  });

  $('#reviewForm').addEventListener('submit', e => {
    e.preventDefault();
    const stars = Number($('#ratePick').dataset.value || 5);
    const name = $('#rvName').value.trim(), text = $('#rvText').value.trim();
    if (!name || !text) return;
    (custom[p.id] = custom[p.id] || []).unshift({
      name, stars, text,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    });
    saveCustom();
    e.target.reset();
    $('#ratePick').dataset.value = 0;
    $$('#ratePick button').forEach(x => x.classList.remove('on'));
    renderReviews();
    showToast('Review posted — thank you');
  });

  const related = PRODUCTS.filter(x => x.id !== p.id && x.cat === p.cat)
    .concat(PRODUCTS.filter(x => x.id !== p.id && x.cat !== p.cat))
    .slice(0, 4);
  $('#relatedGrid').innerHTML = related.map(x => productCard(x)).join('');
  observeReveals(root);
  observeReveals($('#relatedSection'));
};
