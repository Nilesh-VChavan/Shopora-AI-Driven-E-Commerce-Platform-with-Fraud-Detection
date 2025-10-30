import { useEffect, useState } from "react";
import api from "../services/api";
import ProductRow from "../components/ProductRow";
import OrderRow from "../components/OrderRow";
import AdminStats from "../components/AdminStats";
import LowStockAlert from "../components/LowStockAlert";
import ExportButton from "../components/ExportButton";
import SkeletonLoader from "../components/SkeletonLoader";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: 0,
    stock: 0,
    tags: "",
    image: "",
    description: "",
  });

  const fetchData = async () => {
    setLoading(true);
    if (activeTab === "products") {
      const res = await api.get("/admin/products");
      setProducts(res.data);
    } else if (activeTab === "orders") {
      const res = await api.get("/admin/orders");
      setOrders(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleCreate = async (e) => {
    e.preventDefault();
    await api.post("/admin/products", {
      ...form,
      price: parseFloat(form.price),
      stock: parseInt(form.stock),
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    });
    setForm({
      name: "",
      category: "",
      price: 0,
      stock: 0,
      tags: "",
      image: "",
      description: "",
    });
    fetchData();
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-20">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">Manage products, orders, and inventory</p>
        </div>

        <AdminStats />

        <LowStockAlert />

        <div className="flex gap-6 mb-8 border-b border-gray-200">
          {["products", "orders"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-6 font-semibold capitalize transition ${
                activeTab === tab
                  ? "text-purple-600 border-b-4 border-purple-600"
                  : "text-gray-500 hover:text-purple-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading ? (
          <SkeletonLoader />
        ) : activeTab === "products" ? (
          <>
            <div className="glass-card p-8 mb-8 shadow-2xl">
              <h2 className="text-3xl font-bold mb-6 text-gray-800">
                Add New Product
              </h2>
              <form
                onSubmit={handleCreate}
                className="grid md:grid-cols-2 gap-6"
              >
                {["name", "category", "price", "stock", "tags", "image"].map(
                  (field) => (
                    <input
                      key={field}
                      placeholder={
                        field.charAt(0).toUpperCase() + field.slice(1)
                      }
                      value={form[field]}
                      onChange={(e) =>
                        setForm({ ...form, [field]: e.target.value })
                      }
                      required={["name", "category", "price", "stock"].includes(
                        field
                      )}
                      type={
                        field === "price" || field === "stock"
                          ? "number"
                          : "text"
                      }
                      className="input-modern"
                    />
                  )
                )}
                <textarea
                  placeholder="Description"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="md:col-span-2 input-modern h-28"
                />
                <button
                  type="submit"
                  className="md:col-span-2 gradient-btn py-4 text-lg font-bold"
                >
                  Create Product
                </button>
              </form>
            </div>

            <div className="glass-card overflow-hidden shadow-xl">
              <div className="p-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <h3 className="text-2xl font-bold">All Products</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-4 text-left font-semibold text-gray-700">
                        Name
                      </th>
                      <th className="p-4 text-left font-semibold text-gray-700">
                        Category
                      </th>
                      <th className="p-4 text-left font-semibold text-gray-700">
                        Price
                      </th>
                      <th className="p-4 text-center font-semibold text-gray-700">
                        Stock
                      </th>
                      <th className="p-4 text-left font-semibold text-gray-700">
                        Tags
                      </th>
                      <th className="p-4 text-center font-semibold text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <ProductRow
                        key={p._id}
                        product={p}
                        onUpdate={fetchData}
                        onDelete={fetchData}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="glass-card overflow-hidden shadow-xl">
            <div className="p-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white flex justify-between items-center">
              <h3 className="text-2xl font-bold">All Orders</h3>
              <ExportButton />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4 text-left font-semibold text-gray-700">
                      Order ID
                    </th>
                    <th className="p-4 text-left font-semibold text-gray-700">
                      User
                    </th>
                    <th className="p-4 text-left font-semibold text-gray-700">
                      Total
                    </th>
                    <th className="p-4 text-left font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="p-4 text-left font-semibold text-gray-700">
                      Date
                    </th>
                    <th className="p-4 text-left font-semibold text-gray-700">
                      Items
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <OrderRow key={o._id} order={o} onUpdate={fetchData} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}