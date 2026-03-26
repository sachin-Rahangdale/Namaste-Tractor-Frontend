import { useEffect, useState } from "react";
import { filterTractors, getTractors } from "../api/tractorApi";
import TractorCard from "../components/tractors/TractorCard";

const TractorList = () => {
  const [tractors, setTractors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTractors();
  }, []);

  const [filters, setFilters] = useState({
  minHp: "",
  maxHp: "",
  minPrice: "",
  maxPrice: "",
  brand: "",
});

const handleFilterChange = (e) => {
  setFilters({
    ...filters,
    [e.target.name]: e.target.value,
  });
};

const applyFilters = async () => {
  try {
    const res = await filterTractors(filters);
    setTractors(res.data.content); // ⚠️ your filter API is paginated
  } catch (err) {
    console.log(err);
  }
};

  const fetchTractors = async () => {
    try {
      const res = await getTractors();
      setTractors(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load tractors");
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Loading State
  if (loading) {
    return (
      <div className="p-5 text-center text-lg font-semibold">
        Loading tractors...
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
  if (!tractors || tractors.length === 0) {
    return (
      <div className="p-5 text-center text-gray-500">
        No tractors found
      </div>
    );
  }

 return (
  
  <div className="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
    <h2 className="text-lg font-semibold mb-3">Filters</h2>

  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">

    <input
      type="number"
      name="minHp"
      placeholder="Min HP"
      value={filters.minHp}
      onChange={handleFilterChange}
      className="border p-2 rounded"
    />

    <input
      type="number"
      name="maxHp"
      placeholder="Max HP"
      value={filters.maxHp}
      onChange={handleFilterChange}
      className="border p-2 rounded"
    />

    <input
      type="number"
      name="minPrice"
      placeholder="Min Price"
      value={filters.minPrice}
      onChange={handleFilterChange}
      className="border p-2 rounded"
    />

    <input
      type="number"
      name="maxPrice"
      placeholder="Max Price"
      value={filters.maxPrice}
      onChange={handleFilterChange}
      className="border p-2 rounded"
    />

    <input
      type="text"
      name="brand"
      placeholder="Brand"
      value={filters.brand}
      onChange={handleFilterChange}
      className="border p-2 rounded"
    />

  </div>
  <div className="mt-4 flex gap-3">
  <button
    onClick={applyFilters}
    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded font-medium transition"
  >
    Apply Filters
  </button>

  <button
    onClick={() => {
      setFilters({
        minHp: "",
        maxHp: "",
        minPrice: "",
        maxPrice: "",
        brand: "",
      });
      fetchTractors();
    }}
    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded font-medium transition"
  >
    Reset
  </button>
</div>

  
    {tractors.map((tractor) => (
      <TractorCard key={tractor.id} tractor={tractor} />
    ))}
  </div>
);
};

export default TractorList;