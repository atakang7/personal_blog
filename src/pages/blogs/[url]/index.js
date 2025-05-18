import Head from "next/head";
import BlogContent from "@/components/blog/BlogContent";
import BlogFooter from "@/components/blog/BlogFooter";
import CommentSection from "@/components/blog/CommentSection";
import RecommendedBlogs from "@/components/blog/RecommendedBlogs";
import { useRouter } from 'next/router';

import { marked } from 'marked';
import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

export default function BlogPage({ blog }) {
  const router = useRouter();

  if (router.isFallback) {
    return <div className="container-fluid py-5 text-center">Loading...</div>;
  }

  if (!blog) return null;

  const canonicalUrl = `https://www.atakangul.com/blogs/${blog?.url}`;

  return (
    <>
      <Head>
        <title>{`${blog?.title} | Atakan Gül Blog | Technology Insights`}</title>
        <meta name="description" content={blog?.description} />
        <meta name="keywords" content={`${blog?.search_keywords}, Atakan Gül`} />

        <meta property="og:type" content="article" />
        <meta property="og:title" content={`${blog?.title} | Atakan Gül | Latest Tech Articles and Insights`} />
        <meta property="og:description" content={blog?.description} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={blog?.imageURL || '/img/favicon.ico'} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={blog?.title} />
        <meta name="twitter:description" content={blog?.description} />
        <meta name="twitter:image" content={blog?.imageURL || '/img/favicon.ico'} />

        <link rel="canonical" href={canonicalUrl} />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": blog?.title,
            "image": blog?.imageURL,
            "datePublished": blog?.createdAt,
            "dateModified": blog?.updatedAt,
            "author": {
              "@type": "Person",
              "name": "Atakan Gül"
            }
          })}
        </script>
      </Head>

      <div className="container-fluid mx-auto" style={{ maxWidth: '800px' }}>
        <article>
          <div className="row mt-3">
            <BlogContent content={blog?.content} />

            <div className="blog-footer">
              <BlogFooter blog={blog} />
              <CommentSection 
                initialComments={blog?.comments} 
                postId={blog?._id}
              />
            </div>

            <RecommendedBlogs 
              currentBlogId={blog?._id}
              currentBlogTags={blog?.search_keywords}
            />
          </div>
        </article>
      </div>
    </>
  );
}

export async function getStaticPaths() {
  try {
    const res = await fetch('https://atakangul.com/api/blogs');
    const data = await res.json();
    const blogs = data?.blogs;

    return {
      paths: blogs.map((blog) => ({
        params: { url: blog?.url },
      })),
      fallback: true
    };
  } catch (error) {
    console.error('Error in getStaticPaths:', error);
    return { paths: [], fallback: 'blocking' };
  }
}

export async function getStaticProps({ params }) {
  try {
    const blogData = (await fetch(`https://atakangul.com/api/blogs/${params.url}`));
    const data = await blogData.json();
    const blog = data?.blog;
    console.log('[RAW] blog.content (raw markdown)', blog.content);

    if (!blog) {
      return { notFound: true, revalidate: 60 };
    }

    // Markdown -> sanitized HTML
    const window = new JSDOM('').window;
    const DOMPurify = createDOMPurify(window);
    const decodedMarkdown = blog.content.replace(/\\n/g, '\n');
    const dirtyHtml = marked.parse(decodedMarkdown);
    const safeHtml = DOMPurify.sanitize(dirtyHtml);

    const serializeDates = (obj) => {
      const newObj = { ...obj };
      for (let [key, value] of Object.entries(newObj)) {
        if (value instanceof Date) {
          newObj[key] = value.toISOString();
        } else if (value && typeof value === 'object') {
          newObj[key] = serializeDates(value);
        }
      }
      return newObj;
    };
    const cleanBlog = {
      ...serializeDates(blog),
      content: safeHtml,
      _id: blog._id.toString(),
      comments: blog.comments.map(comment => ({
        ...comment,
        _id: comment._id.toString()
      }))
    };
    console.log('[DEBUG] Final content:', safeHtml.slice(0, 200));
    console.log('[DEBUG] blog.content before send:', cleanBlog.content.slice(0, 200));

  return {
    props: { blog: cleanBlog },
    revalidate: 3600
  };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return { notFound: true, revalidate: 60 };
  }
}
