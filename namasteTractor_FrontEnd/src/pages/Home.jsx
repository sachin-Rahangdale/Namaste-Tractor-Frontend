import { useEffect, useState } from "react";
import { getTractors, getArticles, getProducts } from "../api";

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
        // Fetch all three in parallel
        const [tractorRes, articleRes, productRes] = await Promise.all([
          getTractors(0, 6),   // first 6 tractors
          getArticles(0, 3),   // first 3 articles
          getProducts(0, 6)    // first 6 products
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

  if (error) {
    return <div className="text-center text-red-600 py-10">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Row 1: Tractors */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 border-l-4 border-green-600 pl-3">Popular Tractors</h2>
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

      {/* Row 2: Articles */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 border-l-4 border-green-600 pl-3">Farming Tips & News</h2>
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

      {/* Row 3: Products */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 border-l-4 border-green-600 pl-3">Agricultural Products</h2>
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