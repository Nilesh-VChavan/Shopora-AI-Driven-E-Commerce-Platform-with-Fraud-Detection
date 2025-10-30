import api from "../services/api";

export default function OrderRow({ order, onUpdate }) {
  const updateStatus = async (status) => {
    await api.post(`/admin/orders/${order._id}/status`, { status });
    onUpdate();
  };

  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="p-3">{order._id.slice(-8)}</td>
      <td className="p-3">{order.user_id}</td>
      <td className="p-3">${order.total}</td>
      <td className="p-3">
        <select value={order.status} onChange={e => updateStatus(e.target.value)} className="p-1 border rounded">
          <option value="pending">Pending</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
        </select>
      </td>
      <td className="p-3 text-sm">{new Date(order.date).toLocaleDateString()}</td>
      <td className="p-3 text-sm">{order.items.length} items</td>
    </tr>
  );
}