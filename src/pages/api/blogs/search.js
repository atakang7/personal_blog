import { Blogs } from "@/models/Blogs";
import connectMongoDB from "@/lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { search } = req.body;
    if (!search || typeof search !== "string") {
      return res.status(400).json({ error: "Invalid search query" });
    }

    await connectMongoDB();
    const blogs = await Blogs.find(
      { $text: { $search: search } },
      { content: 0 }
    ).limit(10);
    return res.status(200).json(blogs);
  } catch (error) {
    console.error("Error in search handler:", error);
    return res.status(500).json({ error: "Failed to search for blogs" });
  }
}


