import React from "react";
import './Dasboard.css'
const TopNavBar = ({ role }) => {

    const handleLogout = () => {
        localStorage.removeItem("token"); // Clear the token from local storage
        window.location.href = "/login"; // Redirect to login
      };
  return (
    <div className="top-navbar">
   <h1 className="sidebar-title">Client  RelationShip Management</h1>

      <div className="nav-actions">
        <button onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default TopNavBar;
