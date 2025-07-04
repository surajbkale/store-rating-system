import { useState } from "react";
import api from "../services/api";
import NavBar from "../components/NavBar";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function AddStorePage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    owner_id: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddStore = async (e) => {
    e.preventDefault();
    console.log("Form data sent: ", form);

    try {
      await api.post("/admin/stores", form, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      toast.success("Store added successfully!");
      navigate("/admin-dashboard");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to add store.");
    }
  };

  return (
    <>
      <NavBar />
      <div className="max-w-md mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Add New Store</h1>
        <form onSubmit={handleAddStore} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Store Name"
            required
            value={form.name}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
          <input
            type="email"
            name="email"
            placeholder="Store Email"
            required
            value={form.email}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
          <input
            type="number"
            name="owner_id"
            placeholder="Owner User ID "
            value={form.owner_id}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
          >
            Add Store
          </button>
        </form>
      </div>
    </>
  );
}

export default AddStorePage;
