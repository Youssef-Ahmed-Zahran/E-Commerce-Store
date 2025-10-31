// src/pages/Order/Order.jsx
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  useGetPaypalClientIdQuery,
  usePayOrderMutation,
} from "../../redux/api/orderApiSlice";

const Order = () => {
  const { id: orderId } = useParams();

  const { data: order, isLoading, error } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const {
    data: paypal,
    isLoading: loadingPayPal,
    error: errorPayPal,
  } = useGetPaypalClientIdQuery();

  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && paypal?.clientId) {
      const loadPayPalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: { "client-id": paypal.clientId, currency: "USD" },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };

      if (order && !order.isPaid && !window.paypal) {
        loadPayPalScript();
      }
    }
  }, [order, paypal, paypalDispatch, loadingPayPal, errorPayPal]);

  const onApprove = (data, actions) =>
    actions.order.capture().then(async (details) => {
      try {
        await payOrder({ orderId, details }).unwrap();
        toast.success("Payment successful");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    });

  const createOrder = (data, actions) =>
    actions.order.create({
      purchase_units: [{ amount: { value: order.totalPrice } }],
    });

  const onError = (err) => toast.error(err.message);

  const deliverHandler = async () => {
    try {
      await deliverOrder(orderId);
      toast.success("Order marked as delivered");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {isLoading ? (
          <div className="flex justify-center items-center min-h-96">
            <Loader />
          </div>
        ) : error ? (
          <Message variant="danger">
            {error?.data?.message || error.error}
          </Message>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Order Info */}
              <div className="bg-slate-800 rounded-3xl p-6 shadow-xl">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Order Details
                </h2>
                <div className="space-y-4 text-lg">
                  <p>
                    <strong className="text-emerald-400">Order ID:</strong>{" "}
                    {order._id}
                  </p>
                  <p>
                    <strong className="text-emerald-400">Date:</strong>{" "}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p>
                    <strong className="text-emerald-400">Payment:</strong>{" "}
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-bold ${
                        order.isPaid
                          ? "bg-emerald-500 text-white"
                          : "bg-red-600 text-white"
                      }`}
                    >
                      {order.isPaid ? "Paid" : "Not Paid"}
                    </span>
                  </p>
                  <p>
                    <strong className="text-emerald-400">Delivery:</strong>{" "}
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-bold ${
                        order.isDelivered
                          ? "bg-emerald-500 text-white"
                          : "bg-yellow-600 text-white"
                      }`}
                    >
                      {order.isDelivered ? "Delivered" : "Pending"}
                    </span>
                  </p>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-slate-800 rounded-3xl p-6 shadow-xl">
                <h3 className="text-xl font-bold text-white mb-4">
                  Shipping Address
                </h3>
                <p className="text-gray-300">
                  {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
                  {order.shippingAddress.postalCode},{" "}
                  {order.shippingAddress.country}
                </p>
                <p className="mt-2 text-emerald-400">
                  <strong>Payment Method:</strong> {order.paymentMethod}
                </p>
              </div>

              {/* Order Items */}
              <div className="bg-slate-800 rounded-3xl p-6 shadow-xl">
                <h3 className="text-xl font-bold text-white mb-4">Items</h3>
                <div className="space-y-4">
                  {order.orderItems.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center gap-4 p-4 bg-slate-700 rounded-2xl"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-xl"
                      />
                      <div className="flex-1">
                        <Link
                          to={`/product/${item.product}`}
                          className="text-lg font-medium text-emerald-400 hover:underline"
                        >
                          {item.name}
                        </Link>
                        <p className="text-gray-400">
                          {item.qty} × ${item.price} = $
                          {(item.qty * item.price).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary & Payment */}
            <div className="lg:col-span-1">
              <div className="bg-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
                <h2 className="text-2xl font-bold text-white">Order Summary</h2>

                <div className="space-y-3 text-lg">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Items:</span>
                    <span className="text-white">${order.itemsPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Shipping:</span>
                    <span className="text-white">${order.shippingPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tax:</span>
                    <span className="text-white">${order.taxPrice}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-700 pt-3">
                    <span className="text-xl font-bold text-white">Total:</span>
                    <span className="text-xl font-bold text-emerald-400">
                      ${order.totalPrice}
                    </span>
                  </div>
                </div>

                {/* PayPal Button */}
                {!order.isPaid && (
                  <div>
                    {loadingPay && <Loader />}
                    {isPending ? (
                      <Loader />
                    ) : (
                      <PayPalButtons
                        createOrder={createOrder}
                        onApprove={onApprove}
                        onError={onError}
                        style={{
                          color: "gold",
                          layout: "vertical",
                          label: "paypal",
                        }}
                      />
                    )}
                  </div>
                )}

                {/* Admin: Mark as Delivered */}
                {loadingDeliver && <Loader />}
                {userInfo?.isAdmin && order.isPaid && !order.isDelivered && (
                  <button
                    onClick={deliverHandler}
                    className="w-full py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition-all"
                  >
                    Mark as Delivered
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Order;
