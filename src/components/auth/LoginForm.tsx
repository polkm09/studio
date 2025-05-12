
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

const loginSchema = z.object({
  mobile: z.string().min(1, "手机号码是必填项").regex(/^\d{11}$/, "无效的手机号码格式 (必须是11位数字)"),
  password: z.string().min(1, "密码是必填项"),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    setIsLoading(true);
    try {
      const user = await login(data.mobile, data.password);
      if (user) {
        toast({ title: "登录成功", description: `欢迎回来, ${user.mobile}！` });
        router.push('/');
      } else {
        toast({ title: "登录失败", description: "手机号码或密码无效。", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "登录错误", description: (error as Error).message || "发生意外错误。", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center">登录</CardTitle>
        <CardDescription className="text-center">访问您的 FEIWU.Studio 账户。</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="mobile">手机号码</Label>
            <Input id="mobile" type="tel" placeholder="输入您的手机号码" {...register("mobile")} aria-invalid={errors.mobile ? "true" : "false"} />
            {errors.mobile && <p className="text-sm text-destructive">{errors.mobile.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">密码</Label>
            <Input id="password" type="password" placeholder="输入您的密码" {...register("password")} aria-invalid={errors.password ? "true" : "false"} />
            {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            登录
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col items-center space-y-2">
        <p className="text-sm text-muted-foreground">
          还没有账户？{' '}
          <Button variant="link" asChild className="p-0 h-auto">
            <Link href="/register">在此注册</Link>
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;

