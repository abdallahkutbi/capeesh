import { EPUBChapter } from './parser';

export interface Page {
  index: number;
  content: string;
  chapterIndex: number;
  chapterTitle: string;
}

export interface PaginationConfig {
  charactersPerPage: number;
  fontSize?: number;
  lineHeight?: number;
  screenWidth?: number;
  screenHeight?: number;
}

const DEFAULT_CHARACTERS_PER_PAGE = 2000;

/**
 * Paginate EPUB chapters into pages
 */
export function paginateChapters(
  chapters: EPUBChapter[],
  config: PaginationConfig = {}
): Page[] {
  const charactersPerPage =
    config.charactersPerPage || DEFAULT_CHARACTERS_PER_PAGE;
  const pages: Page[] = [];
  let pageIndex = 0;

  for (let chapterIndex = 0; chapterIndex < chapters.length; chapterIndex++) {
    const chapter = chapters[chapterIndex];
    const text = chapter.content;

    // Split chapter into pages
    let currentPosition = 0;
    while (currentPosition < text.length) {
      const pageContent = extractPageContent(
        text,
        currentPosition,
        charactersPerPage
      );

      pages.push({
        index: pageIndex++,
        content: pageContent,
        chapterIndex,
        chapterTitle: chapter.title,
      });

      currentPosition += pageContent.length;
    }
  }

  return pages;
}

/**
 * Extract a page of content from text, respecting word boundaries
 */
function extractPageContent(
  text: string,
  startPosition: number,
  maxLength: number
): string {
  const endPosition = startPosition + maxLength;

  // If we're at the end of the text, return what's left
  if (endPosition >= text.length) {
    return text.slice(startPosition).trim();
  }

  // Try to break at a word boundary
  let actualEnd = endPosition;
  const nextChar = text[endPosition];

  // If we're in the middle of a word, find the next space
  if (nextChar && !/\s/.test(nextChar)) {
    const nextSpace = text.indexOf(' ', endPosition);
    if (nextSpace !== -1 && nextSpace < endPosition + 50) {
      actualEnd = nextSpace;
    }
  }

  // If we're in the middle of a sentence, try to break at punctuation
  if (actualEnd === endPosition) {
    const punctuation = /[.!?]\s/.exec(text.slice(startPosition, endPosition + 20));
    if (punctuation && punctuation.index) {
      actualEnd = startPosition + punctuation.index + 1;
    }
  }

  return text.slice(startPosition, actualEnd).trim();
}

/**
 * Get text from a range of pages for quiz context
 */
export function getTextFromPageRange(
  pages: Page[],
  startPage: number,
  endPage: number
): string {
  const relevantPages = pages.slice(startPage, endPage + 1);
  return relevantPages.map((page) => page.content).join('\n\n');
}

/**
 * Calculate total pages for a set of chapters
 */
export function calculateTotalPages(
  chapters: EPUBChapter[],
  config?: PaginationConfig
): number {
  const pages = paginateChapters(chapters, config);
  return pages.length;
}

