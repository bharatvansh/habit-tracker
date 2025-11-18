# Netlify Deployment Guide for Habit Tracker

## Prerequisites
- GitHub account with your repository
- Netlify account (free tier works fine)

## Step-by-Step Deployment Instructions

### Option 1: Deploy via Netlify Dashboard (Recommended)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Add Netlify configuration"
   git push origin main
   ```

2. **Sign up/Login to Netlify**
   - Go to https://www.netlify.com/
   - Click "Sign up" or "Log in"
   - Choose "Sign up with GitHub" for easier integration

3. **Import your project**
   - Click "Add new site" → "Import an existing project"
   - Choose "Deploy with GitHub"
   - Authorize Netlify to access your GitHub account
   - Select your `habit-tracker` repository

4. **Configure build settings**
   Netlify should auto-detect Next.js, but verify these settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
   - **Node version:** 18 (set in netlify.toml)
   
   Click "Deploy site"

5. **Wait for deployment**
   - First deployment takes 2-5 minutes
   - You'll see build logs in real-time
   - Once complete, you'll get a URL like: `https://random-name-123456.netlify.app`

6. **Custom domain (Optional)**
   - Go to "Site settings" → "Domain management"
   - Click "Add custom domain"
   - Follow instructions to connect your domain

### Option 2: Deploy via Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Initialize and deploy**
   ```bash
   netlify init
   ```
   Follow the prompts to connect your site

4. **Deploy**
   ```bash
   netlify deploy --prod
   ```

## Configuration Files Created

### netlify.toml
This file configures your Netlify deployment:
- Build command and publish directory
- Next.js plugin for optimal performance
- Node.js version
- Redirect rules for client-side routing

### next.config.mjs
Updated with `output: 'standalone'` for better Netlify compatibility

## Post-Deployment

### Environment Variables (if needed in future)
1. Go to "Site settings" → "Environment variables"
2. Add any API keys or secrets
3. Redeploy for changes to take effect

### Continuous Deployment
- Every push to `main` branch automatically triggers a new deployment
- Pull requests create preview deployments
- You can disable auto-deploy in "Site settings" → "Build & deploy"

### Custom Domain Setup
1. Buy a domain (Namecheap, Google Domains, etc.)
2. In Netlify: "Domain settings" → "Add custom domain"
3. Update your domain's DNS settings:
   - Add A record pointing to Netlify's load balancer
   - Or add CNAME record pointing to your Netlify subdomain
4. Netlify provides free SSL certificate automatically

## Troubleshooting

### Build fails
- Check build logs in Netlify dashboard
- Ensure all dependencies are in package.json
- Verify Node version compatibility

### 404 errors on refresh
- The netlify.toml redirect rules should handle this
- If issues persist, check "Redirects" in site settings

### Slow build times
- Consider using Netlify's build cache
- Optimize dependencies
- Use Next.js Image optimization

## Monitoring

- **Analytics:** Enable Netlify Analytics in site settings
- **Build notifications:** Set up email/Slack notifications
- **Deploy previews:** Automatically created for pull requests

## Useful Commands

```bash
# Deploy to production
netlify deploy --prod

# Open site in browser
netlify open:site

# View build logs
netlify watch

# Link local project to Netlify site
netlify link
```

## Cost
- Free tier includes:
  - 100GB bandwidth/month
  - 300 build minutes/month
  - Automatic HTTPS
  - Continuous deployment
  - Deploy previews

This should be more than enough for a personal habit tracker app!

## Next Steps After Deployment

1. Test all features on the live site
2. Set up custom domain (optional)
3. Enable Netlify Analytics (optional)
4. Configure form handling if you add contact forms
5. Set up monitoring/alerts

Your habit tracker is now live! 🎉
