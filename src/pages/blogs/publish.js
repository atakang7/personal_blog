import { getSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import BlogEditor from '@/components/blog/BlogEditor';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

export const getServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session || session?.user?.role !== 'admin') {
    return {
      redirect: {
        destination: '/auth/error',
        permanent: false,
      },
    };
  }

  return {
    props: { },
  };
};

export default function PublishPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isPublishing, setIsPublishing] = useState(false);
  const [getContent, setGetContent] = useState(null);
  const [error, setError] = useState('');

  const handlePublish = async () => {
    if (
      !getContent || isPublishing) return;

    try {
      setIsPublishing(true);
      setError('');
      
      console.log({          
        title: getContent?.title,
        content: getContent?.content,
        authorID: session?.user?.id
      }); 
      
      const response = await fetch('/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: getContent?.title,
          content: [{"content":getContent?.content}],
          authorID: session?.user?.id,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to publish');
      }

      const data = await response.json();
      localStorage.removeItem('blog-editor-content');
      localStorage.removeItem('blog-editor-pending-images');
      console.log(data)
      // On success:
      // 1. Show success feedback if needed
      // 2. Redirect to the published blog
      router.push(`/blogs/${data?.url}`);

    } catch (error) {
      // On error:
      // 1. Show error message
      // 2. Allow retry
      setError(error.message);
      console.error('Publishing error:', error);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      <div className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-semibold">Create New Blog Post</h1>
            <button
              onClick={handlePublish}
              disabled={isPublishing}
              className={`px-4 py-2 rounded-lg bg-blue-600 text-white font-medium
                hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 
                disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isPublishing ? 'Publishing...' : 'Publish'}
            </button>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="max-w-screen-xl mx-auto mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}
      
      <div className="max-w-screen-xl mx-auto p-4">
        <BlogEditor onReady={setGetContent} />
      </div>
    </main>
  );
}
