#!/bin/bash

# Universal Credit Calculator Deployment Script
# This script helps deploy the UC Calculator to various platforms

set -e

echo "🚀 Universal Credit Calculator Deployment Script"
echo "================================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build the project
echo "🔨 Building the project..."
npm run build:production

echo "✅ Build completed successfully!"

# Check if build directory exists
if [ ! -d "build" ]; then
    echo "❌ Build directory not found. Build may have failed."
    exit 1
fi

echo "📁 Build directory size: $(du -sh build | cut -f1)"

# Deployment options
echo ""
echo "🎯 Deployment Options:"
echo "1. GitHub Pages (npm run deploy)"
echo "2. Netlify (drag & drop build folder)"
echo "3. Vercel (npx vercel --prod)"
echo "4. Firebase (firebase deploy)"
echo "5. Test locally (npm run serve)"
echo ""

read -p "Choose deployment option (1-5): " choice

case $choice in
    1)
        echo "🚀 Deploying to GitHub Pages..."
        npm run deploy
        ;;
    2)
        echo "📁 Build folder ready for Netlify drag & drop:"
        echo "   Location: $(pwd)/build"
        echo "   Open https://app.netlify.com/drop and drag the build folder"
        ;;
    3)
        echo "🚀 Deploying to Vercel..."
        npx vercel --prod
        ;;
    4)
        echo "🚀 Deploying to Firebase..."
        firebase deploy
        ;;
    5)
        echo "🌐 Starting local server..."
        npm run serve
        ;;
    *)
        echo "❌ Invalid option. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "🎉 Deployment process completed!"
echo "📖 For more information, see DEPLOYMENT.md"
