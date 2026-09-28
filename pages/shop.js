PAGES.shop = () => {
  const grid = $('#shopGrid'), empty = $('#shopEmpty'), count = $('#resultCount');
  const search = $('#shopSearch'), sort = $('#shopSort'), range = $('#priceRange'), out = $('#priceOut');
  const params = new URLSearchParams(location.search);

  const state = {
    cat: CATEGORIES.some(c => c.id === params.get('cat')) ? params.get('cat') : 'all',
    q: params.get('q') || '',
    sort: 'featured',
    max: Number(range.max)
  };

  search.value = state.q;

  function apply() {
    let list = PRODUCTS.filter(p => state.cat === 'all' || p.cat === state.cat);
    if (state.q) {
      const t = state.q.toLowerCase();
      list = list.filter(p => (p.name + ' ' + p.cat + ' ' + p.catLabel + ' ' + p.sub + ' ' + p.desc).toLowerCase().includes(t));
    }
    list = list.filter(p => p.price <= state.max);

    const sorters = {
      low: (a, b) => a.price - b.price,
      high: (a, b) => b.price - a.price,
      rating: (a, b) => b.rating - a.rating,
      new: (a, b) => (b.tag === 'New' ? 1 : 0) - (a.tag === 'New' ? 1 : 0) || b.rating - a.rating,
      featured: (a, b) => (b.tag === 'Bestseller' ? 1 : 0) - (a.tag === 'Bestseller' ? 1 : 0) || b.rating - a.rating
    };
    list = [...list].sort(sorters[state.sort] || sorters.featured);

    grid.innerHTML = list.map(p => productCard(p)).join('');
    count.textContent = list.length + (list.length === 1 ? ' piece' : ' pieces');
    empty.hidden = list.length > 0;
    grid.hidden = list.length === 0;
    $$('.reveal', grid).forEach(el => el.classList.add('in'));

    $$('.filter', $('#filters')).forEach(b => b.classList.toggle('is-active', b.dataset.filter === state.cat));
    const url = new URL(location.href);
    state.cat === 'all' ? url.searchParams.delete('cat') : url.searchParams.set('cat', state.cat);
    history.replaceState(null, '', url);
  }

  $('#filters').addEventListener('click', e => {
    const b = e.target.closest('.filter'); if (!b) return;
    state.cat = b.dataset.filter;
    apply();
  });

  let t;
  search.addEventListener('input', () => {
    clearTimeout(t);
    t = setTimeout(() => { state.q = search.value.trim(); apply(); }, 160);
  });

  sort.addEventListener('change', () => { state.sort = sort.value; apply(); });

  range.addEventListener('input', () => {
    state.max = Number(range.value);
    out.textContent = money(state.max);
    apply();
  });

  function reset() {
    state.cat = 'all'; state.q = ''; state.sort = 'featured'; state.max = Number(range.max);
    search.value = ''; sort.value = 'featured'; range.value = range.max; out.textContent = money(state.max);
    apply();
  }
  $('#clearFilters').addEventListener('click', reset);
  $('#emptyReset').addEventListener('click', reset);

  out.textContent = money(Number(range.value));
  apply();
};
