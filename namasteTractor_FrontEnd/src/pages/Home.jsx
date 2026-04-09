import { useEffect, useState } from "react";
import { getTractors, getArticles, getProducts } from "../api";
import { Link } from "react-router-dom";

import TractorCard from "../context/components/TractorCard";
import ArticleCard from "../context/components/ArticleCard";
import ProductCard from "../context/components/ProductCard";

export default function Home() {
  const [tractors, setTractors] = useState([]);
  const [articles, setArticles] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState({ tractors: true, articles: true, products: true });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tractorRes, articleRes, productRes] = await Promise.all([
          getTractors(0, 6),
          getArticles(0, 3),
          getProducts(0, 6)
        ]);
        setTractors(tractorRes.data);
        setArticles(articleRes.data.content || []);
        setProducts(productRes.data.content || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading({ tractors: false, articles: false, products: false });
      }
    };
    fetchData();
  }, []);

  if (error) return <div className="text-center text-red-600 py-10">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Tractors Section */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold border-l-4 border-green-600 pl-3">Popular Tractors</h2>
          <Link to="/tractors" className="text-green-600 hover:underline">Explore More Tractors →</Link>
        </div>
        {loading.tractors ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => <div key={i} className="bg-gray-200 animate-pulse h-80 rounded"></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tractors.map(tractor => <TractorCard key={tractor.id} tractor={tractor} />)}
          </div>
        )}
      </section>

      {/* Articles Section */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold border-l-4 border-green-600 pl-3">Farming Tips & News</h2>
          <Link to="/articles" className="text-green-600 hover:underline">Read More Articles →</Link>
        </div>
        {loading.articles ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => <div key={i} className="bg-gray-200 animate-pulse h-80 rounded"></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map(article => <ArticleCard key={article.id} article={article} />)}
          </div>
        )}
      </section>

      {/* Products Section */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold border-l-4 border-green-600 pl-3">Agricultural Products</h2>
          <Link to="/products" className="text-green-600 hover:underline">Show More Products →</Link>
        </div>
        {loading.products ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => <div key={i} className="bg-gray-200 animate-pulse h-80 rounded"></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => <ProductCard key={product.id} product={product} />)}
          </div>
        )}
      </section>
    </div>
  );
}