// ============================================
// PlaySpec — Gaming Intelligence Dashboard
// Backend Integrated (Steam API + Store API + Currency Converter)
// ============================================

const API_BASE = ""; // Relative calls to Flask server

// ── CURRENCY CONVERTER ENGINE ──
let currentCurrency = localStorage.getItem('playspec_currency') || 'INR';

let exchangeRates = {
  USD: 1.0,
  INR: 83.5,
  EUR: 0.92,
  GBP: 0.78,
  JPY: 155.0,
  CAD: 1.37,
  AUD: 1.52
};

const CURRENCY_SYMBOLS = {
  USD: '$',
  INR: '₹',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CAD: 'CA$',
  AUD: 'AU$'
};

async function fetchExchangeRates() {
  try {
    const res = await fetch(`${API_BASE}/api/currency/rates`);
    if (res.ok) {
      const data = await res.json();
      if (data.rates) {
        exchangeRates = { ...exchangeRates, ...data.rates };
      }
    }
  } catch (err) {
    console.warn('Using default currency exchange rates');
  }
}

function convertPrice(priceStr) {
  if (!priceStr || priceStr === 'Free' || priceStr === 'Free to Play' || priceStr === 'N/A') {
    return priceStr || 'Free';
  }

  const str = priceStr.toString();
  const numericMatch = str.match(/[\d\.]+/);
  if (!numericMatch) return str;

  let val = parseFloat(numericMatch[0]);

  // Determine base input currency
  let baseRate = 1.0;
  if (str.includes('₹')) {
    baseRate = exchangeRates.INR || 83.5;
  } else if (str.includes('€')) {
    baseRate = exchangeRates.EUR || 0.92;
  } else if (str.includes('£')) {
    baseRate = exchangeRates.GBP || 0.78;
  } else if (str.includes('¥')) {
    baseRate = exchangeRates.JPY || 155.0;
  } else if (str.includes('CA$')) {
    baseRate = exchangeRates.CAD || 1.37;
  } else if (str.includes('AU$')) {
    baseRate = exchangeRates.AUD || 1.52;
  } else if (str.includes('$')) {
    baseRate = 1.0;
  }

  const usdVal = val / baseRate;
  const targetRate = exchangeRates[currentCurrency] || 1.0;
  const converted = usdVal * targetRate;
  const symbol = CURRENCY_SYMBOLS[currentCurrency] || '$';

  if (currentCurrency === 'JPY') {
    return `${symbol}${Math.round(converted).toLocaleString()}`;
  }
  return `${symbol}${converted.toFixed(2)}`;
}

function initCurrencySelector() {
  const select = document.getElementById('currencySelect');
  if (!select) return;

  select.value = currentCurrency;
  select.addEventListener('change', (e) => {
    currentCurrency = e.target.value;
    localStorage.setItem('playspec_currency', currentCurrency);
    populateAll();
  });
}


