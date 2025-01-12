// src/components/blog/BackButton.js
import Link from 'next/link';

export default function BackButton() {
  return (
    <div className="flex items-center justify-center mt-4">
      <Link href="/">
        <div className="rounded-full bg-white p-2 shadow-md transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 focus:ring-offset-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </Link>
    </div>
  );
}

