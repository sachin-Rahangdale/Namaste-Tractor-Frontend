import { useEffect, useState } from "react";

import TractorCard from "../context/components/TractorCard";


import { getTractors, filterTractors, getBrands } from "../api";


export default function TractorListPage() {
  const [tractors, setTractors] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter state
  const [filters, setFilters] = useState({
    brandId: "",
    minHp: "",
    maxHp: "",
    minPrice: "",
    maxPrice: "",
  });

  // Pagination
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 9; // items per page

  // Fetch brands once
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await getBrands();
        setBrands(res.data);
      } catch (err) {
        console.error("Failed to load brands", err);
      }
    };
    fetchBrands();
  }, []);

  // Fetch tractors with filters and pagination
  const fetchTractors = async () => {
    setLoading(true);
    try {
      // Build params: remove empty strings
      const params = {
        page,
        size: pageSize,
        ...(filters.brandId && { brandId: filters.brandId }),
        ...(filters.minHp && { minHp: parseInt(filters.minHp) }),
        ...(filters.maxHp && { maxHp: parseInt(filters.maxHp) }),
        ...(filters.minPrice && { minPrice: parseFloat(filters.minPrice) }),
        ...(filters.maxPrice && { maxPrice: parseFloat(filters.maxPrice) }),
      };

      const res = await filterTractors(params);
      // The filter endpoint returns a paginated object (we assume)
      // If it returns an array directly, adjust accordingly.
      // Based on your Swagger, /filter returns a map, but likely it returns a page.
      // We'll assume it returns { content: [], totalPages, etc. }
      if (res.data.content) {
        setTractors(res.data.content);
        setTotalPages(res.data.totalPages || 0);
      } else {
        // Fallback if array
        setTractors(res.data);
        setTotalPages(1);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load tractors. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Refetch when filters or page change
  useEffect(() => {
    fetchTractors();
  }, [filters, page]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPage(0); // reset to first page on filter change
  };

  const resetFilters = () => {
    setFilters({
      brandId: "",
      minHp: "",
      maxHp: "",
      minPrice: "",
      maxPrice: "",
    });
    setPage(0);
  };

  const handlePrevPage = () => {
    if (page > 0) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages - 1) setPage(page + 1);
  };

  if (error) {
    return <div className="text-center text-red-600 py-10">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Explore Tractors</h1>

      {/* Filter Section */}
      <div className="bg-gray-50 p-4 rounded-lg mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Brand Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
            <select
              name="brandId"
              value={filters.brandId}
              onChange={handleFilterChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">All Brands</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          {/* Min HP */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Min HP</label>
            <input
              type="number"
              name="minHp"
              value={filters.minHp}
              onChange={handleFilterChange}
              placeholder="e.g., 40"
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Max HP */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max HP</label>
            <input
              type="number"
              name="maxHp"
              value={filters.maxHp}
              onChange={handleFilterChange}
              placeholder="e.g., 100"
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Min Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Min Price (₹)</label>
            <input
              type="number"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleFilterChange}
              placeholder="e.g., 500000"
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
              placeholder="e.g., 1500000"
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={resetFilters}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 mr-2"
          >
            Reset Filters
          </button>
          <button
            onClick={() => setPage(0)} // apply filters by resetting page
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 text-gray-600">
        {!loading && <p>Found {tractors.length} tractor(s)</p>}
      </div>

      {/* Tractor Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-200 animate-pulse h-80 rounded"></div>
          ))}
        </div>
      ) : tractors.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded">
          <p className="text-gray-500">No tractors match your filters. Try adjusting your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tractors.map((tractor) => (
            <TractorCard key={tractor.id} tractor={tractor} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
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
    </div>
  );
}