// src/pages/api/comments.js
import { Comments } from "@/models/Comments";
import connectMongoDB from '@/lib/mongodb';

export default async function handler(req, res) {
    await connectMongoDB();

    if (req.method === 'GET') {
        const { url: postId } = req.query;

        if (!postId) {
            return res.status(400).json({ success: false, error: 'Missing post postId' });
        }

        try {
            const comments = await Comments.find({ post: postId, verified: true }).sort({ createdAt: -1 });
            return res.status(200).json({  success: true, comments });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    return res.status(405).json({ message: 'Method not allowed' });
}

