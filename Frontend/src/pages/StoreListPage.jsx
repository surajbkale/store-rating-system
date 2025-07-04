import { useEffect, useState } from "react";
import api from "../services/api";
import { FaStar } from "react-icons/fa";
import NavBar from "../components/NavBar";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

function StoreListPage() {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [selectedRatings, setSelectedRatings] = useState({});

  const fetchStores = async () => {
    try {
      const res = await api.get("/stores", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        params: { search }, // always include search param
      });
      setStores(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load stores.");
    }
  };

  useEffect(() => {
    fetchStores();
  }, []); // only fetch once on page load

  const handleSearch = (e) => {
    e.preventDefault();
    fetchStores();
  };

  const handleRate = async (store, ratingValue) => {
    if (!ratingValue) {
      toast.warn("Please select a rating first.");

      return;
    }

    try {
      if (store.your_rating) {
        await api.put(
          `/ratings/${store.id}`,
          { rating: ratingValue },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        await api.post(
          "/ratings",
          {
            store_id: store.id,
            rating: ratingValue,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      }

      fetchStores();
      toast.success("Rating submitted successfully.");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to submit rating.");
    }
  };

  return (
    <>
      <NavBar />

      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Store List</h1>

        <form onSubmit={handleSearch} className="mb-6 flex gap-3">
          <input
            type="text"
            placeholder="Search by name or address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 w-72 rounded"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Search
          </button>
        </form>

        {error && <p className="text-red-500">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stores.map((store) => (
            <motion.div
              key={store.id}
              className="p-4 border rounded shadow hover:shadow-lg transition"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={store.image_url || "https://via.placeholder.com/150"}
                alt={store.name}
                className="w-full h-40 object-cover mb-3 rounded"
              />
              <h2 className="text-xl font-bold mb-1">{store.name}</h2>
              <p className="text-gray-600 mb-2">{store.address}</p>
              <p>
                <strong>Average Rating:</strong>{" "}
                {store.average_rating || "No Ratings"}
              </p>
              <p>
                <strong>Your Rating:</strong>{" "}
                {store.your_rating || "Not rated yet"}
              </p>

              {/* Star Rating */}
              <div className="mt-3 flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((num) => (
                  <motion.div
                    key={num}
                    whileHover={{ scale: 1.3, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <FaStar
                      className={`cursor-pointer text-2xl ${
                        selectedRatings[store.id] >= num
                          ? "text-yellow-400"
                          : "text-gray-400"
                      }`}
                      onClick={() =>
                        setSelectedRatings({
                          ...selectedRatings,
                          [store.id]: num,
                        })
                      }
                    />
                  </motion.div>
                ))}

                <button
                  onClick={() => handleRate(store, selectedRatings[store.id])}
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 ml-2"
                >
                  {store.your_rating ? "Update" : "Submit"}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}

export default StoreListPage;
