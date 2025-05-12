
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

// Define a type for the global object to ensure type safety for our stores
declare global {
  // eslint-disable-next-line no-var
  var MOCK_INVITATION_CODES_STORE: InvitationCode[] | undefined;
  // eslint-disable-next-line no-var
  var MOCK_USERS_STORE: User[] | undefined;
  // eslint-disable-next-line no-var
  var MOCK_USER_CREDENTIALS_STORE: Record<string, string> | undefined;
  // eslint-disable-next-line no-var
  var MOCK_HTML_PAGES_STORE: HtmlPage[] | undefined;
}

// Invitation Codes
if (!global.MOCK_INVITATION_CODES_STORE) {
  global.MOCK_INVITATION_CODES_STORE = [
    { id: '1', code: 'WELCOME123', usedBy: null, createdAt: new Date().toISOString(), isValid: true },
    { id: '2', code: 'FEIWU2024', usedBy: null, createdAt: new Date().toISOString(), isValid: true },
    { id: '3', code: 'ADMINCODE', usedBy: 'admin-user-id', createdAt: new Date().toISOString(), isValid: false },
  ];
}
export const MOCK_INVITATION_CODES: InvitationCode[] = global.MOCK_INVITATION_CODES_STORE;

// Users
if (!global.MOCK_USERS_STORE) {
  global.MOCK_USERS_STORE = [
    { id: 'admin-user-id', mobile: '17724631620', role: 'admin' },
    { id: 'test-user-id', mobile: '13800138000', role: 'user' },
  ];
}
export const MOCK_USERS: User[] = global.MOCK_USERS_STORE;

// User Credentials
if (!global.MOCK_USER_CREDENTIALS_STORE) {
  global.MOCK_USER_CREDENTIALS_STORE = {
    '17724631620': 'feiwu0609',
    '13800138000': 'password123',
  };
}
export const MOCK_USER_CREDENTIALS: Record<string, string> = global.MOCK_USER_CREDENTIALS_STORE;

// HTML Pages
const initialMockHtmlPageContent = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <title>欢迎!</title>
  <style>body { font-family: sans-serif; margin: 20px; background-color: #f0f0f0; color: #333; text-align: center; } h1 { color: #4CAF50; } .container { background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); display: inline-block;}</style>
</head>
<body>
  <div class="container">
    <h1>来自 FEIWU.Studio 的问候!</h1>
    <p>这是HTML Studio生成的示例页面。</p>
    <p>你可以创建自己的页面！</p>
    <script>console.log("示例页面脚本已执行。");</script>
  </div>
</body>
</html>`;

if (!global.MOCK_HTML_PAGES_STORE) {
  global.MOCK_HTML_PAGES_STORE = [
    { 
      id: 'welcome-page', 
      htmlContent: initialMockHtmlPageContent, 
      createdAt: new Date().toISOString(), 
      creatorId: 'admin-user-id',
      creatorMobile: '17724631620'
    },
  ];
}
export const MOCK_HTML_PAGES: HtmlPage[] = global.MOCK_HTML_PAGES_STORE;
