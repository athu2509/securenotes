@echo off
echo Creating Secure Notes distribution package...

REM Get current date for package name
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "YYYY=%dt:~0,4%" & set "MM=%dt:~4,2%" & set "DD=%dt:~6,2%"
set "package_name=secure-notes-v1.0.0_%YYYY%-%MM%-%DD%"

echo Package name: %package_name%

REM Create ZIP file with only essential files
echo Creating clean ZIP archive...
powershell Compress-Archive -Path "backend", "frontend", "README.md", "INSTALLATION.md" -DestinationPath "%package_name%.zip" -Force

echo.
echo Clean distribution package created: %package_name%.zip
echo Contents: backend/, frontend/, README.md, INSTALLATION.md
echo Ready for sharing!
echo.
pause
