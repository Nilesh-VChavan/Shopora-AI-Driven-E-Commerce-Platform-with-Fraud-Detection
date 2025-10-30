import { useEffect, useState } from "react";
import api from "../services/api";
import FraudBadge from "../components/FraudBadge";
import { requireAdmin } from "../services/auth";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    const res = await api.get("/admin/orders");
    setOrders(res.data);
    setLoading(false);
  };

  useEffect(() => {
    requireAdmin();
    fetchOrders();
  }, []);

  const filtered = orders.filter(o => {
    if (filter === "high-risk") return o.fraud_score > 0.7;
    if (filter === "pending") return o.status === "pending";
    return true;
  });

  const highRiskCount = orders.filter(o => o.fraud_score > 0.7).length;

  return (
    <div className="max-w-7xl mx-auto py-20 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Admin Order Monitor</h1>
        {highRiskCount > 0 && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded-full font-bold animate-pulse">
            {highRiskCount} High-Risk Orders
          </div>
        )}
      </div>

      <div className="flex gap-3 mb-6">
        {["all", "high-risk", "pending"].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-6 py-2 rounded-full font-medium transition ${
              filter === f 
                ? "bg-purple-600 text-white" 
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {f.replace("-", " ").charAt(0).toUpperCase() + f.replace("-", " ").slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="glass-card p-8">
          <div className="animate-pulse space-y-4">
            {[1,2,3].map(i => <div key={i} className="h-32 bg-gray-100 rounded"></div>)}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(order => (
            <div key={order._id} className={`glass-card p-6 ${order.fraud_score > 0.7 ? 'ring-2 ring-red-500' : ''}`}>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-mono text-sm">#{order._id.slice(-8)}</p>
                  <p className="text-xl font-bold">₹{order.total}</p>
                  <p className="text-sm text-gray-500">{new Date(order.date).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <FraudBadge score={order.fraud_score} />
                  <select 
                    value={order.status}
                    onChange={async (e) => {
                      await api.post(`/admin/orders/${order._id}/status`, { status: e.target.value });
                      fetchOrders();
                    }}
                    className="mt-2 p-2 border rounded text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                <div><strong>User:</strong> {order.user_id}</div>
                <div><strong>Items:</strong> {order.items.length}</div>
                <div><strong>Address:</strong> {order.address.slice(0, 30)}...</div>
                <div><strong>Risk:</strong> {(order.fraud_score * 100).toFixed(1)}%</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}