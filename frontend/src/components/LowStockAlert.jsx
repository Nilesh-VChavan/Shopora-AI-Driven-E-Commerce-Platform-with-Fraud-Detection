import { useEffect, useState } from "react";
import api from "../services/api";

export default function LowStockAlert() {
  const [lowStock, setLowStock] = useState([]);

  useEffect(() => {
    api.get("/admin/low-stock").then(r => setLowStock(r.data));
  }, []);

  if (lowStock.length === 0) return null;

  return (
    <div className="glass-card p-4 mb-6 bg-red-50 border-l-4 border-red-500">
      <h3 className="font-bold text-red-700 mb-2">Low Stock Alert ({lowStock.length})</h3>
      <div className="space-y-1">
        {lowStock.map(p => (
          <p key={p._id} className="text-sm">
            <strong>{p.name}</strong> – Only <span className="text-red-600">{p.stock}</span> left
          </p>
        ))}
      </div>
    </div>
  );
}