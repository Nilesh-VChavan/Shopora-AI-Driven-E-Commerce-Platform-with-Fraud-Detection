export default function SkeletonLoader() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {[1,2,3,4,5,6].map(i => (
        <div key={i} className="glass-card p-4">
          <div className="skeleton h-48 rounded-lg mb-3"></div>
          <div className="skeleton h-4 w-3/4 mb-2"></div>
          <div className="skeleton h-3 w-1/2"></div>
        </div>
      ))}
    </div>
  );
}