import { useParams, Link } from "react-router-dom";

export default function OrderSuccess() {
  const { id } = useParams();

  return (
    <div className="max-w-md mx-auto py-20 text-center">
      <div className="text-6xl mb-4">Checkmark</div>
      <h1 className="text-3xl font-bold mb-4">Order Placed!</h1>
      <p className="text-gray-600 mb-6">Order ID: <strong>{id}</strong></p>
      <Link to="/orders" className="gradient-btn px-6 py-3">View Orders</Link>
    </div>
  );
}