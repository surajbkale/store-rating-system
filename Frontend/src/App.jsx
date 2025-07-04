import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import StoreListPage from "./pages/StoreListPage.jsx";
import OwnerDashboardPage from "./pages/OwnerDashboardPage.jsx";
import AdminDashboardPage from "./pages/AdminDashboardPage.jsx";
import UserDashboardPage from "./pages/UserDashboardPage.jsx";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import AddUserPage from "./pages/AddUserPage";
import AddStorePage from "./pages/AddStorePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/stores"
        element={
          <ProtectedRoute>
            <StoreListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/owner-dashboard"
        element={
          <ProtectedRoute>
            <OwnerDashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user-dashboard"
        element={
          <ProtectedRoute>
            <UserDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/change-password"
        element={
          <ProtectedRoute>
            <ChangePasswordPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/add-user"
        element={
          <ProtectedRoute>
            <AddUserPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/add-store"
        element={
          <ProtectedRoute>
            <AddStorePage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
