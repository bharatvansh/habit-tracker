# Web Deployment Guide - Habitual App

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Expo CLI installed globally
- Git for version control
- Netlify account (or preferred hosting)

### Local Development
```bash
# Install dependencies
npm install

# Run web version
npm run web

# Access at http://localhost:8081
```

## 📦 Build for Production

### 1. Build Web Bundle
```bash
# Production build
npm run build:web

# Output directory: web-build/
```

### 2. Test Production Build Locally
```bash
# Install serve globally
npm install -g serve

# Serve production build
serve -s web-build -p 3000
```

### 3. Verify Build
- [ ] App loads successfully
- [ ] All routes work
- [ ] Service worker registers
- [ ] PWA installs correctly
- [ ] Data persists
- [ ] Offline mode works

## 🌐 Deployment Platforms

### Netlify (Recommended)

#### Method 1: Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Initialize site
netlify init

# Deploy
netlify deploy --prod
```

#### Method 2: Git Integration
1. Push code to GitHub/GitLab/Bitbucket
2. Connect repository in Netlify dashboard
3. Configure build settings:
   - **Build command**: `npm run build:web`
   - **Publish directory**: `web-build`
   - **Production branch**: `main`
4. Deploy automatically on push

#### Netlify Configuration
File: `netlify.toml` (already configured)
- SPA routing redirects ✅
- Security headers ✅
- Cache control ✅
- Environment variables ready ✅

### Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Production
vercel --prod
```

**vercel.json** (create if needed):
```json
{
  "buildCommand": "npm run build:web",
  "outputDirectory": "web-build",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "SAMEORIGIN" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" }
      ]
    }
  ]
}
```

### Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize
firebase init hosting

# Configure:
# - Public directory: web-build
# - Single-page app: Yes
# - Rewrites: Yes

# Deploy
firebase deploy --only hosting
```

**firebase.json**:
```json
{
  "hosting": {
    "public": "web-build",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      },
      {
        "source": "service-worker.js",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "no-cache, no-store, must-revalidate"
          }
        ]
      }
    ]
  }
}
```

### GitHub Pages

```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts:
# "deploy": "gh-pages -d web-build"

# Build and deploy
npm run build:web
npm run deploy
```

**Note**: Update `homepage` in package.json:
```json
{
  "homepage": "https://username.github.io/repo-name"
}
```

### AWS S3 + CloudFront

```bash
# Install AWS CLI
# Configure credentials: aws configure

# Build
npm run build:web

# Upload to S3
aws s3 sync web-build/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

### Docker Deployment

**Dockerfile**:
```dockerfile
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build:web

FROM nginx:alpine

COPY --from=build /app/web-build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf**:
```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Don't cache service worker
    location = /service-worker.js {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }
}
```

**Build and run**:
```bash
docker build -t habitual-web .
docker run -p 80:80 habitual-web
```

## ⚙️ Environment Variables

### Setup

1. **Create `.env` file** (from `.env.example`):
```bash
cp .env.example .env
```

2. **Configure variables**:
```env
NODE_ENV=production
API_URL=https://api.habitual.app
WEB_URL=https://habitual.app
ENABLE_ANALYTICS=true
```

### Platform-Specific Configuration

#### Netlify
Dashboard → Site Settings → Environment Variables

#### Vercel
Dashboard → Project → Settings → Environment Variables

#### Firebase
```bash
firebase functions:config:set api.url="https://api.habitual.app"
```

#### Docker
```bash
docker run -p 80:80 \
  -e API_URL=https://api.habitual.app \
  -e NODE_ENV=production \
  habitual-web
```

## 🔒 Security Configuration

### SSL/HTTPS
**Required for PWA features!**

All platforms above provide automatic SSL. For custom domains:
1. Add domain in platform dashboard
2. Configure DNS records
3. SSL certificate is auto-provisioned

### Security Headers Verification
```bash
curl -I https://your-domain.com
```

Expected headers:
```
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Content-Security-Policy: ...
```

### Content Security Policy
Already configured in:
- `public/index.html` (meta tag)
- `netlify.toml` (HTTP header)

To customize, update both files.

## 📊 Performance Optimization

### Pre-deployment Checklist
- [ ] Run Lighthouse audit
- [ ] Check bundle size (`npm run build:web`)
- [ ] Test on slow 3G
- [ ] Verify image optimization
- [ ] Check code splitting
- [ ] Test service worker caching

### Lighthouse Audit
```bash
npx lighthouse https://your-domain.com --view
```

Target scores:
- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+
- PWA: 90+

### Bundle Size Analysis
```bash
# Add to package.json:
"analyze": "ANALYZE=true npm run build:web"

