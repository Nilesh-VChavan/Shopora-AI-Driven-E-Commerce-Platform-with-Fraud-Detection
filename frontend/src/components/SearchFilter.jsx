import { useState } from "react";
import MagnifyingGlass from "./icons/MagnifyingGlass";

export default function SearchFilter({ onFilter }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [tags, setTags] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter({ search, category, minPrice, maxPrice, tags });
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card p-6 mb-10 shadow-xl">
      <div className="flex gap-3 items-center mb-4">
        <MagnifyingGlass className="w-6 h-6 text-purple-600" />
        <input 
          placeholder="Search products..." 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
          className="input-modern flex-1"
        />
      </div>
      <div className="grid md:grid-cols-4 gap-4">
        <select value={category} onChange={e => setCategory(e.target.value)} className="input-modern">
          <option value="">All Categories</option>
          <option>Electronics</option>
          <option>Home</option>
          <option>Fitness</option>
        </select>
        <input type="number" placeholder="Min Price" value={minPrice} onChange={e => setMinPrice(e.target.value)} className="input-modern" />
        <input type="number" placeholder="Max Price" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className="input-modern" />
        <input placeholder="Tags (e.g. wireless)" value={tags} onChange={e => setTags(e.target.value)} className="input-modern" />
      </div>
      <button type="submit" className="gradient-btn w-full mt-4 py-3 text-lg font-semibold">
        Search Products
      </button>
    </form>
  );
}