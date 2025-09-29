# Component Documentation

This document provides detailed information about the components used in the HackPot application.

## Component Structure

```
src/components/
├── achievements/     # Achievement system components
├── admin/           # Administrative interface components
├── auth/            # Authentication and authorization components
├── game/            # Core prediction game components
├── layout/          # Layout and structural components
├── navigation/      # Navigation and routing components
├── profile/         # User profile management components
├── referrals/       # Referral system components
└── user/            # User management components
```

## Design System

### Color Palette

```typescript
// Primary Colors
const colors = {
  primary: {
    50: '#f0f9ff',
    500: '#8b5cf6',  // Violet
    600: '#7c3aed',
    900: '#581c87'
  },
  secondary: {
    500: '#d946ef',  // Fuchsia
    600: '#c026d3'
  },
  accent: {
    500: '#06b6d4',  // Cyan
    600: '#0891b2'
  }
}
```

### Typography

```typescript
// Font Families
const fonts = {
  sans: ['Inter', 'system-ui', 'sans-serif'],
  mono: ['JetBrains Mono', 'monospace']
}

// Font Sizes
const fontSize = {
  xs: '0.75rem',
  sm: '0.875rem',
  base: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
  '3xl': '1.875rem',
  '4xl': '2.25rem'
}
```

## Core Components

### Layout Components

#### Header
```typescript
interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  // Component implementation
}
```

**Features:**
- Responsive navigation
- Wallet connection status
- User profile dropdown
- Theme toggle
- Mobile hamburger menu

**Usage:**
```tsx
<Header className="sticky top-0 z-50" />
```

#### Footer
```typescript
interface FooterProps {
  className?: string;
}
```

**Features:**
- Company information
- Quick links
- Social media links
- Legal links
- Newsletter signup

### Navigation Components

#### BottomNavigation
```typescript
interface BottomNavigationProps {
  className?: string;
}
```

**Features:**
- Mobile-optimized navigation
- Active route highlighting
- Icon-based navigation
- Badge notifications

**Usage:**
```tsx
<BottomNavigation className="md:hidden" />
```

### Authentication Components

#### ProtectedRoute
```typescript
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallback?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  fallback
}) => {
  // Role-based access control
}
```

**Features:**
- Role-based access control
- Automatic redirects
- Loading states
- Custom fallback components

**Usage:**
```tsx
<ProtectedRoute allowedRoles={['admin', 'super_admin']}>
  <AdminPanel />
</ProtectedRoute>
```

#### WalletConnector
```typescript
interface WalletConnectorProps {
  onConnect?: (wallet: WalletAccount) => void;
  onDisconnect?: () => void;
  className?: string;
}
```

**Features:**
- Multi-wallet support
- Connection status
- Account switching
- Error handling

### Game Components

#### GameHub
```typescript
interface GameHubProps {
  className?: string;
}
```

**Features:**
- Active predictions display
- Prediction creation
- Real-time updates
- Filtering and sorting

#### PredictionCard
```typescript
interface PredictionCardProps {
  prediction: Prediction;
  onParticipate?: (prediction: Prediction) => void;
  className?: string;
}
```

**Features:**
- Prediction details display
- Participation interface
- Progress indicators
- Status badges

**Usage:**
```tsx
<PredictionCard
  prediction={prediction}
  onParticipate={handleParticipate}
  className="mb-4"
/>
```

#### PredictionForm
```typescript
interface PredictionFormProps {
  onSubmit: (prediction: CreatePredictionData) => void;
  onCancel?: () => void;
  initialData?: Partial<CreatePredictionData>;
}
```

**Features:**
- Form validation
- Multiple prediction types
- Stake amount selection
- Date/time pickers

### Profile Components

#### UserProfile
```typescript
interface UserProfileProps {
  userId?: string;
  editable?: boolean;
  className?: string;
}
```

**Features:**
- User information display
- Statistics overview
- Achievement showcase
- Edit functionality

#### ProfileStats
```typescript
interface ProfileStatsProps {
  stats: UserStats;
  className?: string;
}
```

**Features:**
- Performance metrics
- Visual charts
- Comparison data
- Historical trends

### Achievement Components

#### AchievementBadge
```typescript
interface AchievementBadgeProps {
  achievement: Achievement;
  earned?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showProgress?: boolean;
  className?: string;
}
```

