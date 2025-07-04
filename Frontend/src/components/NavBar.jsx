import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import { AnimatePresence, motion } from "framer-motion";

function NavBar() {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);

  const token = localStorage.getItem("token");
  const user = token ? jwtDecode(token) : null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="flex justify-between items-center p-4 bg-gray-800 text-white mb-6 relative">
      <h1 className="text-xl font-bold">Rating Platform</h1>

      <div className="flex items-center gap-4">
        {/* Profile Icon */}
        <button
          onClick={() => setShowProfile((prev) => !prev)}
          className="text-3xl focus:outline-none relative"
        >
          <FaUserCircle />
        </button>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
        >
          Logout
        </button>

        {/* Animated Profile Popup */}
        <AnimatePresence>
          {showProfile && user && (
            <motion.div
              key="profile-popup"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-16 right-24 bg-white text-black p-4 rounded shadow-lg w-64 z-50"
            >
              <p className="font-semibold mb-2">👤 User Profile</p>
              <p>
                <strong>Name:</strong> {user.name}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Role:</strong> {user.role}
              </p>

              {(user.role === "user" || user.role === "owner") && (
                <button
                  onClick={() => {
                    setShowProfile(false);
                    navigate("/change-password");
                  }}
                  className="mt-3 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 w-full"
                >
                  Change Password
                </button>
              )}

              <button
                onClick={() => setShowProfile(false)}
                className="mt-3 bg-gray-800 text-white px-3 py-1 rounded hover:bg-gray-900 w-full"
              >
                Close
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default NavBar;
