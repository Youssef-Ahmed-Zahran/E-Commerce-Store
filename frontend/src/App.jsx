// src/App.jsx
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  ScrollRestoration,
} from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

// Routes
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./pages/Admin/AdminRoute";

// Pages
import Navigation from "./pages/Auth/Navigation";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Home from "./pages/Home";
import Profile from "./pages/User/Profile";
import UserOrder from "./pages/User/UserOrder";
import Shipping from "./pages/Orders/Shipping";
import PlaceOrder from "./pages/Orders/PlaceOrder";
import UserList from "./pages/Admin/UserList";
import CategoryList from "./pages/Admin/CategoryList";
import AllProducts from "./pages/Admin/AllProducts";
import CreateProduct from "./pages/Admin/CreateProduct";
import ProductUpdate from "./pages/Admin/ProductUpdate";
import Favorites from "./pages/Products/Favorites";
import ProductDetails from "./pages/Products/ProductDetails";
import Cart from "./pages/Cart";
import Shop from "./pages/Shop";
import Order from "./pages/Orders/Order";
import AdminDashboard from "./pages/Admin/AdminDashboard";

function App() {
  const Layout = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* Navigation */}
      <Navigation />
      <ScrollRestoration />
      {/* Main Content */}
      <main className="pt-16 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <Outlet />
      </main>
    </div>
  );

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        // Public Routes
        { path: "/", element: <Home /> },
        { path: "/login", element: <Login /> },
        { path: "/register", element: <Register /> },
        { path: "/product/:id", element: <ProductDetails /> },

        // User Protected Routes
        {
          element: <PrivateRoute />,
          children: [
            { path: "/profile", element: <Profile /> },
            { path: "/user-orders", element: <UserOrder /> },
            { path: "/shipping", element: <Shipping /> },
            { path: "/placeorder", element: <PlaceOrder /> },
            { path: "/order/:id", element: <Order /> },
            { path: "/shop", element: <Shop /> },
            { path: "/cart", element: <Cart /> },
            { path: "/favorite", element: <Favorites /> },
          ],
        },

        // Admin Protected Routes
        {
          element: <AdminRoute />,
          children: [
            { path: "/admin/dashboard", element: <AdminDashboard /> },
            { path: "/admin/userlist", element: <UserList /> },
            { path: "/admin/categorylist", element: <CategoryList /> },
            { path: "/admin/allproductslist", element: <AllProducts /> },
            { path: "/admin/createproduct", element: <CreateProduct /> },
            { path: "/admin/updateproduct/:_id", element: <ProductUpdate /> },
          ],
        },
      ],
    },
  ]);

  return (
    <div className="min-h-screen font-sans antialiased">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
