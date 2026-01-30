
import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth0 } from '@auth0/auth0-react';
import { toast } from 'react-toastify';
import { HiLocationMarker } from "react-icons/hi";
import { CiLocationOn } from "react-icons/ci";
import {
  Bars3Icon,
  XMarkIcon,
  EyeIcon,
  EyeSlashIcon,
  UserIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaApple } from "react-icons/fa";
import avatar from "../assets/venue/avatar.jpg";
import logo from "../assets/Logo (1).png";
import {
  API_BASE,
  USER_REGISTER,
  USER_LOGIN,
  USER_IS_AUTH,
  USER_LOGOUT,
  ADMIN_LOGIN,
  ADMIN_IS_AUTH,
  ADMIN_LOGOUT,
  API_ENDPOINTS,
} from "../config/apiConfig";

/* ===========================================
   Auth Modal (email/password, no phone/OTP)
   =========================================== */
function AuthModal({ show, onClose, onSuccess }) {
  const [role, setRole] = useState("user");     // 'user' | 'admin'
  const [mode, setMode] = useState("signin");   // 'signin' | 'signup' (user only)
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (show) {
      setRole("user");
      setMode("signin");
      setForm({ name: "", email: "", phone: "", password: "" });
      setErr("");
    }
  }, [show]);

  useEffect(() => {
    if (role === "admin") setMode("signin");
  }, [role]);

  const update = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const validate = () => {
    if (!form.email.trim()) return "Email is required";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Enter a valid email";
    if (!form.password || form.password.length < 6)
      return "Password must be at least 6 characters";
    if (role === "user" && mode === "signup") {
      if (!form.name.trim()) return "Name is required";
      if (!form.phone.trim()) return "Phone number is required";
      if (!/^[0-9]{10}$/.test(form.phone.replace(/\D/g, "")))
        return "Enter a valid 10-digit phone number";
    }
    return "";
  };

  // helper: POST with cookies
  const fetchJson = async (url, body) => {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // send/receive cookie
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    return { res, data };
  };

  // GET /is-auth with cookies — chooses by role
  const getIsAuth = async (whichRole) => {
    const url = whichRole === "admin" ? ADMIN_IS_AUTH : USER_IS_AUTH;
    const res = await fetch(url, { method: "GET", credentials: "include" });
    const data = await res.json().catch(() => ({}));
    return { res, data };
  };

  // submit (login/signup)
  const submit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (v) return setErr(v);

    try {
      setLoading(true);
      setErr("");

      // choose endpoint by role/mode (all POST)
      let url = USER_LOGIN;
      if (role === "user" && mode === "signup") url = USER_REGISTER;
      if (role === "admin") url = ADMIN_LOGIN;

      // primary POST
      const { res, data } = await fetchJson(url, form);
      if (!res.ok || (typeof data.success !== "undefined" && !data.success)) {
        throw new Error(data?.message || "Unable to authenticate");
      }

      // verify cookie/session and load canonical user from server
      const { res: ar, data: ad } = await getIsAuth(role);
      if (ar.ok && ad?.success && ad?.user) {
        onSuccess({ user: { ...ad.user, role } }); // no token needed
        
        // Show success toast
        if (mode === "signup") {
          toast.success("Account created successfully", {
            position: "top-right",
            autoClose: 2500,
          });F
        } else {
          toast.success(role === "admin" ? "Admin logged in successfully" : "Logged in successfully", {
            position: "top-right",
            autoClose: 2500,
          });
        }
      } else {
        // fallback to body user if is-auth not available yet
        const userObj =
          data.user ||
          (data.data && data.data.user) ||
          { name: data.name, email: data.email };
        if (!userObj) throw new Error("Invalid server response (missing user)");
        onSuccess({ user: { ...userObj, role } });
        
        // Show success toast
        if (mode === "signup") {
          toast.success("Account created successfully", {
            position: "top-right",
            autoClose: 2500,
          });
        } else {
          toast.success(role === "admin" ? "Admin logged in successfully" : "Logged in successfully", {
            position: "top-right",
            autoClose: 2500,
          });
        }
      }

      onClose();
    } catch (e) {
      setErr(e.message);
      toast.error(e.message || "Authentication failed", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
      style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
    >
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        {/* Header: role toggle + title + close */}
        <div className="relative border-b px-6 py-4">
          <button
            type="button"
            title={role === "admin" ? "Switch to User" : "Switch to Admin"}
            onClick={() =>
              setRole((r) => (r === "user" ? "admin" : "user"))
            }
            className={`absolute left-4 top-1/2 -translate-y-1/2 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition
              ${
                role === "admin"
                  ? "bg-[#8F24AB] text-white border-[#8F24AB]"
                  : "bg-white text-gray-700 hover:bg-gray-50 border-gray-200"
              }`}
            aria-label="Toggle role"
          >
            {role === "admin" ? (
              <>
                <ShieldCheckIcon className="h-5 w-5" />
                <span className="hidden sm:inline">Admin</span>
              </>
            ) : (
              <>
                <UserIcon className="h-5 w-5" />
                <span className="hidden sm:inline">User</span>
              </>
            )}
          </button>

          <h2 className="text-2xl font-semibold text-gray-900 text-center">
            Log in or Sign up
          </h2>

          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded p-1 hover:bg-gray-100"
            onClick={onClose}
            aria-label="Close"
          >
            <XMarkIcon className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        <div className="px-6 pb-6 pt-5">
          {/* Tabs (user only) */}
          {role === "user" && (
            <div className="mb-5 flex justify-center">
              <div className="relative w-60">
                <div className="rounded-full border bg-gray-50 p-1 flex text-sm font-medium">
                  <span
                    className={`absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-white shadow-sm transition-transform duration-200 ${
                      mode === "signin"
                        ? "translate-x-0"
                        : "translate-x-full"
                    }`}
                    aria-hidden="true"
                  />
                  <button
                    onClick={() => setMode("signin")}
                    className={`relative z-10 w-1/2 py-2 rounded-full ${
                      mode === "signin"
                        ? "text-[#8F24AB]"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    Sign in
                  </button>
                  <button
                    onClick={() => setMode("signup")}
                    className={`relative z-10 w-1/2 py-2 rounded-full ${
                      mode === "signup"
                        ? "text-[#8F24AB]"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    Sign up
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={submit} className="space-y-4">
            {role === "user" && mode === "signup" && (
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={update}
                  className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-[#8F24AB]"
                  placeholder="Enter your full name"
                  autoComplete="name"
                />
              </div>
            )}

            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Email
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={update}
                className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-[#8F24AB]"
                placeholder="Enter your email address"
                autoComplete="email"
              />
            </div>

            {role === "user" && mode === "signup" && (
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={update}
                  className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-[#8F24AB]"
                  placeholder="Enter your phone number"
                  autoComplete="tel"
                />
              </div>
            )}

            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Password
              </label>
              <div className="flex items-center border rounded-md px-3">
                <input
                  name="password"
                  type={showPwd ? "text" : "password"}
                  value={form.password}
                  onChange={update}
                  className="w-full py-2 outline-none"
                  placeholder="Enter your password"
                  autoComplete={
                    role === "user" && mode === "signup"
                      ? "new-password"
                      : "current-password"
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((s) => !s)}
                  className="ml-2 p-1"
                >
                  {showPwd ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {err && <p className="text-sm text-red-600">{err}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-[#8F24AB] py-2 font-medium text-white hover:bg-[#5E0C7D] disabled:opacity-60"
            >
              {loading ? "Please wait…" : "Continue"}
            </button>
          </form>

          {/* Divider + Social — HIDE on User → Sign up */}
          {(role === "admin" || (role === "user" && mode === "signin")) && (
            <>
              <div className="flex items-center my-5">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="px-3 text-xs text-gray-500">OR</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <OAuth0Buttons />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================
   OAuth Buttons Component
   ========================= */
const OAuth0Buttons = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <div className="space-y-3">
      <button 
        type="button"
        onClick={() => loginWithRedirect({
          authorizationParams: {
            connection: 'google-oauth2'
          }
        })}
        className="w-full flex items-center justify-center gap-3 rounded-md border px-4 py-2 hover:bg-gray-50"
      >
        <FcGoogle className="text-xl" />
        <span className="text-sm font-medium">
          Continue with Google
        </span>
      </button>
      <button 
        type="button"
        onClick={() => loginWithRedirect({
          authorizationParams: {
            connection: 'facebook'
          }
        })}
        className="w-full flex items-center justify-center gap-3 rounded-md border px-4 py-2 hover:bg-gray-50"
      >
        <FaFacebook className="text-xl text-[#1877F2]" />
        <span className="text-sm font-medium">
          Continue with Facebook
        </span>
      </button>
      <button 
        type="button"
        onClick={() => loginWithRedirect({
          authorizationParams: {
            connection: 'apple'
          }
        })}
        className="w-full flex items-center justify-center gap-3 rounded-md border px-4 py-2 hover:bg-gray-50"
      >
        <FaApple className="text-xl" />
        <span className="text-sm font-medium">
          Continue with Apple
        </span>
      </button>
    </div>
  );
};

/* =========================
   Navbar (keeps your look)
   ========================= */
const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";
  
  // Auth0 hooks
  const { user: auth0User, isAuthenticated, isLoading: auth0Loading, logout: auth0Logout } = useAuth0();

  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const [user, setUser] = useState(() => {
    const u = localStorage.getItem("auth_user");
    return u ? JSON.parse(u) : null; // includes role
  });

  // Handle Auth0 login callback - sync with backend
  useEffect(() => {
    if (isAuthenticated && auth0User && !user) {
      (async () => {
        try {
          console.log("🔐 Auth0 user detected, syncing with backend...", auth0User);
          
          // Use the OAuth login endpoint
          const oauthRes = await fetch(API_ENDPOINTS.user.oauthLogin, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              name: auth0User.name || auth0User.nickname || "User",
              email: auth0User.email,
              uid: auth0User.sub, // Auth0 user ID
              photoURL: auth0User.picture || "", // Auth0 profile picture
              provider: "auth0", // OAuth provider
            }),
          });

          const oauthData = await oauthRes.json();
          
          if (oauthRes.ok && oauthData.success) {
            // OAuth login successful
            const u = { ...oauthData.user, role: "user" };
            setUser(u);
            localStorage.setItem("auth_user", JSON.stringify(u));
            window.dispatchEvent(new Event("auth-updated"));
            
            toast.success("Logged in successfully", {
              position: "top-right",
              autoClose: 2500,
            });
          } else {
            throw new Error(oauthData.message || "Authentication failed");
          }
        } catch (error) {
          console.error("Auth0 sync error:", error);
          toast.error(error.message || "Login failed. Please try again.", {
            position: "top-right",
            autoClose: 3000,
          });
        }
      })();
    }
  }, [isAuthenticated, auth0User, user]);

  // Restore session using cookie on first load: try user, then admin
  useEffect(() => {
    (async () => {
      try {
        // try user
        let res = await fetch(USER_IS_AUTH, {
          method: "GET",
          credentials: "include",
        });
        if (res.ok) {
          const d = await res.json();
          if (d?.success && d?.user) {
            const u = { ...d.user, role: "user" };
            setUser(u);
            localStorage.setItem("auth_user", JSON.stringify(u));
            return;
          }
        }

        // try admin
        res = await fetch(ADMIN_IS_AUTH, {
          method: "GET",
          credentials: "include",
        });
        if (res.ok) {
          const d = await res.json();
          if (d?.success && d?.user) {
            const u = { ...d.user, role: "admin" };
            setUser(u);
            localStorage.setItem("auth_user", JSON.stringify(u));
            
            // Only redirect to admin panel if on home/public pages, not vendor pages
            const isVendorPage = location.pathname.startsWith("/vendor");
            const isAdminPage = location.pathname.startsWith("/admin");
            const isPublicPage = !isVendorPage && !isAdminPage;
            
            // Redirect admin to admin panel ONLY if they're on a public page
            if (isPublicPage) {
              navigate("/admin");
            }
            return;
          }
        }

        // ❗ IMPORTANT: we no longer clear localStorage here.
        // If there is no active cookie session, we simply don't overwrite
        // whatever was already in auth_user.
      } catch (e) {
        console.error("Session restore failed", e);
        // also do not clear localStorage on error.
      }
    })();
  }, []);

  const handleLogout = async () => {
    if (logoutLoading) return;
    setLogoutLoading(true);
    
    // Store if user was admin before clearing
    const wasAdmin = user?.role === "admin";
    
    try {
      // fire both; ignore individual failures
      await Promise.allSettled([
        fetch(USER_LOGOUT, { method: "GET", credentials: "include" }),
        fetch(ADMIN_LOGOUT, { method: "GET", credentials: "include" }),
      ]);
      
      // Also logout from Auth0 if authenticated
      if (isAuthenticated) {
        auth0Logout({ 
          logoutParams: { 
            returnTo: window.location.origin 
          } 
        });
      }
      
      // Show success toast
      toast.success(wasAdmin ? "Admin logged out" : "Logged out successfully", {
        position: "top-right",
        autoClose: 2500,
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed", {
        position: "top-right",
        autoClose: 2500,
      });
    } finally {
      localStorage.removeItem("auth_user");
      setUser(null);

      // (optional) clear non-HttpOnly cookies you might have set on client
      document.cookie =
        "sellerToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie =
        "token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT";

      setLogoutLoading(false);
      setDropdownOpen(false);

      // 🔔 notify same-tab listeners immediately
      window.dispatchEvent(new Event("auth-updated"));
      
      // Redirect admin to home after logout
      if (wasAdmin) {
        navigate("/");
      }
    }
  };

  return (
    <nav
      className="fixed top-0 w-full z-50 bg-white shadow-lg border px-4 md:px-8 py-8"
      style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img src={logo} alt="Logo" className="h-10 w-auto" />
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex items-center space-x-6 text-lg font-medium text-purple-900">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "border-b-2 border-purple-500 pb-1 text-purple-700"
                : "hover:text-purple-700"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/venues"
            className={({ isActive }) =>
              isActive
                ? "border-b-2 border-purple-500 pb-1 text-purple-700"
                : "hover:text-purple-700"
            }
          >
            Venues
          </NavLink>
          <NavLink
            to="/services"
            className={({ isActive }) =>
              isActive
                ? "border-b-2 border-purple-500 pb-1 text-purple-700"
                : "hover:text-purple-700"
            }
          >
            Services
          </NavLink>
          <NavLink
            to="/gallery"
            className={({ isActive }) =>
              isActive
                ? "border-b-2 border-purple-500 pb-1 text-purple-700"
                : "hover:text-purple-700"
            }
          >
            Gallery
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive
                ? "border-b-2 border-purple-500 pb-1 text-purple-700"
                : "hover:text-purple-700"
            }
          >
            About Us
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive
                ? "border-b-2 border-purple-500 pb-1 text-purple-700"
                : "hover:text-purple-700"
            }
          >
            Contact Us
          </NavLink>
        </div>

        {/* Desktop-right */}
        <div className="hidden md:flex items-center space-x-4">
          <button className="flex items-center border border-[#8F24AB] text-[#8F24AB] px-4 py-1.5 rounded-md text-lg hover:bg-purple-50">
            <CiLocationOn className="mr-1 text-2xl" color="#8F24AB" />
            Chennai
            <svg
              width="16"
              height="16"
              viewBox="0 0 1024 1024"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              className="ml-2"
            >
              <path
                d="M512 672L192 352h640L512 672z"
                fill="#8F24AB"
              />
            </svg>
          </button>

          {!user ? (
            <button
              onClick={() => setShowAuth(true)}
              className="bg-[#8F24AB] hover:bg-[#5E0C7D] text-white px-5 py-2 rounded-md text-lg shadow"
            >
              Get Started
            </button>
          ) : (
            <div className="relative">
              <img
                src={user?.avatarUrl || avatar}
                alt="User Avatar"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="h-9 w-9 rounded-full cursor-pointer border-2 border-purple-300"
              />
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-2 z-50">
                  <div className="flex items-center gap-3 px-4 py-3 border-b">
                    <img
                      src={user?.avatarUrl || avatar}
                      alt="User"
                      className="h-10 w-10 rounded-full"
                    />
                    <div>
                      <p className="font-semibold text-sm">
                        {user?.name || user?.email}
                      </p>
                      <p className="text-xs text-gray-500">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <ul className="text-sm text-gray-700">
                    <li>
                      <NavLink
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        View profile
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/mybookings"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        My Bookings
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/favorites"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        Favorites
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/notifications"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        Notifications
                      </NavLink>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        disabled={logoutLoading}
                        className="block px-4 py-2 text-red-600 hover:bg-gray-100 w-full text-left disabled:opacity-60"
                      >
                        {logoutLoading ? "Logging out…" : "Log out"}
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={() => setIsOpen((o) => !o)}
            className="text-purple-700 focus:outline-none"
          >
            {isOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
          {user && (
            <img
              src={user?.avatarUrl || avatar}
              alt="User Avatar"
              className="h-8 w-8 rounded-full border border-purple-400"
            />
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="mt-4 flex flex-col space-y-4 md:hidden text-sm font-medium text-purple-900">
          <NavLink to="/" onClick={() => setIsOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/venues" onClick={() => setIsOpen(false)}>
            Venues
          </NavLink>
          <NavLink to="/services" onClick={() => setIsOpen(false)}>
            Services
          </NavLink>
          <NavLink to="/gallery" onClick={() => setIsOpen(false)}>
            Gallery
          </NavLink>
          <NavLink to="/about" onClick={() => setIsOpen(false)}>
            About Us
          </NavLink>
          <NavLink to="/contact" onClick={() => setIsOpen(false)}>
            Contact Us
          </NavLink>
          <button className="flex items-center border border-[#8F24AB] text-[#8F24AB] px-4 py-1.5 rounded-md">
            <HiLocationMarker className="mr-1 text-lg" />
            Chennai
          </button>
          {!user ? (
            <button
              onClick={() => setShowAuth(true)}
              className="bg-[#8F24AB] text-white px-5 py-2 rounded-md shadow"
            >
              Get Started
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <img
                src={user?.avatarUrl || avatar}
                className="h-9 w-9 rounded-full border border-purple-400"
                alt="avatar"
              />
              <span className="text-sm">
                {user?.name || user?.email}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        show={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={({ user }) => {
          localStorage.setItem("auth_user", JSON.stringify(user));
          setUser(user);
          // 🔔 tell other components in the same tab
          window.dispatchEvent(new Event("auth-updated"));
          
          // Redirect admin to admin panel ONLY if not on vendor pages
          if (user.role === "admin" && !location.pathname.startsWith("/vendor")) {
            navigate("/admin");
          }
        }}
      />
    </nav>
  );
};

export default Navbar;
