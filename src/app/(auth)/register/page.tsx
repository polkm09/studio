
import RegisterForm from '@/components/auth/RegisterForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '注册 - FEIWU HTML Studio',
};

export default function RegisterPage() {
  return <RegisterForm />;
}
