import { useEffect, useRef } from 'react';

export default function BlogContent({ content }) {
  const contentRef = useRef(null);

  useEffect(() => {
    if (!contentRef.current) return;

    const processImages = () => {
      const images = contentRef.current.querySelectorAll('img:not(.lazy-processed)');
      images.forEach(img => {
        if (img.classList.contains('lazy-processed')) return;

        const originalSrc = img.getAttribute('src');
        if (!originalSrc) return;

        img.setAttribute('data-src', originalSrc);
        img.setAttribute('src', '/images/placeholder.jpg'); // Customize this path
        img.classList.add('lazy-image', 'lazy-processed', 'image-loading');

        const placeholder = document.createElement('div');
        placeholder.classList.add('image-placeholder');
        img.parentNode.insertBefore(placeholder, img);
      });
    };

    const setupLazyLoading = () => {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            const dataSrc = img.getAttribute('data-src');
            if (dataSrc) {
              const tempImage = new window.Image();
              tempImage.onload = () => {
                img.src = dataSrc;
                img.classList.remove('lazy-image', 'image-loading');
                img.classList.add('image-loaded');
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
      }, {
        rootMargin: '50px',
        threshold: 0.1
      });

      const lazyImages = contentRef.current.querySelectorAll('.lazy-image');
      lazyImages.forEach(img => observer.observe(img));

      return observer;
    };

    processImages();
    const observer = setupLazyLoading();

    return () => {
      observer.disconnect();
    };
  }, [content]);

  if (!content) {
    return <div className="text-gray-500">No content provided.</div>;
  }

  return (
    <div
      ref={contentRef}
      className="blog-content"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
