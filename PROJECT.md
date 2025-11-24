# Periodic-Comprehension E-Reader - Project Management

## Project Description

A mobile iOS e-reader application that enforces reading comprehension through automatic mid-reading quizzes. The app replicates the visual and interaction style of Kindle or Apple Books while intercepting navigation after a fixed number of pages to present comprehension quizzes generated from the recently read text. Users cannot continue reading until completing the quiz.

## Tech Stack

- **Framework**: Expo (React Native) for iOS
- **Database**: Convex
- **Auth**: Clerk (@clerk/expo)
- **UI**: NativeWind (Tailwind for React Native)
- **LLM**: Cloud API (OpenAI/Anthropic)
- **EPUB**: react-native-epub or epubjs with WebView
- **Build**: Expo EAS Build

---

## Screen Flow & Implementation Order

### Screen 1: Welcome/Auth Screen
**Files**: `app/index.tsx`, `app/sign-in.tsx`, `app/sign-up.tsx`

#### Tasks:
- [ ] Create welcome/landing screen (`app/index.tsx`)
- [ ] Implement sign-in screen with email/password form (`app/sign-in.tsx`)
- [ ] Implement sign-up screen with email verification (`app/sign-up.tsx`)
- [ ] Add navigation between sign-in and sign-up
- [ ] Integrate Clerk authentication hooks
- [ ] Handle authentication state (loading, error, success)
- [ ] Redirect authenticated users to home/library

**Acceptance Criteria**:
- Users can sign up with email
- Users can sign in with credentials
- Auth state persists across app restarts
- Proper error handling and user feedback

---

### Screen 2: Home/Library Screen
**Files**: `app/library.tsx`, `components/library/BookList.tsx`, `components/library/BookUpload.tsx`

#### Tasks:
- [ ] Create library/home screen layout (`app/library.tsx`)
- [ ] Implement book list component (`components/library/BookList.tsx`)
- [ ] Display uploaded books with covers/metadata
- [ ] Show reading progress per book
- [ ] Implement book upload component (`components/library/BookUpload.tsx`)
- [ ] Add file picker for EPUB files
- [ ] Handle empty state (no books)
- [ ] Add navigation to reader screen
- [ ] Add navigation to settings
- [ ] Implement sign-out functionality

**Acceptance Criteria**:
- Books display in organized list/grid
- Can upload EPUB files
- Can navigate to reader from book list
- Progress visible at a glance
- Empty state shows when no books

---

### Screen 3: Book Reader Screen
**Files**: `app/reader.tsx`, `components/reader/PaginatedReader.tsx`, `components/reader/PageRenderer.tsx`

#### Tasks:
- [ ] Create reader screen container (`app/reader.tsx`)
- [ ] Implement paginated reader component (`components/reader/PaginatedReader.tsx`)
- [ ] Add swipe gesture navigation (left/right)
- [ ] Implement page renderer component (`components/reader/PageRenderer.tsx`)
- [ ] Add typography matching Kindle/Apple Books
- [ ] Implement page tracking and progress bar
- [ ] Add reading theme support (light/dark/sepia)
- [ ] Handle EPUB file loading and parsing
- [ ] Implement pagination algorithm
- [ ] Add chapter navigation
- [ ] Save reading position to Convex
- [ ] Restore reading position on app restart

**Acceptance Criteria**:
- Text renders beautifully with proper typography
- Swipe gestures work smoothly
- Page transitions feel natural
- Reading position persists
- Themes apply correctly

---

### Screen 4: Quiz Modal Screen
**Files**: `components/reader/QuizModal.tsx`, `lib/quiz/generator.ts`, `lib/quiz/validator.ts`

#### Tasks:
- [ ] Create quiz modal component (`components/reader/QuizModal.tsx`)
- [ ] Implement fullscreen blocking modal
- [ ] Display quiz questions one at a time
- [ ] Add answer selection UI (multiple choice)
- [ ] Implement question navigation (next/previous)
- [ ] Add quiz submission logic
- [ ] Create quiz generator module (`lib/quiz/generator.ts`)
- [ ] Integrate OpenAI API for question generation
- [ ] Create quiz validator module (`lib/quiz/validator.ts`)
- [ ] Show quiz results screen
- [ ] Display correct/incorrect answers
- [ ] Implement retry functionality
- [ ] Block reader navigation until quiz complete
- [ ] Save quiz results to Convex

