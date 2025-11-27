// src/pages/admin/UsersAdmin.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:4000/api";
const USER_LIST_URL = `${API_BASE}/user/list`;

const UsersAdmin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // ============= VIEW STATE =============
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(USER_LIST_URL, {
        withCredentials: true,
      });
      
      console.log("Users response:", response.data);
      
      if (response.data?.success && Array.isArray(response.data.users)) {
        setUsers(response.data.users);
      } else {
        setUsers([]);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      
      let errorMsg = "Failed to load users";
      if (err?.response?.status === 401) {
        errorMsg = "Unauthorized. Please make sure you're logged in as admin.";
      } else if (err?.response?.data?.message) {
        errorMsg = err.response.data.message;
      }
      
      setError(errorMsg);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.name?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.phone?.toLowerCase().includes(searchLower)
    );
  });

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ============= VIEW USER =============
  const handleViewUser = (user) => {
    setSelectedUser(user);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ============= CLOSE VIEW =============
  const handleCloseView = () => {
    setSelectedUser(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Page Header */}
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-purple-700">
          Users Management
        </h1>
        <p className="text-sm text-gray-600">
          View and manage all registered users on the platform.
        </p>
      </header>

      {/* Stats Cards */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
            <p className="text-sm text-purple-600 font-medium mb-1">Total Users</p>
            <p className="text-3xl font-bold text-purple-700">{users.length}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
            <p className="text-sm text-blue-600 font-medium mb-1">Registered Today</p>
            <p className="text-3xl font-bold text-blue-700">
              {users.filter((u) => {
                if (!u.createdAt) return false;
                const today = new Date().toDateString();
                return new Date(u.createdAt).toDateString() === today;
              }).length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
            <p className="text-sm text-green-600 font-medium mb-1">Active Search</p>
            <p className="text-3xl font-bold text-green-700">
              {filteredUsers.length}
            </p>
          </div>
        </div>
      )}

      {/* User Details View */}
      {selectedUser && (
        <section className="rounded-2xl border border-purple-100 bg-white shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">User Details</h2>
            <button
              type="button"
              onClick={handleCloseView}
              className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Close
            </button>
          </div>

          {/* User Avatar */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
              {selectedUser.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">{selectedUser.name || "N/A"}</h3>
              <p className="text-sm text-gray-500">User ID: {selectedUser._id}</p>
            </div>
          </div>

          {/* User Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500">Email</label>
              <p className="text-sm text-gray-800">
                <a
                  href={`mailto:${selectedUser.email}`}
                  className="hover:text-purple-600 transition-colors"
                >
                  {selectedUser.email || "N/A"}
                </a>
              </p>
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500">Phone</label>
              <p className="text-sm text-gray-800">
                <a
                  href={`tel:${selectedUser.phone}`}
                  className="hover:text-purple-600 transition-colors"
                >
                  {selectedUser.phone || "N/A"}
                </a>
              </p>
            </div>

            {/* Registration Date */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500">Registered On</label>
              <p className="text-sm text-gray-800">{formatDate(selectedUser.createdAt)}</p>
            </div>

            {/* Last Updated */}
            {selectedUser.updatedAt && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500">Last Updated</label>
                <p className="text-sm text-gray-800">{formatDate(selectedUser.updatedAt)}</p>
              </div>
            )}
          </div>

          {/* Additional Info */}
          {selectedUser.address && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500">Address</label>
              <p className="text-sm text-gray-800">{selectedUser.address}</p>
            </div>
          )}

          {/* Account Status */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500">Status:</span>
              <span className="inline-flex rounded-full px-3 py-1 text-xs font-medium bg-green-50 text-green-700">
                Active Account
              </span>
            </div>
          </div>
        </section>
      )}

      {/* Search Bar */}
      {!loading && !error && users.length > 0 && !selectedUser && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
          <div className="flex items-center gap-3">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 outline-none text-sm"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading users...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md text-center">
            <svg
              className="w-12 h-12 text-red-500 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <p className="text-red-600 text-lg mb-4">{error}</p>
            <button
              onClick={fetchUsers}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && users.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 max-w-md text-center">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <p className="text-gray-600 text-lg mb-2">No users found</p>
            <p className="text-gray-500 text-sm">Users will appear here once they register.</p>
          </div>
        </div>
      )}

      {/* No Search Results */}
      {!loading && !error && users.length > 0 && filteredUsers.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="text-center">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <p className="text-gray-600 text-lg mb-2">
              No users match "{searchTerm}"
            </p>
            <button
              onClick={() => setSearchTerm("")}
              className="text-purple-600 hover:text-purple-700 text-sm font-medium"
            >
              Clear search
            </button>
          </div>
        </div>
      )}

      {/* Users Table */}
      {!loading && !error && filteredUsers.length > 0 && !selectedUser && (
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h2 className="text-base font-semibold text-gray-800">
              All Users ({filteredUsers.length})
            </h2>
            <p className="text-[10px] text-gray-500 mt-0.5">Click on any user to view details</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-purple-50 text-xs uppercase text-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">#</th>
                  <th className="px-6 py-4 text-left font-semibold">Name</th>
                  <th className="px-6 py-4 text-left font-semibold">Email</th>
                  <th className="px-6 py-4 text-left font-semibold">Phone</th>
                  <th className="px-6 py-4 text-left font-semibold">Registered On</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user, index) => (
                  <tr
                    key={user._id}
                    className="hover:bg-purple-50 cursor-pointer transition-colors"
                    onClick={() => handleViewUser(user)}
                  >
                    <td className="px-6 py-4 text-gray-500 font-medium">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-semibold">
                          {user.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {user.name || "N/A"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {user.email || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {user.phone || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {formatDate(user.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
};

export default UsersAdmin;

