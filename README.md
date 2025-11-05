# 🏋️ My Offline Gym

A modern, offline-first gym tracking application built with React, TypeScript, and Supabase. Track your workouts, nutrition, hydration, and progress with a beautiful, responsive interface — all while working seamlessly offline!

## 📸 Screenshots

![App Screenshot](image/Screenshot-2025-11-05%20231902.png)

## ✨ Features

- 💪 **Workout Tracking** - Log exercises, sets, reps, and weight
- 🥗 **Nutrition Monitoring** - Track calories, macros, and meals
- 💧 **Hydration Tracking** - Monitor daily water intake
- 📊 **Progress Analytics** - Visualize your fitness journey with charts
- 🔐 **User Authentication** - Secure login with Supabase Auth
- 🌐 **Offline Support** - Works without internet connection using local storage
- 🎨 **Modern UI** - Built with Shadcn/UI and Tailwind CSS
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ or Bun
- Docker (optional, for containerized deployment)
- Supabase account (for authentication)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/purplepot/my-offline-gym-main.git
   cd my-offline-gym-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:8080`

## 🐳 Docker Deployment

### Build and Run with Docker

1. **Build the Docker image**
   ```bash
   docker build -t my-offline-gym:latest .
   ```

2. **Run the container**
   ```bash
   docker run -d -p 80:80 --name my-offline-gym my-offline-gym:latest
   ```

3. **Access the app**
   
   Open `http://localhost` in your browser

### Docker Commands Reference

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

# Remove image
docker rmi my-offline-gym:latest
```

## 📂 Folder Structure

```
my-offline-gym-main/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # Shadcn/UI components
│   │   ├── Dashboard.tsx   # Main dashboard
│   │   ├── WorkoutSection.tsx
│   │   ├── NutritionSection.tsx
│   │   ├── HydrationSection.tsx
│   │   └── ProgressSection.tsx
│   ├── pages/              # Page components
│   │   ├── Index.tsx       # Home page
│   │   ├── Auth.tsx        # Authentication page
│   │   └── NotFound.tsx
│   ├── hooks/              # Custom React hooks
│   │   ├── useAuth.tsx     # Authentication hook
│   │   └── use-toast.ts    # Toast notifications
│   ├── integrations/       # External service integrations
│   │   └── supabase/       # Supabase client & types
│   ├── lib/                # Utility functions
│   │   ├── localStorage.ts # Local storage helpers
│   │   └── utils.ts        # General utilities
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Entry point
├── public/                 # Static assets
├── supabase/              # Supabase migrations
├── Dockerfile             # Docker configuration
├── nginx.conf             # Nginx configuration
├── .env.example           # Environment variables template
├── .gitignore             # Git ignore rules
├── .dockerignore          # Docker ignore rules
├── package.json           # Dependencies
├── vite.config.ts         # Vite configuration
├── tailwind.config.ts     # Tailwind CSS configuration
└── README.md              # This file
```

## 🧠 Planned Features / Roadmap

| Phase | Feature | Status |
|-------|---------|--------|
| 1.0 | Basic workout logging, local storage | ✅ Done |
| 1.1 | Progress charts + analytics | ✅ Done |
| 1.2 | Nutrition & hydration tracking | ✅ Done |
| 1.3 | Export & backup data | 🔲 Upcoming |
| 2.0 | Template routines + scheduling | 🔲 Upcoming |
| 2.1 | Dark mode + custom themes | 🔲 Upcoming |
| 2.2 | Exercise library with demos | 🔲 Upcoming |
| 3.0 | Social features & sharing | 🔲 Future |
| 3.1 | AI-powered workout suggestions | 🔲 Future |

*(Feel free to contribute — see [Contributing](#-contributing) below.)*

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Components**: Shadcn/UI + Radix UI
- **Styling**: Tailwind CSS
- **State Management**: React Query (TanStack Query)
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **Routing**: React Router v6
- **Deployment**: Docker + Nginx

## 🔒 Security

- ✅ Environment variables for sensitive data
- ✅ `.env` files excluded from Git
- ✅ Supabase Row Level Security (RLS)
- ✅ Secure authentication flow
- ✅ Local storage encryption for offline data

**Important**: Never commit your `.env` file! Use `.env.example` as a template.

See [SECURITY.md](SECURITY.md) for more details.

## 🤝 Contributing

Thank you for your interest in contributing! We welcome contributions from the community.

### How to Contribute

1. **Fork the repository**
   
   Click the "Fork" button at the top right of this page

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/my-offline-gym-main.git
   cd my-offline-gym-main
   ```

3. **Create a new branch**
   ```bash
   git checkout -b feature/my-awesome-feature
   ```

4. **Make your changes**
   
   - Follow the existing code style
   - Add tests if applicable
   - Update documentation as needed

5. **Commit your changes**
   ```bash
   git commit -m "Add: my awesome feature"
   ```

6. **Push to your branch**
   ```bash
   git push origin feature/my-awesome-feature
   ```

7. **Open a Pull Request**
   
   Go to the original repository and click "New Pull Request"

### Contribution Guidelines

- Write clear, descriptive commit messages
- Follow the existing code structure and naming conventions
- Test your changes thoroughly
- Update the README if you add new features
- Be respectful and constructive in discussions

## 📜 Scripts

```bash
# Development
npm run dev          # Start dev server (port 8080)

# Build
npm run build        # Build for production
npm run build:dev    # Build for development

# Preview
npm run preview      # Preview production build

# Linting
npm run lint         # Run ESLint
```

## 🐛 Known Issues

- None currently reported

Found a bug? [Open an issue](https://github.com/purplepot/my-offline-gym-main/issues)

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

## 📬 Contact & Support

- **GitHub**: [@purplepot](https://github.com/purplepot)
- **Issues**: [Report a bug or request a feature](https://github.com/purplepot/my-offline-gym-main/issues)
- **Discussions**: [Join the conversation](https://github.com/purplepot/my-offline-gym-main/discussions)

---

⭐ **If you find this project helpful, please give it a star!** ⭐

Made with 💪 and ❤️ for fitness enthusiasts




