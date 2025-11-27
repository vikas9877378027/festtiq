// src/pages/admin/AdminLayout.jsx
import { Outlet, NavLink, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function AdminLayout() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
      {/* <Navbar /> */}

      {/* below fixed header */}
      <div className="flex-1 pt-[120px] pb-10 px-4">
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
