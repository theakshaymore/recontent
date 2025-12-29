# Environment Setup Guide

## Quick Setup Instructions

### 1. Frontend Environment (.env in recontent/)

Copy the example file and fill in your credentials:

```bash
# In recontent/ directory
cp .env.example .env
```

Then edit `recontent/.env` with your actual values:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Backend API URL (keep as is for local development)
VITE_API_URL=http://localhost:3000
```

### 2. Backend Environment (.env in recontent/backend/)

Copy the example file and fill in your credentials:

```bash
# In recontent/backend/ directory
cp .env.example .env
```

Then edit `recontent/backend/.env` with your actual values:

```env
# Server Configuration (keep as is)
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_supabase_service_role_key_here

# OpenAI Configuration
OPENAI_API_KEY=sk-your_openai_api_key_here

# Redis Configuration (keep as is for Docker)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# YouTube API (Optional - can leave empty for now)
YOUTUBE_API_KEY=

# Rate Limiting (keep as is)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Where to Get Your API Keys

### Supabase

1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to Settings > API
4. Copy:
   - Project URL → `VITE_SUPABASE_URL` and `SUPABASE_URL`
   - `anon` `public` key → `VITE_SUPABASE_ANON_KEY`
   - `service_role` `secret` key → `SUPABASE_SERVICE_KEY`

### OpenAI

1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Copy the key → `OPENAI_API_KEY`

### YouTube API (Optional)

1. Go to https://console.cloud.google.com
2. Create a project and enable YouTube Data API v3
3. Create credentials (API Key)
4. Copy the key → `YOUTUBE_API_KEY`

## Next Steps

After setting up both .env files, you're ready to start the application!
