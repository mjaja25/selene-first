PAGES.order = () => {
  const root = $('#orderRoot');
  const id = new URLSearchParams(location.search).get('id') || sessionStorage.getItem('selene_last_order');
  const o = Store.order(id);
  document.title = (o ? 'Order ' + o.id : 'Orders') + ' — SELENE';

  if (!o) {
    root.innerHTML = `<section class="page-head"><p class="eyebrow">Nothing here yet</p>
      <h1>No order <em>found</em></h1>
      <p class="page-sub">This link does not match an order on this device.</p>
      <div class="hero-cta" style="justify-content:center">
        <a class="btn btn-solid" href="shop.html">Shop the edit</a>
        <a class="btn btn-line" href="orders.html">Order history</a>
      </div></section>`;
    return;
  }

  const placed = new Date(o.date);
  const eta = new Date(placed.getTime() + 4 * 864e5);
  const fmt = d => d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long' });
  const steps = ['Confirmed', 'Packed', 'Shipped', 'Out for delivery', 'Delivered'];

  root.innerHTML = `
    <section class="confirm">
      <div class="confirm-mark reveal in">✓</div>
      <p class="eyebrow">Thank you, ${(o.name || '').split(' ')[0] || 'friend'}</p>
      <h1>Your order is <em>confirmed.</em></h1>
      <p class="page-sub">A confirmation is on its way to <strong>${o.email || ''}</strong>. We pack every order in the matte-black keepsake box.</p>

      <div class="confirm-meta reveal in">
        <div><span>Order number</span><strong>${o.id}</strong></div>
        <div><span>Placed</span><strong>${fmt(placed)}</strong></div>
        <div><span>Arrives by</span><strong>${fmt(eta)}</strong></div>
        <div><span>Paying with</span><strong>${o.payment || o.method || '—'}</strong></div>
      </div>

      <div class="track reveal in">
        ${steps.map((s, i) => `<div class="track-step ${i === 0 ? 'is-done is-now' : ''}"><i></i><span>${s}</span></div>`).join('')}
      </div>
    </section>

    <section class="order-sheet reveal in">
      <div class="order-col">
        <h3>Delivery address</h3>
        <p><strong>${o.name}</strong><br>${o.address}<br>${o.city}, ${o.state} — ${o.pincode}<br>${o.phone}</p>
        ${o.notes ? `<p class="order-note">“${o.notes}”</p>` : ''}

        <h3>Items</h3>
        <div class="co-items">
          ${(o.items || []).map(i => `<div class="co-item">
            <img src="${i.img}" alt="">
            <div><strong>${i.name}</strong><span>${i.size ? 'Size ' + i.size + ' · ' : ''}Qty ${i.qty}</span>
            <a class="link-btn" href="product.html?id=${i.id}">Buy again</a></div>
            <b>${money(i.line)}</b>
          </div>`).join('')}
        </div>
      </div>

      <div class="order-col">
        <div class="sum-card">
          <h3>Payment summary</h3>
          <div class="sum-rows">
            <div><span>Subtotal</span><span>${money(o.subtotal)}</span></div>
            ${o.discount ? `<div class="is-disc"><span>Discount${o.promo ? ' · ' + o.promo : ''}</span><span>−${money(o.discount)}</span></div>` : ''}
            <div><span>Shipping</span><span>${o.shipping === 0 ? 'Free' : money(o.shipping)}</span></div>
            <div class="sum-total"><span>Paid</span><strong>${money(o.total)}</strong></div>
          </div>
          <p class="sum-note">Need to change something? DM <a href="https://www.instagram.com/selene._co" target="_blank" rel="noopener">@selene._co</a> within 2 hours of ordering.</p>
        </div>
        <div class="confirm-cta">
          <a class="btn btn-solid full" href="shop.html">Continue shopping</a>
          <a class="btn btn-line full" href="orders.html">View all orders</a>
        </div>
      </div>
    </section>

    <section class="cta">
      <img class="cta-bg" src="assets/img/fabric.jpg" alt="" aria-hidden="true" loading="lazy">
      <div class="cta-inner reveal">
        <p class="eyebrow">Join the list</p>
        <h2>First look, <em>first order free.</em></h2>
        <form class="cta-form" id="ctaForm">
          <input type="email" placeholder="your@email.com" required aria-label="Email">
          <button type="submit">Notify me</button>
        </form>
        <p class="cta-note" id="ctaNote">No spam — only new drops and private restocks.</p>
      </div>
    </section>`;

  observeReveals(root);
};
