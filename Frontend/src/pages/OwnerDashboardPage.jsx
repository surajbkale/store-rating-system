import { useEffect, useState } from "react";
import api from "../services/api";
import NavBar from "../components/NavBar";
import { toast } from "react-toastify";

function OwnerDashboardPage() {
  const [storeRatings, setStoreRatings] = useState([]);
  const defaultImg = "/store.png";

  const fetchOwnerStoreRatings = async () => {
    try {
      const res = await api.get("/stores/my-stores", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.data.length === 0) {
        toast.info("No stores assigned to this owner.");
        return;
      }

      setStoreRatings(res.data[0]);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load ...");
    }
  };

  useEffect(() => {
    fetchOwnerStoreRatings();
  }, []);

  return (
    <>
      <NavBar />
      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Store Owner Dashboard</h1>

        {storeRatings && (
          <div className="border p-4 rounded shadow mb-6">
            <img
              src={storeRatings.image_url || defaultImg}
              alt={storeRatings.name}
              className="h-32 w-32 object-contain mx-auto rounded"
            />
            <h2 className="text-xl font-bold">{storeRatings.name}</h2>
            <p className="text-gray-600">{storeRatings.address}</p>
            <p className="mt-2">
              <strong>Average Rating:</strong>{" "}
              {storeRatings.ratings?.length > 0
                ? (
                    storeRatings.ratings.reduce((sum, r) => sum + r.rating, 0) /
                    storeRatings.ratings.length
                  ).toFixed(2)
                : "No Ratings"}
            </p>
          </div>
        )}

        <h2 className="text-2xl font-semibold mb-3">User Ratings</h2>

        {storeRatings.ratings && storeRatings.ratings.length > 0 ? (
          <div className="space-y-3">
            {storeRatings.ratings.map((r) => (
              <div
                key={r.id}
                className="p-3 border rounded flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{r.user.name}</p>
                  <p className="text-gray-500 text-sm">{r.user.email}</p>
                </div>
                <p className="text-lg font-bold">⭐ {r.rating}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No ratings yet for this store.</p>
        )}
      </div>
    </>
  );
}

export default OwnerDashboardPage;