// Fallback / Curated local games
const MOCK_GAMES = [
  {
    id: 1091500,
    title: "Cyberpunk 2077",
    genre: "RPG • Open World • Sci-fi",
    image: "images/cyberpunk.png",
    compat: "excellent",
    compatText: "🟢 Runs Great",
    match: 94,
    priceBadge: "great",
    priceBadgeText: "💰 Great Price",
    currentPrice: "₹1,299",
    originalPrice: "₹1,999",
    lowestPrice: "₹999",
    discount: "-35%",
    rating: 4.7,
    year: 2020,
    size: "70 GB",
    specs: {
      cpuMin: "i5-7500", cpuRec: "i7-8700",
      gpuMin: "GTX 1050 Ti", gpuRec: "RTX 2070",
      ramMin: "8 GB", ramRec: "16 GB"
    },
    priceHistory: [2999, 2499, 1999, 1799, 1499, 1299],
    estimatedFps: "60–80 FPS",
    estimatedSettings: "1080p High"
  },
  {
    id: 1151640,
    title: "Ghost of Tsushima DIRECTOR'S CUT",
    genre: "Action • Adventure • Open World",
    image: "images/ghost.png",
    compat: "excellent",
    compatText: "🟢 Runs Great",
    match: 92,
    priceBadge: "normal",
    priceBadgeText: "🟡 Normal Sale",
    currentPrice: "₹1,499",
    originalPrice: "₹2,999",
    lowestPrice: "₹1,299",
    discount: "-50%",
    rating: 4.8,
    year: 2024,
    size: "55 GB",
    specs: {
      cpuMin: "i5-8400", cpuRec: "i7-9700K",
      gpuMin: "GTX 1060", gpuRec: "RTX 2070",
      ramMin: "8 GB", ramRec: "16 GB"
    },
    priceHistory: [3499, 2999, 2499, 1999, 1499, 1499],
    estimatedFps: "55–70 FPS",
    estimatedSettings: "1080p High"
  },
  {
    id: 2050650,
    title: "Resident Evil 4",
    genre: "Survival Horror • Action",
    image: "images/re4.png",
    compat: "excellent",
    compatText: "🟢 Runs Great",
    match: 91,
    priceBadge: "great",
    priceBadgeText: "💰 Great Price",
    currentPrice: "₹999",
    originalPrice: "₹2,499",
    lowestPrice: "₹899",
    discount: "-60%",
    rating: 4.9,
    year: 2023,
    size: "48 GB",
    specs: {
      cpuMin: "i5-8400", cpuRec: "i7-8700",
      gpuMin: "GTX 1060", gpuRec: "RTX 2060",
      ramMin: "8 GB", ramRec: "16 GB"
    },
    priceHistory: [2499, 1999, 1499, 1299, 999, 999],
    estimatedFps: "70–90 FPS",
    estimatedSettings: "1080p High"
  },
  {
    id: 1245620,
    title: "Elden Ring",
    genre: "Action RPG • Dark Fantasy",
    image: "images/eldenring.png",
    compat: "playable",
    compatText: "🟡 Runs Well",
    match: 88,
    priceBadge: "normal",
    priceBadgeText: "🟡 Normal Sale",
    currentPrice: "₹1,799",
    originalPrice: "₹2,499",
    lowestPrice: "₹1,499",
    discount: "-28%",
    rating: 4.8,
    year: 2022,
    size: "60 GB",
    specs: {
      cpuMin: "i5-8400", cpuRec: "i7-8700K",
      gpuMin: "GTX 1060 3GB", gpuRec: "RTX 2070",
      ramMin: "12 GB", ramRec: "16 GB"
    },
    priceHistory: [2499, 2499, 2199, 1999, 1799, 1799],
    estimatedFps: "45–60 FPS",
    estimatedSettings: "1080p Medium-High"
  },
  {
    id: 1174180,
    title: "Red Dead Redemption 2",
    genre: "Action • Open World • Story",
    image: "images/rdr2.png",
    compat: "playable",
    compatText: "🟡 Runs Well",
    match: 86,
    priceBadge: "great",
    priceBadgeText: "💰 Great Price",
    currentPrice: "₹699",
    originalPrice: "₹2,099",
    lowestPrice: "₹599",
    discount: "-67%",
    rating: 4.9,
    year: 2019,
    size: "150 GB",
    specs: {
      cpuMin: "i5-2500K", cpuRec: "i7-4770K",
      gpuMin: "GTX 770 2GB", gpuRec: "GTX 1060 6GB",
      ramMin: "8 GB", ramRec: "12 GB"
    },
    priceHistory: [2099, 1499, 999, 799, 699, 699],
    estimatedFps: "45–55 FPS",
    estimatedSettings: "1080p Medium"
  },
  {
    id: 1659040,
    title: "Hitman World of Assassination",
    genre: "Stealth • Action • Strategy",
    image: "images/hitman.png",
    compat: "excellent",
    compatText: "🟢 Runs Great",
    match: 82,
    priceBadge: "wait",
    priceBadgeText: "🔴 Wait For Sale",
    currentPrice: "₹1,999",
    originalPrice: "₹2,499",
    lowestPrice: "₹999",
    discount: "-20%",
    rating: 4.5,
    year: 2022,
    size: "80 GB",
    specs: {
      cpuMin: "i5-2500K", cpuRec: "i7-4790",
      gpuMin: "GTX 660", gpuRec: "GTX 1070",
      ramMin: "8 GB", ramRec: "16 GB"
    },
    priceHistory: [2499, 2499, 1999, 1499, 999, 1999],
    estimatedFps: "80–100 FPS",
    estimatedSettings: "1080p Ultra"
  }
];

let GAMES = [...MOCK_GAMES];
let FREE_GAMES = [];

