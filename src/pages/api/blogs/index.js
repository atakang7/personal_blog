// src/pages/api/blogs/index.js
import connectMongoDB from '@/lib/mongodb';
import { Blogs } from '@/models/Blogs';
import { Users } from '@/models/Users';
import { AIService } from '@/lib/AI';

const Status = {
  DRAFT: 'draft',
  REVIEW: 'review',
  PUBLISHED: 'published',
};

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      await connectMongoDB();
      const blogs = await Blogs.find({ status: 'published' })
        .sort({ publishedAt: -1 })
        .limit(10);
      return res.status(200).json({ blogs });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch blogs' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { title, content, authorID } = req.body;
      console.log({ title, content, authorID });
      const blogContent = typeof content === 'string' ? content : JSON.stringify(content);

      await connectMongoDB();
      const authorMetadata = await Users.findById(authorID);
      if (!authorMetadata) {
        return res.status(404).json({ error: 'Author not found' });
      }

      const { url, description, search_keywords } = await AIService.generateSEOMetadata(title, blogContent);

      const blogPost = await Blogs.create({
        title,
        content: blogContent,
        authorMetadata,
        url,
        description,
        search_keywords,
        status: Status.PUBLISHED,
      });
      return res.json(blogPost);
    } catch (error) {
      console.error('Error creating blog post:', error);
      return res.status(500).json({ error: 'Failed to create blog post' });
    }
  }



  return res.status(405).json({ message: 'Method not allowed' });
}

