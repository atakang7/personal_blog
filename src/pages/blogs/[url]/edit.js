// pages/blogs/[url]/edit.js
import BlogEditForm from '@/components/blog/BlogEditForm';

export default function BlogEditPage({ blog }) {
  return <BlogEditForm blog={blog} />;
}

export async function getStaticProps({ params }) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs/${params.url}/edit`);
    const data = await response.json();

    if (!data?.blog) {
      return { notFound: true };
    }

    return {
      props: {
        blog: data.blog,
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error('Error fetching blog:', error);
    return { notFound: true };
  }
}

export async function getStaticPaths() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs`);
    const blogs = await response.json();

    return {
      paths: blogs.map((blog) => ({ params: { url: blog.url } })),
      fallback: 'blocking',
    };
  } catch (error) {
    console.error('Error fetching paths:', error);
    return {
      paths: [],
      fallback: 'blocking',
    };
  }
}