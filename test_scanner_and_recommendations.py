import requests
import json
import base64
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

BASE_URL = "http://localhost:8000"

def test_native_scan_endpoint():
    print("\n--- 1. Testing GET /api/pc/native-scan ---")
    r = requests.get(f"{BASE_URL}/api/pc/native-scan")
    assert r.status_code == 200, f"Expected 200, got {r.status_code}"
    data = r.json()
    assert data.get("status") == "success", f"Unexpected status: {data}"
    assert data.get("source") == "native_system_wmi", f"Unexpected source: {data}"
    specs = data.get("specs", {})
    print("Detected System Specs:")
    print(f"  GPU:     {specs.get('gpu')} ({specs.get('vram')})")
    print(f"  CPU:     {specs.get('cpu')} ({specs.get('cpuDetail')})")
    print(f"  RAM:     {specs.get('ram')} ({specs.get('ramDetail')})")
    print(f"  Storage: {specs.get('storage')} ({specs.get('storageDetail')})")
    print(f"  OS:      {specs.get('os')} ({specs.get('osDetail')})")
    print(f"  Verified:{specs.get('isVerifiedRealHardware')}")
    assert "RTX" in specs.get("gpu", "") or "GeForce" in specs.get("gpuDetail", "") or "Graphics" in specs.get("gpu", ""), "GPU not detected properly"
    assert "16" in specs.get("ram", "") or "RAM" in specs.get("ram", ""), "RAM not detected properly"
    print("[PASS] /api/pc/native-scan PASSED")
    return specs

def test_recommendations_with_native_specs(specs):
    print("\n--- 2. Testing Recommendations with Native Hardware Specs ---")
    payload = {
        "gpu": specs.get("gpu", "RTX 3050 6GB Laptop GPU"),
        "cpu": specs.get("cpu", "i5-12450HX (12th Gen)"),
        "ram": specs.get("ram", "16 GB RAM"),
        "vram": specs.get("vram", "6.0 GB VRAM"),
        "storage": specs.get("storage", "256 GB SSD"),
        "category": "all"
    }
    r = requests.post(f"{BASE_URL}/api/ml/recommend", json=payload)
    assert r.status_code == 200, f"Expected 200, got {r.status_code}"
    data = r.json()
    assert data.get("status") == "success", f"Unexpected status: {data}"
    print(f"Hardware Tier:  {data.get('tier_label')} (Score: {data.get('rig_index')}/100)")
    metrics = data.get("hardware_metrics", {})
    print(f"GPU Score:      {metrics.get('gpu_score')}/100")
    print(f"CPU Score:      {metrics.get('cpu_score')}/100")
    print(f"RAM Score:      {metrics.get('ram_score')}/100")
    print(f"VRAM Score:     {metrics.get('vram_score')}/100")
    
    recs = data.get("recommendations", [])
    print(f"Recommended Games Count: {len(recs)}")
    assert len(recs) > 0, "No recommendations returned"
    
    for i, g in enumerate(recs[:5], 1):
        print(f"  {i}. {g.get('title')} | Compat: {g.get('compat_score')}% | FPS: {g.get('fps_display')} | Tag: {g.get('category_tag')}")
        assert g.get("reasons"), "Missing reasons list"
    
    print("[PASS] ML Recommendations with Native Specs PASSED")

def test_static_and_downloads():
    print("\n--- 3. Testing Static Assets & Scanner Download Links ---")
    r_bat = requests.get(f"{BASE_URL}/downloads/PlaySpec-QuickScan.bat")
    assert r_bat.status_code == 200, f"Failed to fetch PlaySpec-QuickScan.bat: {r_bat.status_code}"
    assert "PlaySpec Universal Hardware Diagnostics Scanner" in r_bat.text or "PlaySpec Hardware Diagnostics Scanner" in r_bat.text, "Invalid .bat content"
    print("[PASS] PlaySpec-QuickScan.bat is accessible and valid")

    r_html = requests.get(f"{BASE_URL}/")
    assert r_html.status_code == 200, f"Failed to fetch index.html: {r_html.status_code}"
    assert "runRealHardwareScan" in r_html.text, "runRealHardwareScan missing from index.html"
    assert "Scan PC Hardware" in r_html.text, "Scan PC Hardware button missing from index.html"
    assert "Re-Scan PC" not in r_html.text, "Old Re-Scan PC button still found in index.html!"
    print("[PASS] index.html successfully updated without old Re-Scan PC button")

    r_js = requests.get(f"{BASE_URL}/app.js")
    assert r_js.status_code == 200, f"Failed to fetch app.js: {r_js.status_code}"
    assert "runRealHardwareScan" in r_js.text, "runRealHardwareScan missing from app.js"
    assert "isVerifiedRealHardware" in r_js.text, "isVerifiedRealHardware missing from app.js"
    print("[PASS] app.js successfully updated and serving correctly")

if __name__ == "__main__":
    specs = test_native_scan_endpoint()
    test_recommendations_with_native_specs(specs)
    test_static_and_downloads()
    print("\n=======================================================")
    print(" ALL END-TO-END NATIVE SCANNER & PERSISTENCE TESTS PASSED! ")
    print("=======================================================\n")
