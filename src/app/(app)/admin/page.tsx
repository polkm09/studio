
"use client";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, KeyRound, FileCode, Loader2 } from 'lucide-react';
import Link from "next/link";
import { getAllUsers } from '@/services/userService';
import { getAllInvitationCodes } from '@/services/invitationCodeService';
import { getAllHtmlPages } from '@/services/htmlPageService';
import { useToast } from '@/hooks/use-toast';

interface StatItem {
  title: string;
  value: number | string; // Can be string for loading state
  icon: React.ElementType;
  link: string;
  color: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<StatItem[]>([
    { title: "总用户数", value: "...", icon: Users, link: "/admin/users", color: "text-sky-500" },
    { title: "有效邀请码", value: "...", icon: KeyRound, link: "/admin/invitation-codes", color: "text-amber-500" },
    { title: "已发布页面", value: "...", icon: FileCode, link: "/admin/pages", color: "text-emerald-500" },
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const [usersData, codesData, pagesData] = await Promise.all([
          getAllUsers(),
          getAllInvitationCodes(),
          getAllHtmlPages()
        ]);

        setStats([
          { title: "总用户数", value: usersData.filter(u => u.role === 'user').length, icon: Users, link: "/admin/users", color: "text-sky-500" },
          { title: "有效邀请码", value: codesData.filter(c => c.isValid && !c.usedBy).length, icon: KeyRound, link: "/admin/invitation-codes", color: "text-amber-500" },
          { title: "已发布页面", value: pagesData.length, icon: FileCode, link: "/admin/pages", color: "text-emerald-500" },
        ]);
      } catch (error) {
        toast({ title: "获取仪表盘数据失败", description: (error as Error).message, variant: "destructive" });
        // Keep placeholder values or set to 0 on error
        setStats(prev => prev.map(s => ({ ...s, value: "错误" })));
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [toast]);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">管理员仪表盘</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Link href={stat.link} key={stat.title} className="block hover:shadow-lg transition-shadow rounded-lg">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                {isLoading && stat.value === "..." ? (
                   <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                ) : (
                  <div className="text-2xl font-bold">{stat.value}</div>
                )}
                <p className="text-xs text-muted-foreground">查看详情</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>快捷操作</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {/* Placeholder for quick action buttons if needed */}
          <p className="text-muted-foreground col-span-full">可以在此处添加更多管理功能。</p>
        </CardContent>
      </Card>
    </div>
  );
}
