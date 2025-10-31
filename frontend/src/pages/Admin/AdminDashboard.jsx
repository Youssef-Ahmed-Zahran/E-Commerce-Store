// src/pages/Admin/AdminDashboard.jsx
import Chart from "react-apexcharts";
import { useGetUsersQuery } from "../../redux/api/usersApiSlice";
import {
  useGetTotalOrdersQuery,
  useGetTotalSalesByDateQuery,
  useGetTotalSalesQuery,
} from "../../redux/api/orderApiSlice";
import { useState, useEffect } from "react";
import AdminMenu from "./AdminMenu";
import OrderList from "./OrderList";
import Loader from "../../components/Loader";

const AdminDashboard = () => {
  const { data: sales, isLoading: loadingSales } = useGetTotalSalesQuery();
  const { data: customers, isLoading: loadingCustomers } = useGetUsersQuery();
  const { data: orders, isLoading: loadingOrders } = useGetTotalOrdersQuery();
  const { data: salesDetail } = useGetTotalSalesByDateQuery();

  const [chartState, setChartState] = useState({
    options: {
      chart: { type: "area", toolbar: { show: true } },
      tooltip: { theme: "dark" },
      colors: ["#10b981"],
      dataLabels: { enabled: false },
      stroke: { curve: "smooth", width: 3 },
      title: {
        text: "Sales Trend",
        align: "left",
        style: { fontSize: "18px", fontWeight: "bold", color: "#fff" },
      },
      grid: { borderColor: "#334155", strokeDashArray: 4 },
      xaxis: {
        categories: [],
        title: { text: "Date", style: { color: "#94a3b8" } },
        labels: { style: { colors: "#94a3b8" } },
      },
      yaxis: {
        title: { text: "Sales ($)", style: { color: "#94a3b8" } },
        labels: { style: { colors: "#94a3b8" } },
        min: 0,
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.3,
          stops: [0, 90, 100],
        },
      },
      legend: { position: "top", horizontalAlign: "right" },
    },
    series: [{ name: "Sales", data: [] }],
  });

  useEffect(() => {
    if (salesDetail) {
      const formatted = salesDetail.map((item) => ({
        x: item._id,
        y: item.totalSales,
      }));

      setChartState((prev) => ({
        ...prev,
        options: {
          ...prev.options,
          xaxis: { categories: formatted.map((i) => i.x) },
        },
        series: [{ name: "Sales", data: formatted.map((i) => i.y) }],
      }));
    }
  }, [salesDetail]);

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <AdminMenu />

        {/* Main Dashboard */}
        <div className="flex-1 space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Sales */}
            <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700 hover:shadow-2xl transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-pink-500 rounded-full text-white font-bold text-xl">
                  $
                </div>
                <span className="text-sm text-gray-400">Total</span>
              </div>
              <h3 className="text-lg font-medium text-gray-300">Sales</h3>
              <p className="text-3xl font-bold text-white mt-2">
                {loadingSales ? (
                  <Loader size="sm" />
                ) : (
                  `$${sales?.totalSales?.toFixed(2) || 0}`
                )}
              </p>
            </div>

            {/* Customers */}
            <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700 hover:shadow-2xl transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-emerald-500 rounded-full text-white font-bold text-xl">
                  U
                </div>
                <span className="text-sm text-gray-400">Active</span>
              </div>
              <h3 className="text-lg font-medium text-gray-300">Customers</h3>
              <p className="text-3xl font-bold text-white mt-2">
                {loadingCustomers ? (
                  <Loader size="sm" />
                ) : (
                  customers?.length || 0
                )}
              </p>
            </div>

            {/* Total Orders */}
            <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700 hover:shadow-2xl transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-pink-500 rounded-full text-white font-bold text-xl">
                  O
                </div>
                <span className="text-sm text-gray-400">All Time</span>
              </div>
              <h3 className="text-lg font-medium text-gray-300">Orders</h3>
              <p className="text-3xl font-bold text-white mt-2">
                {loadingOrders ? (
                  <Loader size="sm" />
                ) : (
                  orders?.totalOrders || 0
                )}
              </p>
            </div>
          </div>

          {/* Sales Chart */}
          <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-4">Sales Trend</h2>
            <div className="h-80">
              <Chart
                options={chartState.options}
                series={chartState.series}
                type="area"
                height="100%"
              />
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-4">Recent Orders</h2>
            <OrderList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
