
import connectMongoDB from "@/lib/mongodb";
import { Blogs } from "@/models/Blogs";
import { Comments } from "@/models/Comments";
import BlogContent from "@/components/blog/BlogContent";
import BackButton from "@/components/blog/BackButton";
import Head from "next/head";
import BlogHeader from "@/components/blog/BlogHeader";
import BlogFooter from "@/components/blog/BlogFooter";
import CommentSection from "@/components/blog/CommentSection";
import RecommendedBlogs from "@/components/blog/RecommendedBlogs";

// pages/blogs/[url]/index.js
export async function getStaticPaths() {
  await connectMongoDB();
  const blogs = await Blogs.find({}).lean();
  
  return {
    paths: blogs.map((blog) => ({
      params: { url: blog?.url },
    })),
    fallback: 'blocking'
  };
}

export async function getStaticProps({ params }) {
  try {
    await connectMongoDB();
    const blog = await Blogs.findOne({ url: params.url })
      .populate('comments')
      .lean();

    console.log(blog)
    if (!blog) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        blog: JSON.parse(JSON.stringify(blog))
      },
      revalidate: 3600
    };
  } catch (error) {
    console.error('Error fetching blog:', error);
    return {
      notFound: true
    };
  }
}
export default function BlogPage({ blog }) {
  if (!blog) return null;

  return (
    <>
      <Head>
        <title>{`${blog?.title} | Atakan Gül Blog | Technology Insights`}</title>
        <meta name="description" content={blog?.description} />
        <meta name="keywords" content={`${blog?.search_keywords}, Atakan Gül`} />
        <meta property="og:title" content={`${blog?.title} | Atakan Gül | Latest Tech Articles and Insights`} />
        <meta property="og:description" content={blog?.description} />
        <meta property="og:url" content={`https://www.atakangul.com/blogs/${blog?.url}`} /> 
        <meta property="og:image" content={blog?.imageURL || '/img/favicon.ico'} />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.css" />
      </Head>

      <div className="container-fluid" style={{ maxWidth: '850px', wordBreak: 'break-all' }}>
        <div className="flex w-100">
          <BackButton />
        </div>
        
        <div className="row mt-3">
          <BlogHeader blog={blog} />
          
          <BlogContent 
            content={blog?.content}
            isAICreated={blog?.AICreated} 
          />

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
      </div>
    </>
  );
}