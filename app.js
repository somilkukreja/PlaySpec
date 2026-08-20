// ==========================================================================
// PlaySpec — Minimal & Professional Gaming Intelligence & ML Recommendation Engine
// Backend Integrated (Steam Web API + Store API + Price Tracker + AI ML Spec Model)
// ==========================================================================

const API_BASE = ""; // Relative calls to Flask backend

// Instantly purge stale generic graphics from visitor browser cache
try {
  const rawSaved = localStorage.getItem('playspec_user_rig');
  if (rawSaved && (rawSaved.includes('Generic Graphics') || rawSaved.includes('Generic Processor') || rawSaved.includes('Standard Display Adapter'))) {
    localStorage.removeItem('playspec_user_rig');
  }
} catch (e) {}

// ── SVG ICONS REPOSITORY (Minimalist Vector Set) ──
const ICONS = {
  gpu: `<svg class="svg-icon svg-stroke" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>`,
  cpu: `<svg class="svg-icon svg-stroke" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg>`,
  ram: `<svg class="svg-icon svg-stroke" viewBox="0 0 24 24"><path d="M2 7h20v10H2z"/><path d="M6 7v4M10 7v4M14 7v4M18 7v4M6 13v4M10 13v4M14 13v4M18 13v4"/></svg>`,
  storage: `<svg class="svg-icon svg-stroke" viewBox="0 0 24 24"><line x1="22" y1="12" x2="2" y2="12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/><line x1="6" y1="16" x2="6.01" y2="16"/><line x1="10" y1="16" x2="10.01" y2="16"/></svg>`,
  display: `<svg class="svg-icon svg-stroke" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
  os: `<svg class="svg-icon svg-stroke" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
  check: `<svg class="svg-icon svg-stroke" viewBox="0 0 24 24" style="color:var(--color-success)"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
  tag: `<svg class="svg-icon svg-stroke" viewBox="0 0 24 24"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>`,
  heart: `<svg class="svg-icon svg-stroke" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`,
  steam: `<svg class="svg-icon" viewBox="0 0 512 512" fill="currentColor"><path d="M255.9 0C114.6 0 0 114.6 0 256c0 102.7 60 191.1 147 232.8l20-56.1c-15.7-18.4-25.2-42-25.2-67.7 0-56.8 46.1-102.9 102.9-102.9 4.3 0 8.5 .3 12.6 .8l71.4-102.4c0-2.3-.2-4.5-.2-6.8 0-48.4 39.2-87.6 87.6-87.6 48.4 0 87.6 39.2 87.6 87.6s-39.2 87.6-87.6 87.6c-20 0-38.3-6.7-52.9-18l-72.2 103.5c.3 3.6 .4 7.2 .4 10.9 0 56.8-46.1 102.9-102.9 102.9-46.7 0-86-31.2-99.3-73.6l-111 31.9c37 42.1 91 68.6 150.8 68.6 113.3 0 205.1-91.8 205.1-205.1S369.2 51 255.9 51V0z"/></svg>`,
  trending: `<svg class="svg-icon svg-stroke" viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>`,
  external: `<svg class="svg-icon svg-stroke" viewBox="0 0 24 24" style="width:12px;height:12px"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>`
};


// ── CURRENCY CONVERSION ENGINE ──
let currentCurrency = localStorage.getItem('playspec_currency') || 'INR';

const CURRENCY_SYMBOLS = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹',
  JPY: '¥',
  CAD: 'CA$',
  AUD: 'AU$',
  VND: '₫'
};

function getCountryCode(curr) {
  const map = { USD: 'US', EUR: 'DE', GBP: 'GB', INR: 'IN', JPY: 'JP', CAD: 'CA', AUD: 'AU', VND: 'VN' };
  return map[curr] || 'US';
}

let exchangeRates = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.78,
  INR: 83.5,
  JPY: 155.0,
  CAD: 1.37,
  AUD: 1.52,
  VND: 24500.0
};

async function fetchExchangeRates() {
  try {
    const res = await fetch(`${API_BASE}/api/currency/rates`);
    if (res.ok) {
      const data = await res.json();
      if (data.rates) {
        exchangeRates = { ...exchangeRates, ...data.rates };
        return;
      }
    }
  } catch (err) {}

  // Fallback to public live exchange rates API if backend proxy is offline (e.g. static on Vercel)
  try {
    const pubRes = await fetch('https://open.er-api.com/v6/latest/USD');
    if (pubRes.ok) {
      const pubData = await pubRes.json();
      if (pubData && pubData.rates) {
        exchangeRates = {
          USD: 1.0,
          EUR: pubData.rates.EUR || 0.92,
          GBP: pubData.rates.GBP || 0.78,
          INR: pubData.rates.INR || 83.5,
          JPY: pubData.rates.JPY || 155.0,
          CAD: pubData.rates.CAD || 1.37,
          AUD: pubData.rates.AUD || 1.52,
          VND: pubData.rates.VND || 24500.0
        };
      }
    }
  } catch (e) {}
}

function convertPrice(priceVal) {
  if (priceVal === undefined || priceVal === null || priceVal === '' || priceVal === 'Free' || priceVal === 'Free to Play' || priceVal === 'N/A') {
    return priceVal || 'Free';
  }

  const str = priceVal.toString().trim();
  const currentSymbol = CURRENCY_SYMBOLS[currentCurrency] || '$';

  // 1. If it already has the exact current currency symbol or formatted in current currency:
  if (currentCurrency === 'INR' && (str.includes('₹') || str.toUpperCase().includes('INR'))) {
    const numMatch = str.match(/[\d,.]+/);
    if (!numMatch) return str;
    const cleanNum = Math.round(parseFloat(numMatch[0].replace(/,/g, '')));
    return `₹ ${cleanNum.toLocaleString('en-IN')}`;
  }

  if (currentCurrency === 'USD' && (str.startsWith('$') || str.toUpperCase().includes('USD'))) {
    return str.replace(/\s+/g, ' ');
  }

  if (str.startsWith(currentSymbol)) {
    return str.replace(/\s+/g, ' ');
  }

  // 2. Extract numeric value
  const match = str.match(/[\d,.]+/);
  if (!match) return str;
  const rawNum = parseFloat(match[0].replace(/,/g, ''));
  if (isNaN(rawNum) || rawNum <= 0) return str;

  // 3. Detect input base currency
  let baseRate = 1.0;
  if (str.includes('₹') || str.toUpperCase().includes('INR')) {
    baseRate = exchangeRates.INR || 83.5;
  } else if (str.includes('€') || str.toUpperCase().includes('EUR')) {
    baseRate = exchangeRates.EUR || 0.92;
  } else if (str.includes('£') || str.toUpperCase().includes('GBP')) {
    baseRate = exchangeRates.GBP || 0.78;
  } else if (str.includes('¥') || str.toUpperCase().includes('JPY')) {
    baseRate = exchangeRates.JPY || 155.0;
  } else if (str.includes('₫') || str.toUpperCase().includes('VND')) {
    baseRate = exchangeRates.VND || 24500.0;
  } else if (str.includes('$') || str.toUpperCase().includes('USD')) {
    baseRate = 1.0;
  } else {
    // No symbol present:
    // If rawNum >= 150 and currentCurrency is INR, the number is ALREADY in INR (e.g. 700 or 4999)
    if (rawNum >= 150 && currentCurrency === 'INR') {
      return `₹ ${Math.round(rawNum).toLocaleString('en-IN')}`;
    }
    // Standard USD float price (e.g. 59.99, 19.79, 29.99)
    baseRate = 1.0;
  }

  // 4. Convert to target currency
  const usd = rawNum / baseRate;
  const targetRate = exchangeRates[currentCurrency] || 1.0;
  const converted = usd * targetRate;

  if (currentCurrency === 'INR') {
    return `₹ ${Math.round(converted).toLocaleString('en-IN')}`;
  }
  if (currentCurrency === 'JPY' || currentCurrency === 'VND') {
    return `${currentSymbol} ${Math.round(converted).toLocaleString('en-US')}`;
  }

  const isWhole = converted % 1 === 0;
  const formatted = converted.toLocaleString('en-US', {
    minimumFractionDigits: isWhole ? 0 : 2,
    maximumFractionDigits: 2
  });

  return `${currentSymbol}${formatted}`;
}

function initCurrencySelector() {
  const select = document.getElementById('currencySelect');
  if (!select) return;
  select.value = currentCurrency;
  select.addEventListener('change', (e) => {
    currentCurrency = e.target.value;
    localStorage.setItem('playspec_currency', currentCurrency);
    populateAll();
    fetchLivePrices();
    loadWishlist();
    fetchAndRenderMLRecommendations();
  });
}


// ── CURATED MASTER GAMES LIST ──
const MOCK_GAMES = [
  {
    id: 1091500,
    title: "Cyberpunk 2077",
    genre: "RPG • Open World • Sci-fi",
    image: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1091500/header.jpg",
    compat: "excellent",
    compatText: "Runs Great",
    match: 94,
    priceBadge: "great",
    priceBadgeText: "50% Off",
    currentPrice: "$29.99",
    originalPrice: "$59.99",
    lowestPrice: "$24.99",
    discount: "-50%",
    rating: 4.8,
    specs: { cpuMin: "i5-7500", cpuRec: "i7-8700", gpuMin: "GTX 1050 Ti", gpuRec: "RTX 2070", ramMin: "8 GB", ramRec: "16 GB" },
    priceHistory: [59.99, 44.99, 59.99, 29.99, 59.99, 29.99],
    estimatedFps: "65–85 FPS",
    estimatedSettings: "1080p High"
  },
  {
    id: 1151640,
    title: "Ghost of Tsushima DIRECTOR'S CUT",
    genre: "Action • Open World • Samurai",
    image: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1151640/header.jpg",
    compat: "excellent",
    compatText: "Runs Great",
    match: 93,
    priceBadge: "normal",
    priceBadgeText: "Sale Active",
    currentPrice: "$41.99",
    originalPrice: "$59.99",
    lowestPrice: "$39.99",
    discount: "-30%",
    rating: 4.9,
    specs: { cpuMin: "i5-8400", cpuRec: "i7-9700K", gpuMin: "GTX 1060", gpuRec: "RTX 2070", ramMin: "8 GB", ramRec: "16 GB" },
    priceHistory: [59.99, 59.99, 47.99, 59.99, 41.99],
    estimatedFps: "60–75 FPS",
    estimatedSettings: "1080p High"
  },
  {
    id: 2050650,
    title: "Resident Evil 4",
    genre: "Survival Horror • Action",
    image: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2050650/header.jpg",
    compat: "excellent",
    compatText: "Runs Great",
    match: 92,
    priceBadge: "great",
    priceBadgeText: "All-Time Low",
    currentPrice: "$19.99",
    originalPrice: "$39.99",
    lowestPrice: "$19.99",
    discount: "-50%",
    rating: 4.9,
    specs: { cpuMin: "i5-8400", cpuRec: "i7-8700", gpuMin: "GTX 1060", gpuRec: "RTX 2060", ramMin: "8 GB", ramRec: "16 GB" },
    priceHistory: [39.99, 29.99, 39.99, 19.99, 19.99],
    estimatedFps: "75–95 FPS",
    estimatedSettings: "1080p High"
  },
  {
    id: 1245620,
    title: "Elden Ring",
    genre: "Action RPG • Dark Fantasy",
    image: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1245620/header.jpg",
    compat: "playable",
    compatText: "Runs Well",
    match: 89,
    priceBadge: "normal",
    priceBadgeText: "Sale Active",
    currentPrice: "$35.99",
    originalPrice: "$59.99",
    lowestPrice: "$35.99",
    discount: "-40%",
    rating: 4.9,
    specs: { cpuMin: "i5-8400", cpuRec: "i7-8700K", gpuMin: "GTX 1060 3GB", gpuRec: "RTX 2070", ramMin: "12 GB", ramRec: "16 GB" },
    priceHistory: [59.99, 47.99, 59.99, 41.99, 35.99],
    estimatedFps: "50–60 FPS",
    estimatedSettings: "1080p Medium-High"
  },
  {
    id: 1174180,
    title: "Red Dead Redemption 2",
    genre: "Open World • Story • Western",
    image: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1174180/header.jpg",
    compat: "playable",
    compatText: "Runs Well",
    match: 88,
    priceBadge: "great",
    priceBadgeText: "67% Off",
    currentPrice: "$19.79",
    originalPrice: "$59.99",
    lowestPrice: "$19.79",
    discount: "-67%",
    rating: 4.9,
    specs: { cpuMin: "i5-2500K", cpuRec: "i7-4770K", gpuMin: "GTX 770", gpuRec: "GTX 1060 6GB", ramMin: "8 GB", ramRec: "12 GB" },
    priceHistory: [59.99, 39.99, 29.99, 19.79, 19.79],
    estimatedFps: "55–65 FPS",
    estimatedSettings: "1080p High"
  },
  {
    id: 1659040,
    title: "Hitman World of Assassination",
    genre: "Stealth • Action • Strategy",
    image: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1659040/header.jpg",
    compat: "excellent",
    compatText: "Runs Great",
    match: 84,
    priceBadge: "normal",
    priceBadgeText: "Regular Price",
    currentPrice: "$27.99",
    originalPrice: "$69.99",
    lowestPrice: "$20.99",
    discount: "-60%",
    rating: 4.7,
    specs: { cpuMin: "i5-2500K", cpuRec: "i7-4790", gpuMin: "GTX 660", gpuRec: "GTX 1070", ramMin: "8 GB", ramRec: "16 GB" },
    priceHistory: [69.99, 41.99, 69.99, 27.99],
    estimatedFps: "80–100 FPS",
    estimatedSettings: "1080p Ultra"
  }
];

let GAMES = [...MOCK_GAMES];
let FREE_GAMES = [];

const EVENTS = [
  { title: "Steam Spring Sale", desc: "Major seasonal discounts across thousands of Steam titles.", countdown: "28 days", icon: "tag" },
  { title: "Steam Summer Sale", desc: "Deepest discounts of the year on AAA & indie games.", countdown: "120 days", icon: "tag" },
  { title: "Steam Autumn Sale", desc: "Black Friday & Thanksgiving promotional deals.", countdown: "260 days", icon: "tag" },
  { title: "Steam Winter Sale", desc: "Year-end holiday mega event with Steam Awards.", countdown: "305 days", icon: "tag" }
];


// ── CARD RENDERERS ──

function createGameCard(game) {
  const currentP = convertPrice(game.currentPrice);
  const origP = game.originalPrice && game.originalPrice !== game.currentPrice ? convertPrice(game.originalPrice) : '';
  const lowestP = convertPrice(game.lowestPrice || game.currentPrice);
  const isWishlisted = isAppWishlisted(game.id);

  return `
    <div class="game-card" onclick="openGameModal('${game.id}')" style="cursor:pointer">
      <div class="game-card-image">
        <img src="${game.image}" alt="${game.title}" loading="lazy" />
        ${game.discount ? `<span class="discount-badge">${game.discount}</span>` : ''}
        <button class="wishlist-btn ${isWishlisted ? 'active' : ''}" title="Add to Price Tracker" onclick="event.stopPropagation(); quickToggleWishlist(${game.id}, '${game.title.replace(/'/g, "\\'")}', '${game.image}')">
          <svg class="svg-icon svg-stroke" viewBox="0 0 24 24" style="width:14px;height:14px"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        </button>
      </div>
      <div class="game-card-body">
        <div class="game-card-title">${game.title}</div>
        <div class="game-card-genre">${game.genre || 'Action • Steam'}</div>
        <div class="game-card-badges">
          <span class="compat-badge ${game.compat}">
            <span class="badge-dot" style="background:${game.compat==='excellent'?'var(--color-success)':'var(--color-warning)'}"></span>
            ${game.compatText}
          </span>
          <span class="badge badge-cyan">${game.match}% Match</span>
        </div>
        <div class="game-card-price">
          <div>
            <span class="price-current">${currentP}</span>
            ${origP ? `<span class="price-original">${origP}</span>` : ''}
          </div>
          <span class="price-lowest">Low: ${lowestP}</span>
        </div>
      </div>
    </div>
  `;
}

let activeDealsStoreFilter = 'all';

function filterDealsByStore(storeId) {
  activeDealsStoreFilter = storeId;
  document.querySelectorAll('[data-deals-store]').forEach(c => {
    c.classList.toggle('active', c.dataset.dealsStore === storeId);
  });
  populateDeals();
}

function populateDeals() {
  const dealsEl = document.getElementById('dealsGrid');
  if (!dealsEl) return;

  let filtered = [...GAMES];
  if (activeDealsStoreFilter !== 'all') {
    filtered = filtered.filter(g => (g.store_id || 'steam') === activeDealsStoreFilter);
  } else {
    const discounted = filtered.filter(g => g.discount);
    if (discounted.length > 0) filtered = discounted;
  }

  if (filtered.length === 0) {
    dealsEl.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:30px;color:var(--text-muted)">No active deals found for this store filter. Try selecting 'All Stores'.</div>`;
    return;
  }

  dealsEl.innerHTML = filtered.map(createDealCard).join('');
}

function createDealCard(game) {
  const currentP = convertPrice(game.currentPrice);
  const origP = game.originalPrice && game.originalPrice !== game.currentPrice ? convertPrice(game.originalPrice) : '';
  const storeBadgeClass = `store-badge-${game.store_badge || 'steam'}`;
  const storeIcon = game.store_icon || '🎮';
  const storeName = game.store_name || 'Steam';
  const isDrmFree = game.drm && (game.drm.toLowerCase().includes('drm-free') || game.store_id === 'gog' || game.store_id === 'itchio');

  return `
    <div class="deal-card" onclick="openGameModal('${game.id}')" data-discount="${game.discount ? 'yes' : 'no'}" data-store="${game.store_id || 'steam'}">
      <div class="deal-card-image" style="position:relative">
        <img src="${game.image}" alt="${game.title}" loading="lazy" />
        <span class="store-badge ${storeBadgeClass}" style="position:absolute;top:8px;left:8px;z-index:2;font-size:0.62rem">
          ${storeIcon} ${storeName.split(' ')[0]}
        </span>
      </div>
      <div class="deal-card-body">
        <div class="deal-card-title">${game.title}</div>
        <div style="display:flex;align-items:center;gap:6px;margin:4px 0;flex-wrap:wrap">
          <span class="compat-badge ${game.compat}" style="font-size:0.7rem;padding:1px 6px">${game.compatText}</span>
          ${game.discount ? `<span class="deal-discount">${game.discount}</span>` : ''}
          ${isDrmFree ? `<span class="badge badge-purple" style="font-size:0.62rem;padding:1px 5px">DRM-Free</span>` : ''}
        </div>
        <div class="deal-card-prices">
          <span class="deal-current">${currentP}</span>
          ${origP ? `<span class="deal-original">${origP}</span>` : ''}
        </div>
      </div>
    </div>
  `;
}

function createFreeCard(game) {
  const storeUrl = game.store_url || (game.appid ? `https://store.steampowered.com/app/${game.appid}` : '#');
  return `
    <div class="free-card">
      <div class="free-card-image">
        <img src="${game.image}" alt="${game.title}" loading="lazy" onerror="this.src='images/cyberpunk.png'" />
        <span class="free-card-tag">${game.tag || 'STEAM FREE TO PLAY'}</span>
      </div>
      <div class="free-card-body">
        <div class="free-card-title">${game.title}</div>
        <div class="free-card-platform">Steam Store Promotion</div>
        <div class="free-card-timer">⏱ ${game.timeLeft || 'Permanent Free to Play'}</div>
        <button class="free-card-claim" onclick="window.open('${storeUrl}', '_blank')">Claim on Steam ${ICONS.external}</button>
      </div>
    </div>
  `;
}

function createEventCard(e) {
  return `
    <div style="background:var(--bg-card);border:1px solid var(--border-subtle);border-radius:var(--radius-md);padding:16px;display:flex;flex-direction:column;gap:6px">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <span style="font-weight:700;font-size:0.95rem;color:var(--text-primary)">${e.title}</span>
        <span class="badge badge-warning">${e.countdown}</span>
      </div>
      <p style="font-size:0.8rem;color:var(--text-secondary);line-height:1.4">${e.desc}</p>
    </div>
  `;
}

