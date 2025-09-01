# Deployment Guide 🚀

This guide covers various deployment options for the ATS Resume Optimizer application.

## 📋 Prerequisites

Before deploying, ensure you have:

- [ ] Node.js 16+ installed
- [ ] All dependencies installed (`npm install`)
- [ ] Application builds successfully (`npm run build`)
- [ ] Environment variables configured (if needed)
- [ ] Domain name ready (optional)

## 🏗️ Building for Production

### 1. **Create Production Build**
```bash
npm run build
```

This command will:
- Compile TypeScript to JavaScript
- Bundle and optimize all assets
- Generate static files in the `dist/` directory
- Minify CSS and JavaScript for production

### 2. **Test Production Build Locally**
```bash
npm run preview
```

This serves the production build locally for testing.

## 🌐 Deployment Options

### **Option 1: Vercel (Recommended)**

Vercel provides excellent support for React applications with automatic deployments.

#### **Automatic Deployment**
1. **Connect GitHub Repository**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your repository

2. **Configure Project**
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

3. **Environment Variables** (if needed)
   ```env
   VITE_GEMINI_API_KEY=your_api_key
   VITE_MAX_FILE_SIZE=10485760
   ```

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy

#### **Manual Deployment with Vercel CLI**
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### **Option 2: Netlify**

Netlify is another excellent option for static site hosting.

#### **Automatic Deployment**
1. **Connect Repository**
   - Go to [netlify.com](https://netlify.com)
   - Sign in with GitHub
   - Click "New site from Git"
   - Choose your repository

2. **Build Settings**
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: 18 (or your preferred version)

3. **Deploy**
   - Click "Deploy site"
   - Netlify will build and deploy automatically

#### **Manual Deployment**
```bash
# Build the project
npm run build

# Deploy to Netlify
# Drag and drop the dist folder to Netlify dashboard
```

### **Option 3: GitHub Pages**

Free hosting directly from your GitHub repository.

#### **Setup**
1. **Install gh-pages package**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add scripts to package.json**
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. **Deploy**
   ```bash
   npm run deploy
   ```

4. **Configure GitHub Pages**
   - Go to repository Settings > Pages
   - Set source to "Deploy from a branch"
   - Choose `gh-pages` branch

### **Option 4: Firebase Hosting**

Google's hosting solution with good performance.

#### **Setup**
1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login and Initialize**
   ```bash
   firebase login
   firebase init hosting
   ```

3. **Configure**
   - **Public directory**: `dist`
   - **Single-page app**: Yes
   - **Overwrite index.html**: No

4. **Deploy**
   ```bash
   firebase deploy
   ```

### **Option 5: AWS S3 + CloudFront**

Enterprise-grade hosting with CDN.

#### **Setup**
1. **Create S3 Bucket**
   - Enable static website hosting
   - Set bucket policy for public read access

2. **Upload Files**
   ```bash
   aws s3 sync dist/ s3://your-bucket-name --delete
   ```

3. **Configure CloudFront** (optional)
   - Create distribution pointing to S3
   - Set default root object to `index.html`

## 🔧 Environment Configuration

### **Environment Variables**
Create a `.env.production` file for production settings:

```env
# API Configuration
VITE_GEMINI_API_KEY=your_production_api_key
VITE_MAX_FILE_SIZE=10485760

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DEBUG=false

# External Services
VITE_API_BASE_URL=https://api.yourdomain.com
```

### **Build Configuration**
Update `vite.config.js` for production:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable sourcemaps in production
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['axios', 'pdf-parse']
        }
      }
    }
  },
  define: {
    'process.env.NODE_ENV': '"production"'
  }
})
```

## 📱 Performance Optimization

### **Build Optimization**
- **Code Splitting**: Automatic with Vite
- **Tree Shaking**: Automatic with Vite
- **Asset Optimization**: Automatic with Vite

### **Runtime Optimization**
- **Lazy Loading**: Implement for heavy components
- **Image Optimization**: Use WebP format when possible
- **Caching**: Implement service worker for offline support

## 🔒 Security Considerations

### **Content Security Policy**
Add CSP headers in your hosting configuration:

```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline';">
```

### **HTTPS Enforcement**
- Enable HTTPS on your hosting platform
- Redirect HTTP to HTTPS
- Use HSTS headers

### **API Security**
- Keep API keys secure
- Use environment variables
- Implement rate limiting if needed

## 📊 Monitoring and Analytics

### **Performance Monitoring**
- **Web Vitals**: Monitor Core Web Vitals
- **Error Tracking**: Implement error reporting
- **User Analytics**: Add analytics (Google Analytics, etc.)

### **Health Checks**
- Monitor application uptime
- Set up alerts for failures
- Track performance metrics

## 🚨 Troubleshooting

### **Common Issues**

#### **Build Failures**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### **Deployment Issues**
- Check build logs for errors
- Verify environment variables
- Ensure all dependencies are installed

#### **Performance Issues**
- Analyze bundle size with `npm run build -- --analyze`
- Check for large dependencies
- Optimize images and assets

### **Debug Mode**
Enable debug mode for troubleshooting:

```bash
# Set debug environment variable
DEBUG=* npm run dev

# Or add to .env
DEBUG=true
```

## 🔄 Continuous Deployment

### **GitHub Actions**
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run deploy
```

### **Vercel/Netlify**
- Enable automatic deployments
- Set up branch-based deployments
- Configure preview deployments for PRs

## 📚 Additional Resources

- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [React Deployment](https://create-react-app.dev/docs/deployment/)
- [Netlify Deployment](https://docs.netlify.com/site-deploys/create-deploys/)
- [Vercel Documentation](https://vercel.com/docs)

---

**Happy Deploying! 🚀**

Your ATS Resume Optimizer will be accessible to users worldwide!
