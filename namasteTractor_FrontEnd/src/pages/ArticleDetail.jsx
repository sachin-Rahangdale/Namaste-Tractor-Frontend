import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { getArticleBySlug } from "../api/articleApi";
import { getComments, addComment } from "../api/commentApi";

const ArticleDetail = () => {
  const { slug } = useParams();

  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticle();
  }, [slug]);

  const fetchArticle = async () => {
    try {
      const res = await getArticleBySlug(slug);
      setArticle(res.data);
      fetchComments(res.data.id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (articleId) => {
    try {
      const res = await getComments(articleId);
      setComments(res.data.content || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    try {
      await addComment(article.id, { content: commentText });
      setCommentText("");
      fetchComments(article.id);
    } catch (err) {
      console.error(err);
      alert("Please Login First");
    }
  };

  // ✅ PRODUCTION LOGIC FOR PARAGRAPH + IMAGE PLACEMENT
  const contentWithImages = useMemo(() => {
    if (!article?.content) return [];

    // 🔹 Split by real paragraphs (backend should store \n\n)
    const paragraphs = article.content
      .split(/\n+/)
      .map((p) => p.trim())
      .filter(Boolean);

    const images = article.images || [];
    const result = [];

    let imgIndex = 0;

    paragraphs.forEach((para, index) => {
      // Add paragraph
      result.push({
        type: "text",
        value: para,
        key: `text-${index}`,
      });

      // 🔹 Add image after every 2 paragraphs
      if ((index + 1) % 2 === 0 && imgIndex < images.length) {
        result.push({
          type: "image",
          value: images[imgIndex],
          key: `img-${imgIndex}`,
        });
        imgIndex++;
      }
    });

    // 🔥 Remaining images → insert before last paragraph
    while (imgIndex < images.length) {
      result.splice(result.length - 1, 0, {
        type: "image",
        value: images[imgIndex],
        key: `img-extra-${imgIndex}`,
      });
      imgIndex++;
    }

    return result;
  }, [article]);

  if (loading) return <div className="p-5">Loading...</div>;
  if (!article) return <div className="p-5">Not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-5">

      {/* 📰 TITLE */}
      <h1 className="text-3xl font-bold mb-2">
        {article.title}
      </h1>

      {/* 👤 AUTHOR */}
      <p className="text-sm text-gray-500 mb-4">
        By {article.author} •{" "}
        {new Date(article.createdAt).toLocaleDateString()}
      </p>

      {/* 🖼️ MAIN IMAGE */}
      <img
        src={article.mainImageUrl}
        alt="main"
        className="w-full h-80 object-cover rounded mb-5"
      />

      {/* 📄 CONTENT */}
      <div className="mb-6 space-y-4">
        {contentWithImages.map((item) => {
          if (item.type === "text") {
            return (
              <p
                key={item.key}
                className="text-gray-800 leading-relaxed text-lg"
              >
                {item.value}
              </p>
            );
          }

          return (
            <img
              key={item.key}
              src={item.value}
              alt="article"
              className="w-full rounded my-4 shadow-md"
            />
          );
        })}
      </div>

      {/* 💬 ADD COMMENT */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-3">Add Comment</h2>

        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="w-full border p-3 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Write your comment..."
        />

        <button
          onClick={handleAddComment}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
        >
          Post Comment
        </button>
      </div>

      {/* 💬 COMMENT LIST */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-3">
          Comments ({comments.length})
        </h2>

        {comments.length === 0 ? (
          <p className="text-gray-500">No comments yet</p>
        ) : (
          <div className="space-y-4">
            {comments.map((c) => (
              <div key={c.id} className="border p-3 rounded shadow-sm">
                <p className="font-semibold">{c.name}</p>

                <p className="text-gray-700">{c.content}</p>

                <p className="text-xs text-gray-400">
                  {new Date(c.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleDetail;