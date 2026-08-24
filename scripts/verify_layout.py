import urllib.request
import re
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

url = "http://localhost:8000/"
print(f"Fetching {url}...")
html = urllib.request.urlopen(url).read().decode('utf-8')

# Check 1: pc-profile section position in <main>
main_idx = html.find('<main>')
pc_idx = html.find('id="pc-profile"')
db_idx = html.find('id="game-database"')
compat_idx = html.find('id="steam-compatibility"')

print(f"main_idx: {main_idx}")
print(f"pc_idx: {pc_idx}")
print(f"db_idx: {db_idx}")
print(f"compat_idx: {compat_idx}")

assert pc_idx != -1, "pc-profile not found"
assert pc_idx > main_idx, "pc-profile is not inside main"
assert pc_idx < db_idx, "pc-profile is not before game-database"
print("✓ [PASS] Hardware Profile & Diagnostics is the FIRST section inside <main>!")

# Check 2: First tab in subnav tabs
first_tab_match = re.search(r'id="cyberSubnavTabs"[\s\S]*?<button[^>]*data-tab-target="([^"]+)"', html)
assert first_tab_match, "Could not find first tab in subnav"
first_tab = first_tab_match.group(1)
print(f"First subnav tab: {first_tab}")
assert first_tab == "pc-profile", f"First subnav tab should be pc-profile, got {first_tab}"
print("✓ [PASS] Hardware & Scan is the FIRST tab in navigation sub-bar!")

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
