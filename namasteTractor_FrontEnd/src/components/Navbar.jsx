import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <div className="flex justify-between items-center bg-gray-800 text-white p-4">
      <div className="text-lg font-bold">Namaste Tractors 🚜</div>

      <div className="flex gap-4 items-center">
        <Link to="/">Home</Link>
        <Link to="/tractors">Tractors</Link>
        <Link to="/articles">Articles</Link>

        {user?.role === "ADMIN" && (
          <Link to="/admin">Admin</Link>
        )}

        {!user ? (
          <Link to="/login">Login</Link>
        ) : (
          <button
            onClick={handleLogout}
            className="bg-red-500 px-3 py-1 rounded"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;