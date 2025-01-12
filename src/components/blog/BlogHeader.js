import React from 'react';
import { BadgeCheck } from 'lucide-react';
import Link from 'next/link';

const BlogHeader = ({ blog }) => {
  return (
    <header className="w-full max-w-3xl mx-auto py-8">
      {/* Left-right container */}
      <div className="flex items-center gap-6">
        {/* Left side - Avatar */}
        <img 
          src={blog?.authorMetadata.avatarURL || '/img/avatar.webp'} 
          alt={`${blog?.authorMetadata.name}`}
          className="w-20 h-20 rounded-full object-cover shadow-md ring-2 ring-gray-100"
        />

        {/* Right side - Content */}
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-xl font-medium text-gray-900">
              {blog?.authorMetadata.name || blog?.authorMetadata.email}
            </h2>
            {blog?.authorMetadata.isVerified && (
              <BadgeCheck 
                className="h-5 w-5 text-gray-400" 
                aria-label="Verified Author"
              />
            )}
          </div>

          <time 
            dateTime={blog?.createdAt} 
            className="text-sm text-gray-500"
          >
            {new Date(blog?.createdAt).toLocaleDateString("en-US", {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
          </time>
        </div>
      </div>
    </header>
  );
};

export default BlogHeader;