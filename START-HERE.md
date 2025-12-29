# 🚀 Quick Start Guide - ReContent AI

## ✅ Setup Complete!

Great news! The following have been successfully set up:

- ✅ Node.js v24.11.1 installed
- ✅ npm v11.6.2 installed
- ✅ Docker installed and running
- ✅ Redis container running (port 6379)
- ✅ Frontend dependencies installed (384 packages)
- ✅ Backend dependencies installed (221 packages)

## 📝 Next Steps

### Step 1: Configure Environment Variables

You need to create `.env` files with your API credentials.

#### Frontend .env (in `recontent/` directory)

Create a file named `.env` in the `recontent/` folder with:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
VITE_API_URL=http://localhost:3000
```

#### Backend .env (in `recontent/backend/` directory)

Create a file named `.env` in the `recontent/backend/` folder with:

```env
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_supabase_service_role_key_here

OPENAI_API_KEY=sk-your_openai_api_key_here

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

YOUTUBE_API_KEY=

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Where to get your API keys:**

- **Supabase**: https://supabase.com/dashboard → Your Project → Settings → API
- **OpenAI**: https://platform.openai.com/api-keys
- **YouTube** (optional): https://console.cloud.google.com

### Step 2: Start the Application

Open **3 separate terminals**:

#### Terminal 1 - Backend Server

```bash
cd recontent/backend
npm run dev
```

Backend will run on: http://localhost:3000

#### Terminal 2 - Frontend Dev Server

```bash
cd recontent
npm run dev
```

Frontend will run on: http://localhost:5173

#### Terminal 3 - Background Workers (Optional - for processing jobs)

```bash
cd recontent/backend
npm run start:workers
```

### Step 3: Access the Application

Open your browser and go to:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/api/health

## 🔧 Useful Commands

### Check Redis Status

```bash
docker ps
```

### Stop Redis

```bash
cd recontent
docker-compose down
```

### Restart Redis

```bash
cd recontent
docker-compose restart
```

### View Redis Logs

```bash
docker logs recontent-redis
```

## 🎯 Testing the Application

1. Sign up for an account on the frontend
2. Paste a YouTube URL
3. Click "Process Video"
4. The backend will:
   - Fetch video metadata
   - Transcribe audio
   - Generate content for all platforms
   - Create thumbnails

## 📚 Project Structure

```
recontent/
├── src/                    # Frontend React app
├── backend/               # Express API server
│   └── src/
│       ├── routes/       # API endpoints
│       ├── services/     # Business logic
│       └── workers/      # Background job processors
├── docker-compose.yml    # Redis configuration
└── .env                  # Frontend environment variables
```

## 🐛 Troubleshooting

### Redis Connection Error

- Make sure Docker Desktop is running
- Check if Redis container is running: `docker ps`
- Restart Redis: `cd recontent && docker-compose restart`

### Backend Won't Start

- Verify `.env` file exists in `recontent/backend/`
- Check all required environment variables are set
- Ensure Redis is running

### Frontend Won't Start

- Verify `.env` file exists in `recontent/`
- Check Supabase credentials are correct
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

## 📞 Need Help?

Check the main README.md for detailed documentation or refer to setup-env.md for environment variable details.

---

**Ready to start?** Configure your `.env` files and run the commands above! 🚀
