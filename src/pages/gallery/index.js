import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useInView } from 'react-intersection-observer';
import { ImageModal } from '@/components/blog/ImageModal';

export default function Gallery({ initialImages, sitemapContent }) {
  const [displayedImages, setDisplayedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const { ref, inView } = useInView();

  useEffect(() => {
    setDisplayedImages(initialImages.slice(0, 1))
  }, [initialImages]);

  useEffect(() => {
    if (inView && hasMore && !loading) {
      loadMoreImages();
    }
  }, [inView]);

  const loadMoreImages = async () => {
    return new Promise((resolve) => {
      setLoading(true);
      const nextBatch = initialImages.slice(displayedImages.length, displayedImages.length + 12);
      
      if (nextBatch.length === 0) {
        setHasMore(false);
        setLoading(false);
        resolve();
        return;
      }

      setDisplayedImages(prev => [...prev, ...nextBatch]);
      setLoading(false);
      resolve();
    });
  };

  const handleImageClick = (e, index) => {
    e.preventDefault();
    setSelectedImageIndex(index);
  };

  const handleNext = async () => {
    if (selectedImageIndex === displayedImages.length - 2 && hasMore) {
      await loadMoreImages();
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
          content="Browse through Atakan Gül's technical blog images showcasing software development, DevOps practices, and engineering projects."
        />
        <link rel="canonical" href="https://atakangul.com/gallery" />
      </Head>

      <div 
        style={{ display: 'none' }}
        dangerouslySetInnerHTML={{ __html: sitemapContent }}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
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
              <div className="relative w-full bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={image.url}
                  loading='lazy'
                  alt={`${image.title} - Technical blog image by Atakan Gül`}
                  width={400}
                  height={300}
                  className="w-full h-auto object-contain hover:opacity-75 transition-opacity duration-300"
                  style={{ display: 'block' }}
                />
              </div>
              <div className="mt-2 space-y-1">
                <h3 className="text-sm font-medium text-gray-900">{image.title}</h3>
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

        {!hasMore && displayedImages.length > 0 && (
          <p className="text-center text-gray-500 mt-8">
            You've seen all the images!
          </p>
        )}

        <div ref={ref} className="h-10 w-full" />
      </div>

      {selectedImageIndex !== null && (
        <ImageModal 
          image={displayedImages[selectedImageIndex]}
          onClose={() => setSelectedImageIndex(null)}
          onNext={handleNext}
          onPrevious={handlePrevious}
          hasNext={selectedImageIndex < displayedImages.length - 1}
          hasPrevious={selectedImageIndex > 0}
          loading={loading}
        />
      )}
    </>
  );
}

export async function getStaticProps() {
  try {
    const res = await fetch('https://atakangul.com/api/blogs');
    const data = await res.json();
    const blogs = data?.blogs;
    
    const allImages = blogs.flatMap(blog => {
      const imageUrls = extractImageUrls(blog.content || '');
      const links = extractLinksFromContent(blog.content || '');
      if (!imageUrls.length) return [];
      
      return imageUrls.map(url => ({
        url: url,
        title: blog.title || '',
        blogUrl: `/blogs/${blog.url}`,
        description: blog.description || '',
        date: blog.publishedAt ? new Date(blog.publishedAt).toISOString() : new Date().toISOString(),
        views: blog.views || 0,
        likes: blog.likes || 0,
        isTechnical: blog.isTechnical,
        isProject: blog.isProject,
        relatedLinks: links
      }));
    }).filter(Boolean);

    const sitemapContent = `
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
              xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
        <url>
          <loc>https://atakangul.com/gallery</loc>
          ${allImages.map(img => `
            <image:image>
              <image:loc>${img.url}</image:loc>
              <image:title>${img.title}</image:title>
              <image:caption>By Atakan Gül - ${img.title}</image:caption>
              <image:geo_location>Istanbul, Turkey</image:geo_location>
              <image:license>https://atakangul.com/license</image:license>
            </image:image>
            <lastmod>${img.date}</lastmod>
            <changefreq>monthly</changefreq>
            <priority>0.8</priority>
          `).join('')}
        </url>
      </urlset>
    `;

    return {
      props: {
        initialImages: JSON.parse(JSON.stringify(allImages)),
        sitemapContent,
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error('Error fetching images:', error);
    return {
      props: {
        initialImages: [],
        sitemapContent: '',
      },
      revalidate: 60,
    };
  }
}

const extractImageUrls = (blogContent) => {
  try {
    const contentArray = JSON.parse(blogContent);
    const imageUrls = contentArray.reduce((urls, item) => {
      const content = item.content || '';
      const regex = /src="(https:\/\/static\.atakangul\.com\/uploads\/[^"]+)"/g;
      const matches = [...content.matchAll(regex)];
      return [...urls, ...matches.map(match => match[1])];
    }, []);
    return [...new Set(imageUrls)];
  } catch (error) {
    console.error('Error parsing blog content:', error);
    return [];
  }
};

const extractLinksFromContent = (blogContent) => {
  try {
    const contentArray = JSON.parse(blogContent);
    const links = contentArray.reduce((urls, item) => {
      const content = item.content || '';
      // Match markdown links [text](url) and regular links
      const regex = /(?:\[([^\]]+)\]\((https?:\/\/[^\s\)]+)\))|(?:href="(https?:\/\/[^\s"]+)")/g;
      const matches = [...content.matchAll(regex)];
      return [...urls, ...matches.map(match => ({
        url: match[2] || match[3], 
        text: match[1] || match[2] || match[3] 
      }))];
    }, []);
    return [...new Set(links.map(JSON.stringify))].map(JSON.parse); // Remove duplicates
  } catch (error) {
    console.error('Error parsing blog content for links:', error);
    return [];
  }
};