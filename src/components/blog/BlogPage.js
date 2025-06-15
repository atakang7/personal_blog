// src/components/blog/BlogPage.js
'use client';
import { motion } from 'framer-motion';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export default function BlogPage({ router, blog }) {
  return (
    <motion.div 
      className="max-w-4xl mx-auto px-4 py-8"
      initial="initial"
      animate="animate"
      variants={fadeIn}
    >
      <article className="prose lg:prose-xl dark:prose-invert mx-auto">
        {/* Hero Section */}
        <div className="relative w-full h-[400px] rounded-lg overflow-hidden mb-8">
          <img 
            src={blog.imageURL} 
            alt={blog.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 p-6 text-white">
            <h1 className="text-4xl font-bold mb-2">{blog.title}</h1>
            <p className="text-lg opacity-90">{blog.description}</p>
          </div>
        </div>

        {/* Author Info */}
        <div className="flex items-center gap-4 mb-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <img 
            src={blog.authorMetadata.avatarURL} 
            alt={blog.authorMetadata.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-semibold">
                {blog.authorMetadata.name}
              </h3>
              {blog.authorMetadata.isVerified && (
                <span className="text-blue-500">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </span>
              )}
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              {new Date(blog.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="blog-content">
          {JSON.parse(blog.content).map((section, index) => (
            <motion.section 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold mb-4">{section.title}</h2>
              <div 
                className="prose-lg"
                dangerouslySetInnerHTML={{ __html: section.content }}
              />
            </motion.section>
          ))}
        </div>

        {/* Keywords */}
        <div className="flex flex-wrap gap-2 my-8">
          {blog.search_keywords.split(',').map((keyword, index) => (
            <span 
              key={index}
              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm"
            >
              {keyword.trim()}
            </span>
          ))}
        </div>

        {/* Engagement Stats */}
        <div className="flex justify-between items-center py-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-6">
            <button className="flex items-center gap-2 hover:text-blue-500 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>{blog.likes}</span>
            </button>
            <span className="flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>{blog.views}</span>
            </span>
          </div>
          <div className="flex gap-4">
            {/* Social Share Buttons */}
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
              </svg>
            </button>
          </div>
        </div>
      </article>
    </motion.div>
  );
}
