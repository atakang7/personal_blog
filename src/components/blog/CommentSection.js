'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { MessageSquare } from 'lucide-react';

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/blogs/comment/${postId}`);
        if (res.status === 200) {
          const data = await res.json();
          setComments(data?.comments);
        } else {
          setError('Failed to load comments');
        }
      } catch (err) {
        setError('Failed to load comments');
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  const showNotification = (message) => {
    // Implement your notification logic here
    console.log(message);
  };

  const handleComment = async () => {
    if (!session) {
      showNotification("Please login to comment!");
      return;
    }

    if (!commentText.trim()) {
      showNotification("Comment cannot be empty!");
      return;
    }

    try {
      const res = await fetch(`/api/blogs/${postId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: commentText,
          postId,
          author: session.user.id,
          authorName: session.user.name
        })
      });

      const data = await res.json();
      if (data.status === 200) {
        showNotification("Comment under review");
        setComments(prevComments => [...prevComments, data.comment]);
        setCommentText('');
      } else {
        showNotification(data.message || "Failed to post comment");
      }
    } catch (error) {
      showNotification("Failed to post comment");
    }
  };

  if (isLoading) {
    return (
      <section className="py-6 px-6">
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-gray-100 rounded-xl" />
          <div className="space-y-3">
            <div className="h-20 bg-gray-100 rounded-lg" />
            <div className="h-20 bg-gray-100 rounded-lg" />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-6 px-6">
        <div className="text-center text-red-500">{error}</div>
      </section>
    );
  }

  return (
    <section className="py-6 px-6">
      {/* Comment Input */}
      <div className="mb-12">
        <textarea 
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder={session ? "Share your thoughts..." : "Please sign in to comment"}
          disabled={!session}
          className="w-full min-h-[120px] px-4 py-3 text-gray-700 bg-gray-50 
                   rounded-xl resize-none outline-none transition-all
                   placeholder:text-gray-400 disabled:opacity-60
                   focus:ring-2 focus:ring-gray-200"
        />
        <div className="mt-3 flex justify-end">
          <button 
            onClick={handleComment}
            disabled={!session || !commentText.trim()}
            className="px-5 py-2 text-sm font-medium rounded-full 
                     transition-colors duration-200
                     disabled:opacity-50 disabled:cursor-not-allowed
                     bg-gray-900 text-white hover:bg-gray-800"
          >
            Post Comment
          </button>
        </div>
      </div>

      {/* Comments List */}
      {comments.length > 0 ? (
        <div className="space-y-8">
          {comments.map((comment) => (
            <article key={comment.id} className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center 
                           justify-center flex-shrink-0">
                <span className="text-sm font-medium text-gray-600">
                  {comment.authorName?.[0]?.toUpperCase() || '?'}
                </span>
              </div>
              
              <div className="flex-1 space-y-1">
                <div className="flex items-baseline justify-between">
                  <h3 className="text-sm font-medium text-gray-900">
                    {comment.authorName}
                  </h3>
                  <time className="text-xs text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString("en-US", {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </time>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {comment.content}
                </p>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <MessageSquare className="w-6 h-6 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-400">No comments yet</p>
        </div>
      )}
    </section>
  );
};

export default CommentSection;