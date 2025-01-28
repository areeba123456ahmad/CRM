import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Button, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import { useTable, usePagination } from "react-table";

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const AdminOrders = () => {
  const [chartData, setChartData] = useState({});
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/admin/orders-status-summary");
        if (response.data && Array.isArray(response.data)) {
          const labels = response.data.map((item) => item.status);
          const data = response.data.map((item) => item.count);
          setChartData({
            labels,
            datasets: [
              {
                label: "Order Status",
                data,
                backgroundColor: [" #1f6981", "rgb(11, 51, 65)","rgb(85, 85, 85)", "rgb(28, 125, 160)"],
              },
            ],
          });
        } else {
          console.error("Invalid chart data format", response.data);
        }
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:5000/admin/orders");
        if (response.data && Array.isArray(response.data)) {
          setOrders(response.data);
        } else {
          console.error("Invalid orders data format", response.data);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchChartData();
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      setLoading(true);
      await axios.put(`http://localhost:5000/admin/orders/${id}`, { status });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === id ? { ...order, status } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
    } finally {
      setLoading(false);
    }
  };

  const columns = React.useMemo(
    () => [
      { Header: "ID", accessor: "id" },
      { Header: "Tracking Number", accessor: "tracking_number" },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ row }) => (
          <Select style={{background:"var(--MainBackgound)"}}
            value={row.original.status}
            onChange={(e) => handleStatusUpdate(row.original.id, e.target.value)}
            disabled={loading}
          >
            <MenuItem  value="Shipped">Shipped</MenuItem>
            <MenuItem value="Delivered">Delivered</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="In-Transit">In-Transit</MenuItem>
          </Select>
        ),
      },
      { Header: "Date Created", accessor: "created_at" },
    ],
    [loading]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data: orders,
  });

  return (
    <div className="orders" >
      <h2>Orders Details</h2>

      <div style={{ width: "60%", margin: "auto",height:'350px' ,marginBottom:"40px"}}>
        {chartData.labels && chartData.datasets ? (
          <Bar data={chartData} options={{ plugins: { legend: { display: true } } }} />
        ) : (
          <p>Loading chart data...</p>
        )}
      </div>

      <div >
        <TableContainer component={Paper}>
          <Table {...getTableProps()} aria-label="simple table">
            <TableHead>
              {headerGroups.map((headerGroup) => (
                <TableRow {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <TableCell {...column.getHeaderProps()}>{column.render("Header")}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
            <TableBody {...getTableBodyProps()}>
              {rows.map((row) => {
                prepareRow(row);
                return (
                  <TableRow {...row.getRowProps()}>
                    {row.cells.map((cell) => (
                      <TableCell {...cell.getCellProps()}>{cell.render("Cell")}</TableCell>
                    ))}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default AdminOrders;
