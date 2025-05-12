
import RegisterForm from '@/components/auth/RegisterForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '注册 - 飞舞HTML游乐场',
};

export default function RegisterPage() {
  return <RegisterForm />;
}
