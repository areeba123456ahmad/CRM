import { useEffect, useState } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale
} from "chart.js";

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

function Targets() {
  const [salesTargets, setSalesTargets] = useState([]);
  const [teamPerformance, setTeamPerformance] = useState([]);

  useEffect(() => {
    const fetchSalesTargets = async () => {
      try {
        const response = await axios.get("http://localhost:5000/sales/targets");
        if (response.data && response.data.sales_targets) {
          setSalesTargets(response.data.sales_targets);
        }
      } catch (error) {
        console.error("Error fetching sales targets:", error);
      }
    };

    const fetchTeamPerformance = async () => {
      try {
        const response = await axios.get("http://localhost:5000/sales/team-performance");
        if (response.data && response.data.team_performance) {
          setTeamPerformance(response.data.team_performance);
        }
      } catch (error) {
        console.error("Error fetching team performance:", error);
      }
    };

    fetchSalesTargets();
    fetchTeamPerformance();
  }, []);

  if (!salesTargets.length || !teamPerformance.length) {
    return <div>Loading...</div>;
  }

  // Prepare chart data
  const totalTargets = salesTargets.reduce((acc, target) => acc + target.sales_target, 0);
  const colorPalette = [
    "#00CCCC", "#00CC99", "#3357FF", "#F0E130", "#E130F0"
  ];

  const chartData = {
    labels: teamPerformance.map(agent => `Agent ${agent.agent_id}`),
    datasets: [{
      data: teamPerformance.map(agent => agent.total_sales),
      backgroundColor: teamPerformance.map((_, index) => colorPalette[index % colorPalette.length]),
      borderWidth: 1
    }]
  };

  return (
    <div className="orders">
    <div style={{ fontSize: "38px", padding: "35px" }}> {/* Smaller font and padding */}
      <h2 style={{ fontSize: "20px" }}>Target Records</h2>

      <div style={{ width: "350px", height: "350px", margin: "auto" }}>
        <h3>Sales Targets Overview</h3>
        <Pie
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: "top",
                labels: {
                  font: { size: 6 }
                }
              },
              title: {
                display: true,
                text: `Total: ${totalTargets}`,
                font: { size: 6 }
              }
            }
          }}
        />
      </div>

      <div style={{ overflowX: "auto",margin:"70px" }}>
        <h3>Team Performance</h3>
        <table style={{ fontSize: "20px", width: "100%",marginTop:"60px" }}>
          <thead>
            <tr>
              <th>Agent ID</th>
              <th>Total Sales</th>
              <th>Target</th>
              <th>Fulfillment</th>
             
            </tr>
          </thead>
          <tbody>
            {teamPerformance.map((agent, index) => (
              <tr key={index}>
                <td>{agent.agent_id}</td>
                <td>{agent.total_sales}</td>
                <td>{agent.sales_target}</td>
                <td>{agent.fulfillment_rate}%</td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
}

export default Targets;
