import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import logo from '../../assets/Logo (1).png';

const Footer = () => {
  return (
    <div className="footer-wrapper">
      <div className="footer">
        {/* TOP BAR */}
        <div className="footer-top-bar">
          <img src={logo} alt="Festtiq Logo" className="logo-img" />
          <div className="subscribe-box">
            <input type="email" placeholder="Enter your email" />
            <button className="subscribe-button">Subscribe</button>
          </div>
        </div>

        {/* MAIN */}
        <div className="footer-main">
          {/* LEFT SIDE */}
          <div className="footer-left">
            <h4 className="footer-heading">
              Plan Your Event with<br />Confidence
            </h4>
            <div className="footer-socials">
              <i className="fa-brands fa-facebook-f"></i>
              <i className="fa-brands fa-instagram"></i>
              <i className="fa-brands fa-x-twitter"></i>
              <i className="fa-brands fa-linkedin-in"></i>
            </div>
          </div>

          {/* RIGHT SIDE COLUMNS */}
          <div className="footer-columns">
            <div className="footer-column">
              <h5>Quick Links</h5>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/venues">Venues</Link></li>
                <li><Link to="/services">Services</Link></li>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/faqs">FAQs</Link></li>
              </ul>
            </div>

            <div className="footer-column">
              <h5>Legal</h5>
              <ul>
                <li><Link to="/security">Security</Link></li>
                <li><Link to="/terms">Terms of Service</Link></li>
                <li><Link to="/privacy">Privacy Policy</Link></li>
                <li><Link to="/cookies">Cookie Policy</Link></li>
                <li><Link to="/help">Support</Link></li>
              </ul>
            </div>

            <div className="footer-column">
              <h5>Social Awareness</h5>
              <ul>
                <li><Link to="/food-waste-management">Food Waste Management</Link></li>
              </ul>

              <h5 className="mt-5">Contact</h5>
              <ul>
                <li><i className="fa-solid fa-envelope"></i> support@festtiq.com</li>
                <li><i className="fa-solid fa-phone"></i> +91 98765 43210</li>
              </ul>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="footer-bottom">
          <p>Copyright © 2025 - Festtiq. All Rights Reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