**Acceptance Criteria**:
- Quiz modal is fullscreen and blocking
- Questions display clearly
- Answers can be selected
- Results shown immediately after submission
- Retry works with new questions
- Results saved to database
- Navigation blocked until completion

---

### Screen 5: Settings Screen
**Files**: `app/settings.tsx`

#### Tasks:
- [ ] Create settings screen layout (`app/settings.tsx`)
- [ ] Add quiz interval configuration (per book)
- [ ] Add font size adjustment
- [ ] Add reading theme selection
- [ ] Add LLM provider selection
- [ ] Implement settings persistence
- [ ] Add account settings section
- [ ] Add app version and about info

**Acceptance Criteria**:
- Settings save correctly
- Quiz intervals configurable per book
- Preferences apply immediately
- Settings persist across sessions

---

## Backend Implementation (Convex)

### Database Schema
**Files**: `convex/schema.ts`

#### Tasks:
- [ ] Define books table schema
- [ ] Define readingSessions table schema
- [ ] Define quizzes table schema
- [ ] Define userProgress table schema
- [ ] Add proper indexes for queries
- [ ] Test schema validation

---

### Books API
**Files**: `convex/books.ts`

#### Tasks:
- [ ] Create book mutation (create)
- [ ] Create book query (getByUser, getById)
- [ ] Implement update quiz interval mutation
- [ ] Add book deletion (optional)

---

### Reading Sessions API
**Files**: `convex/readingSessions.ts`

#### Tasks:
- [ ] Create session mutation (create)
- [ ] Create session query (getByUserAndBook)
- [ ] Implement update progress mutation
- [ ] Add session cleanup (optional)

---

### Quizzes API
**Files**: `convex/quizzes.ts`

#### Tasks:
- [ ] Create quiz mutation (create)
- [ ] Create quiz query (getById, getBySession)
- [ ] Implement submit answers mutation
- [ ] Add quiz result calculation

---

### User Progress API
**Files**: `convex/userProgress.ts`

#### Tasks:
- [ ] Create progress query (getByUserAndBook)
- [ ] Implement update progress mutation
- [ ] Implement update quiz score mutation
- [ ] Add progress analytics queries

---

## Core Utilities

### EPUB Parser
**Files**: `lib/epub/parser.ts`

#### Tasks:
- [ ] Implement EPUB file parsing
- [ ] Extract book metadata (title, author, cover)
- [ ] Extract chapter structure
- [ ] Extract and clean text content
- [ ] Handle EPUB format variations
- [ ] Add error handling for corrupted files

---

### EPUB Paginator
**Files**: `lib/epub/paginator.ts`

#### Tasks:
- [ ] Design pagination algorithm
- [ ] Implement text splitting by pages
- [ ] Handle word boundaries
- [ ] Calculate page breaks based on screen size
- [ ] Implement text extraction from page range

---

### EPUB Upload
**Files**: `lib/epub/upload.ts`, `convex/storage.ts`

#### Tasks:
- [ ] Implement file upload to Convex storage
- [ ] Create book record after upload
- [ ] Handle upload progress
- [ ] Add error handling for upload failures

---

## Shared Components

### Protected Route
**Files**: `components/ui/ProtectedRoute.tsx`

#### Tasks:
- [ ] Create protected route wrapper
- [ ] Check authentication state
- [ ] Redirect to sign-in if not authenticated
- [ ] Show loading state during auth check

---

## Sprint Organization

### Sprint 1: Foundation & Auth
- Welcome/Auth Screen
- Basic app structure
- Clerk integration
- Protected routes

### Sprint 2: Library & Upload
- Home/Library Screen
- Book upload
- Book list display
- Basic navigation

### Sprint 3: Reading Experience
- Book Reader Screen
- EPUB parsing
- Pagination
- Reading UI

### Sprint 4: Quiz System
- Quiz Modal Screen
- LLM integration
- Quiz generation
- Answer validation

### Sprint 5: Settings & Polish
- Settings Screen
- Progress tracking
- Error handling
- Performance optimization

---

## Notes

- Each screen should be completed before moving to the next
- Backend APIs can be developed in parallel with frontend
- Update task status as work progresses
- Add new tasks/epics as needed
- Mark completed items with [x]
