// components/BlogEditForm.js
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Loader2, Save } from 'lucide-react';

export default function BlogEditForm({ blog }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [blogData, setBlogData] = useState(blog);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const { _id, ...updateData } = blogData;
      const response = await fetch(`/api/blogs/${blogData?.url}/edit`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blog: {
            ...updateData,
            updatedAt: new Date().toISOString(),
          },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Update failed');
      }

      router.push(`/blogs/${blogData.url}`);
    } catch (error) {
      console.error('Error:', error);
      alert(error.message || 'Failed to update blog');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            value={blogData.title}
            onChange={(e) => setBlogData((prev) => ({ ...prev, title: e.target.value }))}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">URL Slug</label>
          <input
            type="text"
            value={blogData.url}
            onChange={(e) => setBlogData((prev) => ({ ...prev, url: e.target.value }))}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={blogData.description}
            onChange={(e) => setBlogData((prev) => ({ ...prev, description: e.target.value }))}
            rows={3}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Search Keywords</label>
          <input
            type="text"
            value={blogData.search_keywords}
            onChange={(e) => setBlogData((prev) => ({ ...prev, search_keywords: e.target.value }))}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Featured Image URL</label>
          <input
            type="text"
            value={blogData.imageURL}
            onChange={(e) => setBlogData((prev) => ({ ...prev, imageURL: e.target.value }))}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={blogData.isProject}
              onChange={(e) => setBlogData((prev) => ({ ...prev, isProject: e.target.checked }))}
              className="rounded text-blue-600"
            />
            <span className="text-sm">Project</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={blogData.AICreated}
              onChange={(e) => setBlogData((prev) => ({ ...prev, AICreated: e.target.checked }))}
              className="rounded text-blue-600"
            />
            <span className="text-sm">AI Created</span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            value={blogData.status}
            onChange={(e) => setBlogData((prev) => ({ ...prev, status: e.target.value }))}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          >
            <option value="draft">Draft</option>
            <option value="review">Review</option>
            <option value="published">Published</option>
          </select>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}