import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    userId: v.string(),
    bookId: v.id("books"),
    sessionId: v.optional(v.id("readingSessions")),
    pageRange: v.object({
      start: v.number(),
      end: v.number(),
    }),
    textContext: v.string(),
    questions: v.array(
      v.object({
        question: v.string(),
        options: v.array(v.string()),
        correctAnswer: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("quizzes", {
      userId: args.userId,
      bookId: args.bookId,
      sessionId: args.sessionId,
      pageRange: args.pageRange,
      textContext: args.textContext,
      questions: args.questions.map((q) => ({
        ...q,
        userAnswer: undefined,
        isCorrect: undefined,
      })),
      completed: false,
      createdAt: now,
    });
  },
});

export const getById = query({
  args: { quizId: v.id("quizzes") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.quizId);
  },
});

export const getBySession = query({
  args: { sessionId: v.id("readingSessions") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("quizzes")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .order("desc")
      .collect();
  },
});

export const submitAnswers = mutation({
  args: {
    quizId: v.id("quizzes"),
    answers: v.array(v.number()), // Array of selected answer indices
  },
  handler: async (ctx, args) => {
    const quiz = await ctx.db.get(args.quizId);
    if (!quiz) {
      throw new Error("Quiz not found");
    }

    const updatedQuestions = quiz.questions.map((q, index) => {
      const userAnswer = args.answers[index];
      const isCorrect = userAnswer === q.correctAnswer;
      return {
        ...q,
        userAnswer,
        isCorrect,
      };
    });

    const correctCount = updatedQuestions.filter((q) => q.isCorrect).length;
    const score = (correctCount / updatedQuestions.length) * 100;

    await ctx.db.patch(args.quizId, {
      questions: updatedQuestions,
      completed: true,
      score,
      completedAt: Date.now(),
    });
  },
});

