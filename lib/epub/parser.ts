import { Book } from 'epubjs';

export interface EPUBMetadata {
  title: string;
  author?: string;
  description?: string;
  coverImageUrl?: string;
  language?: string;
  publisher?: string;
}

export interface EPUBChapter {
  id: string;
  title: string;
  content: string;
  order: number;
}

export interface ParsedEPUB {
  metadata: EPUBMetadata;
  chapters: EPUBChapter[];
  fullText: string;
}

/**
 * Parse an EPUB file and extract metadata, chapters, and text content
 */
export async function parseEPUB(epubFile: File | Blob): Promise<ParsedEPUB> {
  const book = new Book(epubFile);
  await book.ready;

  // Extract metadata
  const metadata: EPUBMetadata = {
    title: book.packaging.metadata.title?.[0] || 'Untitled',
    author: book.packaging.metadata.creator?.[0] || undefined,
    description: book.packaging.metadata.description?.[0] || undefined,
    language: book.packaging.metadata.language?.[0] || undefined,
    publisher: book.packaging.metadata.publisher?.[0] || undefined,
  };

  // Try to get cover image
  try {
    const coverUrl = await book.coverUrl();
    if (coverUrl) {
      metadata.coverImageUrl = coverUrl;
    }
  } catch (error) {
    console.warn('Could not extract cover image:', error);
  }

  // Extract chapters
  const spine = book.spine;
  const chapters: EPUBChapter[] = [];
  const fullTextParts: string[] = [];

  for (let i = 0; i < spine.length; i++) {
    const item = spine.get(i);
    if (!item) continue;

    try {
      const section = await book.load(item.href);
      const content = await section.load(book.load.bind(book));
      
      // Extract text from HTML content
      const textContent = extractTextFromHTML(content);
      
      chapters.push({
        id: item.id,
        title: item.href || `Chapter ${i + 1}`,
        content: textContent,
        order: i,
      });

      fullTextParts.push(textContent);
    } catch (error) {
      console.warn(`Error loading chapter ${i}:`, error);
    }
  }

  return {
    metadata,
    chapters,
    fullText: fullTextParts.join('\n\n'),
  };
}

/**
 * Extract plain text from HTML content
 */
function extractTextFromHTML(html: string): string {
  // Remove script and style tags
  let text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

  // Convert HTML entities
  text = text.replace(/&nbsp;/g, ' ');
  text = text.replace(/&amp;/g, '&');
  text = text.replace(/&lt;/g, '<');
  text = text.replace(/&gt;/g, '>');
  text = text.replace(/&quot;/g, '"');
  text = text.replace(/&#39;/g, "'");

  // Remove HTML tags
  text = text.replace(/<[^>]+>/g, '');

  // Clean up whitespace
  text = text.replace(/\s+/g, ' ');
  text = text.trim();

  return text;
}

/**
 * Get EPUB file as Blob from Convex storage
 */
export async function getEPUBFromStorage(
  storageId: string,
  convexUrl: string
): Promise<Blob> {
  const response = await fetch(`${convexUrl}/api/storage/${storageId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch EPUB file: ${response.statusText}`);
  }
  return await response.blob();
}

