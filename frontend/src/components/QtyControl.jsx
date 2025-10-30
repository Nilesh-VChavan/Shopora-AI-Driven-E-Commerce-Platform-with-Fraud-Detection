import api from "../services/api";

export default function QtyControl({ item, onUpdate }) {
  const updateQty = async (newQty) => {
    if (newQty < 1) return;
    await api.post("/cart/update-qty", {
      product_id: item.product_id,
      quantity: newQty
    });
    onUpdate();
  };

  return (
    <div className="flex items-center gap-3 bg-white rounded-full shadow-md p-1">
      <button 
        onClick={() => updateQty(item.quantity - 1)} 
        className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center hover:scale-110 transition"
      >
        −
      </button>
      <span className="w-12 text-center font-semibold text-gray-700">{item.quantity}</span>
      <button 
        onClick={() => updateQty(item.quantity + 1)} 
        className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center hover:scale-110 transition"
      >
        +
      </button>
    </div>
  );
}