// src/pages/Admin/AdminMenu.jsx
import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { FaTimes } from "react-icons/fa";

const AdminMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isMenuOpen]);

  const menuItems = [
    { path: "/admin/dashboard", label: "Admin Dashboard" },
    { path: "/admin/categorylist", label: "Create Category" },
    { path: "/admin/createproduct", label: "Create Product" },
    { path: "/admin/allproductslist", label: "All Products" },
    { path: "/admin/userlist", label: "Manage Users" },
  ];

  return (
    <div ref={menuRef} className="fixed top-6 right-6 z-50">
      {/* Toggle Button */}
      <button
        onClick={toggleMenu}
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        aria-expanded={isMenuOpen}
        className="p-3 bg-slate-800 rounded-xl shadow-lg hover:bg-slate-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
      >
        {isMenuOpen ? (
          <FaTimes className="w-5 h-5 text-white" />
        ) : (
          <div className="flex flex-col gap-1">
            <span className="block w-6 h-0.5 bg-gray-300 rounded-full"></span>
            <span className="block w-6 h-0.5 bg-gray-300 rounded-full"></span>
            <span className="block w-6 h-0.5 bg-gray-300 rounded-full"></span>
          </div>
        )}
      </button>

      {/* Dropdown Menu */}
      <nav
        className={`absolute right-0 mt-3 w-64 bg-slate-800 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen
            ? "max-h-96 opacity-100 visible scale-100"
            : "max-h-0 opacity-0 invisible scale-95"
        }`}
        style={{ transformOrigin: "top right" }}
        aria-label="Admin navigation"
      >
        <ul className="py-3">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end
                onClick={() => setIsMenuOpen(false)}
                className="block px-5 py-3 text-gray-300 hover:bg-slate-700 hover:text-emerald-400 transition-all duration-200 rounded-lg mx-2"
                style={({ isActive }) => ({
                  color: isActive ? "#4977f4" : "",
                  fontWeight: isActive ? "600" : "400",
                  backgroundColor: isActive ? "rgba(190, 242, 100, 0.1)" : "",
                })}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default AdminMenu;