**Features:**
- Visual badge display
- Progress indicators
- Hover effects
- Size variants

**Usage:**
```tsx
<AchievementBadge
  achievement={achievement}
  earned={true}
  size="lg"
  showProgress={false}
/>
```

#### AchievementGrid
```typescript
interface AchievementGridProps {
  achievements: Achievement[];
  userAchievements: UserAchievement[];
  className?: string;
}
```

**Features:**
- Grid layout
- Filter by category
- Search functionality
- Progress tracking

### Referral Components

#### ReferralDashboard
```typescript
interface ReferralDashboardProps {
  userId: string;
  className?: string;
}
```

**Features:**
- Referral code display
- Statistics overview
- Referral history
- Reward tracking

#### ReferralLink
```typescript
interface ReferralLinkProps {
  referralCode: string;
  onCopy?: () => void;
  className?: string;
}
```

**Features:**
- Shareable link generation
- Copy to clipboard
- Social sharing
- QR code generation

### Admin Components

#### AdminDashboard
```typescript
interface AdminDashboardProps {
  className?: string;
}
```

**Features:**
- System overview
- User management
- Prediction moderation
- Analytics dashboard

#### UserManagement
```typescript
interface UserManagementProps {
  onUserUpdate?: (user: User) => void;
  className?: string;
}
```

**Features:**
- User list with search
- Role management
- Account status control
- Bulk operations

## Common Patterns

### Loading States

```typescript
interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({ size = 'md', text, className }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`animate-spin rounded-full border-2 border-violet-500 border-t-transparent ${sizeClasses[size]}`} />
      {text && <span className="ml-2 text-gray-600">{text}</span>}
    </div>
  );
};
```

### Error States

```typescript
interface ErrorMessageProps {
  error: Error | string;
  onRetry?: () => void;
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error, onRetry, className }) => {
  const message = typeof error === 'string' ? error : error.message;
  
  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
      <p className="text-red-800">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      )}
    </div>
  );
};
```

### Empty States

```typescript
interface EmptyStateProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: React.ReactNode;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  action,
  icon,
  className
}) => {
  return (
    <div className={`text-center py-12 ${className}`}>
      {icon && <div className="mb-4">{icon}</div>}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      {description && <p className="text-gray-600 mb-4">{description}</p>}
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};
```

## Form Components

### Input Components

```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  className,
  ...props
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};
```

### Button Components

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  className,
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-violet-600 text-white hover:bg-violet-700 focus:ring-violet-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    outline: 'border border-violet-600 text-violet-600 hover:bg-violet-50 focus:ring-violet-500',
    ghost: 'text-violet-600 hover:bg-violet-50 focus:ring-violet-500'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${
        (disabled || loading) ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />}
      {icon && !loading && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};
```

## Animation Components

### Fade Transitions

```typescript
interface FadeProps {
  show: boolean;
  children: React.ReactNode;
  className?: string;
}

const Fade: React.FC<FadeProps> = ({ show, children, className }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
```

### Slide Transitions

```typescript
interface SlideProps {
  show: boolean;
  direction?: 'up' | 'down' | 'left' | 'right';
  children: React.ReactNode;
  className?: string;
}

const Slide: React.FC<SlideProps> = ({
  show,
  direction = 'up',
  children,
  className
}) => {
  const variants = {
    up: { y: 20 },
    down: { y: -20 },
    left: { x: 20 },
    right: { x: -20 }
  };
  
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, ...variants[direction] }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, ...variants[direction] }}
          transition={{ duration: 0.3 }}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
```

## Testing Components

### Component Testing

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
  
  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  it('shows loading state', () => {
    render(<Button loading>Loading</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

## Accessibility

### ARIA Labels

```typescript
// Always include proper ARIA labels
<button
  aria-label="Close dialog"
  aria-describedby="dialog-description"
  onClick={onClose}
>
  <X className="w-4 h-4" />
</button>
```

### Keyboard Navigation

```typescript
// Handle keyboard events
const handleKeyDown = (event: React.KeyboardEvent) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    onClick();
  }
};
```

### Focus Management

```typescript
// Manage focus for accessibility
const focusRef = useRef<HTMLButtonElement>(null);

useEffect(() => {
  if (autoFocus) {
    focusRef.current?.focus();
  }
}, [autoFocus]);
```

This component documentation provides a comprehensive guide for developers working with the HackPot component system.