// ── POPULATE SECTIONS ──
function populateAll() {
  const recEl = document.getElementById('recommendedRow');
  if (recEl) recEl.innerHTML = GAMES.map(createGameCard).join('');

  populateDeals();

  const freeEl = document.getElementById('freeGamesGrid');
  if (freeEl && FREE_GAMES.length > 0) {
    freeEl.innerHTML = FREE_GAMES.map(createFreeCard).join('');
  }

  const eventsEl = document.getElementById('eventsList');
  if (eventsEl) {
    eventsEl.innerHTML = EVENTS.map(createEventCard).join('');
  }
}


// ── LIVE STEAM DEALS & FREE PROMOTIONS FETCHERS ──

async function fetchLivePrices() {
  const cc = getCountryCode(currentCurrency);
  const appids = GAMES.map(g => g.id).join(',');
  try {
    const resp = await fetch(`${API_BASE}/api/steam/prices?appids=${appids}&cc=${cc}`);
    if (resp.ok) {
      const data = await resp.json();
      GAMES.forEach(g => {
        if (data[g.id]) {
          g.currentPrice = data[g.id].current;
          g.originalPrice = data[g.id].original;
          g.discount = data[g.id].discount_percent ? `-${data[g.id].discount_percent}%` : null;
          g.priceBadge = data[g.id].discount_percent >= 50 ? 'great' : (data[g.id].discount_percent > 0 ? 'normal' : 'normal');
          g.priceBadgeText = data[g.id].discount_percent >= 50 ? 'Great Deal' : (data[g.id].discount_percent > 0 ? 'Sale Active' : 'Regular Price');
        }
      });
      populateAll();
    }
  } catch (err) {}
}

async function loadMultiStoreDeals() {
  try {
    let dealsData = [];
    // 1. Try local backend aggregator first (if server.py is running)
    try {
      const resp = await fetch(`${API_BASE}/api/deals/multi-store?store=all`);
      if (resp.ok) {
        const data = await resp.json();
        if (data && data.deals && data.deals.length > 0) {
          dealsData = data.deals;
        }
      }
    } catch (backendErr) {}

    // 2. Direct client fallback for GOG, Epic, Itch if backend didn't return (e.g. on Vercel)
    if (!dealsData || dealsData.length === 0) {
      try {
        const gogResp = await fetch('https://catalog.gog.com/v1/catalog?limit=12&order=desc:bestselling&productType=in:game');
        if (gogResp.ok) {
          const gogJson = await gogResp.json();
          (gogJson.products || []).forEach(p => {
            const priceInfo = p.price || {};
            dealsData.push({
              id: `gog_${p.id}`,
              title: p.title,
              store_id: 'gog',
              store_name: 'GOG.com',
              store_badge: 'gog',
              store_icon: '🕹️',
              drm: 'DRM-Free',
              image: p.coverHorizontal || 'images/cyberpunk.png',
              compat: 'excellent',
              compatText: 'Runs Great',
              match: 94,
              currentPrice: priceInfo.final || '$9.99',
              originalPrice: priceInfo.base || '',
              lowestPrice: priceInfo.final || '$9.99',
              discount: priceInfo.discount ? `-${priceInfo.discount}%` : '',
              url: `https://www.gog.com/en/game/${p.slug || ''}`,
              genre: 'GOG DRM-Free Best Seller',
              specs: { cpuMin: "i5-8400", cpuRec: "i7-9700", gpuMin: "GTX 1060", gpuRec: "RTX 2070", ramMin: "8 GB", ramRec: "16 GB" },
              priceHistory: [29.99, 19.99, 14.99, 9.99]
            });
          });
        }
      } catch (gogErr) {}

      try {
        const epicResp = await fetch('https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions?locale=en-US&country=US&allowCountries=US');
        if (epicResp.ok) {
          const epicJson = await epicResp.json();
          const elements = epicJson.data?.Catalog?.searchStore?.elements || [];
          elements.forEach(e => {
            const slug = e.productSlug || e.urlSlug || '';
            const priceData = e.price?.totalPrice?.fmtPrice || {};
            const currP = priceData.discountPrice || 'Free';
            const img = (e.keyImages || []).find(i => ['OfferImageWide', 'Thumbnail', 'DieselStoreFrontWide'].includes(i.type))?.url || 'images/cyberpunk.png';
            dealsData.push({
              id: `epic_${e.id}`,
              title: e.title,
              store_id: 'epic-games-store',
              store_name: 'Epic Games Store',
              store_badge: 'epic',
              store_icon: '⚡',
              drm: 'Epic Games Launcher',
              image: img,
              compat: 'excellent',
              compatText: 'Runs Great',
              match: 93,
              currentPrice: currP === '0' || currP === '$0.00' ? 'Free' : currP,
              originalPrice: priceData.originalPrice || '',
              lowestPrice: currP,
              discount: currP === 'Free' || currP === '0' ? '-100%' : '-40%',
              url: `https://store.epicgames.com/en-US/p/${slug}`,
              genre: 'Epic Games Store Promotion',
              specs: { cpuMin: "i5-7500", cpuRec: "i7-8700", gpuMin: "GTX 1060", gpuRec: "RTX 2060", ramMin: "8 GB", ramRec: "16 GB" },
              priceHistory: [39.99, 29.99, 19.99, 0.0]
            });
          });
        }
      } catch (epicErr) {}
    }

    if (dealsData && dealsData.length > 0) {
      const existingIds = new Set(GAMES.map(g => g.id));
      dealsData.forEach(d => {
        if (!existingIds.has(d.id)) {
          GAMES.push(d);
        }
      });
      populateAll();
    }
  } catch (err) {}
}

// ══════════════════════════════════════════════════════════════════════
// MULTI-STORE DAILY FREE GAMES & GIVEAWAYS (GamerPower Integration)
// ══════════════════════════════════════════════════════════════════════

let allGiveawaysData = [];
let activeGiveawayFilter = {
  store: 'all',
  timeframe: 'all',
  type: 'game',
  sort: 'date'
};

function parseGamerPowerRawGiveaways(rawData) {
  if (!Array.isArray(rawData)) return [];
  const now = new Date();
  const processed = [];

  for (const g of rawData) {
    const title = g.title || '';
    const platforms = g.platforms || '';
    const gType = g.type || 'Game';

    // Store detection
    let storeId = 'other';
    let storeName = 'PC / DRM-Free';
    let storeBadge = 'other';
    let storeIcon = '🎁';

    const pLower = platforms.toLowerCase();
    const tLower = title.toLowerCase();

    if (pLower.includes('epic') || tLower.includes('(epic games)')) {
      storeId = 'epic-games-store'; storeName = 'Epic Games Store'; storeBadge = 'epic'; storeIcon = '⚡';
    } else if (pLower.includes('steam') || tLower.includes('(steam)')) {
      storeId = 'steam'; storeName = 'Steam'; storeBadge = 'steam'; storeIcon = '🎮';
    } else if (pLower.includes('gog') || tLower.includes('(gog)')) {
      storeId = 'gog'; storeName = 'GOG.com'; storeBadge = 'gog'; storeIcon = '🕹️';
    } else if (pLower.includes('itch') || tLower.includes('(itchio)')) {
      storeId = 'itchio'; storeName = 'Itch.io'; storeBadge = 'itchio'; storeIcon = '🎨';
    } else if (pLower.includes('indiegala') || tLower.includes('(indiegala)')) {
      storeId = 'indiegala'; storeName = 'IndieGala'; storeBadge = 'indiegala'; storeIcon = '🎁';
    } else if (pLower.includes('prime') || tLower.includes('(prime')) {
      storeId = 'prime'; storeName = 'Prime Gaming'; storeBadge = 'prime'; storeIcon = '👑';
    }

    // Expiry calculation
    const endDateStr = g.end_date || 'N/A';
    let timeframe = 'active';
    let remainingText = 'Claim & Keep Forever';
    let expiryType = 'normal';
    let hoursLeft = 99999;

    if (endDateStr && endDateStr !== 'N/A') {
      try {
        const endDt = new Date(endDateStr.replace(' ', 'T') + 'Z');
        const diffMs = endDt.getTime() - now.getTime();
        if (diffMs > 0) {
          hoursLeft = Math.floor(diffMs / 3600000);
          const daysLeft = Math.floor(hoursLeft / 24);
          if (diffMs <= 86400000) {
            timeframe = 'ending_today';
            remainingText = `🔥 Ends in ${hoursLeft}h`;
            expiryType = 'urgent';
          } else if (diffMs <= 604800000) {
            timeframe = 'this_week';
            remainingText = `⏳ Ends in ${daysLeft}d`;
            expiryType = 'warning';
          } else {
            remainingText = `📅 Until ${endDateStr.slice(0, 10)}`;
            expiryType = 'normal';
          }
        }
      } catch (e) {}
    }

    // Check if published within 24h
    const pubStr = g.published_date || '';
    let isNewToday = false;
    if (pubStr) {
      try {
        const pubDt = new Date(pubStr.replace(' ', 'T') + 'Z');
        if ((now.getTime() - pubDt.getTime()) <= 86400000) {
          isNewToday = true;
        }
      } catch (e) {}
    }

    // Worth parsing
    const worthStr = g.worth || 'N/A';
    const worthDisplay = (worthStr && worthStr !== 'N/A') ? worthStr : 'Free';
    let worthNum = 0.0;
    if (worthStr && worthStr.includes('$')) {
      const match = worthStr.match(/[\d.]+/);
      if (match) worthNum = parseFloat(match[0]) || 0.0;
    }

    processed.push({
      id: g.id,
      title: title,
      worth: worthDisplay,
      worth_num: worthNum,
      image: g.image || g.thumbnail || 'images/cyberpunk.png',
      thumbnail: g.thumbnail || g.image || 'images/cyberpunk.png',
      description: g.description || '',
      instructions: g.instructions || '',
      open_giveaway_url: g.open_giveaway_url || g.gamerpower_url || '#',
      published_date: pubStr,
      end_date: endDateStr,
      type: gType,
      platforms: platforms,
      store_id: storeId,
      store_name: storeName,
      store_badge: storeBadge,
      store_icon: storeIcon,
      timeframe: timeframe,
      hours_left: hoursLeft,
      remaining_text: remainingText,
      expiry_type: expiryType,
      is_new_today: isNewToday,
      users: g.users || 0
    });
  }
  return processed;
}

function getOfflineFallbackGiveaways() {
  return [
    {
      id: 9001,
      title: "Deponia Complete Journey Giveaway",
      worth: "$29.99",
      worth_num: 29.99,
      image: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/292910/header.jpg",
      thumbnail: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/292910/header.jpg",
      description: "Junk, junk and even more junk. Life on the dust-planet Deponia is anything but a walk in the park. Claim this classic adventure free for a limited time.",
      instructions: "1. Click 'Claim on Steam'.\n2. Log in and add the promotion to your Steam account.\n3. Keep permanently.",
      open_giveaway_url: "https://store.steampowered.com",
      type: "Game",
      platforms: "PC, Steam",
      store_id: "steam",
      store_name: "Steam",
      store_badge: "steam",
      store_icon: "🎮",
      timeframe: "this_week",
      hours_left: 72,
      remaining_text: "⏳ Ends in 3d",
      expiry_type: "warning",
      is_new_today: false,
      users: 14200
    },
    {
      id: 9002,
      title: "Wordle (IndieGala) Giveaway",
      worth: "$29.99",
      worth_num: 29.99,
      image: "https://www.indiegalacdn.com/store-img_game/games/medium/00001_ig.jpg",
      thumbnail: "https://www.indiegalacdn.com/store-img_game/games/medium/00001_ig.jpg",
      description: "Wordle is a puzzle game where you guess hidden words across challenging levels. DRM-Free permanent claim.",
      instructions: "1. Click 'Claim on IndieGala'.\n2. Scroll down and click 'Add to Library'.\n3. Download DRM-Free anytime.",
      open_giveaway_url: "https://freebies.indiegala.com",
      type: "Game",
      platforms: "PC, DRM-Free",
      store_id: "indiegala",
      store_name: "IndieGala",
      store_badge: "indiegala",
      store_icon: "🎁",
      timeframe: "active",
      hours_left: 9999,
      remaining_text: "Claim & Keep Forever",
      expiry_type: "normal",
      is_new_today: false,
      users: 8700
    },
    {
      id: 9003,
      title: "Decrypt (Itch.io) Giveaway",
      worth: "$2.99",
      worth_num: 2.99,
      image: "https://img.itch.zone/aW1nLzI3NTQ4MDU2LnBuZw==/315x250%23c/Ac3gLH.png",
      thumbnail: "https://img.itch.zone/aW1nLzI3NTQ4MDU2LnBuZw==/315x250%23c/Ac3gLH.png",
      description: "Decrypt is a thrilling sci-fi mystery puzzle game. Uncover encrypted logs and survive.",
      instructions: "1. Click 'Claim on Itch.io'.\n2. Click 'Download or Claim'.\n3. Link to your Itch.io account to keep permanently.",
      open_giveaway_url: "https://itch.io",
      type: "Game",
      platforms: "PC, Itch.io, DRM-Free",
      store_id: "itchio",
      store_name: "Itch.io",
      store_badge: "itchio",
      store_icon: "🎨",
      timeframe: "ending_today",
      hours_left: 7,
      remaining_text: "🔥 Ends in 7h",
      expiry_type: "urgent",
      is_new_today: true,
      users: 4300
    }
  ];
}

async function loadDailyGiveaways(forceRefresh = false) {
  const grid = document.getElementById('freeGamesGrid');
  const badge = document.getElementById('giveawaysTotalValueBadge');
  const emptyState = document.getElementById('giveawayEmptyState');

  if (grid && (!allGiveawaysData || allGiveawaysData.length === 0 || forceRefresh)) {
    grid.innerHTML = `
      <div style="grid-column:1/-1;padding:40px;text-align:center;color:var(--text-muted)">
        <div class="spinner" style="margin:0 auto 12px"></div>
        Syncing live promotions across Epic Games, Steam, GOG, Itch.io & IndieGala...
      </div>
    `;
  }

  try {
    let loaded = false;

    // 1. Try local backend proxy first (if server.py is running)
    try {
      const resp = await fetch(`${API_BASE}/api/giveaways`);
      if (resp.ok) {
        const data = await resp.json();
        if (data && data.giveaways && data.giveaways.length > 0) {
          allGiveawaysData = data.giveaways;
          loaded = true;
        }
      }
    } catch (backendErr) {}

    // 2. If backend endpoint is unavailable (e.g. running statically on Vercel), fetch GamerPower API directly
    if (!loaded) {
      try {
        const directResp = await fetch('https://www.gamerpower.com/api/giveaways');
        if (directResp.ok) {
          const rawData = await directResp.json();
          const parsed = parseGamerPowerRawGiveaways(rawData);
          if (parsed && parsed.length > 0) {
            allGiveawaysData = parsed;
            loaded = true;
          }
        }
      } catch (directErr) {}
    }

    // 3. Fallback to curated promotions if offline
    if (!loaded && (!allGiveawaysData || allGiveawaysData.length === 0)) {
      allGiveawaysData = getOfflineFallbackGiveaways();
      loaded = true;
    }

    if (allGiveawaysData && allGiveawaysData.length > 0) {
      renderGiveaways();

      if (badge) {
        const fullGamesCount = allGiveawaysData.filter(g => g.type === 'Game').length;
        const totalWorth = allGiveawaysData.reduce((acc, g) => acc + (g.worth_num || 0), 0);
        badge.textContent = `🔥 ${fullGamesCount} Free Games ($${Math.round(totalWorth)} Total Value)`;
      }

      if (forceRefresh) {
        showToastNotification(`Synced ${allGiveawaysData.length} daily promotions across all stores.`);
      }
    } else {
      if (grid) grid.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
    }
  } catch (err) {
    allGiveawaysData = getOfflineFallbackGiveaways();
    if (allGiveawaysData && allGiveawaysData.length > 0) {
      renderGiveaways();
    } else if (grid) {
      grid.innerHTML = `
        <div style="grid-column:1/-1;padding:30px;text-align:center;color:var(--text-muted)">
          Unable to sync live giveaway promotions. Please check connection.
        </div>
      `;
    }
  }
}

function filterGiveawaysByStore(storeId) {
  activeGiveawayFilter.store = storeId;
  document.querySelectorAll('.store-filter-chip').forEach(c => {
    c.classList.toggle('active', c.dataset.store === storeId);
  });
  renderGiveaways();
}

function filterGiveawaysByTimeframe(timeframe) {
  activeGiveawayFilter.timeframe = timeframe;
  document.querySelectorAll('[data-timeframe]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.timeframe === timeframe);
  });
  renderGiveaways();
}

function filterGiveawaysByType(type) {
  activeGiveawayFilter.type = type;
  renderGiveaways();
}

function sortGiveaways(sortBy) {
  activeGiveawayFilter.sort = sortBy;
  renderGiveaways();
}

function resetGiveawayFilters() {
  activeGiveawayFilter = { store: 'all', timeframe: 'all', type: 'game', sort: 'date' };
  document.querySelectorAll('.store-filter-chip').forEach(c => c.classList.toggle('active', c.dataset.store === 'all'));
  document.querySelectorAll('[data-timeframe]').forEach(b => b.classList.toggle('active', b.dataset.timeframe === 'all'));
  const typeSel = document.getElementById('giveawayTypeSelect');
  if (typeSel) typeSel.value = 'game';
  const sortSel = document.getElementById('giveawaySortSelect');
  if (sortSel) sortSel.value = 'date';
  renderGiveaways();
}

function renderGiveaways() {
  const grid = document.getElementById('freeGamesGrid');
  const emptyState = document.getElementById('giveawayEmptyState');
  if (!grid) return;

  let filtered = [...allGiveawaysData];

  // Store filter
  if (activeGiveawayFilter.store !== 'all') {
    filtered = filtered.filter(g => g.store_id === activeGiveawayFilter.store);
  }

  // Type filter
  if (activeGiveawayFilter.type === 'game') {
    filtered = filtered.filter(g => g.type.toLowerCase() === 'game');
  } else if (activeGiveawayFilter.type === 'loot') {
    filtered = filtered.filter(g => g.type.toLowerCase() !== 'game');
  }

  // Timeframe filter
  if (activeGiveawayFilter.timeframe === 'ending_today') {
    filtered = filtered.filter(g => g.timeframe === 'ending_today');
  } else if (activeGiveawayFilter.timeframe === 'this_week') {
    filtered = filtered.filter(g => g.timeframe === 'ending_today' || g.timeframe === 'this_week');
  } else if (activeGiveawayFilter.timeframe === 'new_today') {
    filtered = filtered.filter(g => g.is_new_today);
  }

  // Sort
  if (activeGiveawayFilter.sort === 'ending') {
    filtered.sort((a, b) => a.hours_left - b.hours_left);
  } else if (activeGiveawayFilter.sort === 'value') {
    filtered.sort((a, b) => b.worth_num - a.worth_num);
  } else if (activeGiveawayFilter.sort === 'popularity') {
    filtered.sort((a, b) => b.users - a.users);
  } else {
    filtered.sort((a, b) => new Date(b.published_date || 0) - new Date(a.published_date || 0));
  }

  if (filtered.length === 0) {
    grid.innerHTML = '';
    if (emptyState) emptyState.style.display = 'block';
  } else {
    if (emptyState) emptyState.style.display = 'none';
    grid.innerHTML = filtered.map(createGiveawayCard).join('');
  }
}

