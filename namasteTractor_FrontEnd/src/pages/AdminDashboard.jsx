import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link to="/admin/enquiries" className="bg-white p-6 rounded shadow hover:shadow-lg">
          <h2 className="text-xl font-bold">📋 Enquiries</h2>
          <p className="text-gray-600">View and update status</p>
        </Link>
        <Link to="/admin/articles" className="bg-white p-6 rounded shadow hover:shadow-lg">
          <h2 className="text-xl font-bold">📰 Pending Articles</h2>
          <p className="text-gray-600">Approve or reject</p>
        </Link>
        <Link to="/admin/products" className="bg-white p-6 rounded shadow hover:shadow-lg">
          <h2 className="text-xl font-bold">🛒 All Products</h2>
          <p className="text-gray-600">Manage listings</p>
        </Link>
        <Link to="/admin/tractors" className="bg-white p-6 rounded shadow hover:shadow-lg">
          <h2 className="text-xl font-bold">🚜 All Tractors</h2>
          <p className="text-gray-600">Manage tractors</p>
        </Link>
      </div>
    </div>
  );
}