import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useInView } from 'react-intersection-observer';
import { ImageModal } from '@/components/blog/ImageModal';

// Configuration for initial image display and subsequent loading
const INITIAL_SERVER_RENDER_COUNT = 25; // Number of images to render on the server/build
const IMAGES_PER_ROW_ESTIMATE = 4; // Estimate for prioritizing above-the-fold images
const LOAD_MORE_BATCH_SIZE = 12; // Number of images to load on scroll

export default function Gallery({ initialImages, sitemapContent }) {
  // Initialize displayedImages with the first INITIAL_SERVER_RENDER_COUNT images for SSR/SSG
  const [displayedImages, setDisplayedImages] = useState(
    initialImages.slice(0, INITIAL_SERVER_RENDER_COUNT)
  );
  const [loading, setLoading] = useState(false);
  // Initialize hasMore based on whether there are more images beyond the initial set
  const [hasMore, setHasMore] = useState(initialImages.length > INITIAL_SERVER_RENDER_COUNT);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  
  const { ref, inView } = useInView({
    threshold: 0.1, // Trigger when the element is 10% visible
    // triggerOnce: true, // Consider if you want it to stop observing after first trigger and rely on hasMore
  });

  // This useEffect handles loading more images when the sentinel element (ref) comes into view
  useEffect(() => {
    if (inView && hasMore && !loading) {
      loadMoreImages();
    }
  }, [inView, hasMore, loading]); // Dependencies for the effect

  const loadMoreImages = async () => {
    // No need to return a promise if not awaited externally, but fine for consistency
    setLoading(true);
    const currentLength = displayedImages.length;
    const nextBatch = initialImages.slice(
      currentLength,
      currentLength + LOAD_MORE_BATCH_SIZE
    );

    if (nextBatch.length === 0) {
      setHasMore(false);
      setLoading(false);
      return;
    }

    // Simulate a delay if needed for testing loading states, otherwise remove setTimeout
    // setTimeout(() => {
      setDisplayedImages(prev => [...prev, ...nextBatch]);
      if (currentLength + nextBatch.length >= initialImages.length) {
        setHasMore(false);
      }
      setLoading(false);
    // }, 500); // Example delay
  };

  const handleImageClick = (e, index) => {
    e.preventDefault();
    setSelectedImageIndex(index);
  };

  const handleNext = async () => {
    // Proactively load more images if nearing the end of the currently displayed set in the modal
    if (selectedImageIndex === displayedImages.length - 2 && hasMore && !loading) {
      await loadMoreImages(); // Ensure loadMoreImages is thenable if awaited
    }
    setSelectedImageIndex(prev => 
      prev < displayedImages.length - 1 ? prev + 1 : prev
    );
  };

  const handlePrevious = () => {
    setSelectedImageIndex(prev => 
      prev > 0 ? prev - 1 : prev
    );
  };

  return (
    <>
      <Head>
        <title>Atakan Gül's Image Gallery - Software Development Journey</title>
        <meta 
          name="description" 
          content="Browse through Atakan Gül's technical blog images showcasing software development, DevOps practices, and engineering projects. First 25 images are pre-loaded for optimal experience and SEO."
        />
        <link rel="canonical" href="https://atakangul.com/gallery" />
      </Head>

      {/* The sitemap content embedded this way is non-standard for SEO.
          It's better to have a sitemap.xml file submitted via Google Search Console.
          However, keeping it as per your original code. */}
      <div 
        style={{ display: 'none' }}
        dangerouslySetInnerHTML={{ __html: sitemapContent }}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* These hidden elements are not ideal for SEO if they contain primary keywords. 
            Consider making them visible or integrating their content elsewhere if important. */}
        <h1 hidden className="text-3xl font-bold mb-8">Atakan Gül's Technical Gallery</h1>
        <p hidden className="text-gray-600 mb-8">
          A visual journey through software development, DevOps, and technical projects.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayedImages.map((image, index) => (
            <div 
              key={`${image.url}-${index}`} 
              className="relative group cursor-pointer"
              onClick={(e) => handleImageClick(e, index)}
            >
              <div className="relative w-full bg-gray-100 rounded-lg overflow-hidden aspect-[4/3]"> {/* Added aspect ratio for placeholder */}
                <Image
                  src={image.url}
                  // Prioritize loading for the first few images (e.g., first row)
                  // These will be loaded eagerly. Other images default to lazy loading.
                  priority={index < IMAGES_PER_ROW_ESTIMATE} 
                  alt={`${image.title || 'Gallery image'} - Technical blog image by Atakan Gül`}
                  width={400} // Intrinsic width of the image source if known, otherwise desired display width
                  height={300} // Intrinsic height, maintain aspect ratio
                  className="w-full h-full object-contain hover:opacity-75 transition-opacity duration-300" // Ensure image fills container
                  style={{ display: 'block' }}
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw" // Example sizes, adjust based on your grid
                />
              </div>
              <div className="mt-2 space-y-1">
                <h3 className="text-sm font-medium text-gray-900">{image.title || 'Untitled Image'}</h3>
                <p className="text-xs text-gray-500">
                  {new Date(image.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {loading && (
          <div className="flex justify-center mt-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          </div>
        )}

        {!loading && !hasMore && displayedImages.length > 0 && (
          <p className="text-center text-gray-500 mt-8">
            You've seen all the images!
          </p>
        )}
        
        {/* Sentinel element for Intersection Observer to trigger loading more */}
        {hasMore && <div ref={ref} className="h-10 w-full" />}

      </div>

      {selectedImageIndex !== null && displayedImages[selectedImageIndex] && (
        <ImageModal 
          image={displayedImages[selectedImageIndex]}
          onClose={() => setSelectedImageIndex(null)}
          onNext={handleNext}
          onPrevious={handlePrevious}
          hasNext={selectedImageIndex < displayedImages.length - 1 || (selectedImageIndex === displayedImages.length -1 && hasMore)}
          hasPrevious={selectedImageIndex > 0}
          loading={loading && selectedImageIndex === displayedImages.length -1 } // Show loading in modal if it's trying to load the next image
        />
      )}
    </>
  );
}

// getStaticProps remains largely the same. It already fetches all images.
// Ensure extractImageUrls and extractLinksFromContent are robust.
export async function getStaticProps() {
  try {
    // Ensure the API endpoint is correct and accessible during build
    const res = await fetch('https://atakangul.com/api/blogs'); 
    if (!res.ok) {
      throw new Error(`Failed to fetch blogs: ${res.status}`);
    }
    const data = await res.json();
    const blogs = data?.blogs || []; // Ensure blogs is an array
    
    const allImages = blogs.flatMap(blog => {
      if (!blog || typeof blog.content !== 'string') return []; // Basic validation
      const imageUrls = extractImageUrls(blog.content);
      const links = extractLinksFromContent(blog.content);
      if (!imageUrls.length) return [];
      
      return imageUrls.map(url => ({
        url: url,
        title: blog.title || 'Untitled Blog Image',
        blogUrl: `/blogs/${blog.url || ''}`,
        description: blog.description || '',
        date: blog.publishedAt ? new Date(blog.publishedAt).toISOString() : new Date().toISOString(),
        views: blog.views || 0,
        likes: blog.likes || 0,
        isTechnical: blog.isTechnical,
        isProject: blog.isProject,
        relatedLinks: links
      }));
    }).filter(Boolean); // Filter out any null/undefined entries

    // It's good practice to limit the number of images in the inline sitemap if it gets too large.
    // However, for the purpose of this request, we'll include all fetched images.
    const sitemapContent = `
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
              xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
        <url>
          <loc>https://atakangul.com/gallery</loc>
          <lastmod>${new Date().toISOString()}</lastmod> {/* Add lastmod for the gallery page itself */}
          <changefreq>weekly</changefreq> {/* Adjust as needed */}
          <priority>0.8</priority>
          ${allImages.map(img => `
            <image:image>
              <image:loc>${img.url}</image:loc>
              <image:title>${xmlEscape(img.title)}</image:title>
              <image:caption>${xmlEscape(`By Atakan Gül - ${img.title}`)}</image:caption>
              <image:geo_location>Istanbul, Turkey</image:geo_location>
              <image:license>https://atakangul.com/license</image:license>
            </image:image>`).join('')}
        </url>
      </urlset>
    `;
    
    // console.log(`Fetched ${allImages.length} images for the gallery.`);

    return {
      props: {
        // Ensure initialImages is stringified and parsed if it contains complex objects
        // not directly serializable by Next.js (though simple objects/arrays are fine).
        // JSON.parse(JSON.stringify(allImages)) is a common way to ensure serializability.
        initialImages: JSON.parse(JSON.stringify(allImages)), 
        sitemapContent,
      },
      revalidate: 3600, // Revalidate every hour, adjust as needed
    };
  } catch (error) {
    console.error('Error in getStaticProps for Gallery:', error);
    return {
      props: {
        initialImages: [],
        sitemapContent: '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>', // Provide a minimal valid sitemap
      },
      revalidate: 60, // Revalidate sooner if an error occurred
    };
  }
}

// Helper function to escape XML characters for sitemap
const xmlEscape = (str) => {
  return str.replace(/[<>&"']/g, (match) => {
    switch (match) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '"': return '&quot;';
      case "'": return '&apos;';
      default: return match;
    }
  });
};


const extractImageUrls = (blogContent) => {
  if (typeof blogContent !== 'string') return [];
  try {
    // Assuming blogContent might be a JSON string of an array of objects
    // or just plain HTML/Markdown text. Adjust parsing as needed.
    let parsableContent = blogContent;
    if (blogContent.trim().startsWith('[') && blogContent.trim().endsWith(']')) {
        try {
            const contentArray = JSON.parse(blogContent);
            parsableContent = contentArray.map(item => item.content || '').join(' ');
        } catch (e) {
            // If JSON parsing fails, assume it's plain text/HTML
            // console.warn('Could not parse blogContent as JSON array, treating as plain text for image extraction:', e);
        }
    }
    
    const imageUrls = [];
    // Regex for src attributes in <img> tags or markdown images ![]()
    // Specifically targeting your static domain:
    const regex = /(?:src\s*=\s*["'](https:\/\/static\.atakangul\.com\/uploads\/[^"']+)["'])|(?:\!\[[^\]]*\]\((https:\/\/static\.atakangul\.com\/uploads\/[^\)\s]+)\))/g;
    let match;
    while ((match = regex.exec(parsableContent)) !== null) {
      imageUrls.push(match[1] || match[2]);
    }
    return [...new Set(imageUrls)]; // Deduplicate
  } catch (error) {
    console.error('Error extracting image URLs:', error);
    return [];
  }
};

