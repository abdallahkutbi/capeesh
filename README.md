# Periodic-Comprehension E-Reader

A mobile iOS e-reader application that enforces reading comprehension through automatic mid-reading quizzes.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)

### Installation

1. Install dependencies:
```bash
npm install --legacy-peer-deps
```

2. Set up environment variables:
Create a `.env` file in the root directory with the following:
```bash
EXPO_PUBLIC_CONVEX_URL=your_convex_url
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
# Optional:
# EXPO_PUBLIC_OPENAI_API_KEY=your_openai_key
# EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_key
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
capeesh/
├── app/                    # Expo Router screens
│   ├── _layout.tsx        # Root layout with ClerkProvider
│   ├── index.tsx          # Welcome/auth redirect screen
│   ├── (auth)/            # Auth route group
│   │   ├── _layout.tsx    # Auth layout (protects routes)
│   │   ├── sign-in.tsx    # Sign in screen
│   │   └── sign-up.tsx    # Sign up screen with email verification
│   ├── library.tsx        # Home/library screen
│   ├── reader.tsx         # Book reader screen
│   └── settings.tsx        # Settings screen
├── components/            # React components
│   ├── library/           # Library components
│   ├── reader/            # Reader components
│   └── ui/                # Shared UI components (shadcn-style)
│       ├── button.tsx     # Button component with variants
│       ├── card.tsx       # Card components
│       ├── input.tsx      # Input component
│       ├── label.tsx      # Label component
│       ├── index.ts       # Component exports
│       ├── ProtectedRoute.tsx
│       └── SignOutButton.tsx
├── convex/                # Convex backend
│   ├── schema.ts          # Database schema
│   ├── books.ts           # Books API
│   ├── quizzes.ts         # Quizzes API
│   ├── readingSessions.ts # Reading sessions API
│   ├── userProgress.ts    # User progress API
│   └── storage.ts         # File storage
├── lib/                   # Utility modules
│   ├── epub/              # EPUB processing
│   │   ├── parser.ts
│   │   ├── paginator.ts
│   │   └── upload.ts
│   └── quiz/              # Quiz generation
│       ├── generator.ts
│       └── validator.ts
├── assets/                # App assets (icons, splash screens)
└── designs/               # Design reference images
```

## 🛠 Tech Stack

- **Framework**: Expo SDK 54 (React Native 0.81.5)
- **Database**: Convex
- **Auth**: Clerk (@clerk/clerk-expo) with secure token cache
- **UI**: NativeWind v4 (Tailwind CSS v3) with shadcn-style components
- **LLM**: OpenAI for quiz generation
- **Routing**: Expo Router v6
- **Animations**: React Native Reanimated v4

## ✅ Current Implementation Status

- ✅ Expo SDK 54 setup
- ✅ Clerk authentication with email/password
- ✅ Secure token storage (expo-secure-store)
- ✅ Auth route protection
- ✅ Sign up with email verification
- ✅ Sign in flow
- ✅ Sign out functionality
- ✅ Convex database schema
- ✅ Project structure and routing
- ✅ shadcn-style UI components (Button, Card, Input, Label)

## 🎨 UI Components

The project uses shadcn-inspired components built with NativeWind and React Native:

- **Button**: Variants include `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`
- **Card**: Includes `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`
- **Input**: Styled text input with placeholder support
- **Label**: Form label component

All components are located in `components/ui/` and can be imported from `@/components/ui` or `components/ui/index.ts`.

## 📋 Next Steps

See `PROJECT.md` for the complete implementation plan organized by screen flow.

## 🔀 Git Workflow & Commands

### Branch Naming Conventions

- **Feature branches**: `feat/feature-name`
- **Bug fix branches**: `fix/bug-description`
- **Hotfix branches**: `hotfix/issue-description`
- **Refactor branches**: `refactor/component-name`
- **Chore branches**: `chore/task-description`

### Useful Git Commands

#### Creating and Switching Branches

