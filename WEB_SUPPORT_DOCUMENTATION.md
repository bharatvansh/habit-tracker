# Web Support Documentation - Habitual App

## 🌐 Overview

This document describes the comprehensive web support implementation for the Habitual app. The app is built with React Native and Expo, with robust web support through react-native-web and custom optimizations.

## 📦 What's Included

### 1. **Progressive Web App (PWA) Support**

#### Manifest (`public/manifest.json`)
- Full PWA manifest with app metadata
- Multiple icon sizes (72x72 to 512x512)
- App shortcuts for quick actions
- Share target API integration
- Standalone display mode

#### Service Worker (`public/service-worker.js`)
- Offline support with cache-first strategy
- Runtime caching for dynamic content
- Background sync for habit updates
- Push notification handling
- Automatic cache cleanup

#### Installation
- Auto-detects install prompt
- Shows custom install UI
- Tracks installation state
- Handles app updates seamlessly

### 2. **Universal Storage Adapter**

#### File: `lib/storage-adapter.ts`
- **Web**: Uses `localStorage` with error handling
- **Native**: Uses `AsyncStorage` 
- **SSR-safe**: Falls back to in-memory storage
- **Type-safe**: Full TypeScript support

#### Updated Stores
All Zustand stores now use `createUniversalStorage()`:
- `store/habit-store.ts` ✅
- `store/reminder-store.ts` ✅
- `store/habit-dna-store.ts` ✅
- `store/session-store.ts` ✅

### 3. **Platform-Specific Code**

#### Session Tracking (`components/session-tracker.tsx`)
- **Web**: Uses Document Visibility API + page lifecycle events
- **Native**: Uses AppState listener
- Tracks focus/blur, visibility changes
- Handles page unload gracefully

#### Platform Utilities (`lib/platform-utils.ts`)
Comprehensive helper functions:
- Platform detection (web, mobile, desktop)
- Device type detection (mobile, tablet, desktop)
- Browser detection
- Responsive breakpoints
- PWA installation detection
- Touch device detection
- Clipboard operations
- Web Share API
- Download file helper
- Haptic feedback (cross-platform)

### 4. **Security Hardening**

#### Content Security Policy
Configured in `public/index.html` and `netlify.toml`:
```
- script-src: 'self' + inline (for Expo)
- style-src: 'self' + inline
- img-src: all https sources + data/blob
- connect-src: API + WebSocket support
- object-src: none (XSS protection)
- upgrade-insecure-requests
```

#### Security Headers (`netlify.toml`)
- `X-Frame-Options: SAMEORIGIN` (clickjacking protection)
- `X-Content-Type-Options: nosniff` (MIME sniffing protection)
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` (camera, microphone, geolocation disabled)

#### CORS Configuration
- Proper CORS headers for API access
- Allows all methods (GET, POST, PUT, DELETE)
- Configurable for production environments

### 5. **Performance Optimizations**

#### Webpack Configuration (`webpack.config.js`)
- **Code Splitting**: Vendor, React, Store bundles separated
- **Compression**: Gzip compression for production
- **Minification**: Terser with optimizations
- **Source Maps**: Development & production
- **Tree Shaking**: Removes unused code
- **Performance Hints**: Bundle size warnings

#### Metro Configuration (`metro.config.js`)
- Console removal in production
- Asset optimization (fonts, images)
- Platform-specific resolution
- Symlink support
- Multiple file format support

#### Cache Control (`netlify.toml`)
- Static assets: 1 year cache (immutable)
- Manifest: 1 day cache
- Service Worker: no-cache (always fresh)
- JS/CSS: Long-term caching with hash

### 6. **SEO & Metadata**

#### HTML Template (`public/index.html`)
- Comprehensive meta tags
- Open Graph tags (Facebook)
- Twitter Card tags
- Structured Data (JSON-LD)
- Mobile optimization
- Theme color & status bar styling

#### Sitemap (`public/sitemap.xml`)
- All main routes indexed
- Priority and change frequency configured
- Mobile-friendly

#### Robots.txt (`public/robots.txt`)
- Allows all bots
- Sitemap reference
- Crawl delay configured

### 7. **Deployment Configuration**

#### Netlify (`netlify.toml`)
- SPA routing redirects
- Environment-specific builds
- Lighthouse plugin integration
- Performance thresholds
- Functions support ready

#### Build Commands
```bash
# Development
npm run web

# Production build
npm run build:web

