
"use client";
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MOCK_USERS, type User } from "@/lib/types";
import { Trash2, UserCircle, ShieldCheck } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
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

export default function ManageUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // In a real app, fetch users from an API
    setUsers(MOCK_USERS);
  }, []);

  const handleDeleteUser = (userId: string) => {
    // Simulate API call
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    MOCK_USERS.splice(MOCK_USERS.findIndex(u => u.id === userId), 1); // Update mock source
    toast({ title: "用户已删除", description: `ID为 ${userId} 的用户已被移除。` });
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">管理用户</h1>
      <Card>
        <CardHeader>
          <CardTitle>注册用户列表</CardTitle>
          <CardDescription>查看和管理系统中所有注册用户。</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>用户ID</TableHead>
                <TableHead>手机号码</TableHead>
                <TableHead>角色</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-24">未找到用户。</TableCell>
                </TableRow>
              )}
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium truncate max-w-xs">{user.id}</TableCell>
                  <TableCell>{user.mobile}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                    }`}>
                      {user.role === 'admin' ? <ShieldCheck className="w-3 h-3 mr-1.5" /> : <UserCircle className="w-3 h-3 mr-1.5" />}
                      {user.role === 'admin' ? '管理员' : '用户'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    {user.role !== 'admin' ? (
                       <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">删除用户</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>你确定吗？</AlertDialogTitle>
                            <AlertDialogDescription>
                              此操作无法撤销。这将永久删除手机号为 {user.mobile} 的用户账户。
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>取消</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteUser(user.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              删除
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    ) : (
                      <Button variant="ghost" size="icon" disabled>
                        <Trash2 className="h-4 w-4" />
                         <span className="sr-only">不能删除管理员</span>
                      </Button>
                    )}
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
