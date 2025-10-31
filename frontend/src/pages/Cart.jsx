// src/pages/Cart/Cart.jsx
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";
import { addToCart, removeFromCart } from "../redux/features/cart/cartSlice.js";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold text-white text-center mb-10">
          Shopping Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-400 mb-6">Your cart is empty</p>
            <Link
              to="/shop"
              className="px-8 py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition-all"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-slate-800 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row items-center gap-6"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-xl"
                  />
                  <div className="flex-1 text-center sm:text-left">
                    <Link
                      to={`/product/${item._id}`}
                      className="text-lg font-semibold text-emerald-400 hover:underline"
                    >
                      {item.name}
                    </Link>
                    <p className="text-gray-400 mt-1">{item.brand}</p>
                    <p className="text-xl font-bold text-white mt-2">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <select
                      value={item.qty}
                      onChange={(e) =>
                        addToCartHandler(item, Number(e.target.value))
                      }
                      className="px-4 py-2 bg-slate-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => removeFromCartHandler(item._id)}
                      className="p-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <div className="bg-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
                <h2 className="text-xl font-bold text-white">Summary</h2>
                <div className="space-y-3">
                  <div className="flex justify-between text-lg">
                    <span className="text-gray-400">Items:</span>
                    <span className="text-white font-bold">
                      {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-2xl font-bold pt-4 border-t border-slate-700">
                    <span className="text-white">Total:</span>
                    <span className="text-emerald-400">
                      $
                      {cartItems
                        .reduce((acc, item) => acc + item.qty * item.price, 0)
                        .toFixed(2)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={checkoutHandler}
                  className="w-full py-4 bg-emerald-500 text-white font-bold text-lg rounded-xl hover:bg-emerald-600 transition-all transform hover:scale-105 shadow-xl"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Cart;
