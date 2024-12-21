import React from 'react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import Search from '../Search';
import { Menu, Plus } from 'lucide-react';

export default function AdminHeader({ user }) {
  return (
    <header className="w-full sticky top-0 bg-white/80 backdrop-blur-sm border-b border-gray-100 z-[9999]">
      <nav className="w-full max-w-[1920px] mx-auto h-16 px-6 flex items-center justify-between relative">
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
              <button 
                onClick={() => signOut()}
                className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left"
              >
                Log out
              </button>
            </div>
          </div>

          {/* New Post Button */}
          <Link 
            href="/blogs/publish"
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <Plus className="h-5 w-5 text-gray-700" />
          </Link>

          {/* Search */}
          <div className="flex-grow max-w-md">
            <Search />
          </div>
        </div>

        {/* Right side - Blog Title */}
        <Link 
          href="/"
          className="text-lg font-medium text-gray-900 hover:text-gray-700 transition-colors"
        >
          Atakan's Blog
        </Link>
      </nav>
    </header>
  );
}