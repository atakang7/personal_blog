import { Blogs } from "@/models/Blogs";
import connectMongoDB from "@/lib/mongodb";

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const { url } = req.query;
            await connectMongoDB();
            const blog = await Blogs.findOne({ url });
            return res.status(200).json({ blog });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message,
            });
        }
    }

    if (req.method === 'PUT') {
        try {
          const { blog } = req.body;
          const { _id, ...updateData } = blog;
          console.log(req.body)
          await connectMongoDB();
          const updatedBlog = await Blogs.findOneAndUpdate(
            { url: updateData?.url },
            { $set: { ...updateData, updatedAt: new Date().toISOString() } },
            { new: true, runValidators: true }
          );
          if (!updatedBlog) {
            return res.status(404).json({ error: 'Blog not found' });
          }
          return res.json(updatedBlog);
        } catch (error) {
          console.error('Error updating blog post:', error);
          return res.status(500).json({ error: 'Failed to update blog post' });
        }
    }

    return res.status(405).json({ message: 'Method not allowed' });
}
