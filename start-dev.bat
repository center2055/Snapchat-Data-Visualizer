@echo off
setlocal ENABLEDELAYEDEXPANSION

REM Project root
set "ROOT=%~dp0"
pushd "%ROOT%"

echo Checking Node.js...
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
  echo Node.js not found.
  where winget >nul 2>nul
  if %ERRORLEVEL%==0 (
    echo Attempting to install Node.js LTS via winget...
    winget install --id OpenJS.NodeJS.LTS -e --silent
  ) else (
    where choco >nul 2>nul
    if %ERRORLEVEL%==0 (
      echo Attempting to install Node.js LTS via Chocolatey...
      choco install nodejs-lts -y
    ) else (
      echo Please install Node.js LTS manually from https://nodejs.org/ and re-run this script.
      pause
      exit /b 1
    )
  )
)

echo Node version:
node -v

echo.
echo Installing npm dependencies...
pushd app
if not exist node_modules (
  call npm install
  if %ERRORLEVEL% neq 0 (
    echo npm install failed.
    pause
    exit /b 1
  )
) else (
  echo node_modules already present. Skipping install.
)

echo.
echo Starting dev server...
start "Snapchat Visualizer" cmd /c "npm run dev -- --host"
popd

echo.
echo If a browser did not open automatically, navigate to http://localhost:5173/
popd
endlocal

