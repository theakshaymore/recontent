# ReContent AI

> Transform your YouTube videos into engaging content across multiple platforms with AI-powered automation.

ReContent AI is an intelligent content repurposing platform that takes your YouTube videos and automatically generates optimized content for various social media platforms and formats. Powered by OpenAI's GPT-4, it creates YouTube Shorts scripts, blog posts, Twitter threads, LinkedIn carousels, Instagram captions, and custom thumbnails.

## ✨ Features

- 🎥 **YouTube Video Processing** - Fetch and process videos directly from YouTube URLs
- 📝 **AI Transcription** - Automatic video-to-text transcription
- ✂️ **YouTube Shorts Generator** - Create 3-5 viral short-form video scripts (30-60 seconds)
- 📰 **Blog Post Creation** - Generate SEO-optimized blog posts (1500-2000 words)
- 🐦 **Twitter Thread Builder** - Craft engaging Twitter threads (7-10 tweets)
- 💼 **LinkedIn Carousel Designer** - Professional 10-slide carousel content
- 📸 **Instagram Caption Writer** - Multiple caption variations with hashtags
- 🖼️ **Thumbnail Generation** - AI-powered custom thumbnails
- ⚡ **Queue-Based Processing** - Efficient background job handling with Bull and Redis
- 🔐 **Secure Authentication** - Supabase-powered user management
- 🎨 **Modern UI** - Beautiful, responsive interface with shadcn/ui components

## 🛠️ Tech Stack

### Frontend

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Routing**: React Router v6
- **Authentication**: Supabase Auth
- **Form Handling**: React Hook Form + Zod validation

### Backend

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **AI**: OpenAI GPT-4o-mini
- **Database**: Supabase (PostgreSQL)
- **Queue System**: Bull with Redis
- **Logging**: Winston
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: Joi

## 🏗️ Architecture

```
┌─────────────┐
│   Frontend  │ (React + Vite)
│   (Port:    │
│    5173)    │
└──────┬──────┘
       │
       │ HTTP/REST
       │
┌──────▼──────┐
│   Backend   │ (Express API)
│   (Port:    │
│    3000)    │
└──────┬──────┘
       │
       ├─────────► Supabase (Database + Auth)
       │
       ├─────────► OpenAI API (GPT-4)
       │
       └─────────► Redis (Queue Management)
                         │
                         ▼
                  ┌──────────────┐
                  │   Workers    │
                  ├──────────────┤
                  │ Transcription│
                  │ Shorts       │
                  │ Blog         │
                  │ Twitter      │
                  │ LinkedIn     │
                  │ Instagram    │
                  │ Thumbnail    │
                  └──────────────┘
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn** or **bun**
- **Redis** (for queue management)
- **Git**

You'll also need accounts for:

- [Supabase](https://supabase.com) - Database and authentication
- [OpenAI](https://platform.openai.com) - AI content generation
- [YouTube Data API](https://console.cloud.google.com) - Video fetching (optional)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <YOUR_GIT_URL>
cd ReContentAI/recontent
```

### 2. Install Frontend Dependencies

```bash
# In the root directory (recontent/)
npm install
```

### 3. Install Backend Dependencies

```bash
# Navigate to backend directory
cd backend
npm install
cd ..
```

### 4. Set Up Supabase

