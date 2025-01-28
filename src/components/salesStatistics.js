import { useEffect, useState } from "react";
import axios from "axios";
import './Dasboard.css';  // Don't forget to import the CSS file

function SalesStatistics() {
  const [salesData, setSalesData] = useState(null);

  useEffect(() => {
    // Function to fetch sales statistics
    const fetchSalesStatistics = async () => {
      try {
        const response = await axios.get("http://localhost:5000/sales/statistics");

        if (response.data && response.data.daily_sales) {
          setSalesData(response.data);
        }
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };

    fetchSalesStatistics();
  }, []);

  if (!salesData) {
    return <div className="loading">Loading...</div>;
  }

  const { daily_sales, revenue, total_sales } = salesData;

  return (
    <div className="dashboard-container">
      <div className="overview">
        <h2>Total Sales: {total_sales}</h2>
        <h3>Revenue: ${parseFloat(revenue).toFixed(2)}</h3>
      </div>

      <div className="sales-stats">
        {daily_sales && daily_sales.length > 0 ? (
          daily_sales.map((sale, index) => {
            const formattedDate = new Date(sale.date).toLocaleDateString();

            return (
              <div className="sales-card" key={index}>
                <h4>{formattedDate}</h4>
                <p>Sales: {sale.sales}</p>
              </div>
            );
          })
        ) : (
          <p>No sales data available</p>
        )}
      </div>
    </div>
  );
}

export default SalesStatistics;












