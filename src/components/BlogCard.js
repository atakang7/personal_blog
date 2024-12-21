import Link from "next/link";
import { formatDate, truncateDescription, getAuthorName } from "../lib/utils";

export default function BlogCard({ post }) {
  return (
    <div
      className="blog-card-container col-12 col-md-6 col-lg-4 mb-4"
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        className="card crown-jewel shadow-lg border-0"
        style={{
          width: "100%",
          maxWidth: "350px",
          background: "linear-gradient(135deg, #101820, #1e1e1e)",
          borderRadius: "16px",
          overflow: "hidden",
          color: "#f5f5f5",
        }}
      >
        {/* Top Section: Image and Author */}
        <Link
          href={`/blogs/${post.url}`}
          aria-label={`Read more about ${post.title}`}
        >
          <div
            className="image-wrapper position-relative"
            style={{ height: "200px", overflow: "hidden" }}
          >
            <img
              loading="lazy"
              src={post.imageURL}
              alt={`${post.title} visual`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "transform 0.3s ease",
              }}
              className="hover-zoom"
            />
            <div
              className="author-badge position-absolute"
              style={{
                top: "10px",
                left: "10px",
                backgroundColor: "rgba(255, 193, 7, 0.9)",
                padding: "5px 10px",
                borderRadius: "12px",
                fontWeight: "bold",
                fontSize: "0.9rem",
                color: "#000",
              }}
            >
              {getAuthorName(post.authorMetadata)}
            </div>
          </div>
        </Link>

        {/* Middle Section: Title, Date, Description */}
        <div
          className="card-body p-4"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            textAlign: "center",
          }}
        >
          <Link
            href={`/blogs/${post.url}`}
            style={{
              color: "#ffc107",
              textDecoration: "none",
              fontWeight: "bold",
              fontSize: "1.25rem",
              textShadow: "0 0 8px #ffc107",
            }}
          >
            {post.title}
          </Link>
          <span
            style={{
              fontSize: "0.9rem",
              color: "#b5b5b5",
            }}
          >
            Published on {formatDate(post.createdAt)}
          </span>
          <p
            style={{
              fontSize: "0.95rem",
              color: "#d9d9d9",
              margin: 0,
            }}
          >
            {truncateDescription(post.description)}
          </p>
        </div>

        {/* Bottom Section: Likes and Comments */}
        <div
          className="card-footer d-flex justify-content-between align-items-center p-3"
          style={{
            backgroundColor: "#171717",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            color: "#f5f5f5",
          }}
        >
          <div className="likes">
            <i
              className="bi bi-heart-fill"
              style={{
                color: "#ff5252",
                marginRight: "8px",
              }}
            ></i>
            {post.likes || 0} Likes
          </div>
          <div className="comments">
            <i
              className="bi bi-chat-dots-fill"
              style={{
                color: "#00bcd4",
                marginRight: "8px",
              }}
            ></i>
            {post.comments?.length || 0} Comments
          </div>
        </div>
      </div>
    </div>
  );
}
