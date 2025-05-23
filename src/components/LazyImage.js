////////////////////////////////////////////////////////////////////////////////
// components/LazyImage.jsx
////////////////////////////////////////////////////////////////////////////////
import React, { useState, useEffect, useRef } from "react";

export const LazyImage = ({ src, alt, className = "", isTechnical = false }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef();
  const observerRef = useRef();

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsInView(true);
          observerRef.current.disconnect();
        }
      },
      { rootMargin: "50px 0px", threshold: 0.1 }
    );

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const containerClasses = isTechnical
    ? "w-full aspect-[16/10]"
    : "w-20 h-20";

  const imageClasses = isTechnical
    ? "object-contain bg-white"
    : "object-cover";

  return (
    <div ref={imgRef} className={`relative ${containerClasses} ${className}`}>
      {/* Static Placeholder */}
      <div
        className={`absolute inset-0 bg-gray-100 animate-pulse ${
          isTechnical ? "rounded" : "rounded-md"
        }`}
      />
      {isInView && (
        <img
          src={src}
          alt={alt}
          className={`absolute inset-0 w-full h-full ${imageClasses} transition-opacity duration-300 ${
            isLoaded ? "opacity-100" : "opacity-0"
          } ${isTechnical ? "rounded" : "rounded-md"}`}
          onLoad={() => setIsLoaded(true)}
        />
      )}
    </div>
  );
};