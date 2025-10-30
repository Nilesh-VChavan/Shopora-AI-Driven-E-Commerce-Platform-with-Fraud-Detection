import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const [address, setAddress] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/orders/place", { address });
      navigate(`/order-success/${res.data.order_id}`);
    } catch (err) {
      alert("Order failed");
    }
  };

  return (
    <div className="max-w-md mx-auto py-20 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>
      <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
        <textarea
          placeholder="Delivery Address"
          value={address}
          onChange={e => setAddress(e.target.value)}
          className="w-full p-3 border rounded-lg h-32"
          required
        />
        <button type="submit" className="w-full gradient-btn py-3 text-lg">
          Place Order
        </button>
      </form>
    </div>
  );
}