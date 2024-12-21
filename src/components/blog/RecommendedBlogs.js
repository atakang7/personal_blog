import React from 'react';
import { Clock, Eye, ThumbsUp, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const RecommendedBlogs = ({ currentBlogId, currentBlogTags }) => {
  const [recommendations, setRecommendations] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await fetch('/api/blogs/recommendations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            currentBlogId,
            tags: "ai",
            limit: 3
          }),
        });
        if (!response.ok) throw new Error('Failed to fetch recommendations');
        const data = await response.json();
        console.log(data)
        setRecommendations(data);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [currentBlogId, currentBlogTags]);

  const formatDate = (dateString) => (
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  );

  if (isLoading) {
    return (
      <section className="w-full mt-8 rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-6">Recommended Reading</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!recommendations.length) return null;

  return (
    <section className="w-full mt-8 rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Recommended Reading</h2>
          <Link 
            href={`/blogs?search=${encodeURIComponent(currentBlogTags.split(',')[0])}`}  
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 transition-colors"
          >
            View all
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          {recommendations.map((blog) => (
            <Link
              key={blog._id}
              href={`/blogs/${blog.url}`}
              className="group block"
            >
              <div className="relative aspect-[16/9] mb-3 overflow-hidden rounded-lg">
                {blog.imageURL ? (
                  <img
                    src={blog.imageURL}
                    alt={blog.title}
                    className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}
                {blog.tags?.[0] && (
                  <span className="absolute top-2 left-2 px-2 py-1 text-xs font-medium bg-white/90 rounded-full">
                    {blog.tags[0]}
                  </span>
                )}
              </div>
              
              <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {blog.title}
              </h3>
              
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
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecommendedBlogs;