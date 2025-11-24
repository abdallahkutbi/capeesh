import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    userId: v.string(),
    bookId: v.id("books"),
    currentPage: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("readingSessions", {
      userId: args.userId,
      bookId: args.bookId,
      currentPage: args.currentPage ?? 0,
      pagesRead: 0,
      lastReadAt: now,
      createdAt: now,
    });
  },
});

export const getByUserAndBook = query({
  args: {
    userId: v.string(),
    bookId: v.id("books"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("readingSessions")
      .withIndex("by_user_book", (q) =>
        q.eq("userId", args.userId).eq("bookId", args.bookId)
      )
      .order("desc")
      .first();
  },
});

export const updateProgress = mutation({
  args: {
    sessionId: v.id("readingSessions"),
    currentPage: v.number(),
    pagesRead: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.sessionId, {
      currentPage: args.currentPage,
      pagesRead: args.pagesRead,
      lastReadAt: Date.now(),
    });
  },
});

