import React from "react";
import { Link } from "react-router-dom";
import {
  BarChart,
  ShoppingCart,
  Truck,
  Users,
  Settings,
  LineChart,
  Clipboard,
  Flag,
  List,
  FileText,
  UserCheck,
} from "lucide-react"; // Icon library
import './Dasboard.css';

const Sidebar = ({ role }) => {
  // Define menu items for each role with icons
  const menus = {
    SuperAdmin: [
      {  path: "/sales-records", icon: <BarChart size={20} /> },
      {  path: "/Order-Tracking", icon: <ShoppingCart size={20} /> },
      {  path: "/Connections", icon: <Users size={20} /> },
      {  path: "/Delivery-Process", icon: <Truck size={20} /> },
    ],
    Manager: [
      {  path: "/Team-Performance", icon: <LineChart size={20} /> },
      {  path: "/OrdersModify", icon: <Clipboard size={20} /> },
      {  path: "/reports", icon: <FileText size={20} /> },
    ],
    Admin: [
      {  path: "/dashboard/Admin", icon: <BarChart size={20} /> },
      {  path: "/AdminPermissions", icon: <Settings size={20} /> },
      {  path: "/userManagement", icon: <Users size={20} /> },
    ],
    SalesTeamSupervisor: [
      {  path: "/dashboard/Sales-Statistics", icon: <BarChart size={20} /> },
      {  path: "/Team-Performance", icon: <LineChart size={20} /> },
      {  path: "/sales-targets", icon: <Flag size={20} /> },
    ],
    Agent: [
      {  path: "/sales-records", icon: <BarChart size={20} /> },
      {  path: "/Performance", icon: <UserCheck size={20} /> },
    ],
    User: [
      {  path: "/Place_order", icon: <ShoppingCart size={20} /> },
      //{ name: "Track Order", path: "/Track_order", icon: <List size={20} /> },
    ],
  };

  const menuItems = menus[role] || []; // Get the menu for the specific role

  return (
    <>
    <div className="sidebar">
      
      <ul className="menu-list">
        {menuItems.map((item) => (
          <li key={item.name} className="menu-item">
            <Link to={item.path} className="menu-link">
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-text">{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
    </>
  );
};

export default Sidebar;