# Run
npm run analyze
```

### Optimization Tips
1. **Images**: Use WebP format
2. **Fonts**: Subset and preload
3. **JavaScript**: Enable code splitting
4. **CSS**: Remove unused styles
5. **Compression**: Enable Brotli/Gzip

## 🔄 CI/CD Setup

### GitHub Actions

**.github/workflows/deploy.yml**:
```yaml
name: Deploy Web

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test --if-present
      
      - name: Build web
        run: npm run build:web
        env:
          NODE_ENV: production
      
      - name: Deploy to Netlify
        uses: netlify/actions/cli@master
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
        with:
          args: deploy --prod --dir=web-build
```

### GitLab CI

**.gitlab-ci.yml**:
```yaml
image: node:18

stages:
  - build
  - deploy

cache:
  paths:
    - node_modules/

build:
  stage: build
  script:
    - npm ci
    - npm run build:web
  artifacts:
    paths:
      - web-build/
    expire_in: 1 day

deploy:
  stage: deploy
  only:
    - main
  script:
    - npm install -g netlify-cli
    - netlify deploy --prod --dir=web-build
  environment:
    name: production
    url: https://habitual.app
```

## 🧪 Testing Deployment

### Automated Tests
```bash
# Install Playwright
npm install -D @playwright/test

# Run E2E tests
npx playwright test
```

### Manual Testing Checklist
- [ ] Homepage loads
- [ ] All navigation works
- [ ] Habits CRUD operations
- [ ] Reminders work
- [ ] DNA visualization renders
- [ ] Analytics display correctly
- [ ] Profile updates save
- [ ] Offline mode functional
- [ ] PWA installs
- [ ] Push notifications (if enabled)
- [ ] Mobile responsive
- [ ] Cross-browser compatible
- [ ] Accessibility (keyboard navigation)

## 📱 PWA Verification

### Installation Test
1. Open in Chrome/Edge
2. Look for install prompt
3. Click "Install"
4. Verify standalone mode

### Service Worker Test
1. Open DevTools → Application
2. Check "Service Workers" section
3. Verify status: "Activated and running"
4. Test offline: Network → Offline checkbox
5. App should still load

### Manifest Test
```bash
# Check manifest
curl https://your-domain.com/manifest.json
```

## 🐛 Troubleshooting

### Build Fails
```bash
# Clear cache
rm -rf node_modules web-build .expo
npm install
npm run build:web
```

### Service Worker Not Working
- Verify HTTPS (required)
- Check browser console for errors
- Clear cache and hard reload
- Check `service-worker.js` is accessible

### Routing 404 Errors
- Verify SPA redirect rules
- Check `_redirects` file
- Platform-specific redirect configuration

### Performance Issues
- Run Lighthouse
- Check bundle size
- Verify code splitting
- Enable compression
- Optimize images

### CSP Violations
- Check browser console
- Update CSP in `netlify.toml`
- Add allowed domains
- Test thoroughly

## 📈 Monitoring

### Error Tracking
Integrate Sentry or similar:
```bash
npm install @sentry/react @sentry/browser
```

### Analytics
Integrate Google Analytics:
```javascript
// Add to public/index.html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
```

### Performance Monitoring
- Lighthouse CI
- Web Vitals
- Real User Monitoring (RUM)

## 🔄 Updates & Rollback

### Deploy Update
```bash
npm run build:web
netlify deploy --prod
```

### Rollback
```bash
# Netlify
netlify rollback

# Or via dashboard: Deploys → Previous → Publish
```

### Zero-Downtime Deployment
- Use staging environment
- Test before promoting to production
- Keep previous build available

## 📚 Resources

- [Expo Web Docs](https://docs.expo.dev/workflow/web/)
- [React Native Web](https://necolas.github.io/react-native-web/)
- [PWA Checklist](https://web.dev/pwa-checklist/)
- [Netlify Docs](https://docs.netlify.com/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

---

**Last Updated**: November 2024  
**Version**: 1.0.0
