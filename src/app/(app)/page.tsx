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
        <p className="text-lg text-muted-foreground">Loading your playground...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <Card className="w-full max-w-lg text-center shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Welcome to Feiwu HTML Playground</CardTitle>
            <CardDescription className="text-md">
              Create and share live HTML pages instantly.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p>
              Please log in or register to start crafting your web wonders.
              An invitation code is required for registration.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/login">Login</Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="w-full sm:w-auto">
                <Link href="/register">Register</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <CodeEditor />;
}
