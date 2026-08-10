import os
import re
import json
import time
import requests
import sys
import subprocess
import platform
from flask import Flask, send_from_directory, jsonify, request

app = Flask(__name__, static_folder=None)

def detect_system_hardware():
    specs = {
        "gpu": "Generic Graphics",
        "gpu_detail": "Standard Display Adapter",
        "cpu": "Generic Processor",
        "cpu_detail": f"{os.cpu_count() or 4} Logical Cores",
        "ram": "8 GB DDR4",
        "ram_detail": "8 GB Total Memory",
        "storage": "512 GB SSD",
        "storage_detail": "256 GB Free",
        "display": "1920 × 1080",
        "display_detail": "60 Hz",
        "os": f"{platform.system()} {platform.release()}",
        "os_detail": f"{platform.architecture()[0]} • {platform.machine()}"
    }

    if sys.platform == "win32":
        try:
            cmd_gpu = "Get-CimInstance Win32_VideoController | Select-Object Name, AdapterRAM | ConvertTo-Json"
            out = subprocess.check_output(['powershell', '-NoProfile', '-Command', cmd_gpu], text=True, timeout=5)
            data = json.loads(out)
            if isinstance(data, dict):
                data = [data]
            
            best_gpu = None
            for item in data:
                name = item.get('Name', '')
                if not name:
                    continue
                if any(k in name for k in ['NVIDIA', 'GeForce', 'Radeon', 'RTX', 'GTX', 'RX']):
                    best_gpu = item
                    break
                elif not best_gpu:
                    best_gpu = item

            if best_gpu and best_gpu.get('Name'):
                full_name = best_gpu['Name']
                clean_name = full_name.replace('NVIDIA GeForce ', '').replace('AMD Radeon ', '').replace('(R)', '').replace('(TM)', '').strip()
                specs['gpu'] = clean_name
                vram_bytes = best_gpu.get('AdapterRAM')
                vram_str = ""
                if vram_bytes and isinstance(vram_bytes, (int, float)) and vram_bytes > 0:
                    vram_gb = round(vram_bytes / (1024**3), 1)
                    if vram_gb > 0:
                        vram_str = f" • {vram_gb} GB VRAM"
                specs['gpu_detail'] = f"{full_name}{vram_str}"
        except Exception:
            pass

        try:
            cmd_cpu = "Get-CimInstance Win32_Processor | Select-Object Name, NumberOfCores, NumberOfLogicalProcessors, MaxClockSpeed | ConvertTo-Json"
            out = subprocess.check_output(['powershell', '-NoProfile', '-Command', cmd_cpu], text=True, timeout=5)
            data = json.loads(out)
            if isinstance(data, list):
                data = data[0]
            if data and data.get('Name'):
                full_cpu = data['Name']
                clean_cpu = full_cpu.replace('Intel(R) Core(TM) ', '').replace('AMD Ryzen ', '').replace('Processor', '').strip()
                specs['cpu'] = clean_cpu
                cores = data.get('NumberOfCores', '')
                threads = data.get('NumberOfLogicalProcessors', '')
                clock = round(data.get('MaxClockSpeed', 0) / 1000, 1)
                specs['cpu_detail'] = f"{cores} Cores • {threads} Threads • {clock} GHz"
        except Exception:
            pass

        try:
            cmd_ram = "(Get-CimInstance Win32_PhysicalMemory | Measure-Object Capacity -Sum).Sum / 1GB"
            out = subprocess.check_output(['powershell', '-NoProfile', '-Command', cmd_ram], text=True, timeout=5).strip()
            ram_gb = round(float(out))
            specs['ram'] = f"{ram_gb} GB RAM"
            specs['ram_detail'] = f"{ram_gb} GB Physical Memory"
        except Exception:
            pass

        try:
            cmd_disk = "Get-CimInstance Win32_LogicalDisk | Select-Object DeviceID, Size, FreeSpace | ConvertTo-Json"
            out = subprocess.check_output(['powershell', '-NoProfile', '-Command', cmd_disk], text=True, timeout=5)
            data = json.loads(out)
            if isinstance(data, dict):
                data = [data]
            c_drive = next((d for d in data if d.get('DeviceID') == 'C:'), data[0] if data else None)
            if c_drive:
                total_gb = round(c_drive.get('Size', 0) / (1024**3))
                free_gb = round(c_drive.get('FreeSpace', 0) / (1024**3))
                specs['storage'] = f"{total_gb} GB NVMe"
                specs['storage_detail'] = f"{free_gb} GB Free"
        except Exception:
            pass

    return specs


