import { useEffect, useState } from "react";
import { getPendingArticles, approveArticle, rejectArticle } from "../api";

export default function AdminArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    try {
      const res = await getPendingArticles(0, 50);
      setArticles(res.data.content || []);
    } catch (err) {
      setError("Failed to load pending articles.");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (window.confirm("Approve this article?")) {
      await approveArticle(id);
      fetchPending();
    }
  };

  const handleReject = async (id) => {
    const reason = prompt("Reason for rejection:");
    if (reason) {
      await rejectArticle(id, reason);
      fetchPending();
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center text-red-600">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Pending Articles</h1>
      {articles.length === 0 ? (
        <p>No pending articles.</p>
      ) : (
        <div className="grid gap-6">
          {articles.map((a) => (
            <div key={a.id} className="border rounded p-4 bg-white shadow">
              <h2 className="text-xl font-bold">{a.title}</h2>
              <p className="text-gray-600">By {a.author} | {new Date(a.createdAt).toLocaleDateString()}</p>
              <p className="mt-2">{a.shortDescription}</p>
              <div className="mt-4 flex gap-3">
                <button onClick={() => handleApprove(a.id)} className="bg-green-600 text-white px-4 py-1 rounded">Approve</button>
                <button onClick={() => handleReject(a.id)} className="bg-red-600 text-white px-4 py-1 rounded">Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}