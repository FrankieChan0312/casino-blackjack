@echo off
setlocal EnableExtensions DisableDelayedExpansion
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js was not found. Install Node.js ^>=24.19.0 ^<25 and try again.
  echo Extract the whole ZIP before launching. No npm install is required.
  pause
  exit /b 1
)
node "%~dp0start-demo.mjs" %*
set "demoExit=%ERRORLEVEL%"
if not "%demoExit%"=="0" (
  echo.
  echo The demo stopped with exit code %demoExit%. Read the error above.
  pause
)
exit /b %demoExit%
