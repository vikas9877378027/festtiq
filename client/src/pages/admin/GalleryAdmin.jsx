// src/pages/admin/GalleryAdmin.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:4000/api";
const GALLERY_ADD_URL = `${API_BASE}/gallery-section/add`;
const GALLERY_LIST_URL = `${API_BASE}/gallery-section/list`;
const GALLERY_STATUS_URL = `${API_BASE}/gallery-section/status`;
const GALLERY_UPDATE_URL = `${API_BASE}/gallery-section/update`;
const GALLERY_DELETE_URL = `${API_BASE}/gallery-section/delete`;

const GalleryAdmin = () => {
  // ============= FORM STATE =============
  const [heading, setHeading] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // ============= LIST STATE =============
  const [sections, setSections] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  // ============= EDIT STATE =============
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState(null);
  
  // ============= VIEW STATE =============
  const [selectedSection, setSelectedSection] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // ============= FETCH SECTIONS =============
  const fetchSections = async () => {
    try {
      setListLoading(true);
      const { data } = await axios.get(GALLERY_LIST_URL);
      if (data?.success && Array.isArray(data.sections)) {
        setSections(data.sections);
      } else {
        setSections([]);
      }
    } catch (err) {
      console.error("Error fetching sections:", err?.message);
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  // ============= HANDLE FILES =============
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    console.log(`Selected ${files.length} images:`, files.map(f => f.name));
    setImages(files);
    setPreviewUrls(files.map((file) => URL.createObjectURL(file)));
  };

  // ============= SUBMIT (ADD OR UPDATE) =============
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (!heading.trim()) {
      setErrorMessage("Heading is required.");
      return;
    }
    if (!description.trim()) {
      setErrorMessage("Description is required.");
      return;
    }
    if (!isEditMode && !images.length) {
      setErrorMessage("Please upload at least one image.");
      return;
    }

    try {
      setLoading(true);

      const galleryData = {
        heading: heading.trim(),
        description: description.trim(),
        isActive: true,
      };

      const formData = new FormData();
      formData.append("galleryData", JSON.stringify(galleryData));

      if (isEditMode && editingSectionId) {
        formData.append("id", editingSectionId);
      }

      images.forEach((file, index) => {
        console.log(`Appending image ${index + 1}:`, file.name);
        formData.append("images", file);
      });

      const url = isEditMode ? GALLERY_UPDATE_URL : GALLERY_ADD_URL;
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
        setSuccessMessage(`Gallery section ${action} successfully.`);

        // Reset edit mode and view state
        setIsEditMode(false);
        setEditingSectionId(null);
        setSelectedSection(null);
        setShowEditForm(false);
        setShowAddForm(false);

        // Clear form
        setHeading("");
        setDescription("");
        setImages([]);
        setPreviewUrls([]);

        fetchSections();
      } else {
        throw new Error(response.data?.message || `Failed to ${isEditMode ? 'update' : 'add'} section`);
      }
    } catch (err) {
      const action = isEditMode ? "updating" : "adding";
      console.error(`Error ${action} section:`, err);

      let msg = `Something went wrong while ${action} section.`;

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

  // ============= VIEW SECTION (NEW FLOW) =============
  const handleViewSection = (section) => {
    setSelectedSection(section);
    setShowEditForm(false);
    setSuccessMessage("");
    setErrorMessage("");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ============= SHOW EDIT FORM =============
  const handleShowEditForm = () => {
    if (!selectedSection) return;
    
    setHeading(selectedSection.heading || "");
    setDescription(selectedSection.description || "");
    setIsEditMode(true);
    setEditingSectionId(selectedSection._id);
    setShowEditForm(true);
    setImages([]);
    setPreviewUrls([]);
  };

  // ============= EDIT SECTION (QUICK EDIT - DIRECT) =============
  const handleEditSection = (section) => {
    setHeading(section.heading || "");
    setDescription(section.description || "");
    setIsEditMode(true);
    setEditingSectionId(section._id);
    setSelectedSection(null);
    setShowEditForm(true); // Changed from false to true
    setShowAddForm(false);
    setImages([]);
    setPreviewUrls([]);
    setSuccessMessage("");
    setErrorMessage("");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ============= CANCEL EDIT =============
  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditingSectionId(null);
    setShowEditForm(false);
    setShowAddForm(false);
    setHeading("");
    setDescription("");
    setImages([]);
    setPreviewUrls([]);
    setSuccessMessage("");
    setErrorMessage("");
  };
  
  // ============= CLOSE VIEW =============
  const handleCloseView = () => {
    setSelectedSection(null);
    setShowEditForm(false);
    setShowAddForm(false);
    setIsEditMode(false);
    setEditingSectionId(null);
    setHeading("");
    setDescription("");
    setImages([]);
    setPreviewUrls([]);
  };

  // ============= SHOW ADD FORM =============
  const handleShowAddForm = () => {
    setShowAddForm(true);
    setSelectedSection(null);
    setShowEditForm(false);
    setIsEditMode(false);
    setEditingSectionId(null);
    setHeading("");
    setDescription("");
    setImages([]);
    setPreviewUrls([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ============= DELETE SECTION =============
  const handleDeleteSection = async (sectionId, heading) => {
    if (!confirm(`Are you sure you want to delete "${heading}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setSuccessMessage("");
      setErrorMessage("");

      const response = await axios.post(
        GALLERY_DELETE_URL,
        { id: sectionId },
        { withCredentials: true }
      );

      if (response.data?.success) {
        setSuccessMessage(`Gallery section "${heading}" deleted successfully.`);
        fetchSections();
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        throw new Error(response.data?.message || "Failed to delete section");
      }
    } catch (err) {
      console.error("Error deleting section:", err);

      let msg = "Failed to delete gallery section.";

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
  const toggleSectionStatus = async (section) => {
    const newIsActive = !section.isActive;
    const statusText = newIsActive ? "activated" : "deactivated";

    try {
      setUpdatingStatus(section._id);
      setSuccessMessage("");
      setErrorMessage("");

      const response = await axios.post(
        GALLERY_STATUS_URL,
        { id: section._id, isActive: newIsActive },
        { withCredentials: true }
      );

      if (response.data?.success) {
        setSections((prev) =>
          prev.map((s) =>
            s._id === section._id ? { ...s, isActive: newIsActive } : s
          )
        );
        setSuccessMessage(`Gallery section "${section.heading}" ${statusText} successfully.`);
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
            Gallery Management
          </h1>
          <p className="text-sm text-gray-600">
            Add and manage gallery sections with multiple images.
          </p>
        </div>
        {!showAddForm && !selectedSection && (
          <button
            type="button"
            onClick={handleShowAddForm}
            className="inline-flex items-center rounded-full bg-purple-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-purple-700 transition-colors"
          >
            + Add New Section
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

      {/* Section Details View */}
      {selectedSection && !showEditForm && (
        <section className="rounded-2xl border border-purple-100 bg-white shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Gallery Section Details</h2>
            <button
              type="button"
              onClick={handleCloseView}
              className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Close
            </button>
          </div>

          {/* Images Gallery */}
          {selectedSection.images && selectedSection.images.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-700">Images ({selectedSection.images.length})</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {selectedSection.images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative h-32 overflow-hidden rounded-xl border border-gray-200"
                  >
                    <img
                      src={`http://localhost:4000${img}`}
                      alt={`${selectedSection.heading} - ${idx + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Heading */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500">Heading</label>
            <p className="text-sm text-gray-800">{selectedSection.heading}</p>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500">Description</label>
            <p className="text-sm text-gray-800">{selectedSection.description}</p>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700">Status</h3>
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                selectedSection.isActive
                  ? "bg-green-50 text-green-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {selectedSection.isActive ? "Active" : "Inactive"}
            </span>
          </div>

          {/* Edit Button */}
          <div className="flex justify-end pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleShowEditForm}
              className="inline-flex items-center rounded-full bg-purple-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-purple-700"
            >
              Edit This Section
            </button>
          </div>
        </section>
      )}

      {/* Form Card - Only show when adding new section OR editing */}
      {(showAddForm || showEditForm) && (
      <section className="rounded-2xl border border-purple-100 bg-white shadow-sm p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">
            {isEditMode ? "Edit Gallery Section" : "Add New Gallery Section"}
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
          {/* Heading */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-700">
              Heading
            </label>
            <input
              type="text"
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              placeholder="e.g. Wedding Gallery"
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe this gallery section..."
              rows={4}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            />
          </div>

          {/* Images */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-700">
              Images (multiple)
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-purple-600 file:px-4 file:py-1.5 file:text-xs file:font-medium file:text-white hover:file:bg-purple-700"
            />
            <p className="mt-1 text-[11px] text-gray-500">
              Max 20 images · JPG/PNG recommended.
              {images.length > 0 && (
                <span className="font-semibold text-purple-600 ml-2">
                  {images.length} {images.length === 1 ? 'image' : 'images'} selected
                </span>
              )}
            </p>
          </div>

          {previewUrls.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-700 mb-2">
                Selected Images ({images.length}):
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {previewUrls.map((url, idx) => (
                  <div
                    key={idx}
                    className="relative h-24 overflow-hidden rounded-2xl border border-purple-100 bg-purple-50"
                  >
                    <img
                      src={url}
                      alt={`preview-${idx}`}
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute top-1 left-1 bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">
                      {idx + 1}
                    </span>
                  </div>
                ))}
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
              {loading ? (isEditMode ? "Updating..." : "Saving...") : (isEditMode ? "Update Section" : "Save Section")}
            </button>
          </div>
        </form>
      </section>
      )}

      {/* TABLE: ALL SECTIONS */}
      <section className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-800">
            All Gallery Sections
          </h2>
          <p className="text-[10px] text-gray-500 mt-0.5">Click on any section to view details</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-purple-50 text-xs uppercase text-gray-700">
              <tr>
                <th className="px-4 py-3">Heading</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Images</th>
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
              ) : sections.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-xs text-gray-500">
                    No gallery sections yet.
                  </td>
                </tr>
              ) : (
                sections.map((s) => (
                  <tr 
                    key={s._id} 
                    className="hover:bg-purple-50 cursor-pointer transition-colors"
                    onClick={() => handleViewSection(s)}
                  >
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {s.heading}
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-xs truncate">
                      {s.description}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-gray-500">
                        {s.images?.length || 0} images
                      </span>
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
                        onClick={() => handleEditSection(s)}
                        className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] text-blue-700 hover:bg-blue-100 hover:border-blue-300 transition-all"
                      >
                        Quick Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleSectionStatus(s)}
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
                        onClick={() => handleDeleteSection(s._id, s.heading)}
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

export default GalleryAdmin;
