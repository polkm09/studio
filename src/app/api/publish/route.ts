
import { type NextRequest, NextResponse } from 'next/server';
import { MOCK_HTML_PAGES, type HtmlPage } from '@/lib/types';
import { z } from 'zod';

const PublishRequestSchema = z.object({
  htmlContent: z.string().min(1, "HTML content cannot be empty."),
  creatorId: z.string(),
  creatorMobile: z.string().optional(), // Assuming mobile might not always be available or could be fetched server-side if needed
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validationResult = PublishRequestSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({ error: "无效的请求体", details: validationResult.error.format() }, { status: 400 });
    }

    const { htmlContent, creatorId, creatorMobile } = validationResult.data;

    const uniqueId = `page-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const newPage: HtmlPage = {
      id: uniqueId,
      htmlContent,
      createdAt: new Date().toISOString(),
      creatorId,
      creatorMobile: creatorMobile || undefined, // Ensure it's undefined if not provided
    };

    // This push modifies the MOCK_HTML_PAGES array in the server's memory space.
    // In a real application, this would be a database insertion.
    MOCK_HTML_PAGES.push(newPage);

    const baseUrl = request.nextUrl.origin;
    const generatedLink = `${baseUrl}/view/${uniqueId}`;

    return NextResponse.json({ id: uniqueId, link: generatedLink, message: "页面已成功发布" }, { status: 201 });

  } catch (error) {
    console.error("在 /api/publish 中发生错误:", error);
    let errorMessage = "内部服务器错误";
    if (error instanceof Error) {
        errorMessage = error.message;
    } else if (typeof error === 'string') {
        errorMessage = error;
    }
    // For JSON parsing errors or other unexpected errors
    if (error instanceof SyntaxError && error.message.includes("JSON")) {
        errorMessage = "请求体格式错误，期望为JSON。";
        return NextResponse.json({ error: "请求解析失败", details: errorMessage }, { status: 400 });
    }
    
    return NextResponse.json({ error: "发布页面失败", details: errorMessage }, { status: 500 });
  }
}