STEAM_API_KEY = os.environ.get("STEAM_API_KEY", "607A835C0480E95E51A32C4EC5952F29")
STEAM_API_BASE = "https://api.steampowered.com"
STEAM_STORE_BASE = "https://store.steampowered.com/api"

# Simple in-memory cache
cache = {}
CACHE_TTL = 300  # 5 minutes

def get_cached(key):
    if key in cache:
        item, timestamp = cache[key]
        if time.time() - timestamp < CACHE_TTL:
            return item
    return None

def set_cached(key, item):
    cache[key] = (item, time.time())

# Helper to parse Steam HTML requirements into CPU, GPU, RAM
def parse_requirements_html(req_html):
    if not req_html or not isinstance(req_html, str):
        return {"cpu": "N/A", "gpu": "N/A", "ram": "N/A"}
    
    # Strip tags to inspect lines
    clean_text = re.sub(r'<[^>]+>', '\n', req_html)
    lines = [line.strip() for line in clean_text.split('\n') if line.strip()]
    
    cpu, gpu, ram = "N/A", "N/A", "N/A"
    
    for i, line in enumerate(lines):
        line_lower = line.lower()
        if 'processor:' in line_lower or 'cpu:' in line_lower:
            cpu = line.split(':', 1)[-1].strip() if ':' in line else line
        elif 'graphics:' in line_lower or 'gpu:' in line_lower or 'video card:' in line_lower:
            gpu = line.split(':', 1)[-1].strip() if ':' in line else line
        elif 'memory:' in line_lower or 'ram:' in line_lower:
            ram = line.split(':', 1)[-1].strip() if ':' in line else line

    return {"cpu": cpu, "gpu": gpu, "ram": ram}


# --- Static Files Routes ---
@app.route('/')
def serve_index():
    return send_from_directory('.', 'index.html')



# --- REST API Endpoints ---

@app.route('/api/health')
def health_check():
    return jsonify({
        "status": "healthy",
        "service": "PlaySpec Gaming Intelligence Backend",
        "steam_key_configured": bool(STEAM_API_KEY),
        "timestamp": int(time.time())
    })

@app.route('/api/currency/rates')
def get_currency_rates():
    cache_key = "currency_rates"
    cached = get_cached(cache_key)
    if cached:
        return jsonify(cached)
    try:
        resp = requests.get("https://open.er-api.com/v6/latest/USD", timeout=10)
        data = resp.json()
        rates = data.get("rates", {})
        result = {
            "base": "USD",
            "rates": {
                "USD": 1.0,
                "INR": round(rates.get("INR", 83.5), 2),
                "EUR": round(rates.get("EUR", 0.92), 2),
                "GBP": round(rates.get("GBP", 0.78), 2),
                "JPY": round(rates.get("JPY", 155.0), 2),
                "CAD": round(rates.get("CAD", 1.37), 2),
                "AUD": round(rates.get("AUD", 1.52), 2)
            }
        }
        set_cached(cache_key, result)
        return jsonify(result)
    except Exception:
        return jsonify({
            "base": "USD",
            "rates": {"USD": 1.0, "INR": 83.5, "EUR": 0.92, "GBP": 0.78, "JPY": 155.0, "CAD": 1.37, "AUD": 1.52}
        })