const EVENTS = [
  {
    title: "Steam Winter Sale",
    desc: "Thousands of PC games on sale, including best sellers and hidden gems.",
    month: "DEC",
    day: "17",
    countdown: "131 days",
    icon: "🔥"
  },
  {
    title: "Epic Mega Sale",
    desc: "Epic Games Store annual sale with exclusive coupons and free games.",
    month: "MAY",
    day: "15",
    countdown: "278 days",
    icon: "🎮"
  },
  {
    title: "The Game Awards",
    desc: "Annual awards ceremony celebrating the best games of the year.",
    month: "DEC",
    day: "12",
    countdown: "126 days",
    icon: "🏆"
  }
];

const WISHLIST = [
  {
    title: "Cyberpunk 2077",
    genre: "RPG • Open World",
    image: "images/cyberpunk.png",
    currentPrice: "₹1,499",
    lowestPrice: "₹999",
    alert: "₹1,000",
    badge: "wait",
    badgeText: "🟡 Wait For Better Price"
  },
  {
    title: "Ghost of Tsushima",
    genre: "Action • Adventure",
    image: "images/ghost.png",
    currentPrice: "₹1,499",
    lowestPrice: "₹1,299",
    alert: "₹1,500",
    badge: "great",
    badgeText: "🟢 Below Your Alert!"
  },
  {
    title: "Elden Ring",
    genre: "Action RPG • Fantasy",
    image: "images/eldenring.png",
    currentPrice: "₹1,799",
    lowestPrice: "₹1,499",
    alert: "₹1,200",
    badge: "wait",
    badgeText: "🟡 Wait For Better Price"
  }
];


// ── RENDER FUNCTIONS ──

function createGameCard(game) {
  const currentP = convertPrice(game.currentPrice);
  const origP = convertPrice(game.originalPrice);
  const lowP = convertPrice(game.lowestPrice || game.currentPrice);

  return `
    <div class="game-card" onclick="openGameModal(${game.id})">
      <div class="game-card-image">
        <img src="${game.image}" alt="${game.title}" loading="lazy" onerror="this.src='images/cyberpunk.png'" />
        ${game.discount ? `<span class="discount-badge">${game.discount}</span>` : ''}
        <button class="wishlist-btn" onclick="event.stopPropagation(); toggleWishlist(this)">♡</button>
      </div>
      <div class="game-card-body">
        <div class="game-card-title">${game.title}</div>
        <div class="game-card-genre">${game.genre || 'Action • Steam'}</div>
        <div class="game-card-badges">
          <span class="compat-badge ${game.compat}">${game.compatText}</span>
          <span class="match-badge">⭐ ${game.match}% Match</span>
          <span class="price-badge ${game.priceBadge}">${game.priceBadgeText}</span>
        </div>
        <div class="game-card-price">
          <span class="current">${currentP}</span>
          ${origP ? `<span class="original">${origP}</span>` : ''}
          <span class="lowest">Low: ${lowP}</span>
        </div>
      </div>
    </div>
  `;
}

function createDealCard(game) {
  const currentP = convertPrice(game.currentPrice);
  const origP = convertPrice(game.originalPrice);

  return `
    <div class="deal-card" onclick="openGameModal(${game.id})" data-price-type="${game.priceBadge}" data-store="steam">
      <div class="deal-card-image">
        <img src="${game.image}" alt="${game.title}" loading="lazy" onerror="this.src='images/cyberpunk.png'" />
      </div>
      <div class="deal-card-body">
        <div class="deal-card-title">${game.title}</div>
        <div class="compat-badge ${game.compat}" style="margin:4px 0">${game.compatText}</div>
        <div class="deal-card-prices">
          <span class="deal-current">${currentP}</span>
          ${origP ? `<span class="deal-original">${origP}</span>` : ''}
          ${game.discount ? `<span class="deal-discount">${game.discount}</span>` : ''}
        </div>
        <div class="deal-card-meta">
          <span class="price-badge ${game.priceBadge}">${game.priceBadgeText}</span>
          <span>•</span>
          <span>Steam Special</span>
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
        <div class="free-card-platform">${game.platformIcon || '🔵'} ${game.platform || 'Steam Store'}</div>
        <div class="free-card-timer">⏱ ${game.timeLeft || 'Live Promotion'}</div>
        <button class="free-card-claim" onclick="window.open('${storeUrl}', '_blank')">Claim on Steam ↗</button>
      </div>
    </div>
  `;
}

