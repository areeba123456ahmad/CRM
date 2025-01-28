
import React from "react";
import { Link } from "react-router-dom";
import './Dasboard.css'

import AdminOrders from './AdminOrders.js';
import Targets from "./targets.js";
import Reports from "./reports.js";
import TeamPerformance from "./teamPerformance.js";


const ManagerDashboard = () => {
    
  const menu = {
    SalesTeamSupervisor: [
      { name: "Sales Statistics", path: "/dashboard/Sales-Statistics" },
      { name: "Team Performance", path: "/Team-Performance",element:<TeamPerformance/> },
      { name: "Targets", path: "/sales-targets",element:<Targets/> },
    ]
  };

 
  return (
    <div className="dashboard-layout">
    <div className="mainboard">
        

      <ul style={{gap:"60px",  gridTemplateColumns: "repeat(4, 6fr)" }}>
        {menu.SalesTeamSupervisor.map((item) => (
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