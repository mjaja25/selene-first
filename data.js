const PRODUCTS = [
  {
    id: 'andrea-tbar',
    name: 'The Andrea T-Bar Necklace',
    cat: 'necklaces',
    catLabel: 'Necklace',
    sub: '18K PVD · 42cm + 5cm extender',
    price: 1499, mrp: 1899,
    img: 'assets/img/p-tbar.jpg',
    gallery: ['assets/img/p-tbar.jpg', 'assets/img/lb-06.jpg', 'assets/img/tbar-model.jpg', 'assets/img/packaging.jpg'],
    tag: 'Bestseller',
    stock: 12,
    rating: 4.8,
    sizes: ['42cm', '45cm', '50cm'],
    desc: 'A sculptural T-bar closure on a fine cable chain — the kind of necklace that finishes an outfit without ever asking for attention. Weightless on the collar, it catches light with every turn.',
    details: ['316L stainless steel, 18K PVD gold finish', 'Hypoallergenic & nickel-free', 'Tarnish-resistant, water-friendly', 'Toggle T-bar clasp with 5cm extender'],
    care: 'Wipe with a soft cloth after wear. Store flat in the pouch provided.',
    reviews: [
      { name: 'Ananya R.', date: '12 Feb 2026', stars: 5, text: 'The weight is perfect — substantial enough to feel special, light enough for all day. Zero tarnish after a month of daily wear.' },
      { name: 'Meher K.', date: '3 Feb 2026', stars: 5, text: 'Bought this as a gift and immediately ordered one for myself. The clasp detail is beautiful.' },
      { name: 'Sneha P.', date: '27 Jan 2026', stars: 4, text: 'Gorgeous, but I sized up to 45cm and it sits exactly where I wanted.' }
    ]
  },
  {
    id: 'valentina-locket',
    name: 'The Valentina Locket',
    cat: 'necklaces',
    catLabel: 'Locket',
    sub: 'Twisted chain · opens',
    price: 1399, mrp: 1699,
    img: 'assets/img/p-locket.jpg',
    gallery: ['assets/img/p-locket.jpg', 'assets/img/lb-01.jpg', 'assets/img/packaging.jpg'],
    tag: 'New',
    stock: 8,
    rating: 4.9,
    sizes: ['40cm', '45cm'],
    desc: 'A keepsake locket on a twisted rope chain — it actually opens, so a photograph or a pressed petal can travel with you. Quietly personal jewellery.',
    details: ['316L stainless steel, 18K PVD gold finish', 'Functional hinged locket (fits a 14mm photo)', 'Twisted rope chain, lobster clasp', 'Hypoallergenic & tarnish-resistant'],
    care: 'Keep the hinge dry. Polish gently with the included cloth.',
    reviews: [
      { name: 'Ishita M.', date: '18 Feb 2026', stars: 5, text: 'Put a tiny photo of my dog inside. I have not taken it off since.' },
      { name: 'Riya S.', date: '9 Feb 2026', stars: 5, text: 'The chain is much prettier in person — twisted, not flat. Looks far more expensive.' },
      { name: 'Tara D.', date: '30 Jan 2026', stars: 4, text: 'Lovely, though I wish it came in a slightly longer length.' }
    ]
  },
  {
    id: 'moon-venus',
    name: 'Moon & Venus Twilight Drop',
    cat: 'earrings',
    catLabel: 'Ear jacket',
    sub: 'CZ · pair',
    price: 1200, mrp: 1500,
    img: 'assets/img/p-moonvenus.jpg',
    gallery: ['assets/img/p-moonvenus.jpg', 'assets/img/lb-04.jpg', 'assets/img/editorial-dark.jpg'],
    tag: null,
    stock: 6,
    rating: 4.7,
    sizes: ['Pair'],
    desc: 'A crescent moon at the front, a scattering of cubic zirconia behind the lobe — an ear jacket that turns a simple stud into a small astronomy lesson.',
    details: ['316L stainless steel with 18K PVD finish', 'AAA-grade cubic zirconia', 'Sits behind the lobe — two looks in one', 'Sold as a pair, hypoallergenic posts'],
    care: 'Remove before swimming. Store in the suede pouch.',
    reviews: [
      { name: 'Naina V.', date: '5 Feb 2026', stars: 5, text: 'These get compliments every single time. The jacket stays put all day.' },
      { name: 'Kavya B.', date: '22 Jan 2026', stars: 4, text: 'Beautiful but a little heavy for tiny lobes — fine for evenings.' }
    ]
  },
  {
    id: 'charlotte-huggies',
    name: 'Charlotte Huggies',
    cat: 'earrings',
    catLabel: 'Huggie',
    sub: 'Sculpted knot · pair',
    price: 800, mrp: 999,
    img: 'assets/img/p-huggies.jpg',
    gallery: ['assets/img/p-huggies.jpg', 'assets/img/hero.jpg', 'assets/img/lb-04.jpg'],
    tag: 'Everyday',
    stock: 24,
    rating: 4.9,
    sizes: ['10mm', '12mm'],
    desc: 'A sculpted knot huggie that never has to come off — sleep, shower, gym, repeat. The hinge clicks shut with a reassuring snap.',
    details: ['316L stainless steel, 18K PVD gold finish', 'Hinged snap closure', 'Waterproof & tarnish-resistant', 'Sold as a pair'],
    care: 'Rinse with fresh water after swimming in chlorinated pools.',
    reviews: [
      { name: 'Aditi G.', date: '14 Feb 2026', stars: 5, text: 'I have worn these in the shower for three months. Still gold, still perfect.' },
      { name: 'Pooja N.', date: '1 Feb 2026', stars: 5, text: 'The knot detail is tiny and elegant. My second pair already.' },
      { name: 'Sara L.', date: '19 Jan 2026', stars: 5, text: 'Finally huggies that actually click shut properly.' }
    ]
  },
  {
    id: 'crescent-wave',
    name: 'The Crescent Wave Ring',
    cat: 'rings',
    catLabel: 'Ring',
    sub: 'Pear-cut CZ',
    price: 1299, mrp: 1599,
    img: 'assets/img/p-crescent.jpg',
    gallery: ['assets/img/p-crescent.jpg', 'assets/img/lb-03.jpg', 'assets/img/lb-01.jpg'],
    tag: null,
    stock: 10,
    rating: 4.8,
    sizes: ['6', '7', '8', '9', '10', '11', '12'],
    desc: 'A wave of gold rising into a single pear-cut stone — asymmetrical, architectural, and far more comfortable than it looks.',
    details: ['316L stainless steel, 18K PVD gold finish', 'Hand-set pear-cut cubic zirconia', 'Comfort-fit interior band', 'Sizes 6–12 (Indian sizing)'],
    care: 'Remove before heavy lifting. Wipe clean to keep the stone brilliant.',
    reviews: [
      { name: 'Diya A.', date: '11 Feb 2026', stars: 5, text: 'Runs true to size. It is my engagement-ring stand-in and I love it.' },
      { name: 'Megha T.', date: '2 Feb 2026', stars: 5, text: 'The stone catches candlelight like nothing else I own.' },
      { name: 'Rhea C.', date: '25 Jan 2026', stars: 4, text: 'Sized down half a size as recommended — perfect fit.' }
    ]
  },
  {
    id: 'seraphina-band',
    name: 'The Seraphina Band',
    cat: 'rings',
    catLabel: 'Ring',
    sub: 'Trio of gems',
    price: 1299, mrp: 1499,
    img: 'assets/img/p-seraphina.jpg',
    gallery: ['assets/img/p-seraphina.jpg', 'assets/img/lb-03.jpg', 'assets/img/lb-01.jpg'],
    tag: 'Bestseller',
    stock: 4,
    rating: 4.7,
    sizes: ['6', '7', '8', '9', '10', '11', '12'],
    desc: 'Three stones set flush into a slim band — an eternity ring stripped back to its essentials. Made for stacking, designed to be worn alone.',
    details: ['316L stainless steel, 18K PVD gold finish', 'Three flush-set AAA cubic zirconia', 'Slim 2mm band, stackable', 'Sizes 6–12 (Indian sizing)'],
    care: 'Stack gently to avoid scratching the stones.',
    reviews: [
      { name: 'Nikita J.', date: '8 Feb 2026', stars: 5, text: 'Dainty but not fragile. I wear it with my plain gold band every day.' },
      { name: 'Aisha F.', date: '28 Jan 2026', stars: 4, text: 'Beautiful — only four left when I ordered, glad I did not wait.' }
    ]
  },
  {
    id: 'lumina-trio',
    name: 'The Lumina Trio Ring',
    cat: 'rings',
    catLabel: 'Ring',
    sub: 'Rope band',
    price: 1299, mrp: 1599,
    img: 'assets/img/p-lumina.jpg',
    gallery: ['assets/img/p-lumina.jpg', 'assets/img/lb-01.jpg', 'assets/img/lb-03.jpg'],
    tag: null,
    stock: 9,
    rating: 4.6,
    sizes: ['6', '7', '8', '9', '10', '11', '12'],
    desc: 'A twisted rope band that reads like vintage gold, weighted enough to feel like an heirloom. The quietest statement in the collection.',
    details: ['316L stainless steel, 18K PVD gold finish', 'Hand-twisted rope texture', 'Comfort-fit interior', 'Sizes 6–12 (Indian sizing)'],
    care: 'Store separately to preserve the rope texture.',
    reviews: [
      { name: 'Shreya O.', date: '6 Feb 2026', stars: 5, text: 'Looks like something from my grandmother’s jewellery box, in the best way.' },
      { name: 'Ritika H.', date: '24 Jan 2026', stars: 4, text: 'Texture is gorgeous. Slightly chunkier than expected — I love it.' }
    ]
  },
  {
    id: 'aura-bangle',
    name: 'Selene Aura Bangle',
    cat: 'bracelets',
    catLabel: 'Cuff',
    sub: 'Pear-cut CZ',
    price: 1090, mrp: 1390,
    img: 'assets/img/p-aura-bangle.jpg',
    gallery: ['assets/img/p-aura-bangle.jpg', 'assets/img/lb-05.jpg', 'assets/img/lb-07.jpg'],
    tag: null,
    stock: 11,
    rating: 4.8,
    sizes: ['Small', 'Medium', 'Large'],
    desc: 'An open cuff with a single pear-cut stone at the wrist bone — easy to slip on, impossible to ignore. Slightly adjustable by hand.',
    details: ['316L stainless steel, 18K PVD gold finish', 'Open, adjustable cuff design', 'Hand-set pear-cut cubic zirconia', 'S/M/L sizing'],
    care: 'Adjust once, gently — repeated bending can fatigue the metal.',
    reviews: [
      { name: 'Laila Q.', date: '16 Feb 2026', stars: 5, text: 'The fit guide was accurate. Sits perfectly and never spins.' },
      { name: 'Vanessa E.', date: '4 Feb 2026', stars: 5, text: 'Wore it to a wedding with three other bangles — this one won.' }
    ]
  },
  {
    id: 'bella-blanc',
    name: 'Bella Blanc Tennis Bracelet',
    cat: 'bracelets',
    catLabel: 'Tennis',
    sub: 'Silver finish',
    price: 799, mrp: 1299,
    img: 'assets/img/p-bellablanc.jpg',
    gallery: ['assets/img/p-bellablanc.jpg', 'assets/img/lb-05.jpg', 'assets/img/lb-07.jpg'],
    tag: 'Sale',
    stock: 15,
    rating: 4.7,
    sizes: ['16cm', '17cm', '18cm'],
    desc: 'A full line of brilliant-cut stones in a cool silver finish — the tennis bracelet, done at a price that lets you actually wear it.',
    details: ['316L stainless steel, rhodium finish', '46 hand-set cubic zirconia stones', 'Box clasp with safety latch', '16/17/18cm lengths'],
    care: 'Lay flat when storing to protect the stone line.',
    reviews: [
      { name: 'Fatima Z.', date: '13 Feb 2026', stars: 5, text: 'At this price I expected costume quality. It is genuinely fine.' },
      { name: 'Gauri W.', date: '31 Jan 2026', stars: 4, text: 'Clasp takes a moment to master, then it is secure all day.' }
    ]
  },
  {
    id: 'symphony-bracelet',
    name: 'The Symphony Bracelet',
    cat: 'bracelets',
    catLabel: 'Tennis',
    sub: 'Baguette stones',
    price: 799, mrp: 1199,
    img: 'assets/img/p-symphony.jpg',
    gallery: ['assets/img/p-symphony.jpg', 'assets/img/lb-07.jpg', 'assets/img/lb-05.jpg'],
    tag: 'Sale',
    stock: 3,
    rating: 4.6,
    sizes: ['16cm', '17cm', '18cm'],
    desc: 'Baguette-cut stones in a channel setting — sharper and more architectural than a classic tennis line. Almost gone.',
    details: ['316L stainless steel, 18K PVD gold finish', 'Channel-set baguette cubic zirconia', 'Fold-over clasp', '16/17/18cm lengths'],
    care: 'Avoid knocking against hard surfaces to protect the channel edges.',
    reviews: [
      { name: 'Charu I.', date: '10 Feb 2026', stars: 5, text: 'Baguettes make it look so much more modern than other tennis bracelets.' },
      { name: 'Neha B.', date: '26 Jan 2026', stars: 4, text: 'Elegant. Only three left when I bought mine — act fast.' }
    ]
  }
];

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'rings', label: 'Rings' },
  { id: 'necklaces', label: 'Necklaces' },
  { id: 'earrings', label: 'Earrings' },
  { id: 'bracelets', label: 'Bracelets' }
];

const PROMOS = [
  { code: 'FIRSTSHIP', type: 'shipping', value: 0, label: 'Free shipping unlocked' },
  { code: 'SELENE10', type: 'percent', value: 10, min: 0, label: '10% off your order' },
  { code: 'MOON200', type: 'flat', value: 200, min: 1499, label: '₹200 off over ₹1,499' }
];

const FREE_SHIP_THRESHOLD = 1499;
const FLAT_SHIPPING = 99;

const byId = id => PRODUCTS.find(p => p.id === id);
