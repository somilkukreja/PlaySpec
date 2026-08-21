import sys
sys.stdout.reconfigure(encoding='utf-8')
import server
import json

print('=' * 60)
print('PLAYSPEC UNIVERSAL STEAM COMPATIBILITY TEST SUITE')
print('=' * 60)

# Test Rig: RTX 3050 6GB Laptop, i5-12450HX, 16GB RAM
test_rig = {
    'gpu': 'RTX 3050 6GB',
    'cpu': 'i5-12450HX',
    'ram': '16 GB',
    'vram': '6 GB',
    'storage': '256 GB SSD Available',
    'os': 'Windows 11 64-bit'
}
hw = server.parse_and_score_hardware(test_rig)
print(f"Test Hardware: {hw['gpu']} | Rig Index: {hw['rig_index']}/100 | Tier: {hw['tier_label']}")

# 1. Test evaluate_steam_game_compatibility for multiple Steam games
steam_test_games = [
    (2358720, "Black Myth: Wukong"),
    (1091500, "Cyberpunk 2077"),
    (271590, "Grand Theft Auto V"),
    (553850, "HELLDIVERS 2"),
    (730, "Counter-Strike 2"),
    (391540, "Undertale")
]

print("\n--- 1. Testing Universal Steam Game Compatibility Engine ---")
for appid, expected_title in steam_test_games:
    res = server.evaluate_steam_game_compatibility(hw, appid)
    print(f"\n[+] {res['title']} (AppID: {res['appid']})")
    print(f"    Verdict: {res['category']} | Compatibility Score: {res['compat_score']}%")
    print(f"    Predicted FPS: {res['fps_display']} | Preset: {res['optimal_setting']}")
    print(f"    Bottleneck Status: {res['bottleneck']}")
    print(f"    GPU: {res['comparison']['gpu']['user_spec']} vs Min: {res['comparison']['gpu']['min_spec']} -> {res['comparison']['gpu']['status_label']}")
    print(f"    CPU: {res['comparison']['cpu']['user_spec']} vs Min: {res['comparison']['cpu']['min_spec']} -> {res['comparison']['cpu']['status_label']}")
    print(f"    RAM: {res['comparison']['ram']['user_spec']} vs Min: {res['comparison']['ram']['min_spec']} -> {res['comparison']['ram']['status_label']}")
    print(f"    Price: {res['price']} | Store URL: {res['steam_url']}")

    assert res['compat_score'] >= 0 and res['compat_score'] <= 100, "Compat score out of range"
    assert 'gpu' in res['comparison'] and 'cpu' in res['comparison'] and 'ram' in res['comparison'], "Missing spec comparisons"
    assert len(res['reasons']) > 0, "Missing explainable reasons"

print("\n[PASS] Universal Steam game compatibility verified for all test titles!")

# 2. Test search with live hardware compatibility scoring
print("\n--- 2. Testing Live Steam Store Search with Hardware Telemetry ---")
with server.app.test_client() as client:
    # Test text query
    s_resp = client.get(f"/api/steam/search?q=forza&gpu={test_rig['gpu']}&cpu={test_rig['cpu']}&ram={test_rig['ram']}")
    assert s_resp.status_code == 200, f"Search failed with {s_resp.status_code}"
    s_data = s_resp.get_json()
    items = s_data.get('items', [])
    print(f"Search 'forza' returned {len(items)} items:")
    for it in items[:3]:
        print(f"  - {it['title']} (ID: {it['id']}) | Compat: {it.get('compatText')} | Score: {it.get('compat_score')}% | FPS: {it.get('fps_display')}")
        assert 'compat_score' in it, "Missing compat_score in search result"

    # Test /api/steam/check-compatibility by query string
    c_resp = client.post("/api/steam/check-compatibility", json={
        "query": "Elden Ring",
        "rig": test_rig
    })
    assert c_resp.status_code == 200, f"Check compatibility failed with {c_resp.status_code}"
    c_data = c_resp.get_json()
    print(f"\n[+] Check by title query 'Elden Ring':")
    print(f"    Found: {c_data['title']} (AppID: {c_data['appid']}) | Score: {c_data['compat_score']}% | Verdict: {c_data['category']}")

    # Test /api/steam/check-compatibility by Steam Store URL
    url_resp = client.post("/api/steam/check-compatibility", json={
        "query": "https://store.steampowered.com/app/1623730/Palworld/",
        "rig": test_rig
    })
    assert url_resp.status_code == 200, f"Check by URL failed with {url_resp.status_code}"
    url_data = url_resp.get_json()
    print(f"\n[+] Check by URL 'https://store.steampowered.com/app/1623730/Palworld/':")
    print(f"    Found: {url_data['title']} (AppID: {url_data['appid']}) | Score: {url_data['compat_score']}% | Verdict: {url_data['category']}")

print("\n" + "=" * 60)
print("ALL UNIVERSAL STEAM COMPATIBILITY ENGINE TESTS PASSED 100%!")
print("=" * 60)
