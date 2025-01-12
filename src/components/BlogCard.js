import Link from 'next/link';
import { LazyImage } from './LazyImage';

const BlogCard = ({ post }) => {
  if (!post) return null;

  return (
    <article className="py-4 border-b border-gray-100 last:border-none">
      {/* Technical Image - Full width above content */}
      {post.imageURL && post?.isTechnical && (
        <div className="w-full mb-4">
          <LazyImage
            src={post.imageURL}
            alt={post.title}
            isTechnical={true}
          />
        </div>
      )}

      {/* Flex container for thumbnail and content */}
      <div className="flex gap-4">
        {/* Decorative Image - Thumbnail */}
        {post.imageURL && !post?.isTechnical && (
          <div className="hidden sm:block flex-shrink-0">
            <LazyImage
              src={post.imageURL}
              alt={post.title}
              isTechnical={false}
            />
          </div>
        )}

        {/* Content Section */}
        <div className="flex-grow min-w-0">
          {/* Title */}
          <Link href={`/blogs/${post.url}`}>
            <h2 className="text-lg md:text-xl font-medium text-blue-700 hover:underline cursor-pointer mb-2">
              {post.title}
            </h2>
          </Link>

          {/* Description */}
          <p className="text-gray-600 text-sm md:text-base line-clamp-2 mb-2">
            {post.description}
          </p>

          {/* Metadata */}
          <div className="flex items-center gap-2 text-gray-500 text-xs">
            <time dateTime={post.createdAt}>
              {new Date(post.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
            
            {post.likes > 0 && (
              <>
                <span className="text-gray-300">•</span>
                <span>{post.likes} likes</span>
              </>
            )}
            
            {post.comments?.length > 0 && (
              <>
                <span className="text-gray-300">•</span>
                <span>{post.comments.length} comments</span>
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;