const extractLinksFromContent = (blogContent) => {
  if (typeof blogContent !== 'string') return [];
  try {
    let parsableContent = blogContent;
    if (blogContent.trim().startsWith('[') && blogContent.trim().endsWith(']')) {
        try {
            const contentArray = JSON.parse(blogContent);
            parsableContent = contentArray.map(item => item.content || '').join(' ');
        } catch (e) {
            // console.warn('Could not parse blogContent as JSON array, treating as plain text for link extraction:', e);
        }
    }

    const links = [];
    // Regex for markdown links [text](url) and HTML href attributes
    const regex = /(?:\[([^\]]+)\]\((https?:\/\/[^\s\)]+)\))|(?:href\s*=\s*["'](https?:\/\/[^\s"]+)["'](?:[^>]*>([^<]+)<\/a>)?)/g;
    let match;
    while ((match = regex.exec(parsableContent)) !== null) {
      links.push({
        url: match[2] || match[3], 
        text: match[1] || match[4] || (match[2] || match[3]) // text from markdown, or anchor text, or URL itself
      });
    }
    // Deduplicate based on URL, keeping the first encountered text
    const uniqueLinks = Array.from(new Map(links.map(link => [link.url, link])).values());
    return uniqueLinks;
  } catch (error) {
    console.error('Error extracting links from content:', error);
    return [];
  }
};