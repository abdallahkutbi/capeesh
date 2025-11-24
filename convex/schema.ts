import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  books: defineTable({
    userId: v.string(),
    title: v.string(),
    author: v.optional(v.string()),
    coverImageUrl: v.optional(v.string()),
    epubFileId: v.id("_storage"), // Reference to Convex file storage
    epubFileName: v.string(),
    quizInterval: v.number(), // Pages between quizzes (default: 5)
    totalPages: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_created", ["userId", "createdAt"]),

  readingSessions: defineTable({
    userId: v.string(),
    bookId: v.id("books"),
    currentPage: v.number(),
    pagesRead: v.number(), // Total pages read in this session
    lastReadAt: v.number(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_book", ["bookId"])
    .index("by_user_book", ["userId", "bookId"]),

  quizzes: defineTable({
    userId: v.string(),
    bookId: v.id("books"),
    sessionId: v.optional(v.id("readingSessions")),
    pageRange: v.object({
      start: v.number(),
      end: v.number(),
    }),
    textContext: v.string(), // Text that was used to generate the quiz
    questions: v.array(
      v.object({
        question: v.string(),
        options: v.array(v.string()),
        correctAnswer: v.number(), // Index of correct option
        userAnswer: v.optional(v.number()),
        isCorrect: v.optional(v.boolean()),
      })
    ),
    completed: v.boolean(),
    score: v.optional(v.number()), // Percentage correct
    createdAt: v.number(),
    completedAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_book", ["bookId"])
    .index("by_session", ["sessionId"])
    .index("by_user_book", ["userId", "bookId"]),

  userProgress: defineTable({
    userId: v.string(),
    bookId: v.id("books"),
    totalPagesRead: v.number(),
    totalQuizzesCompleted: v.number(),
    averageQuizScore: v.optional(v.number()),
    lastReadAt: v.number(),
    completed: v.boolean(),
    completedAt: v.optional(v.number()),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_book", ["bookId"])
    .index("by_user_book", ["userId", "bookId"]),
});

