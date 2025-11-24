import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    userId: v.string(),
    title: v.string(),
    author: v.optional(v.string()),
    coverImageUrl: v.optional(v.string()),
    epubFileId: v.id("_storage"),
    epubFileName: v.string(),
    quizInterval: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("books", {
      userId: args.userId,
      title: args.title,
      author: args.author,
      coverImageUrl: args.coverImageUrl,
      epubFileId: args.epubFileId,
      epubFileName: args.epubFileName,
      quizInterval: args.quizInterval ?? 5, // Default 5 pages
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const getByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("books")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

export const getById = query({
  args: { bookId: v.id("books") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.bookId);
  },
});

export const updateQuizInterval = mutation({
  args: {
    bookId: v.id("books"),
    quizInterval: v.number(),
  },
  handler: async (ctx, args) => {
    const book = await ctx.db.get(args.bookId);
    if (!book) {
      throw new Error("Book not found");
    }
    await ctx.db.patch(args.bookId, {
      quizInterval: args.quizInterval,
      updatedAt: Date.now(),
    });
  },
});

