// BlogContent.js
import { useEffect, useRef } from 'react';
import Image from 'next/image';

export default function BlogContent({ content }) {
  const contentRef = useRef(null);
  
  useEffect(() => {
    if (!contentRef.current) return;

    const processImages = () => {
      const images = contentRef.current.querySelectorAll('img:not(.lazy-processed)');
      
      images.forEach(img => {
        // Skip already processed images
        if (img.classList.contains('lazy-processed')) return;
        
        // Store original src
        const originalSrc = img.getAttribute('src');
        if (!originalSrc) return;
  
        // Setup lazy loading attributes
        img.setAttribute('data-src', originalSrc);
        img.setAttribute('src', '/images/placeholder.jpg'); // Your placeholder
        img.classList.add('lazy-image', 'lazy-processed');
        
        // Add loading animation class
        img.classList.add('image-loading');
        
        // Optional: Add loading animation placeholder
        const placeholder = document.createElement('div');
        placeholder.classList.add('image-placeholder');
        img.parentNode.insertBefore(placeholder, img);
      });
    };
  
    // Setup intersection observer for lazy loading
    const setupLazyLoading = () => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target;
              const dataSrc = img.getAttribute('data-src');
              
              if (dataSrc) {
                // Create new image to preload
                const tempImage = new window.Image();
                tempImage.onload = () => {
                  img.src = dataSrc;
                  img.classList.remove('lazy-image', 'image-loading');
                  img.classList.add('image-loaded');
                  
                  // Remove placeholder if it exists
                  const placeholder = img.previousSibling;
                  if (placeholder?.classList?.contains('image-placeholder')) {
                    placeholder.remove();
                  }
                };
                tempImage.src = dataSrc;
                
                observer.unobserve(img);
              }
            }
          });
        },
        {
          rootMargin: '50px',
          threshold: 0.1
        }
      );
  
      const lazyImages = contentRef.current.querySelectorAll('.lazy-image');
      lazyImages.forEach(img => observer.observe(img));
  
      return observer;
    };

    processImages();
    const observer = setupLazyLoading();

    // Cleanup
    return () => {
      observer.disconnect();
    };
  }, [contentRef]);


  const loadContent = () => {
      let processedContent = '';
      try {
        const parsedContent = JSON.parse(content)[0].content;
        processedContent = parsedContent;
      } catch (err) {
        console.error('Error parsing content:', err);
        return (
          <div className="mb-8 px-2 text-red-600">
            Error loading content. Please try again later.
          </div>
        );
      }
      return processedContent;
  }

  const processedContent = loadContent();
  
  if (!content) {
    return (
      <div className="mb-8 px-2 text-gray-600">
        No content available.
      </div>
    );
  }

  return (
    <div 
      ref={contentRef}
      className="editor-content-styling"
      dangerouslySetInnerHTML={{ __html: processedContent }}
    >
      {contentRef.current?.querySelectorAll('img').forEach(img => {
        return (
          <Image
            src={img.src}
            alt={img.alt}
            className="max-w-full h-auto"
            priority
          />
        );
      })}
    </div>
  );
}
