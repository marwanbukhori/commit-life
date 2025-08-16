# 🚀 Commit Life - Habit Tracking App

A GitHub-style habit tracking mobile app built with React Native, Expo, and Supabase. Track your daily actions across life pillars and visualize your progress with beautiful heatmaps.

## 🎯 Features

- **Life Pillars**: Organize habits into meaningful categories (Health, Career, Spiritual, etc.)
- **Daily Commits**: Log actions and build streaks like GitHub contributions
- **GitHub-style Heatmap**: Visualize your commitment journey
- **Progress Tracking**: Monthly summaries and streak tracking
- **Beautiful UI**: Modern design with Tailwind RN styling
- **Cross-platform**: iOS and Android support

## 🏗️ Tech Stack

- **Frontend**: React Native with Expo
- **UI**: NativeWind (Tailwind for React Native)
- **State Management**: Zustand
- **Backend**: Supabase (Database, Auth, API)
- **Navigation**: Expo Router
- **TypeScript**: Full type safety

## 🚀 Quick Start

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

3. **Start the development server**

   ```bash
   npx expo start
   ```

4. **Open the app**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app for physical device

## 📱 App Structure

```
app/
├── (auth)/              # Authentication screens
│   ├── login.tsx
│   └── signup.tsx
├── (tabs)/              # Main app tabs
│   ├── index.tsx        # Dashboard
│   ├── pillars.tsx      # Pillars management
│   ├── heatmap.tsx      # Progress visualization
│   └── profile.tsx      # User profile
components/              # Reusable UI components
├── CommitHeatmap.tsx    # GitHub-style heatmap
├── PillarCard.tsx       # Pillar display component
├── AuthGuard.tsx        # Route protection
└── ...
stores/                  # Zustand state management
├── auth-store.ts        # Authentication state
└── app-store.ts         # App data state
lib/                     # Utilities and types
├── types.ts             # TypeScript definitions
├── supabase.ts          # Supabase client
├── api.ts               # API functions
└── sample-data.ts       # Development data
```

## 🗄️ Database Schema

The app uses Supabase with the following main tables:

- **users**: User accounts and profiles
- **pillars**: Life areas/categories for habits
- **habits**: Individual habits within pillars
- **actions**: Daily commits/logs for habits
- **summaries**: Monthly aggregated statistics

## 🔧 Development

### Sample Data

The app includes sample data for development. It automatically loads when you first open the app.

### Supabase Setup

1. Create a new Supabase project
2. Run the SQL migrations in `supabase/migrations/` (to be created)
3. Update your `.env` file with the project URL and anon key

### Building for Production

```bash
# Build for iOS
npx expo build:ios

# Build for Android
npx expo build:android
```

## 🎨 Design Philosophy

- **GitHub-inspired**: Familiar contribution visualization
- **Life-focused**: Organized around life pillars rather than arbitrary categories
- **Motivational**: Streaks and visual progress encourage consistency
- **Clean & Modern**: Minimalist design that doesn't distract from the goal

## 📊 Coming Soon

- [ ] Supabase database integration
- [ ] Real-time sync
- [ ] Push notifications
- [ ] Export/sharing features
- [ ] Advanced analytics
- [ ] Team/family sharing

## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome!

---

Built with ❤️ for better habits and a more intentional life.
