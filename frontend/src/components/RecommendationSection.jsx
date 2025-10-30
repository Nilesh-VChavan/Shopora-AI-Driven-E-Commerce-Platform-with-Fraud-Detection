import { useEffect, useState } from "react";
import api from "../services/api";
import ProductCard from "./ProductCard";

export default function RecommendationSection({ productId }) {
  const [recs, setRecs] = useState([]);

  useEffect(() => {
    api.get(`/ai/recommend/${productId}`).then(r => setRecs(r.data.recommendations));
  }, [productId]);

  if (recs.length === 0) return null;

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {recs.map(p => <ProductCard key={p._id} product={p} />)}
      </div>
    </div>
  );
}