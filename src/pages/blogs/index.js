import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Search, Loader2 } from 'lucide-react';
import BlogCard from "../../components/BlogCard";
import debounce from 'lodash/debounce';

export default function SearchPage() {
  const router = useRouter();
  const { search: initialSearchTerm } = router.query;
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm || '');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const performSearch = async (term) => {
    if (!term?.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/blogs/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ search: term }),
      });

      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError('Failed to perform search. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useCallback(
    debounce((term) => performSearch(term), 300),
    []
  );

  useEffect(() => {
    if (searchTerm) {
      debouncedSearch(searchTerm);
      
      const newUrl = `${window.location.pathname}?search=${encodeURIComponent(searchTerm)}`;
      window.history.replaceState({ path: newUrl }, '', newUrl);
    }
  }, [searchTerm, debouncedSearch]);

  useEffect(() => {
    if (initialSearchTerm) {
      setSearchTerm(initialSearchTerm);
    }
  }, [initialSearchTerm]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{searchTerm ? `Search: ${searchTerm}` : 'Search'} | Your Blog</title>
        <meta name="description" content="Search through our collection of articles" />
      </Head>

      {/* Search Header */}
      <div className="w-full bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="relative flex items-center w-full bg-gray-50 rounded-xl border border-gray-200 hover:border-gray-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all duration-200">
            <Search 
              className="absolute left-4 text-gray-400" 
              size={20} 
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 text-lg bg-transparent border-0 focus:ring-0 
                         placeholder:text-gray-500 rounded-xl"
              placeholder="Search articles..."
            />
            {loading && (
              <div className="absolute right-4">
                <Loader2 className="animate-spin text-blue-500" size={20} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results Container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Stats */}
        {searchTerm && !loading && (
          <div className="mb-6 text-sm text-blue-600 font-medium">
            {results.length} results for "{searchTerm}"
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 rounded-xl border border-red-100">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Results List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-xl border border-gray-200 p-6">
                <div className="h-4 bg-gray-100 rounded-full w-3/4 mb-3" />
                <div className="h-4 bg-gray-100 rounded-full w-1/2" />
              </div>
            ))}
          </div>
        ) : results.length > 0 ? (
          <div className="flex row mx-5 ui stackable grid">
            {results.map((post) => (
              <div key={post._id}>
                <BlogCard post={post} />
              </div>
            ))}
          </div>
        ) : searchTerm ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200 max-w-2xl mx-auto">
            <Search size={32} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No results found</h3>
            <p className="text-sm text-gray-500">
              Try adjusting your search terms or browse our latest posts
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}