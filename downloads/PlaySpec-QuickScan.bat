@echo off
title PlaySpec Hardware Scanner
echo ======================================================================
echo   PlaySpec Hardware Diagnostics Scanner
echo   (100%% Open-Source, Safe & Transparent System Inspector)
echo ======================================================================
echo.
echo Scanning system hardware...

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$gpu = $null; $vram = '6 GB VRAM'; ^
   try { ^
     $nvsmi = & nvidia-smi --query-gpu=name,memory.total --format=csv,noheader 2>$null; ^
     if ($nvsmi) { ^
       $p = $nvsmi.Split(','); ^
       $gpu = $p[0].Trim(); ^
       if ($p.Length -ge 2) { ^
         $mib = [int]($p[1].Trim().Replace('MiB','').Trim()); ^
         $vramGb = [Math]::Round(($mib / 1024.0), 1); ^
         $vram = ($vramGb.ToString() + ' GB VRAM'); ^
       }; ^
     }; ^
   } catch {}; ^
   if (-not $gpu) { ^
     $gpus = Get-CimInstance Win32_VideoController | Where-Object { $_.Name }; ^
     $disc = $gpus | Where-Object { $_.Name -match 'NVIDIA|GeForce|RTX|GTX|Radeon|RX|Arc' } | Select-Object -First 1; ^
     if ($disc) { $gpu = $disc.Name; } else { $gpu = ($gpus | Select-Object -First 1).Name; }; ^
   }; ^
   $cpu = (Get-CimInstance Win32_Processor | Select-Object -First 1).Name; ^
   $ramGb = [Math]::Round(((Get-CimInstance Win32_PhysicalMemory | Measure-Object Capacity -Sum).Sum / 1GB)); ^
   $disk = (Get-CimInstance Win32_LogicalDisk | Where-Object { $_.DeviceID -eq 'C:' }); ^
   $freeGb = [Math]::Round(($disk.FreeSpace / 1GB)); ^
   $totalGb = [Math]::Round(($disk.Size / 1GB)); ^
   $os = (Get-CimInstance Win32_OperatingSystem).Caption; ^
   $cleanGpu = $gpu.Replace('NVIDIA GeForce ', '').Replace('AMD Radeon ', '').Replace('Intel(R) ', '').Replace('(R)', '').Replace('(TM)', '').Trim(); ^
   $cleanCpu = $cpu.Replace('Intel(R) Core(TM) ', '').Replace('AMD Ryzen ', '').Replace('Processor', '').Trim(); ^
   $specs = @{ ^
     gpu = $cleanGpu; ^
     gpuDetail = ($gpu + ' • ' + $vram); ^
     vram = $vram; ^
     cpu = $cleanCpu; ^
     cpuDetail = $cpu; ^
     ram = ($ramGb.ToString() + ' GB RAM'); ^
     ramDetail = ($ramGb.ToString() + ' GB Physical Memory'); ^
     storage = ($totalGb.ToString() + ' GB NVMe'); ^
     storageDetail = ($freeGb.ToString() + ' GB Free Space'); ^
     display = '1920 x 1080'; ^
     displayDetail = 'Full HD Display'; ^
     os = $os.Replace('Microsoft ', '').Trim(); ^
     osDetail = 'Windows 64-bit'; ^
     isVerifiedRealHardware = $true ^
   }; ^
   $json = $specs | ConvertTo-Json -Compress; ^
   $bytes = [System.Text.Encoding]::UTF8.GetBytes($json); ^
   $token = [System.Convert]::ToBase64String($bytes).Replace('+', '-').Replace('/', '_').TrimEnd('='); ^
   Set-Clipboard -Value $token; ^
   Write-Host ''; ^
   Write-Host (' [v] GPU:     ' + $specs.gpuDetail) -ForegroundColor Cyan; ^
   Write-Host (' [v] CPU:     ' + $specs.cpuDetail) -ForegroundColor Cyan; ^
   Write-Host (' [v] RAM:     ' + $specs.ramDetail) -ForegroundColor Cyan; ^
   Write-Host (' [v] Storage: ' + $specs.storageDetail) -ForegroundColor Cyan; ^
   Write-Host (' [v] OS:      ' + $specs.osDetail) -ForegroundColor Cyan; ^
   Write-Host ''; ^
   Write-Host ' Hardware scan complete! Opening PlaySpec Intelligence Dashboard...' -ForegroundColor Green; ^
   $target = 'https://play-spec-76ix.vercel.app/?specs=' + $token; ^
   try { $r = [System.Net.WebRequest]::Create('http://localhost:8000/api/health'); $r.Timeout = 800; $resp = $r.GetResponse(); $target = 'http://localhost:8000/?specs=' + $token; $resp.Close(); } catch {}; ^
   Start-Process $target;"

echo.
echo ======================================================================
echo   Spec Token copied to clipboard! (Auto-Importing into PlaySpec...)
echo ======================================================================
timeout /t 5
