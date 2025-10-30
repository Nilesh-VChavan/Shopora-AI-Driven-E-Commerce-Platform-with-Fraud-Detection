import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import { addToCart } from "../services/cart";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    api.get("/products").then(r => {
      const p = r.data.find(p => p._id === id);
      setProduct(p);
    });
  }, [id]);

  if (!product) return <div className="text-center py-20">Loading...</div>;

  const handleAddToCart = async () => {
    try {
      await addToCart(product);
      alert(`${product.name} added to cart!`);
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to add");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-20">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <img src={product.image} alt={product.name} className="w-full rounded-xl shadow-lg" />
        </div>
        <div>
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
          <p className="text-3xl font-bold text-purple-600 mb-4">₹{product.price}</p>
          <p className="text-gray-600 mb-6">{product.description}</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {product.tags.map(t => (
              <span key={t} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">{t}</span>
            ))}
          </div>
          <p className="text-lg font-medium mb-4">
            {product.stock > 0 ? (
              <span className="text-green-600">In Stock ({product.stock})</span>
            ) : (
              <span className="text-red-600">Out of Stock</span>
            )}
          </p>
          <button 
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={`w-full md:w-auto px-8 py-3 text-lg font-medium rounded-lg transition ${
              product.stock > 0 
                ? "gradient-btn hover:scale-105" 
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
          >
            {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </div>
    </div>
  );
}