# build-index.ps1
# Script tạo file index.json từ tất cả file .mid trong thư mục baihat

# Lấy danh sách file .mid trong thư mục baihat (nằm cạnh script này)
Get-ChildItem -Path ".\baihat" -Filter *.mid |
Sort-Object Name |
ForEach-Object {
    [pscustomobject]@{
        label = [System.IO.Path]::GetFileNameWithoutExtension($_.Name)
        file  = "baihat/" + $_.Name
    }
} | ConvertTo-Json | Out-File -Encoding UTF8 ".\index.json"

Write-Output "✅ Đã tạo xong index.json trong thư mục midi."
