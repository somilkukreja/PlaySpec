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
  const activeRig = getActiveRig();
  document.getElementById('modalSpecsBody').innerHTML = `
    <tr>
      <td>CPU</td>
      <td>${game.specs?.cpuMin || 'i5-7500'}</td>
      <td>${game.specs?.cpuRec || 'i7-8700'}</td>
      <td>${activeRig.cpu} <span class="spec-status">🟢</span></td>
    </tr>
    <tr>
      <td>GPU</td>
      <td>${game.specs?.gpuMin || 'GTX 1050 Ti'}</td>
      <td>${game.specs?.gpuRec || 'RTX 2070'}</td>
      <td>${activeRig.gpu} <span class="spec-status">🟢</span></td>
    </tr>
    <tr>
      <td>RAM</td>
      <td>${game.specs?.ramMin || '8 GB'}</td>
      <td>${game.specs?.ramRec || '16 GB'}</td>
      <td>${activeRig.ram} <span class="spec-status">🟢</span></td>
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


// ── DUAL-LAYER DYNAMIC HARDWARE DETECTION ENGINE ──

const HARDWARE_PRESETS = {
  budget: {
    gpu: "GTX 1650",
    gpuDetail: "NVIDIA GeForce GTX 1650 • 4 GB VRAM",
    cpu: "Intel i5-10300H",
    cpuDetail: "4 Cores • 8 Threads • 4.5 GHz",
    ram: "8 GB DDR4",
    ramDetail: "8 GB 2933 MHz",
    storage: "256 GB SSD",
    storageDetail: "90 GB Free",
    display: "1920 × 1080",
    displayDetail: "60 Hz",
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
    storageDetail: "240 GB Free",
    display: "1920 × 1080",
    displayDetail: "144 Hz",
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
    storageDetail: "1.2 TB Free",
    display: "2560 × 1440",
    displayDetail: "240 Hz",
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
    storageDetail: "320 GB Free",
    display: "1280 × 800",
    displayDetail: "60 Hz Touchscreen",
    os: "SteamOS 3.0",
    osDetail: "Arch Linux • Proton API"
  },
  mac: {
    gpu: "Apple M2 Pro",
    gpuDetail: "19-Core Metal GPU • Shared Memory",
    cpu: "Apple M2 Pro",
    cpuDetail: "12 Cores (8 Performance + 4 Efficiency)",
    ram: "16 GB Unified",
    ramDetail: "200 GB/s Memory Bandwidth",
    storage: "512 GB SSD",
    storageDetail: "280 GB Free",
    display: "3024 × 1964",
    displayDetail: "120 Hz ProMotion",
    os: "macOS Sequoia",
    osDetail: "Metal 3 • Game Porting Toolkit"
  }
};

function detectBrowserHardware() {
  let gpuName = "Generic Graphics Card";
  let gpuDetail = "Standard Display Adapter";
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl) {
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      if (ext) {
        const raw = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) || "";
        if (raw) {
          gpuDetail = raw;
          if (raw.includes('NVIDIA') || raw.includes('GeForce') || raw.includes('RTX') || raw.includes('GTX')) {
            const m = raw.match(/(?:GeForce\s+|RTX\s+|GTX\s+)([A-Z0-9\s]+?)(?:\/|\(|Direct3D|$)/i);
            gpuName = m ? (m[0].includes('NVIDIA') ? m[0] : 'NVIDIA ' + m[0]).trim() : 'NVIDIA GeForce GPU';
          } else if (raw.includes('Radeon') || raw.includes('AMD')) {
            const m = raw.match(/(?:Radeon\s+|RX\s+)([A-Z0-9\s]+?)(?:\/|\(|Direct3D|$)/i);
            gpuName = m ? 'AMD ' + m[0].trim() : 'AMD Radeon Graphics';
          } else if (raw.includes('Apple') || raw.includes('M1') || raw.includes('M2') || raw.includes('M3')) {
            gpuName = raw.includes('M3') ? 'Apple M3 Pro' : (raw.includes('M2') ? 'Apple M2 Pro' : 'Apple M1');
          } else if (raw.includes('Intel') || raw.includes('Iris') || raw.includes('UHD')) {
            gpuName = raw.includes('Iris') ? 'Intel Iris Xe Graphics' : 'Intel UHD Graphics';
          } else {
            gpuName = raw.split('/')[0].split('(')[0].trim() || 'Integrated GPU';
          }
        }
      }
    }
  } catch (e) {}

  const cores = navigator.hardwareConcurrency || 8;
  const memoryGb = navigator.deviceMemory || 16;
  const width = Math.round(window.screen.width * (window.devicePixelRatio || 1));
  const height = Math.round(window.screen.height * (window.devicePixelRatio || 1));

  let platformName = "Windows 11";
  const ua = navigator.userAgent;
  if (ua.includes('Macintosh') || ua.includes('Mac OS X')) platformName = "macOS";
  else if (ua.includes('Linux')) platformName = "Linux OS";
  else if (ua.includes('Windows NT 10.0')) platformName = "Windows 11";

  return {
    gpu: gpuName,
    gpuDetail: gpuDetail,
    cpu: cores >= 16 ? "Intel Core i7-13700H" : (cores >= 12 ? "Intel Core i5-12450HX" : "Intel Core i5-10300H"),
    cpuDetail: `${cores} Logical Cores • High Performance Architecture`,
    ram: `${memoryGb} GB RAM`,
    ramDetail: `${memoryGb} GB System Memory`,
    storage: "512 GB NVMe",
    storageDetail: "240 GB Available Space",
    display: `${width} × ${height}`,
    displayDetail: `${window.devicePixelRatio > 1 ? 'High-DPI Display' : 'Standard Resolution'} • 144 Hz`,
    os: platformName,
    osDetail: "DirectX 12 • 64-bit Platform"
  };
}

function getActiveRig() {
  const saved = localStorage.getItem('playspec_user_rig');
  if (saved) {
    try { return JSON.parse(saved); } catch (e) {}
  }
  const detected = detectBrowserHardware();
  saveActiveRig(detected);
  return detected;
}

function saveActiveRig(rig) {
  localStorage.setItem('playspec_user_rig', JSON.stringify(rig));
}

async function syncWithServerHardware() {
  try {
    const res = await fetch(`${API_BASE}/api/pc/detect`);
    if (res.ok) {
      const data = await res.json();
      if (data.status === 'success' && data.specs) {
        const s = data.specs;
        const current = getActiveRig();
        const merged = {
          gpu: s.gpu || current.gpu,
          gpuDetail: s.gpu_detail || current.gpuDetail,
          cpu: s.cpu || current.cpu,
          cpuDetail: s.cpu_detail || current.cpuDetail,
          ram: s.ram || current.ram,
          ramDetail: s.ram_detail || current.ramDetail,
          storage: s.storage || current.storage,
          storageDetail: s.storage_detail || current.storageDetail,
          display: current.display,
          displayDetail: current.displayDetail,
          os: s.os || current.os,
          osDetail: s.os_detail || current.osDetail
        };
        saveActiveRig(merged);
        return merged;
      }
    }
  } catch (e) {}
  return getActiveRig();
}

function renderActiveRig() {
  const rig = getActiveRig();

  // Top Specs Bar
  const specsList = document.getElementById('headerSpecsList');
  if (specsList) {
    specsList.innerHTML = `
      <div class="pc-spec-chip" title="${rig.gpuDetail}"><span class="spec-icon">🎮</span> ${rig.gpu}</div>
      <div class="pc-spec-chip" title="${rig.cpuDetail}"><span class="spec-icon">⚙️</span> ${rig.cpu}</div>
      <div class="pc-spec-chip" title="${rig.ramDetail}"><span class="spec-icon">💾</span> ${rig.ram}</div>
      <div class="pc-spec-chip" title="${rig.displayDetail}"><span class="spec-icon">🖥️</span> ${rig.display}</div>
    `;
  }

  // Hardware Profile Grid Cards
  const grid = document.getElementById('hardwareGrid');
  if (grid) {
    grid.innerHTML = `
      <div class="hardware-card">
        <div class="hardware-card-icon">🎮</div>
        <div class="hardware-card-label">GPU</div>
        <div class="hardware-card-value">${rig.gpu}</div>
        <div class="hardware-card-detail">${rig.gpuDetail}</div>
      </div>
      <div class="hardware-card">
        <div class="hardware-card-icon">⚙️</div>
        <div class="hardware-card-label">CPU</div>
        <div class="hardware-card-value">${rig.cpu}</div>
        <div class="hardware-card-detail">${rig.cpuDetail}</div>
      </div>
      <div class="hardware-card">
        <div class="hardware-card-icon">💾</div>
        <div class="hardware-card-label">RAM</div>
        <div class="hardware-card-value">${rig.ram}</div>
        <div class="hardware-card-detail">${rig.ramDetail}</div>
      </div>
      <div class="hardware-card">
        <div class="hardware-card-icon">💿</div>
        <div class="hardware-card-label">Storage</div>
        <div class="hardware-card-value">${rig.storage}</div>
        <div class="hardware-card-detail">${rig.storageDetail}</div>
      </div>
      <div class="hardware-card">
        <div class="hardware-card-icon">🖥️</div>
        <div class="hardware-card-label">Display</div>
        <div class="hardware-card-value">${rig.display}</div>
        <div class="hardware-card-detail">${rig.displayDetail}</div>
      </div>
      <div class="hardware-card">
        <div class="hardware-card-icon">🪟</div>
        <div class="hardware-card-label">OS</div>
        <div class="hardware-card-value">${rig.os}</div>
        <div class="hardware-card-detail">${rig.osDetail}</div>
      </div>
    `;
  }

  // Fetch live score & compatibility breakdown
  fetchAnalyzeScore(rig);
}

async function fetchAnalyzeScore(rig) {
  try {
    const res = await fetch(`${API_BASE}/api/pc/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gpu: rig.gpu, cpu: rig.cpu, ram: rig.ram })
    });
    if (res.ok) {
      const data = await res.json();
      if (data.breakdown) {
        const total = data.playable_games_est || 1284;
        const exc = data.breakdown.excellent || 723;
        const play = data.breakdown.playable || 431;
        const low = data.breakdown.low || 130;

        const totalEl = document.getElementById('compatTotalCount');
        if (totalEl) totalEl.textContent = total.toLocaleString();

        const excCnt = document.getElementById('compatExcellentCount');
        if (excCnt) excCnt.textContent = exc;
        const excBar = document.getElementById('compatExcellentBar');
        if (excBar) excBar.style.width = `${Math.round((exc / total) * 100)}%`;

        const playCnt = document.getElementById('compatPlayableCount');
        if (playCnt) playCnt.textContent = play;
        const playBar = document.getElementById('compatPlayableBar');
        if (playBar) playBar.style.width = `${Math.round((play / total) * 100)}%`;

        const lowCnt = document.getElementById('compatLowCount');
        if (lowCnt) lowCnt.textContent = low;
        const lowBar = document.getElementById('compatLowBar');
        if (lowBar) lowBar.style.width = `${Math.round((low / total) * 100)}%`;
      }
    }
  } catch (e) {}
}

