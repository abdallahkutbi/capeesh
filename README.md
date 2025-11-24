# Periodic-Comprehension E-Reader

A mobile iOS e-reader application that enforces reading comprehension through automatic mid-reading quizzes.

## 🚀 Getting Started

This is the initialization version of the project. Features will be implemented incrementally.

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Fill in your keys:
# - EXPO_PUBLIC_CONVEX_URL
# - EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY
# - EXPO_PUBLIC_OPENAI_API_KEY
```

3. Initialize Convex:
```bash
npx convex dev
```

4. Start the Expo development server:
```bash
npm start
```

## 📁 Project Structure

```
capish/
├── app/                    # Expo Router screens
│   ├── _layout.tsx        # Root layout
│   ├── index.tsx          # Welcome/auth screen
│   ├── sign-in.tsx        # Sign in screen
│   ├── sign-up.tsx        # Sign up screen
│   ├── library.tsx        # Home/library screen
│   ├── reader.tsx         # Book reader screen
│   └── settings.tsx       # Settings screen
├── components/            # React components
│   ├── library/           # Library components
│   ├── reader/            # Reader components
│   └── ui/                # Shared UI components
├── convex/                # Convex backend
│   ├── schema.ts          # Database schema
│   └── ...                # API functions
├── lib/                   # Utility modules
│   ├── epub/              # EPUB processing
│   └── quiz/              # Quiz generation
└── designs/               # Design reference images
```

## 🛠 Tech Stack

- **Framework**: Expo (React Native) for iOS
- **Database**: Convex
- **Auth**: Clerk
- **UI**: NativeWind (Tailwind CSS)
- **LLM**: OpenAI/Anthropic for quiz generation

## 📋 Implementation Status

This is the initialization version. See `PROJECT.md` for the complete implementation plan organized by screen flow.

## 📝 License

Private project
