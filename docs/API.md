# HackPot API Documentation

This document describes the API endpoints and data structures used in the HackPot application.

## Overview

HackPot uses Supabase as its backend service, providing:
- PostgreSQL database with Row Level Security (RLS)
- Real-time subscriptions
- Authentication and authorization
- Edge functions for serverless computing

## Authentication

All API requests require authentication through Supabase Auth. Users can authenticate using:
- Algorand wallet signatures
- Email/password (if enabled)
- OAuth providers (if configured)

### Authentication Headers

```typescript
const headers = {
  'Authorization': `Bearer ${supabaseToken}`,
  'apikey': process.env.VITE_SUPABASE_ANON_KEY
}
```

## Database Schema

### Users Table

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE,
  email TEXT,
  avatar_url TEXT,
  bio TEXT,
  total_predictions INTEGER DEFAULT 0,
  correct_predictions INTEGER DEFAULT 0,
  accuracy_rate DECIMAL(5,2) DEFAULT 0.00,
  total_rewards DECIMAL(20,6) DEFAULT 0,
  referral_code TEXT UNIQUE,
  referred_by UUID REFERENCES users(id),
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'super_admin')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Predictions Table

```sql
CREATE TABLE predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  prediction_type TEXT NOT NULL CHECK (prediction_type IN ('binary', 'multiple_choice', 'numeric')),
  options JSONB,
  user_prediction JSONB NOT NULL,
  stake_amount DECIMAL(20,6) NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  resolution_date TIMESTAMP WITH TIME ZONE,
  actual_outcome JSONB,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'cancelled')),
  total_participants INTEGER DEFAULT 1,
  total_stake DECIMAL(20,6) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Achievements Table

```sql
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  category TEXT NOT NULL,
  criteria JSONB NOT NULL,
  reward_amount DECIMAL(20,6) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### User Achievements Table

```sql
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  achievement_id UUID REFERENCES achievements(id) NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);
```

### Referrals Table

```sql
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID REFERENCES users(id) NOT NULL,
  referred_id UUID REFERENCES users(id) NOT NULL,
  reward_amount DECIMAL(20,6) DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);
```

## API Endpoints

### User Management

#### Get User Profile
```typescript
const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('id', userId)
  .single();
```

#### Update User Profile
```typescript
const { data, error } = await supabase
  .from('users')
  .update({
    username,
    bio,
    avatar_url
  })
  .eq('id', userId);
```

### Predictions

#### Create Prediction
```typescript
const { data, error } = await supabase
  .from('predictions')
  .insert({
    user_id: userId,
    title,
    description,
    category,
    prediction_type,
    options,
    user_prediction,
    stake_amount,
    end_date
  });
```

#### Get Active Predictions
```typescript
const { data, error } = await supabase
  .from('predictions')
  .select(`
    *,
    users:user_id (
      username,
      avatar_url
    )
  `)
  .eq('status', 'active')
  .order('created_at', { ascending: false });
```

#### Join Prediction
```typescript
const { data, error } = await supabase
  .from('prediction_participants')
  .insert({
    prediction_id,
    user_id: userId,
    prediction: userPrediction,
    stake_amount
  });
```

### Achievements

#### Get User Achievements
```typescript
const { data, error } = await supabase
  .from('user_achievements')
  .select(`
    *,
    achievements (
      name,
      description,
      icon,
      category
    )
  `)
  .eq('user_id', userId)
  .order('earned_at', { ascending: false });
```

#### Check Achievement Eligibility
```typescript
// This would typically be handled by a database function or edge function
const { data, error } = await supabase
  .rpc('check_achievement_eligibility', {
    user_id: userId,
    achievement_type: 'accuracy_milestone'
  });
```

### Referrals

#### Generate Referral Code
```typescript
const { data, error } = await supabase
  .from('users')
  .update({
    referral_code: generateUniqueCode()
  })
  .eq('id', userId);
```

#### Get Referral Stats
```typescript
const { data, error } = await supabase
  .from('referrals')
  .select('*')
  .eq('referrer_id', userId);
```

### Analytics

#### Get User Stats
```typescript
const { data, error } = await supabase
  .rpc('get_user_stats', {
    user_id: userId
  });
```

#### Get Leaderboard
```typescript
const { data, error } = await supabase
  .from('users')
  .select('username, total_predictions, correct_predictions, accuracy_rate, total_rewards')
  .order('accuracy_rate', { ascending: false })
  .limit(100);
```

## Real-time Subscriptions

### Prediction Updates
```typescript
const subscription = supabase
  .channel('predictions')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'predictions'
  }, (payload) => {
    // Handle prediction updates
  })
  .subscribe();
```

### User Achievement Notifications
```typescript
const subscription = supabase
  .channel(`user_achievements:${userId}`)
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'user_achievements',
    filter: `user_id=eq.${userId}`
  }, (payload) => {
    // Handle new achievement
  })
  .subscribe();
```

## Error Handling

All API responses follow a consistent error format:

```typescript
interface APIError {
  error: {
    message: string;
    code?: string;
    details?: any;
  }
}
```

Common error codes:
- `PGRST116`: Row not found
- `23505`: Unique constraint violation
- `42501`: Insufficient privileges
- `23503`: Foreign key constraint violation

## Rate Limiting

API endpoints are rate-limited to prevent abuse:
- User actions: 100 requests per minute
- Read operations: 1000 requests per minute
- Write operations: 50 requests per minute

## Data Types

### Prediction Types
```typescript
type PredictionType = 'binary' | 'multiple_choice' | 'numeric';

interface BinaryPrediction {
  type: 'binary';
  options: ['yes', 'no'];
  user_choice: 'yes' | 'no';
}

interface MultipleChoicePrediction {
  type: 'multiple_choice';
  options: string[];
  user_choice: string;
}

interface NumericPrediction {
  type: 'numeric';
  range: [number, number];
  user_value: number;
}
```

### Achievement Criteria
```typescript
interface AchievementCriteria {
  type: 'accuracy' | 'streak' | 'participation' | 'referral';
  threshold: number;
  timeframe?: 'daily' | 'weekly' | 'monthly' | 'all_time';
}
```

## Security Considerations

- All endpoints use Row Level Security (RLS)
- User data is isolated by user ID
- Admin endpoints require proper role verification
- Input validation is performed on all mutations
- Rate limiting prevents abuse
- Audit logs track all significant actions

## Testing

Use the provided test utilities for API testing:

```typescript
import { createTestClient } from './test-utils';

const testClient = createTestClient();
const response = await testClient.predictions.create({
  title: 'Test Prediction',
  // ... other fields
});
```