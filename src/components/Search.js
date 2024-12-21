'use client';

import { useState, useEffect, useCallback, memo } from 'react';
import { Search as SearchIcon, X, Loader2, Clock, Eye, ThumbsUp } from 'lucide-react';
import Link from 'next/link';

// Memoized search result item component
const SearchResultItem = memo(({ blog }) => {
  const formatDate = (dateString) => (
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  );

  return (
    <Link 
      href={`/blogs/${blog.url}`}
      key={blog._id}
      className="block p-4 hover:bg-gray-50 transition-colors"
    >
      <div className="flex gap-4">
        {blog.imageURL && (
          <img 
            src={blog.imageURL} 
            alt={blog.title}
            className="w-24 h-24 object-cover rounded-lg"
            loading="lazy"
          />
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-medium text-gray-900 mb-1 truncate">
            {blog.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 mb-2">
            {blog.description}
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {formatDate(blog.publishedAt)}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {blog.views}
            </span>
            <span className="flex items-center gap-1">
              <ThumbsUp className="w-4 h-4" />
              {blog.likes}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
});

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

  const debouncedSearch = useCallback(
    (() => {
      let timeoutId;
      return (query) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => performSearch(query), 300);
      };
    })(),
    [performSearch]
  );

  useEffect(() => {
    if (!isOpen) return;
    
    // "make warm-up request"
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

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setSearchQuery('');
    setResults([]);
  }, []);

  const handleSearchChange = useCallback((e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  }, [debouncedSearch]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="Open search"
      >
        <SearchIcon className="w-5 h-5" />
      </button>

      {isOpen && (
        <div 
          className="fixed inset-0 z-100 flex items-start justify-center pt-[15vh] px-4 bg-white/98"
          onClick={handleClose}
          style={{zIndex: 9999}}
        >
          <div 
            className="w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative mb-4">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search posts..."
                className="w-full pl-12 pr-4 py-4 text-lg rounded-xl border shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
                autoFocus
              />
              <button
                onClick={handleClose}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close search"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {(searchQuery || isLoading || results.length > 0) && (
              <div className="max-h-[60vh] overflow-y-auto rounded-xl bg-white shadow-sm border">
                <div className="divide-y">
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                    </div>
                  ) : results.length > 0 ? (
                    results.map((blog) => (
                      <SearchResultItem key={blog._id} blog={blog} />
                    ))
                  ) : searchQuery ? (
                    <p className="text-center text-gray-500 py-8">No results found</p>
                  ) : null}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}