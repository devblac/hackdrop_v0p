# Deployment Guide

This guide covers deploying HackPot to various platforms and environments.

## Prerequisites

- Node.js 18+ installed
- PNPM package manager
- Git repository access
- Supabase project set up
- Environment variables configured

## Environment Setup

### 1. Environment Variables

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Required variables:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Supabase Configuration

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the database migrations:
   ```bash
   npx supabase db push
   ```
3. Set up Row Level Security (RLS) policies
4. Configure authentication providers if needed

## Deployment Platforms

### Vercel (Recommended)

Vercel provides the best experience for React applications with automatic deployments.

#### Automatic Deployment

1. **Fork the repository** to your GitHub account

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your forked repository

3. **Configure Environment Variables**:
   - Add all variables from your `.env` file
   - Ensure `VITE_` prefix for client-side variables

4. **Deploy**:
   - Vercel will automatically build and deploy
   - Your app will be available at `https://your-app.vercel.app`

#### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Set environment variables
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY

# Redeploy with environment variables
vercel --prod
```

### Netlify

#### Automatic Deployment

1. **Connect Repository**:
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your repository

2. **Build Settings**:
   - Build command: `pnpm build`
   - Publish directory: `dist`

3. **Environment Variables**:
   - Go to Site settings > Environment variables
   - Add your environment variables

#### Manual Deployment

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the project
pnpm build

# Deploy
netlify deploy --prod --dir=dist
```

### AWS S3 + CloudFront

#### 1. Build the Project

```bash
pnpm build
```

#### 2. Create S3 Bucket

```bash
aws s3 mb s3://hackpot-app-bucket
```

#### 3. Configure Bucket for Static Hosting

```bash
aws s3 website s3://hackpot-app-bucket \
  --index-document index.html \
  --error-document index.html
```

#### 4. Upload Files

```bash
aws s3 sync dist/ s3://hackpot-app-bucket --delete
```

#### 5. Set Up CloudFront Distribution

Create a CloudFront distribution pointing to your S3 bucket for global CDN.

### Docker Deployment

#### Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

# Production stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### nginx.conf

```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        # Handle client-side routing
        location / {
            try_files $uri $uri/ /index.html;
        }

        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

#### Build and Run

```bash
# Build Docker image
docker build -t hackpot-app .

# Run container
docker run -p 80:80 hackpot-app
```

### Kubernetes Deployment

#### deployment.yaml

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hackpot-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: hackpot-app
  template:
    metadata:
      labels:
        app: hackpot-app
    spec:
      containers:
      - name: hackpot-app
        image: hackpot-app:latest
        ports:
        - containerPort: 80
        env:
        - name: VITE_SUPABASE_URL
          valueFrom:
            secretKeyRef:
              name: hackpot-secrets
              key: supabase-url
        - name: VITE_SUPABASE_ANON_KEY
          valueFrom:
            secretKeyRef:
              name: hackpot-secrets
              key: supabase-anon-key
---
apiVersion: v1
kind: Service
metadata:
  name: hackpot-service
spec:
  selector:
    app: hackpot-app
  ports:
  - port: 80
    targetPort: 80
  type: LoadBalancer
```

#### Deploy to Kubernetes

```bash
# Create secrets
kubectl create secret generic hackpot-secrets \
  --from-literal=supabase-url=your_url \
  --from-literal=supabase-anon-key=your_key

# Deploy
kubectl apply -f deployment.yaml
```

## CI/CD Pipeline

### GitHub Actions

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
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'pnpm'
    
    - name: Install pnpm
      run: npm install -g pnpm
    
    - name: Install dependencies
      run: pnpm install --frozen-lockfile
    
    - name: Run tests
      run: pnpm test
    
    - name: Build
      run: pnpm build
      env:
        VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
        VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'
```

## Performance Optimization

### Build Optimization

1. **Code Splitting**:
   ```typescript
   // Lazy load pages
   const ProfilePage = lazy(() => import('./pages/ProfilePage'));
   ```

2. **Bundle Analysis**:
   ```bash
   pnpm build --analyze
   ```

3. **Asset Optimization**:
   - Compress images
   - Use WebP format
   - Implement lazy loading

### CDN Configuration

Configure your CDN to:
- Cache static assets for 1 year
- Use gzip/brotli compression
- Set proper cache headers
- Enable HTTP/2

## Monitoring and Analytics

### Error Tracking

Add Sentry for error tracking:

```bash
pnpm add @sentry/react @sentry/tracing
```

```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

### Performance Monitoring

1. **Web Vitals**:
   ```typescript
   import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

   getCLS(console.log);
   getFID(console.log);
   getFCP(console.log);
   getLCP(console.log);
   getTTFB(console.log);
   ```

2. **Analytics**:
   - Google Analytics 4
   - Mixpanel for user events
   - Custom analytics dashboard

## Security Considerations

### HTTPS Configuration

Ensure HTTPS is enabled:
- Use SSL certificates (Let's Encrypt for free)
- Redirect HTTP to HTTPS
- Set HSTS headers

### Content Security Policy

Add CSP headers:
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';
```

### Environment Security

- Never commit `.env` files
- Use secrets management for production
- Rotate API keys regularly
- Monitor for exposed secrets

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check Node.js version compatibility
   - Clear node_modules and reinstall
   - Verify environment variables

2. **Runtime Errors**:
   - Check browser console for errors
   - Verify API endpoints are accessible
   - Check CORS configuration

3. **Performance Issues**:
   - Analyze bundle size
   - Check for memory leaks
   - Optimize images and assets

### Debug Mode

Enable debug mode for troubleshooting:
```env
VITE_DEBUG=true
```

## Rollback Strategy

### Vercel Rollback

```bash
# List deployments
vercel ls

# Rollback to previous deployment
vercel rollback [deployment-url]
```

### Manual Rollback

1. Keep previous build artifacts
2. Have database migration rollback scripts
3. Monitor application health after deployment
4. Implement feature flags for quick disabling

## Health Checks

Implement health check endpoints:

```typescript
// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version
  });
});
```

## Scaling Considerations

- Use CDN for static assets
- Implement caching strategies
- Consider serverless functions for API
- Monitor database performance
- Use load balancers for high traffic

For more deployment options and advanced configurations, refer to the platform-specific documentation.