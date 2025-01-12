// src/pages/api/comments.js
import { Comments } from "@/models/Comments";
import connectMongoDB from '@/lib/mongodb';
import { Blogs } from '@/models/Blogs';

export default async function handler(req, res) {
    await connectMongoDB();

    if (req.method === 'POST') {
        const { content, postId, author, authorName } = req.body;

        if (!content || !postId || !author || !authorName) {
            return res.status(400).json({ success: false, error: 'Missing required fields' });
        }

        try {
            const comment = await Comments.create({ 
                content, 
                post: postId, 
                author, 
                authorName, 
                verified: true 
            });
            await Blogs.findByIdAndUpdate(postId, { $push: { comments: comment._id } }, { new: true });
            return res.status(200).json({ success: true, comment });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    if (req.method === 'GET') {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ success: false, error: 'Missing post ID' });
        }

        try {
            const comments = await Comments.find({ post: id, verified: true }).sort({ createdAt: -1 });
            return res.status(200).json({ comments });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    return res.status(405).json({ message: 'Method not allowed' });
}

