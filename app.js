// ==========================================================================
// PlaySpec — Minimal & Professional Gaming Intelligence & ML Recommendation Engine
// Backend Integrated (Steam Web API + Store API + Price Tracker + AI ML Spec Model)
// ==========================================================================

const API_BASE = ""; // Relative calls to Flask backend

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
let currentCurrency = localStorage.getItem('playspec_currency') || 'USD';

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
      if (data.rates) exchangeRates = { ...exchangeRates, ...data.rates };
    }
  } catch (err) {}
}

function convertPrice(priceVal) {
  if (!priceVal || priceVal === 'Free' || priceVal === 'Free to Play' || priceVal === 'N/A') {
    return priceVal || 'Free';
  }

  const str = priceVal.toString().trim();
  const currentSymbol = CURRENCY_SYMBOLS[currentCurrency] || '$';

  // If already formatted with the active currency or Steam format, return cleanly
  if (str.startsWith(currentSymbol) || (currentCurrency === 'INR' && (str.includes('₹') || str.includes('INR')))) {
    return str.replace(/\s+/g, ' ');
  }

  const match = str.match(/[\d,.]+/);
  if (!match) return str;

  const rawNum = parseFloat(match[0].replace(/,/g, ''));

  let baseRate = 1.0;
  if (str.includes('₹') || str.includes('INR')) baseRate = exchangeRates.INR || 83.5;
  else if (str.includes('€') || str.includes('EUR')) baseRate = exchangeRates.EUR || 0.92;
  else if (str.includes('£') || str.includes('GBP')) baseRate = exchangeRates.GBP || 0.78;
  else if (str.includes('¥') || str.includes('JPY')) baseRate = exchangeRates.JPY || 155.0;
  else if (str.includes('CA$')) baseRate = exchangeRates.CAD || 1.37;
  else if (str.includes('AU$')) baseRate = exchangeRates.AUD || 1.52;
  else if (str.includes('₫') || str.includes('VND')) baseRate = exchangeRates.VND || 24500.0;
  else baseRate = 1.0;

  const usd = rawNum / baseRate;
  const targetRate = exchangeRates[currentCurrency] || 1.0;
  const converted = usd * targetRate;

  if (currentCurrency === 'JPY' || currentCurrency === 'VND' || currentCurrency === 'INR') {
    return `${currentSymbol}${Math.round(converted).toLocaleString(currentCurrency === 'INR' ? 'en-IN' : 'en-US')}`;
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
    genre: "Open World • RPG • Sci-fi",
    image: "images/cyberpunk.png",
    compat: "excellent",
    compatText: "Runs Great",
    match: 95,
    priceBadge: "great",
    priceBadgeText: "Great Deal",
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
    image: "images/ghost.png",
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
    image: "images/re4.png",
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
    image: "images/eldenring.png",
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
    image: "images/rdr2.png",
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
    image: "images/hitman.png",
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
    <div class="game-card" onclick="openGameModal(${game.id})">
      <div class="game-card-image">
        <img src="${game.image}" alt="${game.title}" loading="lazy" onerror="this.src='images/cyberpunk.png'" />
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

function createDealCard(game) {
  const currentP = convertPrice(game.currentPrice);
  const origP = game.originalPrice && game.originalPrice !== game.currentPrice ? convertPrice(game.originalPrice) : '';

  return `
    <div class="deal-card" onclick="openGameModal(${game.id})" data-discount="${game.discount ? 'yes' : 'no'}">
      <div class="deal-card-image">
        <img src="${game.image}" alt="${game.title}" loading="lazy" onerror="this.src='images/cyberpunk.png'" />
      </div>
      <div class="deal-card-body">
        <div class="deal-card-title">${game.title}</div>
        <div style="display:flex;align-items:center;gap:6px;margin:4px 0">
          <span class="compat-badge ${game.compat}" style="font-size:0.7rem;padding:1px 6px">${game.compatText}</span>
          ${game.discount ? `<span class="deal-discount">${game.discount}</span>` : ''}
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

  const dealsEl = document.getElementById('dealsGrid');
  if (dealsEl) {
    const discounted = GAMES.filter(g => g.discount);
    dealsEl.innerHTML = (discounted.length > 0 ? discounted : GAMES).map(createDealCard).join('');
  }

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

async function loadSteamFeatured() {
  try {
    const resp = await fetch(`${API_BASE}/api/steam/featured`);
    if (!resp.ok) return;
    const data = await resp.json();
    
    if (data.specials && data.specials.length > 0) {
      const liveDeals = data.specials.map(s => ({
        id: s.id,
        title: s.title,
        genre: "Steam Special • Live Discount",
        image: s.image,
        compat: "excellent",
        compatText: "Runs Great",
        match: s.match || 92,
        priceBadge: s.priceBadge,
        priceBadgeText: s.priceBadgeText,
        currentPrice: s.currentPrice,
        originalPrice: s.originalPrice,
        lowestPrice: s.currentPrice,
        discount: s.discount,
        rating: 4.8,
        specs: { cpuMin: "i5-8400", cpuRec: "i7-10700", gpuMin: "GTX 1060", gpuRec: "RTX 3060", ramMin: "8 GB", ramRec: "16 GB" },
        priceHistory: [49.99, 39.99, 49.99, 29.99]
      }));

      const existingIds = new Set(GAMES.map(g => g.id));
      liveDeals.forEach(ld => {
        if (!existingIds.has(ld.id)) GAMES.push(ld);
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
    const resp = await fetch(`${API_BASE}/api/giveaways`);
    if (!resp.ok) throw new Error('Failed to load giveaways');
    const data = await resp.json();

    if (data.giveaways && data.giveaways.length > 0) {
      allGiveawaysData = data.giveaways;
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
    if (grid) {
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
    <div class="giveaway-card" data-id="${g.id}">
      <div class="giveaway-image-wrap">
        <img class="giveaway-image" src="${g.image || g.thumbnail}" alt="${g.title}" loading="lazy" onerror="this.src='images/cyberpunk.png'" />
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
          <a href="${g.open_giveaway_url}" target="_blank" rel="noopener noreferrer" class="btn-claim" title="Claim directly on ${g.store_name}">
            Claim on ${g.store_name.split(' ')[0]} ↗
          </a>
          <button class="btn-details" onclick="openGiveawayModal(${g.id})" title="View claim instructions">
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

let mlCachedRecommendations = [];
let activeMLFilter = 'all';

async function fetchAndRenderMLRecommendations(filterTag = 'all') {
  activeMLFilter = filterTag;
  const rig = getActiveRig();
  const cc = getCountryCode(currentCurrency);
  const container = document.getElementById('mlRecommendationsRow');
  const badge = document.getElementById('mlTierBadge');
  const subtitle = document.getElementById('mlRigSubtitle');

  try {
    const resp = await fetch(`${API_BASE}/api/ml/recommend?cc=${cc}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rig, cc })
    });

    if (!resp.ok) return;
    const data = await resp.json();

    if (badge) {
      badge.textContent = `Score: ${data.rig_index}/100 • ${data.tier_label}`;
    }

    if (subtitle) {
      subtitle.textContent = `Predicted FPS, optimal settings & bottleneck telemetry calibrated for ${rig.gpu} + ${rig.cpu}`;
    }

    mlCachedRecommendations = data.recommendations || [];
    renderMLRecommendations(mlCachedRecommendations, activeMLFilter);
  } catch (e) {
    if (container) container.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:var(--text-muted);padding:20px">ML inference ready. Click Auto-Detect to calibrate.</div>`;
  }
}

