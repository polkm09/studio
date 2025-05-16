
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Share2, Link as LinkIcon } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
// Removed direct import of MOCK_HTML_PAGES as it's no longer managed client-side this way for publishing.

const CodeEditor = () => {
  const [htmlCode, setHtmlCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  const [baseUrl, setBaseUrl] = useState(''); 
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setBaseUrl(window.location.origin);
    }
  }, []);


  const handleShipIt = async () => {
    if (!user) {
      toast({ title: "未认证", description: "请登录后再发布页面。", variant: "destructive" });
      return;
    }
    if (!htmlCode.trim()) {
      toast({ title: "代码为空", description: "请在发布前粘贴一些HTML代码。", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    setGeneratedLink('');

    try {
      const response = await fetch('/api/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          htmlContent: htmlCode,
          creatorId: user.id,
          creatorMobile: user.mobile,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        let errorMessage = "无法发布你的页面。";
        if (result.error) {
          errorMessage = result.error;
          if (result.details && typeof result.details === 'object') {
            errorMessage += ": " + Object.entries(result.details).map(([field, issue]) => `${field}: ${(issue as any)._errors?.join(', ')}`).join('; ');
          } else if (result.details && typeof result.details === 'string') {
             errorMessage += ": " + result.details;
          }
        }
        throw new Error(errorMessage);
      }
      
      // The global MOCK_HTML_PAGES is updated by the API route now via the service.
      // No need for client-side MOCK_HTML_PAGES.unshift(...) here.
      // The admin page will fetch fresh data.

      setGeneratedLink(result.link); 
      toast({ title: "页面已发布", description: "你的HTML页面现已上线。" });
      setHtmlCode(''); 
    } catch (error) {
      toast({ title: "发布错误", description: (error as Error).message || "无法发布你的页面。", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink)
        .then(() => {
          toast({ title: "已复制", description: "链接已复制到剪贴板。" });
        })
        .catch(() => {
          toast({ title: "复制失败", description: "无法复制链接。", variant: "destructive" });
        });
    }
  };

  return (
    <Card className="w-full shadow-xl">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center">Studio</CardTitle>
        <CardDescription className="text-center">
          在下方粘贴你的HTML代码，然后点击“发布”生成可分享的页面。
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="<!-- 在此处粘贴你的HTML代码 -->"
          value={htmlCode}
          onChange={(e) => setHtmlCode(e.target.value)}
          className="min-h-[300px] font-mono text-sm bg-card border-input rounded-md shadow-sm focus:ring-primary focus:border-primary"
          aria-label="HTML代码输入框"
        />
        <Button onClick={handleShipIt} className="w-full sm:w-auto" disabled={isLoading || !user}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Share2 className="mr-2 h-4 w-4" />
          )}
          发布
        </Button>
        {!user && <p className="text-sm text-muted-foreground text-center">请登录以发布页面。</p>}
      </CardContent>
      {generatedLink && (
        <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
          <div className="flex items-center space-x-2 overflow-hidden">
            <LinkIcon className="h-5 w-5 text-primary flex-shrink-0" />
            <a
              href={generatedLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-primary hover:underline truncate"
              title={generatedLink}
            >
              {generatedLink}
            </a>
          </div>
          <Button variant="outline" size="sm" onClick={handleCopyToClipboard}>
            复制链接
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default CodeEditor;