```bash
# Create and switch to a new feature branch
git checkout -b feat/reader-pagination

# Create and switch to a new bug fix branch
git checkout -b fix/auth-token-expiry

# Switch to an existing branch
git checkout main
git checkout feat/reader-pagination

# List all branches
git branch -a

# Delete a local branch
git branch -d feat/old-feature

# Delete a remote branch
git push origin --delete feat/old-feature
```

#### Daily Workflow

```bash
# Check current status
git status

# See what branch you're on
git branch

# Pull latest changes from main
git checkout main
git pull origin main

# Start a new feature
git checkout -b feat/library-search
# ... make your changes ...

# Stage all changes
git add .

# Stage specific files
git add app/library.tsx components/library/BookList.tsx

# Commit with conventional commit message
git commit -m "feat(library): add search functionality"

# Push branch to remote
git push origin feat/library-search

# Push and set upstream (first time)
git push -u origin feat/library-search
```

#### Syncing with Main Branch

```bash
# Update your feature branch with latest main
git checkout feat/your-feature
git pull origin main
# Resolve any conflicts if needed
git push origin feat/your-feature

# Or rebase instead of merge
git checkout feat/your-feature
git rebase main
git push origin feat/your-feature --force-with-lease
```

#### Viewing Changes

```bash
# See what files changed
git diff

# See staged changes
git diff --staged

# See commit history
git log --oneline

# See changes in a specific file
git diff app/library.tsx

# See who changed what
git blame components/ui/button.tsx
```

#### Undoing Changes

```bash
# Unstage files (keep changes)
git reset HEAD app/library.tsx

# Discard changes in working directory
git checkout -- app/library.tsx

# Discard all uncommitted changes
git reset --hard HEAD

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1
```

#### Stashing Changes

```bash
# Save current changes temporarily
git stash

# Save with a message
git stash save "WIP: working on reader component"

# List stashes
git stash list

# Apply most recent stash
git stash pop

# Apply specific stash
git stash apply stash@{0}

# Delete a stash
git stash drop stash@{0}

# Clear all stashes
git stash clear
```

#### Merging and Pull Requests

```bash
# Merge feature branch into main (after PR approval)
git checkout main
git pull origin main
git merge feat/your-feature
git push origin main

# Delete feature branch after merge
git branch -d feat/your-feature
git push origin --delete feat/your-feature
```

#### Common Workflows

**Starting a new feature:**
```bash
git checkout main
git pull origin main
git checkout -b feat/library-search
# Make changes
git add .
git commit -m "feat(library): add search functionality"
git push -u origin feat/library-search
```

**Adding a new UI component:**
```bash
git checkout main
git pull origin main
git checkout -b feat/ui-add-dialog-component
# Create components/ui/dialog.tsx
git add components/ui/dialog.tsx components/ui/index.ts
git commit -m "feat(ui): add dialog component"
git push -u origin feat/ui-add-dialog-component
```

**Creating a new screen:**
```bash
git checkout main
git pull origin main
git checkout -b feat/reader-screen
# Create app/reader.tsx and related components
git add app/reader.tsx components/reader/
git commit -m "feat(reader): implement reader screen with pagination"
git push -u origin feat/reader-screen
```

**Fixing a bug:**
```bash
git checkout main
git pull origin main
git checkout -b fix/auth-token-expiry
# Fix the bug
git add app/(auth)/sign-in.tsx
git commit -m "fix(auth): handle expired token refresh"
git push -u origin fix/auth-token-expiry
```

**Hotfix (urgent bug fix):**
```bash
git checkout main
git pull origin main
git checkout -b hotfix/critical-auth-bug
# Fix critical bug
git add .
git commit -m "fix(auth): resolve critical authentication issue"
git push -u origin hotfix/critical-auth-bug
# After merge, also merge back to main
```

**Refactoring code:**
```bash
git checkout main
git pull origin main
git checkout -b refactor/reader-pagination-logic
# Refactor code without changing functionality
git add lib/epub/paginator.ts components/reader/
git commit -m "refactor(reader): extract pagination logic to separate hook"
git push -u origin refactor/reader-pagination-logic
```