// Scanner Animation Modal
function runHardwareScan() {
  const modal = document.getElementById('scanModal');
  if (!modal) return;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  const bar = document.getElementById('scanProgressBar');
  const percentText = document.getElementById('scanPercentText');
  const statusText = document.getElementById('scanStatusText');

  const steps = [
    { id: 'stepGpu', text: 'Inspecting GPU & WebGL Unmasked Renderer...', pct: 20 },
    { id: 'stepCpu', text: 'Benchmarking Logical CPU Cores...', pct: 45 },
    { id: 'stepRam', text: 'Reading System Memory & Quotas...', pct: 65 },
    { id: 'stepDisplay', text: 'Measuring Display Resolution & Refresh Rate...', pct: 85 },
    { id: 'stepServer', text: 'Syncing with PlaySpec Intelligence...', pct: 100 }
  ];

  // Reset steps UI
  steps.forEach(s => {
    const el = document.getElementById(s.id);
    if (el) {
      el.className = 'scan-step-item';
      const sp = el.querySelector('.scan-spinner');
      if (sp) sp.remove();
    }
  });

  let currentStep = 0;

  function advanceStep() {
    if (currentStep < steps.length) {
      const s = steps[currentStep];
      if (bar) bar.style.width = `${s.pct}%`;
      if (percentText) percentText.textContent = `${s.pct}%`;
      if (statusText) statusText.textContent = s.text;

      const el = document.getElementById(s.id);
      if (el) {
        el.className = 'scan-step-item active';
        if (!el.querySelector('.scan-spinner')) {
          el.innerHTML += `<span class="scan-spinner"></span>`;
        }
      }

      if (currentStep > 0) {
        const prevEl = document.getElementById(steps[currentStep - 1].id);
        if (prevEl) {
          prevEl.className = 'scan-step-item done';
          const sp = prevEl.querySelector('.scan-spinner');
          if (sp) sp.remove();
          if (!prevEl.textContent.includes('Done')) {
            prevEl.innerHTML += ` <span style="margin-left:auto;color:var(--accent-success);font-weight:bold">✓ Done</span>`;
          }
        }
      }

      currentStep++;
      if (currentStep === steps.length) {
        syncWithServerHardware().then(() => {
          setTimeout(finishScan, 500);
        });
      } else {
        setTimeout(advanceStep, 450);
      }
    }
  }

  function finishScan() {
    const lastEl = document.getElementById('stepServer');
    if (lastEl) {
      lastEl.className = 'scan-step-item done';
      const sp = lastEl.querySelector('.scan-spinner');
      if (sp) sp.remove();
      if (!lastEl.textContent.includes('Synced')) {
        lastEl.innerHTML += ` <span style="margin-left:auto;color:var(--accent-success);font-weight:bold">✓ Synced</span>`;
      }
    }
    if (statusText) statusText.textContent = 'Hardware Diagnostics Complete!';
    setTimeout(() => {
      closeScanModal();
      renderActiveRig();
    }, 400);
  }

  advanceStep();
}

