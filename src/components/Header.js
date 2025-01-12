import Link from 'next/link';
import Search from './Search';
import { Github } from 'lucide-react';

export default function Header() {
  return (
    <header className="w-full sticky top-0 bg-white/80 backdrop-blur-sm border-b border-neutral-200 z-50" > 
      <nav className="w-full max-w-8xl mx-auto h-16 px-6 flex items-center justify-between" style={{maxWidth: '1200px'}}>
        {/* Left side - Branding */}
        <Link href="/" className="flex flex-col">
          <h1 className="text-xl font-semibold text-neutral-900">
            Atakan Gül
          </h1>
          <span className="text-sm text-neutral-500">
            Software Engineer
          </span>
        </Link>

        {/* Right side - Actions */}
        <div className="flex items-center gap-6 ">
          {/* View Source link */}
          <Link 
            href="https://github.com/AtakanG7/blog/tree/master"
            className="flex items-center gap-2 text-neutral-700 hover:text-neutral-900 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="h-5 w-5 " />
            <span className="text-sm font-medium hidden sm:inline">
              View Source
            </span>
          </Link>

          {/* Search */}
          <Search />
        </div>
      </nav>
    </header>
  );
}