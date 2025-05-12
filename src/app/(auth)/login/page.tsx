
import LoginForm from '@/components/auth/LoginForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '登录 - FEIWU Studio',
};

export default function LoginPage() {
  return <LoginForm />;
}
