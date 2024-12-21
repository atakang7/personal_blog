import React from 'react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import Search from '../Search';
import { Menu, Github } from 'lucide-react';

export default function AuthHeader({ user }) {
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
            <div className="hidden group-hover:block absolute left-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-100 py-1 min-w-[160px] z-[10000]">
              <Link 
                href="/about"
                className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 block"
              >
                About
              </Link>
              <div className="h-px bg-gray-100 my-1" />
              <button 
                onClick={() => signOut()}
                className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left"
              >
                Log out
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="flex-grow max-w-md">
            <Search />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
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