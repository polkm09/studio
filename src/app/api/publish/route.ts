
import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createHtmlPage } from '@/services/htmlPageService'; // Use the service

const PublishRequestSchema = z.object({
  htmlContent: z.string().min(1, "HTML content cannot be empty."),
  creatorId: z.string(), // Assuming creatorId is passed from client (e.g., logged-in user's ID)
  creatorMobile: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validationResult = PublishRequestSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({ error: "无效的请求体", details: validationResult.error.format() }, { status: 400 });
    }

    const { htmlContent, creatorId, creatorMobile } = validationResult.data;

    // Use the service to create the page
    const newPage = await createHtmlPage({
      htmlContent,
      creatorId,
      creatorMobile: creatorMobile || undefined,
    });

    const baseUrl = request.nextUrl.origin;
    const generatedLink = `${baseUrl}/view/${newPage.id}`;

    return NextResponse.json({ id: newPage.id, link: generatedLink, message: "页面已成功发布" }, { status: 201 });

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
