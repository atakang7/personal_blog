// src/pages/index.js
import { getServerSession } from "next-auth/next";
import ProfileBanner from "../components/ProfileBanner";
import BlogCard from "../components/BlogCard";
import SubscribeForm from "../components/SubscribeForm";
import { Blogs } from "../models/Blogs";
import { Comments } from "@/models/Comments";
import connectMongoDB from "../lib/mongodb";
import Head from "next/head";


async function getBlogs(page = 1) {
  const now = Date.now();

  try {
    await connectMongoDB();
    const limit = 9;
    const skip = (page - 1) * limit;

    const [blogs, total] = await Promise.all([
      Blogs.find({ status: "published" }, { content: 0 })
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("authorMetadata")
        .lean(),
      Blogs.countDocuments({ status: "published" }),
    ]);

    const hasNextPage = total > skip + limit;

    const result = {
      blogs: JSON.parse(JSON.stringify(blogs)),
      nextPage: hasNextPage ? page + 1 : null,
    };

    return result;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return { blogs: [], nextPage: null };
  }
}

export default function Home({ blogs, nextPage, session }) {
  return (
    <div className="container">
      <Head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.css" />
      </Head>
    
      <ProfileBanner user={session?.user} />

      {session?.user && !session.user.isSubscribed && (
          <SubscribeForm user={session?.user} />
      )}

      <div className="ui container">
        <div
          className="ui container w-100 my-5 ml-0 px-0 mobile-custom"
          id="scroll-place"
        >
          <article className="prose lg:prose-xl m-0">
            <h2
              className="py-2 px-3 flex justify-start rounded-lg"
              style={{ backgroundColor: "#FFD700", width: "fit-content" }}
            >
              Latest Blogs
            </h2>
          </article>
        </div>

        <div className="row mx-5 ui stackable grid" style={{ margin: 0 }}>
          {blogs.map((post) => (
            <BlogCard key={post._id} post={post} />
          ))}
        </div>

        {nextPage && (
          <div className="container mx-5 my-10">
            <div className="ui pagination menu">
              <a href={`/?page=${nextPage}`} className="item">
                &lt; View Older Posts
              </a>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

export async function getServerSideProps({ query, req, res }) {
  const page = parseInt(query.page) || 1;
  const session = await getServerSession(req, res);
  const { blogs, nextPage } = await getBlogs(page);
  console.log("Blogs:", blogs);
  return {
    props: {
      blogs,
      nextPage,
      session: session ? JSON.parse(JSON.stringify(session)) : null
    }
  };
}
