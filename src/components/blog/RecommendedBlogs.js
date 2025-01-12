import React from 'react';
import BlogCard from '../BlogCard';
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
        setRecommendations(data);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [currentBlogId, currentBlogTags]);

  if (isLoading) {
    return (
      <section className="w-full mt-8 mx-5 rounded-lg border border-gray-200 bg-white">
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
    <section className="w-full mt-8 rounded-lg bg-white mb-5">
      <div className="p-6">
        <div className="space-y-4">
          {
            recommendations.map((post) => (
              <BlogCard key={post._id} post={post} />
            ))
          }
        </div>
      </div>
      <Link
        href="/blogs?search"
        className="text-gray-600 hover:text-gray-800 text-center block mt-4">
        search more
      </Link>
    </section>
  );
};

export default RecommendedBlogs;