function createWishlistCard(item) {
  const currentP = convertPrice(item.currentPrice);
  const lowP = convertPrice(item.lowestPrice);

  return `
    <div class="wishlist-card">
      <div class="wishlist-card-header">
        <img class="wishlist-card-thumb" src="${item.image}" alt="${item.title}" onerror="this.src='images/cyberpunk.png'" />
        <div class="wishlist-card-info">
          <div class="wishlist-card-name">${item.title}</div>
          <div class="wishlist-card-genre">${item.genre}</div>
        </div>
        <button class="wishlist-card-remove" onclick="this.closest('.wishlist-card').remove()">✕</button>
      </div>
      <div class="wishlist-prices">
        <div class="wishlist-price-item">
          <div class="wishlist-price-label">Current</div>
          <div class="wishlist-price-value">${currentP}</div>
        </div>
        <div class="wishlist-price-item">
          <div class="wishlist-price-label">Lowest</div>
          <div class="wishlist-price-value" style="color:var(--accent-primary)">${lowP}</div>
        </div>
      </div>
      <div style="margin-bottom:var(--space-md)">
        <span class="price-badge ${item.badge}">${item.badgeText}</span>
      </div>
      <div class="wishlist-alert">
        <span>🔔 Alert me below</span>
        <input type="text" class="wishlist-alert-input" value="${item.alert}" />
        <button class="btn btn-sm btn-primary" style="margin-left:auto;">Set</button>
      </div>
    </div>
  `;
}


// ── POPULATE SECTIONS ──

function populateAll() {
  document.getElementById('recommendedRow').innerHTML = GAMES.map(createGameCard).join('');

  const compatible = GAMES.filter(g => g.compat === 'excellent');
  document.getElementById('compatibleRow').innerHTML = (compatible.length > 0 ? compatible : GAMES).map(createGameCard).join('');

  document.getElementById('dealsGrid').innerHTML = GAMES.filter(g => g.discount).map(createDealCard).join('');

  if (FREE_GAMES.length > 0) {
    document.getElementById('freeGamesGrid').innerHTML = FREE_GAMES.map(createFreeCard).join('');
  }

  document.getElementById('eventsList').innerHTML = EVENTS.map(e => `
    <div class="event-card">
      <div class="event-date">
        <div class="event-date-month">${e.month}</div>
        <div class="event-date-day">${e.day}</div>
      </div>
      <div class="event-info">
        <div class="event-title">${e.icon} ${e.title}</div>
        <div class="event-desc">${e.desc}</div>
      </div>
      <div class="event-countdown">⏱ ${e.countdown}</div>
    </div>
  `).join('');

  document.getElementById('wishlistGrid').innerHTML = WISHLIST.map(createWishlistCard).join('');
  renderCompare(GAMES[4] || GAMES[0], GAMES[0]);
}


// ── FETCH LIVE STEAM DEALS & FREE GAMES ──

async function loadSteamFeatured() {
  try {
    const resp = await fetch(`${API_BASE}/api/steam/featured`);
    if (!resp.ok) return;
    const data = await resp.json();
    
    if (data.specials && data.specials.length > 0) {
      const liveDeals = data.specials.map(s => ({
        id: s.id,
        title: s.title,
        genre: "Steam Special • Action",
        image: s.image,
        compat: "excellent",
        compatText: "🟢 Runs Great",
        match: s.match || 90,
        priceBadge: s.priceBadge,
        priceBadgeText: s.priceBadgeText,
        currentPrice: s.currentPrice,
        originalPrice: s.originalPrice,
        lowestPrice: s.currentPrice,
        discount: s.discount,
        rating: 4.8,
        year: 2024,
        size: "50 GB",
        specs: { cpuMin: "i5-8400", cpuRec: "i7-10700", gpuMin: "GTX 1060", gpuRec: "RTX 3060", ramMin: "8 GB", ramRec: "16 GB" },
        priceHistory: [2999, 2499, 1999, 1499]
      }));
      
      const existingIds = new Set(GAMES.map(g => g.id));
      liveDeals.forEach(ld => {
        if (!existingIds.has(ld.id)) {
          GAMES.push(ld);
        }
      });
      
      populateAll();
      console.log('⚡ Live Steam Featured Deals Loaded:', liveDeals.length);
    }
  } catch (err) {
    console.warn('Backend offline or using local curated games:', err);
  }
}

async function loadSteamFreeGames() {
  try {
    const resp = await fetch(`${API_BASE}/api/steam/free-games`);
    if (!resp.ok) return;
    const data = await resp.json();
    
    if (data.items && data.items.length > 0) {
      FREE_GAMES = data.items;
      document.getElementById('freeGamesGrid').innerHTML = FREE_GAMES.map(createFreeCard).join('');
      console.log('🎁 Live Steam Free Games Loaded:', FREE_GAMES.length);
    }
  } catch (err) {
    console.warn('Backend offline or free games unavailable:', err);
  }
}


