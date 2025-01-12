// src/pages/api/blogs/index.js
import connectMongoDB from '@/lib/mongodb';
import { Blogs } from '@/models/Blogs';

const Status = {
  DRAFT: 'draft',
  REVIEW: 'review',
  PUBLISHED: 'published',
};

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      await connectMongoDB();
      const { filter } = req.query;
      const blogs = await Blogs.find({ filter })
        .sort({ publishedAt: -1 })
        .limit(10);
      return res.status(200).json({ blogs });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch blogs' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}

