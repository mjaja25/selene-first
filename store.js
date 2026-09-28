const Store = (() => {
  const KEY = { cart: 'selene_cart', wish: 'selene_wish', orders: 'selene_orders', promo: 'selene_promo', news: 'selene_news', stock: 'selene_stock' };
  const read = (k, f) => { try { return JSON.parse(localStorage.getItem(k)) ?? f; } catch { return f; } };
  const write = (k, v) => localStorage.setItem(k, JSON.stringify(v));

  const stock = read(KEY.stock, {});
  PRODUCTS.forEach(p => { if (typeof stock[p.id] === 'number') p.stock = stock[p.id]; });

  let cart = read(KEY.cart, []);
  let wish = read(KEY.wish, []);
  let orders = read(KEY.orders, []);
  let promo = read(KEY.promo, null);
  const subs = [];

  const emit = () => { write(KEY.cart, cart); write(KEY.wish, wish); subs.forEach(fn => fn()); };
  const money = n => '₹' + Number(n).toLocaleString('en-IN');
  const lineOf = item => { const p = byId(item.id); return p ? { ...item, product: p, line: p.price * item.qty } : null; };

  const api = {
    money,
    products: PRODUCTS,
    subscribe(fn) { subs.push(fn); fn(); return () => subs.splice(subs.indexOf(fn), 1); },
    get cart() { return cart.map(lineOf).filter(Boolean); },
    get wish() { return wish.map(byId).filter(Boolean); },
    get orders() { return orders; },
    get promo() { return promo; },
    count() { return cart.reduce((s, i) => s + i.qty, 0); },
    subtotal() { return api.cart.reduce((s, i) => s + i.line, 0); },
    discount() {
      const sub = api.subtotal();
      if (!promo) return 0;
      if (promo.type === 'percent') return Math.round(sub * promo.value / 100);
      if (promo.type === 'flat') return sub >= (promo.min || 0) ? promo.value : 0;
      return 0;
    },
    shipping() {
      const sub = api.subtotal() - api.discount();
      if (sub <= 0) return 0;
      if (promo && promo.type === 'shipping') return 0;
      if (orders.length === 0) return 0;
      if (sub >= FREE_SHIP_THRESHOLD) return 0;
      return FLAT_SHIPPING;
    },
    total() { return Math.max(0, api.subtotal() - api.discount() + api.shipping()); },
    add(id, size, qty = 1) {
      const p = byId(id); if (!p || p.stock <= 0) return false;
      size = size || (p.sizes && p.sizes[0]) || '';
      const key = i => i.id === id && i.size === size;
      const line = cart.find(key);
      const inBag = line ? line.qty : 0;
      const next = Math.min(inBag + qty, p.stock);
      if (line) line.qty = next; else cart.push({ id, size, qty: next });
      emit();
      return true;
    },
    setQty(id, size, qty) {
      const line = cart.find(i => i.id === id && i.size === size); if (!line) return;
      const p = byId(id);
      line.qty = Math.max(1, Math.min(qty, p ? p.stock : 99));
      emit();
    },
    remove(id, size) { cart = cart.filter(i => !(i.id === id && i.size === size)); emit(); },
    clearBag() { cart = []; emit(); },
    inBag(id, size) { return cart.some(i => i.id === id && (!size || i.size === size)); },
    toggleWish(id) {
      const i = wish.indexOf(id);
      if (i > -1) wish.splice(i, 1); else wish.push(id);
      emit();
      return i === -1;
    },
    isWished(id) { return wish.indexOf(id) > -1; },
    applyPromo(raw) {
      const code = String(raw || '').trim().toUpperCase();
      if (!code) return { ok: false, msg: 'Enter a code' };
      const found = PROMOS.find(p => p.code === code);
      if (!found) return { ok: false, msg: 'That code is not valid' };
      if (found.min && api.subtotal() < found.min) return { ok: false, msg: `Add ${money(found.min - api.subtotal())} more to use ${code}` };
      promo = found;
      write(KEY.promo, promo);
      emit();
      return { ok: true, msg: `${code} applied — ${found.label}` };
    },
    clearPromo() { promo = null; localStorage.removeItem(KEY.promo); emit(); },
    placeOrder(details) {
      const order = {
        id: 'SEL-' + Date.now().toString(36).toUpperCase() + '-' + Math.floor(Math.random() * 90 + 10),
        date: new Date().toISOString(),
        items: api.cart.map(i => ({ id: i.product.id, name: i.product.name, img: i.product.img, size: i.size, qty: i.qty, price: i.product.price, line: i.line })),
        subtotal: api.subtotal(),
        discount: api.discount(),
        shipping: api.shipping(),
        total: api.total(),
        promo: promo ? promo.code : null,
        ...details
      };
      order.items.forEach(i => { const p = byId(i.id); if (p) p.stock = Math.max(0, p.stock - i.qty); });
      write(KEY.stock, Object.fromEntries(PRODUCTS.map(p => [p.id, p.stock])));
      orders.unshift(order);
      write(KEY.orders, orders);
      api.clearBag();
      api.clearPromo();
      return order;
    },
    order(id) { return orders.find(o => o.id === id); },
    markRead(id) { const o = api.order(id); if (o && !o.read) { o.read = true; write(KEY.orders, orders); } }
  };
  return api;
})();
