import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getPendingArticles,
  approveArticle,
  rejectArticle,
  deleteArticle,
  getArticles,
} from "../../api/articleApi";

const ManageArticles = () => {
  const [pendingArticles, setPendingArticles] = useState([]);
  const [approvedArticles, setApprovedArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchAllArticles();
  }, []);

  // 🔥 FETCH BOTH
  const fetchAllArticles = async () => {
    try {
      setLoading(true);

      const pendingRes = await getPendingArticles();
      const approvedRes = await getArticles();

      setPendingArticles(pendingRes.data.content || []);
      setApprovedArticles(approvedRes.data.content || []);
    } catch (err) {
      console.log(err);
      alert("Failed to load articles");
    } finally {
      setLoading(false);
    }
  };

  // ✅ APPROVE
  const handleApprove = async (id) => {
    try {
      await approveArticle(id);

      // 🔥 move from pending → approved
      const approved = pendingArticles.find((a) => a.id === id);

      setPendingArticles((prev) => prev.filter((a) => a.id !== id));
      setApprovedArticles((prev) => [approved, ...prev]);

    } catch (err) {
      console.log(err);
      alert("Failed to approve");
    }
  };

  // ✅ REJECT
  const handleReject = async (id) => {
    try {
      await rejectArticle(id);

      setPendingArticles((prev) => prev.filter((a) => a.id !== id));

    } catch (err) {
      console.log(err);
      alert("Failed to reject");
    }
  };

  // ✅ DELETE (for approved)
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this article permanently?")) return;

    try {
      await deleteArticle(id);

      setApprovedArticles((prev) =>
        prev.filter((a) => a.id !== id)
      );

    } catch (err) {
      console.log(err);
      alert("Delete failed");
    }
  };

  if (loading) return <div className="p-5">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-5">

      {/* 🔵 HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Articles 🛠️</h1>

        <button
          onClick={() => navigate("/create-article")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Create Article
        </button>
      </div>

      {/* 🟡 PENDING */}
      <h2 className="text-xl font-semibold mb-3">
        Pending Articles
      </h2>

      {pendingArticles.length === 0 ? (
        <p className="text-gray-500 mb-6">No pending articles</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {pendingArticles.map((a) => (
            <div
              key={a.id}
              className="border rounded-xl shadow-sm p-4"
            >
              <img
                src={a.mainImageUrl}
                className="w-full h-40 object-cover rounded mb-3"
              />

              <h3 className="font-semibold text-lg">
                {a.title}
              </h3>

              <p className="text-sm text-gray-500 mb-2">
                By {a.author}
              </p>

              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleApprove(a.id)}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-1.5 rounded"
                >
                  Approve
                </button>

                <button
                  onClick={() => handleReject(a.id)}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-1.5 rounded"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🟢 APPROVED */}
      <h2 className="text-xl font-semibold mb-3">
        Approved Articles
      </h2>

      {approvedArticles.length === 0 ? (
        <p className="text-gray-500">No approved articles</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {approvedArticles.map((a) => (
            <div
              key={a.id}
              className="border rounded-xl shadow-sm p-4"
            >
              <img
                src={a.mainImageUrl}
                className="w-full h-40 object-cover rounded mb-3"
              />

              <h3 className="font-semibold text-lg">
                {a.title}
              </h3>

              <p className="text-sm text-gray-500 mb-2">
                By {a.author}
              </p>

              <button
                onClick={() => handleDelete(a.id)}
                className="w-full mt-2 bg-red-500 hover:bg-red-600 text-white py-1.5 rounded"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageArticles;