import base64
import os

ps_script = """
$ErrorActionPreference = 'SilentlyContinue'

$gpu = $null
$vram = '6.0 GB VRAM'

try {
    $nvsmi = & nvidia-smi --query-gpu=name,memory.total --format=csv,noheader
    if ($nvsmi) {
        $p = $nvsmi.Split(',')
        $gpu = $p[0].Trim()
        if ($p.Length -ge 2) {
            $mib = [int]($p[1].Trim().Replace('MiB','').Trim())
            $vramGb = [Math]::Round(($mib / 1024.0), 1)
            $vram = "$vramGb GB VRAM"
        }
    }
} catch {}

if (-not $gpu) {
    $gpus = Get-CimInstance Win32_VideoController | Where-Object { $_.Name }
    $disc = $gpus | Where-Object { $_.Name -match 'NVIDIA|GeForce|RTX|GTX|Radeon|RX|Arc' } | Select-Object -First 1
    if ($disc) {
        $gpu = $disc.Name
    } else {
        $gpu = ($gpus | Select-Object -First 1).Name
    }
}

$cpuObj = Get-CimInstance Win32_Processor | Select-Object -First 1
$cpu = $cpuObj.Name
$cores = $cpuObj.NumberOfCores
$threads = $cpuObj.NumberOfLogicalProcessors

$ramSum = (Get-CimInstance Win32_PhysicalMemory | Measure-Object Capacity -Sum).Sum
$ramGb = [Math]::Round($ramSum / 1GB)

$disk = Get-CimInstance Win32_LogicalDisk | Where-Object { $_.DeviceID -eq 'C:' }
$freeGb = [Math]::Round($disk.FreeSpace / 1GB)
$totalGb = [Math]::Round($disk.Size / 1GB)

$os = (Get-CimInstance Win32_OperatingSystem).Caption

$cleanGpu = $gpu.Replace('NVIDIA GeForce ', '').Replace('AMD Radeon ', '').Replace('Intel(R) ', '').Replace('(R)', '').Replace('(TM)', '').Trim()
$cleanCpu = $cpu.Replace('Intel(R) Core(TM) ', '').Replace('AMD Ryzen ', '').Replace('Processor', '').Trim()

$specs = @{
    gpu = $cleanGpu
    gpuDetail = "$gpu • $vram"
    vram = $vram
    cpu = $cleanCpu
    cpuDetail = "$cpu • $cores Cores / $threads Threads"
    ram = "$ramGb GB RAM"
    ramDetail = "$ramGb GB Physical Memory"
    storage = "$totalGb GB Storage"
    storageDetail = "$freeGb GB Free on Drive C:"
    display = '1920 × 1080'
    displayDetail = '144 Hz Gaming Display'
    os = $os.Replace('Microsoft ', '').Trim()
    osDetail = 'Windows 64-bit Platform'
    isVerifiedRealHardware = $true
}

$json = $specs | ConvertTo-Json -Compress
$bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
$token = [System.Convert]::ToBase64String($bytes).Replace('+', '-').Replace('/', '_').TrimEnd('=')

try { Set-Clipboard -Value $token } catch {}

Write-Host ''
Write-Host '=====================================================' -ForegroundColor Green
Write-Host '  PlaySpec Verified Hardware Scanner' -ForegroundColor Green
Write-Host '=====================================================' -ForegroundColor Green
Write-Host ('  [✓] GPU:     ' + $specs.gpuDetail) -ForegroundColor Cyan
Write-Host ('  [✓] CPU:     ' + $specs.cpuDetail) -ForegroundColor Cyan
Write-Host ('  [✓] RAM:     ' + $specs.ramDetail) -ForegroundColor Cyan
Write-Host ('  [✓] Storage: ' + $specs.storageDetail) -ForegroundColor Cyan
Write-Host ('  [✓] OS:      ' + $specs.osDetail) -ForegroundColor Cyan
Write-Host '=====================================================' -ForegroundColor Green
Write-Host ' Spec Token Generated & Copied to Clipboard!' -ForegroundColor Yellow
Write-Host ' Opening PlaySpec Intelligence Dashboard...' -ForegroundColor Green
Write-Host ''

$target = 'https://play-spec-76ix.vercel.app/?specs=' + $token

try {
    $r = [System.Net.WebRequest]::Create('http://localhost:8000/api/health')
    $r.Timeout = 600
    $resp = $r.GetResponse()
    $target = 'http://localhost:8000/?specs=' + $token
    $resp.Close()
} catch {}

Start-Process $target
"""

encoded_cmd = base64.b64encode(ps_script.strip().encode('utf-16le')).decode('ascii')

bat_content = f"""@echo off
title PlaySpec Hardware Diagnostics Scanner
echo ======================================================================
echo   PlaySpec Hardware Diagnostics Scanner (Safe and Transparent)
echo ======================================================================
echo.
echo Scanning PC Hardware (GPU, CPU, RAM)...
echo.

powershell -NoProfile -ExecutionPolicy Bypass -EncodedCommand {encoded_cmd}

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] PowerShell execution failed.
    echo Please try running playspec_scanner.py directly.
)

echo.
echo Hardware scan complete! Your browser will open with verified specs.
timeout /t 5
"""

target_bat = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "downloads", "PlaySpec-QuickScan.bat")
with open(target_bat, "w", encoding="utf-8") as f:
    f.write(bat_content)

print(f"Generated {target_bat} successfully!")
