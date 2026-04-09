import { useEffect, useState } from "react";
import { getArticles } from "../api";
import ArticleCard from "../context/components/ArticleCard";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";



export default function ArticleListPage() {
  const { user } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await getArticles(0, 50);
        setArticles(res.data.content || []);
      } catch (err) {
        setError("Failed to load articles.");
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  if (loading) return <div className="text-center py-10">Loading articles...</div>;
  if (error) return <div className="text-center text-red-600 py-10">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">All Articles</h1>
        {user && (
          <Link
            to="/submit-article"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Share Farming News
          </Link>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map(article => <ArticleCard key={article.id} article={article} />)}
      </div>
    </div>
  );
}