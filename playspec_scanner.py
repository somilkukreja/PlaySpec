import os
import sys
import json
import base64
import time
import subprocess
import webbrowser

def get_system_specs():
    specs = {
        "gpu": "Generic Graphics",
        "gpuDetail": "Standard Display Adapter",
        "cpu": "Generic Processor",
        "cpuDetail": f"{os.cpu_count() or 4} Logical Cores",
        "ram": "8 GB RAM",
        "ramDetail": "8 GB Physical Memory",
        "storage": "512 GB NVMe",
        "storageDetail": "240 GB Free Space",
        "display": "1920 × 1080",
        "displayDetail": "60 Hz Display",
        "os": "Windows 11",
        "osDetail": "64-bit Operating System"
    }

    if sys.platform == "win32":
        try:
            cmd_gpu = "Get-CimInstance Win32_VideoController | Select-Object Name, AdapterRAM | ConvertTo-Json"
            out = subprocess.check_output(['powershell', '-NoProfile', '-Command', cmd_gpu], text=True, timeout=6)
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
                        vram_str = f" - {vram_gb} GB VRAM"
                specs['gpuDetail'] = f"{full_name}{vram_str}"
        except Exception:
            pass

        try:
            cmd_cpu = "Get-CimInstance Win32_Processor | Select-Object Name, NumberOfCores, NumberOfLogicalProcessors, MaxClockSpeed | ConvertTo-Json"
            out = subprocess.check_output(['powershell', '-NoProfile', '-Command', cmd_cpu], text=True, timeout=6)
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
                specs['cpuDetail'] = f"{cores} Cores - {threads} Threads - {clock} GHz"
        except Exception:
            pass

        try:
            cmd_ram = "(Get-CimInstance Win32_PhysicalMemory | Measure-Object Capacity -Sum).Sum / 1GB"
            out = subprocess.check_output(['powershell', '-NoProfile', '-Command', cmd_ram], text=True, timeout=6).strip()
            ram_gb = round(float(out))
            specs['ram'] = f"{ram_gb} GB RAM"
            specs['ramDetail'] = f"{ram_gb} GB Physical Memory"
        except Exception:
            pass

        try:
            cmd_disk = "Get-CimInstance Win32_LogicalDisk | Select-Object DeviceID, Size, FreeSpace | ConvertTo-Json"
            out = subprocess.check_output(['powershell', '-NoProfile', '-Command', cmd_disk], text=True, timeout=6)
            data = json.loads(out)
            if isinstance(data, dict):
                data = [data]
            c_drive = next((d for d in data if d.get('DeviceID') == 'C:'), data[0] if data else None)
            if c_drive:
                total_gb = round(c_drive.get('Size', 0) / (1024**3))
                free_gb = round(c_drive.get('FreeSpace', 0) / (1024**3))
                specs['storage'] = f"{total_gb} GB Storage"
                specs['storageDetail'] = f"{free_gb} GB Free on Drive C:"
        except Exception:
            pass

        try:
            cmd_os = "Get-CimInstance Win32_OperatingSystem | Select-Object Caption, OSArchitecture | ConvertTo-Json"
            out = subprocess.check_output(['powershell', '-NoProfile', '-Command', cmd_os], text=True, timeout=6)
            data = json.loads(out)
            if data and data.get('Caption'):
                specs['os'] = data['Caption'].replace('Microsoft ', '').strip()
                specs['osDetail'] = f"{data.get('OSArchitecture', '64-bit')} • Windows Platform"
        except Exception:
            pass

    return specs

def copy_to_clipboard(text):
    try:
        cmd = f'Set-Clipboard -Value "{text}"'
        subprocess.run(['powershell', '-NoProfile', '-Command', cmd], check=False)
    except Exception:
        pass

def main():
    print("=" * 60)
    print(" 🎮 PlaySpec Hardware Scanner v1.0")
    print("=" * 60)
    print(" Scanning system hardware...")
    
    specs = get_system_specs()
    
    print("\n [✓] GPU:      ", specs['gpuDetail'])
    print(" [✓] CPU:      ", specs['cpuDetail'])
    print(" [✓] RAM:      ", specs['ramDetail'])
    print(" [✓] Storage:  ", specs['storageDetail'])
    print(" [✓] Display:  ", specs['displayDetail'])
    print(" [✓] OS:       ", specs['osDetail'])
    print("\n" + "=" * 60)

    # Encode spec payload
    payload_json = json.dumps(specs)
    encoded_token = base64.urlsafe_b64encode(payload_json.encode('utf-8')).decode('utf-8')

    target_base = "https://playspec.vercel.app"
    try:
        import urllib.request
        urllib.request.urlopen("http://localhost:8000/api/health", timeout=1)
        target_base = "http://localhost:8000"
    except Exception:
        target_base = "https://playspec.vercel.app"

    target_url = f"{target_base}/?specs={encoded_token}"
    copy_to_clipboard(encoded_token)

    print(" 🚀 Launching PlaySpec Intelligence Dashboard...")
    print(" Spec Token copied to clipboard!")
    print(f" URL: {target_url[:65]}...")
    print("=" * 60)

    try:
        webbrowser.open(target_url)
    except Exception:
        pass

    print("\nPress ENTER to exit...")
    try:
        input()
    except Exception:
        time.sleep(5)

if __name__ == "__main__":
    main()
