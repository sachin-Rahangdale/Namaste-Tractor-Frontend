import ArticleCard from "../components/ArticleCard";
import { getArticles } from "../api/articleApi";
import { useEffect, useState } from "react";

const ArticleList = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const res = await getArticles();

      console.log(res.data); // 🔍 debug (remove later)

      // ✅ IMPORTANT (pagination response)
      setArticles(res.data.content);
    } catch (err) {
      console.error(err);
      setError("Failed to load articles");
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Loading State
  if (loading) {
    return (
      <div className="p-5 text-center text-lg font-semibold">
        Loading articles...
      </div>
    );
  }

  // ❌ Error State
  if (error) {
    return (
      <div className="p-5 text-center text-red-500 font-semibold">
        {error}
      </div>
    );
  }

  // 📭 Empty State
  if (!articles || articles.length === 0) {
    return (
      <div className="p-5 text-center text-gray-500">
        No articles found
      </div>
    );
  }

  return (
    <div className="p-5">
      {/* 📰 PAGE TITLE */}
      <h1 className="text-2xl font-bold mb-5">Latest Articles</h1>

      {/* 📦 GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
};

export default ArticleList;