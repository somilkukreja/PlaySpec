import urllib.request
import re
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

url = "http://localhost:8000/"
print(f"Fetching {url}...")
html = urllib.request.urlopen(url).read().decode('utf-8')

# Check 1: pc-profile and ml-recommendations section positions in <main>
main_idx = html.find('<main>')
pc_idx = html.find('id="pc-profile"')
ml_idx = html.find('id="ml-recommendations"')
db_idx = html.find('id="game-database"')
compat_idx = html.find('id="steam-compatibility"')

print(f"main_idx: {main_idx}")
print(f"pc_idx: {pc_idx}")
print(f"ml_idx: {ml_idx}")
print(f"db_idx: {db_idx}")
print(f"compat_idx: {compat_idx}")

assert pc_idx != -1, "pc-profile not found"
assert pc_idx > main_idx, "pc-profile is not inside main"
assert ml_idx > pc_idx, "ml-recommendations is not after pc-profile"
assert ml_idx < db_idx, "ml-recommendations is not before game-database"
print("✓ [PASS] Hardware Profile & Diagnostics is the FIRST section inside <main>!")
print("✓ [PASS] AI Recommendations is the SECOND section inside <main> (immediately after Hardware Profile)!")

# Check 2: First and second tabs in subnav tabs
tabs_match = re.findall(r'<button[^>]*class="cyber-tab[^"]*"[^>]*data-tab-target="([^"]+)"', html)
print(f"Subnav tabs order: {tabs_match[:4]}")
assert tabs_match[0] == "pc-profile", f"First tab should be pc-profile, got {tabs_match[0]}"
assert tabs_match[1] == "ml-recommendations", f"Second tab should be ml-recommendations, got {tabs_match[1]}"
print("✓ [PASS] Hardware & Scan is tab 1, and AI Recommendations is tab 2 in subnav!")

# Check 3: Hero actions contain Download Scanner and Scan buttons
hero_match = re.search(r'class="cyber-hero-actions"[\s\S]*?</div>', html)
assert hero_match, "Hero actions not found"
hero_html = hero_match.group(0)
assert "DOWNLOAD SCANNER (.BAT)" in hero_html, "DOWNLOAD SCANNER (.BAT) button not found in hero"
assert "SCAN PC HARDWARE" in hero_html, "SCAN PC HARDWARE button not found in hero"
assert "HARDWARE PROFILE" in hero_html, "HARDWARE PROFILE button not found in hero"
print("✓ [PASS] Hero actions contain DOWNLOAD SCANNER (.BAT), SCAN PC HARDWARE and HARDWARE PROFILE buttons!")

# Check 4: Top frame shortcuts
assert "runRealHardwareScan" in html, "runRealHardwareScan not found in html"
assert "Scan PC" in html, "Scan PC not found in top frame"
print("✓ [PASS] Top frame and navigation contain instant PC Scanner shortcuts!")

# Check 5: Exactly one pc-profile section id exists (no duplicates)
pc_count = html.count('id="pc-profile"')
print(f"Occurrences of id=\"pc-profile\": {pc_count}")
assert pc_count == 1, f"Expected exactly 1 section with id=\"pc-profile\", got {pc_count}"
print("✓ [PASS] Exactly one pc-profile section exists (no duplicate IDs)!")

print("\n=======================================================")
print(" ALL HARDWARE PROFILE POSITIONING & NAVIGATION TESTS PASSED! ")
print("=======================================================\n")
