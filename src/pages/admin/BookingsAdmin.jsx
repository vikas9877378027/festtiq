// src/pages/admin/BookingsAdmin.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:4000/api";
const BOOKING_LIST_URL = `${API_BASE}/booking/list`; // We'll need to create this endpoint
const BOOKING_STATUS_URL = `${API_BASE}/booking`;

const BookingsAdmin = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  // Fetch all bookings (admin)
  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);

      // For now, we'll use the user endpoint
      // You should create an admin endpoint that fetches ALL bookings
      const response = await axios.get(BOOKING_LIST_URL, {
        withCredentials: true,
      });

      console.log("Bookings response:", response.data);

      if (response.data?.success && Array.isArray(response.data.orders)) {
        setBookings(response.data.orders);
      } else {
        setBookings([]);
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);

      let errorMsg = "Failed to load bookings";
      if (err?.response?.status === 401) {
        errorMsg = "Unauthorized. Please make sure you're logged in as admin.";
      } else if (err?.response?.data?.message) {
        errorMsg = err.response.data.message;
      }

      setError(errorMsg);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  // View booking details
  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Close view
  const handleCloseView = () => {
    setSelectedBooking(null);
  };

  // Update booking status
  const updateBookingStatus = async (bookingId, status, paymentStatus) => {
    try {
      setUpdatingStatus(bookingId);
      setSuccessMessage("");
      setErrorMessage("");

      const response = await axios.patch(
        `${BOOKING_STATUS_URL}/${bookingId}/status`,
        { status, paymentStatus },
        { withCredentials: true }
      );

      if (response.data?.success) {
        setSuccessMessage("Booking status updated successfully.");
        fetchBookings();
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        throw new Error(response.data?.message || "Failed to update status");
      }
    } catch (err) {
      console.error("Error updating status:", err);

      let msg = "Failed to update booking status.";
      if (err?.response?.data?.message) {
        msg = err.response.data.message;
      }

      setErrorMessage(msg);
      setTimeout(() => setErrorMessage(""), 5000);
    } finally {
      setUpdatingStatus(null);
    }
  };

  // Filter bookings
  const filteredBookings = bookings.filter((booking) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      booking.eventTitle?.toLowerCase().includes(searchLower) ||
      booking.eventType?.toLowerCase().includes(searchLower) ||
      booking._id?.toLowerCase().includes(searchLower) ||
      booking.userId?.email?.toLowerCase().includes(searchLower)
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
    });
  };

  // Format event dates
  const formatEventDates = (dates) => {
    if (!dates || dates.length === 0) return "N/A";
    if (dates.length === 1) return dates[0];
    return `${dates[0]} - ${dates[dates.length - 1]}`;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-purple-700">
          Bookings Management
        </h1>
        <p className="text-sm text-gray-600">
          View and manage all customer bookings.
        </p>
      </header>

      {/* Messages */}
      {(successMessage || errorMessage) && (
        <div className="space-y-2">
          {successMessage && (
            <div className="rounded-xl border border-green-100 bg-green-50 px-4 py-2 text-xs text-green-700">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-2 text-xs text-red-700">
              {errorMessage}
            </div>
          )}
        </div>
      )}

      {/* Stats Cards */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
            <p className="text-sm text-purple-600 font-medium mb-1">
              Total Bookings
            </p>
            <p className="text-3xl font-bold text-purple-700">
              {bookings.length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
            <p className="text-sm text-blue-600 font-medium mb-1">Pending</p>
            <p className="text-3xl font-bold text-blue-700">
              {bookings.filter((b) => b.paymentStatus === "pending").length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200">
            <p className="text-sm text-orange-600 font-medium mb-1">
              Partially Paid
            </p>
            <p className="text-3xl font-bold text-orange-700">
              {
                bookings.filter((b) => b.paymentStatus === "partiallyPaid")
                  .length
              }
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
            <p className="text-sm text-green-600 font-medium mb-1">Completed</p>
            <p className="text-3xl font-bold text-green-700">
              {bookings.filter((b) => b.status === "completed").length}
            </p>
          </div>
        </div>
      )}

      {/* Booking Details View */}
      {selectedBooking && (
        <section className="rounded-2xl border border-purple-100 bg-white shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">
              Booking Details
            </h2>
            <button
              type="button"
              onClick={handleCloseView}
              className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Close
            </button>
          </div>

          {/* Booking Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500">
                Booking ID
              </label>
              <p className="text-sm text-gray-800">
                #{selectedBooking._id.slice(-8).toUpperCase()}
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500">
                Event Title
              </label>
              <p className="text-sm text-gray-800 font-medium">
                {selectedBooking.eventTitle}
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500">
                Event Type
              </label>
              <p className="text-sm text-gray-800">{selectedBooking.eventType}</p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500">
                Booking Type
              </label>
              <p className="text-sm text-gray-800 capitalize">
                {selectedBooking.bookingType}
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500">
                Event Dates
              </label>
              <p className="text-sm text-gray-800">
                {formatEventDates(selectedBooking.eventDates)}
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500">
                Event Time
              </label>
              <p className="text-sm text-gray-800">{selectedBooking.eventTime}</p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500">
                Total Days
              </label>
              <p className="text-sm text-gray-800">{selectedBooking.totalDays}</p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500">
                Booking Date
              </label>
              <p className="text-sm text-gray-800">
                {formatDate(selectedBooking.createdAt)}
              </p>
            </div>
          </div>

          {/* Venue Info */}
          {selectedBooking.venueId && (
            <div className="space-y-2 pt-4 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700">Venue</h3>
              <p className="text-sm text-gray-800">
                {selectedBooking.venueId.name}
              </p>
              {selectedBooking.venueId.address && (
                <p className="text-xs text-gray-600">
                  {selectedBooking.venueId.address.line1},{" "}
                  {selectedBooking.venueId.address.city}
                </p>
              )}
            </div>
          )}

          {/* Services */}
          {selectedBooking.selectedServices &&
            selectedBooking.selectedServices.length > 0 && (
              <div className="space-y-2 pt-4 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700">
                  Selected Services
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedBooking.selectedServices.map((service, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700"
                    >
                      {service.name} - ₹{service.price?.toLocaleString()}
                    </span>
                  ))}
                </div>
              </div>
            )}

          {/* Price Breakdown */}
          <div className="space-y-3 pt-4 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700">
              Price Breakdown
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Base Price:</span>
                <span className="text-gray-800">
                  ₹{selectedBooking.basePrice?.toLocaleString()}
                </span>
              </div>
              {selectedBooking.serviceFee > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Service Fee:</span>
                  <span className="text-gray-800">
                    ₹{selectedBooking.serviceFee?.toLocaleString()}
                  </span>
                </div>
              )}
              {selectedBooking.taxes > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxes:</span>
                  <span className="text-gray-800">
                    ₹{selectedBooking.taxes?.toLocaleString()}
                  </span>
                </div>
              )}
              {selectedBooking.discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-green-600">Discount:</span>
                  <span className="text-green-600">
                    -₹{selectedBooking.discount?.toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-gray-200 font-semibold">
                <span className="text-gray-800">Total Amount:</span>
                <span className="text-purple-700 text-lg">
                  ₹{selectedBooking.totalAmount?.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Status & Payment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500">
                Payment Status
              </label>
              <select
                value={selectedBooking.paymentStatus}
                onChange={(e) =>
                  updateBookingStatus(
                    selectedBooking._id,
                    selectedBooking.status,
                    e.target.value
                  )
                }
                disabled={updatingStatus === selectedBooking._id}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              >
                <option value="pending">Pending</option>
                <option value="partiallyPaid">Partially Paid</option>
                <option value="paid">Paid</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500">
                Booking Status
              </label>
              <select
                value={selectedBooking.status}
                onChange={(e) =>
                  updateBookingStatus(
                    selectedBooking._id,
                    e.target.value,
                    selectedBooking.paymentStatus
                  )
                }
                disabled={updatingStatus === selectedBooking._id}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              >
                <option value="booked">Booked</option>
                <option value="confirmed">Confirmed</option>
                <option value="requestedServices">Requested Services</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </section>
      )}

      {/* Search Bar */}
      {!loading && !error && bookings.length > 0 && !selectedBooking && (
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
              placeholder="Search by event title, type, booking ID..."
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
            <p className="text-gray-600 text-lg">Loading bookings...</p>
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
              onClick={fetchBookings}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && bookings.length === 0 && (
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <p className="text-gray-600 text-lg mb-2">No bookings found</p>
            <p className="text-gray-500 text-sm">
              Bookings will appear here once users start booking venues and
              services.
            </p>
          </div>
        </div>
      )}

      {/* Bookings Table */}
      {!loading && !error && filteredBookings.length > 0 && !selectedBooking && (
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h2 className="text-base font-semibold text-gray-800">
              All Bookings ({filteredBookings.length})
            </h2>
            <p className="text-[10px] text-gray-500 mt-0.5">
              Click on any booking to view details
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-purple-50 text-xs uppercase text-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">#</th>
                  <th className="px-6 py-4 text-left font-semibold">Event</th>
                  <th className="px-6 py-4 text-left font-semibold">Type</th>
                  <th className="px-6 py-4 text-left font-semibold">Dates</th>
                  <th className="px-6 py-4 text-left font-semibold">Amount</th>
                  <th className="px-6 py-4 text-left font-semibold">Payment</th>
                  <th className="px-6 py-4 text-left font-semibold">Status</th>
                  <th className="px-6 py-4 text-left font-semibold">Booked On</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredBookings.map((booking, index) => (
                  <tr
                    key={booking._id}
                    className="hover:bg-purple-50 cursor-pointer transition-colors"
                    onClick={() => handleViewBooking(booking)}
                  >
                    <td className="px-6 py-4 text-gray-500 font-medium">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {booking.eventTitle}
                        </p>
                        <p className="text-xs text-gray-500">
                          ID: #{booking._id.slice(-6).toUpperCase()}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {booking.eventType}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {formatEventDates(booking.eventDates)}
                    </td>
                    <td className="px-6 py-4 text-gray-900 font-medium">
                      ₹{booking.totalAmount?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${
                          booking.paymentStatus === "paid"
                            ? "bg-green-100 text-green-700"
                            : booking.paymentStatus === "partiallyPaid"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {booking.paymentStatus === "paid"
                          ? "Paid"
                          : booking.paymentStatus === "partiallyPaid"
                          ? "Partial"
                          : "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${
                          booking.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : booking.status === "confirmed"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {formatDate(booking.createdAt)}
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

export default BookingsAdmin;

