@echo off
title PlaySpec Hardware Scanner
echo ======================================================================
echo   PlaySpec Hardware Diagnostics Scanner
echo   (100%% Open-Source, Safe & Transparent System Inspector)
echo ======================================================================
echo.
echo Scanning system hardware...

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$gpu = (Get-CimInstance Win32_VideoController | Where-Object { $_.Name } | Select-Object -First 1).Name; ^
   $cpu = (Get-CimInstance Win32_Processor | Select-Object -First 1).Name; ^
   $ramGb = [Math]::Round(((Get-CimInstance Win32_PhysicalMemory | Measure-Object Capacity -Sum).Sum / 1GB)); ^
   $disk = (Get-CimInstance Win32_LogicalDisk | Where-Object { $_.DeviceID -eq 'C:' }); ^
   $freeGb = [Math]::Round(($disk.FreeSpace / 1GB)); ^
   $totalGb = [Math]::Round(($disk.Size / 1GB)); ^
   $os = (Get-CimInstance Win32_OperatingSystem).Caption; ^
   $specs = @{ ^
     gpu = $gpu.Replace('NVIDIA GeForce ', '').Replace('AMD Radeon ', '').Trim(); ^
     gpuDetail = $gpu; ^
     cpu = $cpu.Replace('Intel(R) Core(TM) ', '').Replace('AMD Ryzen ', '').Replace('Processor', '').Trim(); ^
     cpuDetail = $cpu; ^
     ram = ($ramGb.ToString() + ' GB RAM'); ^
     ramDetail = ($ramGb.ToString() + ' GB Physical Memory'); ^
     storage = ($totalGb.ToString() + ' GB NVMe'); ^
     storageDetail = ($freeGb.ToString() + ' GB Free Space'); ^
     display = '1920 x 1080'; ^
     displayDetail = 'Desktop Display'; ^
     os = $os.Replace('Microsoft ', '').Trim(); ^
     osDetail = 'Windows 64-bit' ^
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
   Start-Process ('https://play-spec-76ix.vercel.app/?specs=' + $token);"

echo.
echo ======================================================================
echo   Spec Token copied to clipboard!
echo ======================================================================
timeout /t 5