**Working with multiple commits:**
```bash
git checkout -b feat/quiz-modal
# Make first set of changes
git add components/reader/QuizModal.tsx
git commit -m "feat(quiz): create quiz modal component"

# Make second set of changes
git add app/reader.tsx
git commit -m "feat(quiz): integrate quiz modal into reader"

# Make third set of changes
git add lib/quiz/validator.ts
git commit -m "feat(quiz): add answer validation logic"

# Push all commits
git push -u origin feat/quiz-modal
```

**Updating a feature branch with latest main:**
```bash
# While on your feature branch
git checkout feat/library-search
git fetch origin
git merge origin/main
# Resolve conflicts if any
git push origin feat/library-search
```

**Updating dependencies:**
```bash
git checkout main
git pull origin main
git checkout -b chore/update-dependencies
npm install --legacy-peer-deps
git add package.json package-lock.json
git commit -m "chore(deps): update expo to 54.0.0"
git push -u origin chore/update-dependencies
```

**Adding documentation:**
```bash
git checkout -b docs/update-readme-git-workflow
# Update README.md
git add README.md
git commit -m "docs(readme): add git workflow commands section"
git push -u origin docs/update-readme-git-workflow
```

**Styling/formatting changes:**
```bash
git checkout -b style/format-components
# Run formatter or fix styling
git add components/
git commit -m "style(components): format code with prettier"
git push -u origin style/format-components
```

**Performance improvements:**
```bash
git checkout -b perf/optimize-epub-parsing
# Optimize code
git add lib/epub/parser.ts
git commit -m "perf(epub): optimize EPUB parsing performance"
git push -u origin perf/optimize-epub-parsing
```

## 📝 Git Commit Conventions

When creating or editing features, bug fixes, or making any changes, please follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **`feat`**: A new feature
  - Example: `feat(auth): add email verification flow`
  - Example: `feat(reader): implement pagination controls`

- **`fix`**: A bug fix
  - Example: `fix(auth): resolve token expiration issue`
  - Example: `fix(ui): correct button styling on iOS`

- **`docs`**: Documentation only changes
  - Example: `docs(readme): update installation instructions`

- **`style`**: Code style changes (formatting, missing semi colons, etc.)
  - Example: `style(components): format code with prettier`

- **`refactor`**: Code refactoring without feature changes or bug fixes
  - Example: `refactor(reader): extract pagination logic to separate hook`

- **`perf`**: Performance improvements
  - Example: `perf(reader): optimize EPUB parsing performance`

- **`test`**: Adding or updating tests
  - Example: `test(auth): add unit tests for sign-in flow`

- **`chore`**: Changes to build process or auxiliary tools
  - Example: `chore(deps): update expo to 54.0.0`
  - Example: `chore(config): update babel configuration`

- **`ci`**: CI/CD changes
  - Example: `ci(github): add automated testing workflow`

### Scope (Optional)

The scope should be the name of the package/area affected:
- `auth` - Authentication related
- `reader` - Book reader functionality
- `ui` - UI components
- `library` - Library/book management
- `quiz` - Quiz system
- `epub` - EPUB processing
- `convex` - Backend/database

### Examples

```bash
# New feature
git commit -m "feat(reader): add swipe gesture navigation"

# Bug fix
git commit -m "fix(auth): handle expired token refresh"

# Feature with body
git commit -m "feat(library): add book search functionality

- Implement search input component
- Add search filtering logic
- Update BookList to show filtered results"

# Bug fix with breaking change
git commit -m "fix(api): update quiz generation endpoint

BREAKING CHANGE: quiz endpoint now requires bookId parameter"
```

### Best Practices

- Use the imperative mood ("add" not "added" or "adds")
- Keep the subject line under 72 characters
- Capitalize the first letter of the subject
- Don't end the subject with a period
- Use the body to explain what and why vs. how
- Reference issues and pull requests in the footer

## 📝 License

Private project
