
"use client";
import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { User } from "@/lib/types"; // Type import
import { Trash2, UserCircle, ShieldCheck, Loader2 } from "lucide-react";
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
import { getAllUsers, deleteUser } from '@/services/userService';

export default function ManageUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedUsers = await getAllUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      toast({ title: "获取用户列表失败", description: (error as Error).message, variant: "destructive" });
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDeleteUser = async (userId: string, userMobile?: string) => {
    try {
      const success = await deleteUser(userId);
      if (success) {
        toast({ title: "用户已删除", description: `用户 ${userMobile || userId} 已被移除。` });
        await fetchUsers(); // Refresh the list
      } else {
         toast({ title: "删除失败", description: `无法删除用户 ${userMobile || userId}。管理员不能被删除。`, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "删除用户错误", description: (error as Error).message, variant: "destructive" });
    }
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
          {isLoading ? (
             <div className="flex justify-center items-center h-24">
               <Loader2 className="h-8 w-8 animate-spin text-primary" />
             </div>
          ) : (
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
                {users.length === 0 && !isLoading && (
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
                                onClick={() => handleDeleteUser(user.id, user.mobile)}
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
