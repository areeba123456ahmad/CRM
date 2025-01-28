import React from "react";
import Sidebar from "./sidebar.js"; // Import Sidebar component
import TopNavBar from "./TopNavBar.js"; // Import Top Navbar component
import './Dasboard.css'
const DashboardLayout = ({ role, children }) => {
  return (
    <div className="dashboard-layout">
      <Sidebar role={role} />
      <div className="main-content">
        <TopNavBar role={role} />
        <div className="content">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
