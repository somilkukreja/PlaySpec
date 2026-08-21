const fs = require('fs');
const vm = require('vm');

console.log('='.repeat(60));
console.log('PLAYSPEC CLIENT & UNIVERSAL STEAM COMPATIBILITY TEST');
console.log('='.repeat(60));

const jsContent = fs.readFileSync('d:/PlaySpec/app.js', 'utf8');

// Lightweight DOM mock for verifying rendering & pagination
const mockElements = {
  mlRecommendationsRow: {
    innerHTML: '',
    querySelectorAll: function(selector) {
      const matches = this.innerHTML.match(/class="ml-game-card/g);
      return matches ? new Array(matches.length).fill({}) : [];
    }
  },
  mlTierBadge: { textContent: '' },
  mlRigSubtitle: { textContent: '' },
  mlPersonalizedBadge: { style: { display: 'none' }, textContent: '' },
  mlHistoryFilterTab: { style: { display: 'none' } },
  headerTierLabel: { textContent: '' },
  mlRecommendationsPagination: { style: { display: 'none' } },
  mlPaginationCount: { textContent: '' },
  mlLoadMoreBtn: { style: { display: 'none' }, textContent: '', innerHTML: '' },
  mlFilterTabs: { querySelectorAll: () => [] },
  steamCompatSearchInput: { value: '', addEventListener: () => {} },
  steamCompatSearchBtn: { addEventListener: () => {} },
  steamCompatSuggestions: { style: { display: 'none' }, innerHTML: '' },
  steamCompatResultCard: { innerHTML: '' },
  steamTrendingChips: {
    querySelectorAll: () => [
      { textContent: 'Black Myth: Wukong', classList: { add: () => {}, remove: () => {} }, getAttribute: () => '2358720' },
      { textContent: 'Cyberpunk 2077', classList: { add: () => {}, remove: () => {} }, getAttribute: () => '1091500' }
    ]
  }
};

const mockDocument = {
  getElementById: (id) => mockElements[id] || null,
  querySelectorAll: (selector) => {
    if (selector.includes('steamTrendingChips')) return mockElements.steamTrendingChips.querySelectorAll();
    return [];
  },
  createElement: () => ({ getContext: () => null }),
  addEventListener: () => {}
};

const mockWindow = {
  document: mockDocument,
  navigator: {
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    hardwareConcurrency: 12,
    deviceMemory: 16
  },
  screen: {
    width: 1920,
    height: 1080
  },
  localStorage: {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {}
  },
  addEventListener: () => {},
  fetch: () => Promise.reject(new Error("offline mock")),
  currentUser: null,
  authToken: null,
  currentCurrency: 'USD',
  userCurrency: 'USD',
  activeCurrencyRate: 1.0,
  activeCurrencySymbol: '$'
};

mockWindow.window = mockWindow;

const context = vm.createContext(mockWindow);
// Wrap app.js to expose top-level declarations
vm.runInContext(`
${jsContent}
window.CATALOG_GAMES = CATALOG_GAMES;
window.MOCK_GAMES = MOCK_GAMES;
window.GAMES = GAMES;
window.runClientMLRecommendations = runClientMLRecommendations;
window.renderMLRecommendations = renderMLRecommendations;
window.loadMoreMLRecommendations = loadMoreMLRecommendations;
window.fetchAndRenderMLRecommendations = fetchAndRenderMLRecommendations;
window.initSteamCompatibilityChecker = initSteamCompatibilityChecker;
window.checkSteamGameByAppId = checkSteamGameByAppId;
window.computeClientSteamGameCompatibility = computeClientSteamGameCompatibility;
window.renderSteamCompatibilityResult = renderSteamCompatibilityResult;
`, context);

async function runTests() {
  console.log('\n--- 1. Catalog Database Verification ---');
  const catalogCount = vm.runInContext('CATALOG_GAMES.length', context);
  console.log('CATALOG_GAMES count:', catalogCount);
  if (catalogCount !== 45) {
    throw new Error(`Expected 45 games in CATALOG_GAMES, got ${catalogCount}`);
  }
  console.log('[PASS] Full 45 catalog games verified across all 5 tiers.');

  console.log('\n--- 2. Client Universal Steam Game Compatibility Verification ---');
  const rig = { gpu: 'RTX 3050 6GB', cpu: 'i5-12450HX', ram: '16 GB', vram: '6 GB' };
  
  // Test computing compatibility for Black Myth: Wukong
  const wukongCompat = vm.runInContext(`computeClientSteamGameCompatibility(2358720, 'Black Myth: Wukong', ${JSON.stringify(rig)})`, context);
  console.log(`[+] Title: ${wukongCompat.title} (AppID: ${wukongCompat.appid})`);
  console.log(`    Score: ${wukongCompat.compat_score}% | Verdict: ${wukongCompat.category}`);
  console.log(`    Predicted FPS: ${wukongCompat.fps_display} | Preset: ${wukongCompat.optimal_setting}`);
  console.log(`    Bottleneck: ${wukongCompat.bottleneck}`);
  console.log(`    GPU Spec: ${wukongCompat.comparison.gpu.user_spec} -> ${wukongCompat.comparison.gpu.status_label}`);

  if (!wukongCompat.comparison.gpu || !wukongCompat.comparison.cpu || !wukongCompat.comparison.ram) {
    throw new Error("Missing spec comparison rows in Steam compatibility computation");
  }

  // Test rendering compatibility result in DOM
  vm.runInContext(`renderSteamCompatibilityResult(${JSON.stringify(wukongCompat)})`, context);
  const resultHTML = mockElements.steamCompatResultCard.innerHTML;
  console.log('Result Card rendered characters:', resultHTML.length);
  if (!resultHTML.includes('Black Myth: Wukong') || !resultHTML.includes('Hardware Component')) {
    throw new Error("Result card failed to render title or spec comparison table");
  }
  console.log('[PASS] Universal Steam game client compatibility rendering verified.');

  console.log('\n--- 3. Recommendation Pagination Lifecycle Verification ---');
  await vm.runInContext('fetchAndRenderMLRecommendations()', context);
  const recRow = mockElements.mlRecommendationsRow;
  const pagCount = mockElements.mlPaginationCount;

  let renderedCards = recRow.querySelectorAll('.ml-game-card');
  console.log(`Initial render card count: ${renderedCards.length}`);
  if (renderedCards.length !== 8) {
    throw new Error(`Expected 8 initial cards, got ${renderedCards.length}`);
  }

  vm.runInContext('loadMoreMLRecommendations()', context);
  renderedCards = recRow.querySelectorAll('.ml-game-card');
  console.log(`After load more card count: ${renderedCards.length}`);
  if (renderedCards.length !== 16) {
    throw new Error(`Expected 16 cards, got ${renderedCards.length}`);
  }
  console.log('[PASS] Recommendation pagination verified.');

  console.log('\n' + '='.repeat(60));
  console.log('ALL CLIENT-SIDE & STEAM COMPATIBILITY TESTS PASSED 100%!');
  console.log('='.repeat(60));
}

runTests().catch(err => {
  console.error(err);
  process.exit(1);
});
