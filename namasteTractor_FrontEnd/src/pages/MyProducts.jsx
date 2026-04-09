import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyProducts, deleteProduct } from "../api";
import ProductCard from "../context/components/ProductCard";


export default function MyProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 9;

  useEffect(() => {
    fetchMyProducts();
  }, [page]);

  const fetchMyProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getMyProducts(page, pageSize);
      setProducts(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
    } catch (err) {
      console.error(err);
      setError("Failed to load your products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id);
        // Refresh current page
        fetchMyProducts();
        alert("Product deleted.");
      } catch (err) {
        console.error(err);
        alert("Failed to delete. You may not have permission.");
      }
    }
  };

  const handlePrevPage = () => page > 0 && setPage(page - 1);
  const handleNextPage = () => page < totalPages - 1 && setPage(page + 1);

  if (loading && products.length === 0) {
    return <div className="text-center py-10">Loading your products...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-600">{error}</p>
        <button onClick={fetchMyProducts} className="mt-4 bg-green-600 text-white px-4 py-2 rounded">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Products</h1>
        <Link to="/add-product" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          + Add New Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded">
          <p>You haven't added any products yet.</p>
          <Link to="/add-product" className="text-green-600 mt-2 inline-block">
            Add your first product
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition flex flex-col">
                {/* Product Card (reuse existing component) */}
                <ProductCard product={product} />
                {/* Buttons at the bottom */}
                <div className="flex gap-2 p-4 pt-0 mt-auto">
                  <Link
                    to={`/edit-product/${product.id}`}
                    className="flex-1 text-center bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="flex-1 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={handlePrevPage}
                disabled={page === 0}
                className={`px-4 py-2 rounded ${
                  page === 0
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                Previous
              </button>
              <span className="text-gray-700">
                Page {page + 1} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={page === totalPages - 1}
                className={`px-4 py-2 rounded ${
                  page === totalPages - 1
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}