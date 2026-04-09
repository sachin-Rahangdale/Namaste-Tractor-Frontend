import { useEffect, useState } from "react";
import { getTractors, deleteTractor } from "../api";
import TractorCard from "../context/components/TractorCard";

export default function AdminTractors() {
  const [tractors, setTractors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTractors();
  }, []);

  const fetchTractors = async () => {
    try {
      const res = await getTractors(0, 100);
      setTractors(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this tractor?")) {
      await deleteTractor(id);
      fetchTractors();
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">All Tractors</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tractors.map((t) => (
          <div key={t.id} className="relative">
            <TractorCard tractor={t} />
            <button onClick={() => handleDelete(t.id)} className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-sm">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}