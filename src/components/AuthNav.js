// src/components/AuthNav.js
'use client';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function AuthNav() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <img src={session.user.image} alt="Profile" className="w-8 h-8 rounded-full"/>
        <span>{session.user.name}</span>
        <button onClick={() => signOut()} className="bg-red-500 text-white px-4 py-2 rounded">
          Sign Out
        </button>
      </div>
    );
  }
  return (
    <button onClick={() => signIn('google')} className="bg-white border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white px-4 py-2 rounded">
      <i className="fab fa-google mr-2" />
      Sign in with Google
    </button>
  );
}
