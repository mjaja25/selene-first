PAGES.home = () => {
  const grid = $('#grid');
  const filters = $$('.filter');
  let active = 'all';

  function render() {
    const list = PRODUCTS.filter(p => active === 'all' || p.cat === active);
    grid.innerHTML = list.map(p => productCard(p)).join('');
    $$('.reveal', grid).forEach(el => el.classList.add('in'));
  }

  filters.forEach(b => b.addEventListener('click', () => {
    filters.forEach(x => x.classList.remove('is-active'));
    b.classList.add('is-active');
    active = b.dataset.filter;
    render();
  }));

  render();
};
