import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createArticle, uploadArticleImages } from "../api";
import { useAuth } from "../context/AuthContext";

export default function SubmitArticle() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mainImage, setMainImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleMainImageChange = (e) => {
    setMainImage(e.target.files[0]);
  };

  const handleGalleryChange = (e) => {
    setGalleryImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !mainImage) {
      setError("Title, content, and main image are required.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // First create article with main image
      const res = await createArticle(title, content, mainImage);
      const articleId = res.data.id;

      // Then upload gallery images if any
      if (galleryImages.length > 0) {
        await uploadArticleImages(articleId, galleryImages);
      }

      setSuccess("Article submitted successfully! It will be published after admin approval.");
      setTimeout(() => navigate("/articles"), 3000);
    } catch (err) {
      console.error(err);
      setError("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-10">
        <p>Please login to submit an article.</p>
        <Link to="/login" className="text-green-600 mt-2 inline-block">Login</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Share Farming News / Submit Article</h1>
      <p className="text-gray-600 mb-6">Share your farming experiences, tips, or local news. Our team will review and publish it.</p>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
      {success && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{success}</div>}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded p-6">
        <div className="mb-4">
          <label className="block font-semibold mb-1">Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="E.g., Organic Farming Success Story"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-1">Content *</label>
          <textarea
            rows="10"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Write your article here..."
            required
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-1">Main Image *</label>
          <input type="file" accept="image/*" onChange={handleMainImageChange} required />
          <p className="text-sm text-gray-500">This will be the cover image.</p>
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-1">Additional Images (optional)</label>
          <input type="file" multiple accept="image/*" onChange={handleGalleryChange} />
          <p className="text-sm text-gray-500">You can select multiple images to include in the article gallery.</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          {loading ? "Submitting..." : "Submit Article"}
        </button>
      </form>
    </div>
  );
}