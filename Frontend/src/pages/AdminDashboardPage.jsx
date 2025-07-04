import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { AnimatePresence, motion } from "framer-motion";

function AdminDashboardPage() {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [activeTab, setActiveTab] = useState("users");
  const [filters, setFilters] = useState({
    userName: "",
    userEmail: "",
    userAddress: "",
    userRole: "",
    storeName: "",
    storeEmail: "",
    storeAddress: "",
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const defaultImg = "/store.png";

  const fetchStats = async () => {
    const res = await api.get("/admin/stats", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setStats(res.data);
  };

  const fetchUsers = async () => {
    const res = await api.get("/admin/users", {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        name: filters.userName,
        email: filters.userEmail,
        address: filters.userAddress,
        role: filters.userRole,
      },
    });
    setUsers(res.data);
  };

  const fetchStores = async () => {
    const res = await api.get("/admin/stores", {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        name: filters.storeName,
        email: filters.storeEmail,
        address: filters.storeAddress,
      },
    });
    setStores(res.data);
  };

  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchStores();
  }, []);

  return (
    <>
      <NavBar />
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => navigate("/admin/add-user")}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            ➕ Add User
          </button>
          <button
            onClick={() => navigate("/admin/add-store")}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            🏬 Add Store
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-100 p-4 rounded">
            <h2>Total Users</h2>
            <p className="text-3xl font-bold">{stats.total_users ?? "-"}</p>
          </div>
          <div className="bg-green-100 p-4 rounded">
            <h2>Total Stores</h2>
            <p className="text-3xl font-bold">{stats.total_stores ?? "-"}</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded">
            <h2>Total Ratings</h2>
            <p className="text-3xl font-bold">{stats.total_ratings ?? "-"}</p>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 rounded ${
              activeTab === "users"
                ? "bg-blue-600 text-white"
                : "bg-gray-300 text-gray-800"
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab("stores")}
            className={`px-4 py-2 rounded ${
              activeTab === "stores"
                ? "bg-green-600 text-white"
                : "bg-gray-300 text-gray-800"
            }`}
          >
            Stores
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "users" && (
            <motion.div
              key="users"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* User filters */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  fetchUsers();
                }}
                className="flex flex-wrap gap-2 mb-4"
              >
                <input
                  type="text"
                  placeholder="Name"
                  value={filters.userName}
                  onChange={(e) =>
                    setFilters({ ...filters, userName: e.target.value })
                  }
                  className="border p-2 rounded w-40"
                />
                <input
                  type="text"
                  placeholder="Email"
                  value={filters.userEmail}
                  onChange={(e) =>
                    setFilters({ ...filters, userEmail: e.target.value })
                  }
                  className="border p-2 rounded w-40"
                />
                <input
                  type="text"
                  placeholder="Address"
                  value={filters.userAddress}
                  onChange={(e) =>
                    setFilters({ ...filters, userAddress: e.target.value })
                  }
                  className="border p-2 rounded w-40"
                />
                <select
                  value={filters.userRole}
                  onChange={(e) =>
                    setFilters({ ...filters, userRole: e.target.value })
                  }
                  className="border p-2 rounded w-32"
                >
                  <option value="">All Roles</option>
                  <option value="user">User</option>
                  <option value="owner">Owner</option>
                  <option value="admin">Admin</option>
                </select>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Search
                </button>
              </form>

              <div className="grid grid-cols-3 gap-4">
                {users.map((u) => (
                  <div
                    key={u.id}
                    className="border rounded p-4 space-y-2 shadow"
                  >
                    <h3 className="font-bold text-lg">
                      {u.name} ({u.role})
                    </h3>
                    <p>Email: {u.email}</p>
                    <p>Address: {u.address || "—"}</p>
                    <p>Role: {u.role}</p>
                    {u.store_average_rating && (
                      <p>Store Avg Rating: ⭐ {u.store_average_rating}</p>
                    )}
                    <span className="text-xs text-gray-500">ID: {u.id}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "stores" && (
            <motion.div
              key="stores"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Store filters */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  fetchStores();
                }}
                className="flex flex-wrap gap-2 mb-4"
              >
                <input
                  type="text"
                  placeholder="Name"
                  value={filters.storeName}
                  onChange={(e) =>
                    setFilters({ ...filters, storeName: e.target.value })
                  }
                  className="border p-2 rounded w-40"
                />
                <input
                  type="text"
                  placeholder="Email"
                  value={filters.storeEmail}
                  onChange={(e) =>
                    setFilters({ ...filters, storeEmail: e.target.value })
                  }
                  className="border p-2 rounded w-40"
                />
                <input
                  type="text"
                  placeholder="Address"
                  value={filters.storeAddress}
                  onChange={(e) =>
                    setFilters({ ...filters, storeAddress: e.target.value })
                  }
                  className="border p-2 rounded w-40"
                />
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Search
                </button>
              </form>

              <div className="grid grid-cols-3 gap-4">
                {stores.map((s) => (
                  <div
                    key={s.id}
                    className="border rounded p-4 space-y-2 shadow text-center"
                  >
                    <img
                      src={s.image_url || defaultImg}
                      alt={s.name}
                      className="h-32 w-32 object-contain mx-auto rounded"
                    />
                    <h3 className="font-bold text-lg">{s.name}</h3>
                    <p>Email: {s.email}</p>
                    <p>Address: {s.address}</p>
                    <p>Avg Rating: ⭐ {s.average_rating ?? "N/A"}</p>
                    <span className="text-xs text-gray-500">ID: {s.id}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

export default AdminDashboardPage;
