import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, NavLink } from "react-router-dom";
import axios from "axios";
import { VENDOR_IS_AUTH, VENDOR_LOGOUT } from "../../config/apiConfig";
import { toast } from "react-toastify";

const VendorLayout = () => {
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkVendorAuth();
  }, []);

  const checkVendorAuth = async () => {
    try {
      const response = await axios.get(VENDOR_IS_AUTH, {
        withCredentials: true,
      });

      if (response.data?.success) {
        setVendor(response.data.vendor);
      } else {
        navigate("/vendor/login");
      }
    } catch (error) {
      console.error("Vendor auth check failed:", error);
      navigate("/vendor/login");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axios.get(VENDOR_LOGOUT, {
        withCredentials: true,
      });

      if (response.data?.success) {
        toast.success("Logged out successfully");
        navigate("/vendor/login");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-purple-600">Vendor Portal</h1>
              <span className="text-sm text-gray-500">Read-Only View</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{vendor?.name}</p>
                <p className="text-xs text-gray-500">{vendor?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Buttons */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-b-4 border-purple-200 shadow-md py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-4 justify-center md:justify-start">
            <NavLink
              to="/vendor/dashboard"
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-8 py-4 text-base font-bold rounded-xl border-2 transition-all duration-200 shadow-lg transform hover:scale-105 ${
                  isActive
                    ? "bg-purple-600 text-white border-purple-700 shadow-purple-300"
                    : "bg-white text-gray-800 border-gray-300 hover:border-purple-400 hover:shadow-xl"
                }`
              }
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <span className="text-lg">My Venues</span>
            </NavLink>
            <NavLink
              to="/vendor/bookings"
              className={({ isActive }) =>
                `flex items-center gap-3 px-8 py-4 text-base font-bold rounded-xl border-2 transition-all duration-200 shadow-lg transform hover:scale-105 ${
                  isActive
                    ? "bg-purple-600 text-white border-purple-700 shadow-purple-300"
                    : "bg-white text-gray-800 border-gray-300 hover:border-purple-400 hover:shadow-xl"
                }`
              }
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <span className="text-lg">Venue Bookings</span>
            </NavLink>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet context={{ vendor }} />
      </main>
    </div>
  );
};

export default VendorLayout;
