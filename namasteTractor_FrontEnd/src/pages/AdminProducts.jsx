import { useEffect, useState } from "react";
import { getProducts, deleteProduct } from "../api";
import ProductCard from "../context/components/ProductCard";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await getProducts(0, 100);
      setProducts(res.data.content || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this product?")) {
      await deleteProduct(id);
      fetchProducts();
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">All Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <div key={p.id} className="relative">
            <ProductCard product={p} />
            <button onClick={() => handleDelete(p.id)} className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-sm">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}