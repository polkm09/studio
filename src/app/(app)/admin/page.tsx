
"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_USERS, MOCK_INVITATION_CODES, MOCK_HTML_PAGES } from "@/lib/types";
import { Users, KeyRound, FileCode } from 'lucide-react';
import Link from "next/link";

export default function AdminDashboardPage() {
  // These would be fetched from an API in a real app
  const totalUsers = MOCK_USERS.filter(u => u.role === 'user').length;
  const activeInvitationCodes = MOCK_INVITATION_CODES.filter(c => c.isValid).length;
  const totalPublishedPages = MOCK_HTML_PAGES.length;

  const stats = [
    { title: "总用户数", value: totalUsers, icon: Users, link: "/admin/users", color: "text-sky-500" },
    { title: "有效邀请码", value: activeInvitationCodes, icon: KeyRound, link: "/admin/invitation-codes", color: "text-amber-500" },
    { title: "已发布页面", value: totalPublishedPages, icon: FileCode, link: "/admin/pages", color: "text-emerald-500" },
  ];

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
                <div className="text-2xl font-bold">{stat.value}</div>
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
