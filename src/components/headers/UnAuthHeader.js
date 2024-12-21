import React from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import Search from '../Search';
import { Menu, Github } from 'lucide-react';

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export default function UnAuthHeader() {
  const handleSignIn = () => {
    signIn('google', { callbackUrl: '/' });
  };

  return (
    <header className="w-full sticky top-0 bg-white/80 backdrop-blur-sm border-b border-gray-100 z-[9999]">
      <nav className="w-full max-w-[1920px] mx-auto h-16 px-6 flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center gap-4">
          {/* Menu Dropdown */}
          <div className="relative group">
            <button 
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Menu"
            >
              <Menu className="h-5 w-5 text-gray-700" />
            </button>
            <div className="hidden group-hover:block absolute left-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-100 py-2 min-w-[240px] z-[10000]">
              <Link 
                href="/about"
                className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 block"
              >
                About
              </Link>
              <div className="h-px bg-gray-100 my-2" />
              <div className="px-3">
                <button 
                  onClick={handleSignIn}
                  className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg bg-white hover:bg-gray-50 border border-gray-200 transition-colors group"
                >
                  <GoogleIcon />
                  <span className="text-sm font-medium text-gray-700">
                    Sign in with Google
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="flex-grow max-w-md">
            <Search />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Primary Sign In Button */}
          <button 
            onClick={handleSignIn}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white hover:bg-gray-50 border border-gray-200 transition-all shadow-sm hover:shadow"
          >
            <GoogleIcon />
            <span className="text-sm font-medium text-gray-700">Sign in</span>
          </button>

          {/* GitHub Link */}
          <Link 
            href="https://github.com/AtakanG7/blog/tree/master"
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            title="View on GitHub"
          >
            <Github className="h-5 w-5 text-gray-700" />
          </Link>

          {/* Logo/Home Link */}
          <Link 
            href="/" 
            className="text-lg font-medium text-gray-900 hover:text-gray-700 transition-colors"
            title="Atakan Gül"
          >
            AG
          </Link>
        </div>
      </nav>
    </header>
  );
}