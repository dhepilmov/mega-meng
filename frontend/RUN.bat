@echo off
setlocal EnableExtensions EnableDelayedExpansion
title Mega Meng Frontend Runner (npm-only) • deps-skip + route picker

REM // ARGUMENTS SECTION
REM // --reinstall : force npm install even if lockfile unchanged
REM // --rebuild   : force build for Static Preview
set "FORCE_REINSTALL=0"
set "FORCE_REBUILD=0"
set "DEV_PORT=3000"
set "STATIC_PORT=5000"
set "NETLIFY_PORT=8888"

:ARGS
if "%~1"=="" goto AFTER_ARGS
if /I "%~1"=="--reinstall" set "FORCE_REINSTALL=1" & shift & goto ARGS
if /I "%~1"=="--rebuild"   set "FORCE_REBUILD=1"   & shift & goto ARGS
shift
goto ARGS

:AFTER_ARGS
cd /d "%~dp0"

REM // TOOLING CHECKS SECTION
where node >nul 2>&1 || (echo [ERROR] Node.js not found & goto EXIT)
where npm  >nul 2>&1 || (echo [ERROR] npm not found & goto EXIT)

if not exist package.json (echo [ERROR] No package.json here & goto EXIT)

REM // DEPS SKIP LOGIC SECTION (hash package-lock.json or package.json)
set "STAMP_DIR=.cache"
set "STAMP_FILE=%STAMP_DIR%\deps.sha256"
set "LOCKFILE=package-lock.json"
if not exist "%LOCKFILE%" set "LOCKFILE=package.json"
if not exist "%STAMP_DIR%" mkdir "%STAMP_DIR%" >nul 2>&1

set "RAW_HASH="
for /f "tokens=* delims=" %%A in ('certutil -hashfile "%LOCKFILE%" SHA256 ^| findstr /R "^[0-9A-F][0-9A-F]"') do set "RAW_HASH=%%A"
set "CUR_HASH=%RAW_HASH: =%"

set "OLD_HASH="
if exist "%STAMP_FILE%" set /p OLD_HASH=<"%STAMP_FILE%"

set "NEED_INSTALL=0"
if "%FORCE_REINSTALL%"=="1" (
  set "NEED_INSTALL=1"
) else (
  if not exist "node_modules\" (
    set "NEED_INSTALL=1"
  ) else (
    if /I not "%CUR_HASH%"=="%OLD_HASH%" set "NEED_INSTALL=1"
  )
)

if "%NEED_INSTALL%"=="1" (
  echo == Installing dependencies (npm) ==
  call npm i || goto FAIL
  REM // NOTE: Rollup dependencies now managed automatically by Vite 7.x
  >"%STAMP_FILE%" echo %CUR_HASH%
) else (
  echo == Skipping install; dependencies unchanged ==
)

REM // SERVER MENU SECTION
echo.
echo ========= Mega Meng Frontend Launcher =========
echo   [1] Dev server (npm run dev)
echo   [2] Netlify Dev (npx netlify-cli dev)
echo   [3] Static Preview (serve ./build)
echo   [Q] Quit
echo ===============================================
choice /C 123Q /N /M "Select: "
set "ANS=%errorlevel%"
if "%ANS%"=="4" goto EXIT
if "%ANS%"=="1" goto START_DEV
if "%ANS%"=="2" goto START_NETLIFY
if "%ANS%"=="3" goto START_STATIC

:START_DEV
echo == Starting Dev server (Vite will auto-select port) ==
start "Mega Meng Dev Server" cmd /k "npm run dev"
echo.
echo == Waiting for Vite to start... ==
powershell -NoProfile -Command "Start-Sleep -Seconds 3" >nul 2>&1
echo.
echo == Vite may have selected port 3001 or higher if 3000 is busy ==
echo == Check the Vite console output for the actual port ==
echo.
set /p "ACTUAL_PORT=Enter the actual port Vite is using (check console above): "
if "%ACTUAL_PORT%"=="" set "ACTUAL_PORT=3001"
goto ROUTE_MENU_WITH http://localhost:%ACTUAL_PORT%

:START_NETLIFY
echo == Starting Netlify Dev on http://localhost:%NETLIFY_PORT% ==
start "Mega Meng Netlify Dev" cmd /k "npx --yes netlify-cli@latest dev -p %NETLIFY_PORT%"
powershell -NoProfile -Command "Start-Sleep -Seconds 3" >nul 2>&1
goto ROUTE_MENU_WITH http://localhost:%NETLIFY_PORT%

:START_STATIC
if not exist "build\index.html" set "FORCE_REBUILD=1"
if "%FORCE_REBUILD%"=="1" (
  echo == Building production bundle (Vite outputs to ./build) ==
  call npm run build || goto FAIL
) else (
  echo == Skipping build; build\index.html exists ==
)
echo == Serving ./build on http://localhost:%STATIC_PORT% ==
start "Mega Meng Static Preview" cmd /k "npx --yes serve -s build -l %STATIC_PORT%"
powershell -NoProfile -Command "Start-Sleep -Seconds 2" >nul 2>&1
goto ROUTE_MENU_WITH http://localhost:%STATIC_PORT%

:ROUTE_MENU_WITH
set "BASE=%~1"
echo.
echo ========== Mega Meng Routes ==========
echo   [W] WarungMeng (/warungmeng)
echo   [Y] Yuzha Launcher (/yuzha)  
echo   [R] Root (/) - redirects to WarungMeng
echo   [B] Both WarungMeng + Yuzha
echo   [N] None (just start server)
echo ======================================
choice /C WYBRN /N /M "Select: "
if "%errorlevel%"=="1" start "" "%BASE%/warungmeng"
if "%errorlevel%"=="2" start "" "%BASE%/yuzha"
if "%errorlevel%"=="3" start "" "%BASE%/"
if "%errorlevel%"=="4" (
  start "" "%BASE%/warungmeng"
  start "" "%BASE%/yuzha"
)
echo.
echo Server running! Backend should be at: https://yuzhayo.pythonanywhere.com/api/
goto EXIT

:FAIL
echo.
echo [ERROR] Something failed. Check the error messages above.
echo Make sure you're in the frontend directory with package.json
goto EXIT

:EXIT
echo.
echo Press any key to close this launcher...
pause >nul
endlocal