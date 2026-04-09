import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";


export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-green-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">NamasteTractors</Link>
        <div className="space-x-4">
          <Link to="/" className="hover:text-green-200">Home</Link>
          <Link to="/enquiry/new" className="hover:text-green-200">Raise Enquiry</Link>
          
          {/* Show product management links only if user is logged in */}
          {user && (
            <>
              <Link to="/my-products" className="hover:text-green-200">My Products</Link>
              <Link to="/add-product" className="hover:text-green-200">Sell Product</Link>
            </>
          )}

          {user && user.role === "ADMIN" && (
            <Link to="/admin" className="hover:text-green-200">Admin Panel</Link>
          )}

          {user ? (
            <>
              <span className="text-green-200">Hi, {user.name || user.username}</span>
              <button onClick={logout} className="bg-red-600 px-3 py-1 rounded hover:bg-red-700">Logout</button>
            </>
          ) : (
            <Link to="/login" className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}