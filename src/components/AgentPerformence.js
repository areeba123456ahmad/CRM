// AgentPerformance.js
import React, { useState, useEffect } from 'react';
import './components.css';
const AgentPerformance = () => {
    const [performance, setPerformance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Function to fetch performance data
    const fetchPerformance = async () => {
        const token = localStorage.getItem('token'); // Assuming token is saved in localStorage

        if (!token) {
            setError('No token found. Please log in.');
            setLoading(false);
            alert("token not found");
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/performance', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch performance data');
            }

            const data = await response.json();
            console.log(" performance data from server ",data.results[0])
            setPerformance(data.results[0]);
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    const ViewPerformance = () => {
        const permissions = JSON.parse(localStorage.getItem("permissions"));
        return permissions ? permissions.Per_performance : false;
      };
    // Fetch data when component mounts
    useEffect(() => {
        if (!ViewPerformance()) {
            alert("You do not have permission to View your Performance.");
            return;
          }
        fetchPerformance();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div style={{height: "auto" ,minHeight: "85vh"}}>
        <div className='sales-records'>
            <h2>Agent Performance</h2>
            <table>
                <tbody>
                    <tr>
                        <td>Total Sales:</td>
                        <td>{performance.total_sales}</td>
                    </tr>
                    <tr>
                        <td>Sales Target:</td>
                        <td>{performance.sales_target}</td>
                    </tr>
                    <tr>
                        <td>Fulfillment Rate:</td>
                        <td>{performance.fulfillment_rate}%</td>
                    </tr>
                    <tr>
                        <td>Pending Tasks:</td>
                        <td>{performance.pending_tasks}</td>
                    </tr>
                    <tr>
                        <td>Performance Date:</td>
                        <td>{new Date(performance.performance_date).toLocaleString()}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        </div>
    );
};

export default AgentPerformance;
