$pages = Invoke-RestMethod -Uri 'http://localhost:9222/json'
$page = $pages | Where-Object { $_.url -like 'http://localhost:5173/*' } | Select-Object -First 1
if (-not $page) {
    Write-Error "Page not found!"
    exit 1
}
$wsUrl = $page.webSocketDebuggerUrl
$ws = New-Object System.Net.WebSockets.ClientWebSocket
$ct = New-Object System.Threading.CancellationTokenSource
$ws.ConnectAsync($wsUrl, $ct.Token).Wait()
$expression = "(() => { 
    const uc = document.querySelector('.user-card'); 
    const bb = document.querySelector('.brand-block'); 
    const btn = document.querySelector('.user-card .icon-button'); 
    const sn = document.querySelector('.side-nav');
    const getRect = (el) => {
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: r.x, y: r.y, width: r.width, height: r.height, top: r.top, right: r.right, bottom: r.bottom, left: r.left };
    };
    return JSON.stringify({ 
        clientWidth: document.body.clientWidth,
        clientHeight: document.body.clientHeight,
        sideNavRect: getRect(sn),
        brandBlockRect: getRect(bb),
        userCardRect: getRect(uc),
        buttonRect: getRect(btn)
    }); 
})()"
$payloadObj = @{
    id = 1
    method = "Runtime.evaluate"
    params = @{
        expression = $expression
        returnByValue = $true
    }
}
$payload = ConvertTo-Json $payloadObj -Compress
$bytes = [System.Text.Encoding]::UTF8.GetBytes($payload)
$segment = New-Object System.ArraySegment[Byte] -ArgumentList @(,$bytes)
$ws.SendAsync($segment, [System.Net.WebSockets.WebSocketMessageType]::Text, $true, $ct.Token).Wait()
$buffer = New-Object Byte[] 40960
$segmentRecv = New-Object System.ArraySegment[Byte] -ArgumentList @(,$buffer)
$res = $ws.ReceiveAsync($segmentRecv, $ct.Token)
$res.Wait()
$recvBytes = $res.Result.Count
$response = [System.Text.Encoding]::UTF8.GetString($buffer, 0, $recvBytes)
Write-Output $response
$ws.CloseAsync([System.Net.WebSockets.WebSocketCloseStatus]::NormalClosure, "", $ct.Token).Wait()
