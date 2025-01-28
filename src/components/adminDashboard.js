
import React from "react";
import { Link } from "react-router-dom";
import './Dasboard.css'

import AdminPermissions from "./AdminPermissions.js";
import UserManagement from "./userManagement.js";



const AdminDashboard = () => {
    
  const menu = {
    Admin: [
      { name: "Dashboard", path: "/dashboard/Admin" },
      { name: "Set Permissions", path: "/AdminPermissions",element:<AdminPermissions/>},
      {name: "Manage users", path: "/userManagement",element:<UserManagement/>},
    ]
  };

 
  return (
    <div className="dashboard-layout">

    <div className="mainboard">
        
        
      <ul style={{gap:"60px",  gridTemplateColumns: "repeat(4, 6fr)" }}>
        {menu.Admin.map((item) => (
          <li key={item.name}>
            <Link to={item.path}>{item.name}</Link>
          </li>
        ))}
      </ul>
    </div>
    </div>
  );
};

  
  export default AdminDashboard;