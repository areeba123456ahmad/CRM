

import React from "react";
import { Link } from "react-router-dom";
import './DashboardDesign.css'
import SalesRecords from "./salesRecords.js";
import OrderTracking from "./OrderTracking.js";
import Connections from "./Connections.js";
import DeliveryTracking from "./Delivery_tracking.js";



const SuperAdminDashboard = () => {
    
  const menu = {
    SuperAdmin: [
      { name: "Sales Records", path: "/sales-records" ,element: <SalesRecords /> },
      { name: "Order Tracking", path: "/Order-Tracking" ,element: <OrderTracking/>},
      { name: "Connection Activities", path: "/Connections",element: <Connections/> },
      { name: "Delivery Process", path: "/Delivery-Process",element: <DeliveryTracking/> },
     
    ]
  };

 
  return (
    <div className="dashboard-layout">
    <div className="mainboard">

        
      <ul>
        {menu.SuperAdmin.map((item) => (
          <li key={item.name}>
            <Link to={item.path}>{item.name}</Link>
          </li>
        ))}
      </ul>
    </div>
    </div>
  );
};

  
  export default SuperAdminDashboard;