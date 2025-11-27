import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import avatar from '../assets/venue/avatar.jpg';

const API_BASE = "http://localhost:4000/api";
const USER_IS_AUTH = `${API_BASE}/user/is-auth`;
const UPDATE_PROFILE = `${API_BASE}/user/update-profile`;

const Profile = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(avatar);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingUser, setFetchingUser] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setFetchingUser(true);
      setErrorMessage(""); // Clear any previous errors
      
      // First check if user exists in localStorage
      const storedUser = localStorage.getItem("auth_user");
      console.log("localStorage auth_user:", storedUser ? "exists" : "not found");
      
      if (!storedUser) {
        console.log("No user in localStorage, redirecting...");
        setErrorMessage("Please log in to view your profile");
        setFetchingUser(false);
        setTimeout(() => navigate("/"), 2000);
        return;
      }

      console.log("Attempting to fetch user data from API...");
      const response = await axios.get(USER_IS_AUTH, {
        withCredentials: true,
      });
      
      console.log("API Response:", response.data);
      
      if (response.data?.success && response.data?.user) {
        const user = response.data.user;
        console.log("User data loaded successfully:", user.email);
        setFullName(user.name || "");
        setPhone(user.phone || "");
        setEmail(user.email || "");
        setImage(user.avatar || avatar);
      } else {
        // User not authenticated, redirect to home
        console.log("API returned no user, redirecting...");
        setErrorMessage("Session expired. Please log in again.");
        setFetchingUser(false);
        setTimeout(() => navigate("/"), 2000);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      console.error("Error details:", error.response?.data);
      
      // Check if it's a 401 error (unauthorized)
      if (error.response?.status === 401) {
        setErrorMessage("Session expired. Please log in again.");
        localStorage.removeItem("auth_user");
      } else if (error.code === 'ERR_NETWORK') {
        setErrorMessage("Cannot connect to server. Please check if the backend is running.");
      } else {
        setErrorMessage("Failed to load profile data. Please try again.");
      }
      setFetchingUser(false);
      setTimeout(() => navigate("/"), 3000);
    } finally {
      setFetchingUser(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage("Image size should be less than 5MB");
        return;
      }
      
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml'];
      if (!validTypes.includes(file.type)) {
        setErrorMessage("Please upload a valid image file (JPG, PNG, GIF, SVG)");
        return;
      }
      
      setImageFile(file);
      setImage(URL.createObjectURL(file));
      setErrorMessage("");
    }
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    // Validation
    if (!fullName.trim()) {
      setErrorMessage("Full name is required");
      return;
    }
    if (!email.trim()) {
      setErrorMessage("Email is required");
      return;
    }
    if (!phone.trim()) {
      setErrorMessage("Phone number is required");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address");
      return;
    }

    // Validate phone number (basic validation for 10 digits)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      setErrorMessage("Please enter a valid 10-digit phone number");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", fullName.trim());
      formData.append("email", email.trim());
      formData.append("phone", phone.trim());

      if (imageFile) {
        formData.append("avatar", imageFile);
      }

      const response = await axios.put(UPDATE_PROFILE, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data?.success) {
        setSuccessMessage("Profile updated successfully!");
        setImageFile(null);
        
        // Update localStorage if auth data exists
        const storedUser = localStorage.getItem("auth_user");
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          userData.name = response.data.user.name;
          userData.email = response.data.user.email;
          userData.phone = response.data.user.phone;
          localStorage.setItem("auth_user", JSON.stringify(userData));
        }

        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setErrorMessage(response.data?.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrorMessage(
        error.response?.data?.message || "Failed to update profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset to original values
    fetchUserData();
    setImageFile(null);
    setSuccessMessage("");
    setErrorMessage("");
  };

  if (fetchingUser && !errorMessage) {
    return (
      <div className="min-h-screen pt-[100px] bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8F24AB] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Show error state if there's an error while fetching
  if (errorMessage && !fullName) {
    return (
      <div className="min-h-screen pt-[100px] bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Cannot Access Profile</h2>
          <p className="text-gray-600 mb-6">{errorMessage}</p>
          <div className="space-y-3">
            <button
              onClick={() => navigate("/")}
              className="w-full px-5 py-2 rounded-md bg-[#8F24AB] text-white hover:bg-[#741a92] transition-colors"
            >
              Go to Home
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full px-5 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Retry
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-4">Redirecting to home in a moment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-[100px] bg-white px-4 sm:px-6 md:px-20 py-10 text-[#212121] font-['Plus_Jakarta_Sans']">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)}
        className="text-2xl mb-6 text-gray-500 hover:text-black transition-colors"
      >
        ←
      </button>

      {/* Heading */}
      <div className="text-center mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
          Personal Info
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Update your photo and personal details here.
        </p>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="max-w-3xl mx-auto mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-800 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {successMessage}
          </p>
        </div>
      )}

      {errorMessage && (
        <div className="max-w-3xl mx-auto mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {errorMessage}
          </p>
        </div>
      )}

      {/* Form Container */}
      <div className="max-w-3xl mx-auto border rounded-xl shadow-lg p-6 sm:p-10 bg-white">
        <form onSubmit={handleSaveChanges} className="space-y-6">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-[#8F24AB] focus:border-transparent outline-none"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              disabled={loading}
            />
          </div>

          {/* Phone & Email */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Phone Number</label>
              <div className="flex border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-[#8F24AB]">
                <span className="bg-gray-100 px-3 py-2 text-sm border-r border-gray-300">IN ▼</span>
                <input
                  type="tel"
                  className="flex-1 px-3 py-2 text-sm outline-none"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="10-digit phone number"
                  maxLength={10}
                  disabled={loading}
                />
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-[#8F24AB] focus:border-transparent outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                disabled={loading}
              />
            </div>
          </div>

          {/* Upload Avatar */}
          <div className="w-full border border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center text-center relative hover:border-[#8F24AB] transition-colors">
            <img src={image} alt="Avatar" className="h-14 w-14 rounded-full mb-4 object-cover" />
            <label
              htmlFor="fileUpload"
              className="text-sm text-[#8F24AB] font-medium cursor-pointer underline hover:text-[#741a92]"
            >
              Click to upload
            </label>
            <input
              id="fileUpload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-2">
              or drag and drop<br />
              SVG, PNG, JPG or GIF (max. 800x400px)
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="px-5 py-2 rounded-md border border-gray-300 text-sm hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-md bg-[#8F24AB] text-white text-sm hover:bg-[#741a92] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
