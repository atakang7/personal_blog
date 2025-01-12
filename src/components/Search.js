"use client";
import { useState, useEffect, useCallback, memo } from 'react';
import { Search as SearchIcon, X, Loader2 } from 'lucide-react';
import Link from 'next/link';

const SearchResultItem = memo(({ blog }) => (
  <Link 
    href={`/blogs/${blog.url}`}
    className="flex items-start gap-3 p-4 hover:bg-neutral-50/80 transition-colors"
  >
    {blog.imageURL && (
      <img 
        src={blog.imageURL} 
        alt=""
        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
        loading="lazy"
      />
    )}
    <div className="min-w-0 flex-1">
      <h3 className="font-medium text-[15px] text-neutral-900 truncate mb-1">
        {blog.title}
      </h3>
      <p className="text-sm text-neutral-600 line-clamp-2 mb-2">
        {blog.description}
      </p>
      <div className="flex items-center gap-3 text-xs text-neutral-500">
        <time>{new Date(blog.publishedAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })}</time>
        <span className="w-1 h-1 rounded-full bg-neutral-300" />
        <span>{blog.views} views</span>
        <span className="w-1 h-1 rounded-full bg-neutral-300" />
        <span>{blog.likes} likes</span>
      </div>
    </div>
  </Link>
));

SearchResultItem.displayName = 'SearchResultItem';

export default function Search() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const performSearch = useCallback(async (query) => {
    if (!query?.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/blogs/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ search: query }),
      });
      
      if (!response.ok) throw new Error('Search failed');
      setResults(await response.json());
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    
    // Warm-up request
    performSearch("ci-cd");

    const handleEscape = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const handleSearchChange = useCallback((e) => {
    const query = e.target.value;
    setSearchQuery(query);
    const timeoutId = setTimeout(() => performSearch(query), 300);
    return () => clearTimeout(timeoutId);
  }, [performSearch]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
        aria-label="Search posts"
      >
        <SearchIcon className="w-5 h-5 text-neutral-700" />
      </button>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-white/95 backdrop-blur-sm z-50 transition-all duration-200"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="relative max-w-2xl mx-auto pt-8 px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative mb-4">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search posts..."
                className="w-full h-12 pl-10 pr-10 rounded-xl bg-white border border-neutral-200 
                        focus:border-neutral-300 focus:ring-1 focus:ring-neutral-200 
                        outline-none transition-all"
                autoFocus
              />
              <button
                onClick={() => setIsOpen(false)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-neutral-100 rounded-md transition-colors"
                aria-label="Close search"
              >
                <X className="w-5 h-5 text-neutral-500" />
              </button>
            </div>

            <div className="relative">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-5 h-5 animate-spin text-neutral-400" />
                </div>
              ) : results.length > 0 ? (
                <div className="rounded-xl border border-neutral-200 divide-y divide-neutral-200 bg-white">
                  {results.map((blog) => (
                    <SearchResultItem key={blog._id} blog={blog} />
                  ))}
                </div>
              ) : searchQuery ? (
                <div className="text-center py-8 text-neutral-600">
                  No results found
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </>
  );
}