
import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import { HiLocationMarker } from 'react-icons/hi'   // ← npm install react-icons
import logo from '../assets/Logo (1).png'

const NAV_ITEMS = [
  { name: 'Home',     to: '/' },
  { name: 'Venues',   to: '/venues' },  
  { name: 'Services', to: '/services' },
  { name: 'Gallery',  to: '/gallery' },  
  { name: 'About Us', to: '/AboutUs' },  
  { name: 'Contact Us', to: '/ContactUs' },  
]

export default function Navbar() {
  return (
    <header className="bg-white shadow py-6 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        {/* Left: Logo + Brand */}
        <div className="flex items-center" style={{ minWidth: 140.67 + 10 + 'px', gap: '10px' }}>
          {/* Logo image */}
          <img src={logo} alt="Festtiq Logo" style={{ width: '140.67px', height: '40px', opacity: 1, transform: 'rotate(0deg)' }} className="object-contain" />
        </div>
        {/* Center: Nav links */}
        <nav className="flex-1 flex justify-center">
          <div className="flex items-center gap-6" style={{ height: '42px' }}>
            {NAV_ITEMS.map((item, idx) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `text-[16px] font-normal leading-[1.5] tracking-[0.15px] text-center transition px-1 ` +
                  (isActive
                    ? 'text-[#9C27B0] border-b-2 border-[#9C27B0] pb-1'
                    : 'text-[#181375] hover:text-[#9C27B0]')
                }
                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', minWidth: '24px' }}
                end={item.to === '/'}
              >
                {item.name}
              </NavLink>
            ))}
          </div>
        </nav>
        {/* Right: Location + CTA */}
        <div className="flex items-center space-x-4 min-w-[220px] justify-end">
          <button
            className="flex items-center space-x-2 border-2 border-purple-400 text-purple-700 rounded-xl px-4 py-2 font-medium hover:bg-purple-50 transition shadow-sm"
          >
            <HiLocationMarker className="text-xl text-purple-600" />
            <span>Chennai</span>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5" stroke="#A020F0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <Link
            to="/get-started"
            className="bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white rounded-xl px-6 py-2 font-semibold shadow hover:from-purple-700 hover:to-fuchsia-600 transition"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  )
}



