import { useEffect, useState } from "react";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
import SearchFilter from "../components/SearchFilter";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [personalRecs, setPersonalRecs] = useState([]);

  useEffect(() => {
    api.get("/ai/personalized").then(r => setPersonalRecs(r.data.recommendations));
    fetchProducts();
  }, []);

  const fetchProducts = (filters = {}) => {
    const params = new URLSearchParams(filters);
    api.get(`/products?${params}`).then(r => setProducts(r.data));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <h1 className="text-3xl font-bold mb-8">All Products</h1>

      {personalRecs.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Recommended for You</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {personalRecs.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        </div>
      )}

      <SearchFilter onFilter={fetchProducts} />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(p => (
          <div key={p._id}>
            <ProductCard product={p} />
            {p.stock <= 0 && <p className="text-red-600 text-sm text-center mt-2">Out of Stock</p>}
          </div>
        ))}
      </div>
    </div>
  );
}