// ── STEAM USER PROFILE INTEGRATION ──

async function connectSteamUser() {
  const input = document.getElementById('steamIdInput');
  const target = input ? input.value.trim() : '';
  if (!target) return;

  const btn = document.getElementById('steamConnectBtn');
  if (btn) btn.innerHTML = 'Connecting...';

  try {
    const resp = await fetch(`${API_BASE}/api/steam/user/${encodeURIComponent(target)}`);
    const data = await resp.json();
    
    if (!resp.ok || data.error) {
      alert(`Steam Connection Error: ${data.error || 'User not found'}`);
      if (btn) btn.innerHTML = '🔗 Connect Steam';
      return;
    }

    const avatarEl = document.getElementById('profileBtn');
    if (avatarEl && data.avatar) {
      avatarEl.innerHTML = `<img src="${data.avatar}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;" title="${data.persona_name}" />`;
    }

    const steamCard = document.getElementById('steamProfileCard');
    if (steamCard) {
      steamCard.style.display = 'block';
      steamCard.innerHTML = `
        <div style="display:flex;align-items:center;gap:var(--space-md);background:var(--bg-card);padding:var(--space-lg);border-radius:var(--radius-lg);border:1px solid var(--border-medium);margin-top:var(--space-md)">
          <img src="${data.avatar}" style="width:60px;height:60px;border-radius:50%;border:2px solid var(--accent-primary);" />
          <div style="flex:1">
            <div style="font-family:var(--font-heading);font-weight:700;font-size:1.1rem">${data.persona_name} <span style="font-size:0.75rem;color:var(--accent-success);margin-left:8px;">🔵 Connected</span></div>
            <div style="font-size:0.85rem;color:var(--text-muted)">Steam ID: ${data.steamid} • ${data.game_count || 0} Owned Games</div>
          </div>
          <a href="${data.profile_url}" target="_blank" class="btn btn-sm btn-secondary">View Profile ↗</a>
        </div>
      `;
    }

    if (btn) btn.innerHTML = '✓ Steam Connected';
  } catch (err) {
    alert('Failed to connect Steam. Please verify backend is running.');
    if (btn) btn.innerHTML = '🔗 Connect Steam';
  }
}


// ── COMPARE ──

function renderCompare(gameA, gameB) {
  const winner = gameA.match >= gameB.match ? gameA : gameB;
  const pA = convertPrice(gameA.currentPrice);
  const pB = convertPrice(gameB.currentPrice);

  document.getElementById('compareGrid').innerHTML = `
    <div class="compare-card">
      <div class="compare-card-image">
        <img src="${gameA.image}" alt="${gameA.title}" onerror="this.src='images/cyberpunk.png'" />
      </div>
      <div class="compare-card-body">
        <h3 style="font-family:var(--font-heading);font-weight:700">${gameA.title}</h3>
        <p style="color:var(--text-muted);font-size:0.85rem;margin-top:4px">${gameA.genre || 'Action'}</p>
      </div>
    </div>
    <div class="compare-vs">VS</div>
    <div class="compare-card">
      <div class="compare-card-image">
        <img src="${gameB.image}" alt="${gameB.title}" onerror="this.src='images/ghost.png'" />
      </div>
      <div class="compare-card-body">
        <h3 style="font-family:var(--font-heading);font-weight:700">${gameB.title}</h3>
        <p style="color:var(--text-muted);font-size:0.85rem;margin-top:4px">${gameB.genre || 'Action'}</p>
      </div>
    </div>
    <div style="grid-column:1/-1">
      <table class="compare-table">
        <thead>
          <tr>
            <th>Metric</th>
            <th>${gameA.title}</th>
            <th>${gameB.title}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Price</td>
            <td class="compare-winner">${pA}</td>
            <td>${pB}</td>
          </tr>
          <tr>
            <td>Compatibility</td>
            <td>${gameA.compatText}</td>
            <td>${gameB.compatText}</td>
          </tr>
          <tr>
            <td>Match</td>
            <td class="compare-winner">${gameA.match}%</td>
            <td>${gameB.match}%</td>
          </tr>
          <tr>
            <td>Rating</td>
            <td class="compare-winner">⭐ ${gameA.rating || 4.8}</td>
            <td>⭐ ${gameB.rating || 4.5}</td>
          </tr>
          <tr>
            <td>FPS</td>
            <td>${gameA.estimatedFps || '60 FPS'}</td>
            <td>${gameB.estimatedFps || '60 FPS'}</td>
          </tr>
        </tbody>
      </table>
      <div style="text-align:center;margin-top:var(--space-xl);padding:var(--space-lg);background:var(--bg-card);border-radius:var(--radius-md);">
        <div style="font-size:0.8rem;color:var(--text-dim);text-transform:uppercase;letter-spacing:1px;margin-bottom:var(--space-sm)">🏆 Best For Your PC</div>
        <div style="font-family:var(--font-heading);font-weight:700;font-size:1.2rem;color:var(--accent-success)">${winner.title}</div>
      </div>
    </div>
  `;
}


