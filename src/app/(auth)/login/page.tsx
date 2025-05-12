
import LoginForm from '@/components/auth/LoginForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '登录 - 飞舞HTML游乐场',
};

export default function LoginPage() {
  return <LoginForm />;
}
