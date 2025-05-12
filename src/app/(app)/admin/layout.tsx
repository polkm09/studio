
"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Users, KeyRound, FileCode, ShieldAlert, Loader2 } from 'lucide-react';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/login?redirect=/admin');
      } else if (user.role !== 'admin') {
        router.replace('/'); // Redirect non-admins to homepage
        // Optionally, show a toast message here
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    // This state should ideally be brief due to redirects
    return (
       <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)] text-center p-4">
        <ShieldAlert className="w-16 h-16 text-destructive mb-4" />
        <h1 className="text-2xl font-bold mb-2">访问被拒绝</h1>
        <p className="text-muted-foreground mb-6">你没有权限查看此页面。</p>
        <Button asChild>
          <Link href="/">返回首页</Link>
        </Button>
      </div>
    );
  }

  const navItems = [
    { href: '/admin', label: '仪表盘', icon: Home },
    { href: '/admin/users', label: '管理用户', icon: Users },
    { href: '/admin/invitation-codes', label: '邀请码', icon: KeyRound },
    { href: '/admin/pages', label: '管理页面', icon: FileCode },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <aside className="md:w-64">
        <h2 className="text-xl font-semibold mb-4 px-2">管理菜单</h2>
        <nav className="flex flex-col space-y-1">
          {navItems.map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              asChild
              className="w-full justify-start"
            >
              <Link href={item.href} className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent/50">
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            </Button>
          ))}
        </nav>
      </aside>
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
