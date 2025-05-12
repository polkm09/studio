
"use client";
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MOCK_INVITATION_CODES, type InvitationCode } from "@/lib/types";
import { PlusCircle, Trash2, CheckCircle, XCircle } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
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
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export default function ManageInvitationCodesPage() {
  const [codes, setCodes] = useState<InvitationCode[]>([]);
  const [newCodeValue, setNewCodeValue] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setCodes(MOCK_INVITATION_CODES);
  }, []);

  const handleGenerateCode = () => {
    if (!newCodeValue.trim()) {
      toast({ title: "无效的邀请码", description: "请输入新邀请码的值。", variant: "destructive" });
      return;
    }
    const newCode: InvitationCode = {
      id: `code-${Date.now()}`,
      code: newCodeValue.trim().toUpperCase(),
      usedBy: null,
      createdAt: new Date().toISOString(),
      isValid: true,
    };
    setCodes(prevCodes => [newCode, ...prevCodes]);
    MOCK_INVITATION_CODES.unshift(newCode); // Update mock source
    toast({ title: "邀请码已生成", description: `新的邀请码 “${newCode.code}” 已添加。` });
    setNewCodeValue('');
    setIsAddDialogOpen(false);
  };

  const handleDeleteCode = (codeId: string) => {
    setCodes(prevCodes => prevCodes.filter(code => code.id !== codeId));
    MOCK_INVITATION_CODES.splice(MOCK_INVITATION_CODES.findIndex(c => c.id === codeId), 1);
    toast({ title: "邀请码已删除", description: `邀请码已被移除。` });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">管理邀请码</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> 生成新邀请码
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>生成新的邀请码</DialogTitle>
              <DialogDescription>
                为新邀请码输入一个唯一的字符串。它将被转换为大写。
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="newCode" className="text-right">
                  邀请码值
                </Label>
                <Input
                  id="newCode"
                  value={newCodeValue}
                  onChange={(e) => setNewCodeValue(e.target.value)}
                  className="col-span-3"
                  placeholder="例如：SPECIAL25"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">取消</Button>
              </DialogClose>
              <Button onClick={handleGenerateCode}>生成</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>邀请码列表</CardTitle>
          <CardDescription>查看、生成和删除邀请码。</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>邀请码</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>使用者 (用户ID)</TableHead>
                <TableHead>创建于</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {codes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24">未找到邀请码。</TableCell>
                </TableRow>
              )}
              {codes.map((code) => (
                <TableRow key={code.id}>
                  <TableCell className="font-mono font-medium">{code.code}</TableCell>
                  <TableCell>
                    {code.isValid && !code.usedBy ? (
                      <span className="inline-flex items-center text-xs font-medium text-emerald-600">
                        <CheckCircle className="w-3.5 h-3.5 mr-1.5" /> 可用
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-xs font-medium text-red-600">
                        <XCircle className="w-3.5 h-3.5 mr-1.5" /> 已使用/无效
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-xs">{code.usedBy || '无'}</TableCell>
                  <TableCell>{format(new Date(code.createdAt), "yyyy年MM月dd日 HH:mm", { locale: zhCN })}</TableCell>
                  <TableCell className="text-right">
                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">删除邀请码</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>你确定吗？</AlertDialogTitle>
                            <AlertDialogDescription>
                              此操作无法撤销。这将永久删除邀请码 “{code.code}”。
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>取消</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteCode(code.id)}
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
