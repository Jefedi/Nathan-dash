@echo off
:loop
timeout /t 10 /nobreak
cd C:\mon-projet
git add .
git commit -m "auto"
git push origin main
goto loop