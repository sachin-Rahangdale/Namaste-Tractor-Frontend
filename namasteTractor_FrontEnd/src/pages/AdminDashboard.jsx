import { useState } from "react";
import ManageTractors from "../components/admin/ManageTractors";
import ManageArticles from "../components/admin/ManageArticles";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("tractors");

  return (
    <div className="p-5 max-w-6xl mx-auto">

      <h1 className="text-2xl font-bold mb-5">
        Admin Dashboard 🛠️
      </h1>

      {/* 🔀 TABS */}
      <div className="flex gap-3 mb-5">
        <button
          onClick={() => setActiveTab("tractors")}
          className={`px-4 py-2 rounded ${
            activeTab === "tractors"
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
        >
          Manage Tractors
        </button>

        <button
          onClick={() => setActiveTab("articles")}
          className={`px-4 py-2 rounded ${
            activeTab === "articles"
              ? "bg-green-500 text-white"
              : "bg-gray-200"
          }`}
        >
          Manage Articles
        </button>
      </div>

      {/* 📦 CONTENT */}
      {activeTab === "tractors" && <ManageTractors />}
      {activeTab === "articles" && <ManageArticles />}
    </div>
  );
};

export default AdminDashboard;