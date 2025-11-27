// src/pages/admin/AdminDashboard.jsx
export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header text */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-purple-700">Dashboard</h1>
        <p className="text-sm text-gray-600">
          Manage venues, gallery images and other content for Festtiq.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-purple-100 bg-gradient-to-b from-purple-50/80 to-white px-4 py-4">
          <h2 className="text-sm font-semibold text-purple-800">Venues</h2>
          <p className="mt-1 text-xs text-gray-600">
            Add, edit and remove venues across cities.
          </p>
        </div>

        <div className="rounded-2xl border border-purple-100 bg-gradient-to-b from-purple-50/80 to-white px-4 py-4">
          <h2 className="text-sm font-semibold text-purple-800">Gallery</h2>
          <p className="mt-1 text-xs text-gray-600">
            Upload images from events and curate the gallery.
          </p>
        </div>

        <div className="rounded-2xl border border-purple-100 bg-gradient-to-b from-purple-50/80 to-white px-4 py-4">
          <h2 className="text-sm font-semibold text-purple-800">Services</h2>
          <p className="mt-1 text-xs text-gray-600">
            Configure services, packages and pricing.
          </p>
        </div>
      </div>
    </div>
  );
}
