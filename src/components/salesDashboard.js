const SalesDashboard = () => {
    const handleLogout = () => {
        localStorage.removeItem("token"); // Clear the token from local storage
        window.location.href = "/login"; // Redirect to login
      };
      
    return (
      <div>
        <h2>Sales Team Dashboard</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>
    );
  };
  export default SalesDashboard;