import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import FraudBadge from "../components/FraudBadge";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/orders/history")
      .then(r => {
        setOrders(r.data);
        setLoading(false);
      })
      .catch(() => {
        alert("Please login first");
        navigate("/login");
      });
  }, [navigate]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-20 px-4">
        <div className="glass-card p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
            {[1,2,3].map(i => (
              <div key={i} className="h-24 bg-gray-100 rounded mb-4"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-6xl mx-auto py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">No Orders Yet</h1>
        <button onClick={() => navigate("/products")} className="gradient-btn px-6 py-3">
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-20 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Your Order History</h1>
      
      <div className="space-y-6">
        {orders.map(order => (
          <div key={order._id} className="glass-card p-6 shadow-xl hover:shadow-2xl transition">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
              <div>
                <p className="text-sm text-gray-500">Order ID: #{order._id.slice(-8)}</p>
                <p className="text-lg font-semibold">₹{order.total}</p>
                <p className="text-sm text-gray-600">{new Date(order.date).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-4 mt-3 md:mt-0">
                <FraudBadge score={order.fraud_score} />
                <span className={`px-4 py-1 rounded-full text-sm font-medium ${
                  order.status === "delivered" ? "bg-green-100 text-green-700" :
                  order.status === "shipped" ? "bg-blue-100 text-blue-700" :
                  "bg-yellow-100 text-yellow-700"
                }`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm font-medium mb-2">Items ({order.items.length}):</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded" />
                    <div>
                      <p className="font-medium truncate">₹{item.price} × {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-600">
              <p><strong>Delivery:</strong> {order.address}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}