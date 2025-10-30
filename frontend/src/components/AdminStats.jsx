import { useEffect, useState } from "react";
import api from "../services/api";

export default function AdminStats() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    api.get("/admin/stats").then(r => setStats(r.data));
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="glass-card p-6 text-center">
        <h3 className="text-lg font-semibold text-gray-600">Total Orders</h3>
        <p className="text-3xl font-bold text-purple-600">{stats.total_orders || 0}</p>
      </div>
      <div className="glass-card p-6 text-center">
        <h3 className="text-lg font-semibold text-gray-600">Revenue</h3>
        <p className="text-3xl font-bold text-green-600">₹{stats.total_revenue || 0}</p>
      </div>
      <div className="glass-card p-6 text-center">
        <h3 className="text-lg font-semibold text-gray-600">Low Stock</h3>
        <p className="text-3xl font-bold text-red-600">{stats.low_stock_count || 0}</p>
      </div>
    </div>
  );
}