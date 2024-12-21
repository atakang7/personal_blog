// src/app/blogs/[url]/not-found.js
export default function NotFound() {  
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Blog Not Found</h1>
        <p className="text-gray-600 mb-4">Sorry, the blog post you're looking for doesn't exist.</p>
        <a href="/" className="text-blue-500 hover:text-blue-600">
          Return to Home
        </a>
      </div>
    );
} 