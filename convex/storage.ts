import { mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Store EPUB file in Convex storage
 * Note: Actual file storage should be done client-side using ctx.storage.store()
 * This mutation is a placeholder for any server-side processing needed
 */
export const storeEPUB = mutation({
  args: {
    storageId: v.id("_storage"),
    fileName: v.string(),
  },
  handler: async (ctx, args) => {
    // The file is already stored via ctx.storage.store() on the client
    // This mutation can be used to validate or process the stored file
    return args.storageId;
  },
});