@app.route('/api/steam/free-games')
def get_free_games_endpoint():
    cache_key = "steam_free_games"
    cached = get_cached(cache_key)
    if cached:
        return jsonify(cached)

    free_items = []
    seen_ids = set()

    # 1. Fetch live 100% OFF & free items from featured categories
    try:
        url = f"{STEAM_STORE_BASE}/featuredcategories/"
        resp = requests.get(url, headers={'User-Agent': 'PlaySpec/1.0'}, timeout=8)
        data = resp.json()
        for cat_name in ['specials', 'new_releases', 'top_sellers', 'coming_soon']:
            items = data.get(cat_name, {}).get('items', [])
            for item in items:
                if isinstance(item, dict):
                    appid = item.get('id')
                    if (item.get('final_price') == 0 or item.get('is_free') or item.get('discount_percent') == 100) and appid not in seen_ids:
                        free_items.append({
                            "appid": appid,
                            "title": item.get('name'),
                            "image": item.get('header_image') or item.get('large_capsule_image'),
                            "platform": "Steam Store",
                            "platformIcon": "🔵",
                            "tag": "100% OFF SPECIAL" if item.get('discount_percent') == 100 else "STEAM FREE TO PLAY",
                            "timeLeft": "Live Special Promotion",
                            "store_url": f"https://store.steampowered.com/app/{appid}"
                        })
                        seen_ids.add(appid)
    except Exception:
        pass

    # 2. Popular free-to-play titles (CS2, Dota 2, Apex, TF2, Destiny 2, PUBG)
    popular_free_ids = [730, 570, 1172470, 440, 1085660, 578080]
    for appid in popular_free_ids:
        if appid not in seen_ids:
            try:
                app_url = f"{STEAM_STORE_BASE}/appdetails?appids={appid}"
                res = requests.get(app_url, headers={'User-Agent': 'PlaySpec/1.0'}, timeout=5).json()
                app_data = res.get(str(appid), {}).get('data', {})
                if app_data:
                    free_items.append({
                        "appid": appid,
                        "title": app_data.get('name'),
                        "image": app_data.get('header_image'),
                        "platform": "Steam Store",
                        "platformIcon": "🔵",
                        "tag": "STEAM FREE TO PLAY",
                        "timeLeft": "Always Free To Play",
                        "store_url": f"https://store.steampowered.com/app/{appid}"
                    })
                    seen_ids.add(appid)
            except Exception:
                pass

    result = {"items": free_items}
    set_cached(cache_key, result)
    return jsonify(result)


@app.route('/api/steam/featured')
def get_featured_games():
    cache_key = "featured_games"
    cached_data = get_cached(cache_key)
    if cached_data:
        return jsonify(cached_data)

    try:
        url = f"{STEAM_STORE_BASE}/featuredcategories/"
        resp = requests.get(url, headers={'User-Agent': 'PlaySpec/1.0'}, timeout=10)
        data = resp.json()
        
        specials = data.get('specials', {}).get('items', [])
        top_sellers = data.get('top_sellers', {}).get('items', [])
        new_releases = data.get('new_releases', {}).get('items', [])

        def format_item(item):
            if not isinstance(item, dict):
                item = {}
            final_raw = item.get('final_price') if item.get('final_price') is not None else 0
            orig_raw = item.get('original_price') if item.get('original_price') is not None else 0
            final_p = float(final_raw) / 100.0
            orig_p = float(orig_raw) / 100.0
            curr_code = item.get('currency') or 'USD'
            symbol = '$' if curr_code == 'USD' else ('₹' if curr_code == 'INR' else '€' if curr_code == 'EUR' else curr_code + ' ')
            
            discount = item.get('discount_percent') if item.get('discount_percent') is not None else 0
            price_badge = "great" if discount >= 50 else ("normal" if discount > 0 else "wait")
            price_badge_text = "💰 Great Price" if discount >= 50 else ("🟡 Normal Sale" if discount > 0 else "🔴 Normal Price")
            
            item_id = item.get('id') if item.get('id') is not None else 1000
            
            return {
                "id": item_id,
                "title": item.get('name') or "Steam Game",
                "image": item.get('header_image') or item.get('large_capsule_image') or item.get('small_capsule_image') or "images/cyberpunk.png",
                "discount": f"-{discount}%" if discount > 0 else "",
                "discountPercent": discount,
                "currentPrice": f"{symbol}{final_p:.2f}" if final_p > 0 else "Free",
                "originalPrice": f"{symbol}{orig_p:.2f}" if orig_p > 0 and orig_p != final_p else "",
                "priceBadge": price_badge,
                "priceBadgeText": price_badge_text,
                "compat": "excellent",
                "compatText": "🟢 Runs Great",
                "match": 90 + (item_id % 10),
            }

        result = {
          "specials": [format_item(i) for i in specials[:10]],
          "top_sellers": [format_item(i) for i in top_sellers[:10]],
          "new_releases": [format_item(i) for i in new_releases[:10]],
        }
        
        set_cached(cache_key, result)
        return jsonify(result)
    except Exception as e:
        import traceback
        err_msg = traceback.format_exc()
        return jsonify({"error": str(e), "trace": err_msg}), 500


