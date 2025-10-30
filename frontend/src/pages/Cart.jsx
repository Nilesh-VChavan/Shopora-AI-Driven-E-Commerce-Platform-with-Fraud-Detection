import { useEffect, useState } from "react";
import { getCart } from "../services/cart";
import { Link, useNavigate } from "react-router-dom";
import QtyControl from "../components/QtyControl";

export default function Cart() {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const navigate = useNavigate();

  const refresh = () => getCart().then(r => setCart(r.data));

  useEffect(() => {
    refresh();
    window.addEventListener("cart-updated", refresh);
    return () => window.removeEventListener("cart-updated", refresh);
  }, []);

  if (cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <Link to="/products" className="gradient-btn px-6 py-3">Shop Now</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-20 px-4">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      <div className="glass-card overflow-hidden">
        <table className="w-full">
          <thead className="bg-purple-100">
            <tr>
              <th className="p-4 text-left">Product</th>
              <th className="p-4 text-center">Price</th>
              <th className="p-4 text-center">Qty</th>
              <th className="p-4 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {cart.items.map((item, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="p-4 flex gap-3 items-center">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                  <span className="font-medium">{item.name}</span>
                </td>
                <td className="p-4 text-center">₹{item.price}</td>
                <td className="p-4 text-center">
                  <QtyControl item={item} onUpdate={refresh} />
                </td>
                <td className="p-4 text-right font-bold">₹{item.price * item.quantity}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3" className="p-4 text-right font-bold text-lg">Grand Total:</td>
              <td className="p-4 text-right font-bold text-xl text-purple-600">₹{cart.total}</td>
            </tr>
          </tfoot>
        </table>
        <div className="p-6 text-right">
          <button onClick={() => navigate("/checkout")} className="gradient-btn px-8 py-3 text-lg">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}