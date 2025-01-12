import { useState } from 'react';
import { ThumbsUp, MessageCircle, Eye } from 'lucide-react';

const BlogFooter = ({ blog }) => {
  const [likes, setLikes] = useState(blog?.likes || 0);

  const handleLike = async () => {
    try {
      const response = await fetch('/api/blogs/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blogId: blog?._id })
      });
      
      if (response.ok) {
        setLikes(prev => prev + 1);
      }
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  return (
    <footer className="py-10 px-2">
      {/* Title and Date */}
      <div className="mb-8">
        <h1 className="text-xl text-gray-800 mb-2" style={{ wordBreak: 'break-all'}}>
          {blog?.title}
        </h1>
        <time className="text-sm text-gray-400">
          {new Date(blog?.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </time>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-10">
        {blog?.search_keywords?.split(',')
          .slice(0, 5)
          .map(key => key.trim())
          .filter(key => key.length > 0 && key.length <= 30)
          .map((keyword, index) => (
            <a
              key={index}
              href={`/blogs?search=${encodeURIComponent(keyword)}`}
              className="px-4 py-1.5 text-xs text-gray-500 bg-gray-50 
                       rounded-full hover:bg-gray-100 transition-colors"
            >
              {keyword}
            </a>
          ))}
      </div>

      {/* Engagement Metrics - Now with increased spacing */}
      <div className="flex justify-between items-center px-16 max-w-2xl mx-auto">
        <button 
          onClick={handleLike}
          className="flex flex-col items-center"
        >
          <ThumbsUp className="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors mb-1.5" />
          <span className="text-sm text-gray-500">{likes}</span>
        </button>

        <div className="flex flex-col items-center">
          <MessageCircle className="w-5 h-5 text-gray-400 mb-1.5" />
          <span className="text-sm text-gray-500">
            {blog?.comments?.length || 0}
          </span>
        </div>

        <div className="flex flex-col items-center">
          <Eye className="w-5 h-5 text-gray-400 mb-1.5" />
          <span className="text-sm text-gray-500">
            {blog?.views || 0}
          </span>
        </div>
      </div>
    </footer>
  );
};

export default BlogFooter;