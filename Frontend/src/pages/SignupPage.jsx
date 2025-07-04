import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js";
import { toast } from "react-toastify";

const SignupPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    role: "user",
  });

  const [error, setError] = useState("");
  toast.success("Signup successful. Please login.");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateInputs = () => {
    const { name, email, address, password, role } = form;

    if (name.length < 20 || name.length > 60) {
      return "Name must be between 20 and 60 characters";
    }

    if (address.length > 400) {
      return "Address cannot exceed 400 characters";
    }

    if (
      password.length < 8 ||
      password.length > 16 ||
      !/[A-Z]/.test(password) ||
      !/[!@#$%^&*(),.?":{}|<>]/.test(password)
    ) {
      return "Password must be 8-16 characters, include 1 uppercase and 1 special character";
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return "Invalid email format";
    }

    if (!["admin", "user", "owner"].includes(role)) {
      return "Invalid role selected";
    }

    return null;
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      await api.post("/auth/signup", form);
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Signup failed.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Signup</h1>

      <form onSubmit={handleSignup} className="space-y-4 w-80">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded"
        />

        <input
          type="text"
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          className="w-full p-3 border rounded"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded"
        />

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full p-3 border rounded"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="owner">Store Owner</option>
        </select>

        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          className="w-full p-3 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Signup
        </button>
      </form>
    </div>
  );
};

export default SignupPage;
