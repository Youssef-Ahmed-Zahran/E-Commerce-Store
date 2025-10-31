import { Link } from "react-router-dom";
import { useGetMyOrdersQuery } from "../../redux/api/orderApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";

const UserOrder = () => {
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold text-white text-center mb-10">
          My Orders
        </h1>

        {isLoading ? (
          <div className="flex justify-center items-center min-h-96">
            <Loader />
          </div>
        ) : error ? (
          <Message variant="danger">
            {error?.data?.message || "Failed to load orders"}
          </Message>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-400 mb-6">You have no orders yet</p>
            <Link
              to="/shop"
              className="inline-block px-8 py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition-all"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto bg-slate-800 rounded-3xl shadow-2xl">
              <table className="w-full text-left">
                <thead className="border-b border-slate-700">
                  <tr>
                    <th className="p-6 text-gray-400 font-semibold">
                      Order ID
                    </th>
                    <th className="p-6 text-gray-400 font-semibold">Date</th>
                    <th className="p-6 text-gray-400 font-semibold">Total</th>
                    <th className="p-6 text-gray-400 font-semibold">Paid</th>
                    <th className="p-6 text-gray-400 font-semibold">
                      Delivered
                    </th>
                    <th className="p-6 text-gray-400 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order._id}
                      className="border-b border-slate-700 hover:bg-slate-700 transition-colors"
                    >
                      <td className="p-6 text-white font-medium">
                        #{order._id.substring(0, 10)}...
                      </td>
                      <td className="p-6 text-gray-300">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-6 text-emerald-400 font-bold">
                        ${order.totalPrice.toFixed(2)}
                      </td>
                      <td className="p-6">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-bold ${
                            order.isPaid
                              ? "bg-emerald-500 text-white"
                              : "bg-red-600 text-white"
                          }`}
                        >
                          {order.isPaid ? "Paid" : "Not Paid"}
                        </span>
                      </td>
                      <td className="p-6">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-bold ${
                            order.isDelivered
                              ? "bg-emerald-500 text-white"
                              : "bg-yellow-600 text-white"
                          }`}
                        >
                          {order.isDelivered ? "Delivered" : "Pending"}
                        </span>
                      </td>
                      <td className="p-6">
                        <Link
                          to={`/order/${order._id}`}
                          className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all text-sm font-medium inline-block"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile & Tablet Card View */}
            <div className="lg:hidden space-y-4">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl shadow-xl p-5"
                >
                  {/* Order Header */}
                  <div className="flex justify-between items-start mb-4 pb-4 border-b border-slate-700">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Order ID</p>
                      <p className="text-white font-semibold text-sm">
                        #{order._id.substring(0, 12)}...
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400 mb-1">Date</p>
                      <p className="text-white text-sm">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Order Total */}
                  <div className="mb-4">
                    <p className="text-xs text-gray-400 mb-1">Total Amount</p>
                    <p className="text-2xl font-bold text-emerald-400">
                      ${order.totalPrice.toFixed(2)}
                    </p>
                  </div>

                  {/* Status Badges */}
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    <div>
                      <p className="text-xs text-gray-400 mb-2">Payment</p>
                      <span
                        className={`block text-center px-3 py-2 rounded-lg text-sm font-bold ${
                          order.isPaid
                            ? "bg-emerald-500 text-white"
                            : "bg-red-600 text-white"
                        }`}
                      >
                        {order.isPaid ? "Paid" : "Not Paid"}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-2">Delivery</p>
                      <span
                        className={`block text-center px-3 py-2 rounded-lg text-sm font-bold ${
                          order.isDelivered
                            ? "bg-emerald-500 text-white"
                            : "bg-yellow-600 text-white"
                        }`}
                      >
                        {order.isDelivered ? "Delivered" : "Pending"}
                      </span>
                    </div>
                  </div>

                  {/* View Details Button */}
                  <Link to={`/order/${order._id}`} className="block">
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all">
                      View Order Details
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default UserOrder;
