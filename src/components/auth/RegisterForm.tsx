
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

const registerSchema = z.object({
  mobile: z.string().min(1, "手机号码是必填项").regex(/^\d{11}$/, "无效的手机号码格式 (必须是11位数字)"),
  password: z.string().min(6, "密码至少需要6个字符"),
  invitationCode: z.string().min(1, "邀请码是必填项"),
});

type RegisterFormInputs = z.infer<typeof registerSchema>;

const RegisterForm = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { register: registerUser } = useAuth(); // Renamed to avoid conflict with RHF register
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
    setIsLoading(true);
    try {
      const user = await registerUser(data.mobile, data.password, data.invitationCode);
      if (user) {
        toast({ title: "注册成功", description: `欢迎, ${user.mobile}！您现在可以登录了。` });
        router.push('/login');
      } else {
        // This case might not be reached if registerUser throws errors for failures
        toast({ title: "注册失败", description: "无法完成注册。", variant: "destructive" });
      }
    } catch (error) {
      let errorMessage = "发生意外错误。";
      if (error instanceof Error) {
        switch(error.message) {
          case "Invalid mobile phone number format.":
            errorMessage = "无效的手机号码格式。";
            break;
          case "Invalid invitation code.":
            errorMessage = "邀请码无效。";
            break;
          case "Mobile number already registered.":
            errorMessage = "手机号码已被注册。";
            break;
          default:
            errorMessage = error.message;
        }
      }
      toast({ title: "注册错误", description: errorMessage, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center">注册</CardTitle>
        <CardDescription className="text-center">创建您的飞舞工作室账户。</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="mobile">手机号码</Label>
            <Input id="mobile" type="tel" placeholder="输入您的手机号码" {...register("mobile")} aria-invalid={errors.mobile ? "true" : "false"}/>
            {errors.mobile && <p className="text-sm text-destructive">{errors.mobile.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">密码</Label>
            <Input id="password" type="password" placeholder="选择一个密码" {...register("password")} aria-invalid={errors.password ? "true" : "false"}/>
            {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="invitationCode">邀请码</Label>
            <Input id="invitationCode" type="text" placeholder="输入您的邀请码" {...register("invitationCode")} aria-invalid={errors.invitationCode ? "true" : "false"}/>
            {errors.invitationCode && <p className="text-sm text-destructive">{errors.invitationCode.message}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            注册
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col items-center space-y-2">
        <p className="text-sm text-muted-foreground">
          已经有账户了？{' '}
          <Button variant="link" asChild className="p-0 h-auto">
            <Link href="/login">在此登录</Link>
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
};

export default RegisterForm;