// ── GAME MODAL (API + LOCAL + CONVERTED PRICES) ──

async function openGameModal(gameId) {
  let game = GAMES.find(g => g.id === gameId);

  try {
    const resp = await fetch(`${API_BASE}/api/steam/app/${gameId}`);
    if (resp.ok) {
      const apiData = await resp.json();
      game = {
        id: apiData.appid,
        title: apiData.title,
        genre: apiData.genres ? apiData.genres.join(' • ') : 'Steam Game',
        image: apiData.header_image || game?.image || 'images/cyberpunk.png',
        compat: 'excellent',
        compatText: '🟢 Runs Great',
        currentPrice: apiData.price?.current || game?.currentPrice || 'Free',
        originalPrice: apiData.price?.original || '',
        lowestPrice: apiData.price?.current || 'Live Price',
        specs: {
          cpuMin: apiData.requirements?.minimum?.cpu || 'Intel Core i5-7500',
          cpuRec: apiData.requirements?.recommended?.cpu || 'Intel Core i7-8700',
          gpuMin: apiData.requirements?.minimum?.gpu || 'GTX 1050 Ti',
          gpuRec: apiData.requirements?.recommended?.gpu || 'RTX 2070',
          ramMin: apiData.requirements?.minimum?.ram || '8 GB',
          ramRec: apiData.requirements?.recommended?.ram || '16 GB',
        },
        estimatedFps: '60-85 FPS',
        estimatedSettings: '1080p High',
        priceHistory: game?.priceHistory || [2999, 2499, 1999, 1299]
      };
    }
  } catch (err) {
    console.log('Using local game specs');
  }

  if (!game) return;

  const currentP = convertPrice(game.currentPrice);
  const lowestP = convertPrice(game.lowestPrice || game.currentPrice);

  document.getElementById('modalHeroImg').src = game.image;
  document.getElementById('modalTitle').textContent = game.title;
  document.getElementById('modalGenre').textContent = game.genre;
  document.getElementById('modalCurrentPrice').textContent = currentP;
  document.getElementById('modalLowestPrice').textContent = lowestP;

  const compatEl = document.getElementById('modalCompat');
  compatEl.textContent = game.compatText || '🟢 EXCELLENT';
  compatEl.style.color = game.compat === 'playable' ? 'var(--accent-warning)' : 'var(--accent-success)';
  document.getElementById('modalCompatDetail').textContent = `${game.estimatedSettings || '1080p High'} • Estimated ${game.estimatedFps || '60 FPS'}`;

  // Specs table
  document.getElementById('modalSpecsBody').innerHTML = `
    <tr>
      <td>CPU</td>
      <td>${game.specs?.cpuMin || 'i5-7500'}</td>
      <td>${game.specs?.cpuRec || 'i7-8700'}</td>
      <td>i5-12450HX <span class="spec-status">🟢</span></td>
    </tr>
    <tr>
      <td>GPU</td>
      <td>${game.specs?.gpuMin || 'GTX 1050 Ti'}</td>
      <td>${game.specs?.gpuRec || 'RTX 2070'}</td>
      <td>RTX 3050 <span class="spec-status">🟢</span></td>
    </tr>
    <tr>
      <td>RAM</td>
      <td>${game.specs?.ramMin || '8 GB'}</td>
      <td>${game.specs?.ramRec || '16 GB'}</td>
      <td>16 GB <span class="spec-status">🟢</span></td>
    </tr>
  `;

  const buyBtn = document.querySelector('.modal-actions .btn-primary');
  buyBtn.textContent = `💰 Buy on Steam — ${currentP}`;
  buyBtn.onclick = () => window.open(`https://store.steampowered.com/app/${game.id}`, '_blank');

  drawPriceChart(game.priceHistory || [2499, 1999, 1499, 1299]);

  document.getElementById('gameModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeGameModal() {
  document.getElementById('gameModal').classList.remove('active');
  document.body.style.overflow = '';
}


// ── PRICE CHART (Canvas) ──

function drawPriceChart(data) {
  const canvas = document.getElementById('priceChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const rect = canvas.parentElement.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = rect.width * dpr;
  canvas.height = 160 * dpr;
  canvas.style.width = rect.width + 'px';
  canvas.style.height = '160px';
  ctx.scale(dpr, dpr);

  const w = rect.width;
  const h = 160;
  const padding = { top: 20, right: 20, bottom: 30, left: 50 };
  const chartW = w - padding.left - padding.right;
  const chartH = h - padding.top - padding.bottom;

  const maxVal = Math.max(...data) * 1.1;
  const minVal = Math.min(...data) * 0.9;
  const range = maxVal - minVal || 1;

  ctx.clearRect(0, 0, w, h);

  ctx.strokeStyle = 'rgba(255,255,255,0.05)';
  ctx.lineWidth = 1;
  const symbol = CURRENCY_SYMBOLS[currentCurrency] || '$';

  for (let i = 0; i <= 4; i++) {
    const y = padding.top + (chartH / 4) * i;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(w - padding.right, y);
    ctx.stroke();

    const rawVal = Math.round(maxVal - (range / 4) * i);
    const convertedVal = convertPrice(`${rawVal}`);
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = '10px Inter';
    ctx.textAlign = 'right';
    ctx.fillText(convertedVal, padding.left - 8, y + 4);
  }

  const months = ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Aug'];
  months.forEach((m, i) => {
    if (i < data.length) {
      const x = padding.left + (chartW / (data.length - 1)) * i;
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.font = '10px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(m, x, h - 8);
    }
  });

  const points = data.map((val, i) => ({
    x: padding.left + (chartW / (data.length - 1)) * i,
    y: padding.top + chartH - ((val - minVal) / range) * chartH
  }));

  const gradient = ctx.createLinearGradient(0, padding.top, 0, h - padding.bottom);
  gradient.addColorStop(0, 'rgba(59, 130, 246, 0.25)');
  gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');

  ctx.beginPath();
  ctx.moveTo(points[0].x, h - padding.bottom);
  points.forEach(p => ctx.lineTo(p.x, p.y));
  ctx.lineTo(points[points.length - 1].x, h - padding.bottom);
  ctx.closePath();
  ctx.fillStyle = gradient;
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    const cpx = (points[i - 1].x + points[i].x) / 2;
    ctx.bezierCurveTo(cpx, points[i - 1].y, cpx, points[i].y, points[i].x, points[i].y);
  }
  ctx.strokeStyle = '#3B82F6';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  points.forEach((p, i) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, i === points.length - 1 ? 5 : 3, 0, Math.PI * 2);
    ctx.fillStyle = i === points.length - 1 ? '#3B82F6' : '#1E3A5F';
    ctx.fill();
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 2;
    ctx.stroke();
  });
}


