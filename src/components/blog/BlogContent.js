// components/blog/BlogContent.js
'use client';
import DOMPurify from 'dompurify';
import { useState, useEffect } from 'react';

export default function BlogContent({ content }) {
  const [blogContent, setBlogContent] = useState(JSON.parse(content)[0]["content"]);
  const [error, setError] = useState(null);

  if (error) {
    return (
      <div className="mb-8 px-2 text-red-600">
        Error loading content. Please try again later.
      </div>
    );
  }

  if (!content) {
    return (
      <div className="mb-8 px-2 text-gray-600">
        No content available.
      </div>
    );
  }

  return (
      <div  
        className='editor-content-styling'
        dangerouslySetInnerHTML={{ __html: blogContent }}
      />
  );
}