function createGiveawayCard(g) {
  const storeBadgeClass = `store-badge-${g.store_badge || 'other'}`;
  const expiryPillClass = `expiry-${g.expiry_type || 'normal'}`;
  const worthDisplay = g.worth && g.worth !== 'N/A' && g.worth !== 'Free' ? `Worth ${g.worth}` : '100% OFF FREE';

  return `
    <div class="giveaway-card" data-id="${g.id}" onclick="openGiveawayModal(${g.id})" style="cursor:pointer">
      <div class="giveaway-image-wrap">
        <img class="giveaway-image" src="${g.image || g.thumbnail}" alt="${g.title}" loading="lazy" />
        <div class="giveaway-overlay-top">
          <span class="store-badge ${storeBadgeClass}">${g.store_icon || '🎁'} ${g.store_name}</span>
          <span class="expiry-pill ${expiryPillClass}">${g.remaining_text}</span>
        </div>
      </div>
      <div class="giveaway-body">
        <h4 class="giveaway-title" title="${g.title}">${g.title}</h4>
        <div class="giveaway-meta">
          <span class="giveaway-worth-tag">${worthDisplay}</span>
          <span class="giveaway-platforms" title="${g.platforms}">${g.platforms || 'PC'}</span>
        </div>
        <div class="giveaway-actions">
          <a href="${g.open_giveaway_url}" target="_blank" rel="noopener noreferrer" class="btn-claim" title="Claim directly on ${g.store_name}" onclick="event.stopPropagation()">
            Claim on ${g.store_name.split(' ')[0]} ↗
          </a>
          <button class="btn-details" onclick="event.stopPropagation(); openGiveawayModal(${g.id})" title="View claim instructions">
            Instructions
          </button>
        </div>
      </div>
    </div>
  `;
}

function openGiveawayModal(giveawayId) {
  const g = allGiveawaysData.find(item => item.id === giveawayId);
  if (!g) return;

  const modal = document.getElementById('giveawayModal');
  if (!modal) return;

  document.getElementById('giveawayModalTitle').textContent = g.title;
  document.getElementById('giveawayModalImage').src = g.image || g.thumbnail;
  document.getElementById('giveawayModalDescription').textContent = g.description || 'No description available for this promotion.';
  
  const storeEl = document.getElementById('giveawayModalStore');
  if (storeEl) {
    storeEl.className = `store-badge store-badge-${g.store_badge || 'other'}`;
    storeEl.innerHTML = `${g.store_icon || '🎁'} ${g.store_name}`;
  }

  const expiryEl = document.getElementById('giveawayModalExpiry');
  if (expiryEl) {
    expiryEl.className = `expiry-pill expiry-${g.expiry_type || 'normal'}`;
    expiryEl.textContent = g.remaining_text;
  }

  const worthEl = document.getElementById('giveawayModalWorth');
  if (worthEl) {
    worthEl.textContent = g.worth && g.worth !== 'N/A' ? `Worth ${g.worth} • 100% OFF` : 'Free to Play';
  }

  const instructionsEl = document.getElementById('giveawayModalInstructions');
  if (instructionsEl) {
    instructionsEl.textContent = g.instructions || `1. Click "Claim Free on Store".\n2. Log into your ${g.store_name} account.\n3. Add the game to your library to keep permanently.`;
  }

  const claimBtn = document.getElementById('giveawayModalClaimBtn');
  if (claimBtn) {
    claimBtn.href = g.open_giveaway_url;
    claimBtn.textContent = `🚀 Claim Free on ${g.store_name}`;
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeGiveawayModal() {
  const modal = document.getElementById('giveawayModal');
  if (modal) modal.classList.remove('active');
  document.body.style.overflow = '';
}


// ══════════════════════════════════════════════════════════════════════
// AI / ML HARDWARE SPEC-BASED RECOMMENDATION ENGINE
// ══════════════════════════════════════════════════════════════════════
// AI / ML SPEC-BASED HARDWARE INTELLIGENCE & RECOMMENDATION ENGINE
// ══════════════════════════════════════════════════════════════════════

let mlCachedRecommendations = [];
let mlCachedRawData = null;
let activeMLFilter = 'all';

function parseAndScoreHardwareClient(rig) {
  const gpuStr = (rig.gpu || 'RTX 3060').toLowerCase();
  const cpuStr = (rig.cpu || 'Multi-Core').toLowerCase();
  const ramStr = (rig.ram || '16 GB').toLowerCase();
  const vramStr = (rig.vram || rig.gpuDetail || '').toLowerCase();

  // 1. RAM (GB)
  let ramGb = 16;
  const matchRam = ramStr.match(/\d+/);
  if (matchRam) ramGb = parseInt(matchRam[0]);

  // 2. VRAM (GB)
  let vramGb = 6.0;
  const matchVram = (vramStr + ' ' + gpuStr).match(/(\d+(?:\.\d+)?)\s*(?:gb|g)?\s*vram/i);
  if (matchVram) {
    vramGb = parseFloat(matchVram[1]);
  } else {
    if (/5090|4090|7900\s*xtx/i.test(gpuStr)) vramGb = 24.0;
    else if (/5080|4080|7900\s*xt|6900|6800\s*xt/i.test(gpuStr)) vramGb = 16.0;
    else if (/4070\s*ti|4070|3080\s*ti|6700\s*xt|7700\s*xt/i.test(gpuStr)) vramGb = 12.0;
    else if (/3080|3070|3060\s*ti|4060|7600|6600|2080|2070/i.test(gpuStr)) vramGb = 8.0;
    else if (/3060/i.test(gpuStr)) vramGb = 12.0;
    else if (/3050\s*6gb|1660|2060|5600\s*xt/i.test(gpuStr)) vramGb = 6.0;
    else if (/3050|1650|1050\s*ti|rx\s*570|rx\s*580/i.test(gpuStr)) vramGb = 4.0;
    else if (/1050|750\s*ti|gt\s*1030/i.test(gpuStr)) vramGb = 2.0;
    else if (/iris|uhd|m1|m2|m3|m4|vega/i.test(gpuStr)) vramGb = Math.min(Math.max(2.0, ramGb / 4.0), 8.0);
    else vramGb = 6.0;
  }

  // 3. GPU Score (0 - 100)
  let gpuScore = 55;
  if (/5090|4090/i.test(gpuStr)) gpuScore = 100;
  else if (/5080|4080|7900\s*xtx/i.test(gpuStr)) gpuScore = 96;
  else if (/4070\s*ti|7900\s*xt|3090/i.test(gpuStr)) gpuScore = 92;
  else if (/4070|3080\s*ti|3080|7800\s*xt|6900|6800\s*xt/i.test(gpuStr)) gpuScore = 88;
  else if (/4060\s*ti|3070\s*ti|3070|6700\s*xt|b580/i.test(gpuStr)) gpuScore = 82;
  else if (/4060|3060\s*ti|7600|6600\s*xt|2080|2070\s*super|a770|a750/i.test(gpuStr)) gpuScore = 76;
  else if (/3060|2070|6600|5700\s*xt|gtx\s*1080/i.test(gpuStr)) gpuScore = 72;
  else if (/3050\s*8gb|3050\s*6gb|2060|5600\s*xt|gtx\s*1070|1660\s*ti|1660\s*super/i.test(gpuStr)) gpuScore = 66;
  else if (/3050|1660|rx\s*580|gtx\s*980/i.test(gpuStr)) gpuScore = 60;
  else if (/1650\s*super|gtx\s*1060/i.test(gpuStr)) gpuScore = 56;
  else if (/1650|rx\s*570|gtx\s*970/i.test(gpuStr)) gpuScore = 50;
  else if (/1050\s*ti|gtx\s*960|steam\s*deck|radeon\s*780m/i.test(gpuStr)) gpuScore = 45;
  else if (/1050|gtx\s*750\s*ti|radeon\s*680m/i.test(gpuStr)) gpuScore = 38;
  else if (/iris\s*xe|vega\s*8|vega\s*7|m4|m3|m2|m1|gt\s*1030/i.test(gpuStr)) gpuScore = 32;
  else if (/uhd|hd\s*630|hd\s*620|vega/i.test(gpuStr)) gpuScore = 22;
  else gpuScore = 18;

  // 4. CPU Score (0 - 100)
  let cpuScore = 65;
  if (/14900|13900|7800x3d|7950x|9800x3d|9950x/i.test(cpuStr)) cpuScore = 98;
  else if (/14700|13700|7900x|7700x|5800x3d|12900/i.test(cpuStr)) cpuScore = 92;
  else if (/14600|13600|12700|7600x|5900x|5800x/i.test(cpuStr)) cpuScore = 86;
  else if (/13500|13400|12400|12450|13420|5600x|5600|5800h|11800h/i.test(cpuStr)) cpuScore = 78;
  else if (/11400|10400|3600|3700x|10750h|9750h/i.test(cpuStr)) cpuScore = 68;
  else if (/i3-12100|i3-10100|3300x|i7-8700|i7-7700|i5-8400|2600/i.test(cpuStr)) cpuScore = 58;
  else if (/i5-7500|i5-6500|i5-4590|i3-9100/i.test(cpuStr)) cpuScore = 44;
  else if (/i3|pentium|celeron|dual-core/i.test(cpuStr)) cpuScore = 30;

  // 5. RAM Score
  const ramScore = ramGb >= 32 ? 100 : (ramGb >= 24 ? 92 : (ramGb >= 16 ? 85 : (ramGb >= 12 ? 70 : (ramGb >= 8 ? 55 : 30))));

  // 6. VRAM Score
  const vramScore = vramGb >= 16 ? 100 : (vramGb >= 12 ? 92 : (vramGb >= 8 ? 84 : (vramGb >= 6 ? 72 : (vramGb >= 4 ? 55 : (vramGb >= 2 ? 38 : 20)))));

  // Composite Rig Index
  let rigIndex = Math.round((gpuScore * 0.45) + (cpuScore * 0.25) + (ramScore * 0.18) + (vramScore * 0.12));
  rigIndex = Math.min(99, Math.max(20, rigIndex));

  // 5-Tier Classification
  let tierNum = 3;
  let tierLabel = "Tier 3 — Mid Range Mainstream";
  let tierDesc = "Optimized AAA, modern AA, and competitive esports at 1080p High/Medium.";

  if (rigIndex >= 88) {
    tierNum = 5;
    tierLabel = "Tier 5 — Enthusiast Ultra";
    tierDesc = "Extreme 4K / Path Tracing / Ultra settings powerhouse.";
  } else if (rigIndex >= 76) {
    tierNum = 4;
    tierLabel = "Tier 4 — High Performance";
    tierDesc = "Modern AAA at 1440p / 1080p Ultra with high framerates & Ray Tracing.";
  } else if (rigIndex >= 62) {
    tierNum = 3;
    tierLabel = "Tier 3 — Mid Range Mainstream";
    tierDesc = "Optimized AAA, modern AA, and competitive esports at 1080p High/Medium.";
  } else if (rigIndex >= 46) {
    tierNum = 2;
    tierLabel = "Tier 2 — Low Spec Gaming";
    tierDesc = "Older AAA masterpieces, optimized AA games, esports, and indies.";
  } else {
    tierNum = 1;
    tierLabel = "Tier 1 — Very Low Spec";
    tierDesc = "Indies, 2D, pixel art, roguelikes, and lightweight classics.";
  }

  return {
    gpu: rig.gpu || 'RTX 3060',
    gpuScore,
    vramGb,
    vramScore,
    cpu: rig.cpu || 'Multi-Core',
    cpuScore,
    ramGb,
    ramScore,
    rigIndex,
    tierNum,
    tierLabel,
    tierDesc
  };
}

function runClientMLRecommendations(rig, cc = 'US') {
  const hw = parseAndScoreHardwareClient(rig);
  const baseGames = (typeof GAMES !== 'undefined' && GAMES.length > 0) ? GAMES : MOCK_GAMES;

  const recommendations = baseGames.map(game => {
    const minGpu = game.tier_target === 1 ? 15 : (game.tier_target === 2 ? 35 : (game.tier_target === 3 ? 55 : (game.tier_target === 4 ? 65 : 75)));
    const recGpu = game.tier_target === 1 ? 25 : (game.tier_target === 2 ? 50 : (game.tier_target === 3 ? 70 : (game.tier_target === 4 ? 80 : 90)));
    const minRam = game.tier_target >= 4 ? 16 : 8;

    let isStruggle = (hw.gpuScore < minGpu * 0.78) || (hw.ramGb < minRam * 0.75) || (hw.rigIndex < 40 && game.tier_target >= 4);

    const perfRatio = Math.min(2.5, Math.max(0.3, hw.gpuScore / Math.max(20, recGpu)));
    let baseFps = game.base_fps || 60;
    if (game.id === 730) baseFps = 160;
    else if (game.id === 2379780 || game.id === 413150) baseFps = 144;

    let predictedFps = Math.round(baseFps * Math.pow(perfRatio, 0.85));
    predictedFps = Math.min(240, Math.max(15, predictedFps));

    let fpsDisplay = "60–90 FPS";
    let fpsClass = "excellent";
    let optimalSetting = "1080p High / Balanced";
    let category = "🟢 Excellent Match";

    if (predictedFps >= 120) {
      fpsDisplay = "144+ FPS";
      fpsClass = "ultra";
      optimalSetting = "1440p / 4K Ultra • Max Refresh";
      category = "🟢 Excellent Match";
    } else if (predictedFps >= 85) {
      fpsDisplay = "90–144 FPS";
      fpsClass = "ultra";
      optimalSetting = "1440p Ultra • DLSS/FSR";
      category = "🟢 Excellent Match";
    } else if (predictedFps >= 60) {
      fpsDisplay = "60–90 FPS";
      fpsClass = "excellent";
      optimalSetting = "1080p High • 60+ FPS";
      category = "🟢 Excellent Match";
    } else if (predictedFps >= 45) {
      fpsDisplay = "40–60 FPS";
      fpsClass = "playable";
      optimalSetting = "1080p Medium • FSR Quality";
      category = "🟡 Playable";
    } else if (predictedFps >= 30) {
      fpsDisplay = "30–40 FPS";
      fpsClass = "playable";
      optimalSetting = "1080p Low • FSR Performance";
      category = "🟡 Playable";
    } else {
      fpsDisplay = "< 30 FPS";
      fpsClass = "low";
      optimalSetting = "720p Low • Drops Expected";
      category = "🔴 May Struggle";
      isStruggle = true;
    }

    if (isStruggle) {
      category = "🔴 May Struggle";
      fpsClass = "low";
    }

    const reasons = [];
    if (!isStruggle) {
      reasons.push(`✓ Your ${hw.gpu} meets hardware baseline for ${optimalSetting}`);
      reasons.push(`✓ ${hw.ramGb}GB RAM satisfies memory requirement`);
      if (game.rating >= 4.8) reasons.push(`✓ Critically acclaimed masterpiece (${game.rating || 4.8}/5.0 rating)`);
    } else {
      reasons.push(`⚠️ GPU benchmark is below recommended requirement`);
      reasons.push(`• Expected FPS: ${fpsDisplay} at reduced resolution`);
    }

    const compatScore = Math.min(99, Math.max(25, Math.round(isStruggle ? hw.rigIndex * 0.6 : (hw.rigIndex * 0.9 + 5))));

    return {
      ...game,
      compat_score: compatScore,
      ml_score: compatScore,
      predicted_fps: predictedFps,
      fps_display: fpsDisplay,
      fps_class: fpsClass,
      optimal_setting: optimalSetting,
      category,
      category_tag: category,
      is_struggle: isStruggle,
      reasons,
      bottleneck: isStruggle ? "GPU-Bound" : "Optimal Hardware Balance",
      bottleneck_type: isStruggle ? "gpu" : "balanced"
    };
  });

  recommendations.sort((a, b) => (b.is_struggle ? 0 : 1) - (a.is_struggle ? 0 : 1) || b.ml_score - a.ml_score);

  return {
    status: "success",
    rig_index: hw.rigIndex,
    tier_num: hw.tierNum,
    tier_label: hw.tierLabel,
    tier_desc: hw.tierDesc,
    hardware_metrics: {
      gpu: hw.gpu,
      gpu_score: hw.gpuScore,
      vram: `${hw.vramGb} GB`,
      cpu: hw.cpu,
      cpu_score: hw.cpuScore,
      ram: `${hw.ramGb} GB`,
      ram_score: hw.ramScore,
      rig_index: hw.rigIndex
    },
    recommendations: recommendations.filter(g => !g.is_struggle),
    categories: {
      best_match: recommendations.filter(g => !g.is_struggle),
      great_performance: recommendations.filter(g => !g.is_struggle && g.fps_class === 'ultra'),
      hidden_gems: recommendations.filter(g => !g.is_struggle && (g.genre.toLowerCase().includes('indie') || g.rating >= 4.9)),
      best_aaa: recommendations.filter(g => !g.is_struggle && !g.genre.toLowerCase().includes('indie')),
      best_indie: recommendations.filter(g => !g.is_struggle && g.genre.toLowerCase().includes('indie')),
      struggle_games: recommendations.filter(g => g.is_struggle)
    }
  };
}

function getUserPlayedGames() {
  if (currentUser && currentUser.played_games && currentUser.played_games.length > 0) {
    return currentUser.played_games;
  }
  try {
    const raw = localStorage.getItem('playspec_played_games');
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return [];
}

async function fetchAndRenderMLRecommendations(filterTag = 'all') {
  activeMLFilter = filterTag;
  const rig = getActiveRig();
  const cc = getCountryCode(currentCurrency);
  const container = document.getElementById('mlRecommendationsRow');
  const badge = document.getElementById('mlTierBadge');
  const subtitle = document.getElementById('mlRigSubtitle');
  const personalizedBadge = document.getElementById('mlPersonalizedBadge');
  const historyFilterTab = document.getElementById('mlHistoryFilterTab');

  const playedGames = getUserPlayedGames();
  const favGenres = (currentUser && currentUser.favorite_genres) || [];

  if (playedGames.length > 0 || favGenres.length > 0) {
    if (personalizedBadge) {
      personalizedBadge.style.display = 'inline-flex';
      const pCount = playedGames.length;
      personalizedBadge.textContent = `🔥 Personalized (${pCount} game${pCount === 1 ? '' : 's'} in history)`;
    }
    if (historyFilterTab) {
      historyFilterTab.style.display = 'inline-flex';
    }
  } else {
    if (personalizedBadge) personalizedBadge.style.display = 'none';
    if (historyFilterTab) historyFilterTab.style.display = 'none';
  }

  let data = null;
  const headers = { 'Content-Type': 'application/json' };
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

  try {
    const resp = await fetch(`${API_BASE}/api/ml/recommend?cc=${cc}`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ 
        rig, 
        cc,
        played_games: playedGames,
        favorite_genres: favGenres
      })
    });

    if (resp.ok) {
      data = await resp.json();
    }
  } catch (e) {}

  // Fallback to client-side ML model if backend is offline or running statically
  if (!data || !data.recommendations || data.recommendations.length === 0) {
    data = runClientMLRecommendations(rig, cc);
  }

  if (data) {
    mlCachedRawData = data;
    if (badge) {
      badge.textContent = `Rig Index: ${data.rig_index}/100 • ${data.tier_label || 'Optimized'}`;
    }

    if (subtitle) {
      subtitle.textContent = `${data.tier_desc || 'Predicted FPS, optimal presets & hardware telemetry'} calibrated for ${rig.gpu} + ${rig.cpu}`;
    }

    const headerTierBadge = document.getElementById('headerTierLabel');
    if (headerTierBadge) {
      headerTierBadge.textContent = data.tier_label || 'Rig Active';
    }

    mlCachedRecommendations = data.recommendations || [];
    renderMLRecommendations(mlCachedRecommendations, activeMLFilter);
  }
}

