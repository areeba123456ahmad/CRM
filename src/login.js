import React, { useState } from "react";
import axios from "axios";
import './style.css';
import {jwtDecode} from "jwt-decode"; // Only use jwt-decode here

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/login", { email, password });
      if (response.data.success) {
        const { token, role } = response.data;
        // Store token in local storage
        localStorage.setItem("token", token);
        
        // Decode token to get permissions and store it
        const decodedToken = jwtDecode(token);
        localStorage.setItem("permissions", JSON.stringify(decodedToken.permissions));
        localStorage.setItem("role", decodedToken.role);

        // Reset error on successful login
        setError("");
        
         // Decode JWT token
        window.location.href = `/dashboard/${decodedToken.role}`; 
          // Redirect based on role
      } else {
        setError(response.data.message || "Login failed");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setError("An error occurred while logging in. Please try again.");
    }
  };

  return (
    <div className="background">
      <div className="login-container">
        <h2>Client Relation Management System Login</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;













