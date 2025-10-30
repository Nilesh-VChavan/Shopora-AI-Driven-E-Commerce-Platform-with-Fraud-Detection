// frontend/src/components/ProductRow.jsx
import { useState } from "react";
import api from "../services/api";
import Pencil from "./icons/Pencil";
import Trash from "./icons/Trash";
import Check from "./icons/Check";
import XMark from "./icons/XMark";

export default function ProductRow({ product, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(product);

  const handleSave = async () => {
    await api.put(`/admin/products/${product._id}`, form);
    onUpdate();
    setEditing(false);
  };

  const handleDelete = async () => {
    if (confirm("Delete this product?")) {
      await api.delete(`/admin/products/${product._id}`);
      onDelete();
    }
  };

  if (editing) {
    return (
      <tr className="bg-gradient-to-r from-yellow-50 to-orange-50">
        <td className="p-3"><input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input-modern" /></td>
        <td className="p-3"><input value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="input-modern" /></td>
        <td className="p-3"><input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="input-modern" /></td>
        <td className="p-3"><input type="number" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} className="input-modern" /></td>
        <td className="p-3"><input value={form.tags.join(", ")} onChange={e => setForm({...form, tags: e.target.value.split(",").map(t => t.trim())})} className="input-modern" /></td>
        <td className="p-3 text-center">
          <button onClick={handleSave} className="text-green-600 mr-2"><Check className="w-5 h-5" /></button>
          <button onClick={() => setEditing(false)} className="text-gray-600"><XMark className="w-5 h-5" /></button>
        </td>
      </tr>
    );
  }

  return (
    <tr className="border-b hover:bg-purple-50 transition">
      <td className="p-3 font-medium">{product.name}</td>
      <td className="p-3 text-gray-600">{product.category}</td>
      <td className="p-3 font-semibold text-purple-600">₹{product.price}</td>
      <td className="p-3 text-center">
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${product.stock <= 5 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {product.stock}
        </span>
      </td>
      <td className="p-3">
        <div className="flex flex-wrap gap-1">
          {product.tags.map(t => <span key={t} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">{t}</span>)}
        </div>
      </td>
      <td className="p-3 text-center">
        <button onClick={() => setEditing(true)} className="text-blue-600 mr-3"><Pencil className="w-5 h-5 inline" /></button>
        <button onClick={handleDelete} className="text-red-600"><Trash className="w-5 h-5 inline" /></button>
      </td>
    </tr>
  );
}