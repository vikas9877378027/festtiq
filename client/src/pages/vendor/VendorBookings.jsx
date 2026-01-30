import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import { VENDOR_BOOKINGS } from "../../config/apiConfig";
import { toast } from "react-toastify";

const VendorBookings = () => {
  const { vendor } = useOutletContext();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get(VENDOR_BOOKINGS, {
        withCredentials: true,
      });

      if (response.data?.success) {
        setBookings(response.data.bookings);
      } else {
        toast.error("Failed to load bookings");
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error(error.response?.data?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

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

  // Filter bookings
  const filteredBookings = bookings.filter((booking) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      booking.eventTitle?.toLowerCase().includes(searchLower) ||
      booking.eventType?.toLowerCase().includes(searchLower) ||
      booking.userId?.name?.toLowerCase().includes(searchLower) ||
      booking.userId?.email?.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Venue Bookings</h2>
        <p className="text-gray-600">View bookings for your venues and customer details</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Total Bookings</p>
          <p className="text-3xl font-bold text-purple-600">{bookings.length}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Confirmed</p>
          <p className="text-3xl font-bold text-blue-600">
            {bookings.filter((b) => b.status === "confirmed").length}
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Pending</p>
          <p className="text-3xl font-bold text-amber-600">
            {bookings.filter((b) => b.status === "booked").length}
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Completed</p>
          <p className="text-3xl font-bold text-green-600">
            {bookings.filter((b) => b.status === "completed").length}
          </p>
        </div>
      </div>

      {/* Read-Only Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <svg
            className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <p className="text-sm font-semibold text-blue-800">Information Only</p>
            <p className="text-xs text-blue-700 mt-1">
              You can view booking details and customer information. For any changes or updates, please contact the administrator.
            </p>
          </div>
        </div>
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Booking Details</h3>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Booking ID & Status */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Booking ID</p>
                  <p className="text-lg font-bold text-purple-600">
                    FTQ-{selectedBooking._id.slice(-8).toUpperCase()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      selectedBooking.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : selectedBooking.status === "confirmed"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {selectedBooking.status}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      selectedBooking.paymentStatus === "paid"
                        ? "bg-green-100 text-green-700"
                        : selectedBooking.paymentStatus === "partiallyPaid"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {selectedBooking.paymentStatus === "paid"
                      ? "Paid"
                      : selectedBooking.paymentStatus === "partiallyPaid"
                      ? "Partially Paid"
                      : "Pending Payment"}
                  </span>
                </div>
              </div>

              {/* Customer Details */}
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                <h4 className="text-sm font-bold text-purple-900 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  Customer Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-purple-700 font-medium">Name</p>
                    <p className="text-sm text-gray-900 font-semibold">
                      {selectedBooking.userId?.name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-purple-700 font-medium">Email</p>
                    <p className="text-sm text-gray-900">{selectedBooking.userId?.email || "N/A"}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-xs text-purple-700 font-medium">Phone</p>
                    <p className="text-sm text-gray-900">{selectedBooking.userId?.phone || "Not provided"}</p>
                  </div>
                </div>
              </div>

              {/* Event Details */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-3">Event Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Event Title</p>
                    <p className="text-sm text-gray-900 font-medium">{selectedBooking.eventTitle}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Event Type</p>
                    <p className="text-sm text-gray-900">{selectedBooking.eventType}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Event Dates</p>
                    <p className="text-sm text-gray-900">{formatEventDates(selectedBooking.eventDates)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Event Time</p>
                    <p className="text-sm text-gray-900">{selectedBooking.eventTime}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Duration</p>
                    <p className="text-sm text-gray-900">{selectedBooking.totalDays} day(s)</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Booked On</p>
                    <p className="text-sm text-gray-900">{formatDate(selectedBooking.createdAt)}</p>
                  </div>
                </div>
              </div>

              {/* Venue Details */}
              {selectedBooking.venueId && (
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-3">Venue</h4>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="font-medium text-gray-900">{selectedBooking.venueId.name}</p>
                    {selectedBooking.venueId.location && (
                      <p className="text-sm text-gray-600 mt-1">{selectedBooking.venueId.location}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Services */}
              {selectedBooking.selectedServices && selectedBooking.selectedServices.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-3">Selected Services</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedBooking.selectedServices.map((service, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                      >
                        {service.name} - ₹{service.price?.toLocaleString()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Details */}
              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-bold text-gray-900 mb-3">Price Breakdown</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Base Price:</span>
                    <span className="text-gray-900">₹{selectedBooking.basePrice?.toLocaleString()}</span>
                  </div>
                  {selectedBooking.serviceFee > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Service Fee:</span>
                      <span className="text-gray-900">₹{selectedBooking.serviceFee?.toLocaleString()}</span>
                    </div>
                  )}
                  {selectedBooking.taxes > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Taxes:</span>
                      <span className="text-gray-900">₹{selectedBooking.taxes?.toLocaleString()}</span>
                    </div>
                  )}
                  {selectedBooking.discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">Discount:</span>
                      <span className="text-green-600">-₹{selectedBooking.discount?.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-gray-200">
                    <span className="text-base font-bold text-gray-900">Total Amount:</span>
                    <span className="text-lg font-bold text-purple-600">
                      ₹{selectedBooking.totalAmount?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4">
              <button
                onClick={() => setSelectedBooking(null)}
                className="w-full bg-purple-600 text-white py-2.5 rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search Bar */}
      {bookings.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mb-6">
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
              placeholder="Search by event title, type, customer name, email..."
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

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
          <svg
            className="w-16 h-16 text-gray-300 mx-auto mb-4"
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
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {searchTerm ? "No bookings found" : "No Bookings Yet"}
          </h3>
          <p className="text-gray-600 text-sm">
            {searchTerm
              ? "Try adjusting your search terms"
              : "Bookings for your venues will appear here once customers start booking."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-md border-2 border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-purple-600 text-xs uppercase text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-bold">#</th>
                  <th className="px-6 py-4 text-left font-bold">Event</th>
                  <th className="px-6 py-4 text-left font-bold">Customer</th>
                  <th className="px-6 py-4 text-left font-bold">Venue</th>
                  <th className="px-6 py-4 text-left font-bold">Dates</th>
                  <th className="px-6 py-4 text-left font-bold">Amount</th>
                  <th className="px-6 py-4 text-left font-bold">Status</th>
                  <th className="px-6 py-4 text-left font-bold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBookings.map((booking, index) => (
                  <tr
                    key={booking._id}
                    className="hover:bg-purple-50 transition-all duration-200 border-b border-gray-100"
                  >
                    <td className="px-6 py-4 text-gray-600 font-bold text-base">{index + 1}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-gray-900">{booking.eventTitle}</p>
                        <p className="text-xs text-gray-600 font-medium">{booking.eventType}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">{booking.userId?.name || "N/A"}</p>
                        <p className="text-xs text-gray-600">{booking.userId?.email || "N/A"}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-800 font-medium">
                      {booking.venueId?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-gray-800 font-medium">
                      {formatEventDates(booking.eventDates)}
                    </td>
                    <td className="px-6 py-4 text-gray-900 font-bold text-base">
                      ₹{booking.totalAmount?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase ${
                          booking.status === "completed"
                            ? "bg-green-100 text-green-800 border border-green-300"
                            : booking.status === "confirmed"
                            ? "bg-blue-100 text-blue-800 border border-blue-300"
                            : "bg-amber-100 text-amber-800 border border-amber-300"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="px-4 py-2 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-700 hover:shadow-lg transform hover:scale-105 transition-all duration-200 shadow-md"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorBookings;
