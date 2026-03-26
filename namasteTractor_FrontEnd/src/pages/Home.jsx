import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTractors } from "../api/tractorApi";
import { getArticles } from "../api/articleApi";
import ArticleCard from "../components/ArticleCard";
import TractorCard from "../components/tractors/TractorCard";


const Home = () => {
  const [tractors, setTractors] = useState([]);
  const [articles, setArticles] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const tractorRes = await getTractors();
      const articleRes = await getArticles();

      // 👉 take only first 3 items
      setTractors(tractorRes.data.slice(0, 5));
      setArticles(articleRes.data.content.slice(0, 5));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-5 max-w-6xl mx-auto">

      {/* 🚜 TRACTOR SECTION */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Featured Tractors 🚜</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {tractors.map((tractor) => (
            <TractorCard key={tractor.id} tractor={tractor} />
          ))}
        </div>

        <div className="flex justify-center mt-5">
          <button
            onClick={() => navigate("/tractors")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded transition"
          >
            Explore More Tractors
          </button>
        </div>
      </section>

      {/* 📰 ARTICLE SECTION */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Latest Articles 📰</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>

        <div className="flex justify-center mt-5">
          <button
            onClick={() => navigate("/articles")}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded transition"
          >
            Explore More Articles
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;