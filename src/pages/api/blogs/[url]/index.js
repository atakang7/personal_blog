// src/pages/api/blogs/[id].js
import connectMongoDB from '@/lib/mongodb';
import { Blogs } from '@/models/Blogs';
import { Comments } from '@/models/Comments';

export default async function handler(req, res) {
    const { method } = req;
    const { url } = req.query;

    await connectMongoDB();

    switch (method) {
        case 'GET':
            try {
                const blog = await Blogs.findOne({ url })
                    .populate('comments')
                    .populate('likes')
                    .lean(); 
                
                console.log(blog)

                if (!blog) {
                    return res.status(404).json({ 
                        success: false, 
                        error: 'Blog not found' 
                    });
                }

                return res.status(200).json({ 
                    success: true, 
                    blog 
                });
            } catch (error) {
                console.error('Fetch error:', error);
                return res.status(500).json({ 
                    success: false, 
                    error: error.message 
                });
            }

        case 'PUT':
            try {
                const { blog } = req.body;
                const { _id, ...updateData } = blog;

                const updatedBlog = await Blogs.findByIdAndUpdate(
                    id,
                    { $set: updateData },
                    { new: true, runValidators: true }
                );

                if (!updatedBlog) {
                    return res.status(404).json({ 
                        success: false, 
                        error: 'Blog not found' 
                    });
                }

                return res.status(200).json({ 
                    success: true, 
                    blog: updatedBlog 
                });
            } catch (error) {
                console.error('Update error:', error);
                return res.status(500).json({ 
                    success: false, 
                    error: error.message 
                });
            }

        default:
            res.setHeader('Allow', ['GET', 'PUT']);
            return res.status(405).json({ 
                success: false, 
                error: `Method ${method} Not Allowed` 
            });
    }
}