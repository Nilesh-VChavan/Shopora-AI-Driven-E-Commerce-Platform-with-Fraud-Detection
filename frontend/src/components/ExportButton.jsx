import api from "../services/api";

export default function ExportButton() {
  const handleExport = () => {
    api.get("/admin/export-orders", { responseType: "blob" })
      .then(res => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "orders.csv");
        document.body.appendChild(link);
        link.click();
      });
  };

  return (
    <button onClick={handleExport} className="gradient-btn px-6 py-2 text-sm">
      Export Orders (CSV)
    </button>
  );
}