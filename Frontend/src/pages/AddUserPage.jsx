import { useState } from "react";
import api from "../services/api";
import NavBar from "../components/NavBar";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function AddUserPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    role: "user",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();

    try {
      await api.post("/admin/users", form, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      toast.success("User added successfully!");
      navigate("/admin-dashboard");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to add user.");
    }
  };

  return (
    <>
      <NavBar />
      <div className="max-w-md mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Add New User</h1>
        <form onSubmit={handleAddUser} className="space-y-4">
          <input type="text" name="name" placeholder="Name" required value={form.name} onChange={handleChange} className="border p-2 w-full rounded" />
          <input type="email" name="email" placeholder="Email" required value={form.email} onChange={handleChange} className="border p-2 w-full rounded" />
          <input type="text" name="address" placeholder="Address" value={form.address} onChange={handleChange} className="border p-2 w-full rounded" />
          <input type="password" name="password" placeholder="Password" required value={form.password} onChange={handleChange} className="border p-2 w-full rounded" />
          <select name="role" value={form.role} onChange={handleChange} className="border p-2 w-full rounded">
            <option value="user">User</option>
            <option value="owner">Store Owner</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full">Add User</button>
        </form>
      </div>
    </>
  );
}

export default AddUserPage;