// ── SEARCH (LIVE STEAM + LOCAL) ──

function initSearch() {
  const overlay = document.getElementById('searchOverlay');
  const input = document.getElementById('searchInput');
  const results = document.getElementById('searchResults');
  const btn = document.getElementById('searchBtn');

  btn.addEventListener('click', () => {
    overlay.classList.add('active');
    setTimeout(() => input.focus(), 300);
  });

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
      input.value = '';
      results.classList.remove('has-results');
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      overlay.classList.add('active');
      setTimeout(() => input.focus(), 300);
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
        g.title.toLowerCase().includes(query) ||
        (g.genre && g.genre.toLowerCase().includes(query))
      );

      let steamMatched = [];
      try {
        const resp = await fetch(`${API_BASE}/api/steam/search?q=${encodeURIComponent(query)}`);
        if (resp.ok) {
          const sData = await resp.json();
          steamMatched = sData.items || [];
        }
      } catch (err) {
        console.warn('Steam search offline, using local');
      }

      if (localMatched.length === 0 && steamMatched.length === 0) {
        results.classList.remove('has-results');
        return;
      }

      results.innerHTML = `
        <div class="search-results-group">
          <div class="search-results-label">Local Recommendations</div>
          ${localMatched.map(g => `
            <div class="search-result-item" onclick="document.getElementById('searchOverlay').classList.remove('active');openGameModal(${g.id})">
              <img class="result-thumb" src="${g.image}" alt="${g.title}" onerror="this.src='images/cyberpunk.png'" />
              <div class="result-info">
                <div class="result-name">${g.title}</div>
                <div class="result-meta">${g.genre || 'Action'}</div>
              </div>
              <span class="result-badge">${g.compatText}</span>
            </div>
          `).join('')}
        </div>
        ${steamMatched.length > 0 ? `
          <div class="search-results-group" style="border-top:1px solid var(--border-subtle)">
            <div class="search-results-label">Live Steam Store Results</div>
            ${steamMatched.slice(0, 6).map(g => `
              <div class="search-result-item" onclick="document.getElementById('searchOverlay').classList.remove('active');openGameModal(${g.id})">
                <img class="result-thumb" src="${g.image}" alt="${g.title}" onerror="this.src='images/cyberpunk.png'" />
                <div class="result-info">
                  <div class="result-name">${g.title}</div>
                  <div class="result-meta">AppID: ${g.id} • Steam Catalog</div>
                </div>
                <span class="result-badge">🔵 Steam Live</span>
              </div>
            `).join('')}
          </div>
        ` : ''}
      `;
      results.classList.add('has-results');
    }, 300);
  });
}


