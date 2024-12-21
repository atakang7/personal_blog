// src/components/Header.js
'use client';
import { useSession } from 'next-auth/react';
import AdminHeader from './AdminHeader';
import AuthHeader from './AuthHeader';
import UnAuthHeader from './UnAuthHeader';

export default function Header() {
  const { data: session } = useSession();

  if (session?.user?.role === 'admin') {
    return <AdminHeader user={session.user} />;
  }

  if (session?.user) {
    return <AuthHeader user={session.user} />;
  }

  return <UnAuthHeader />;
}