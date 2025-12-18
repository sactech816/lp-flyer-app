# check-urls.ps1
# ビジネスLP URL検証スクリプト
# プロジェクトルートディレクトリで実行してください

Write-Host "=== ビジネスLP URL検証スクリプト ===" -ForegroundColor Cyan
Write-Host ""

$errorCount = 0

# 1. /p/ の検索
Write-Host "1. /p/ パスの検索（ビジネスLPでは使用不可）..." -ForegroundColor Yellow
$results1 = Select-String -Path "app\business\*.tsx","app\b\*.tsx","components\Business*.tsx" -Pattern '"/p/' -ErrorAction SilentlyContinue

if ($results1) {
    Write-Host "WARNING: /p/ パスが見つかりました" -ForegroundColor Red
    $results1 | ForEach-Object { 
        Write-Host "  - $($_.Path):$($_.LineNumber)" -ForegroundColor Red 
    }
    $errorCount++
} else {
    Write-Host "OK: /p/ パスは見つかりませんでした" -ForegroundColor Green
}
Write-Host ""

# 2. page=dashboard の検索
Write-Host "2. page=dashboard パラメータの検索..." -ForegroundColor Yellow
$results2 = Select-String -Path "app\api\business-*\*.js" -Pattern "page=dashboard" -ErrorAction SilentlyContinue

if ($results2) {
    Write-Host "WARNING: page=dashboard が見つかりました" -ForegroundColor Red
    $results2 | ForEach-Object { 
        Write-Host "  - $($_.Path):$($_.LineNumber)" -ForegroundColor Red 
    }
    $errorCount++
} else {
    Write-Host "OK: page=dashboard は見つかりませんでした" -ForegroundColor Green
}
Write-Host ""

# 3. プロフィールLP用APIの検索
Write-Host "3. プロフィールLP用APIエンドポイントの検索..." -ForegroundColor Yellow
$apis = @("/api/checkout-profile", "/api/verify-profile")
$foundApis = $false

foreach ($api in $apis) {
    $results3 = Select-String -Path "components\Business*.tsx" -Pattern $api -ErrorAction SilentlyContinue
    
    if ($results3) {
        Write-Host "WARNING: $api が見つかりました" -ForegroundColor Red
        $results3 | ForEach-Object { 
            Write-Host "  - $($_.Path):$($_.LineNumber)" -ForegroundColor Red 
        }
        $foundApis = $true
        $errorCount++
    }
}

if (-not $foundApis) {
    Write-Host "OK: プロフィールLP用APIは見つかりませんでした" -ForegroundColor Green
}
Write-Host ""

# 4. content_type の設定確認
Write-Host "4. content_type='business' の設定確認..." -ForegroundColor Yellow
$results4 = Select-String -Path "app\actions\business.ts" -Pattern "content_type.*'business'" -ErrorAction SilentlyContinue

if ($results4) {
    Write-Host "OK: content_type='business' が設定されています" -ForegroundColor Green
} else {
    Write-Host "WARNING: content_type='business' が見つかりません" -ForegroundColor Red
    $errorCount++
}
Write-Host ""

# 5. business_projects テーブルの使用確認
Write-Host "5. business_projects テーブルの使用確認..." -ForegroundColor Yellow
$results5 = Select-String -Path "app\actions\business.ts" -Pattern "business_projects" -ErrorAction SilentlyContinue

if ($results5) {
    Write-Host "OK: business_projects テーブルが使用されています" -ForegroundColor Green
} else {
    Write-Host "WARNING: business_projects テーブルが見つかりません" -ForegroundColor Red
    $errorCount++
}
Write-Host ""

# 結果サマリー
Write-Host "=== 検証完了 ===" -ForegroundColor Cyan
Write-Host ""

if ($errorCount -eq 0) {
    Write-Host "OK: すべての検証に合格しました！" -ForegroundColor Green
    Write-Host "プロジェクトはビジネスLP用に正しく設定されています。" -ForegroundColor Green
} else {
    Write-Host "WARNING: $errorCount 個の問題が見つかりました。" -ForegroundColor Yellow
    Write-Host "詳細は BUSINESS_LP_URL_CHECKLIST.md を参照してください。" -ForegroundColor Cyan
}
Write-Host ""
