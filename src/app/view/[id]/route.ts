
import { type NextRequest, NextResponse } from 'next/server';
import { MOCK_HTML_PAGES } from '@/lib/types'; // Using mock data

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  // In a real app, you would fetch this from your Alibaba Cloud Database Service
  const pageData = MOCK_HTML_PAGES.find(p => p.id === id);

  if (pageData) {
    // IMPORTANT: XSS Security Risk!
    // The following code directly renders user-supplied HTML content.
    // This is a major security vulnerability (Cross-Site Scripting - XSS).
    // In a production environment, this HTML should be sanitized (e.g., using DOMPurify)
    // or, preferably, rendered within a sandboxed iframe to mitigate XSS attacks.
    // For example, if rendering within a Next.js page:
    // <iframe sandbox srcDoc={sanitizedHtmlContent}></iframe>
    // Or serve the content with appropriate Content-Security-Policy headers.
    // Future implementation should focus on robust XSS protection.
    return new NextResponse(pageData.htmlContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        // Consider adding Content-Security-Policy headers here for added security
        // 'Content-Security-Policy': "default-src 'self'; script-src 'none'; object-src 'none';" // Example: very restrictive
      },
    });
  } else {
    const notFoundHtml = `
      <!DOCTYPE html>
      <html lang="zh-CN">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>404 - 页面未找到</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background-color: #f0f0f0; color: #333; text-align: center; }
          .container { padding: 20px; background-color: #fff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          h1 { font-size: 2.5rem; color: #d32f2f; margin-bottom: 0.5em; }
          p { font-size: 1.1rem; margin-bottom: 1em; }
          a { color: #4CAF50; text-decoration: none; font-weight: bold; }
          a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>404 - 页面未找到</h1>
          <p>抱歉，你正在查找的页面不存在或已被移动。</p>
          <p><a href="/">返回首页</a></p>
        </div>
      </body>
      </html>
    `;
    return new NextResponse(notFoundHtml, {
      status: 404,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  }
}
