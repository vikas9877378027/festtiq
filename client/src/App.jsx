import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Auth0Provider } from '@auth0/auth0-react';
import { auth0Config } from './auth0-config.js';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from "./pages/Home";
import Services from "./pages/Services";
import Venues from "./pages/Venues";
import Gallery from "./pages/Gallery";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer/Footer";
import LoginModal from "./components/Login/LoginModal";
import SingleVenue from "./components/Venue/Singlevenue/SingleVenue";
import ContinuePay from "./components/Venue/ContinuePay";
import ServiceBookingForm from "./components/Service/ServiceBookingForm";
import Bookings from "./pages/Bookings";
import Profile from "./pages/Profile";
import Favorite from "./components/Venue/Favorite";
import Notification from "./components/Notification";
import Support from "./components/QuickLinks/Support";
import Security from "./components/QuickLinks/Security";
import Terms from "./components/QuickLinks/Terms";
import Privacy from "./components/QuickLinks/PrivacyPolicy";
import Cookie from "./components/QuickLinks/CookiePolicy";
import AdminLayout from "./pages/admin/AdminLayout";
import VenuesAdmin from "./pages/admin/VenuesAdmin";
import GalleryAdmin from "./pages/admin/GalleryAdmin";
import ServicesAdmin from "./pages/admin/ServicesAdmin";
import UsersAdmin from "./pages/admin/UsersAdmin";
import BookingsAdmin from "./pages/admin/BookingsAdmin";
function App() {
  const [showModal, setShowModal] = useState(false);

  return (
    <Auth0Provider
      domain={auth0Config.domain}
      clientId={auth0Config.clientId}
      authorizationParams={auth0Config.authorizationParams}
    >
      <BrowserRouter>
        <Navbar onGetStartedClick={() => setShowModal(true)} />
      
      {/* Toast Notification Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/booking" element={<ServiceBookingForm />} />
        <Route path="/services/continue&pay" element={<ContinuePay />} />
        <Route path="/venues" element={<Venues />} />
        <Route path="/venues/:id" element={<SingleVenue />} />
        <Route path="/venues/continue&pay" element={<ContinuePay />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/mybookings" element={<Bookings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/favorites" element={<Favorite />} />
        <Route path="/notifications" element={<Notification />} />
        <Route path="/help" element={<Support />} />
        <Route path="/security" element={<Security />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/cookies" element={<Cookie />} />
  <Route path="/admin" element={<AdminLayout />}>
          {/* default /admin goes to Venues */}
          <Route index element={<VenuesAdmin />} />
          <Route path="venues" element={<VenuesAdmin />} />
          <Route path="gallery" element={<GalleryAdmin />} />
          <Route path="services" element={<ServicesAdmin />} />
          <Route path="users" element={<UsersAdmin />} />
          <Route path="bookings" element={<BookingsAdmin />} />
        </Route>
      </Routes>

        <Footer />
        <LoginModal show={showModal} onClose={() => setShowModal(false)} />
      </BrowserRouter>
    </Auth0Provider>
  );
}

export default App;
