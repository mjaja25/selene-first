PAGES.checkout = () => {
  if (!Store.cart.length) { location.replace('cart.html'); return; }

  const form = $('#checkoutForm'), side = $('#checkoutSide');
  let step = 1;

  const val = {
    name: v => v.trim().length >= 2 || 'Please enter your full name',
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Enter a valid email address',
    phone: v => /^\d{10}$/.test(v.replace(/\D/g, '')) || 'Enter a 10-digit mobile number',
    pincode: v => /^\d{6}$/.test(v.replace(/\D/g, '')) || 'Enter a 6-digit pincode',
    address: v => v.trim().length >= 6 || 'Enter your full address',
    city: v => v.trim().length >= 2 || 'Enter your city',
    state: v => !!v || 'Select your state',
    upi: v => /^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test(v.trim()) || 'Enter a valid UPI ID (name@bank)',
    card: v => /^\d{16}$/.test(v.replace(/\D/g, '')) || 'Enter a 16-digit card number',
    expiry: v => {
      const m = v.trim().match(/^(\d{2})\/(\d{2})$/);
      if (!m) return 'Use MM/YY format';
      const mm = Number(m[1]), yy = 2000 + Number(m[2]);
      if (mm < 1 || mm > 12) return 'Invalid month';
      const now = new Date();
      if (yy < now.getFullYear() || (yy === now.getFullYear() && mm < now.getMonth() + 1)) return 'Card has expired';
      return true;
    },
    cvv: v => /^\d{3,4}$/.test(v.trim()) || 'Enter the 3-digit CVV',
    cardname: v => v.trim().length >= 2 || 'Name as printed on the card',
    bank: v => !!v || 'Select your bank'
  };

  function checkField(el) {
    const rule = val[el.name];
    if (!rule) return true;
    const res = rule(el.value);
    const err = el.parentElement.querySelector('.err');
    if (res === true) { el.classList.remove('bad'); if (err) err.textContent = ''; return true; }
    el.classList.add('bad');
    if (err) err.textContent = res;
    return false;
  }

  function method() { return form.querySelector('input[name="method"]:checked').value; }

  function fieldsOf(block) { return $$('input[name], select[name]', block).filter(el => el.type !== 'radio' && el.type !== 'checkbox' && el.name !== 'notes'); }

  function validateStep(n) {
    const block = $('#block' + n);
    if (n === 3) {
      const terms = form.querySelector('input[name="terms"]');
      if (!terms.checked) { $('#termsErr').textContent = 'Please accept the policy to continue'; return false; }
      $('#termsErr').textContent = '';
      return true;
    }
    let ok = true;
    fieldsOf(block).forEach(el => { if (el.closest('.pay-pane') && el.closest('.pay-pane').hidden) return; if (!checkField(el)) ok = false; });
    if (!ok) { const bad = block.querySelector('.bad'); if (bad) bad.focus({ preventScroll: false }); }
    return ok;
  }

  function go(n) {
    if (n > step && !validateStep(step)) return;
    step = n;
    [1, 2, 3].forEach(i => { $('#block' + i).hidden = i !== n; });
    $$('#steps li').forEach(li => li.classList.toggle('is-on', Number(li.dataset.step) <= n));
    if (n === 3) renderReview();
    $('#block' + n).scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  form.addEventListener('click', e => {
    const g = e.target.closest('[data-goto]');
    if (g) go(Number(g.dataset.goto));
  });

  form.addEventListener('change', e => {
    if (e.target.name === 'method') {
      $$('.pay-pane').forEach(p => p.hidden = p.id !== 'pane-' + e.target.value);
      $$('[name="upi"],[name="card"],[name="expiry"],[name="cvv"],[name="cardname"],[name="bank"]').forEach(el => el.classList.remove('bad'));
      $$('.pay-pane .err').forEach(el => el.textContent = '');
    }
  });

  form.addEventListener('input', e => { if (e.target.name && e.target.classList.contains('bad')) checkField(e.target); });

  function summaryHTML() {
    return `
      <div class="sum-card">
        <h3>Your order</h3>
        <div class="co-items">
          ${Store.cart.map(i => `<div class="co-item">
            <img src="${i.product.img}" alt="">
            <div><strong>${i.product.name}</strong><span>${i.size ? 'Size ' + i.size + ' · ' : ''}Qty ${i.qty}</span></div>
            <b>${money(i.line)}</b>
          </div>`).join('')}
        </div>
        <div class="sum-rows">
          <div><span>Subtotal</span><span>${money(Store.subtotal())}</span></div>
          ${Store.discount() ? `<div class="is-disc"><span>Discount · ${Store.promo.code}</span><span>−${money(Store.discount())}</span></div>` : ''}
          <div><span>Shipping</span><span>${Store.shipping() === 0 ? 'Free' : money(Store.shipping())}</span></div>
          <div class="sum-total"><span>Total</span><strong>${money(Store.total())}</strong></div>
        </div>
        <a class="link-btn" href="cart.html">Edit bag</a>
        <p class="sum-note">✦ Free shipping on your first order<br>✦ 7-day returns on unworn pieces<br>✦ Tarnish-resistant, guaranteed</p>
      </div>`;
  }

  function renderReview() {
    const d = Object.fromEntries(new FormData(form).entries());
    const payLabel = { UPI: 'UPI · ' + (d.upi || ''), Card: 'Card ending ' + (d.card || '').replace(/\D/g, '').slice(-4), Netbanking: 'Netbanking · ' + (d.bank || ''), COD: 'Cash on delivery' }[d.method];
    $('#reviewSummary').innerHTML = `
      <div class="rv-grid">
        <div><h4>Deliver to</h4><p><strong>${d.name}</strong><br>${d.address}<br>${d.city}, ${d.state} — ${d.pincode}<br>${d.phone} · ${d.email}</p><button type="button" class="link-btn" data-goto="1">Edit</button></div>
        <div><h4>Payment</h4><p>${payLabel}</p><button type="button" class="link-btn" data-goto="2">Edit</button></div>
      </div>
      <div class="rv-items">${Store.cart.map(i => `<div class="co-item"><img src="${i.product.img}" alt=""><div><strong>${i.product.name}</strong><span>${i.size ? 'Size ' + i.size + ' · ' : ''}Qty ${i.qty}</span></div><b>${money(i.line)}</b></div>`).join('')}</div>
      <div class="sum-rows">
        <div><span>Subtotal</span><span>${money(Store.subtotal())}</span></div>
        ${Store.discount() ? `<div class="is-disc"><span>Discount · ${Store.promo.code}</span><span>−${money(Store.discount())}</span></div>` : ''}
        <div><span>Shipping</span><span>${Store.shipping() === 0 ? 'Free' : money(Store.shipping())}</span></div>
        <div class="sum-total"><span>Amount payable</span><strong>${money(Store.total())}</strong></div>
      </div>`;
    side.innerHTML = summaryHTML();
  }

  side.innerHTML = summaryHTML();
  renderReview();

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!validateStep(3)) return;

    const d = Object.fromEntries(new FormData(form).entries());
    const btn = $('#placeBtn');
    btn.disabled = true;
    btn.textContent = 'Placing order…';

    setTimeout(() => {
      const order = Store.placeOrder({
        name: d.name, email: d.email, phone: d.phone,
        address: d.address, city: d.city, state: d.state, pincode: d.pincode,
        notes: d.notes || '',
        method: d.method,
        payment: { UPI: 'UPI · ' + d.upi, Card: 'Card ending ' + d.card.replace(/\D/g, '').slice(-4), Netbanking: 'Netbanking · ' + d.bank, COD: 'Cash on delivery' }[d.method]
      });
      sessionStorage.setItem('selene_last_order', order.id);
      location.href = 'order.html?id=' + encodeURIComponent(order.id);
    }, 700);
  });
};
