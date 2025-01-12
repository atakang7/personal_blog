import { Blogs } from "@/models/Blogs";
import connectMongoDB from "@/lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { currentBlogId, tags } = req.body;
    console.log(req.body)
    if (!currentBlogId || !tags) {
      return res.status(400).json({ error: "Invalid request body" });
    }

    const searchTags = tags
      .toLowerCase()
      .split(/[\s,]+/)
      .filter((tag) => tag.length > 0)
      .slice(0, 20);
    await connectMongoDB();
    const blogs = await Blogs.find({
      $or: [
        { _id: { $ne: currentBlogId } },
        { tags: { $in: searchTags } },
      ],
    })
      .limit(3)
      .sort({ createdAt: -1 });
    return res.status(200).json(blogs);
  } catch (error) {
    console.error("Error in recommendations handler:", error);
    return res.status(500).json({ error: "Failed to fetch recommendations" });
  }
}


