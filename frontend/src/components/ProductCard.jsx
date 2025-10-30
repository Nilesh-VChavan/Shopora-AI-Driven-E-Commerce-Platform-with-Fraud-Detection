// frontend/src/components/ProductCard.jsx
import { Link } from "react-router-dom";
import ShoppingCart from "./icons/ShoppingCart";

export default function ProductCard({ product }) {
  return (
    <Link to={`/product/${product._id}`} className="block glass-card p-4 hover:scale-105 transition-all duration-300 group">
      <div className="relative overflow-hidden rounded-xl mb-3">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {product.stock <= 0 ? (
          <span className="badge-stock bg-red-500 text-white">Out of Stock</span>
        ) : product.stock <= 5 ? (
          <span className="badge-stock bg-yellow-500 text-white">Low Stock</span>
        ) : (
          <span className="badge-stock bg-green-500 text-white">In Stock</span>
        )}
      </div>
      <h3 className="font-bold text-lg text-gray-800 group-hover:text-purple-600 transition">{product.name}</h3>
      <p className="text-sm text-gray-500">{product.category}</p>
      <div className="flex justify-between items-center mt-2">
        <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
          ₹{product.price}
        </p>
        <ShoppingCart className="w-5 h-5 text-purple-600" />
      </div>
    </Link>
  );
}