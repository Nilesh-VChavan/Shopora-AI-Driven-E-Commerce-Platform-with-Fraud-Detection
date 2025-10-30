import { Link, useNavigate } from "react-router-dom";
import { removeToken } from "../utils/auth";
import CartIcon from "./CartIcon";

export default function Navbar({ role, setRole }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    setRole(null);
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-transparent backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Brand Name */}
        <Link
          to="/"
          className="text-3xl font-extrabold bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-500 text-transparent bg-clip-text tracking-tight"
        >
          Shopora
        </Link>

        <div className="flex items-center gap-6">
          {/* Cart icon visible only when logged in */}
          {role && (
            <Link to="/cart" className="relative">
              <CartIcon />
            </Link>
          )}

          {!role ? (
            <Link
              to="/login"
              className="px-5 py-2 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white rounded-full font-semibold shadow-md hover:shadow-lg transition-all"
            >
              Login
            </Link>
          ) : (
            <>
              <span className="text-white/80 font-medium">
                Hi, {role === "admin" ? "Admin" : "User"}
              </span>
              {role === "admin" && (
                <Link
                  to="/admin"
                  className="text-fuchsia-400 font-semibold hover:underline"
                >
                  Admin
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="text-red-400 font-medium hover:underline"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
