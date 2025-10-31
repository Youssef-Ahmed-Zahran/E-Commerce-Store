import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetOrdersQuery } from "../../redux/api/orderApiSlice";
import AdminMenu from "./AdminMenu";

const OrderList = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <div className="container mx-auto px-4">
          <AdminMenu />

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full border">
              <thead className="border">
                <tr className="mb-[5rem]">
                  <th className="text-left pl-1 py-3">ITEMS</th>
                  <th className="text-left pl-1 py-3">ID</th>
                  <th className="text-left pl-1 py-3">USER</th>
                  <th className="text-left pl-1 py-3">DATE</th>
                  <th className="text-left pl-1 py-3">TOTAL</th>
                  <th className="text-left pl-1 py-3">PAID</th>
                  <th className="text-left pl-1 py-3">DELIVERED</th>
                  <th className="py-3"></th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-b ">
                    <td className="py-4">
                      <img
                        src={order.orderItems[0].image}
                        alt={order._id}
                        className="w-[5rem] h-[5rem] object-cover rounded"
                      />
                    </td>
                    <td className="px-2">{order._id.substring(0, 10)}...</td>
                    <td className="px-2">
                      {order.user ? order.user.username : "N/A"}
                    </td>
                    <td className="px-2">
                      {order.createdAt
                        ? order.createdAt.substring(0, 10)
                        : "N/A"}
                    </td>
                    <td className="px-2 font-semibold">$ {order.totalPrice}</td>
                    <td className="py-2 px-2">
                      {order.isPaid ? (
                        <p className="p-1 text-center bg-green-400 w-[6rem] rounded-full text-white text-sm">
                          Completed
                        </p>
                      ) : (
                        <p className="p-1 text-center bg-red-400 w-[6rem] rounded-full text-white text-sm">
                          Pending
                        </p>
                      )}
                    </td>
                    <td className="px-2 py-2">
                      {order.isDelivered ? (
                        <p className="p-1 text-center bg-green-400 w-[6rem] rounded-full text-white text-sm">
                          Completed
                        </p>
                      ) : (
                        <p className="p-1 text-center bg-red-400 w-[6rem] rounded-full text-white text-sm">
                          Pending
                        </p>
                      )}
                    </td>
                    <td className="px-2">
                      <Link to={`/order/${order._id}`}>
                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition">
                          More
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile & Tablet Card View */}
          <div className="lg:hidden space-y-4 mt-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg shadow-lg p-4"
              >
                <div className="flex gap-4 mb-4">
                  <img
                    src={order.orderItems[0].image}
                    alt={order._id}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Order ID</p>
                    <p className="font-mono text-sm mb-2">
                      {order._id.substring(0, 15)}...
                    </p>
                    <p className="text-xs text-gray-500 mb-1">User</p>
                    <p className="font-semibold text-sm">
                      {order.user ? order.user.username : "N/A"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Date</p>
                    <p className="text-sm text-white">
                      {order.createdAt
                        ? order.createdAt.substring(0, 10)
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Total</p>
                    <p className="text-sm font-bold text-emerald-400">
                      $ {order.totalPrice}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-2">Payment Status</p>
                    {order.isPaid ? (
                      <p className="p-2 text-center bg-green-400 rounded-full text-white text-xs">
                        Completed
                      </p>
                    ) : (
                      <p className="p-2 text-center bg-red-400 rounded-full text-white text-xs">
                        Pending
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-2">
                      Delivery Status
                    </p>
                    {order.isDelivered ? (
                      <p className="p-2 text-center bg-green-400 rounded-full text-white text-xs">
                        Completed
                      </p>
                    ) : (
                      <p className="p-2 text-center bg-red-400 rounded-full text-white text-xs">
                        Pending
                      </p>
                    )}
                  </div>
                </div>

                <Link to={`/order/${order._id}`} className="block">
                  <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-lg transition font-semibold">
                    View Details
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default OrderList;
