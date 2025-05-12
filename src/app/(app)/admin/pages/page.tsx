
"use client";
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MOCK_HTML_PAGES, type HtmlPage } from "@/lib/types";
import { Trash2, ExternalLink } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function ManagePagesPage() {
  const [pages, setPages] = useState<HtmlPage[]>([]);
  const { toast } = useToast();
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    // Initialize pages state with a new array copy from MOCK_HTML_PAGES
    // This ensures that if MOCK_HTML_PAGES is mutated elsewhere,
    // this component initializes with its current state.
    // Also guard against MOCK_HTML_PAGES being potentially undefined during HMR or build issues.
    setPages(MOCK_HTML_PAGES ? [...MOCK_HTML_PAGES] : []);
    setBaseUrl(window.location.origin);
  }, []); // Empty dependency array ensures this runs once on mount

  const handleDeletePage = (pageId: string) => {
    const pageIndex = MOCK_HTML_PAGES.findIndex(p => p.id === pageId);
    if (pageIndex > -1) {
      MOCK_HTML_PAGES.splice(pageIndex, 1); // Mutate the global mock array
      setPages([...MOCK_HTML_PAGES]); // Update local state with a new copy from the mutated global mock
      toast({ title: "页面已删除", description: `已发布的页面 ${pageId} 已被移除。` });
    } else {
      // If page not found in MOCK_HTML_PAGES (e.g., already deleted by another action/user)
      // still refresh the local state from the source of truth.
      setPages([...MOCK_HTML_PAGES]);
      toast({ title: "删除提示", description: `页面 ${pageId} 未找到或已被删除。列表已刷新。`, variant: "default" });
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">管理已发布页面</h1>
      <Card>
        <CardHeader>
          <CardTitle>已发布页面列表</CardTitle>
          <CardDescription>查看和管理所有用户发布的页面。</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>页面ID</TableHead>
                <TableHead>创建者手机号</TableHead>
                <TableHead>创建于</TableHead>
                <TableHead>预览链接</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pages.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24">尚无已发布的页面。</TableCell>
                </TableRow>
              )}
              {pages.map((page) => (
                <TableRow key={page.id}>
                  <TableCell className="font-mono font-medium truncate max-w-xs">{page.id}</TableCell>
                  <TableCell>{page.creatorMobile || '无 (历史数据)'}</TableCell>
                  <TableCell>{format(new Date(page.createdAt), "yyyy年MM月dd日 HH:mm", { locale: zhCN })}</TableCell>
                  <TableCell>
                    <Button variant="link" asChild className="p-0 h-auto">
                      <Link href={`${baseUrl}/view/${page.id}`} target="_blank" rel="noopener noreferrer" className="flex items-center">
                        查看页面 <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                           <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">删除页面</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>你确定吗？</AlertDialogTitle>
                            <AlertDialogDescription>
                              此操作无法撤销。这将永久删除ID为 “{page.id}” 的页面。
                              公开链接将变为404。
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>取消</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeletePage(page.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              删除
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
