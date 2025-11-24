import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getByUserAndBook = query({
  args: {
    userId: v.string(),
    bookId: v.id("books"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("userProgress")
      .withIndex("by_user_book", (q) =>
        q.eq("userId", args.userId).eq("bookId", args.bookId)
      )
      .first();
  },
});

export const updateProgress = mutation({
  args: {
    userId: v.string(),
    bookId: v.id("books"),
    totalPagesRead: v.number(),
    totalQuizzesCompleted: v.optional(v.number()),
    averageQuizScore: v.optional(v.number()),
    completed: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("userProgress")
      .withIndex("by_user_book", (q) =>
        q.eq("userId", args.userId).eq("bookId", args.bookId)
      )
      .first();

    const now = Date.now();
    const updateData = {
      userId: args.userId,
      bookId: args.bookId,
      totalPagesRead: args.totalPagesRead,
      totalQuizzesCompleted: args.totalQuizzesCompleted ?? 0,
      averageQuizScore: args.averageQuizScore,
      lastReadAt: now,
      completed: args.completed ?? false,
      completedAt: args.completed ? now : undefined,
      updatedAt: now,
    };

    if (existing) {
      await ctx.db.patch(existing._id, updateData);
    } else {
      await ctx.db.insert("userProgress", updateData);
    }
  },
});

export const updateQuizScore = mutation({
  args: {
    userId: v.string(),
    bookId: v.id("books"),
    newScore: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("userProgress")
      .withIndex("by_user_book", (q) =>
        q.eq("userId", args.userId).eq("bookId", args.bookId)
      )
      .first();

    if (!existing) {
      // Create new progress entry
      await ctx.db.insert("userProgress", {
        userId: args.userId,
        bookId: args.bookId,
        totalPagesRead: 0,
        totalQuizzesCompleted: 1,
        averageQuizScore: args.newScore,
        lastReadAt: Date.now(),
        completed: false,
        updatedAt: Date.now(),
      });
      return;
    }

    // Calculate new average
    const totalQuizzes = existing.totalQuizzesCompleted + 1;
    const currentAverage = existing.averageQuizScore ?? 0;
    const newAverage =
      (currentAverage * existing.totalQuizzesCompleted + args.newScore) /
      totalQuizzes;

    await ctx.db.patch(existing._id, {
      totalQuizzesCompleted: totalQuizzes,
      averageQuizScore: newAverage,
      updatedAt: Date.now(),
    });
  },
});