1. Create a new project on [Supabase](https://supabase.com)
2. Run the migrations in `supabase/migrations/` to set up your database schema
3. Enable authentication providers you want to use
4. Copy your project URL and anon key

### 5. Set Up Redis

**Option 1: Local Redis**

```bash
# macOS
brew install redis
brew services start redis

# Ubuntu/Debian
sudo apt-get install redis-server
sudo systemctl start redis

# Windows
# Download from https://redis.io/download
```

**Option 2: Cloud Redis**

- Use [Redis Cloud](https://redis.com/cloud/), [Upstash](https://upstash.com), or similar

## ⚙️ Environment Variables

### Frontend Environment Variables

Create a `.env` file in the `recontent/` directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Backend API URL
VITE_API_URL=http://localhost:3000
```

### Backend Environment Variables

Create a `.env` file in the `recontent/backend/` directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_supabase_service_role_key

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
# For cloud Redis, use full connection string:
# REDIS_URL=redis://username:password@host:port

# YouTube API (Optional)
YOUTUBE_API_KEY=your_youtube_api_key

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🎯 Running the Application

### Development Mode

**Terminal 1 - Start Redis** (if running locally):

```bash
redis-server
```

**Terminal 2 - Start Backend**:

```bash
cd recontent/backend
npm run dev
```

**Terminal 3 - Start Frontend**:

```bash
cd recontent
npm run dev
```

The application will be available at:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000

### Production Build

**Build Frontend**:

```bash
cd recontent
npm run build
npm run preview
```

**Build Backend**:

```bash
cd recontent/backend
npm run build
npm start
```

**Start Workers** (separate process):

```bash
cd recontent/backend
npm run start:workers
```

## 📁 Project Structure

```
recontent/
├── src/                          # Frontend source code
│   ├── components/              # React components
│   │   ├── ui/                 # shadcn/ui components
│   │   └── dashboard/          # Dashboard-specific components
│   ├── pages/                  # Page components
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utility functions
│   ├── stores/                 # Zustand stores
│   ├── types/                  # TypeScript types
│   └── integrations/           # Third-party integrations
│       └── supabase/           # Supabase client
├── backend/                     # Backend source code
│   └── src/
│       ├── config/             # Configuration files
│       ├── middleware/         # Express middleware
│       ├── routes/             # API routes
│       ├── services/           # Business logic
│       ├── workers/            # Background job processors
│       ├── types/              # TypeScript types
│       └── utils/              # Utility functions
├── supabase/                    # Supabase configuration
│   ├── migrations/             # Database migrations
│   └── functions/              # Edge functions
└── public/                      # Static assets
```

## 🔌 API Endpoints

### Health Check

- `GET /api/health` - Server health status

### Videos

- `POST /api/videos/process` - Process a YouTube video
- `GET /api/videos/:id` - Get video details
- `GET /api/videos` - List all videos

### Content

- `GET /api/content/:videoId/shorts` - Get generated shorts
- `GET /api/content/:videoId/blog` - Get generated blog post
- `GET /api/content/:videoId/twitter` - Get Twitter thread
- `GET /api/content/:videoId/linkedin` - Get LinkedIn carousel
- `GET /api/content/:videoId/instagram` - Get Instagram captions
- `GET /api/content/:videoId/thumbnail` - Get generated thumbnail

## ⚙️ Workers

The application uses Bull queues with Redis for background job processing:

| Worker                   | Purpose                          | Queue Name      |
| ------------------------ | -------------------------------- | --------------- |
| **Transcription Worker** | Converts video audio to text     | `transcription` |
| **Shorts Worker**        | Generates YouTube Shorts scripts | `shorts`        |
| **Blog Worker**          | Creates SEO-optimized blog posts | `blog`          |
| **Twitter Worker**       | Builds Twitter threads           | `twitter`       |
| **LinkedIn Worker**      | Designs LinkedIn carousels       | `linkedin`      |
| **Instagram Worker**     | Writes Instagram captions        | `instagram`     |
| **Thumbnail Worker**     | Generates custom thumbnails      | `thumbnail`     |

Each worker processes jobs independently and updates the database upon completion.

## 🎨 UI Components

The project uses [shadcn/ui](https://ui.shadcn.com/) components built on top of Radix UI primitives. All components are:

- Fully accessible (ARIA compliant)
- Customizable with Tailwind CSS
- Type-safe with TypeScript
- Dark mode compatible

## 🔒 Security Features

- **Helmet.js** - Security headers
- **CORS** - Cross-origin resource sharing protection
- **Rate Limiting** - API request throttling
- **Input Validation** - Joi schema validation
- **Authentication** - Supabase Auth with JWT
- **Environment Variables** - Sensitive data protection

## 🧪 Testing

```bash
# Frontend tests
cd recontent
npm run test

# Backend tests
cd recontent/backend
npm run test
```

## 📝 Scripts

### Frontend Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend Scripts

```bash
npm run dev          # Start development server with nodemon
npm run build        # Compile TypeScript
npm run start        # Start production server
npm run start:workers # Start background workers
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [OpenAI](https://openai.com) for GPT-4 API
- [Supabase](https://supabase.com) for backend infrastructure
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Bull](https://github.com/OptimalBits/bull) for queue management

## 📧 Support

For support, email support@recontentai.com or open an issue in the repository.

---

**Built with ❤️ using React, TypeScript, and AI**