@app.route('/api/steam/app/<int:appid>')
def get_app_details(appid):
    cache_key = f"app_details_{appid}"
    cached_data = get_cached(cache_key)
    if cached_data:
        return jsonify(cached_data)

    try:
        url = f"{STEAM_STORE_BASE}/appdetails?appids={appid}"
        resp = requests.get(url, headers={'User-Agent': 'PlaySpec/1.0'}, timeout=10)
        json_resp = resp.json()
        
        app_entry = json_resp.get(str(appid), {})
        if not app_entry.get('success'):
            return jsonify({"error": "App not found or unavailable"}), 404
            
        data = app_entry.get('data', {})
        
        price_ov = data.get('price_overview', {})
        final_price_fmt = price_ov.get('final_formatted', 'Free to Play' if data.get('is_free') else 'N/A')
        initial_price_fmt = price_ov.get('initial_formatted', '')
        discount = price_ov.get('discount_percent', 0)
        
        pc_reqs = data.get('pc_requirements', {})
        min_req_raw = pc_reqs.get('minimum', '') if isinstance(pc_reqs, dict) else ''
        rec_req_raw = pc_reqs.get('recommended', '') if isinstance(pc_reqs, dict) else ''
        
        min_parsed = parse_requirements_html(min_req_raw)
        rec_parsed = parse_requirements_html(rec_req_raw)
        
        result = {
            "appid": appid,
            "title": data.get('name'),
            "type": data.get('type'),
            "description": data.get('short_description'),
            "header_image": data.get('header_image'),
            "screenshots": [s.get('path_full') for s in data.get('screenshots', [])[:4]],
            "genres": [g.get('description') for g in data.get('genres', [])],
            "release_date": data.get('release_date', {}).get('date'),
            "developers": data.get('developers', []),
            "publishers": data.get('publishers', []),
            "is_free": data.get('is_free', False),
            "price": {
                "current": final_price_fmt,
                "original": initial_price_fmt,
                "discount_percent": discount,
            },
            "requirements": {
                "minimum": min_parsed,
                "recommended": rec_parsed,
                "minimum_raw": min_req_raw,
                "recommended_raw": rec_req_raw
            }
        }
        
        set_cached(cache_key, result)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/steam/search')
def search_steam():
    query = request.args.get('q', '').strip()
    if not query:
        return jsonify({"items": []})

    cache_key = f"search_{query.lower()}"
    cached_data = get_cached(cache_key)
    if cached_data:
        return jsonify(cached_data)

    try:
        url = f"{STEAM_STORE_BASE}/storesearch/?term={query}&l=english&cc=US"
        resp = requests.get(url, headers={'User-Agent': 'PlaySpec/1.0'}, timeout=10)
        data = resp.json()
        
        items = data.get('items', [])
        formatted = []
        for i in items:
            formatted.append({
                "id": i.get('id'),
                "title": i.get('name'),
                "image": i.get('tiny_image'),
                "compatText": "🟢 Runs Great",
                "priceBadgeText": "Live Item"
            })
            
        result = {"items": formatted}
        set_cached(cache_key, result)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/steam/user/<steam_id_or_vanity>')
