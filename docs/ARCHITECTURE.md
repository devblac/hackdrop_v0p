# HackPot Architecture Overview

This document provides a comprehensive overview of the HackPot application architecture, including system design, data flow, and technical decisions.

## System Overview

HackPot is a modern, scalable prediction platform built with a decentralized architecture that leverages blockchain technology for transparency and traditional web technologies for user experience.

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Blockchain    │
│   (React SPA)   │◄──►│   (Supabase)    │◄──►│   (Algorand)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Architecture Principles

### 1. Separation of Concerns
- **Frontend**: User interface and experience
- **Backend**: Data management and business logic
- **Blockchain**: Transaction processing and transparency

### 2. Scalability
- Stateless frontend components
- Database optimization with indexing
- CDN for static asset delivery
- Horizontal scaling capabilities

### 3. Security
- Client-side wallet integration
- Row-level security in database
- Input validation and sanitization
- HTTPS enforcement

### 4. User Experience
- Progressive Web App (PWA) capabilities
- Responsive design for all devices
- Real-time updates
- Offline functionality (planned)

## Frontend Architecture

### Technology Stack

```typescript
// Core Technologies
React 19          // UI Framework
TypeScript 5.8    // Type Safety
Vite 6.3         // Build Tool
TailwindCSS 3    // Styling Framework

// State Management
Zustand 5        // Global State
React Router 6   // Client-side Routing

// Blockchain Integration
Algorand SDK 3   // Blockchain Interaction
TxnLab Wallet    // Multi-wallet Support

// UI/UX Enhancement
Framer Motion 11 // Animations
Lucide React     // Icons
Recharts 3       // Data Visualization
```

### Component Architecture

```
src/
├── components/           # Reusable UI Components
│   ├── achievements/    # Achievement-related components
│   ├── admin/          # Admin panel components
│   ├── auth/           # Authentication components
│   ├── game/           # Prediction game components
│   ├── layout/         # Layout components (Header, Footer)
│   ├── navigation/     # Navigation components
│   ├── profile/        # User profile components
│   ├── referrals/      # Referral system components
│   └── user/           # User management components
├── pages/              # Page-level components
├── stores/             # Zustand state stores
├── lib/                # Utility libraries
├── types/              # TypeScript definitions
└── utils/              # Helper functions
```

### State Management Strategy

```typescript
// Global State (Zustand)
interface AppState {
  // Authentication
  auth: AuthState;
  
  // User Data
  user: UserState;
  
  // Predictions
  predictions: PredictionState;
  
  // UI State
  ui: UIState;
}

// Local State (React useState/useReducer)
// - Component-specific state
// - Form state
// - Temporary UI state
```

### Data Flow

```
User Action → Component → Store → API Call → Database
     ↑                                           ↓
User Interface ← Component ← Store ← Response ← Database
```

## Backend Architecture

### Supabase Stack

```typescript
// Core Services
PostgreSQL      // Primary Database
PostgREST       // Auto-generated REST API
Realtime        // WebSocket connections
Auth            // Authentication service
Storage         // File storage
Edge Functions  // Serverless functions
```

### Database Schema Design

#### Core Tables

1. **Users Table**
   - Primary user information
   - Wallet addresses
   - Performance metrics
   - Role-based access control

2. **Predictions Table**
   - Prediction details and metadata
   - User predictions and stakes
   - Resolution data
   - Status tracking

3. **Achievements Table**
   - Achievement definitions
   - Criteria and rewards
   - Category organization

4. **User Achievements Table**
   - User-achievement relationships
   - Earning timestamps
   - Progress tracking

5. **Referrals Table**
   - Referral relationships
   - Reward tracking
   - Status management

#### Relationships

```sql
Users (1) ←→ (N) Predictions
Users (1) ←→ (N) User_Achievements
Achievements (1) ←→ (N) User_Achievements
Users (1) ←→ (N) Referrals (as referrer)
Users (1) ←→ (N) Referrals (as referred)
```

### Security Architecture

#### Row Level Security (RLS)

```sql
-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Predictions are publicly readable but user-specific for updates
CREATE POLICY "Predictions are publicly readable" ON predictions
  FOR SELECT USING (true);

CREATE POLICY "Users can update own predictions" ON predictions
  FOR UPDATE USING (auth.uid() = user_id);
```

#### Authentication Flow

```
1. User connects wallet
2. Wallet signs authentication message
3. Signature verified on client
4. Supabase session created
5. JWT token issued
6. Token used for API requests
```

## Blockchain Integration

### Algorand Integration

```typescript
// Wallet Management
const walletManager = new WalletManager({
  wallets: [
    WalletId.PERA,
    WalletId.DEFLY,
    WalletId.LUTE,
    WalletId.EXODUS,
    WalletId.WALLETCONNECT
  ],
  defaultNetwork: NetworkId.TESTNET
});

// Transaction Flow
1. User initiates prediction
2. Transaction constructed
3. User signs with wallet
4. Transaction submitted to Algorand
5. Confirmation received
6. Database updated
```

