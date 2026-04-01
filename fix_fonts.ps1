$files = Get-ChildItem -Path . -Recurse -Include *.css, *.html
foreach ($file in $files) {
    if ($file.FullName -match 'node_modules|\.git') { continue }
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    $newContent = [regex]::Replace($content, 'font-size:\s*(?:clamp\()?0\.[0-7][0-9]?rem', {
        param($match)
        $match.Value -replace '0\.[0-7][0-9]?rem', '0.8rem'
    })
    if ($newContent -cne $content) {
        Set-Content -Path $file.FullName -Value $newContent -Encoding UTF8
    }
}
Write-Output "Fonts updated!"