# With analysis
ANALYZE=true npm run build:web
```

### 8. **PWA Features**

#### Offline Support
- App shell cached
- Routes work offline
- Data persistence with localStorage
- Background sync for updates

#### Install Prompts
- Detects install availability
- Custom install UI possible
- Tracks installation status

#### Push Notifications
- Permission handling
- Notification display
- Click actions
- Badge updates

#### App Shortcuts
1. Add Habit
2. View DNA
3. Analytics

### 9. **Responsive Design**

#### Breakpoints (in `lib/platform-utils.ts`)
- Mobile: < 640px
- Tablet: 640-768px
- Laptop: 768-1024px
- Desktop: > 1024px

#### Viewport Handling
- Safe viewport calculations
- Landscape detection
- Mobile browser chrome consideration

### 10. **Environment Configuration**

#### `.env.example`
Template for environment variables:
- API configuration
- Feature flags
- Analytics IDs
- Storage configuration
- Debug settings

## 🚀 Getting Started

### Development

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run web version**
   ```bash
   npm run web
   ```

3. **Access at**
   ```
   http://localhost:8081
   ```

### Production Build

1. **Build for web**
   ```bash
   npm run build:web
   ```

2. **Deploy to Netlify**
   ```bash
   netlify deploy --prod
   ```

3. **Test PWA**
   - Open in Chrome/Edge
   - Check Application tab in DevTools
   - Verify service worker registration
   - Test offline mode
   - Test installation

## 🔧 Configuration

### Customizing CSP

Edit `netlify.toml` or `public/index.html`:
```toml
Content-Security-Policy = """
  script-src 'self' https://trusted-cdn.com;
  ...
"""
```

### Adding API Endpoints

1. Update `connect-src` in CSP
2. Add to `.env`:
   ```
   API_URL=https://your-api.com
   ```

### Custom Service Worker

Edit `public/service-worker.js`:
```javascript
const CACHE_NAME = 'your-app-v2';
const PRECACHE_URLS = [
  '/',
  '/your-routes',
];
```

## 📊 Performance Metrics

### Target Scores (Lighthouse)
- Performance: > 80%
- Accessibility: > 90%
- Best Practices: > 90%
- SEO: > 90%
- PWA: > 80%

### Bundle Sizes (Target)
- Main bundle: < 512 KB
- Vendor bundle: < 512 KB
- Total initial: < 1 MB

## 🐛 Troubleshooting

### Service Worker Not Registering
1. Check HTTPS (required for SW)
2. Verify path: `/service-worker.js`
3. Check browser console for errors
4. Clear cache and reload

### LocalStorage Not Working
- Check browser storage quota
- Verify CSP allows storage
- Check for private browsing mode

### PWA Not Installing
- Verify manifest.json is accessible
- Check all required fields in manifest
- Ensure HTTPS connection
- Clear browser cache

### Performance Issues
1. Run bundle analyzer: `ANALYZE=true npm run build:web`
2. Check network tab for large assets
3. Verify code splitting is working
4. Check service worker caching

## 🔒 Security Checklist

- [x] CSP configured
- [x] Security headers set
- [x] HTTPS enforced
- [x] XSS protection enabled
- [x] Clickjacking protection
- [x] MIME sniffing disabled
- [x] Referrer policy set
- [x] Permissions policy configured
- [x] CORS properly configured
- [x] Input validation (app-level)

## 📱 Platform Support

### Browsers
- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Samsung Internet 14+
- ⚠️  IE 11 (limited support)

### PWA Features by Browser
| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Service Worker | ✅ | ✅ | ✅ | ✅ |
| Push Notifications | ✅ | ✅ | ⚠️ | ✅ |
| Install Prompt | ✅ | ⚠️ | ⚠️ | ✅ |
| Background Sync | ✅ | ❌ | ❌ | ✅ |
| Share API | ✅ | ❌ | ✅ | ✅ |

## 🎯 Best Practices

### 1. Always Use Platform Checks
```typescript
import { Platform } from 'react-native';

if (Platform.OS === 'web') {
  // Web-specific code
}
```

### 2. Use Platform Utilities
```typescript
import { isWeb, isTouchDevice } from '../lib/platform-utils';

if (isWeb && !isTouchDevice()) {
  // Desktop web specific
}
```

### 3. Handle Storage Errors
```typescript
// Storage adapter handles this automatically
const storage = createUniversalStorage();
```

### 4. Test Offline
- Disable network in DevTools
- Verify app still loads
- Check data persistence

### 5. Monitor Performance
```bash
# Run Lighthouse
npx lighthouse https://your-app.com --view

# Check bundle size
npm run build:web
```

## 📚 Additional Resources

- [Expo Web Docs](https://docs.expo.dev/workflow/web/)
- [React Native Web](https://necolas.github.io/react-native-web/)
- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [Netlify Deployment](https://docs.netlify.com/)
- [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

## 🔄 Updates & Maintenance

### Updating Service Worker
1. Increment cache version in `service-worker.js`
2. Update precache URLs if needed
3. Deploy
4. Users will be prompted to update

### Adding New Routes
1. Update `public/sitemap.xml`
2. Add to service worker precache if critical
3. Update app shortcuts if applicable

### Security Updates
1. Regularly update dependencies
2. Review CSP for new requirements
3. Check security headers effectiveness
4. Monitor for vulnerabilities

## ✅ Verification Checklist

After deployment, verify:
- [ ] App loads on web
- [ ] PWA installs successfully
- [ ] Offline mode works
- [ ] Data persists across sessions
- [ ] Service worker registers
- [ ] All routes work
- [ ] Security headers present
- [ ] Lighthouse scores meet targets
- [ ] Mobile responsive
- [ ] Cross-browser compatible

---

**Version**: 1.0.0  
**Last Updated**: November 2024  
**Maintained By**: Habitual Team
