// src/pages/admin/AdminLayout.jsx
import { Outlet, NavLink, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ADMIN_LOGOUT } from "../../config/apiConfig";
import { toast } from "react-toastify";
import logo from "../../assets/Logo (1).png";

export default function AdminLayout() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch(ADMIN_LOGOUT, { method: "GET", credentials: "include" });
      localStorage.removeItem("auth_user");
      setUser(null);
      window.dispatchEvent(new Event("auth-updated"));
      toast.success("Admin logged out successfully");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed");
    }
  };

  useEffect(() => {
    // Check if user is logged in as admin
    const checkAuth = () => {
      const authUser = localStorage.getItem("auth_user");
      if (authUser) {
        const parsedUser = JSON.parse(authUser);
        setUser(parsedUser);
      } else {
        setUser(null);
      }
    };

    checkAuth();
    setLoading(false);

    // Listen for auth updates (e.g., from logout)
    const handleAuthUpdate = () => {
      checkAuth();
    };

    window.addEventListener("auth-updated", handleAuthUpdate);
    return () => window.removeEventListener("auth-updated", handleAuthUpdate);
  }, []);

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f2ff] flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  // Redirect to home if not admin
  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-[#f7f2ff] flex flex-col">
      {/* Admin Header */}
      <header className="bg-white shadow-md border-b-2 border-purple-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo and Title */}
            <div className="flex items-center gap-4">
              <img src={logo} alt="Festiq Logo" className="h-10" />
              <div>
                <h1 className="text-2xl font-bold text-purple-600">Admin Dashboard</h1>
                <p className="text-xs text-gray-500">Manage your venue platform</p>
              </div>
            </div>

            {/* Admin Info and Logout */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">{user?.email || 'Admin'}</p>
                <p className="text-xs text-purple-600">Administrator</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors shadow-md"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content Area */}
      <div className="flex-1 pt-8 pb-10 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[240px,1fr] gap-6">
          {/* Sidebar */}
          <aside className="bg-white rounded-3xl shadow-lg px-4 py-5">
            <h2 className="text-sm font-semibold text-purple-700 mb-4">
              Admin Panel
            </h2>

            <nav className="flex flex-col gap-2 text-sm">
              <NavLink
                to="/admin/venues"
                className={({ isActive }) =>
                  [
                    "w-full rounded-full px-4 py-2 transition text-left",
                    isActive
                      ? "bg-[#a855f7] text-white shadow"
                      : "text-gray-700 hover:bg-purple-50",
                  ].join(" ")
                }
              >
                Venues
              </NavLink>

              <NavLink
                to="/admin/gallery"
                className={({ isActive }) =>
                  [
                    "w-full rounded-full px-4 py-2 transition text-left",
                    isActive
                      ? "bg-[#a855f7] text-white shadow"
                      : "text-gray-700 hover:bg-purple-50",
                  ].join(" ")
                }
              >
                Gallery
              </NavLink>

              <NavLink
                to="/admin/services"
                className={({ isActive }) =>
                  [
                    "w-full rounded-full px-4 py-2 transition text-left",
                    isActive
                      ? "bg-[#a855f7] text-white shadow"
                      : "text-gray-700 hover:bg-purple-50",
                  ].join(" ")
                }
              >
                Services
              </NavLink>

              <NavLink
                to="/admin/users"
                className={({ isActive }) =>
                  [
                    "w-full rounded-full px-4 py-2 transition text-left",
                    isActive
                      ? "bg-[#a855f7] text-white shadow"
                      : "text-gray-700 hover:bg-purple-50",
                  ].join(" ")
                }
              >
                Users
              </NavLink>

              <NavLink
                to="/admin/bookings"
                className={({ isActive }) =>
                  [
                    "w-full rounded-full px-4 py-2 transition text-left",
                    isActive
                      ? "bg-[#a855f7] text-white shadow"
                      : "text-gray-700 hover:bg-purple-50",
                  ].join(" ")
                }
              >
                Bookings
              </NavLink>
            </nav>
          </aside>

          {/* Content card */}
          <main className="bg-white rounded-3xl shadow-lg px-6 py-6">
            <Outlet />
          </main>
        </div>
      </div>

      {/* <Footer /> */}
    </div>
  );
}
