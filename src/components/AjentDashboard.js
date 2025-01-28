import React from "react";
import { Link } from "react-router-dom";
import './Dasboard.css'
import SalesRecords from "./salesRecords.js";

import AgentPerformance from "./AgentPerformence.js";



const ManagerDashboard = () => {
    
  const menu = {
    Agent: [
      { name: "Sales Records", path: "/sales-records" ,element: <SalesRecords /> },
      { name: "Performance", path: "/Performance" ,element:<AgentPerformance/>},
    ]
  };

 
  return (
    <div className="dashboard-layout">
       
    <div className="mainboard">
   
        
      <ul>
        {menu.Agent.map((item) => (
          <li key={item.name} style={{ width:"350px",height:"300px",margin:"70px"}}>
            <Link to={item.path}>{item.name}</Link>
          </li>
        ))}
      </ul>
    </div>
    </div>
  );
};

  
  export default ManagerDashboard;