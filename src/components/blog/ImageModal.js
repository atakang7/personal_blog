import { X, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export const ImageModal = ({ image, onClose, onNext, onPrevious, hasNext, hasPrevious, loading }) => {
  const [isMetadataVisible, setIsMetadataVisible] = useState(false);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowRight' && hasNext && !loading) onNext();
    if (e.key === 'ArrowLeft' && hasPrevious) onPrevious();
  }, [onClose, onNext, onPrevious, hasNext, hasPrevious, loading]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [handleKeyDown]);

  return (
    <div className="fixed inset-0 bg-white/95 dark:bg-black/95 backdrop-blur-md z-50 flex md:flex-row flex-col">
      {/* Main content area */}
      <div className="relative flex-1 flex items-center justify-center">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>

        {/* Mobile metadata toggle */}
        <button
          onClick={() => setIsMetadataVisible(!isMetadataVisible)}
          className="md:hidden absolute top-4 left-4 z-10 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm font-medium text-gray-600 dark:text-gray-300"
        >
          {isMetadataVisible ? 'Hide Info' : 'Show Info'}
        </button>

        {/* Image container */}
        <div className="relative w-full h-full flex items-center justify-center p-4">
          <Image
            src={image.url}
            alt={image.title}
            width={1200}
            height={800}
            className="object-contain w-full h-full max-h-[85vh] rounded-lg"
            priority
          />

          {/* Navigation buttons */}
          {hasPrevious && (
            <button
              onClick={onPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/80 dark:bg-gray-900/80 hover:bg-white dark:hover:bg-gray-900 rounded-full shadow-lg transition-all"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </button>
          )}
          {hasNext && !loading && (
            <button
              onClick={onNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/80 dark:bg-gray-900/80 hover:bg-white dark:hover:bg-gray-900 rounded-full shadow-lg transition-all"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </button>
          )}
        </div>
      </div>

      {/* Metadata sidebar */}
      <div className={`
        bg-white dark:bg-gray-900 border-l border-gray-100 dark:border-gray-800
        md:w-[400px] md:block md:relative
        fixed inset-x-0 bottom-0 
        transition-transform duration-300 ease-in-out
        ${isMetadataVisible ? 'translate-y-0' : 'translate-y-full md:translate-y-0'}
        max-h-[60vh] md:max-h-screen overflow-y-auto
        shadow-lg md:shadow-none
      `}>
        <div className="px-6 py-8 space-y-6">
          {/* Title */}
          <div>
            <h2 className="text-xl text-gray-900 dark:text-white font-medium mb-2">{image.title}</h2>
            <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
              <span>{image.views.toLocaleString()} views</span>
              <span>•</span>
              <span>{image.likes} likes</span>
              {image.isTechnical && (
                <>
                  <span>•</span>
                  <span className="text-blue-600 dark:text-blue-400">Technical</span>
                </>
              )}
            </div>
          </div>

          {/* Description */}
          {image.description && (
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              {image.description}
            </p>
          )}

          {/* Related links */}
          {image.relatedLinks && image.relatedLinks.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Related Links</h4>
              {image.relatedLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 -mx-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors group"
                  onClick={e => e.stopPropagation()}
                >
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white truncate">
                    {link.text}
                  </span>
                </a>
              ))}
            </div>
          )}

          {/* Article link */}
          <Link
            href={image.blogUrl}
            className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-gray-900 dark:text-white text-sm font-medium transition-colors"
            onClick={e => e.stopPropagation()}
          >
            Read Full Article
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};