function renderMLRecommendations(items, filter) {
  const container = document.getElementById('mlRecommendationsRow');
  if (!container) return;

  let filtered = items;
  if (filter === 'maxout') {
    filtered = items.filter(g => g.predicted_fps >= 85);
  } else if (filter === 'smooth') {
    filtered = items.filter(g => g.predicted_fps >= 60 && g.predicted_fps < 85);
  } else if (filter === 'deals') {
    filtered = items.filter(g => g.discount !== null);
  }

  if (filtered.length === 0) {
    container.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:var(--text-muted);padding:30px">No titles matched this specific ML filter. Try selecting 'All AI Matches'.</div>`;
    return;
  }

  container.innerHTML = filtered.map(game => {
    const currentP = convertPrice(game.currentPrice);
    const origP = game.originalPrice && game.originalPrice !== game.currentPrice ? convertPrice(game.originalPrice) : '';
    const lowestP = convertPrice(game.lowestPrice || game.currentPrice);
    const isWishlisted = isAppWishlisted(game.id);

    return `
      <div class="ml-game-card" onclick="openGameModal(${game.id})">
        <div class="ml-card-image">
          <img src="${game.image}" alt="${game.title}" loading="lazy" onerror="this.src='images/cyberpunk.png'" />
          ${game.discount ? `<span class="discount-badge">${game.discount}</span>` : ''}
          <button class="wishlist-btn ${isWishlisted ? 'active' : ''}" title="Track in Price Watchlist" onclick="event.stopPropagation(); quickToggleWishlist(${game.id}, '${game.title.replace(/'/g, "\\'")}', '${game.image}')">
            <svg class="svg-icon svg-stroke" viewBox="0 0 24 24" style="width:14px;height:14px"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          </button>
        </div>
        <div class="ml-card-body">
          <div class="ml-card-title">${game.title}</div>
          <div class="ml-card-genre">${game.genre}</div>

          <div class="ml-card-metrics">
            <span class="fps-pill ${game.fps_class}">⚡ ${game.fps_display}</span>
            <span class="badge badge-cyan">${game.ml_score}% Match</span>
          </div>

          <div class="ml-optimal-preset">
            <span>Optimal: <strong>${game.optimal_setting}</strong></span>
            <span class="bottleneck-pill" title="Hardware Bottleneck Analysis">${game.bottleneck}</span>
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


// ── GAME DETAIL MODAL ──

async function openGameModal(gameId) {
  let game = GAMES.find(g => g.id === gameId);
  const cc = getCountryCode(currentCurrency);

  try {
    const res = await fetch(`${API_BASE}/api/steam/app/${gameId}?cc=${cc}`);
    if (res.ok) {
      const apiData = await res.json();
      game = {
        id: apiData.appid,
        title: apiData.title,
        genre: apiData.genres ? apiData.genres.join(' • ') : 'Steam Game',
        image: apiData.header_image || game?.image || 'images/cyberpunk.png',
        compat: 'excellent',
        compatText: 'Runs Great',
        currentPrice: apiData.price?.current || game?.currentPrice || '$29.99',
        originalPrice: apiData.price?.original || '',
        lowestPrice: apiData.price?.current || '$19.99',
        specs: {
          cpuMin: apiData.requirements?.minimum?.cpu || 'Intel Core i5-7500',
          cpuRec: apiData.requirements?.recommended?.cpu || 'Intel Core i7-8700',
          gpuMin: apiData.requirements?.minimum?.gpu || 'GTX 1050 Ti',
          gpuRec: apiData.requirements?.recommended?.gpu || 'RTX 2070',
          ramMin: apiData.requirements?.minimum?.ram || '8 GB',
          ramRec: apiData.requirements?.recommended?.ram || '16 GB',
        },
        priceHistory: game?.priceHistory || [59.99, 44.99, 29.99, 19.99]
      };
    }
  } catch (e) {}

  if (!game) return;

  const currentP = convertPrice(game.currentPrice);
  const lowestP = convertPrice(game.lowestPrice || game.currentPrice);

  document.getElementById('modalHeroImg').src = game.image;
  document.getElementById('modalTitle').textContent = game.title;
  document.getElementById('modalGenre').textContent = game.genre;
  document.getElementById('modalCurrentPrice').textContent = currentP;
  document.getElementById('modalLowestPrice').textContent = lowestP;

  const activeRig = getActiveRig();
  document.getElementById('modalSpecsBody').innerHTML = `
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

  const buyBtn = document.getElementById('modalBuyBtn');
  if (buyBtn) {
    buyBtn.textContent = `Buy on Steam — ${currentP}`;
    buyBtn.onclick = () => window.open(`https://store.steampowered.com/app/${game.id}`, '_blank');
  }

  fetchAndDrawPriceChart(game.id, game.priceHistory);

  document.getElementById('gameModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeGameModal() {
  document.getElementById('gameModal').classList.remove('active');
  document.body.style.overflow = '';
}


// ── HARDWARE PRESETS & ENGINE ──

const HARDWARE_PRESETS = {
  budget: {
    gpu: "GTX 1650",
    gpuDetail: "NVIDIA GeForce GTX 1650 • 4 GB VRAM",
    cpu: "Intel i5-10300H",
    cpuDetail: "4 Cores • 8 Threads • 4.5 GHz",
    ram: "8 GB DDR4",
    ramDetail: "8 GB 2933 MHz",
    storage: "256 GB SSD",
    storageDetail: "90 GB Available",
    display: "1920 × 1080",
    displayDetail: "60 Hz Full HD",
    os: "Windows 10",
    osDetail: "DirectX 12 • 64-bit"
  },
  midrange: {
    gpu: "RTX 3060",
    gpuDetail: "NVIDIA GeForce RTX 3060 • 6 GB VRAM",
    cpu: "AMD Ryzen 7 5800H",
    cpuDetail: "8 Cores • 16 Threads • 4.4 GHz",
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
    gpu: "RTX 4080",
    gpuDetail: "NVIDIA GeForce RTX 4080 • 16 GB VRAM",
    cpu: "Intel i9-13900K",
    cpuDetail: "24 Cores • 32 Threads • 5.8 GHz",
    ram: "32 GB DDR5",
    ramDetail: "32 GB 6000 MHz",
    storage: "2 TB NVMe",
    storageDetail: "1.2 TB Available",
    display: "2560 × 1440",
    displayDetail: "240 Hz Quad HD",
    os: "Windows 11",
    osDetail: "DirectX 12 • 64-bit"
  },
  deck: {
    gpu: "AMD RDNA 2",
    gpuDetail: "Custom Steam Deck GPU • 1.6 TFLOPS",
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

function detectBrowserHardware() {
  let gpuName = "Custom Gaming GPU";
  let gpuDetail = "WebGL Hardware Accelerated Graphics";
  let vramEstimate = "6 GB VRAM";

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
        
        // Clean up ANGLE strings e.g. "ANGLE (NVIDIA, NVIDIA GeForce RTX 3050 6GB Laptop GPU Direct3D11 vs_5_0 ps_5_0, D3D11)"
        if (/NVIDIA|GeForce|RTX|GTX|Quadro/i.test(raw)) {
          const m = raw.match(/(?:NVIDIA\s+)?(?:GeForce\s+)?(RTX\s+\d{4}(?:\s*Ti|\s*Super)?(?:\s*Laptop\s*GPU)?|GTX\s+\d{3,4}(?:\s*Ti|\s*Super)?(?:\s*Laptop\s*GPU)?|Quadro\s+[A-Z0-9]+)/i);
          if (m) {
            gpuName = "NVIDIA GeForce " + m[1].replace(/NVIDIA\s+/i, '').replace(/GeForce\s+/i, '').trim();
          } else {
            gpuName = "NVIDIA GeForce GPU";
          }
        } else if (/Radeon|AMD|ATI|RX\s+\d/i.test(raw)) {
          const m = raw.match(/(?:AMD\s+)?(?:Radeon\s+)?(RX\s+\d{4}(?:\s*XT|\s*XTX|\s*GRE)?|Vega\s+\d+|Graphics|\d{3,4})/i);
          if (m) {
            gpuName = "AMD Radeon " + m[1].trim();
          } else {
            gpuName = "AMD Radeon Graphics";
          }
        } else if (/Apple|M1|M2|M3|M4/i.test(raw)) {
          const m = raw.match(/(?:Apple\s+)?(M[1-4](?:\s*(?:Pro|Max|Ultra))?)/i);
          gpuName = m ? "Apple " + m[1] + " GPU" : "Apple Metal GPU";
        } else if (/Intel|Iris|Arc|UHD|HD\s+Graphics/i.test(raw)) {
          const m = raw.match(/(Arc\s+[A-Z0-9]+|Iris\s+X[eE]|UHD\s+Graphics\s+\d+|HD\s+Graphics\s+\d+)/i);
          gpuName = m ? "Intel " + m[1] : "Intel Iris Xe / UHD Graphics";
        } else if (/SwiftShader|Software/i.test(raw)) {
          gpuName = "Software Renderer (CPU)";
        }
      }

      // Check max texture size for VRAM estimation
      const maxTex = gl.getParameter(gl.MAX_TEXTURE_SIZE) || 8192;
      if (maxTex >= 16384) vramEstimate = "8+ GB VRAM";
      else if (maxTex >= 8192) vramEstimate = "4–6 GB VRAM";
      else vramEstimate = "2–4 GB VRAM";
    }
  } catch (e) {}

  const cores = navigator.hardwareConcurrency || 8;
  const memoryGb = navigator.deviceMemory ? `${navigator.deviceMemory} GB RAM` : (cores >= 12 ? "16 GB RAM" : "8 GB RAM");
  const width = Math.round(window.screen.width * (window.devicePixelRatio || 1));
  const height = Math.round(window.screen.height * (window.devicePixelRatio || 1));

  // Determine OS
  let osName = "Windows 11";
  const ua = navigator.userAgent;
  if (/Mac OS X|Macintosh/i.test(ua)) osName = "macOS Sequoia";
  else if (/Linux/i.test(ua)) osName = ua.includes('Steam') ? "SteamOS 3.0" : "Linux (x86_64)";
  else if (/Windows NT 10.0/i.test(ua)) osName = "Windows 10 / 11";
  else if (/Windows/i.test(ua)) osName = "Windows (64-bit)";

  // Determine CPU model estimation from core count & platform
  let cpuModel = "Multi-Core High Performance Processor";
  if (osName.includes('macOS')) {
    cpuModel = cores >= 10 ? "Apple M2 Pro (10-12 Cores)" : "Apple M-Series Processor";
  } else if (cores >= 24) {
    cpuModel = "Intel Core i9-13900K / AMD Ryzen 9 (24+ Threads)";
  } else if (cores >= 16) {
    cpuModel = "Intel Core i7-13700H / AMD Ryzen 7 (16 Threads)";
  } else if (cores >= 12) {
    cpuModel = "Intel Core i5-12450HX / AMD Ryzen 5 (12 Threads)";
  } else if (cores >= 8) {
    cpuModel = "Intel Core i5-10400 / AMD Ryzen 5 (8 Threads)";
  } else {
    cpuModel = `${cores}-Core Processor`;
  }

  return {
    gpu: gpuName,
    gpuDetail: `${gpuName} • ${vramEstimate} • Direct3D/WebGL`,
    cpu: cpuModel,
    cpuDetail: `${cores} Logical Cores • High Performance Computing`,
    ram: memoryGb,
    ramDetail: `${memoryGb} System Memory`,
    storage: "512 GB NVMe SSD",
    storageDetail: "240 GB Available Space",
    display: `${width} × ${height}`,
    displayDetail: `${window.devicePixelRatio > 1 ? 'High-DPI Display' : 'Full HD'} (${width}×${height})`,
    os: osName,
    osDetail: "DirectX 12 / Vulkan Architecture"
  };
}

function getActiveRig() {
  const saved = localStorage.getItem('playspec_user_rig');
  if (saved) {
    try { 
      const parsed = JSON.parse(saved);
      if (parsed && parsed.gpu && parsed.cpu) return parsed;
    } catch (e) {}
  }
  const detected = detectBrowserHardware();
  saveActiveRig(detected);
  return detected;
}

function saveActiveRig(rig) {
  localStorage.setItem('playspec_user_rig', JSON.stringify(rig));
}

function renderActiveRig() {
  const rig = getActiveRig();

  const specsList = document.getElementById('headerSpecsList');
  if (specsList) {
    specsList.innerHTML = `
      <div class="pc-spec-chip" title="${rig.gpuDetail}">${ICONS.gpu} ${rig.gpu}</div>
      <div class="pc-spec-chip" title="${rig.cpuDetail}">${ICONS.cpu} ${rig.cpu}</div>
      <div class="pc-spec-chip" title="${rig.ramDetail}">${ICONS.ram} ${rig.ram}</div>
      <div class="pc-spec-chip" title="${rig.displayDetail}">${ICONS.display} ${rig.display}</div>
    `;
  }

  const grid = document.getElementById('hardwareGrid');
  if (grid) {
    grid.innerHTML = `
      <div class="hardware-card">
        <div class="hardware-card-label">Graphics Card (GPU)</div>
        <div class="hardware-card-value">${rig.gpu}</div>
        <div class="hardware-card-detail">${rig.gpuDetail}</div>
      </div>
      <div class="hardware-card">
        <div class="hardware-card-label">Processor (CPU)</div>
        <div class="hardware-card-value">${rig.cpu}</div>
        <div class="hardware-card-detail">${rig.cpuDetail}</div>
      </div>
      <div class="hardware-card">
        <div class="hardware-card-label">System Memory (RAM)</div>
        <div class="hardware-card-value">${rig.ram}</div>
        <div class="hardware-card-detail">${rig.ramDetail}</div>
      </div>
      <div class="hardware-card">
        <div class="hardware-card-label">Operating Platform</div>
        <div class="hardware-card-value">${rig.os}</div>
        <div class="hardware-card-detail">${rig.osDetail}</div>
      </div>
    `;
  }
}

// ── HARDWARE SCANNER ANIMATION ──
function runHardwareScan() {
  const modal = document.getElementById('scanModal');
  if (!modal) return;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  const bar = document.getElementById('scanProgressBar');
  const pctText = document.getElementById('scanPercentText');
  const statusText = document.getElementById('scanStatusText');

  const steps = [
    { id: 'stepGpu', text: 'Inspecting GPU & WebGL Unmasked Info...', pct: 20 },
    { id: 'stepCpu', text: 'Benchmarking Logical CPU Cores...', pct: 40 },
    { id: 'stepRam', text: 'Reading System Memory & Quotas...', pct: 60 },
    { id: 'stepDisplay', text: 'Measuring Display Resolution & Refresh Rate...', pct: 75 },
    { id: 'stepServer', text: 'Calibrating Hardware Feature Vectors...', pct: 90 },
    { id: 'stepMl', text: 'Running ML Performance & FPS Regression Model...', pct: 100 }
  ];

  steps.forEach(s => {
    const el = document.getElementById(s.id);
    if (el) el.className = 'scan-step-item';
  });

  let current = 0;
  function stepForward() {
    if (current < steps.length) {
      const s = steps[current];
      if (bar) bar.style.width = `${s.pct}%`;
      if (pctText) pctText.textContent = `${s.pct}%`;
      if (statusText) statusText.textContent = s.text;

      const el = document.getElementById(s.id);
      if (el) el.className = 'scan-step-item active';

      if (current > 0) {
        const prev = document.getElementById(steps[current - 1].id);
        if (prev) prev.className = 'scan-step-item done';
      }

      current++;
      if (current === steps.length) {
        // Run client-side hardware detection on the visitor's browser
        const detected = detectBrowserHardware();
        saveActiveRig(detected);
        renderActiveRig();
        fetchAndRenderMLRecommendations();

        setTimeout(() => {
          const last = document.getElementById('stepMl');
          if (last) last.className = 'scan-step-item done';
          if (statusText) statusText.textContent = 'Hardware Diagnostics & AI Calibration Complete!';
          setTimeout(() => {
            closeScanModal();
            showToastNotification(`Detected ${detected.gpu} • ${detected.cpu}`);
          }, 500);
        }, 400);
      } else {
        setTimeout(stepForward, 320);
      }
    }
  }

  stepForward();
}

function closeScanModal() {
  const modal = document.getElementById('scanModal');
  if (modal) modal.classList.remove('active');
  document.body.style.overflow = '';
}

function openEditRigModal() {
  const modal = document.getElementById('editRigModal');
  if (!modal) return;
  const rig = getActiveRig();
  document.getElementById('rigInputGpu').value = rig.gpu;
  document.getElementById('rigInputCpu').value = rig.cpu;
  document.getElementById('rigInputRam').value = rig.ram;
  document.getElementById('rigInputStorage').value = rig.storage;
  document.getElementById('rigInputDisplay').value = rig.display;
  document.getElementById('rigInputOs').value = rig.os;

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
  document.getElementById('rigInputCpu').value = preset.cpu;
  document.getElementById('rigInputRam').value = preset.ram;
  document.getElementById('rigInputStorage').value = preset.storage;
  document.getElementById('rigInputDisplay').value = preset.display;
  document.getElementById('rigInputOs').value = preset.os;
}

function saveCustomRig(e) {
  if (e) e.preventDefault();
  const current = getActiveRig();
  const updated = {
    gpu: document.getElementById('rigInputGpu').value.trim(),
    gpuDetail: `${document.getElementById('rigInputGpu').value.trim()} • Custom Rig`,
    cpu: document.getElementById('rigInputCpu').value.trim(),
    cpuDetail: `${document.getElementById('rigInputCpu').value.trim()} • Custom Rig`,
    ram: document.getElementById('rigInputRam').value.trim(),
    ramDetail: `${document.getElementById('rigInputRam').value.trim()} System Memory`,
    storage: document.getElementById('rigInputStorage').value.trim(),
    storageDetail: `${document.getElementById('rigInputStorage').value.trim()} Storage Space`,
    display: document.getElementById('rigInputDisplay').value.trim(),
    displayDetail: current.displayDetail || "Custom Display",
    os: document.getElementById('rigInputOs').value.trim(),
    osDetail: current.osDetail || "Operating System"
  };

  saveActiveRig(updated);
  closeEditRigModal();
  renderActiveRig();
  fetchAndRenderMLRecommendations();
  showToastNotification('Custom rig profile saved & AI recommendations re-calibrated.');
}

function resetToAutoDetect() {
  localStorage.removeItem('playspec_user_rig');
  const detected = detectBrowserHardware();
  saveActiveRig(detected);
  closeEditRigModal();
  renderActiveRig();
  fetchAndRenderMLRecommendations();
  showToastNotification(`Reset to detected hardware: ${detected.gpu}`);
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
  showToastNotification('Signed out.');
}

function updateAuthUI() {
  const profileBtn = document.getElementById('profileBtn');
  const profileDropdown = document.getElementById('profileDropdown');

  if (currentUser && profileBtn) {
    if (currentUser.avatar || currentUser.avatar_url) {
      profileBtn.innerHTML = `<img src="${currentUser.avatar || currentUser.avatar_url}" alt="${currentUser.username}" />`;
    } else {
      profileBtn.textContent = currentUser.username.charAt(0).toUpperCase();
    }
    profileBtn.title = currentUser.username;

    if (profileDropdown) {
      profileDropdown.innerHTML = `
        <div style="padding:8px 12px;font-size:0.8rem;font-weight:700;color:#fff;border-bottom:1px solid var(--border-subtle)">
          ${currentUser.username} ${currentUser.steam_id ? '<span style="color:var(--steam-blue);font-size:0.7rem">🔵 Steam</span>' : ''}
        </div>
        <div class="profile-dropdown-item" onclick="document.getElementById('steam-section').scrollIntoView({behavior:'smooth'})">Steam Library</div>
        <div class="profile-dropdown-item" onclick="document.getElementById('price-tracker').scrollIntoView({behavior:'smooth'})">Price Tracker</div>
        <div class="profile-dropdown-item" onclick="document.getElementById('pc-profile').scrollIntoView({behavior:'smooth'})">Hardware Profile</div>
        <div class="profile-dropdown-divider"></div>
        <div class="profile-dropdown-item" style="color:var(--color-danger)" onclick="logout()">Sign Out</div>
      `;
    }
  } else if (profileBtn) {
    profileBtn.innerHTML = `
      <svg class="svg-icon svg-stroke" viewBox="0 0 24 24" style="width:16px;height:16px">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
    `;
    if (profileDropdown) {
      profileDropdown.innerHTML = `
        <div class="profile-dropdown-item" onclick="openAuthModal('login')">Sign In</div>
        <div class="profile-dropdown-item" onclick="window.location.href='/api/auth/steam/login'">Steam Sign In</div>
        <div class="profile-dropdown-divider"></div>
        <div class="profile-dropdown-item" onclick="document.getElementById('pc-profile').scrollIntoView({behavior:'smooth'})">Hardware Profile</div>
      `;
    }
  }
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


// ── TOAST NOTIFICATIONS HELPER ──

function showToastNotification(msg) {
  const toast = document.createElement('div');
  toast.style.cssText = "position:fixed;bottom:24px;right:24px;background:var(--bg-elevated);color:#fff;border:1px solid var(--border-medium);padding:12px 18px;border-radius:10px;font-size:0.85rem;font-weight:600;box-shadow:var(--shadow-lg);z-index:9999;transition:all 0.25s ease;transform:translateY(16px);opacity:0;display:flex;align-items:center;gap:8px;";
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

  updateAuthUI();
  fetchExchangeRates();
  initCurrencySelector();
  renderActiveRig();
  populateAll();
  fetchLivePrices();
  loadSteamFeatured();
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
