import { useState } from "react";
import api from "../services/api";
import NavBar from "../components/NavBar";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function ChangePasswordPage() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match.");
      return;
    }

    try {
      await api.put(
        "/user/change-password",
        { oldPassword, newPassword },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      // Show success toast
      toast.success("Password updated successfully! Redirecting...");

      // Clear localStorage and redirect after 2 seconds
      setTimeout(() => {
        localStorage.removeItem("token");
        navigate("/");
      }, 2000);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || "Error updating password.");
    }
  };

  return (
    <>
      <NavBar />
      <div className="max-w-md mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Change Password</h1>

        {message && <p className="mb-4 text-red-500">{message}</p>}

        <form onSubmit={handleChangePassword} className="space-y-4">
          <input
            type="password"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
            className="border p-3 w-full rounded"
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="border p-3 w-full rounded"
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="border p-3 w-full rounded"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Update Password
          </button>
        </form>
      </div>
    </>
  );
}

export default ChangePasswordPage;