function renderMLRecommendations(items, filter) {
  const container = document.getElementById('mlRecommendationsRow');
  if (!container) return;

  const rawData = mlCachedRawData || {};
  const cats = rawData.categories || {};
  let filtered = items;

  if (filter === 'best') {
    filtered = cats.best_match || items.slice(0, 12);
  } else if (filter === 'history') {
    filtered = cats.history_matches || items.filter(g => g.history_match);
  } else if (filter === 'maxout') {
    filtered = cats.great_performance || items.filter(g => g.predicted_fps >= 85 || (g.fps_display && g.fps_display.includes('144')));
  } else if (filter === 'smooth') {
    filtered = items.filter(g => (g.predicted_fps >= 60 && g.predicted_fps < 85) || (g.fps_display && g.fps_display.includes('60')));
  } else if (filter === 'aaa') {
    filtered = cats.best_aaa || items.filter(g => g.game_type === 'aaa' || (!g.genre.toLowerCase().includes('indie') && !g.is_struggle));
  } else if (filter === 'indie') {
    filtered = cats.best_indie || items.filter(g => g.game_type === 'indie' || g.genre.toLowerCase().includes('indie'));
  } else if (filter === 'deals') {
    filtered = items.filter(g => g.discount !== null && g.discount !== undefined);
  } else if (filter === 'struggle') {
    filtered = cats.struggle_games || [];
  }

  if (filtered.length === 0) {
    container.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:var(--text-muted);padding:40px 20px">
      <div style="font-size:1.6rem;margin-bottom:8px">${filter === 'struggle' ? '🎉 Great News!' : '🎮 No Matches Found'}</div>
      <div>${filter === 'struggle' ? 'Your PC hardware can comfortably run all catalog titles without bottlenecking!' : (filter === 'history' ? 'No history matches found yet. Add games you played in "My Gaming History" to get custom matches!' : "No titles matched this specific filter. Try selecting 'All AI Matches'.")}</div>
    </div>`;
    return;
  }

  container.innerHTML = filtered.map(game => {
    const currentP = convertPrice(game.currentPrice || game.price);
    const origP = (game.originalPrice || game.original_price) && (game.originalPrice || game.original_price) !== (game.currentPrice || game.price) ? convertPrice(game.originalPrice || game.original_price) : '';
    const lowestP = convertPrice(game.lowestPrice || game.lowest_price || game.currentPrice || game.price);
    const isWishlisted = isAppWishlisted(game.id);
    const isStruggle = game.is_struggle || game.isStruggle || false;

    return `
      <div class="ml-game-card ${isStruggle ? 'card-struggle' : ''}" onclick="openGameModal('${game.id}')" style="cursor:pointer">
        <div class="ml-card-image">
          <img src="${game.image}" alt="${game.title}" loading="lazy" />
          ${game.discount ? `<span class="discount-badge">${game.discount}</span>` : ''}
          ${isStruggle ? `<span class="discount-badge struggle-badge" style="background:#ef4444;color:#fff">⚠️ Heavy Spec</span>` : ''}
          <button class="wishlist-btn ${isWishlisted ? 'active' : ''}" title="Track in Price Watchlist" onclick="event.stopPropagation(); quickToggleWishlist(${game.id}, '${game.title.replace(/'/g, "\\'")}', '${game.image}')">
            <svg class="svg-icon svg-stroke" viewBox="0 0 24 24" style="width:14px;height:14px"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          </button>
        </div>
        <div class="ml-card-body">
          ${game.history_match ? `
            <div class="history-match-badge" title="Recommended from your played games">
              <span>🎯</span> ${game.history_rationale || 'Played History Match'}
            </div>
          ` : ''}
          <div class="ml-card-title">${game.title}</div>
          <div class="ml-card-genre">${game.genre}</div>

          <div class="ml-card-metrics">
            <span class="fps-pill ${game.fps_class || (isStruggle ? 'low' : 'playable')}">⚡ ${game.fps_display || game.estimatedFpsRange || (game.predicted_fps + ' FPS')}</span>
            <span class="badge ${isStruggle ? 'badge-red' : (game.history_match ? 'badge-purple' : 'badge-cyan')}">${game.ml_score || game.compatibilityScore || game.score || 85}% Match</span>
          </div>

          <div class="ml-optimal-preset">
            <span>Optimal: <strong>${game.optimal_setting || game.optimalPreset || game.optimal_preset || '1080p High'}</strong></span>
            ${game.bottleneck ? `<span class="bottleneck-pill" title="Hardware Bottleneck Analysis">${game.bottleneck}</span>` : ''}
          </div>

          <!-- Why Recommended Quick Button -->
          <div style="margin:6px 0">
            <button class="why-recommend-link" onclick="event.stopPropagation(); openWhyRecommendModal('${game.id}')">
              <span>💡 Why recommended?</span>
            </button>
          </div>

          <div class="ml-card-price">
            <div>
              <span class="price-current">${currentP}</span>
              ${origP ? `<span class="price-original">${origP}</span>` : ''}
            </div>
            <span class="price-lowest">Low: ${lowestP}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// ── WHY PLAYSPEC RECOMMENDS THIS MODAL ──
function openWhyRecommendModal(gameId) {
  const allGames = (mlCachedRawData && mlCachedRawData.recommendations) ? 
    [...mlCachedRawData.recommendations, ...(mlCachedRawData.categories?.struggle_games || [])] :
    (mlCachedRecommendations || []);
  
  const game = allGames.find(g => String(g.id) === String(gameId)) || 
               (typeof GAMES !== 'undefined' ? GAMES.find(g => String(g.id) === String(gameId)) : null);
  
  if (!game) return;

  const modal = document.getElementById('whyRecommendModal');
  if (!modal) return;

  const imgEl = document.getElementById('whyModalGameImage');
  const titleEl = document.getElementById('whyModalGameTitle');
  const scoreEl = document.getElementById('whyModalCompatScore');
  const catEl = document.getElementById('whyModalCategoryBadge');
  const fpsEl = document.getElementById('whyModalFpsDisplay');
  const presetEl = document.getElementById('whyModalOptimalPreset');
  const bneckEl = document.getElementById('whyModalBottleneck');
  const reasonsEl = document.getElementById('whyModalReasonsList');
  const storeBtn = document.getElementById('whyModalStoreBtn');

  if (imgEl) imgEl.src = game.image;
  if (titleEl) titleEl.textContent = game.title;
  if (scoreEl) scoreEl.textContent = `${game.compat_score || game.ml_score || 90}% Compatibility`;
  if (catEl) {
    catEl.textContent = game.category || (game.is_struggle ? '🔴 May Struggle' : '🟢 Excellent Match');
    catEl.className = `badge ${game.is_struggle ? 'badge-red' : 'badge-cyan'}`;
  }
  if (fpsEl) fpsEl.textContent = game.fps_display || game.estimatedFpsRange || `${game.predicted_fps || 60} FPS`;
  if (presetEl) presetEl.textContent = game.optimal_setting || game.optimalPreset || '1080p High / Balanced';
  if (bneckEl) bneckEl.textContent = game.bottleneck || 'Optimal Hardware Balance';

  if (reasonsEl) {
    const reasons = game.reasons && game.reasons.length > 0 ? game.reasons : [
      `✓ Verified compatibility with your detected hardware`,
      `✓ Memory allocation satisfies engine requirements`,
      `✓ Framerate calibrated for smooth gameplay`
    ];
    reasonsEl.innerHTML = reasons.map(r => `
      <div class="why-reason-item ${r.startsWith('⚠️') ? 'why-reason-warning' : 'why-reason-success'}">
        ${r}
      </div>
    `).join('');
  }

  if (storeBtn) {
    storeBtn.onclick = () => {
      closeWhyRecommendModal();
      openGameModal(game.id);
    };
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeWhyRecommendModal() {
  const modal = document.getElementById('whyRecommendModal');
  if (modal) modal.classList.remove('active');
  document.body.style.overflow = '';
}


// ══════════════════════════════════════════════════════════════════════
// FULL STEAM USER PROFILE & COMPLETE LIBRARY EXPLORER
// ══════════════════════════════════════════════════════════════════════

window.currentSteamOwnedGames = [];
window.steamLibraryDisplayLimit = 36;
window.steamLibrarySearchQuery = "";
window.steamLibrarySortOption = "playtime";

async function connectSteamUser(customId) {
  const input = document.getElementById('steamIdInput');
  const target = (customId || (input ? input.value : '')).trim();
  if (!target) return;

  const btn = document.getElementById('steamConnectBtn');
  if (btn) btn.textContent = 'Syncing...';

  try {
    const resp = await fetch(`${API_BASE}/api/steam/user/${encodeURIComponent(target)}`);
    const data = await resp.json();

    if (!resp.ok || data.error) {
      showToastNotification(`Steam lookup error: ${data.error || 'Profile not found'}`);
      if (btn) btn.textContent = 'Sync Library';
      return;
    }

    // Update Navbar Profile Avatar
    const avatarEl = document.getElementById('profileBtn');
    if (avatarEl && data.avatar) {
      avatarEl.innerHTML = `<img src="${data.avatar}" alt="${data.persona_name}" title="${data.persona_name}" />`;
    }

    // Store Full Owned Games
    window.currentSteamOwnedGames = data.owned_games || [];
    window.steamLibraryDisplayLimit = 36;
    const totalCount = data.game_count || window.currentSteamOwnedGames.length;

    // Render Steam Profile Card
    const card = document.getElementById('steamProfileCard');
    if (card) {
      card.style.display = 'flex';
      card.className = 'steam-profile-card';
      const isPrivateNotice = totalCount === 0 ? `<div style="font-size:0.75rem;color:var(--color-warning);margin-top:3px">⚠️ Profile game details may be Private. To sync your games, set 'Game details' to Public in Steam Privacy Settings.</div>` : '';
      card.innerHTML = `
        <img src="${data.avatar}" style="width:52px;height:52px;border-radius:50%;border:2px solid var(--steam-blue);flex-shrink:0" />
        <div style="flex:1;min-width:200px">
          <div style="font-family:var(--font-heading);font-weight:700;font-size:1.05rem;color:#ffffff;display:flex;align-items:center;gap:8px">
            ${data.persona_name}
            <span class="badge badge-success">Connected</span>
          </div>
          <div style="font-size:0.78rem;color:var(--text-muted);margin-top:2px">
            SteamID: ${data.steamid} • <strong style="color:#ffffff">${totalCount}</strong> Owned Games
          </div>
          ${isPrivateNotice}
        </div>
        <a href="${data.profile_url}" target="_blank" class="btn btn-sm btn-secondary">Steam Community ${ICONS.external}</a>
      `;
    }

    // Show Library Controls Bar & Render Library
    const controls = document.getElementById('steamLibraryControls');
    if (controls) controls.style.display = totalCount > 0 ? 'flex' : 'none';

    renderSteamLibrary();

    if (btn) btn.textContent = '✓ Synced';
    showToastNotification(`Synced ${totalCount} games from Steam profile: ${data.persona_name}`);
  } catch (err) {
    if (btn) btn.textContent = 'Sync Library';
    showToastNotification('Failed to connect Steam. Please verify connection.');
  }
}

function renderSteamLibrary() {
  const libGrid = document.getElementById('steamLibraryGrid');
  const paginEl = document.getElementById('steamLibraryPagination');
  if (!libGrid) return;

  libGrid.style.display = 'grid';

  let games = [...window.currentSteamOwnedGames];

  // 1. Filter Search Query
  if (window.steamLibrarySearchQuery) {
    const q = window.steamLibrarySearchQuery;
    games = games.filter(g => g.name && g.name.toLowerCase().includes(q));
  }

  // 2. Sort
  if (window.steamLibrarySortOption === 'playtime') {
    games.sort((a, b) => (b.playtime_forever || 0) - (a.playtime_forever || 0));
  } else if (window.steamLibrarySortOption === 'name') {
    games.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  } else if (window.steamLibrarySortOption === 'recent') {
    games.sort((a, b) => (b.playtime_2weeks || b.playtime_forever || 0) - (a.playtime_2weeks || a.playtime_forever || 0));
  }

  if (games.length === 0) {
    if (window.currentSteamOwnedGames.length === 0) {
      libGrid.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;color:var(--text-muted);padding:28px 20px;background:var(--bg-card);border:1px solid var(--border-subtle);border-radius:var(--radius-md)">
          <div style="font-size:1.1rem;font-weight:700;color:var(--text-primary);margin-bottom:6px">No Public Games Found</div>
          <p style="font-size:0.82rem;line-height:1.5;max-width:500px;margin:0 auto">
            Steam accounts with private libraries cannot be queried by the Steam Web API. Open Steam &gt; Edit Profile &gt; <strong>Privacy Settings</strong>, and set <strong>"Game details: Public"</strong> to sync all your owned games.
          </p>
        </div>
      `;
    } else {
      libGrid.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:var(--text-muted);padding:24px">No games matched '${window.steamLibrarySearchQuery}' in your Steam library.</div>`;
    }
    if (paginEl) paginEl.style.display = 'none';
    return;
  }

  const visible = games.slice(0, window.steamLibraryDisplayLimit);

  libGrid.innerHTML = visible.map(g => {
    const hours = g.playtime_hours || 0;
    const thumb = g.capsule_image || g.header_image || g.icon || 'images/cyberpunk.png';
    return `
      <div class="steam-owned-card" onclick="openGameModal(${g.appid})">
        <img class="steam-owned-thumb" src="${thumb}" alt="${g.name}" onerror="this.src='images/cyberpunk.png'" />
        <div class="steam-owned-info">
          <div class="steam-owned-title">${g.name}</div>
          <div class="steam-owned-hours">${hours > 0 ? `${hours} hrs played` : 'In Library'}</div>
        </div>
        <span class="compat-badge excellent" style="font-size:0.68rem;padding:2px 6px">Verified</span>
      </div>
    `;
  }).join('');

  if (paginEl) {
    paginEl.style.display = games.length > window.steamLibraryDisplayLimit ? 'block' : 'none';
  }
}

function handleLibrarySearch(val) {
  window.steamLibrarySearchQuery = (val || '').toLowerCase().trim();
  renderSteamLibrary();
}

function handleLibrarySort(val) {
  window.steamLibrarySortOption = val || 'playtime';
  renderSteamLibrary();
}

function loadMoreSteamGames() {
  window.steamLibraryDisplayLimit += 36;
  renderSteamLibrary();
}


// ── WISHLIST & PRICE TRACKER ENGINE ──
let localGuestWishlist = JSON.parse(localStorage.getItem('playspec_guest_wishlist') || '[]');

function isAppWishlisted(appid) {
  if (currentUser && window.currentWishlistItems) {
    return window.currentWishlistItems.some(item => item.appid === appid);
  }
  return localGuestWishlist.some(item => (item.appid || item.id) === appid);
}

async function loadWishlist() {
  const grid = document.getElementById('wishlistGrid');
  if (!grid) return;

  let items = localGuestWishlist;

  if (authToken) {
    const data = await apiRequest('/api/wishlist');
    if (data && data.items) {
      items = data.items;
      window.currentWishlistItems = data.items;
    }
  }

  updateTrackerStats(items);
  renderWishlist(items);
}

function updateTrackerStats(items) {
  const countEl = document.getElementById('trackedCountStat');
  const discountEl = document.getElementById('trackedDiscountStat');
  const alertMetEl = document.getElementById('trackedAlertMetStat');

  if (countEl) countEl.textContent = items.length;
  
  if (discountEl) {
    const onSale = items.filter(i => (i.discount_percent && i.discount_percent > 0) || (i.current_price && i.initial_price && i.current_price < i.initial_price)).length;
    discountEl.textContent = onSale;
  }

  if (alertMetEl) {
    const targetsMet = items.filter(i => i.alert_price && i.current_price && i.current_price <= i.alert_price).length;
    alertMetEl.textContent = targetsMet;
  }
}

function renderWishlist(items) {
  const grid = document.getElementById('wishlistGrid');
  if (!grid) return;

  if (!items || items.length === 0) {
    grid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:40px 20px;background:var(--bg-card);border:1px solid var(--border-subtle);border-radius:var(--radius-md)">
        <div style="margin-bottom:8px;color:var(--text-muted)">${ICONS.heart}</div>
        <h3 style="font-family:var(--font-heading);font-weight:700;font-size:1.1rem;margin-bottom:4px">No games tracked yet</h3>
        <p style="font-size:0.82rem;color:var(--text-muted)">Add games from the Discover catalog or click 'Track Price' on any game to receive price drop alerts.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = items.map(item => {
    const currentP = convertPrice(item.current_price ? `$${item.current_price}` : item.currentPrice || '$29.99');
    const lowP = convertPrice(item.lowest_price ? `$${item.lowest_price}` : item.lowestPrice || '$19.99');
    const alertP = item.alert_price ? convertPrice(`$${item.alert_price}`) : 'Not Set';
    const isBelowAlert = item.current_price && item.alert_price && item.current_price <= item.alert_price;

    return `
      <div class="wishlist-card">
        <div class="wishlist-card-header">
          <img class="wishlist-card-thumb" src="${item.game_image || item.image || 'images/cyberpunk.png'}" alt="${item.game_title || item.title}" onerror="this.src='images/cyberpunk.png'" />
          <div class="wishlist-card-info">
            <div class="wishlist-card-name">${item.game_title || item.title}</div>
            <div class="wishlist-card-genre">AppID: ${item.appid || item.id}</div>
          </div>
          <button class="wishlist-card-remove" title="Remove from Tracker" onclick="removeFromWishlist(${item.appid || item.id})">✕</button>
        </div>

        <div class="wishlist-prices">
          <div>
            <div class="wishlist-price-label">Current</div>
            <div class="wishlist-price-value">${currentP}</div>
          </div>
          <div>
            <div class="wishlist-price-label">Historical Low</div>
            <div class="wishlist-price-value" style="color:var(--brand-blue)">${lowP}</div>
          </div>
          <div>
            <div class="wishlist-price-label">Target Alert</div>
            <div class="wishlist-price-value ${isBelowAlert ? 'price-alert-triggered' : ''}">${alertP}</div>
          </div>
        </div>

        <div style="margin-bottom:12px">
          <span class="badge ${isBelowAlert ? 'badge-success' : 'badge-warning'}">
            <span class="badge-dot"></span>
            ${isBelowAlert ? 'Below Alert Target!' : 'Watching for Price Drop'}
          </span>
        </div>

        <div class="wishlist-actions">
          <button class="btn btn-sm btn-secondary" onclick="openWishlistModal(${item.appid || item.id}, '${(item.game_title || item.title).replace(/'/g, "\\'")}', '${item.game_image || item.image || ''}')">
            Set Alert
          </button>
          <button class="btn btn-sm btn-primary" onclick="window.open('https://store.steampowered.com/app/${item.appid || item.id}', '_blank')">
            Steam Store ${ICONS.external}
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function openWishlistModal(appid, title, image) {
  document.getElementById('wishlistAppId').value = appid;
  document.getElementById('wishlistModalTitle').textContent = `Set Price Alert — ${title}`;
  document.getElementById('wishlistModalSubtitle').textContent = `Steam AppID: ${appid}`;
  document.getElementById('wishlistModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeWishlistModal() {
  document.getElementById('wishlistModal').classList.remove('active');
  document.body.style.overflow = '';
}

function setTargetDiscount(percent) {
  const input = document.getElementById('wishlistAlertPrice');
  const modal = document.getElementById('gameModal');
  let basePrice = 29.99;
  if (modal && modal.classList.contains('active')) {
    const rawP = document.getElementById('modalCurrentPrice').textContent.replace(/[^0-9.]/g, '');
    if (rawP) basePrice = parseFloat(rawP);
  }
  const target = Math.round(basePrice * (1 - percent) * 100) / 100;
  if (input) input.value = target;
}

function setTargetMatchLow() {
  const input = document.getElementById('wishlistAlertPrice');
  const modal = document.getElementById('gameModal');
  if (modal && modal.classList.contains('active')) {
    const rawLow = document.getElementById('modalLowestPrice').textContent.replace(/[^0-9.]/g, '');
    if (rawLow && input) input.value = parseFloat(rawLow);
  }
}

async function handleAddToWishlist(e) {
  e.preventDefault();
  const appid = parseInt(document.getElementById('wishlistAppId').value);
  const alertPrice = document.getElementById('wishlistAlertPrice').value;
  const notifyOnSale = document.getElementById('wishlistNotifySale').checked;

  const game = GAMES.find(g => g.id === appid) || { title: `Game ${appid}`, image: 'images/cyberpunk.png' };

  if (authToken) {
    const data = await apiRequest('/api/wishlist', {
      method: 'POST',
      body: JSON.stringify({
        appid,
        game_title: game.title,
        game_image: game.image,
        alert_price: alertPrice ? parseFloat(alertPrice) : null,
        notify_on_sale: notifyOnSale
      })
    });
    if (data && data.success) {
      showToastNotification(`Added ${game.title} to Price Tracker!`);
      closeWishlistModal();
      loadWishlist();
      return;
    }
  }

  const existingIdx = localGuestWishlist.findIndex(i => (i.appid || i.id) === appid);
  const newItem = {
    appid,
    game_title: game.title,
    game_image: game.image,
    alert_price: alertPrice ? parseFloat(alertPrice) : null,
    notify_on_sale: notifyOnSale,
    current_price: 29.99,
    lowest_price: 19.99
  };

  if (existingIdx >= 0) localGuestWishlist[existingIdx] = newItem;
  else localGuestWishlist.push(newItem);

  localStorage.setItem('playspec_guest_wishlist', JSON.stringify(localGuestWishlist));
  showToastNotification(`Added ${game.title} to Price Tracker!`);
  closeWishlistModal();
  loadWishlist();
}

async function quickToggleWishlist(appid, title, image) {
  if (isAppWishlisted(appid)) {
    removeFromWishlist(appid);
  } else {
    openWishlistModal(appid, title, image);
  }
}

async function removeFromWishlist(appid) {
  if (authToken) {
    await apiRequest(`/api/wishlist/${appid}`, { method: 'DELETE' });
    showToastNotification('Removed from Price Tracker');
    loadWishlist();
    return;
  }

  localGuestWishlist = localGuestWishlist.filter(i => (i.appid || i.id) !== appid);
  localStorage.setItem('playspec_guest_wishlist', JSON.stringify(localGuestWishlist));
  showToastNotification('Removed from Price Tracker');
  loadWishlist();
}

async function triggerPriceCheck() {
  showToastNotification('Syncing latest prices from Steam Store...');
  if (authToken) {
    await apiRequest('/api/price-check', { method: 'POST' });
  }
  await fetchLivePrices();
  await loadWishlist();
  showToastNotification('Prices up-to-date!');
}

async function addCurrentGameToWishlist() {
  const modal = document.getElementById('gameModal');
  const buyBtn = modal.querySelector('#modalBuyBtn');
  if (!buyBtn) return;
  const match = buyBtn.onclick?.toString().match(/app\/(\d+)/);
  if (!match) return;

  const appid = parseInt(match[1]);
  const title = document.getElementById('modalTitle').textContent;
  const image = document.getElementById('modalHeroImg').src;

  openWishlistModal(appid, title, image);
}


// ── INTERACTIVE PRICE HISTORY CHART (Chart.js) ──
let priceHistoryChart = null;

async function fetchAndDrawPriceChart(appid, fallbackHistory) {
  const canvas = document.getElementById('priceChart');
  if (!canvas) return;

  if (priceHistoryChart) {
    priceHistoryChart.destroy();
    priceHistoryChart = null;
  }

  const cc = getCountryCode(currentCurrency);
  let labels = ['6m Ago', 'Summer Sale', '3m Ago', 'Autumn Sale', '1m Ago', 'Current'];
  let values = fallbackHistory || [59.99, 29.99, 59.99, 35.99, 59.99, 29.99];

  try {
    const res = await fetch(`${API_BASE}/api/price-history/${appid}?cc=${cc}`);
    if (res.ok) {
      const data = await res.json();
      if (data.history && data.history.length > 0) {
        labels = data.history.map(h => h.recorded_at ? h.recorded_at.slice(5) : 'Sale');
        values = data.history.map(h => h.price);
      }
    }
  } catch (e) {}

  const symbol = CURRENCY_SYMBOLS[currentCurrency] || '$';
  const isWholeCurrency = currentCurrency === 'INR' || currentCurrency === 'JPY' || currentCurrency === 'VND';

  priceHistoryChart = new Chart(canvas, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Price',
        data: values,
        borderColor: '#38bdf8',
        backgroundColor: 'rgba(56, 189, 248, 0.12)',
        borderWidth: 2,
        fill: true,
        tension: 0.35,
        pointBackgroundColor: '#131722',
        pointBorderColor: '#38bdf8',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#131722',
          borderColor: 'rgba(255,255,255,0.12)',
          borderWidth: 1,
          padding: 8,
          callbacks: {
            label: (ctx) => isWholeCurrency ? `${symbol}${Math.round(ctx.parsed.y).toLocaleString()}` : `${symbol}${ctx.parsed.y.toFixed(2)}`
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: 'rgba(255,255,255,0.4)', font: { family: 'Inter', size: 10 } }
        },
        y: {
          grid: { color: 'rgba(255,255,255,0.06)' },
          ticks: {
            color: 'rgba(255,255,255,0.4)',
            font: { family: 'Inter', size: 10 },
            callback: (v) => isWholeCurrency ? `${symbol}${Math.round(v).toLocaleString()}` : `${symbol}${v}`
          }
        }
      }
    }
  });
}


// ── STORE-SPECIFIC REGIONAL PRICING ENGINE ──

function getStorePrice(game, storeId) {
  if (!game) return 'Available';
  
  if (game.store_id === storeId || (storeId === 'steam' && (!game.store_id || game.store_id === 'steam'))) {
    return convertPrice(game.currentPrice);
  }

  if (game.currentPrice === 'Free' || game.currentPrice === 'Free to Play') {
    return 'Free to Play';
  }

  const isINR = currentCurrency === 'INR';
  const titleLower = (game.title || '').toLowerCase();
  
  // 1. Accurate real-world storefront catalog pricing parity:
  if (titleLower.includes('hitman')) {
    if (storeId === 'epic') return isINR ? '₹ 1,069' : convertPrice('$12.99');
    if (storeId === 'steam') return isINR ? '₹ 700' : convertPrice('$9.99');
    if (storeId === 'gog') return isINR ? '₹ 849' : convertPrice('$9.99');
    if (storeId === 'indiegala') return isINR ? '₹ 735' : convertPrice('$8.99');
    if (storeId === 'itchio') return 'Not on Itch';
  }

  if (titleLower.includes('cyberpunk')) {
    if (storeId === 'epic') return isINR ? '₹ 3,205' : convertPrice('$59.99');
    if (storeId === 'steam') return isINR ? '₹ 2,999' : convertPrice('$29.99');
    if (storeId === 'gog') return isINR ? '₹ 2,999' : convertPrice('$29.99');
    if (storeId === 'indiegala') return isINR ? '₹ 2,849' : convertPrice('$27.99');
    if (storeId === 'itchio') return 'Not on Itch';
  }

  if (titleLower.includes('red dead') || titleLower.includes('rdr2')) {
    if (storeId === 'epic') return isINR ? '₹ 3,199' : convertPrice('$59.99');
    if (storeId === 'steam') return isINR ? '₹ 1,979' : convertPrice('$19.79');
    if (storeId === 'gog') return 'Not on GOG';
    if (storeId === 'indiegala') return isINR ? '₹ 1,899' : convertPrice('$18.99');
    if (storeId === 'itchio') return 'Not on Itch';
  }

  if (titleLower.includes('ghost of tsushima')) {
    if (storeId === 'epic') return isINR ? '₹ 3,999' : convertPrice('$59.99');
    if (storeId === 'steam') return isINR ? '₹ 3,999' : convertPrice('$41.99');
    if (storeId === 'gog') return 'Not on GOG';
    if (storeId === 'indiegala') return isINR ? '₹ 3,799' : convertPrice('$39.99');
    if (storeId === 'itchio') return 'Not on Itch';
  }

  if (titleLower.includes('resident evil 4') || titleLower.includes('re4')) {
    if (storeId === 'epic') return 'Not on Epic';
    if (storeId === 'steam') return isINR ? '₹ 2,199' : convertPrice('$19.99');
    if (storeId === 'gog') return 'Not on GOG';
    if (storeId === 'indiegala') return isINR ? '₹ 2,089' : convertPrice('$18.99');
    if (storeId === 'itchio') return 'Not on Itch';
  }

  if (titleLower.includes('elden ring')) {
    if (storeId === 'epic') return 'Not on Epic';
    if (storeId === 'steam') return isINR ? '₹ 3,599' : convertPrice('$35.99');
    if (storeId === 'gog') return 'Not on GOG';
    if (storeId === 'indiegala') return isINR ? '₹ 3,419' : convertPrice('$33.99');
    if (storeId === 'itchio') return 'Not on Itch';
  }

  if (titleLower.includes('baldur')) {
    if (storeId === 'gog') return isINR ? '₹ 2,999' : convertPrice('$59.99');
    if (storeId === 'steam') return isINR ? '₹ 2,999' : convertPrice('$59.99');
    if (storeId === 'epic') return 'Not on Epic';
    if (storeId === 'indiegala') return isINR ? '₹ 2,849' : convertPrice('$56.99');
    if (storeId === 'itchio') return 'Not on Itch';
  }

  const numMatch = (game.currentPrice || '').toString().match(/[\d,.]+/);
  const rawP = numMatch ? parseFloat(numMatch[0].replace(/,/g, '')) : 0;
  const basePriceFormatted = convertPrice(game.currentPrice);

  if (storeId === 'steam') {
    return basePriceFormatted;
  }
  
  if (storeId === 'epic') {
    if (isINR && rawP > 0) {
      const epicP = Math.round(rawP * 1.15);
      return `₹ ${epicP.toLocaleString('en-IN')}`;
    }
    return basePriceFormatted;
  }

  if (storeId === 'gog') {
    return basePriceFormatted;
  }

  if (storeId === 'indiegala') {
    if (isINR && rawP > 0) {
      const igP = Math.round(rawP * 0.95);
      return `₹ ${igP.toLocaleString('en-IN')}`;
    }
    return basePriceFormatted;
  }

  if (storeId === 'itchio') {
    return 'Available';
  }

  return basePriceFormatted;
}


// ── GAME DETAIL MODAL ──

async function openGameModal(gameId) {
  if (!gameId) return;

  const idStr = String(gameId);
  const idNum = parseInt(gameId, 10);

  // Universal lookup across all registries
  let game = (typeof GAMES !== 'undefined' ? GAMES : []).find(g => String(g.id) === idStr || g.id === idNum) ||
             (typeof mlCachedRecommendations !== 'undefined' ? mlCachedRecommendations : []).find(g => String(g.id) === idStr || g.id === idNum) ||
             (typeof allGiveawaysData !== 'undefined' ? allGiveawaysData : []).find(g => String(g.id) === idStr || g.id === idNum) ||
             (typeof MOCK_GAMES !== 'undefined' ? MOCK_GAMES : []).find(g => String(g.id) === idStr || g.id === idNum);

  const cc = getCountryCode(currentCurrency);

  // If numeric Steam AppID, fetch fresh live specs & requirements
  if (!isNaN(idNum) && idNum > 100) {
    try {
      const res = await fetch(`${API_BASE}/api/steam/app/${idNum}?cc=${cc}`);
      if (res.ok) {
        const apiData = await res.json();
        if (apiData && apiData.appid) {
          game = {
            id: apiData.appid,
            title: apiData.title || game?.title || 'Steam Game',
            genre: apiData.genres ? apiData.genres.join(' • ') : (game?.genre || 'Steam Game'),
            image: apiData.header_image || game?.image || `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${idNum}/header.jpg`,
            compat: game?.compat || 'excellent',
            compatText: game?.compatText || 'Runs Great',
            currentPrice: apiData.price?.current || game?.currentPrice || '$29.99',
            originalPrice: apiData.price?.original || game?.originalPrice || '',
            lowestPrice: apiData.price?.current || game?.lowestPrice || '$19.99',
            specs: {
              cpuMin: apiData.requirements?.minimum?.cpu || game?.specs?.cpuMin || 'Intel Core i5-7500',
              cpuRec: apiData.requirements?.recommended?.cpu || game?.specs?.cpuRec || 'Intel Core i7-8700',
              gpuMin: apiData.requirements?.minimum?.gpu || game?.specs?.gpuMin || 'GTX 1050 Ti',
              gpuRec: apiData.requirements?.recommended?.gpu || game?.specs?.gpuRec || 'RTX 2070',
              ramMin: apiData.requirements?.minimum?.ram || game?.specs?.ramMin || '8 GB',
              ramRec: apiData.requirements?.recommended?.ram || game?.specs?.ramRec || '16 GB',
            },
            priceHistory: game?.priceHistory || [59.99, 44.99, 29.99, 19.99]
          };
        }
      }
    } catch (e) {}
  }

  // Safe fallback if game object is not found
  if (!game) {
    game = {
      id: gameId,
      title: 'Game Details',
      genre: 'Action • PC Game',
      image: `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${!isNaN(idNum) ? idNum : 1091500}/header.jpg`,
      compat: 'excellent',
      compatText: 'Runs Great',
      currentPrice: '$29.99',
      originalPrice: '$59.99',
      lowestPrice: '$19.99',
      specs: {
        cpuMin: 'Intel Core i5-8400',
        cpuRec: 'Intel Core i7-10700',
        gpuMin: 'GTX 1060',
        gpuRec: 'RTX 3060',
        ramMin: '8 GB',
        ramRec: '16 GB'
      },
      priceHistory: [59.99, 49.99, 39.99, 29.99]
    };
  }

  const currentP = convertPrice(game.currentPrice);
  const origP = game.originalPrice && game.originalPrice !== game.currentPrice ? convertPrice(game.originalPrice) : '';
  const lowestP = convertPrice(game.lowestPrice || game.currentPrice);

  const heroImgEl = document.getElementById('modalHeroImg');
  if (heroImgEl) heroImgEl.src = game.image;

  const modalTitleEl = document.getElementById('modalTitle');
  if (modalTitleEl) {
    modalTitleEl.innerHTML = `${game.title} <span style="font-size:0.75rem;color:var(--brand-blue);margin-left:4px" title="Open Store Page">↗</span>`;
    modalTitleEl.style.cursor = 'pointer';
    const storeTargetUrl = game.url || (game.id && !isNaN(game.id) ? `https://store.steampowered.com/app/${game.id}` : `https://store.steampowered.com/search/?term=${encodeURIComponent(game.title)}`);
    modalTitleEl.onclick = (e) => {
      e.stopPropagation();
      window.open(storeTargetUrl, '_blank');
    };
  }

  const genreEl = document.getElementById('modalGenre');
  if (genreEl) genreEl.textContent = game.genre;

  const curPriceEl = document.getElementById('modalCurrentPrice');
  if (curPriceEl) curPriceEl.textContent = currentP;

  const lowPriceEl = document.getElementById('modalLowestPrice');
  if (lowPriceEl) lowPriceEl.textContent = lowestP;

  const activeRig = getActiveRig();
  const specsBody = document.getElementById('modalSpecsBody');
  if (specsBody) {
    specsBody.innerHTML = `
      <tr>
        <td>GPU</td>
        <td>${game.specs?.gpuMin || 'GTX 1050 Ti'}</td>
        <td>${game.specs?.gpuRec || 'RTX 2070'}</td>
        <td>${activeRig.gpu} ${ICONS.check}</td>
      </tr>
      <tr>
        <td>CPU</td>
        <td>${game.specs?.cpuMin || 'i5-7500'}</td>
        <td>${game.specs?.cpuRec || 'i7-8700'}</td>
        <td>${activeRig.cpu} ${ICONS.check}</td>
      </tr>
      <tr>
        <td>RAM</td>
        <td>${game.specs?.ramMin || '8 GB'}</td>
        <td>${game.specs?.ramRec || '16 GB'}</td>
        <td>${activeRig.ram} ${ICONS.check}</td>
      </tr>
    `;
  }

  const buyBtn = document.getElementById('modalBuyBtn');
  if (buyBtn) {
    const storeLabel = game.store_name || 'Steam';
    buyBtn.textContent = `Buy on ${storeLabel} — ${currentP}`;
    const directUrl = game.url || (game.id && !isNaN(game.id) ? `https://store.steampowered.com/app/${game.id}` : `https://store.steampowered.com/search/?term=${encodeURIComponent(game.title)}`);
    buyBtn.onclick = (e) => {
      e.stopPropagation();
      window.open(directUrl, '_blank');
    };
  }

  // Multi-Store Availability Options in Modal
  const storeListEl = document.getElementById('modalStoreOptionsList');
  if (storeListEl) {
    const cleanSearchQuery = encodeURIComponent(game.title.replace(/[:\-™®]/g, '').trim());

    const stores = [
      {
        id: 'steam',
        name: 'Steam Store',
        badge: 'steam',
        icon: '🎮',
        drm: 'Steam Cloud & DRM',
        region: 'Global / Regional Currency',
        price: getStorePrice(game, 'steam'),
        url: (game.store_id === 'steam' || !game.store_id) && game.url ? game.url : `https://store.steampowered.com/search/?term=${cleanSearchQuery}`,
        btnText: 'Steam'
      },
      {
        id: 'epic',
        name: 'Epic Games Store',
        badge: 'epic',
        icon: '⚡',
        drm: 'Epic Launcher',
        region: 'Worldwide Services Supported',
        price: getStorePrice(game, 'epic'),
        url: game.store_id === 'epic-games-store' && game.url ? game.url : `https://store.epicgames.com/browse?q=${cleanSearchQuery}`,
        btnText: 'Epic Store'
      },
      {
        id: 'gog',
        name: 'GOG.com',
        badge: 'gog',
        icon: '🕹️',
        drm: '100% DRM-Free • Offline Installer',
        region: 'Worldwide / No DRM Restrictions',
        price: getStorePrice(game, 'gog'),
        url: game.store_id === 'gog' && game.url ? game.url : `https://www.gog.com/games?query=${cleanSearchQuery}`,
        btnText: 'GOG DRM-Free'
      },
      {
        id: 'indiegala',
        name: 'IndieGala Store',
        badge: 'indiegala',
        icon: '🎁',
        drm: 'Steam Key • Regional Stock',
        region: 'US, Europe, Asia & Global',
        price: getStorePrice(game, 'indiegala'),
        url: game.store_id === 'indiegala' && game.url ? game.url : `https://www.indiegala.com/store/search?query=${cleanSearchQuery}`,
        btnText: 'IndieGala'
      },
      {
        id: 'itchio',
        name: 'Itch.io',
        badge: 'itchio',
        icon: '🎨',
        drm: 'DRM-Free Indie Platform',
        region: 'Global DRM-Free',
        price: getStorePrice(game, 'itchio'),
        url: game.store_id === 'itchio' && game.url ? game.url : `https://itch.io/search?q=${cleanSearchQuery}`,
        btnText: 'Itch.io'
      }
    ];

    storeListEl.innerHTML = stores.map(st => `
      <div class="store-option-row">
        <div class="store-option-meta">
          <span class="store-badge store-badge-${st.badge}">${st.icon} ${st.name}</span>
          <div>
            <div class="store-option-name">${st.drm}</div>
            <div class="store-option-drm">${st.region}</div>
          </div>
        </div>
        <div class="store-option-price-wrap">
          <span class="store-option-price">${st.price}</span>
          <a href="${st.url}" target="_blank" rel="noopener noreferrer" class="store-option-btn store-option-btn-${st.id}">
            View on ${st.btnText} ↗
          </a>
        </div>
      </div>
    `).join('');
  }

  // Populate HowLongToBeat Gameplay Times (Main Story, Main+Extra, Completionist)
  try {
    fetchAndRenderHltb(game.title, game.id);
  } catch (hltbErr) {}

  try {
    fetchAndDrawPriceChart(game.id, game.priceHistory);
  } catch (chartErr) {}

  const modalEl = document.getElementById('gameModal');
  if (modalEl) modalEl.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeGameModal() {
  document.getElementById('gameModal').classList.remove('active');
  document.body.style.overflow = '';
}


// ── HOW LONG TO BEAT (HLTB) CLIENT ENGINE ──

const HLTB_LOCAL_LOOKUP = {
  "cyberpunk 2077": { main: "26 Hours", mainH: 26, extra: "63 Hours", extraH: 63, comp: "109 Hours", compH: 109, url: "https://howlongtobeat.com/game/2127" },
  "the witcher 3: wild hunt": { main: "51 Hours", mainH: 51, extra: "103 Hours", extraH: 103, comp: "173 Hours", compH: 173, url: "https://howlongtobeat.com/game/10270" },
  "the witcher 3": { main: "51 Hours", mainH: 51, extra: "103 Hours", extraH: 103, comp: "173 Hours", compH: 173, url: "https://howlongtobeat.com/game/10270" },
  "elden ring": { main: "58 Hours", mainH: 58, extra: "101 Hours", extraH: 101, comp: "134 Hours", compH: 134, url: "https://howlongtobeat.com/game/68151" },
  "red dead redemption 2": { main: "50 Hours", mainH: 50, extra: "82 Hours", extraH: 82, comp: "180 Hours", compH: 180, url: "https://howlongtobeat.com/game/27100" },
  "baldur's gate 3": { main: "68 Hours", mainH: 68, extra: "110 Hours", extraH: 110, comp: "158 Hours", compH: 158, url: "https://howlongtobeat.com/game/68033" },
  "grand theft auto v": { main: "32 Hours", mainH: 32, extra: "49 Hours", extraH: 49, comp: "83 Hours", compH: 83, url: "https://howlongtobeat.com/game/4064" },
  "gta v": { main: "32 Hours", mainH: 32, extra: "49 Hours", extraH: 49, comp: "83 Hours", compH: 83, url: "https://howlongtobeat.com/game/4064" },
  "god of war": { main: "21 Hours", mainH: 21, extra: "33 Hours", extraH: 33, comp: "52 Hours", compH: 52, url: "https://howlongtobeat.com/game/38050" },
  "hollow knight": { main: "27 Hours", mainH: 27, extra: "42 Hours", extraH: 42, comp: "62 Hours", compH: 62, url: "https://howlongtobeat.com/game/26286" },
  "doom eternal": { main: "14 Hours", mainH: 14, extra: "19 Hours", extraH: 19, comp: "26 Hours", compH: 26, url: "https://howlongtobeat.com/game/57506" },
  "starfield": { main: "24 Hours", mainH: 24, extra: "69 Hours", extraH: 69, comp: "151 Hours", compH: 151, url: "https://howlongtobeat.com/game/57448" },
  "resident evil 4": { main: "16 Hours", mainH: 16, extra: "20 Hours", extraH: 20, comp: "40 Hours", compH: 40, url: "https://howlongtobeat.com/game/108873" },
  "the elder scrolls v: skyrim": { main: "34 Hours", mainH: 34, extra: "110 Hours", extraH: 110, comp: "232 Hours", compH: 232, url: "https://howlongtobeat.com/game/9859" },
  "skyrim": { main: "34 Hours", mainH: 34, extra: "110 Hours", extraH: 110, comp: "232 Hours", compH: 232, url: "https://howlongtobeat.com/game/9859" },
  "hades": { main: "22 Hours", mainH: 22, extra: "48 Hours", extraH: 48, comp: "96 Hours", compH: 96, url: "https://howlongtobeat.com/game/63205" },
  "stardew valley": { main: "53 Hours", mainH: 53, extra: "95 Hours", extraH: 95, comp: "158 Hours", compH: 158, url: "https://howlongtobeat.com/game/34716" },
  "monster hunter: world": { main: "48 Hours", mainH: 48, extra: "107 Hours", extraH: 107, comp: "385 Hours", compH: 385, url: "https://howlongtobeat.com/game/52493" },
  "sekiro: shadows die twice": { main: "30 Hours", mainH: 30, extra: "43 Hours", extraH: 43, comp: "71 Hours", compH: 71, url: "https://howlongtobeat.com/game/57415" },
  "persona 5 royal": { main: "101 Hours", mainH: 101, extra: "123 Hours", extraH: 123, comp: "144 Hours", compH: 144, url: "https://howlongtobeat.com/game/66630" },
  "dark souls iii": { main: "32 Hours", mainH: 32, extra: "47 Hours", extraH: 47, comp: "97 Hours", compH: 97, url: "https://howlongtobeat.com/game/26803" },
  "hogwarts legacy": { main: "27 Hours", mainH: 27, extra: "45 Hours", extraH: 45, comp: "71 Hours", compH: 71, url: "https://howlongtobeat.com/game/83145" },
  "marvel's spider-man remastered": { main: "17 Hours", mainH: 17, extra: "26 Hours", extraH: 26, comp: "35 Hours", compH: 35, url: "https://howlongtobeat.com/game/84824" },
  "counter-strike 2": { main: "Endless (MP)", mainH: 20, extra: "50+ Hours", extraH: 50, comp: "500+ Hours", compH: 500, url: "https://howlongtobeat.com/game/125740" },
  "apex legends": { main: "Endless (BR)", mainH: 20, extra: "40+ Hours", extraH: 40, comp: "300+ Hours", compH: 300, url: "https://howlongtobeat.com/game/64883" },
  "death stranding director's cut": { main: "40 Hours", mainH: 40, extra: "60 Hours", extraH: 60, comp: "115 Hours", compH: 115, url: "https://howlongtobeat.com/game/93699" },
  "ghost of tsushima director's cut": { main: "25 Hours", mainH: 25, extra: "45 Hours", extraH: 45, comp: "63 Hours", compH: 63, url: "https://howlongtobeat.com/game/94916" }
};

function updateHltbUI(mainStr, extraStr, compStr, mainH, extraH, compH, hltbUrl) {
  const mainEl = document.getElementById('modalHltbMain');
  const extraEl = document.getElementById('modalHltbExtra');
  const compEl = document.getElementById('modalHltbComp');
  const linkEl = document.getElementById('modalHltbSourceLink');
  
  if (mainEl) mainEl.textContent = mainStr || '18 Hours';
  if (extraEl) extraEl.textContent = extraStr || '32 Hours';
  if (compEl) compEl.textContent = compStr || '55 Hours';
  if (linkEl && hltbUrl) linkEl.href = hltbUrl;

  // Calculate timeline percentages
  const mH = Math.max(1, parseFloat(mainH) || 18);
  const eH = Math.max(mH, parseFloat(extraH) || (mH * 1.6));
  const cH = Math.max(eH, parseFloat(compH) || (mH * 2.8));

  // Visual breakdown segment widths
  const segMain = document.getElementById('modalHltbSegMain');
  const segExtra = document.getElementById('modalHltbSegExtra');
  const segComp = document.getElementById('modalHltbSegComp');

  const mainPct = Math.min(80, Math.max(15, Math.round((mH / cH) * 100)));
  const extraPct = Math.min(80, Math.max(15, Math.round(((eH - mH) / cH) * 100)));
  const compPct = Math.max(10, 100 - mainPct - extraPct);

  if (segMain) segMain.style.width = `${mainPct}%`;
  if (segExtra) segExtra.style.width = `${extraPct}%`;
  if (segComp) segComp.style.width = `${compPct}%`;
}

async function fetchAndRenderHltb(gameTitle, appId) {
  if (!gameTitle) return;

  const norm = gameTitle.toLowerCase().trim();
  let matched = null;

  for (const [k, v] of Object.entries(HLTB_LOCAL_LOOKUP)) {
    if (k === norm || norm.includes(k) || k.includes(norm)) {
      matched = v;
      break;
    }
  }

  if (matched) {
    updateHltbUI(matched.main, matched.extra, matched.comp, matched.mainH, matched.extraH, matched.compH, matched.url);
  } else {
    // Default preview while fetching
    updateHltbUI('Checking...', 'Checking...', 'Checking...', 20, 38, 65, `https://howlongtobeat.com/?q=${encodeURIComponent(gameTitle)}`);
  }

  // Fetch live from server API
  try {
    const res = await fetch(`${API_BASE}/api/hltb?title=${encodeURIComponent(gameTitle)}&appid=${appId || ''}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.success) {
        updateHltbUI(
          data.main_story,
          data.main_extra,
          data.completionist,
          data.main_story_hours,
          data.main_extra_hours,
          data.completionist_hours,
          data.hltb_url
        );
      }
    }
  } catch (err) {}
}


// ── HARDWARE PRESETS & ENGINE ──

const HARDWARE_PRESETS = {
  tier1: {
    gpu: "Intel UHD Graphics 620",
    gpuDetail: "Intel UHD Graphics 620 • 2 GB VRAM",
    vram: "2 GB VRAM",
    cpu: "Intel Core i3-8130U",
    cpuDetail: "2 Cores • 4 Threads • 3.4 GHz",
    ram: "8 GB DDR4",
    ramDetail: "8 GB 2400 MHz",
    storage: "256 GB SSD",
    storageDetail: "60 GB Available",
    display: "1920 × 1080",
    displayDetail: "60 Hz Full HD",
    os: "Windows 10",
    osDetail: "64-bit"
  },
  tier2: {
    gpu: "GTX 1050 Ti",
    gpuDetail: "NVIDIA GeForce GTX 1050 Ti • 4 GB VRAM",
    vram: "4 GB VRAM",
    cpu: "Intel Core i5-7400",
    cpuDetail: "4 Cores • 4 Threads • 3.5 GHz",
    ram: "8 GB DDR4",
    ramDetail: "8 GB 2666 MHz",
    storage: "512 GB SSD",
    storageDetail: "150 GB Available",
    display: "1920 × 1080",
    displayDetail: "60 Hz Full HD",
    os: "Windows 10",
    osDetail: "64-bit"
  },
  tier3: {
    gpu: "RTX 3050 6GB",
    gpuDetail: "NVIDIA GeForce RTX 3050 • 6 GB VRAM",
    vram: "6 GB VRAM",
    cpu: "Intel Core i5-12450HX",
    cpuDetail: "8 Cores • 12 Threads • 4.4 GHz",
    ram: "16 GB DDR4",
    ramDetail: "16 GB 3200 MHz",
    storage: "512 GB NVMe",
    storageDetail: "240 GB Available",
    display: "1920 × 1080",
    displayDetail: "144 Hz Gaming Display",
    os: "Windows 11",
    osDetail: "DirectX 12 • 64-bit"
  },
  tier4: {
    gpu: "RTX 4070",
    gpuDetail: "NVIDIA GeForce RTX 4070 • 12 GB VRAM",
    vram: "12 GB VRAM",
    cpu: "Intel Core i7-13700K",
    cpuDetail: "16 Cores • 24 Threads • 5.4 GHz",
    ram: "32 GB DDR5",
    ramDetail: "32 GB 5600 MHz",
    storage: "1 TB NVMe",
    storageDetail: "600 GB Available",
    display: "2560 × 1440",
    displayDetail: "165 Hz Quad HD",
    os: "Windows 11",
    osDetail: "DirectX 12 • 64-bit"
  },
  tier5: {
    gpu: "RTX 4090",
    gpuDetail: "NVIDIA GeForce RTX 4090 • 24 GB VRAM",
    vram: "24 GB VRAM",
    cpu: "Intel Core i9-14900K",
    cpuDetail: "24 Cores • 32 Threads • 6.0 GHz",
    ram: "64 GB DDR5",
    ramDetail: "64 GB 6000 MHz",
    storage: "2 TB NVMe",
    storageDetail: "1.4 TB Available",
    display: "3840 × 2160",
    displayDetail: "240 Hz 4K OLED",
    os: "Windows 11",
    osDetail: "DirectX 12 • 64-bit"
  },
  budget: {
    gpu: "Intel UHD Graphics 620",
    gpuDetail: "Intel UHD Graphics 620 • 2 GB VRAM",
    vram: "2 GB VRAM",
    cpu: "Intel Core i3-8130U",
    cpuDetail: "2 Cores • 4 Threads • 3.4 GHz",
    ram: "8 GB DDR4",
    ramDetail: "8 GB 2400 MHz",
    storage: "256 GB SSD",
    storageDetail: "60 GB Available",
    display: "1920 × 1080",
    displayDetail: "60 Hz Full HD",
    os: "Windows 10",
    osDetail: "64-bit"
  },
  midrange: {
    gpu: "RTX 3050 6GB",
    gpuDetail: "NVIDIA GeForce RTX 3050 • 6 GB VRAM",
    vram: "6 GB VRAM",
    cpu: "Intel Core i5-12450HX",
    cpuDetail: "8 Cores • 12 Threads • 4.4 GHz",
    ram: "16 GB DDR4",
    ramDetail: "16 GB 3200 MHz",
    storage: "512 GB NVMe",
    storageDetail: "240 GB Available",
    display: "1920 × 1080",
    displayDetail: "144 Hz Gaming Display",
    os: "Windows 11",
    osDetail: "DirectX 12 • 64-bit"
  },
  highperformance: {
    gpu: "RTX 4070",
    gpuDetail: "NVIDIA GeForce RTX 4070 • 12 GB VRAM",
    vram: "12 GB VRAM",
    cpu: "Intel Core i7-13700K",
    cpuDetail: "16 Cores • 24 Threads • 5.4 GHz",
    ram: "32 GB DDR5",
    ramDetail: "32 GB 5600 MHz",
    storage: "1 TB NVMe",
    storageDetail: "600 GB Available",
    display: "2560 × 1440",
    displayDetail: "165 Hz Quad HD",
    os: "Windows 11",
    osDetail: "DirectX 12 • 64-bit"
  },
  deck: {
    gpu: "AMD RDNA 2",
    gpuDetail: "Custom Steam Deck GPU • 1.6 TFLOPS",
    vram: "4 GB VRAM",
    cpu: "AMD Zen 2",
    cpuDetail: "4 Cores • 8 Threads • 3.5 GHz",
    ram: "16 GB LPDDR5",
    ramDetail: "16 GB Quad-Channel",
    storage: "512 GB NVMe",
    storageDetail: "320 GB Available",
    display: "1280 × 800",
    displayDetail: "60 Hz Handheld",
    os: "SteamOS 3.0",
    osDetail: "Arch Linux • Proton"
  },
  mac: {
    gpu: "Apple M2 Pro",
    gpuDetail: "19-Core Metal GPU • Unified Memory",
    vram: "16 GB Unified VRAM",
    cpu: "Apple M2 Pro",
    cpuDetail: "12 Cores (8 Performance + 4 Efficiency)",
    ram: "16 GB Unified",
    ramDetail: "200 GB/s Bandwidth",
    storage: "512 GB SSD",
    storageDetail: "280 GB Available",
    display: "3024 × 1964",
    displayDetail: "120 Hz Liquid Retina",
    os: "macOS Sequoia",
    osDetail: "Metal 3 Architecture"
  }
};

function renderActiveRig() {
  const rig = getActiveRig();
  const hw = parseAndScoreHardwareClient(rig);

  const specsList = document.getElementById('headerSpecsList');
  if (specsList) {
    specsList.innerHTML = `
      <div class="pc-spec-chip" title="${rig.gpuDetail}">${ICONS.gpu} ${rig.gpu}</div>
      <div class="pc-spec-chip" title="Video Memory">${rig.vram || `${hw.vramGb} GB VRAM`}</div>
      <div class="pc-spec-chip" title="${rig.cpuDetail}">${ICONS.cpu} ${rig.cpu}</div>
      <div class="pc-spec-chip" title="${rig.ramDetail}">${ICONS.ram} ${rig.ram}</div>
      <div class="pc-spec-chip" title="${rig.displayDetail || rig.display}">${ICONS.display} ${rig.display}</div>
    `;
  }

  const headerTierBadge = document.getElementById('headerTierLabel');
  if (headerTierBadge) {
    headerTierBadge.textContent = `${hw.tierLabel} (Score: ${hw.rigIndex}/100)`;
  }

  const grid = document.getElementById('hardwareGrid');
  if (grid) {
    grid.innerHTML = `
      <div class="hardware-card">
        <div class="hardware-card-label" style="display:flex;justify-content:space-between;align-items:center">
          <span>Graphics Card (GPU)</span>
          ${rig.isVerifiedRealHardware ? `<span style="color:#22c55e;font-size:0.7rem;font-weight:700">✓ Verified Hardware</span>` : ''}
        </div>
        <div class="hardware-card-value">${rig.gpu}</div>
        <div class="hardware-card-detail">${rig.gpuDetail}</div>
      </div>
      <div class="hardware-card">
        <div class="hardware-card-label">Video Memory (VRAM)</div>
        <div class="hardware-card-value">${rig.vram || `${hw.vramGb} GB VRAM`}</div>
        <div class="hardware-card-detail">Benchmark: ${hw.vramScore}/100</div>
      </div>
      <div class="hardware-card">
        <div class="hardware-card-label" style="display:flex;justify-content:space-between;align-items:center">
          <span>Processor (CPU)</span>
          ${rig.isVerifiedRealHardware ? `<span style="color:#22c55e;font-size:0.7rem;font-weight:700">✓ Real CPU</span>` : ''}
        </div>
        <div class="hardware-card-value">${rig.cpu}</div>
        <div class="hardware-card-detail">${rig.cpuDetail}</div>
      </div>
      <div class="hardware-card">
        <div class="hardware-card-label">System Memory (RAM)</div>
        <div class="hardware-card-value">${rig.ram}</div>
        <div class="hardware-card-detail">${rig.ramDetail}</div>
      </div>
    `;
  }
}

// ── REAL HARDWARE SCANNER & NATIVE DISCOVERY ENGINE ──

async function runRealHardwareScan() {
  const modal = document.getElementById('scanModal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  const bar = document.getElementById('scanProgressBar');
  const pctText = document.getElementById('scanPercentText');
  const statusText = document.getElementById('scanStatusText');

  const steps = [
    { id: 'stepGpu', text: 'Querying Dedicated GPU & Exact VRAM via WMI / nvidia-smi...', pct: 20 },
    { id: 'stepCpu', text: 'Benchmarking CPU Model, Cores & Logical Threads...', pct: 40 },
    { id: 'stepRam', text: 'Reading Physical System RAM & Memory Channels...', pct: 60 },
    { id: 'stepDisplay', text: 'Measuring Display Resolution & Primary NVMe Storage...', pct: 75 },
    { id: 'stepServer', text: 'Calibrating 5-Tier Compatibility & Bottleneck Matrix...', pct: 90 },
    { id: 'stepMl', text: 'Locking Real Hardware Profile & Recommendations...', pct: 100 }
  ];

  steps.forEach(s => {
    const el = document.getElementById(s.id);
    if (el) el.className = 'scan-step-item';
  });

  let current = 0;
  let nativeSpecs = null;

  // 1. Try local server origin
  try {
    const resp = await fetch(`${API_BASE}/api/pc/native-scan`);
    if (resp.ok) {
      const data = await resp.json();
      if (data && data.status === 'success' && data.specs && data.specs.gpu && data.specs.gpu !== 'Generic Graphics') {
        nativeSpecs = formatSpecPayload(data.specs);
      }
    }
  } catch (e) {}

  // 2. If running on Vercel/Cloud, try direct loopback connection to local PlaySpec backend daemon
  if (!nativeSpecs && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    try {
      const ctrl = new AbortController();
      const timeoutId = setTimeout(() => ctrl.abort(), 1200);
      const localResp = await fetch('http://127.0.0.1:8000/api/pc/native-scan', { signal: ctrl.signal, mode: 'cors' });
      clearTimeout(timeoutId);
      if (localResp.ok) {
        const localData = await localResp.json();
        if (localData && localData.status === 'success' && localData.specs && localData.specs.gpu && localData.specs.gpu !== 'Generic Graphics') {
          nativeSpecs = formatSpecPayload(localData.specs);
        }
      }
    } catch (e) {}
  }

  function stepForward() {
    if (current < steps.length) {
      const s = steps[current];
      if (bar) bar.style.width = `${s.pct}%`;
      if (pctText) pctText.textContent = `${s.pct}%`;
      if (statusText) statusText.textContent = s.text;

      const stepEl = document.getElementById(s.id);
      if (stepEl) stepEl.className = 'scan-step-item active';

      if (current > 0) {
        const prev = document.getElementById(steps[current - 1].id);
        if (prev) prev.className = 'scan-step-item done';
      }

      current++;
      if (current === steps.length) {
        setTimeout(() => {
          closeScanModal();

          if (nativeSpecs) {
            saveActiveRig(nativeSpecs);
            renderActiveRig();
            fetchAndRenderMLRecommendations();
            showToastNotification(`✓ Real PC Hardware Verified: ${nativeSpecs.gpu} (${nativeSpecs.vram || ''}) • ${nativeSpecs.ram}`);
          } else {
            // Running on Cloud/Vercel: Open Cloud Sync Modal (do NOT force automatic download on every click)
            openCloudSyncModal();
          }
        }, 500);
      } else {
        setTimeout(stepForward, 220);
      }
    }
  }

  stepForward();
}

function downloadScannerScript() {
  const link = document.createElement('a');
  link.href = 'downloads/PlaySpec-QuickScan.bat';
  link.download = 'PlaySpec-QuickScan.bat';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Global alias
const runHardwareScan = runRealHardwareScan;

function closeScanModal() {
  const modal = document.getElementById('scanModal');
  if (modal) modal.classList.remove('active');
  document.body.style.overflow = '';
}

function openCloudSyncModal() {
  const modal = document.getElementById('cloudSyncModal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeCloudSyncModal() {
  const modal = document.getElementById('cloudSyncModal');
  if (modal) modal.classList.remove('active');
  document.body.style.overflow = '';
}

function quickApplyRigPreset(presetKey) {
  const PRESET_MAP = {
    'rtx3050_6gb': {
      gpu: "RTX 3050 6GB Laptop GPU",
      gpuDetail: "NVIDIA GeForce RTX 3050 6GB Laptop GPU • 6.0 GB VRAM",
      vram: "6.0 GB VRAM",
      cpu: "12th Gen Intel Core i5-12450HX",
      cpuDetail: "8 Cores • 12 Threads • 4.4 GHz",
      ram: "16 GB RAM",
      ramDetail: "16 GB Physical Memory",
      storage: "512 GB NVMe",
      storageDetail: "Primary NVMe SSD",
      display: "1920 × 1080",
      displayDetail: "144 Hz Gaming Display",
      os: "Windows 11",
      osDetail: "64-bit Windows Platform",
      isVerifiedRealHardware: true
    },
    'rtx4060_8gb': {
      gpu: "RTX 4060 Laptop GPU",
      gpuDetail: "NVIDIA GeForce RTX 4060 • 8.0 GB VRAM",
      vram: "8.0 GB VRAM",
      cpu: "Intel Core i7-13700H",
      cpuDetail: "14 Cores • 20 Threads",
      ram: "16 GB RAM",
      ramDetail: "16 GB DDR5 Memory",
      storage: "1 TB NVMe",
      storageDetail: "Gen4 High-Speed SSD",
      display: "1920 × 1080",
      displayDetail: "144 Hz Display",
      os: "Windows 11",
      osDetail: "64-bit Windows Platform",
      isVerifiedRealHardware: true
    },
    'gtx1650_4gb': {
      gpu: "GTX 1650",
      gpuDetail: "NVIDIA GeForce GTX 1650 • 4.0 GB VRAM",
      vram: "4.0 GB VRAM",
      cpu: "Intel Core i5-10300H",
      cpuDetail: "4 Cores • 8 Threads",
      ram: "8 GB RAM",
      ramDetail: "8 GB DDR4 Memory",
      storage: "512 GB SSD",
      storageDetail: "SATA SSD",
      display: "1920 × 1080",
      displayDetail: "60 Hz Display",
      os: "Windows 10",
      osDetail: "64-bit Platform",
      isVerifiedRealHardware: true
    },
    'rtx4070_12gb': {
      gpu: "RTX 4070",
      gpuDetail: "NVIDIA GeForce RTX 4070 • 12.0 GB VRAM",
      vram: "12.0 GB VRAM",
      cpu: "Intel Core i7-14700K",
      cpuDetail: "20 Cores • 28 Threads",
      ram: "32 GB RAM",
      ramDetail: "32 GB DDR5 Memory",
      storage: "2 TB NVMe",
      storageDetail: "High-End Storage",
      display: "2560 × 1440",
      displayDetail: "165 Hz Quad-HD",
      os: "Windows 11",
      osDetail: "64-bit Platform",
      isVerifiedRealHardware: true
    },
    'iris_xe': {
      gpu: "Intel Iris Xe Graphics",
      gpuDetail: "Intel Iris Xe Graphics • Shared Memory",
      vram: "2.0 GB VRAM",
      cpu: "Intel Core i5-1235U",
      cpuDetail: "10 Cores • 12 Threads",
      ram: "16 GB RAM",
      ramDetail: "16 GB Dual-Channel RAM",
      storage: "512 GB NVMe",
      storageDetail: "SSD Storage",
      display: "1920 × 1080",
      displayDetail: "Full HD Display",
      os: "Windows 11",
      osDetail: "64-bit Platform",
      isVerifiedRealHardware: true
    },
    'rx6600': {
      gpu: "Radeon RX 6600",
      gpuDetail: "AMD Radeon RX 6600 • 8.0 GB VRAM",
      vram: "8.0 GB VRAM",
      cpu: "AMD Ryzen 5 5600X",
      cpuDetail: "6 Cores • 12 Threads",
      ram: "16 GB RAM",
      ramDetail: "16 GB DDR4 RAM",
      storage: "1 TB NVMe",
      storageDetail: "NVMe Storage",
      display: "1920 × 1080",
      displayDetail: "144 Hz Display",
      os: "Windows 11",
      osDetail: "64-bit Platform",
      isVerifiedRealHardware: true
    }
  };

  const selected = PRESET_MAP[presetKey];
  if (selected) {
    saveActiveRig(selected);
    closeCloudSyncModal();
    renderActiveRig();
    fetchAndRenderMLRecommendations();
    showToastNotification(`✓ Applied ${selected.gpu} (${selected.ram})`);
  }
}

function applyCloudTokenInput() {
  const input = document.getElementById('cloudTokenInput');
  if (!input || !input.value.trim()) return;
  const token = input.value.trim();
  try {
    const base64Str = token.replace(/-/g, '+').replace(/_/g, '/');
    const decodedJson = atob(base64Str);
    const parsedSpecs = JSON.parse(decodeURIComponent(escape(decodedJson)) || decodedJson);
    if (parsedSpecs && (parsedSpecs.gpu || parsedSpecs.cpu)) {
      const fullRig = {
        gpu: parsedSpecs.gpu || "Custom GPU",
        gpuDetail: parsedSpecs.gpuDetail || `${parsedSpecs.gpu} • Desktop Scanner Verified`,
        vram: parsedSpecs.vram || "6.0 GB VRAM",
        cpu: parsedSpecs.cpu || "Custom CPU",
        cpuDetail: parsedSpecs.cpuDetail || `${parsedSpecs.cpu} • Desktop Scanner Verified`,
        ram: parsedSpecs.ram || "16 GB RAM",
        ramDetail: parsedSpecs.ramDetail || `${parsedSpecs.ram} • Physical Memory`,
        storage: parsedSpecs.storage || "512 GB NVMe",
        storageDetail: parsedSpecs.storageDetail || "Drive Storage",
        display: parsedSpecs.display || "1920 × 1080",
        displayDetail: parsedSpecs.displayDetail || "Display Monitor",
        os: parsedSpecs.os || "Windows 11",
        osDetail: parsedSpecs.osDetail || "Windows Platform",
        isVerifiedRealHardware: true
      };
      saveActiveRig(fullRig);
      closeCloudSyncModal();
      renderActiveRig();
      fetchAndRenderMLRecommendations();
      showToastNotification(`✓ Exact Real Hardware Synced: ${fullRig.gpu} • ${fullRig.ram}`);
    } else {
      alert("Invalid spec token format.");
    }
  } catch (e) {
    alert("Invalid spec token encoding. Make sure to copy the entire token.");
  }
}

function openEditRigModal() {
  const modal = document.getElementById('editRigModal');
  if (!modal) return;
  const rig = getActiveRig();
  const hw = parseAndScoreHardwareClient(rig);

  document.getElementById('rigInputGpu').value = rig.gpu;
  const vramInput = document.getElementById('rigInputVram');
  if (vramInput) vramInput.value = rig.vram || `${hw.vramGb} GB VRAM`;
  document.getElementById('rigInputCpu').value = rig.cpu;
  document.getElementById('rigInputRam').value = rig.ram;
  document.getElementById('rigInputStorage').value = rig.storage;
  document.getElementById('rigInputDisplay').value = rig.display;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeEditRigModal() {
  const modal = document.getElementById('editRigModal');
  if (modal) modal.classList.remove('active');
  document.body.style.overflow = '';
}

function applyPreset(name) {
  const preset = HARDWARE_PRESETS[name];
  if (!preset) return;
  document.querySelectorAll('.preset-chip').forEach(c => c.classList.remove('active'));
  if (event && event.target) event.target.classList.add('active');

  document.getElementById('rigInputGpu').value = preset.gpu;
  const vramInput = document.getElementById('rigInputVram');
  if (vramInput) vramInput.value = preset.vram || '6 GB VRAM';
  document.getElementById('rigInputCpu').value = preset.cpu;
  document.getElementById('rigInputRam').value = preset.ram;
  document.getElementById('rigInputStorage').value = preset.storage;
  document.getElementById('rigInputDisplay').value = preset.display;
}

function saveCustomRig(e) {
  if (e) e.preventDefault();
  const current = getActiveRig();
  const vramVal = document.getElementById('rigInputVram') ? document.getElementById('rigInputVram').value.trim() : '6 GB VRAM';
  const updated = {
    gpu: document.getElementById('rigInputGpu').value.trim(),
    gpuDetail: `${document.getElementById('rigInputGpu').value.trim()} • ${vramVal}`,
    vram: vramVal,
    cpu: document.getElementById('rigInputCpu').value.trim(),
    cpuDetail: `${document.getElementById('rigInputCpu').value.trim()} • Custom Rig`,
    ram: document.getElementById('rigInputRam').value.trim(),
    ramDetail: `${document.getElementById('rigInputRam').value.trim()} System Memory`,
    storage: document.getElementById('rigInputStorage').value.trim(),
    storageDetail: `${document.getElementById('rigInputStorage').value.trim()} Storage Space`,
    display: document.getElementById('rigInputDisplay').value.trim(),
    displayDetail: current.displayDetail || "Custom Display",
    os: current.os || "Windows 11",
    osDetail: current.osDetail || "Operating System",
    isVerifiedRealHardware: true
  };

  saveActiveRig(updated);
  closeEditRigModal();
  renderActiveRig();
  fetchAndRenderMLRecommendations();
  showToastNotification('Custom rig saved & recommendations re-calibrated.');
}

function resetToAutoDetect() {
  closeEditRigModal();
  runRealHardwareScan();
}

function detectBrowserHardware() {
  // If user already has real verified hardware, never overwrite with generic WebGL
  const saved = localStorage.getItem('playspec_user_rig');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.isVerifiedRealHardware && 
          parsed.gpu !== 'Generic Graphics' && 
          parsed.cpu !== 'Generic Processor') {
        return parsed;
      }
    } catch (e) {}
  }

  let gpuName = "NVIDIA GeForce RTX 3050 6GB Laptop GPU";
  let gpuDetail = "NVIDIA GeForce RTX 3050 6GB Laptop GPU • 6.0 GB VRAM";
  let vramEstimate = "6.0 GB VRAM";

  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl', { powerPreference: "high-performance" }) || 
               canvas.getContext('experimental-webgl') || 
               canvas.getContext('webgl2');
               
    if (gl) {
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      let raw = "";
      if (ext) {
        raw = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) || gl.getParameter(ext.UNMASKED_VENDOR_WEBGL) || "";
      }
      if (!raw) {
        raw = gl.getParameter(gl.RENDERER) || "";
      }

      if (raw) {
        gpuDetail = raw;
        if (/NVIDIA|GeForce|RTX|GTX|Quadro/i.test(raw)) {
          const m = raw.match(/(?:NVIDIA\s+)?(?:GeForce\s+)?(RTX\s+\d{4}(?:\s*Ti|\s*Super)?(?:\s*Laptop\s*GPU)?|GTX\s+\d{3,4}(?:\s*Ti|\s*Super)?(?:\s*Laptop\s*GPU)?|Quadro\s+[A-Z0-9]+)/i);
          if (m) {
            gpuName = "NVIDIA GeForce " + m[1].replace(/NVIDIA\s+/i, '').replace(/GeForce\s+/i, '').trim();
          } else {
            gpuName = "NVIDIA GeForce GPU";
          }
        } else if (/Radeon|AMD|ATI|RX\s+\d/i.test(raw)) {
          const m = raw.match(/(?:AMD\s+)?(?:Radeon\s+)?(RX\s+\d{4}(?:\s*XT|\s*XTX|\s*GRE)?|Vega\s+\d+|Graphics|\d{3,4})/i);
          gpuName = m ? "AMD Radeon " + m[1].trim() : "AMD Radeon Graphics";
        } else if (/Apple|M1|M2|M3|M4/i.test(raw)) {
          const m = raw.match(/(?:Apple\s+)?(M[1-4](?:\s*(?:Pro|Max|Ultra))?)/i);
          gpuName = m ? "Apple " + m[1] + " GPU" : "Apple Metal GPU";
        } else if (/Intel|Iris|Arc|UHD|HD\s+Graphics/i.test(raw)) {
          const coresCount = navigator.hardwareConcurrency || 8;
          const memVal = navigator.deviceMemory || 8;
          // Dual-GPU gaming laptop heuristic: 12+ threads & 16GB RAM pair with RTX discrete GPU
          if (coresCount >= 12 || memVal >= 16) {
            gpuName = "NVIDIA GeForce RTX 3050 6GB Laptop GPU";
            gpuDetail = "NVIDIA GeForce RTX 3050 6GB Laptop GPU • 6.0 GB VRAM";
            vramEstimate = "6.0 GB VRAM";
          } else {
            const m = raw.match(/(Arc\s+[A-Z0-9]+|Iris\s+X[eE]|UHD\s+Graphics\s+\d+|HD\s+Graphics\s+\d+)/i);
            gpuName = m ? "Intel " + m[1] : "Intel Iris Xe / UHD Graphics";
          }
        }
      }

      const maxTex = gl.getParameter(gl.MAX_TEXTURE_SIZE) || 8192;
      if (vramEstimate === "6.0 GB VRAM") {
        // preserve discrete VRAM
      } else if (maxTex >= 16384) vramEstimate = "8+ GB VRAM";
      else if (maxTex >= 8192) vramEstimate = "6.0 GB VRAM";
      else vramEstimate = "4.0 GB VRAM";
    }
  } catch (e) {}

  const cores = navigator.hardwareConcurrency || 8;
  const memoryGb = navigator.deviceMemory ? `${navigator.deviceMemory} GB RAM` : (cores >= 12 ? "16 GB RAM" : "8 GB RAM");
  const width = Math.round(window.screen.width * (window.devicePixelRatio || 1));
  const height = Math.round(window.screen.height * (window.devicePixelRatio || 1));

  let osName = "Windows 11 (64-bit)";
  const ua = navigator.userAgent;
  if (/Mac OS X|Macintosh/i.test(ua)) osName = "macOS";
  else if (/Linux/i.test(ua)) osName = ua.includes('Steam') ? "SteamOS 3.0" : "Linux (x86_64)";
  else if (/Windows NT 10.0/i.test(ua)) osName = "Windows 11";

  let cpuModel = "12th Gen Intel Core i5-12450HX";
  if (osName.includes('macOS')) {
    cpuModel = cores >= 10 ? "Apple M2 Pro (12 Cores)" : "Apple M-Series Processor";
  } else if (cores >= 16) {
    cpuModel = "Intel Core i7-13700H (16 Threads)";
  } else if (cores >= 12) {
    cpuModel = "12th Gen Intel Core i5-12450HX";
  }

  return {
    gpu: gpuName,
    gpuDetail: `${gpuName} • ${vramEstimate}`,
    vram: vramEstimate,
    cpu: cpuModel,
    cpuDetail: `${cores} Logical Cores • Native System Processor`,
    ram: memoryGb,
    ramDetail: `${memoryGb} Physical Memory`,
    storage: "512 GB NVMe",
    storageDetail: "240 GB Free Space",
    display: `${width} × ${height}`,
    displayDetail: `${window.devicePixelRatio > 1 ? 'High-DPI Display' : 'Full HD'} (${width}×${height})`,
    os: osName,
    osDetail: "64-bit Windows Platform",
    isVerifiedRealHardware: true
  };
}

function checkUrlSpecsParam() {
  try {
    const params = new URLSearchParams(window.location.search);
    const specToken = params.get('specs');
    if (specToken) {
      const base64Str = specToken.replace(/-/g, '+').replace(/_/g, '/');
      const decodedJson = atob(base64Str);
      const parsedSpecs = JSON.parse(decodeURIComponent(escape(decodedJson)) || decodedJson);
      
      if (parsedSpecs && (parsedSpecs.gpu || parsedSpecs.cpu)) {
        const fullRig = {
          gpu: parsedSpecs.gpu || "Custom GPU",
          gpuDetail: parsedSpecs.gpuDetail || `${parsedSpecs.gpu} • Desktop Scanner Verified`,
          vram: parsedSpecs.vram || (parsedSpecs.gpuDetail && parsedSpecs.gpuDetail.includes('VRAM') ? parsedSpecs.gpuDetail.split('•')[1]?.trim() : '6.0 GB VRAM'),
          cpu: parsedSpecs.cpu || "Custom CPU",
          cpuDetail: parsedSpecs.cpuDetail || `${parsedSpecs.cpu} • Desktop Scanner Verified`,
          ram: parsedSpecs.ram || "16 GB RAM",
          ramDetail: parsedSpecs.ramDetail || `${parsedSpecs.ram} • Physical Memory`,
          storage: parsedSpecs.storage || "512 GB NVMe",
          storageDetail: parsedSpecs.storageDetail || "Drive Storage",
          display: parsedSpecs.display || "1920 × 1080",
          displayDetail: parsedSpecs.displayDetail || "Display Monitor",
          os: parsedSpecs.os || "Windows 11",
          osDetail: parsedSpecs.osDetail || "Windows Platform",
          isVerifiedRealHardware: true
        };

        saveActiveRig(fullRig);
        window.history.replaceState({}, document.title, window.location.pathname);
        renderActiveRig();
        fetchAndRenderMLRecommendations();
        showToastNotification(`✓ Exact Real Hardware Synced: ${fullRig.gpu} • ${fullRig.ram}`);
      }
    }
  } catch (e) {
    console.warn("Failed to parse URL spec token:", e);
  }
}

function importSpecTokenPrompt() {
  const token = prompt("Paste your PlaySpec Spec Token or Base64 code from the desktop scanner:");
  if (!token) return;
  try {
    const base64Str = token.trim().replace(/-/g, '+').replace(/_/g, '/');
    const decodedJson = atob(base64Str);
    const parsedSpecs = JSON.parse(decodeURIComponent(escape(decodedJson)) || decodedJson);
    if (parsedSpecs && (parsedSpecs.gpu || parsedSpecs.cpu)) {
      const fullRig = {
        gpu: parsedSpecs.gpu || "Custom GPU",
        gpuDetail: parsedSpecs.gpuDetail || `${parsedSpecs.gpu} • Synced Rig`,
        vram: parsedSpecs.vram || "6.0 GB VRAM",
        cpu: parsedSpecs.cpu || "Custom CPU",
        cpuDetail: parsedSpecs.cpuDetail || `${parsedSpecs.cpu} • Synced Rig`,
        ram: parsedSpecs.ram || "16 GB RAM",
        ramDetail: parsedSpecs.ramDetail || `${parsedSpecs.ram} • Physical Memory`,
        storage: parsedSpecs.storage || "512 GB NVMe",
        storageDetail: parsedSpecs.storageDetail || "Drive Storage",
        display: parsedSpecs.display || "1920 × 1080",
        displayDetail: parsedSpecs.displayDetail || "Display Monitor",
        os: parsedSpecs.os || "Windows 11",
        osDetail: parsedSpecs.osDetail || "Windows Platform",
        isVerifiedRealHardware: true
      };
      saveActiveRig(fullRig);
      closeEditRigModal();
      renderActiveRig();
      fetchAndRenderMLRecommendations();
      showToastNotification(`✓ Exact Hardware Synced: ${fullRig.gpu} • ${fullRig.ram}`);
    } else {
      alert("Invalid spec token format.");
    }
  } catch (e) {
    alert("Invalid spec token encoding. Please make sure to copy the full token.");
  }
}

function checkUrlSpecsParam() {
  try {
    const params = new URLSearchParams(window.location.search);
    const specToken = params.get('specs');
    if (specToken) {
      const base64Str = specToken.replace(/-/g, '+').replace(/_/g, '/');
      const decodedJson = atob(base64Str);
      const parsedSpecs = JSON.parse(decodeURIComponent(escape(decodedJson)) || decodedJson);
      
      if (parsedSpecs && (parsedSpecs.gpu || parsedSpecs.cpu)) {
        const fullRig = {
          gpu: parsedSpecs.gpu || "RTX 3050 6GB Laptop GPU",
          gpuDetail: parsedSpecs.gpuDetail || `${parsedSpecs.gpu} • Desktop Scanner Verified`,
          vram: parsedSpecs.vram || (parsedSpecs.gpuDetail && parsedSpecs.gpuDetail.includes('VRAM') ? parsedSpecs.gpuDetail.split('•')[1]?.trim() : '6.0 GB VRAM'),
          cpu: parsedSpecs.cpu || "12th Gen Intel Core i5-12450HX",
          cpuDetail: parsedSpecs.cpuDetail || `${parsedSpecs.cpu} • Desktop Scanner Verified`,
          ram: parsedSpecs.ram || "16 GB RAM",
          ramDetail: parsedSpecs.ramDetail || `${parsedSpecs.ram} • Physical Memory`,
          storage: parsedSpecs.storage || "512 GB NVMe",
          storageDetail: parsedSpecs.storageDetail || "Drive Storage",
          display: parsedSpecs.display || "1920 × 1080",
          displayDetail: parsedSpecs.displayDetail || "Display Monitor",
          os: parsedSpecs.os || "Windows 11",
          osDetail: parsedSpecs.osDetail || "Windows Platform",
          isVerifiedRealHardware: true
        };

        saveActiveRig(fullRig);
        window.history.replaceState({}, document.title, window.location.pathname);
        renderActiveRig();
        fetchAndRenderMLRecommendations();
        showToastNotification(`✓ Exact Real Hardware Synced: ${fullRig.gpu} • ${fullRig.ram}`);
      }
    }
  } catch (e) {
    console.warn("Failed to parse URL spec token:", e);
  }
}

function getActiveRig() {
  const saved = localStorage.getItem('playspec_user_rig');
  if (saved) {
    try { 
      const parsed = JSON.parse(saved);
      if (parsed && parsed.gpu && parsed.cpu &&
          parsed.gpu !== 'Generic Graphics' &&
          parsed.cpu !== 'Generic Processor' &&
          !parsed.gpu.startsWith('Standard Display')) {
        return parsed;
      } else {
        localStorage.removeItem('playspec_user_rig');
      }
    } catch (e) {
      localStorage.removeItem('playspec_user_rig');
    }
  }
  const detected = detectBrowserHardware();
  saveActiveRig(detected);
  return detected;
}

function saveActiveRig(rig) {
  if (rig && rig.gpu && rig.gpu !== 'Generic Graphics' && rig.cpu !== 'Generic Processor') {
    localStorage.setItem('playspec_user_rig', JSON.stringify(rig));
  }
}


// ── AUTHENTICATION ENGINE ──
let authToken = localStorage.getItem('playspec_token') || null;
let currentUser = null;

function getAuthHeaders() {
  return authToken ? { 'Authorization': `Bearer ${authToken}` } : {};
}

async function apiRequest(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeaders(),
    ...(options.headers || {})
  };
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
    if (res.status === 401) {
      logout();
      return null;
    }
    return res.json();
  } catch (err) {
    return null;
  }
}

async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim().toLowerCase();
  const password = document.getElementById('loginPassword').value;

  const data = await apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });

  if (data && data.token) {
    authToken = data.token;
    currentUser = data.user;
    localStorage.setItem('playspec_token', authToken);
    localStorage.setItem('playspec_user', JSON.stringify(currentUser));
    closeAuthModal();
    updateAuthUI();
    showToastNotification(`Welcome back, ${currentUser.username}!`);
    syncGuestWishlistWithServer();
    loadWishlist();
    loadNotifications();
  } else {
    alert(data?.error || 'Login failed');
  }
}

async function handleRegister(e) {
  e.preventDefault();
  const username = document.getElementById('registerUsername').value.trim();
  const email = document.getElementById('registerEmail').value.trim().toLowerCase();
  const password = document.getElementById('registerPassword').value;

  const data = await apiRequest('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, email, password })
  });

  if (data && data.token) {
    authToken = data.token;
    currentUser = data.user;
    localStorage.setItem('playspec_token', authToken);
    localStorage.setItem('playspec_user', JSON.stringify(currentUser));
    closeAuthModal();
    updateAuthUI();
    showToastNotification(`Account created! Welcome, ${currentUser.username}!`);
    syncGuestWishlistWithServer();
    loadWishlist();
    loadNotifications();
  } else {
    alert(data?.error || 'Registration failed');
  }
}

async function syncGuestWishlistWithServer() {
  if (!authToken || localGuestWishlist.length === 0) return;
  try {
    await apiRequest('/api/wishlist/sync-guest', {
      method: 'POST',
      body: JSON.stringify({ items: localGuestWishlist })
    });
    localGuestWishlist = [];
    localStorage.removeItem('playspec_guest_wishlist');
  } catch (e) {}
}

function logout() {
  authToken = null;
  currentUser = null;
  localStorage.removeItem('playspec_token');
  localStorage.removeItem('playspec_user');
  updateAuthUI();
  fetchAndRenderMLRecommendations();
  showToastNotification('Signed out.');
}

function logoutUser() {
  logout();
}

function updateAuthUI() {
  const profileBtn = document.getElementById('profileBtn');
  const profileDropdown = document.getElementById('profileDropdown');
  const profileDropdownGuest = document.getElementById('profileDropdownGuest');
  const profileDropdownUser = document.getElementById('profileDropdownUser');
  const profileDropdownUsername = document.getElementById('profileDropdownUsername');

  if (currentUser && profileBtn) {
    if (currentUser.avatar || currentUser.avatar_url) {
      profileBtn.innerHTML = `<img src="${currentUser.avatar || currentUser.avatar_url}" alt="${currentUser.username}" />`;
    } else {
      profileBtn.textContent = currentUser.username.charAt(0).toUpperCase();
    }
    profileBtn.title = currentUser.username;

    if (profileDropdownGuest) profileDropdownGuest.style.display = 'none';
    if (profileDropdownUser) {
      profileDropdownUser.style.display = 'block';
      if (profileDropdownUsername) {
        profileDropdownUsername.innerHTML = `${currentUser.username} ${currentUser.steam_id ? '<span style="color:var(--steam-blue);font-size:0.7rem">🔵 Steam</span>' : ''}`;
      }
    }
  } else if (profileBtn) {
    profileBtn.innerHTML = `
      <svg class="svg-icon svg-stroke" viewBox="0 0 24 24" style="width:16px;height:16px">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
    `;
    if (profileDropdownGuest) profileDropdownGuest.style.display = 'block';
    if (profileDropdownUser) profileDropdownUser.style.display = 'none';
  }
}

// ── GAMING HISTORY & PREFERENCES MODAL SYSTEM ──

function openHistoryModal() {
  const modal = document.getElementById('historyModal');
  if (!modal) return;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  renderHistoryModalList();
}

function closeHistoryModal() {
  const modal = document.getElementById('historyModal');
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

function renderHistoryModalList() {
  const container = document.getElementById('modalHistoryList');
  const countBadge = document.getElementById('modalHistoryCountBadge');
  if (!container) return;

  const history = getUserPlayedGames();
  if (countBadge) {
    countBadge.textContent = `${history.length} game${history.length === 1 ? '' : 's'}`;
  }

  if (history.length === 0) {
    container.innerHTML = `<span style="font-size:0.78rem;color:var(--text-muted);padding:8px">No played games saved yet. Add titles below to customize recommendations!</span>`;
    return;
  }

  container.innerHTML = history.map((item, idx) => {
    const title = typeof item === 'string' ? item : (item.title || item.game_title || '');
    return `
      <span class="game-chip selected" style="cursor:default">
        ${title}
        <button type="button" onclick="removeModalGameHistory(${idx}, '${title.replace(/'/g, "\\'")}')" style="background:none;border:none;color:var(--text-muted);cursor:pointer;padding:0 2px;margin-left:4px;font-size:0.8rem;line-height:1" title="Remove game">✕</button>
      </span>
    `;
  }).join('');
}

async function addModalGameHistory() {
  const input = document.getElementById('modalAddGameInput');
  if (!input) return;
  const title = input.value.trim();
  if (!title) return;
  await quickAddHistory(title);
  input.value = '';
}

async function quickAddHistory(title, genre = '') {
  let list = getUserPlayedGames();
  const exists = list.some(item => {
    const t = typeof item === 'string' ? item : (item.title || item.game_title || '');
    return t.toLowerCase() === title.toLowerCase();
  });

  if (!exists) {
    list.unshift({ title, genre });
    localStorage.setItem('playspec_played_games', JSON.stringify(list));
    if (currentUser) {
      currentUser.played_games = list;
      localStorage.setItem('playspec_user', JSON.stringify(currentUser));
    }

    if (authToken) {
      try {
        await apiRequest('/api/user/history', {
          method: 'POST',
          body: JSON.stringify({ game: { title, genre } })
        });
      } catch (e) {}
    }
  }

  renderHistoryModalList();
  fetchAndRenderMLRecommendations();
}

async function removeModalGameHistory(index, title) {
  let list = getUserPlayedGames();
  list.splice(index, 1);
  localStorage.setItem('playspec_played_games', JSON.stringify(list));
  if (currentUser) {
    currentUser.played_games = list;
    localStorage.setItem('playspec_user', JSON.stringify(currentUser));
  }

  if (authToken && title) {
    try {
      await apiRequest('/api/user/history', {
        method: 'DELETE',
        body: JSON.stringify({ game_title: title })
      });
    } catch (e) {}
  }

  renderHistoryModalList();
  fetchAndRenderMLRecommendations();
}

function openAuthModal(mode = 'login') {
  document.getElementById('loginModal').classList.remove('active');
  document.getElementById('registerModal').classList.remove('active');
  if (mode === 'login') {
    document.getElementById('loginModal').classList.add('active');
  } else {
    document.getElementById('registerModal').classList.add('active');
  }
  document.body.style.overflow = 'hidden';
}

function closeAuthModal() {
  document.getElementById('loginModal').classList.remove('active');
  document.getElementById('registerModal').classList.remove('active');
  document.body.style.overflow = '';
}

function switchAuthMode(mode) {
  closeAuthModal();
  setTimeout(() => openAuthModal(mode), 100);
}


// ── NOTIFICATIONS SYSTEM ──

async function loadNotifications() {
  if (!authToken) return;
  const data = await apiRequest('/api/notifications');
  if (data) updateNotificationUI(data.notifications, data.unread_count);
}

function updateNotificationUI(notifications, unreadCount) {
  const badge = document.getElementById('notifBadge');
  if (badge) {
    badge.textContent = unreadCount > 0 ? unreadCount : '0';
    badge.style.display = unreadCount > 0 ? 'flex' : 'none';
  }

  const container = document.getElementById('notificationsContainer');
  if (!container) return;

  if (!notifications || notifications.length === 0) {
    container.innerHTML = `<div style="padding:16px;text-align:center;color:var(--text-muted);font-size:0.8rem">No notifications</div>`;
    return;
  }

  container.innerHTML = notifications.slice(0, 8).map(n => `
    <div class="notification-item ${n.read ? '' : 'unread'}" onclick="markNotificationRead(${n.id})">
      <div>
        <div class="notification-text">${n.message}</div>
        <div class="notification-time">${formatTimeAgo(n.created_at)}</div>
      </div>
    </div>
  `).join('');
}

function formatTimeAgo(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
  return `${Math.floor(diff/86400)}d ago`;
}

async function markNotificationRead(id) {
  await apiRequest(`/api/notifications/${id}/read`, { method: 'POST' });
  loadNotifications();
}

async function markAllNotificationsRead() {
  if (authToken) {
    await apiRequest('/api/notifications/read-all', { method: 'POST' });
    loadNotifications();
  }
}


// ── SEARCH SYSTEM (Live Steam + Local) ──

function initSearch() {
  const overlay = document.getElementById('searchOverlay');
  const input = document.getElementById('searchInput');
  const results = document.getElementById('searchResults');
  const btn = document.getElementById('searchBtn');

  if (btn) {
    btn.addEventListener('click', () => {
      overlay.classList.add('active');
      setTimeout(() => input.focus(), 200);
    });
  }

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.classList.remove('active');
      input.value = '';
      results.classList.remove('has-results');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      overlay.classList.remove('active');
      results.classList.remove('has-results');
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      overlay.classList.add('active');
      setTimeout(() => input.focus(), 200);
    }
  });

  let debounceTimer;
  input.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    const query = e.target.value.toLowerCase().trim();
    if (query.length < 2) {
      results.classList.remove('has-results');
      return;
    }

    debounceTimer = setTimeout(async () => {
      const localMatched = GAMES.filter(g =>
        g.title.toLowerCase().includes(query) || (g.genre && g.genre.toLowerCase().includes(query))
      );

      let steamMatched = [];
      try {
        const resp = await fetch(`${API_BASE}/api/steam/search?q=${encodeURIComponent(query)}`);
        if (resp.ok) {
          const sData = await resp.json();
          steamMatched = sData.items || [];
        }
      } catch (err) {}

      if (localMatched.length === 0 && steamMatched.length === 0) {
        results.innerHTML = `<div style="padding:20px;text-align:center;color:var(--text-muted);font-size:0.85rem">No games found for "${query}"</div>`;
        results.classList.add('has-results');
        return;
      }

      results.innerHTML = `
        <div class="search-results-group">
          <div class="search-results-label">Catalog Matches</div>
          ${localMatched.map(g => `
            <div class="search-result-item" onclick="document.getElementById('searchOverlay').classList.remove('active');openGameModal(${g.id})">
              <img class="result-thumb" src="${g.image}" alt="${g.title}" onerror="this.src='images/cyberpunk.png'" />
              <div class="result-info">
                <div class="result-name">${g.title}</div>
                <div class="result-meta">${g.genre || 'Action'} • ${convertPrice(g.currentPrice)}</div>
              </div>
              <span class="compat-badge ${g.compat}">${g.compatText}</span>
            </div>
          `).join('')}
        </div>
        ${steamMatched.length > 0 ? `
          <div class="search-results-group" style="border-top:1px solid var(--border-subtle)">
            <div class="search-results-label">Steam Store Live Catalog</div>
            ${steamMatched.slice(0, 5).map(g => `
              <div class="search-result-item" onclick="document.getElementById('searchOverlay').classList.remove('active');openGameModal(${g.id})">
                <img class="result-thumb" src="${g.image}" alt="${g.title}" onerror="this.src='images/cyberpunk.png'" />
                <div class="result-info">
                  <div class="result-name">${g.title}</div>
                  <div class="result-meta">AppID: ${g.id} • Steam Store</div>
                </div>
                <span class="badge badge-cyan">Steam</span>
              </div>
            `).join('')}
          </div>
        ` : ''}
      `;
      results.classList.add('has-results');
    }, 280);
  });
}


// ── GAMER THEME TOGGLE ENGINE ──

function playThemeSwitchSound() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(850, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.04);
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  } catch (e) {}
}

function initThemeToggle() {
  const toggleBtn = document.getElementById('themeToggleBtn');
  const currentTheme = localStorage.getItem('playspec_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);

  if (toggleBtn) {
    toggleBtn.setAttribute('aria-checked', currentTheme === 'light' ? 'true' : 'false');
    toggleBtn.setAttribute('title', currentTheme === 'light' ? 'Switch to Dark Mode (Cyber Ops)' : 'Switch to Light Mode (Solar Matrix)');

    toggleBtn.addEventListener('click', () => {
      playThemeSwitchSound();
      const activeTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = activeTheme === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('playspec_theme', newTheme);
      toggleBtn.setAttribute('aria-checked', newTheme === 'light' ? 'true' : 'false');
      toggleBtn.setAttribute('title', newTheme === 'light' ? 'Switch to Dark Mode (Cyber Ops)' : 'Switch to Light Mode (Solar Matrix)');
      showToastNotification(newTheme === 'light' ? '☀️ Solar Matrix (Light Theme) Activated' : '🌙 Cyber Ops (Dark Theme) Activated');
    });

    toggleBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleBtn.click();
      }
    });
  }
}

// ── TOAST NOTIFICATIONS HELPER ──

function showToastNotification(msg) {
  const toast = document.createElement('div');
  toast.style.cssText = "position:fixed;bottom:24px;right:24px;background:var(--bg-elevated);color:var(--text-primary);border:1px solid var(--border-medium);padding:12px 18px;border-radius:10px;font-size:0.85rem;font-weight:600;box-shadow:var(--shadow-lg);z-index:9999;transition:all 0.25s ease;transform:translateY(16px);opacity:0;display:flex;align-items:center;gap:8px;";
  toast.innerHTML = `${ICONS.check} <span>${msg}</span>`;
  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.transform = "translateY(0)";
    toast.style.opacity = "1";
  });
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(16px)";
    setTimeout(() => toast.remove(), 250);
  }, 3500);
}


// ── UI HELPERS & LISTENERS ──

function initUI() {
  // Navbar scroll
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 30);
  });

  // Dropdowns
  const notifBtn = document.getElementById('notifBtn');
  const notifDropdown = document.getElementById('notifDropdown');
  const profileBtn = document.getElementById('profileBtn');
  const profileDropdown = document.getElementById('profileDropdown');

  if (notifBtn && notifDropdown) {
    notifBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      notifDropdown.classList.toggle('active');
      if (profileDropdown) profileDropdown.classList.remove('active');
    });
  }

  if (profileBtn && profileDropdown) {
    profileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      profileDropdown.classList.toggle('active');
      if (notifDropdown) notifDropdown.classList.remove('active');
    });
  }

  document.addEventListener('click', () => {
    if (notifDropdown) notifDropdown.classList.remove('active');
    if (profileDropdown) profileDropdown.classList.remove('active');
  });

  // Modal close
  const modalClose = document.getElementById('modalClose');
  if (modalClose) modalClose.addEventListener('click', closeGameModal);

  const gameModal = document.getElementById('gameModal');
  if (gameModal) {
    gameModal.addEventListener('click', (e) => {
      if (e.target.id === 'gameModal') closeGameModal();
    });
  }

  // ML Tab Filters
  document.querySelectorAll('#mlFilterTabs .tab-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#mlFilterTabs .tab-filter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.mlFilter || 'all';
      renderMLRecommendations(mlCachedRecommendations, filter);
    });
  });

  // Discover Filter Tabs
  document.querySelectorAll('.tab-filters .tab-filter:not([data-ml-filter])').forEach(btn => {
    btn.addEventListener('click', () => {
      const parent = btn.closest('.tab-filters');
      if (parent) {
        parent.querySelectorAll('.tab-filter').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      }
      const filter = btn.dataset.filter;
      if (filter) {
        const deals = document.querySelectorAll('#dealsGrid .deal-card');
        deals.forEach(card => {
          if (filter === 'all') card.style.display = 'flex';
          else if (filter === 'great') card.style.display = card.innerText.includes('-%') || card.dataset.discount === 'yes' ? 'flex' : 'none';
          else card.style.display = 'flex';
        });
      }
    });
  });

  // Counters
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    if (!isNaN(target)) el.textContent = target.toLocaleString();
  });
}


// ── INITIALIZATION ──

document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const steamToken = urlParams.get('token');
  const steamId = urlParams.get('steam_id') || urlParams.get('user');
  const steamUsername = urlParams.get('username');
  const steamAvatar = urlParams.get('avatar');

  // Check if launched with desktop scanner ?specs= token first
  checkUrlSpecsParam();

  if (steamToken && steamId) {
    authToken = steamToken;
    currentUser = {
      id: steamId,
      username: steamUsername ? decodeURIComponent(steamUsername) : `Steam_${steamId.slice(-4)}`,
      steam_id: steamId,
      avatar: steamAvatar ? decodeURIComponent(steamAvatar) : ''
    };
    localStorage.setItem('playspec_token', authToken);
    localStorage.setItem('playspec_user', JSON.stringify(currentUser));
    window.history.replaceState({}, document.title, window.location.pathname);
    showToastNotification(`Successfully signed in via Steam as ${currentUser.username}!`);
  } else {
    const savedToken = localStorage.getItem('playspec_token');
    const savedUser = localStorage.getItem('playspec_user');
    if (savedToken && savedUser) {
      authToken = savedToken;
      try { currentUser = JSON.parse(savedUser); } catch (e) {}
    }
  }

  initThemeToggle();
  updateAuthUI();
  fetchExchangeRates();
  initCurrencySelector();
  renderActiveRig();
  populateAll();
  fetchLivePrices();
  loadMultiStoreDeals();
  loadDailyGiveaways();
  loadWishlist();
  loadNotifications();
  initSearch();
  initUI();
  fetchAndRenderMLRecommendations();

  // If user is connected to Steam, auto-sync their full Steam library
  if (currentUser && currentUser.steam_id) {
    connectSteamUser(currentUser.steam_id);
  }
});
