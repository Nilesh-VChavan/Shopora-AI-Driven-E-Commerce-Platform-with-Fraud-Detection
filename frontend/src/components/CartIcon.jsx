import { useEffect, useState } from "react";
import { getCart } from "../services/cart";

export default function CartIcon() {
  const [count, setCount] = useState(0);

  const fetchCart = () => {
    getCart().then(r => setCount(r.data.count)).catch(() => setCount(0));
  };

  useEffect(() => {
    fetchCart();
    
    window.addEventListener("cart-updated", fetchCart);
    return () => window.removeEventListener("cart-updated", fetchCart);
  }, []);

  return (
    <div className="relative">
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m.6 6H7m10 0a2 2 0 100-4 2 2 0 000 4z" />
      </svg>
      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {count}
        </span>
      )}
    </div>
  );
}