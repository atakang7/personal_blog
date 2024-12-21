import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { MessageSquare } from 'lucide-react';

const CommentSection = ({ postId, comments: initialComments }) => {
  const [comments, setComments] = useState(initialComments || []);
  const [commentText, setCommentText] = useState('');
  const { data: session } = useSession();

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
        setComments([...comments, data.comment]);
        setCommentText('');
      }
    } catch (error) {
      showNotification("Failed to post comment");
    }
  };

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
          {comments.map((comment, index) => (
            <article key={index} className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center 
                           justify-center flex-shrink-0">
                <span className="text-sm font-medium text-gray-600">
                  {comment.authorName[0].toUpperCase()}
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