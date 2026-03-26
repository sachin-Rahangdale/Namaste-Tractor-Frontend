import { useState } from "react";
import { createArticle, uploadArticleImages } from "../../api/articleApi";

const CreateArticle = () => {
  const [form, setForm] = useState({
    title: "",
    content: "",
  });

  const [mainImage, setMainImage] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔹 Handle Input Change (clean reusable)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Reset form
  const resetForm = () => {
    setForm({ title: "", content: "" });
    setMainImage(null);
    setImages([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔹 Basic validation
    if (!form.title.trim() || !form.content.trim()) {
      setError("Title and Content are required");
      return;
    }

    if (!mainImage) {
      setError("Main image is required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // 1️⃣ Create Article
      const res = await createArticle(
        form.title,
        form.content,
        mainImage
      );

      const articleId = res?.data?.id;

      // 2️⃣ Upload Extra Images (parallel safe)
      if (images.length > 0 && articleId) {
        await uploadArticleImages(articleId, images);
      }

      resetForm();
      alert("✅ Article created successfully");

    } catch (err) {
      console.error(err);

      const message =
        err?.response?.data?.message ||
        "❌ Failed to create article";

      setError(message);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-5">
      <h1 className="text-2xl font-bold mb-4">
        Create Article 📰
      </h1>

      {/* 🔴 Error Message */}
      {error && (
        <div className="bg-red-100 text-red-600 p-2 rounded mb-3">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* TITLE */}
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        {/* CONTENT */}
        <textarea
          name="content"
          placeholder="Content"
          value={form.content}
          onChange={handleChange}
          className="w-full border p-2 rounded h-40"
        />

        {/* MAIN IMAGE */}
        <div>
          <p className="text-sm mb-1">Main Image</p>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setMainImage(e.target.files[0])}
          />
        </div>

        {/* EXTRA IMAGES */}
        <div>
          <p className="text-sm mb-1">Additional Images</p>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) =>
              setImages(Array.from(e.target.files))
            }
          />
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className={`px-6 py-2 rounded text-white ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Creating..." : "Create Article"}
        </button>
      </form>
    </div>
  );
};

export default CreateArticle;