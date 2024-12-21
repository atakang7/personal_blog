import { Blogs } from "@/models/Blogs";
import connectMongoDB from "@/lib/mongodb";

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { blogId } = req.body;
            await connectMongoDB();
            await Blogs.findByIdAndUpdate(blogId, { $inc: { likes: 1 } });
            return res.status(200).json({ message: "Blog liked successfully" });
        } catch (error) {
            return res.status(500).json({ error: "Internal Server Error" });
        }
    } else {
        return res.status(405).json({ message: "Method Not Allowed" });
    }
}

