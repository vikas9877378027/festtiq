/**
 * Central API Configuration
 * 
 * This file centralizes all API URLs and endpoints to avoid repetition
 * and make it easier to manage API configuration across the application.
 */

// Base API URL - can be changed based on environment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
const API_BASE = `${API_BASE_URL}/api`;

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
  // User endpoints
  user: {
    register: `${API_BASE}/user/register`,
    login: `${API_BASE}/user/login`,
    oauthLogin: `${API_BASE}/user/oauth-login`,
    isAuth: `${API_BASE}/user/is-auth`,
    logout: `${API_BASE}/user/logout`,
    updateProfile: `${API_BASE}/user/update-profile`,
    list: `${API_BASE}/user/list`,
    favorites: `${API_BASE}/user/favorites`,
    toggleFavorite: `${API_BASE}/user/favorites/toggle`,
  },

  // Admin/Seller endpoints
  admin: {
    login: `${API_BASE}/seller/login`,
    isAuth: `${API_BASE}/seller/is-auth`,
    logout: `${API_BASE}/seller/logout`,
    registerVendor: `${API_BASE}/seller/register-vendor`,
    getVendor: (id) => `${API_BASE}/seller/vendor/${id}`,
    updateVendor: (id) => `${API_BASE}/seller/vendor/${id}`,
  },

  // Vendor endpoints
  vendor: {
    login: `${API_BASE}/vendor/login`,
    isAuth: `${API_BASE}/vendor/is-auth`,
    logout: `${API_BASE}/vendor/logout`,
    venues: `${API_BASE}/vendor/venues`,
    bookings: `${API_BASE}/vendor/bookings`,
  },

  // Product/Venue endpoints
  product: {
    list: `${API_BASE}/product/list`,
    add: `${API_BASE}/product/add`,
    update: `${API_BASE}/product/update`,
    delete: `${API_BASE}/product/delete`,
    stock: `${API_BASE}/product/stock`,
    getById: (id) => `${API_BASE}/product/${id}`,
  },

  // Service endpoints
  service: {
    list: `${API_BASE}/service/list`,
    add: `${API_BASE}/service/add`,
    update: `${API_BASE}/service/update`,
    delete: `${API_BASE}/service/delete`,
    status: `${API_BASE}/service/status`,
  },

  // Booking endpoints
  booking: {
    place: `${API_BASE}/booking/place`,
    user: `${API_BASE}/booking/user`,
    list: `${API_BASE}/booking/list`,
    updateStatus: (id) => `${API_BASE}/booking/${id}`,
  },

  // Gallery endpoints
  gallery: {
    list: `${API_BASE}/gallery-section/list`,
    add: `${API_BASE}/gallery-section/add`,
    update: `${API_BASE}/gallery-section/update`,
    delete: `${API_BASE}/gallery-section/delete`,
    status: `${API_BASE}/gallery-section/status`,
  },
};

/**
 * Helper function to get full image URL
 * @param {string} imagePath - The image path from the API (e.g., "/uploads/image.jpg")
 * @returns {string} Full URL to the image
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  // If already a full URL, return as is
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  // Otherwise, prepend the base URL
  return `${API_BASE_URL}${imagePath}`;
};

/**
 * Export API_BASE for backward compatibility or direct use
 */
export { API_BASE, API_BASE_URL };

// Legacy exports for easier migration (can be removed later)
export const USER_REGISTER = API_ENDPOINTS.user.register;
export const USER_LOGIN = API_ENDPOINTS.user.login;
export const USER_IS_AUTH = API_ENDPOINTS.user.isAuth;
export const USER_LOGOUT = API_ENDPOINTS.user.logout;
export const UPDATE_PROFILE = API_ENDPOINTS.user.updateProfile;
export const FAVORITES_URL = API_ENDPOINTS.user.favorites;
export const TOGGLE_FAVORITE_URL = API_ENDPOINTS.user.toggleFavorite;

export const ADMIN_LOGIN = API_ENDPOINTS.admin.login;
export const ADMIN_IS_AUTH = API_ENDPOINTS.admin.isAuth;
export const ADMIN_LOGOUT = API_ENDPOINTS.admin.logout;
export const ADMIN_REGISTER_VENDOR = API_ENDPOINTS.admin.registerVendor;
export const ADMIN_GET_VENDOR = API_ENDPOINTS.admin.getVendor;
export const ADMIN_UPDATE_VENDOR = API_ENDPOINTS.admin.updateVendor;

export const VENDOR_LOGIN = API_ENDPOINTS.vendor.login;
export const VENDOR_IS_AUTH = API_ENDPOINTS.vendor.isAuth;
export const VENDOR_LOGOUT = API_ENDPOINTS.vendor.logout;
export const VENDOR_VENUES = API_ENDPOINTS.vendor.venues;
export const VENDOR_BOOKINGS = API_ENDPOINTS.vendor.bookings;

export const PRODUCT_LIST_URL = API_ENDPOINTS.product.list;
export const PRODUCT_ADD_URL = API_ENDPOINTS.product.add;
export const PRODUCT_UPDATE_URL = API_ENDPOINTS.product.update;
export const PRODUCT_DELETE_URL = API_ENDPOINTS.product.delete;
export const PRODUCT_STOCK_URL = API_ENDPOINTS.product.stock;

export const SERVICE_LIST_URL = API_ENDPOINTS.service.list;
export const SERVICE_ADD_URL = API_ENDPOINTS.service.add;
export const SERVICE_UPDATE_URL = API_ENDPOINTS.service.update;
export const SERVICE_DELETE_URL = API_ENDPOINTS.service.delete;
export const SERVICE_STATUS_URL = API_ENDPOINTS.service.status;

export const BOOKING_URL = API_ENDPOINTS.booking.place;
export const BOOKING_USER_URL = API_ENDPOINTS.booking.user;
export const BOOKING_LIST_URL = API_ENDPOINTS.booking.list;

export const GALLERY_LIST_URL = API_ENDPOINTS.gallery.list;
export const GALLERY_ADD_URL = API_ENDPOINTS.gallery.add;
export const GALLERY_UPDATE_URL = API_ENDPOINTS.gallery.update;
export const GALLERY_DELETE_URL = API_ENDPOINTS.gallery.delete;
export const GALLERY_STATUS_URL = API_ENDPOINTS.gallery.status;

export const VENUE_LIST_URL = API_ENDPOINTS.product.list; // Alias for product.list
export const USER_LIST_URL = API_ENDPOINTS.user.list;

