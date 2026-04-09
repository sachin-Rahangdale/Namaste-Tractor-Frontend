import { useEffect, useState } from "react";
import ProductCard from "../context/components/ProductCard";
import { getProductsByCity, filterProducts, getProducts } from "../api";



export default function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Filter state
  const [filters, setFilters] = useState({
    city: "", // empty initially – user must choose
    category: "",
    minPrice: "",
    maxPrice: "",
  });

  // Pagination
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 9;

  // Popular cities for dropdown + free typing
  const popularCities = [
    "Nagpur", "Pune", "Mumbai", "Gondia", "Amravati", 
    "Aurangabad", "Nashik", "Kolhapur", "Solapur", "Akola"
  ];

  // Fetch products when filters change and city is selected
  useEffect(() => {
    if (!filters.city) {
      setProducts([]);
      setTotalPages(0);
      return;
    }
    fetchProducts();
  }, [filters, page]);

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {
        page,
        size: pageSize,
        city: filters.city,
        ...(filters.category && { category: filters.category }),
        ...(filters.minPrice && { minPrice: parseFloat(filters.minPrice) }),
        ...(filters.maxPrice && { maxPrice: parseFloat(filters.maxPrice) }),
      };
      const res = await filterProducts(params);
      if (res.data.content) {
        setProducts(res.data.content);
        setTotalPages(res.data.totalPages || 0);
      } else {
        setProducts(res.data);
        setTotalPages(1);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load products for this city. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPage(0);
  };

  const resetFilters = () => {
    setFilters({
      city: "",
      category: "",
      minPrice: "",
      maxPrice: "",
    });
    setPage(0);
  };

  const handlePrevPage = () => page > 0 && setPage(page - 1);
  const handleNextPage = () => page < totalPages - 1 && setPage(page + 1);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Agricultural Products</h1>

      {/* Filter Bar */}
      <div className="bg-gray-50 p-4 rounded-lg mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* City Selector with datalist */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="city"
              list="cities"
              value={filters.city}
              onChange={handleFilterChange}
              placeholder="Type or select city"
              className="w-full border rounded px-3 py-2"
              required
            />
            <datalist id="cities">
              {popularCities.map(city => (
                <option key={city} value={city} />
              ))}
            </datalist>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">All Categories</option>
              <option value="MACHINERY">Machinery</option>
              <option value="CROP">Crop</option>
              <option value="VEGETABLE">Vegetable</option>
            </select>
          </div>

          {/* Min Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Min Price (₹)</label>
            <input
              type="number"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleFilterChange}
              placeholder="e.g., 1000"
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Max Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Price (₹)</label>
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              placeholder="e.g., 50000"
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={resetFilters}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 mr-2"
            >
              Reset
            </button>
          </div>
        </div>
        {!filters.city && (
          <p className="text-amber-600 text-sm mt-2">Please select a city to see products.</p>
        )}
      </div>

      {/* Results */}
      {filters.city && (
        <>
          <div className="mb-4 text-gray-600">
            {!loading && <p>Showing {products.length} product(s) in {filters.city}</p>}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <div key={i} className="bg-gray-200 animate-pulse h-80 rounded"></div>)}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded">
              <p className="text-gray-500">No products found in {filters.city}. Try another city or adjust filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => <ProductCard key={product.id} product={product} />)}
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex justify-center gap-4 mt-8">
              <button onClick={handlePrevPage} disabled={page === 0} className={`px-4 py-2 rounded ${page === 0 ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-green-600 text-white hover:bg-green-700"}`}>Previous</button>
              <span className="text-gray-700">Page {page + 1} of {totalPages}</span>
              <button onClick={handleNextPage} disabled={page === totalPages - 1} className={`px-4 py-2 rounded ${page === totalPages - 1 ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-green-600 text-white hover:bg-green-700"}`}>Next</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}