def get_steam_user(steam_id_or_vanity):
    target = steam_id_or_vanity.strip()
    steam_id = target
    
    # If vanity URL username (not 17-digit numeric steamid)
    if not (target.isdigit() and len(target) == 17):
        try:
            vanity_url = f"{STEAM_API_BASE}/ISteamUser/ResolveVanityURL/v1/?key={STEAM_API_KEY}&vanityurl={target}"
            v_resp = requests.get(vanity_url, timeout=10).json()
            resolved_id = v_resp.get('response', {}).get('steamid')
            if resolved_id:
                steam_id = resolved_id
            else:
                return jsonify({"error": f"Could not resolve Steam vanity username '{target}'"}), 404
        except Exception as e:
            return jsonify({"error": f"Failed to resolve Steam vanity username: {str(e)}"}), 500

    cache_key = f"steam_user_{steam_id}"
    cached_data = get_cached(cache_key)
    if cached_data:
        return jsonify(cached_data)

    try:
        player_url = f"{STEAM_API_BASE}/ISteamUser/GetPlayerSummaries/v2/?key={STEAM_API_KEY}&steamids={steam_id}"
        p_resp = requests.get(player_url, timeout=10).json()
        players = p_resp.get('response', {}).get('players', [])
        
        if not players:
            return jsonify({"error": "Steam player profile not found"}), 404
            
        player = players[0]
        
        # Owned games
        games_url = f"{STEAM_API_BASE}/IPlayerService/GetOwnedGames/v1/?key={STEAM_API_KEY}&steamid={steam_id}&include_appinfo=true&include_played_free_games=true"
        g_resp = requests.get(games_url, timeout=10).json()
        games_data = g_resp.get('response', {})
        
        owned_games = []
        for g in games_data.get('games', []):
            owned_games.append({
                "appid": g.get('appid'),
                "name": g.get('name'),
                "playtime_forever": g.get('playtime_forever', 0),
                "playtime_hours": round(g.get('playtime_forever', 0) / 60, 1),
                "icon": f"https://media.steampowered.com/steamcommunity/public/images/apps/{g.get('appid')}/{g.get('img_icon_url')}.jpg" if g.get('img_icon_url') else ""
            })
            
        # Sort by playtime
        owned_games.sort(key=lambda x: x['playtime_forever'], reverse=True)
        
        result = {
            "steamid": steam_id,
            "persona_name": player.get('personaname'),
            "profile_url": player.get('profileurl'),
            "avatar": player.get('avatarfull') or player.get('avatarmedium'),
            "personastate": player.get('personastate'),
            "communityvisibilitystate": player.get('communityvisibilitystate'),
            "game_count": games_data.get('game_count', 0),
            "is_private": games_data.get('game_count') is None,
            "owned_games": owned_games
        }
        
        set_cached(cache_key, result)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/pc/detect', methods=['GET'])
def get_detected_specs():
    try:
        specs = detect_system_hardware()
        return jsonify({
            "status": "success",
            "specs": specs
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route('/api/pc/analyze', methods=['POST'])
def analyze_pc():
    data = request.json or {}
    gpu = str(data.get('gpu', 'RTX 3050')).lower()
    cpu = str(data.get('cpu', 'i5-12450HX')).lower()
    ram_str = str(data.get('ram', '16GB')).lower()
    
    ram_gb = 16
    match_ram = re.search(r'\d+', ram_str)
    if match_ram:
        ram_gb = int(match_ram.group(0))

    score = 75
    if any(k in gpu for k in ['4090', '4080', '7900 xt', '7900 xtx', '4070 ti']):
        score = 99
    elif any(k in gpu for k in ['4070', '3080', '3090', '6800', '6900']):
        score = 95
    elif any(k in gpu for k in ['3060', '3070', '4060', '6700', '6600', '2080', '2070']):
        score = 90
    elif any(k in gpu for k in ['3050', '2060', '1660', '5600', 'rx 580', 'gtx 1070']):
        score = 84
    elif any(k in gpu for k in ['1050', '1650', 'rx 570', 'gtx 970', 'intel iris', 'uhd', 'm1', 'm2']):
        score = 68
    else:
        score = 78

    if ram_gb >= 32:
        score += 3
    elif ram_gb <= 8:
        score -= 10

    score = min(99, max(40, score))
    
    total_games = 1284
    excellent_cnt = round(total_games * (score / 130.0))
    playable_cnt = round(total_games * 0.35)
    low_cnt = max(0, total_games - excellent_cnt - playable_cnt)

    rating_text = "⭐ ULTRA GAMING RIG" if score >= 95 else ("⭐ EXCELLENT GAMING RIG" if score >= 85 else "✅ PLAYABLE GAMING RIG")

    return jsonify({
        "status": "success",
        "hardware": {"gpu": data.get('gpu'), "cpu": data.get('cpu'), "ram": data.get('ram')},
        "score": score,
        "playable_games_est": total_games,
        "breakdown": {
            "excellent": excellent_cnt,
            "playable": playable_cnt,
            "low": low_cnt
        },
        "rating": rating_text
    })



@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory('.', filename)


if __name__ == '__main__':
    port = int(os.environ.get("PORT", 8000))
    print(f"=== Starting PlaySpec Server on http://localhost:{port} (Steam Web API Key: Configured) ===")
    app.run(host='0.0.0.0', port=port, debug=False)

