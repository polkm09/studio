
// src/services/htmlPageService.ts
import { MOCK_HTML_PAGES, type HtmlPage } from '@/lib/types';

// Simulate async operations
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getAllHtmlPages(): Promise<HtmlPage[]> {
  await delay(100);
  return [...MOCK_HTML_PAGES]; // Return a copy
}

export async function getHtmlPageById(id: string): Promise<HtmlPage | undefined> {
  await delay(50);
  const pageData = MOCK_HTML_PAGES.find(p => p.id === id);
  return pageData ? { ...pageData } : undefined;
}

export async function createHtmlPage(data: Omit<HtmlPage, 'id' | 'createdAt'>): Promise<HtmlPage> {
  await delay(100);
  const uniqueId = `page-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  const newPage: HtmlPage = {
    ...data,
    id: uniqueId,
    createdAt: new Date().toISOString(),
  };
  MOCK_HTML_PAGES.unshift(newPage); // Add to the beginning for newest first
  return { ...newPage };
}

export async function deleteHtmlPage(pageId: string): Promise<boolean> {
  await delay(100);
  const pageIndex = MOCK_HTML_PAGES.findIndex(p => p.id === pageId);
  if (pageIndex > -1) {
    MOCK_HTML_PAGES.splice(pageIndex, 1);
    return true;
  }
  return false;
}
