export default function FraudBadge({ score }) {
  const risk = score > 0.7 ? "High" : score > 0.4 ? "Medium" : "Low";
  const color = 
    risk === "High" ? "bg-red-100 text-red-700 border-red-300" :
    risk === "Medium" ? "bg-yellow-100 text-yellow-700 border-yellow-300" :
    "bg-green-100 text-green-700 border-green-300";

  return (
    <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${color}`}>
      <div className={`w-2 h-2 rounded-full ${risk === "High" ? "bg-red-600" : risk === "Medium" ? "bg-yellow-600" : "bg-green-600"} animate-pulse`} />
      {risk} Risk ({(score * 100).toFixed(0)}%)
    </div>
  );
}