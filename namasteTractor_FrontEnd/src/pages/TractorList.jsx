import { useEffect, useState } from "react";
import { getTractors } from "../api/tractorApi";
import TractorCard from "../components/tractors/TractorCard";

const TractorList = () => {
  const [tractors, setTractors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTractors();
  }, []);

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
    {tractors.map((tractor) => (
      <TractorCard key={tractor.id} tractor={tractor} />
    ))}
  </div>
);
};

export default TractorList;