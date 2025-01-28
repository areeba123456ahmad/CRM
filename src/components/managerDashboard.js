
import React from "react";
import { Link } from "react-router-dom";
import './Dasboard.css'

import AdminOrders from './AdminOrders.js';

import Reports from "./reports.js";
import TeamPerformance from "./teamPerformance.js";


const ManagerDashboard = () => {
    
  const menu = {
    Manager: [
      {name: "Team Performance", path: "/Team-Performance",element:<TeamPerformance/> },
      { name: "Orders Modify", path: "/OrdersModify",element:<AdminOrders/> },
      { name: "Reports", path: "/reports",element:<Reports/> },
    ]
  };

 
  return (
    <div className="dashboard-layout">
    <div className="mainboard">
        
        
      <ul style={{gap:"60px",  gridTemplateColumns: "repeat(4, 6fr)" }}>
        {menu.Manager.map((item) => (
          <li key={item.name}>
            <Link to={item.path}>{item.name}</Link>
          </li>
        ))}
      </ul>
    </div>
    </div>
  );
};

  
  export default ManagerDashboard;