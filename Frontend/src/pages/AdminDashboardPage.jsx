import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";

function AdminDashboardPage() {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({
    userName: "",
    storeName: "",
  });
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const fetchStats = async () => {
    try {
      const res = await api.get("/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data);
    } catch (err) {
      console.error("Failed to load stats", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
        params: filters.userName ? { name: filters.userName } : {},
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to load users", err);
    }
  };

  const fetchStores = async () => {
    try {
      const res = await api.get("/admin/stores", {
        headers: { Authorization: `Bearer ${token}` },
        params: filters.storeName ? { name: filters.storeName } : {},
      });
      setStores(res.data);
    } catch (err) {
      console.error("Failed to load stores", err);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchStores();
  }, []);

  return (
    <>
      <NavBar />
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => navigate("/admin/add-user")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            ➕ Add User
          </button>

          <button
            onClick={() => navigate("/admin/add-store")}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            🏬 Add Store
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="bg-blue-100 p-4 rounded shadow">
            <h2 className="text-lg font-semibold">Total Users</h2>
            <p className="text-2xl font-bold">{stats.total_users ?? "-"}</p>
          </div>
          <div className="bg-green-100 p-4 rounded shadow">
            <h2 className="text-lg font-semibold">Total Stores</h2>
            <p className="text-2xl font-bold">{stats.total_stores ?? "-"}</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded shadow">
            <h2 className="text-lg font-semibold">Total Ratings</h2>
            <p className="text-2xl font-bold">{stats.total_ratings ?? "-"}</p>
          </div>
        </div>

        {/* Filter + User List */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-3">Users</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchUsers();
            }}
            className="mb-4 flex gap-2"
          >
            <input
              type="text"
              placeholder="Search user by name"
              value={filters.userName}
              onChange={(e) =>
                setFilters({ ...filters, userName: e.target.value })
              }
              className="border p-2 rounded w-64"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Search
            </button>
          </form>

          <div className="space-y-2">
            {users.map((u) => (
              <div
                key={u.id}
                className="border p-3 rounded flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">
                    {u.name} ({u.role})
                  </p>
                  <p className="text-sm text-gray-500">{u.email}</p>
                  {u.store_average_rating && (
                    <p className="text-sm">
                      Store Avg Rating: ⭐ {u.store_average_rating}
                    </p>
                  )}
                </div>
                <span className="text-xs text-gray-400">ID: {u.id}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Filter + Store List */}
        <div>
          <h2 className="text-xl font-semibold mb-3">Stores</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchStores();
            }}
            className="mb-4 flex gap-2"
          >
            <input
              type="text"
              placeholder="Search store by name"
              value={filters.storeName}
              onChange={(e) =>
                setFilters({ ...filters, storeName: e.target.value })
              }
              className="border p-2 rounded w-64"
            />
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Search
            </button>
          </form>

          <div className="space-y-2">
            {stores.map((s) => (
              <div
                key={s.id}
                className="border p-3 rounded flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{s.name}</p>
                  <p className="text-sm text-gray-500">{s.email}</p>
                  <p className="text-sm text-gray-700">
                    Avg Rating: {s.average_rating ?? "N/A"}
                  </p>
                </div>
                <span className="text-xs text-gray-400">ID: {s.id}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminDashboardPage;
