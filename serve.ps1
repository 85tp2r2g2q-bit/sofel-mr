# Simple PowerShell HTTP server for local development
# Run with: Right-click -> Run with PowerShell OR
# powershell -ExecutionPolicy Bypass -File .\serve.ps1

# Try to bind to a free port (prefer high ports 55000..55010, fallback 8000..8010) or use $env:PORT if set
$folder = Get-Location
$listener = $null
$bound = $false
$preferred = $null
if ($env:PORT) {
    $preferred = [int]$env:PORT
}
# Prefer high ephemeral-ish ports first to avoid collisions with services that reserve low ports via HTTP.sys (PID 4)
if ($preferred) {
    $portsToTry = @($preferred) + ((55000..55010) + (8000..8010) | Where-Object { $_ -ne $preferred })
} else {
    $portsToTry = (55000..55010) + (8000..8010)
}
foreach ($p in $portsToTry) {
    try {
        $prefix = "http://localhost:$p/"
        $listener = New-Object System.Net.HttpListener
        $listener.Prefixes.Add($prefix)
        $listener.Start()
        $port = $p
        $bound = $true
        break
    } catch {
        # failed to bind on this port, log the message and try next
    try { Write-Output ("Port {0}: bind failed: {1}" -f $p, $_.Exception.Message) } catch {}
        if ($listener) { try { $listener.Close() } catch {} }
        $listener = $null
        continue
    }
}
if (-not $bound) { throw "Could not bind HttpListener to any port in $($portsToTry -join ', ')" }
try {
    Write-Output "Serving $folder at $prefix (Ctrl+C to stop)"
    while ($listener.IsListening) {
        $ctx = $listener.GetContext()
        try {
            $req = $ctx.Request
            Write-Output ("Request: {0} {1}" -f $req.HttpMethod, $req.Url.AbsolutePath)
            $path = $req.Url.LocalPath.TrimStart('/')
            if ($path -eq '') { $path = 'index.html' }
            $file = Join-Path $folder $path
            if (-not (Test-Path $file)) {
                $ctx.Response.StatusCode = 404
                $ctx.Response.StatusDescription = 'Not Found'
                $buffer = [System.Text.Encoding]::UTF8.GetBytes('404 Not Found')
                $ctx.Response.OutputStream.Write($buffer,0,$buffer.Length)
                $ctx.Response.Close()
                Write-Output ("Responded: 404 {0}" -f $path)
                continue
            }
            $bytes = [System.IO.File]::ReadAllBytes($file)
            $ext = [System.IO.Path]::GetExtension($file).ToLower()
            $mime = switch ($ext) {
                '.html' { 'text/html' }
                '.htm'  { 'text/html' }
                '.css'  { 'text/css' }
                '.js'   { 'application/javascript' }
                '.png'  { 'image/png' }
                '.jpg'  { 'image/jpeg' }
                '.jpeg' { 'image/jpeg' }
                '.gif'  { 'image/gif' }
                '.svg'  { 'image/svg+xml' }
                '.mht'  { 'multipart/related' }
                default { 'application/octet-stream' }
            }
            $ctx.Response.ContentType = $mime
            $ctx.Response.ContentLength64 = $bytes.Length
            $ctx.Response.OutputStream.Write($bytes,0,$bytes.Length)
            $ctx.Response.OutputStream.Close()
            Write-Output ("Responded: 200 {0} ({1} bytes)" -f $path, $bytes.Length)
        } catch {
            try { $ctx.Response.StatusCode = 500; $ctx.Response.Close() } catch {}
            Write-Output ("Responded: 500 {0}" -f $_.Exception.Message)
        }
    }
} finally {
    if ($listener -and $listener.IsListening) { $listener.Stop(); $listener.Close() }
}
