import { Id } from "@/convex/_generated/dataModel";

/**
 * Upload EPUB file to Convex storage and create book record
 * 
 * Note: This is a helper function. The actual file upload should be done
 * client-side using Convex's storage API:
 * 
 * const storageId = await ctx.storage.store(file);
 * 
 * Then call createBook with the storageId.
 */
export async function uploadEPUB(
  file: File,
  userId: string,
  storeFile: (file: File) => Promise<Id<"_storage">>,
  createBook: (args: {
    userId: string;
    title: string;
    author?: string;
    coverImageUrl?: string;
    epubFileId: Id<"_storage">;
    epubFileName: string;
    quizInterval?: number;
  }) => Promise<Id<"books">>
): Promise<Id<"books">> {
  // Store file in Convex storage
  const storageId = await storeFile(file);

  // For now, we'll create the book with basic metadata
  // Full parsing can happen on-demand when reading
  const bookId = await createBook({
    userId,
    title: file.name.replace(/\.epub$/i, ''),
    epubFileId: storageId,
    epubFileName: file.name,
    quizInterval: 5, // Default 5 pages
  });

  return bookId;
}
