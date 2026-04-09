import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getArticleBySlug, getComments, postComment } from "../api";
import { useAuth } from "../context/AuthContext";

export default function ArticleDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getArticleBySlug(slug);
        setArticle(res.data);
        // If backend includes comments in the article object, use them directly
        if (res.data.comments) {
          setComments(res.data.comments);
        } else {
          // Otherwise fetch separately
          const commentsRes = await getComments(res.data.id);
          setComments(commentsRes.data.content || []);
        }
      } catch (err) {
        console.error(err);
        setError("Article not found or server error.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please login to comment.");
      navigate("/login");
      return;
    }
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const res = await postComment(article.id, newComment);
      setComments([res.data, ...comments]);
      setNewComment("");
    } catch (err) {
      console.error(err);
      alert("Failed to post comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEnquiry = () => {
    const message = `I read the article "${article.title}" and would like advice on: `;
    navigate("/enquiry/new", {
      state: {
        prefillMessage: message,
        prefillEnquiryType: "FARMING_ADVICE",
      },
    });
  };

  // Function to split content into paragraphs and interleave images
  const renderContentWithImages = (content, images) => {
    if (!content) return null;
    
    // Split by double newline (common paragraph separator), but also handle single newline
    let paragraphs = content.split(/\n\s*\n/);
    // If no double newlines, split by single newline
    if (paragraphs.length === 1) {
      paragraphs = content.split(/\n/);
    }
    // Filter out empty paragraphs
    paragraphs = paragraphs.filter(p => p.trim().length > 0);
    
    if (paragraphs.length === 0) return <p>{content}</p>;
    
    // Decide where to insert images (e.g., after every 2 paragraphs, but not at the very beginning)
    const imageInterval = 2; // insert an image after every 2 paragraphs
    const elements = [];
    
    for (let i = 0; i < paragraphs.length; i++) {
      // Add paragraph
      elements.push(
        <p key={`p-${i}`} className="text-gray-700 leading-relaxed mb-4">
          {paragraphs[i]}
        </p>
      );
      
      // After every `imageInterval` paragraphs, insert an image (if available)
      if ((i + 1) % imageInterval === 0 && images && images.length > 0) {
        const imageIndex = Math.floor((i + 1) / imageInterval) - 1;
        if (imageIndex < images.length) {
          elements.push(
            <div key={`img-${i}`} className="my-6">
              <img 
                src={images[imageIndex]} 
                alt={`Article illustration ${imageIndex + 1}`}
                className="rounded-lg shadow-md w-full object-cover max-h-96"
              />
            </div>
          );
        }
      }
    }
    
    // If there are leftover images that weren't inserted, append them at the end
    const usedImagesCount = Math.floor(paragraphs.length / imageInterval);
    if (images.length > usedImagesCount) {
      for (let i = usedImagesCount; i < images.length; i++) {
        elements.push(
          <div key={`img-extra-${i}`} className="my-6">
            <img 
              src={images[i]} 
              alt={`Additional illustration ${i + 1}`}
              className="rounded-lg shadow-md w-full object-cover max-h-96"
            />
          </div>
        );
      }
    }
    
    return elements;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="bg-gray-200 h-96 rounded-lg mb-4"></div>
          <div className="bg-gray-200 h-8 w-3/4 mb-2"></div>
          <div className="bg-gray-200 h-4 w-1/2 mb-4"></div>
          <div className="bg-gray-200 h-64 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || "Article not found"}
        </div>
        <Link to="/" className="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <button onClick={() => navigate(-1)} className="mb-4 text-green-600 hover:text-green-800">
        ← Back
      </button>

      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{article.title}</h1>
      <div className="flex items-center text-gray-600 mb-6">
        <span>By {article.author}</span>
        <span className="mx-2">•</span>
        <span>{new Date(article.createdAt).toLocaleDateString()}</span>
      </div>

      {/* Main image (if separate from gallery) */}
      {article.mainImageUrl && (
        <img src={article.mainImageUrl} alt={article.title} className="w-full rounded-lg shadow-lg mb-8" />
      )}

      {/* Content with images interleaved */}
      <div className="prose max-w-none mb-8">
        {renderContentWithImages(article.content, article.images || [])}
      </div>

      {/* Call to action */}
      <button
        onClick={handleEnquiry}
        className="mb-8 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
      >
        📝 Ask Farming Advice
      </button>

      {/* Comments section */}
      <div className="border-t pt-8">
        <h3 className="text-2xl font-bold mb-4">Comments ({comments.length})</h3>

        {user ? (
          <form onSubmit={handleCommentSubmit} className="mb-6">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts or ask a question..."
              rows="3"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <button
              type="submit"
              disabled={submitting}
              className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {submitting ? "Posting..." : "Post Comment"}
            </button>
          </form>
        ) : (
          <p className="text-gray-600 mb-6">
            <Link to="/login" className="text-green-600 hover:underline">Login</Link> to leave a comment.
          </p>
        )}

        <div className="space-y-4">
          {comments.length === 0 && <p className="text-gray-500">No comments yet. Be the first!</p>}
          {comments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
              <div className="font-semibold">{comment.name}</div>
              <div className="text-sm text-gray-500">{new Date(comment.createdAt).toLocaleString()}</div>
              <p className="mt-2 text-gray-700">{comment.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}