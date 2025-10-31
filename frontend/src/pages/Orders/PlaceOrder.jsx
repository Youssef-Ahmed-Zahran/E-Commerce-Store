// src/pages/Cart/PlaceOrder.jsx
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../components/Message";
import ProgressSteps from "../../components/ProgressSteps";
import Loader from "../../components/Loader";
import { useCreateOrderMutation } from "../../redux/api/orderApiSlice";
import { clearCartItems } from "../../redux/features/cart/cartSlice";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const [createOrder, { isLoading, error }] = useCreateOrderMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    }
  }, [cart.shippingAddress.address, navigate]);

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();

      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to create order");
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <ProgressSteps step1 step2 step3 />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
          {/* Order Items */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800 rounded-3xl shadow-2xl p-6 md:p-8">
              <h2 className="text-2xl font-bold text-white mb-6">
                Order Items
              </h2>

              {cart.cartItems.length === 0 ? (
                <Message variant="info">Your cart is empty</Message>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="pb-3 text-gray-400">Image</th>
                        <th className="pb-3 text-gray-400">Product</th>
                        <th className="pb-3 text-gray-400 text-center">Qty</th>
                        <th className="pb-3 text-gray-400 text-right">Price</th>
                        <th className="pb-3 text-gray-400 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cart.cartItems.map((item) => (
                        <tr
                          key={item._id}
                          className="border-b border-slate-700"
                        >
                          <td className="py-4">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded-xl"
                            />
                          </td>
                          <td className="py-4 text-white font-medium">
                            {item.name}
                          </td>
                          <td className="py-4 text-center text-gray-300">
                            {item.qty}
                          </td>
                          <td className="py-4 text-right text-emerald-400">
                            ${item.price.toFixed(2)}
                          </td>
                          <td className="py-4 text-right text-white font-bold">
                            ${(item.qty * item.price).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800 rounded-3xl shadow-2xl p-6 md:p-8 space-y-6">
              <h2 className="text-2xl font-bold text-white">Order Summary</h2>

              <div className="space-y-4 text-lg">
                <div className="flex justify-between">
                  <span className="text-gray-400">Items:</span>
                  <span className="text-white font-bold">
                    ${cart.itemsPrice}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Shipping:</span>
                  <span className="text-white font-bold">
                    ${cart.shippingPrice}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Tax:</span>
                  <span className="text-white font-bold">${cart.taxPrice}</span>
                </div>
                <div className="flex justify-between border-t border-slate-700 pt-4">
                  <span className="text-xl text-white font-bold">Total:</span>
                  <span className="text-xl text-emerald-400 font-bold">
                    ${cart.totalPrice}
                  </span>
                </div>
              </div>

              {error && (
                <Message variant="danger">
                  {error.data?.message || "An error occurred"}
                </Message>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Shipping Address
                  </h3>
                  <p className="text-gray-300 text-sm">
                    {cart.shippingAddress.address}, {cart.shippingAddress.city},{" "}
                    {cart.shippingAddress.postalCode},{" "}
                    {cart.shippingAddress.country}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Payment Method
                  </h3>
                  <p className="text-emerald-400 font-medium">
                    {cart.paymentMethod}
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="w-full py-4 bg-emerald-500 text-white font-bold text-lg rounded-xl hover:bg-emerald-600 transition-all transform hover:scale-105 shadow-xl disabled:opacity-50"
                disabled={cart.cartItems.length === 0}
                onClick={placeOrderHandler}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <Loader size="sm" />
                    <span className="ml-2">Processing...</span>
                  </span>
                ) : (
                  "Place Order"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlaceOrder;
