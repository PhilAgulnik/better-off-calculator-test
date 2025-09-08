# Universal Credit Calculator - Deployment Guide

This guide covers multiple deployment options for your UC Calculator project.

## Prerequisites

- Node.js 18+ installed
- Git configured
- GitHub account (for GitHub Pages)
- Netlify account (optional)
- Vercel account (optional)

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Build the Project
```bash
npm run build
```

### 3. Test Locally
```bash
npm run serve
```

## Deployment Options

### Option 1: GitHub Pages (Recommended)

#### Setup:
1. Create a new repository on GitHub
2. Update the `homepage` field in `package.json` with your repository URL:
   ```json
   "homepage": "https://yourusername.github.io/your-repo-name"
   ```
3. Install gh-pages:
   ```bash
   npm install --save-dev gh-pages
   ```

#### Deploy:
```bash
npm run deploy
```

#### Automatic Deployment:
The GitHub Actions workflow (`.github/workflows/deploy.yml`) will automatically deploy when you push to the main branch.

### Option 2: Netlify

#### Setup:
1. Sign up at [netlify.com](https://netlify.com)
2. Connect your GitHub repository
3. Netlify will automatically detect the `netlify.toml` configuration

#### Manual Deploy:
1. Build the project: `npm run build`
2. Drag and drop the `build` folder to Netlify's deploy area

### Option 3: Vercel

#### Setup:
1. Sign up at [vercel.com](https://vercel.com)
2. Connect your GitHub repository
3. Vercel will automatically detect the `vercel.json` configuration

#### Manual Deploy:
```bash
npx vercel --prod
```

### Option 4: Firebase Hosting

#### Setup:
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Select the `build` directory as your public directory

#### Deploy:
```bash
npm run build
firebase deploy
```

## Environment Variables

Create a `.env` file for environment-specific configurations:

```env
REACT_APP_API_URL=https://your-api-url.com
REACT_APP_VERSION=1.0.0
GENERATE_SOURCEMAP=false
```

## Build Optimization

### Production Build:
```bash
npm run build:production
```

This command:
- Disables source maps for smaller bundle size
- Optimizes assets for production
- Minifies JavaScript and CSS

### Bundle Analysis:
```bash
npm install --save-dev webpack-bundle-analyzer
npx webpack-bundle-analyzer build/static/js/*.js
```

## Performance Optimization

### 1. Enable Compression
Add to your hosting platform:
- Gzip compression
- Brotli compression (if supported)

### 2. CDN Configuration
Configure your CDN to cache static assets:
- CSS files: 1 year
- JS files: 1 year
- Images: 1 year

### 3. Service Worker (Optional)
For offline functionality, consider adding a service worker.

## Monitoring and Analytics

### 1. Google Analytics
Add to `public/index.html`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### 2. Error Tracking
Consider adding Sentry or similar error tracking service.

## Security Considerations

### 1. Content Security Policy
Add CSP headers to prevent XSS attacks.

### 2. HTTPS
Ensure your hosting platform provides HTTPS by default.

### 3. Environment Variables
Never commit sensitive data to version control.

## Troubleshooting

### Common Issues:

1. **Build Fails**: Check Node.js version (requires 18+)
2. **Routing Issues**: Ensure your hosting platform supports SPA routing
3. **Asset Loading**: Check that all assets are properly referenced
4. **Performance**: Use browser dev tools to identify bottlenecks

### Debug Commands:
```bash
# Check build output
npm run build && ls -la build/

# Test production build locally
npm run serve

# Analyze bundle size
npm run build && npx webpack-bundle-analyzer build/static/js/*.js
```

## Maintenance

### Regular Updates:
1. Update dependencies: `npm update`
2. Test locally: `npm test`
3. Build and deploy: `npm run build && npm run deploy`

### Monitoring:
- Check deployment status
- Monitor performance metrics
- Review error logs
- Update rates data regularly

## Support

For deployment issues:
1. Check the hosting platform's documentation
2. Review build logs
3. Test locally first
4. Check browser console for errors

## License

This project is licensed under the MIT License.