### Smart Contract Architecture (Future)

```
┌─────────────────┐
│ Prediction      │
│ Contract        │
├─────────────────┤
│ - Create        │
│ - Participate   │
│ - Resolve       │
│ - Distribute    │
└─────────────────┘
```

## Data Flow Architecture

### Real-time Updates

```typescript
// Supabase Realtime
const subscription = supabase
  .channel('predictions')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'predictions'
  }, handlePredictionUpdate)
  .subscribe();
```

### Caching Strategy

```typescript
// Client-side Caching
1. React Query for API caching
2. Local Storage for user preferences
3. Session Storage for temporary data
4. Service Worker for offline caching (planned)
```

## Performance Architecture

### Frontend Optimization

```typescript
// Code Splitting
const LazyComponent = lazy(() => import('./Component'));

// Bundle Optimization
- Tree shaking
- Dead code elimination
- Asset optimization
- Gzip compression
```

### Database Optimization

```sql
-- Indexing Strategy
CREATE INDEX idx_predictions_user_id ON predictions(user_id);
CREATE INDEX idx_predictions_status ON predictions(status);
CREATE INDEX idx_predictions_end_date ON predictions(end_date);

-- Query Optimization
- Use appropriate indexes
- Limit result sets
- Use pagination
- Optimize joins
```

## Scalability Architecture

### Horizontal Scaling

```
Load Balancer
├── Frontend Instance 1
├── Frontend Instance 2
└── Frontend Instance N

Database Cluster
├── Primary (Read/Write)
├── Replica 1 (Read)
└── Replica N (Read)
```

### Caching Layers

```
CDN (CloudFlare/AWS CloudFront)
├── Static Assets
├── API Responses (cacheable)
└── Database Query Results
```

## Security Architecture

### Frontend Security

```typescript
// Input Validation
const validateInput = (input: string) => {
  return DOMPurify.sanitize(input);
};

// XSS Prevention
- Content Security Policy
- Input sanitization
- Output encoding
```

### API Security

```typescript
// Rate Limiting
const rateLimiter = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
};

// Authentication
- JWT token validation
- Role-based access control
- API key management
```

## Monitoring Architecture

### Application Monitoring

```typescript
// Error Tracking
Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  environment: process.env.NODE_ENV
});

// Performance Monitoring
- Web Vitals tracking
- API response times
- Database query performance
```

### Infrastructure Monitoring

```
Metrics Collection
├── Application Metrics
├── Database Metrics
├── Server Metrics
└── User Analytics
```

## Deployment Architecture

### CI/CD Pipeline

```yaml
# GitHub Actions Workflow
1. Code Push → GitHub
2. Automated Tests
3. Build Process
4. Security Scanning
5. Deployment to Staging
6. Integration Tests
7. Deployment to Production
8. Health Checks
```

### Environment Strategy

```
Development → Staging → Production
     ↓           ↓         ↓
   Local DB → Test DB → Prod DB
```

## Future Architecture Considerations

### Microservices Migration

```
Current: Monolithic Frontend + Supabase Backend
Future: Microservices Architecture

┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ User        │  │ Prediction  │  │ Achievement │
│ Service     │  │ Service     │  │ Service     │
└─────────────┘  └─────────────┘  └─────────────┘
```

### Blockchain Evolution

```
Current: Algorand Integration
Future: Multi-chain Support

┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ Algorand    │  │ Ethereum    │  │ Polygon     │
│ Integration │  │ Integration │  │ Integration │
└─────────────┘  └─────────────┘  └─────────────┘
```

### Mobile Architecture

```
Current: Responsive Web App
Future: Native Mobile Apps

┌─────────────┐  ┌─────────────┐
│ React       │  │ React       │
│ Native iOS  │  │ Native      │
│             │  │ Android     │
└─────────────┘  └─────────────┘
```

## Technology Decisions

### Why React?
- Large ecosystem and community
- Excellent TypeScript support
- Rich component libraries
- Strong developer tools

### Why Supabase?
- PostgreSQL with real-time capabilities
- Built-in authentication
- Auto-generated APIs
- Excellent developer experience

### Why Algorand?
- Fast transaction finality
- Low transaction costs
- Strong developer ecosystem
- Environmental sustainability

### Why Zustand?
- Lightweight state management
- TypeScript-first design
- No boilerplate code
- Easy testing

## Performance Metrics

### Target Metrics
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1
- First Input Delay: < 100ms
- Time to Interactive: < 3.5s

### Monitoring Tools
- Lighthouse CI
- Web Vitals
- Sentry Performance
- Custom analytics

This architecture provides a solid foundation for HackPot's current needs while maintaining flexibility for future growth and feature additions.