@echo off
title Nathan-dash - Sync GitHub Auto
color 0A

echo ========================================
echo   Nathan-dash - Synchronisation GitHub
echo ========================================
echo.
echo Le script surveille vos fichiers et
echo envoie automatiquement les modifications
echo sur GitHub toutes les 30 secondes.
echo.
echo Appuyez sur CTRL+C pour arreter.
echo ========================================
echo.

cd /d "%USERPROFILE%\OneDrive - Conseil régional Grand Est - Numérique Educatif\Bureau\Nathan-dash"

:loop
echo [%time%] Verification des modifications...

git add .

git diff --cached --quiet
if %errorlevel% equ 0 (
    echo [%time%] Aucun changement detecte.
) else (
    git commit -m "Auto-sync %date% %time%"
    git push origin master
    echo [%time%] Modifications envoyees sur GitHub !
)

echo.
timeout /t 30 /nobreak >nul
goto loop