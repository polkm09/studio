
export interface User {
  id: string;
  mobile: string;
  role: 'user' | 'admin';
}

export interface InvitationCode {
  id: string;
  code: string;
  usedBy: string | null; // userId
  createdAt: string; // ISO date string
  isValid: boolean;
}

export interface HtmlPage {
  id: string; // Unique ID for the page
  htmlContent: string;
  createdAt: string; // ISO date string
  creatorId: string; // userId
  creatorMobile?: string; // For admin view
}

// Mock Data Structures (can be moved to a mock DB file later)

export const MOCK_INVITATION_CODES: InvitationCode[] = [
  { id: '1', code: 'WELCOME123', usedBy: null, createdAt: new Date().toISOString(), isValid: true },
  { id: '2', code: 'FEIWU2024', usedBy: null, createdAt: new Date().toISOString(), isValid: true },
  { id: '3', code: 'ADMINCODE', usedBy: 'admin-user-id', createdAt: new Date().toISOString(), isValid: false },
];

export const MOCK_USERS: User[] = [
  { id: 'admin-user-id', mobile: '17724631620', role: 'admin' }, // Changed admin mobile to 11-digit number
  { id: 'test-user-id', mobile: '13800138000', role: 'user' },
];

// Passwords should be hashed in a real DB. Storing plain text here for mock only.
export const MOCK_USER_CREDENTIALS: Record<string, string> = {
  '17724631620': 'feiwu0609', // Updated admin mobile key
  '13800138000': 'password123',
};


export const MOCK_HTML_PAGES: HtmlPage[] = [
  { 
    id: 'welcome-page', 
    htmlContent: `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <title>欢迎!</title>
  <style>body { font-family: sans-serif; margin: 20px; background-color: #f0f0f0; color: #333; text-align: center; } h1 { color: #4CAF50; } .container { background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); display: inline-block;}</style>
</head>
<body>
  <div class="container">
    <h1>来自 FEIWU.Studio 的问候!</h1>
    <p>这是HTML游乐场生成的示例页面。</p>
    <p>您可以创建自己的页面！</p>
    <script>console.log("示例页面脚本已执行。");</script>
  </div>
</body>
</html>`, 
    createdAt: new Date().toISOString(), 
    creatorId: 'admin-user-id',
    creatorMobile: '17724631620' // Updated admin mobile for sample page
  },
];

