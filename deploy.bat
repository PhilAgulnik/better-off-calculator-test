@echo off
setlocal enabledelayedexpansion

echo 🚀 Universal Credit Calculator Deployment Script
echo ================================================

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

echo ✅ Node.js version: 
node --version

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
)

REM Build the project
echo 🔨 Building the project...
npm run build:production

if errorlevel 1 (
    echo ❌ Build failed. Please check the error messages above.
    pause
    exit /b 1
)

echo ✅ Build completed successfully!

REM Check if build directory exists
if not exist "build" (
    echo ❌ Build directory not found. Build may have failed.
    pause
    exit /b 1
)

echo 📁 Build directory created successfully!

REM Deployment options
echo.
echo 🎯 Deployment Options:
echo 1. GitHub Pages (npm run deploy)
echo 2. Netlify (drag ^& drop build folder)
echo 3. Vercel (npx vercel --prod)
echo 4. Firebase (firebase deploy)
echo 5. Test locally (npm run serve)
echo.

set /p choice="Choose deployment option (1-5): "

if "%choice%"=="1" (
    echo 🚀 Deploying to GitHub Pages...
    npm run deploy
) else if "%choice%"=="2" (
    echo 📁 Build folder ready for Netlify drag ^& drop:
    echo    Location: %cd%\build
    echo    Open https://app.netlify.com/drop and drag the build folder
) else if "%choice%"=="3" (
    echo 🚀 Deploying to Vercel...
    npx vercel --prod
) else if "%choice%"=="4" (
    echo 🚀 Deploying to Firebase...
    firebase deploy
) else if "%choice%"=="5" (
    echo 🌐 Starting local server...
    npm run serve
) else (
    echo ❌ Invalid option. Please run the script again.
    pause
    exit /b 1
)

echo.
echo 🎉 Deployment process completed!
echo 📖 For more information, see DEPLOYMENT.md
pause
