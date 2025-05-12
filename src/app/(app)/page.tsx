
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import CodeEditor from '@/components/core/CodeEditor';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react'; // Import Loader2

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      // Keep user on this page to see login prompt, actual navigation to /login done via button
      // router.push('/login'); // Avoid automatic redirect to allow showing prompt
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-10rem)] p-4 text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">正在加载你的 Studio...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <Card className="w-full max-w-lg text-center shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">欢迎来到 FEIWU HTML Studio</CardTitle>
            <CardDescription className="text-md">
              即时创建和分享实时HTML页面。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p>
              请登录或注册以开始创建你的网页奇迹。
              注册需要邀请码。
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/login">登录</Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="w-full sm:w-auto">
                <Link href="/register">注册</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <CodeEditor />;
}
