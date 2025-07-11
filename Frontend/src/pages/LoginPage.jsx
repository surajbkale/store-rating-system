import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // ✅ added Link
import api from "../services/api.js";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);

      const decoded = jwtDecode(res.data.token);
      const role = decoded.role;

      if (role === "admin") navigate("/admin-dashboard");
      else if (role === "owner") navigate("/owner-dashboard");
      else navigate("/stores");

      localStorage.setItem("clearSearch", "true");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Login failed.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Login</h1>

      <form onSubmit={handleLogin} className="space-y-4 w-80">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-3 border rounded"
        />
        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          className="w-full p-3 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>

      {/* ✅ Signup link */}
      <p className="mt-4 text-sm text-gray-600">
        New user?{" "}
        <Link to="/signup" className="text-blue-600 hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
