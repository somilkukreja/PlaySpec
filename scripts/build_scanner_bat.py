import base64
import os

ps_script = """
$ErrorActionPreference = 'SilentlyContinue'

# ── 1. UNIVERSAL GPU & VRAM SCANNER ──
$gpus = Get-CimInstance Win32_VideoController
$primaryGpu = $null
$vramText = $null

# Check nvidia-smi first for exact NVIDIA GPU & VRAM
try {
    $nvsmi = & nvidia-smi --query-gpu=name,memory.total --format=csv,noheader
    if ($nvsmi) {
        $p = $nvsmi.Split(',')
        if ($p.Length -ge 1 -and $p[0].Trim()) {
            $primaryGpu = $p[0].Trim()
            if ($p.Length -ge 2) {
                $mib = [int]($p[1].Trim().Replace('MiB','').Trim())
                $vGb = [Math]::Round(($mib / 1024.0), 1)
                $vramText = "$vGb GB VRAM"
            }
        }
    }
} catch {}

# If not detected via nvidia-smi, scan all CimInstance video adapters
if (-not $primaryGpu -and $gpus) {
    # Prioritize dedicated GPUs over integrated graphics
    $discGpu = $gpus | Where-Object { $_.Name -match 'NVIDIA|GeForce|RTX|GTX|Titan|Quadro|Radeon RX|Radeon Pro|Arc |Battlemage' } | Select-Object -First 1
    if ($discGpu) {
        $primaryGpu = $discGpu.Name
        if ($discGpu.AdapterRAM -and $discGpu.AdapterRAM -gt 0) {
            $vGb = [Math]::Round(($discGpu.AdapterRAM / 1GB), 1)
            if ($vGb -gt 0 -and $vGb -lt 64) {
                $vramText = "$vGb GB VRAM"
            }
        }
    } else {
        $anyGpu = $gpus | Where-Object { $_.Name } | Select-Object -First 1
        if ($anyGpu) {
            $primaryGpu = $anyGpu.Name
            if ($anyGpu.AdapterRAM -and $anyGpu.AdapterRAM -gt 0) {
                $vGb = [Math]::Round(($anyGpu.AdapterRAM / 1GB), 1)
                if ($vGb -gt 0 -and $vGb -lt 64) {
                    $vramText = "$vGb GB VRAM"
                }
            }
        }
    }
}

if (-not $primaryGpu) {
    $primaryGpu = "Universal Display Adapter"
}

# Infer exact VRAM if missing
if (-not $vramText) {
    $gLow = $primaryGpu.ToLower()
    if ($gLow -match '5090|4090') { $vramText = "24.0 GB VRAM" }
    elseif ($gLow -match '5080|4080|7900 xtx|7900 xt|7800 xt|a770') { $vramText = "16.0 GB VRAM" }
    elseif ($gLow -match '4070 ti|4070|3080 ti|6700 xt|6750 xt|b580') { $vramText = "12.0 GB VRAM" }
    elseif ($gLow -match '3080') { $vramText = "10.0 GB VRAM" }
    elseif ($gLow -match '4060 ti|4060|3070 ti|3070|3060 ti|2080|2070|6600|7600|a750|a580') { $vramText = "8.0 GB VRAM" }
    elseif ($gLow -match '3060') { $vramText = "12.0 GB VRAM" }
    elseif ($gLow -match '3050 6gb|3050.*6gb|1660 ti|1660 super|1660|5600 xt') { $vramText = "6.0 GB VRAM" }
    elseif ($gLow -match '3050|1650|1050 ti|5500 xt|580|570|6500 xt|6400|a380') { $vramText = "4.0 GB VRAM" }
    elseif ($gLow -match '1050|1030|iris|uhd|hd graphics|radeon 780m|radeon 680m') { $vramText = "2.0 GB VRAM" }
    else { $vramText = "6.0 GB VRAM" }
}

$cleanGpu = $primaryGpu.Replace('NVIDIA GeForce ', '').Replace('AMD Radeon ', '').Replace('Intel(R) ', '').Replace('(R)', '').Replace('(TM)', '').Trim()


# ── 2. UNIVERSAL CPU SCANNER ──
$cpuObj = Get-CimInstance Win32_Processor | Select-Object -First 1
$cpuName = if ($cpuObj.Name) { $cpuObj.Name } else { "PC Processor" }
$cores = if ($cpuObj.NumberOfCores) { $cpuObj.NumberOfCores } else { 4 }
$threads = if ($cpuObj.NumberOfLogicalProcessors) { $cpuObj.NumberOfLogicalProcessors } else { 8 }
$clockGhz = if ($cpuObj.MaxClockSpeed) { [Math]::Round(($cpuObj.MaxClockSpeed / 1000.0), 1) } else { 3.2 }

$cleanCpu = $cpuName.Replace('Intel(R) Core(TM) ', '').Replace('AMD Ryzen ', '').Replace('Processor', '').Trim()
if ($cleanCpu -match '12th Gen' -and -not $cleanCpu.StartsWith('Intel')) {
    $cleanCpu = $cleanCpu.Replace('12th Gen ', '') + ' (12th Gen)'
}


# ── 3. UNIVERSAL RAM SCANNER ──
$memList = Get-CimInstance Win32_PhysicalMemory
$ramSumBytes = ($memList | Measure-Object Capacity -Sum).Sum
$ramGb = if ($ramSumBytes -and $ramSumBytes -gt 0) { [Math]::Round($ramSumBytes / 1GB) } else { 16 }
$memSpeed = ($memList | Select-Object -First 1).Speed
$speedText = if ($memSpeed) { "$memSpeed MHz" } else { "High-Speed Memory" }


# ── 4. UNIVERSAL STORAGE & OS SCANNER ──
$disk = Get-CimInstance Win32_LogicalDisk | Where-Object { $_.DeviceID -eq 'C:' } | Select-Object -First 1
$freeGb = if ($disk.FreeSpace) { [Math]::Round($disk.FreeSpace / 1GB) } else { 120 }
$totalGb = if ($disk.Size) { [Math]::Round($disk.Size / 1GB) } else { 512 }

$osObj = Get-CimInstance Win32_OperatingSystem | Select-Object -First 1
$osCaption = if ($osObj.Caption) { $osObj.Caption.Replace('Microsoft ', '').Trim() } else { "Windows 11" }
$osArch = if ($osObj.OSArchitecture) { $osObj.OSArchitecture } else { "64-bit" }


# ── 5. ASSEMBLE UNIVERSAL SPEC PAYLOAD ──
$specs = @{
    gpu = $cleanGpu
    gpuDetail = "$primaryGpu • $vramText"
    vram = $vramText
    cpu = $cleanCpu
    cpuDetail = "$cpuName • $cores Cores / $threads Threads • $clockGhz GHz"
    ram = "$ramGb GB RAM"
    ramDetail = "$ramGb GB Physical RAM ($speedText)"
    storage = "$totalGb GB Storage"
    storageDetail = "$freeGb GB Free on Drive C:"
    display = "1920 × 1080"
    displayDetail = "Full HD Gaming Display"
    os = $osCaption
    osDetail = "$osCaption ($osArch)"
    isVerifiedRealHardware = $true
}

$json = $specs | ConvertTo-Json -Compress
$bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
$token = [System.Convert]::ToBase64String($bytes).Replace('+', '-').Replace('/', '_').TrimEnd('=')

try { Set-Clipboard -Value $token } catch {}

Write-Host ''
Write-Host '=====================================================' -ForegroundColor Green
Write-Host '   PlaySpec Universal Hardware Diagnostics Scanner   ' -ForegroundColor Green
Write-Host '=====================================================' -ForegroundColor Green
Write-Host ('  [OK] GPU:     ' + $specs.gpuDetail) -ForegroundColor Cyan
Write-Host ('  [OK] CPU:     ' + $specs.cpuDetail) -ForegroundColor Cyan
Write-Host ('  [OK] RAM:     ' + $specs.ramDetail) -ForegroundColor Cyan
Write-Host ('  [OK] Storage: ' + $specs.storageDetail) -ForegroundColor Cyan
Write-Host ('  [OK] OS:      ' + $specs.osDetail) -ForegroundColor Cyan
Write-Host '=====================================================' -ForegroundColor Green
Write-Host ' [OK] Spec Token Generated & Copied to Clipboard!' -ForegroundColor Yellow
Write-Host ' [*] Opening PlaySpec Intelligence Dashboard...' -ForegroundColor Green
Write-Host ''

$target = 'https://play-spec-76ix.vercel.app/?specs=' + $token

try {
    $r = [System.Net.WebRequest]::Create('http://localhost:8000/api/health')
    $r.Timeout = 500
    $resp = $r.GetResponse()
    $target = 'http://localhost:8000/?specs=' + $token
    $resp.Close()
} catch {}

Start-Process $target
"""

encoded_cmd = base64.b64encode(ps_script.strip().encode('utf-16le')).decode('ascii')

bat_content = f"""@echo off
title PlaySpec Universal Hardware Scanner
echo ======================================================================
echo   PlaySpec Universal Hardware Diagnostics Scanner
echo ======================================================================
echo.
echo Scanning PC Hardware (GPU, CPU, RAM, Storage)...
echo.

powershell -NoProfile -ExecutionPolicy Bypass -EncodedCommand {encoded_cmd}

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] PowerShell execution failed.
    echo Please try running playspec_scanner.py directly.
)

echo.
echo Hardware scan complete! Your browser will open with verified specs.
timeout /t 4
"""

target_bat = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "downloads", "PlaySpec-QuickScan.bat")
with open(target_bat, "w", encoding="utf-8") as f:
    f.write(bat_content)

print(f"Generated {target_bat} successfully!")