// ── HELPER UTILITIES ──

function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
        ticking = false;
      });
      ticking = true;
    }
  });
}

function initNavHighlight() {
  const sections = ['dashboard', 'deals', 'free-games', 'events'];
  const navLinks = document.querySelectorAll('.nav-link[data-nav]');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 120;
    sections.forEach(id => {
      const section = document.getElementById(id);
      if (section) {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        if (scrollY >= top && scrollY < top + height) {
          navLinks.forEach(l => l.classList.remove('active'));
          const active = document.querySelector(`.nav-link[data-nav="${id}"]`);
          if (active) active.classList.add('active');
        }
      }
    });
  });
}

function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        animateCounter(el, target);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(el => observer.observe(el));
}

function animateCounter(el, target) {
  const duration = 2000;
  const start = performance.now();
  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);
    el.textContent = current.toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target.toLocaleString();
  }
  requestAnimationFrame(update);
}

function initCompatBars() {
  const bars = document.querySelectorAll('.compat-bar-fill[data-width]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        setTimeout(() => { el.style.width = el.dataset.width; }, 300);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  bars.forEach(el => observer.observe(el));
}

function initParticles() {
  const container = document.getElementById('heroParticles');
  if (!container) return;
  for (let i = 0; i < 30; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 6 + 's';
    particle.style.animationDuration = (4 + Math.random() * 4) + 's';
    particle.style.width = (1 + Math.random() * 3) + 'px';
    particle.style.height = particle.style.width;
    container.appendChild(particle);
  }
}

function initDropdowns() {
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
}

function initModal() {
  const closeBtn = document.getElementById('modalClose');
  if (closeBtn) closeBtn.addEventListener('click', closeGameModal);
  const modal = document.getElementById('gameModal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target.id === 'gameModal') closeGameModal();
    });
  }
}

function toggleWishlist(btn) {
  btn.classList.toggle('active');
  btn.textContent = btn.classList.contains('active') ? '♥' : '♡';
}

function initFilters() {
  document.querySelectorAll('.tab-filters').forEach(group => {
    group.querySelectorAll('.tab-filter').forEach(btn => {
      btn.addEventListener('click', () => {
        group.querySelectorAll('.tab-filter').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  });
}

function initMobileNav() {
  document.querySelectorAll('.mobile-nav-item').forEach(item => {
    item.addEventListener('click', function() {
      document.querySelectorAll('.mobile-nav-item').forEach(i => i.classList.remove('active'));
      this.classList.add('active');
    });
  });
}


// ── INIT ──

document.addEventListener('DOMContentLoaded', async () => {
  fetchExchangeRates(); // Fetch live exchange rates
  initCurrencySelector();
  populateAll();
  loadSteamFeatured(); // Fetch live Steam deals
  loadSteamFreeGames(); // Fetch real-time free games
  initSearch();
  initNavbarScroll();
  initNavHighlight();
  initReveal();
  initCounters();
  initCompatBars();
  initParticles();
  initDropdowns();
  initModal();
  initFilters();
  initMobileNav();
});
