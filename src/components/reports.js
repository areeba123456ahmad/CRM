import React, { useState } from "react";
import axios from "axios";

const Reports = () => {
  const [loading, setLoading] = useState(false);

  const handleExportPerformanceCSV = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/report/performance-csv", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "team_performance.csv");
      document.body.appendChild(link);
      link.click();
      setLoading(false);
    } catch (error) {
      console.error("Error exporting Performance CSV:", error);
      setLoading(false);
    }
  };

  const handleExportordersCSV = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/report/orders-csv", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "detail.csv");
      document.body.appendChild(link);
      link.click();
      setLoading(false);
    } catch (error) {
      console.error("Error exporting Performance CSV:", error);
      setLoading(false);
    }
  };

  const handleExportsalesCSV = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/report/sales-csv", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Detail.csv");
      document.body.appendChild(link);
      link.click();
      setLoading(false);
    } catch (error) {
      console.error("Error exporting Performance CSV:", error);
      setLoading(false);
    }
  };

  

  return (
    <div style={{ fontSize: "14px", padding: "20px" ,marginBottom:"500px" ,height:"400px"}} className="orders">
      <h2 style={{marginTop:"50px"}}>Reports</h2>
      <button onClick={handleExportPerformanceCSV} disabled={loading} className="repButton">
        {loading ? "Exporting..." : "Export Team Performance as CSV"}
      </button>
      <button  onClick={handleExportordersCSV} disabled={loading} className="repButton second" >
        {loading ? "Exporting..." : "Export Order Details as CSV"}
      </button>
      <button onClick={handleExportsalesCSV} disabled={loading} className="repButton">
        {loading ? "Exporting..." : "Export Sales Details as CSV"}
      </button>
    </div>
  );
};

export default Reports;
