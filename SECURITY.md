# My Offline Gym

A React-based offline gym tracking application with Docker support.

## 🔒 Security Notice

**IMPORTANT:** This project uses Supabase for authentication and data storage. API keys are stored in environment variables.

### Environment Variables Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   ```

3. **NEVER commit the `.env` file to Git!** It's already in `.gitignore`.

## 🚀 Development

### Prerequisites
- Node.js 18+ or Bun
- Docker (optional, for containerized deployment)

### Run Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will run on `http://localhost:8080`

## 🐳 Docker Deployment

### Build Docker Image

```bash
docker build -t my-offline-gym:latest .
```

### Run Docker Container

```bash
docker run -d -p 80:80 --name my-offline-gym my-offline-gym:latest
```

Access the app at `http://localhost`

### Docker Commands

```bash
# View running containers
docker ps

# Stop container
docker stop my-offline-gym

# Start container
docker start my-offline-gym

# View logs
docker logs my-offline-gym

# Remove container
docker rm my-offline-gym
```

## 📁 Project Structure

```
my-offline-gym/
├── src/
│   ├── components/      # React components
│   ├── integrations/    # Supabase integration
│   ├── pages/          # Page components
│   └── hooks/          # Custom hooks
├── Dockerfile          # Docker configuration
├── nginx.conf          # Nginx configuration for production
└── .env.example        # Environment variables template
```

## 🛡️ Before Pushing to GitHub

- ✅ Ensure `.env` is in `.gitignore`
- ✅ Never commit API keys or secrets
- ✅ Use `.env.example` for documentation
- ✅ Review changes with `git diff` before committing

## 📝 License

MIT
