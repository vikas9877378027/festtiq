// src/pages/admin/ServicesAdmin.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  SERVICE_ADD_URL,
  SERVICE_LIST_URL,
  SERVICE_STATUS_URL,
  SERVICE_UPDATE_URL,
  SERVICE_DELETE_URL,
} from "../../config/apiConfig";

const ServicesAdmin = () => {
  // ============= FORM STATE =============
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // ============= LIST STATE =============
  const [services, setServices] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  // ============= EDIT STATE =============
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState(null);
  
  // ============= VIEW STATE =============
  const [selectedService, setSelectedService] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // ============= FETCH SERVICES =============
  const fetchServices = async () => {
    try {
      setListLoading(true);
      const { data } = await axios.get(SERVICE_LIST_URL);
      if (data?.success && Array.isArray(data.services)) {
        setServices(data.services);
      } else {
        setServices([]);
      }
    } catch (err) {
      console.error("Error fetching services:", err?.message);
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // ============= HANDLE FILE =============
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("Selected image:", file.name);
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // ============= SUBMIT (ADD OR UPDATE) =============
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (!name.trim()) {
      setErrorMessage("Service name is required.");
      return;
    }
    if (!price || Number(price) <= 0) {
      setErrorMessage("Valid price is required.");
      return;
    }
    if (!isEditMode && !image) {
      setErrorMessage("Please upload an image.");
      return;
    }

    try {
      setLoading(true);

      const serviceData = {
        name: name.trim(),
        price: Number(price),
        isActive: true,
      };

      const formData = new FormData();
      formData.append("serviceData", JSON.stringify(serviceData));

      if (isEditMode && editingServiceId) {
        formData.append("id", editingServiceId);
      }

      if (image) {
        formData.append("image", image);
      }

      const url = isEditMode ? SERVICE_UPDATE_URL : SERVICE_ADD_URL;
      console.log(`Sending to: ${url}`);

      const response = await axios.post(url, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Response:", response.data);

      if (response.data?.success) {
        const action = isEditMode ? "updated" : "added";
        setSuccessMessage(`Service ${action} successfully.`);

        // Reset edit mode and view state
        setIsEditMode(false);
        setEditingServiceId(null);
        setSelectedService(null);
        setShowEditForm(false);
        setShowAddForm(false);

        // Clear form
        setName("");
        setPrice("");
        setImage(null);
        setPreviewUrl("");

        fetchServices();
      } else {
        throw new Error(response.data?.message || `Failed to ${isEditMode ? 'update' : 'add'} service`);
      }
    } catch (err) {
      const action = isEditMode ? "updating" : "adding";
      console.error(`Error ${action} service:`, err);

      let msg = `Something went wrong while ${action} service.`;

      if (err?.response?.status === 401) {
        msg = "Unauthorized. Please make sure you're logged in as admin.";
      } else if (err?.response?.data?.message) {
        msg = err.response.data.message;
      } else if (err?.message) {
        msg = err.message;
      }

      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  // ============= VIEW SERVICE (NEW FLOW) =============
  const handleViewService = (service) => {
    setSelectedService(service);
    setShowEditForm(false);
    setSuccessMessage("");
    setErrorMessage("");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ============= SHOW EDIT FORM =============
  const handleShowEditForm = () => {
    if (!selectedService) return;
    
    setName(selectedService.name || "");
    setPrice(selectedService.price || "");
    setIsEditMode(true);
    setEditingServiceId(selectedService._id);
    setShowEditForm(true);
    setImage(null);
    setPreviewUrl("");
  };

  // ============= EDIT SERVICE (QUICK EDIT - DIRECT) =============
  const handleEditService = (service) => {
    setName(service.name || "");
    setPrice(service.price || "");
    setIsEditMode(true);
    setEditingServiceId(service._id);
    setSelectedService(null);
    setShowEditForm(true); // Changed from false to true
    setShowAddForm(false);
    setImage(null);
    setPreviewUrl("");
    setSuccessMessage("");
    setErrorMessage("");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ============= CANCEL EDIT =============
  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditingServiceId(null);
    setShowEditForm(false);
    setShowAddForm(false);
    setName("");
    setPrice("");
    setImage(null);
    setPreviewUrl("");
    setSuccessMessage("");
    setErrorMessage("");
  };
  
  // ============= CLOSE VIEW =============
  const handleCloseView = () => {
    setSelectedService(null);
    setShowEditForm(false);
    setShowAddForm(false);
    setIsEditMode(false);
    setEditingServiceId(null);
    setName("");
    setPrice("");
    setImage(null);
    setPreviewUrl("");
  };

  // ============= SHOW ADD FORM =============
  const handleShowAddForm = () => {
    setShowAddForm(true);
    setSelectedService(null);
    setShowEditForm(false);
    setIsEditMode(false);
    setEditingServiceId(null);
    setName("");
    setPrice("");
    setImage(null);
    setPreviewUrl("");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ============= DELETE SERVICE =============
  const handleDeleteService = async (serviceId, serviceName) => {
    if (!confirm(`Are you sure you want to delete "${serviceName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setSuccessMessage("");
      setErrorMessage("");

      const response = await axios.post(
        SERVICE_DELETE_URL,
        { id: serviceId },
        { withCredentials: true }
      );

      if (response.data?.success) {
        setSuccessMessage(`Service "${serviceName}" deleted successfully.`);
        fetchServices();
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        throw new Error(response.data?.message || "Failed to delete service");
      }
    } catch (err) {
      console.error("Error deleting service:", err);

      let msg = "Failed to delete service.";

      if (err?.response?.status === 401) {
        msg = "Unauthorized. Please make sure you're logged in as admin.";
      } else if (err?.response?.data?.message) {
        msg = err.response.data.message;
      } else if (err?.message) {
        msg = err.message;
      }

      setErrorMessage(msg);
      setTimeout(() => setErrorMessage(""), 5000);
    }
  };

  // ============= TOGGLE ACTIVE / INACTIVE =============
  const toggleServiceStatus = async (service) => {
    const newIsActive = !service.isActive;
    const statusText = newIsActive ? "activated" : "deactivated";

    try {
      setUpdatingStatus(service._id);
      setSuccessMessage("");
      setErrorMessage("");

      const response = await axios.post(
        SERVICE_STATUS_URL,
        { id: service._id, isActive: newIsActive },
        { withCredentials: true }
      );

      if (response.data?.success) {
        setServices((prev) =>
          prev.map((s) =>
            s._id === service._id ? { ...s, isActive: newIsActive } : s
          )
        );
        setSuccessMessage(`Service "${service.name}" ${statusText} successfully.`);
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        throw new Error(response.data?.message || "Failed to update status");
      }
    } catch (err) {
      console.error("Error updating status:", err);

      let msg = "Failed to update status.";

      if (err?.response?.status === 401) {
        msg = "Unauthorized. Please make sure you're logged in as admin.";
      } else if (err?.response?.data?.message) {
        msg = err.response.data.message;
      } else if (err?.message) {
        msg = err.message;
      }

      setErrorMessage(msg);
      setTimeout(() => setErrorMessage(""), 5000);
    } finally {
      setUpdatingStatus(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      {/* Page heading */}
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-purple-700">
            Services Management
          </h1>
          <p className="text-sm text-gray-600">
            Add and manage services that appear on the Festiq website.
          </p>
        </div>
        {!showAddForm && !selectedService && (
          <button
            type="button"
            onClick={handleShowAddForm}
            className="inline-flex items-center rounded-full bg-purple-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-purple-700 transition-colors"
          >
            + Add New Service
          </button>
        )}
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

      {/* Service Details View */}
      {selectedService && !showEditForm && (
        <section className="rounded-2xl border border-purple-100 bg-white shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Service Details</h2>
            <button
              type="button"
              onClick={handleCloseView}
              className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Close
            </button>
          </div>

          {/* Service Image */}
          {selectedService.image && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-700">Image</h3>
              <div className="relative w-64 h-40 overflow-hidden rounded-xl border border-gray-200">
                <img
                  src={selectedService.image}
                  alt={selectedService.name}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Service Name */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500">Service Name</label>
            <p className="text-sm text-gray-800">{selectedService.name}</p>
          </div>

          {/* Price */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500">Price</label>
            <p className="text-lg font-semibold text-purple-700">
              ₹{(selectedService.price || 0).toLocaleString('en-IN')}
            </p>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700">Status</h3>
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                selectedService.isActive
                  ? "bg-green-50 text-green-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {selectedService.isActive ? "Active" : "Inactive"}
            </span>
          </div>

          {/* Edit Button */}
          <div className="flex justify-end pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleShowEditForm}
              className="inline-flex items-center rounded-full bg-purple-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-purple-700"
            >
              Edit This Service
            </button>
          </div>
        </section>
      )}

      {/* Form Card - Only show when adding new service OR editing */}
      {(showAddForm || showEditForm) && (
      <section className="rounded-2xl border border-purple-100 bg-white shadow-sm p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">
            {isEditMode ? "Edit Service" : "Add New Service"}
          </h2>
          {isEditMode && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel Edit
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Service Name */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-700">
              Service Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Photography Service"
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            />
          </div>

          {/* Price */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-700">
              Price (₹)
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 25000"
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            />
          </div>

          {/* Image */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-700">
              Service Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-purple-600 file:px-4 file:py-1.5 file:text-xs file:font-medium file:text-white hover:file:bg-purple-700"
            />
            <p className="mt-1 text-[11px] text-gray-500">
              JPG/PNG recommended.
              {image && (
                <span className="font-semibold text-purple-600 ml-2">
                  Image selected
                </span>
              )}
            </p>
          </div>

          {previewUrl && (
            <div>
              <p className="text-xs font-medium text-gray-700 mb-2">
                Preview:
              </p>
              <div className="relative w-48 h-32 overflow-hidden rounded-2xl border border-purple-100 bg-purple-50">
                <img
                  src={previewUrl}
                  alt="preview"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            {isEditMode && (
              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={loading}
                className="inline-flex items-center rounded-full border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-70"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center rounded-full bg-purple-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (isEditMode ? "Updating..." : "Saving...") : (isEditMode ? "Update Service" : "Save Service")}
            </button>
          </div>
        </form>
      </section>
      )}

      {/* TABLE: ALL SERVICES */}
      <section className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-800">
            All Services
          </h2>
          <p className="text-[10px] text-gray-500 mt-0.5">Click on any service to view details</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-purple-50 text-xs uppercase text-gray-700">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {listLoading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-xs text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : services.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-xs text-gray-500">
                    No services yet.
                  </td>
                </tr>
              ) : (
                services.map((s) => (
                  <tr 
                    key={s._id} 
                    className="hover:bg-purple-50 cursor-pointer transition-colors"
                    onClick={() => handleViewService(s)}
                  >
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {s.name}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      ₹{(s.price || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3">
                      {s.image && (
                        <img
                          src={s.image}
                          alt={s.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${
                          s.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {s.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-2 space-x-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => handleEditService(s)}
                        className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] text-blue-700 hover:bg-blue-100 hover:border-blue-300 transition-all"
                      >
                        Quick Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleServiceStatus(s)}
                        disabled={updatingStatus === s._id}
                        className={`rounded-full border px-3 py-1 text-[11px] transition-all ${
                          updatingStatus === s._id
                            ? "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "border-gray-200 text-gray-700 hover:bg-purple-50 hover:border-purple-200"
                        }`}
                      >
                        {updatingStatus === s._id
                          ? "Updating..."
                          : s.isActive
                          ? "Deactivate"
                          : "Activate"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteService(s._id, s.name)}
                        className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-[11px] text-red-700 hover:bg-red-100 hover:border-red-300 transition-all"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default ServicesAdmin;

