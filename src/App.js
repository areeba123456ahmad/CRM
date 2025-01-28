import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

import UserDashboard from "./UserDashboard.js";
import DashboardLayout from "./components/DashboardLayout.js";
import AdminDashboard from "./components/adminDashboard.js";
import SuperAdminDashboard from "./components/SuperAdminDashboard.js";
import ManagerDashboard from "./components/managerDashboard.js";
import SalesDashboard from "./components/salesDashboard.js";
import AjentDashboard from "./components/AjentDashboard.js";
import Login from "./login.js";
import SalesRecords from "./components/salesRecords.js";  // import SalesRecords
import OrderTracking from "./components/OrderTracking.js";
import Connections from "./components/Connections.js";
import DeliveryTracking from "./components/Delivery_tracking.js";
import AgentPerformance from "./components/AgentPerformence.js";
import SalesSupervisorDashboard from "./components/SalesSupervisorDashboard.js";
import TeamPerformance from "./components/teamPerformance.js";
import Targets from "./components/targets.js";
import Reports from "./components/reports.js";
import AdminOrders from "./components/AdminOrders.js";
import AdminPermissions from "./components/AdminPermissions.js";
import UserManagement from "./components/userManagement.js";
import SalesStatistics from "./components/salesStatistics.js";
import PlaceOrder from "./components/PlaceOrder.js";
import TrackOrders from "./trackOrder.js";
const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (error) {
        console.error("Invalid token");
        localStorage.removeItem("token");
        setUser(null);
      }
    }
  }, []);

  if (!user) {
    return <Login />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* SuperAdmin Dashboard */}
        {user.role === "SuperAdmin" && (
          <>
            <Route
              path="/dashboard/superadmin"
              element={
                <DashboardLayout role="SuperAdmin">
                  <SuperAdminDashboard />
                </DashboardLayout>
              }
            />
            <Route
              path="/sales-records"
              element={
                <DashboardLayout role="SuperAdmin">
                  <SalesRecords />
                </DashboardLayout>
              }
            />
            <Route
              path="/order-tracking"
              element={
                <DashboardLayout role="SuperAdmin">
                  <OrderTracking />
                </DashboardLayout>
              }
            />
            <Route
              path="/Connections"
              element={
                <DashboardLayout role="SuperAdmin">
                  <Connections />
                </DashboardLayout>
              }
            />
             <Route
              path="/Delivery-Process"
              element={
                <DashboardLayout role="SuperAdmin">
                  <DeliveryTracking/>
                </DashboardLayout>
              }
            />
          </>
        )}

        {/* Admin Dashboard */}
        {user.role === "Manager" && (
          <>
          <Route
            path="/dashboard/Manager"
            element={
              <DashboardLayout role="Manager">
                <ManagerDashboard />
              </DashboardLayout>
            }
          />
           <Route
            path="/Team-Performance"
            element={
              <DashboardLayout role="Manager">
                <TeamPerformance />
              </DashboardLayout>
            }
          />
           <Route
            path="/reports"
            element={
              <DashboardLayout role="Manager">
                <Reports />
              </DashboardLayout>
            }
          />
          <Route
            path="/OrdersModify"
            element={
              <DashboardLayout role="Manager">
                <AdminOrders />
              </DashboardLayout>
            }
          />
          </>
        )}

        {/* Manager Dashboard */}
        {user.role === "Admin" && (
          <>
          <Route
            path="/dashboard/Admin"
            element={
              <DashboardLayout role="Admin">
                <AdminDashboard />
              </DashboardLayout>
            }
          />
          <Route
            path="/AdminPermissions"
            element={
              <DashboardLayout role="Admin">
                <AdminPermissions />
              </DashboardLayout>
            }
          />
          <Route
            path="/userManagement"
            element={
              <DashboardLayout role="Admin">
                <UserManagement />
              </DashboardLayout>
            }
          />
          </>
        )}

        {/* Sales Team Supervisor Dashboard */}
        {user.role === "SalesTeamSupervisor" && (
          <>
          <Route
            path="/dashboard/salesteamsupervisor"
            element={
              <DashboardLayout role="SalesTeamSupervisor">
                <SalesSupervisorDashboard />
              </DashboardLayout>
            }
          />

          <Route
            path="/dashboard/Sales-Statistics"
            element={
              <DashboardLayout role="SalesTeamSupervisor">
                <SalesStatistics />
              </DashboardLayout>
            }
          />
          <Route
      path="/Team-Performance"
      element={
        <DashboardLayout role="SalesTeamSupervisor">
          <TeamPerformance/>
        </DashboardLayout>
      }
    />
   
    <Route
      path="/sales-targets"
      element={
        <DashboardLayout role="SalesTeamSupervisor">
          <Targets/>
        </DashboardLayout>
      }
    />
          </>
          
        )}

{user.role === "Agent" && (
  <>
    <Route
      path="/dashboard/agent"
      element={
        <DashboardLayout role="Agent">
          <AjentDashboard />
        </DashboardLayout>
      }
    />
    <Route
      path="/sales-records"
      element={
        <DashboardLayout role="Agent">
          <SalesRecords />
        </DashboardLayout>
      }
    />
    <Route
      path="/Performance"
      element={
        <DashboardLayout role="Agent">
          <AgentPerformance />
        </DashboardLayout>
      }
    />
     
  </>
)}


{user.role === "User" && (
  <>
    <Route
      path="/dashboard/User"
      element={
        <DashboardLayout role="User">
          <UserDashboard />
        </DashboardLayout>
      }
    />
    <Route
      path="/Place_order"
      element={
        <DashboardLayout role="User">
          <PlaceOrder />
        </DashboardLayout>
      }
    />

<Route
      path="/Track_order"
      element={
        <DashboardLayout role="User">
          <TrackOrders />
        </DashboardLayout>
      }
    />
    
     
  </>
)}
      

        {/* Default route */}
        <Route path="/" element={<Navigate to={`/dashboard/${user.role.toLowerCase()}`} />} />
      </Routes>
    </Router>
  );
};

export default App;