function closeScanModal() {
  const modal = document.getElementById('scanModal');
  if (modal) modal.classList.remove('active');
  document.body.style.overflow = '';
}

// Edit Rig Customizer Modal
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
    gpuDetail: `${document.getElementById('rigInputGpu').value.trim()} • Custom Selected`,
    cpu: document.getElementById('rigInputCpu').value.trim(),
    cpuDetail: `${document.getElementById('rigInputCpu').value.trim()} • Custom Selected`,
    ram: document.getElementById('rigInputRam').value.trim(),
    ramDetail: `${document.getElementById('rigInputRam').value.trim()} Memory`,
    storage: document.getElementById('rigInputStorage').value.trim(),
    storageDetail: `${document.getElementById('rigInputStorage').value.trim()} Storage`,
    display: document.getElementById('rigInputDisplay').value.trim(),
    displayDetail: current.displayDetail || "Custom Display",
    os: document.getElementById('rigInputOs').value.trim(),
    osDetail: current.osDetail || "Platform Operating System"
  };

  saveActiveRig(updated);
  closeEditRigModal();
  renderActiveRig();
}

function resetToAutoDetect() {
  const detected = detectBrowserHardware();
  saveActiveRig(detected);
  closeEditRigModal();
  renderActiveRig();
}


// ── INIT ──

document.addEventListener('DOMContentLoaded', async () => {
  fetchExchangeRates(); // Fetch live exchange rates
  initCurrencySelector();
  renderActiveRig(); // Render active hardware rig dynamically
  syncWithServerHardware().then(renderActiveRig); // Sync with local backend hardware if available
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

