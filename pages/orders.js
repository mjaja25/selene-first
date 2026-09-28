PAGES.orders = () => {
  const root = $('#ordersRoot');
  const orders = Store.orders;

  if (!orders.length) {
    root.innerHTML = `<div class="empty tall">
      <span class="empty-mark">✦</span>
      <h3>No orders yet</h3>
      <p>When you place an order it will show up here with its tracking details.</p>
      <a class="btn btn-solid" href="shop.html">Start shopping</a>
    </div>`;
    return;
  }

  const fmt = d => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  root.innerHTML = `<div class="order-list">` + orders.map(o => `
    <details class="order-card reveal">
      <summary>
        <div class="oc-id"><strong>${o.id}</strong><span>${fmt(o.date)} · ${o.items.length} ${o.items.length === 1 ? 'piece' : 'pieces'}</span></div>
        <div class="oc-thumbs">${o.items.slice(0, 4).map(i => `<img src="${i.img}" alt="">`).join('')}${o.items.length > 4 ? `<span class="oc-more">+${o.items.length - 4}</span>` : ''}</div>
        <div class="oc-total"><strong>${money(o.total)}</strong><span class="oc-status">Confirmed</span></div>
      </summary>
      <div class="oc-body">
        <div class="co-items">
          ${o.items.map(i => `<div class="co-item">
            <img src="${i.img}" alt="">
            <div><strong>${i.name}</strong><span>${i.size ? 'Size ' + i.size + ' · ' : ''}Qty ${i.qty} · ${money(i.price)}</span>
            <a class="link-btn" href="product.html?id=${i.id}">View piece</a></div>
            <b>${money(i.line)}</b>
          </div>`).join('')}
        </div>
        <div class="oc-meta">
          <div><h4>Delivered to</h4><p>${o.name}<br>${o.address}<br>${o.city}, ${o.state} — ${o.pincode}</p></div>
          <div><h4>Payment</h4><p>${o.payment || o.method}<br>${o.email}</p></div>
          <div><h4>Summary</h4>
            <p>Subtotal ${money(o.subtotal)}<br>${o.discount ? 'Discount −' + money(o.discount) + '<br>' : ''}Shipping ${o.shipping === 0 ? 'Free' : money(o.shipping)}<br><strong>Total ${money(o.total)}</strong></p>
          </div>
        </div>
        <div class="oc-actions">
          <a class="btn btn-line" href="order.html?id=${encodeURIComponent(o.id)}">View confirmation</a>
          <button class="btn btn-solid" data-reorder='${encodeURIComponent(JSON.stringify(o.items.map(i => ({ id: i.id, size: i.size, qty: i.qty }))))}'>Buy again</button>
        </div>
      </div>
    </details>`).join('') + `</div>`;

  root.addEventListener('click', e => {
    const b = e.target.closest('[data-reorder]'); if (!b) return;
    const list = JSON.parse(decodeURIComponent(b.dataset.reorder));
    let added = 0;
    list.forEach(i => { const p = byId(i.id); if (p && p.stock > 0) { Store.add(i.id, i.size, i.qty); added++; } });
    showToast(added ? added + ' piece' + (added > 1 ? 's' : '') + ' added to bag' : 'Those pieces are sold out');
    if (added) openDrawer(true);
  });

  observeReveals(root);
};
