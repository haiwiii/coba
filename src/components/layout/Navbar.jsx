import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogOut, Menu, X } from "lucide-react";
import { motion as Motion } from 'framer-motion';
import logo from '../../assets/picture/LeadSightLogo.png';
import { logout } from "../../api/api";
import { useAuth } from "../../hooks/useAuth";

const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    logoutUser();

    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`bg-white py-3 sm:py-4 flex justify-between border-b border-gray-200 transition-transform duration-300 ${
        scrolled ? 'fixed top-0 left-0 right-0 -translate-y-full z-50' : 'relative z-50 translate-y-0'
      }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full flex items-center justify-between">
        <div className="flex items-center space-x-3">
        <Motion.img
          src={logo}
          alt="LeadSight logo"
          className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        />

        <Motion.span
          className="hidden sm:inline-block text-lg sm:text-xl font-bold text-purple-600"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
        >
          LeadSight
        </Motion.span>
      </div>

      <div className="flex items-center space-x-6">
        {/* Desktop nav links */}
        <div className="hidden md:flex items-center space-x-6">
          <Link
            to="/dashboard"
            onClick={closeMobile}
            className={`transition-colors duration-200 ${
              isActive('/dashboard')
                ? 'text-purple-600 font-semibold border-b-2 border-purple-600 pb-1'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Dashboard
          </Link>

          <Link
            to="/promotion"
            onClick={closeMobile}
            className={`transition-colors duration-200 ${
              isActive('/promotion')
                ? 'text-purple-600 font-semibold border-b-2 border-purple-600 pb-1'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Promotion
          </Link>

          <Link
            to="/customer-entry"
            onClick={closeMobile}
            className={`transition-colors duration-200 ${
              isActive('/customer-entry')
                ? 'text-purple-600 font-semibold border-b-2 border-purple-600 pb-1'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Customer Entry
          </Link>
        </div>

        {/* Mobile: hamburger button */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileOpen((s) => !s)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            className="p-2 rounded-sm hover:bg-gray-100"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* make the entire user area clickable and hoverable — clicking logs out */}
        {/* visual divider between nav links and user area (separate from logout icon) */}
        <div aria-hidden="true" className="h-8 w-px bg-gray-400 rounded mx-3" />

        <button
          onClick={handleLogout}
          type="button"
          title="Logout"
          aria-label="Logout"
          className="flex items-center space-x-3 group px-3 py-2 rounded-lg transition-all duration-200 hover:bg-purple-50"
        >
          {/* avatar + text (left) and icon (right) are part of the same button */}
            <div className="w-9 h-9 bg-purple-600 rounded-full flex items-center justify-center group-hover:bg-purple-700 transition-colors">
              <span className="text-white font-semibold">SN</span>
            </div>

            <div className="text-left">
              <div className="font-semibold text-sm group-hover:text-purple-700 transition-colors">
                {user}
              </div>
              <div className="text-xs text-gray-500 group-hover:text-purple-500 transition-colors">
                {user}
              </div>
            </div>
            {/* logout icon */}
            <div className="ml-2 p-2 transition-colors">
              <LogOut className="w-5 h-5 text-gray-500 group-hover:text-purple-700 transition-colors" />
            </div>
        </button>
      </div>

      </div>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <div className="md:hidden absolute left-0 right-0 top-full bg-white border-b shadow-lg z-40">
          <div className="flex flex-col py-3 px-4 space-y-2">
            <Link to="/dashboard" className={`py-2 ${isActive('/dashboard') ? 'text-purple-600 font-semibold' : 'text-gray-700'}`} onClick={closeMobile}>Dashboard</Link>
            <Link to="/promotion" className={`py-2 ${isActive('/promotion') ? 'text-purple-600 font-semibold' : 'text-gray-700'}`} onClick={closeMobile}>Promotion</Link>
            <Link to="/customer-entry" className={`py-2 ${isActive('/customer-entry') ? 'text-purple-600 font-semibold' : 'text-gray-700'}`} onClick={closeMobile}>Customer Entry</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;