# 🔐 Environment Variables Setup Guide

## 📍 File Locations

I've created two template .env files for you:

1. **Frontend**: `recontent/.env`
2. **Backend**: `recontent/backend/.env`

## ✏️ How to Fill Them In

### Step 1: Frontend .env (`recontent/.env`)

Open the file and fill in:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx
VITE_API_URL=http://localhost:3000
```

**Where to get these:**

- Go to https://supabase.com/dashboard
- Select your project
- Go to **Settings** → **API**
- Copy **Project URL** → paste as `VITE_SUPABASE_URL`
- Copy **anon public** key → paste as `VITE_SUPABASE_ANON_KEY`
- Keep `VITE_API_URL` as is (points to your local backend)

### Step 2: Backend .env (`recontent/backend/.env`)

Open the file and fill in:

```env
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx

OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

YOUTUBE_API_KEY=

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Where to get these:**

**Supabase:**

- Same dashboard as above
- Copy **Project URL** → paste as `SUPABASE_URL`
- Copy **service_role secret** key → paste as `SUPABASE_SERVICE_KEY`

**OpenAI:**

- Go to https://platform.openai.com/api-keys
- Click "Create new secret key"
- Copy the key → paste as `OPENAI_API_KEY`

**YouTube API (Optional):**

- Go to https://console.cloud.google.com
- Enable YouTube Data API v3
- Create credentials (API Key)
- Copy the key → paste as `YOUTUBE_API_KEY`
- (You can leave this empty for now)

**Redis, Rate Limiting:**

- Keep these values as they are (already configured)

## ✅ After Filling In Credentials

Once you've filled in both .env files, let me know and I'll:

1. Start the backend server
2. Start the frontend dev server
3. Test the health endpoint
4. Verify everything is working

## 🔒 Security Note

- Never commit .env files to git (they're already in .gitignore)
- Never share your credentials publicly
- Keep your service role key secret (it has admin access)
