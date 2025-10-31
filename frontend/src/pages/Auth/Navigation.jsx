// src/components/Navigation.jsx
import { useState } from "react";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineShoppingCart,
  AiOutlineMenu,
  AiOutlineClose,
  AiOutlineLogout,
} from "react-icons/ai";
import { FaHeart, FaUserCog } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/features/auth/authSlice";
import { useLogoutMutation } from "../../redux/api/authApiSlice";
import { toast } from "react-toastify";
import FavoritesCount from "../Products/FavoritesCount";
import CartCount from "../../components/CartCount";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApi] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApi().unwrap();
      dispatch(logout());
      navigate("/login");
      toast.success("Logged out successfully");
    } catch (err) {
      console.error(err);
      toast.error("Logout failed");
    }
  };

  /* ---------- NAV ITEMS (ENGLISH) ---------- */
  const navItems = userInfo
    ? [
        { to: "/", icon: <AiOutlineHome />, label: "Home" },
        { to: "/shop", icon: <AiOutlineShopping />, label: "Shop" },
        {
          to: "/cart",
          icon: <AiOutlineShoppingCart />,
          label: "Cart",
          badge: <CartCount />,
        },
        {
          to: "/favorite",
          icon: <FaHeart />,
          label: "Favorites",
          badge: <FavoritesCount />,
        },
        { to: "/profile", icon: <FaUserCog />, label: "Profile" },

        // ADMIN ONLY
        ...(userInfo.isAdmin
          ? [
              { to: "/admin/dashboard", label: "Dashboard" },
              { to: "/admin/allproductslist", label: "Products" },
              { to: "/admin/userlist", label: "Users" },
            ]
          : []),

        // LOGOUT (no `to`, uses `action`)
        { action: logoutHandler, icon: <AiOutlineLogout />, label: "Logout" },
      ]
    : [
        { to: "/", icon: <AiOutlineHome />, label: "Home" },
        { to: "/shop", icon: <AiOutlineShopping />, label: "Shop" },
        { to: "/login", icon: <AiOutlineLogin />, label: "Login" },
        { to: "/register", icon: <AiOutlineUserAdd />, label: "Register" },
      ];

  return (
    <>
      {/* ---------- DESKTOP SIDEBAR ---------- */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-20 hover:w-64 bg-slate-900 text-white transition-all duration-300 z-50 group">
        <div className="flex flex-col items-center pt-8 space-y-6 w-full">
          {navItems.map((item, i) => (
            <div key={i} className="w-full relative">
              {item.to ? (
                <Link
                  to={item.to}
                  className="flex items-center justify-center lg:justify-start px-6 py-3 hover:bg-slate-800 transition-colors rounded-lg mx-2"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium">
                    {item.label}
                  </span>
                  {item.badge && (
                    <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.badge}
                    </div>
                  )}
                </Link>
              ) : (
                <button
                  onClick={item.action}
                  className="w-full flex items-center justify-center lg:justify-start px-6 py-3 hover:bg-slate-800 transition-colors rounded-lg mx-2 text-left"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium">
                    {item.label}
                  </span>
                </button>
              )}
            </div>
          ))}
        </div>
      </aside>

      {/* ---------- MOBILE BOTTOM BAR ---------- */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 z-50">
        <div className="flex justify-around items-center py-3 px-2">
          {navItems.slice(0, 5).map((item, i) => (
            <Link
              key={i}
              to={item.to}
              className="relative flex flex-col items-center text-xs text-gray-400 hover:text-emerald-400 transition-colors"
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="mt-1">{item.label}</span>
              {item.badge && (
                <div className="absolute -top-1 -right-1">{item.badge}</div>
              )}
            </Link>
          ))}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsOpen(true)}
            className="text-2xl text-gray-400 hover:text-emerald-400"
          >
            <AiOutlineMenu />
          </button>
        </div>
      </nav>

      {/* ---------- MOBILE DRAWER ---------- */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-end"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-slate-900 w-80 h-full p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-emerald-400">Menu</h2>
              <button onClick={() => setIsOpen(false)}>
                <AiOutlineClose className="text-2xl text-gray-400" />
              </button>
            </div>

            <nav className="space-y-3">
              {navItems.map((item, i) => (
                <div key={i}>
                  {item.to ? (
                    <Link
                      to={item.to}
                      onClick={() => setIsOpen(false)}
                      className="py-3 px-4 text-lg text-gray-300 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition-colors flex items-center"
                    >
                      {item.icon && (
                        <span className="inline-block w-6">{item.icon}</span>
                      )}{" "}
                      {item.label}
                    </Link>
                  ) : (
                    <button
                      onClick={() => {
                        item.action?.();
                        setIsOpen(false);
                      }}
                      className="w-full text-left py-3 px-4 text-lg text-red-400 hover:bg-slate-800 rounded-lg transition-colors flex items-center"
                    >
                      {item.icon && (
                        <span className="inline-block w-6">{item.icon}</span>
                      )}{" "}
                      {item.label}
                    </button>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;
