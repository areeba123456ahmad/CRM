// Middleware to check the user's role
const roleAuth = (roles) => (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return res.status(403).json({ message: "Access denied" });
    }
  
    jwt.verify(token, 'areeba@123', (err, decoded) => {
      if (err || !roles.includes(decoded.role)) {
        return res.status(403).json({ message: "Access denied" });
      }
      req.user = decoded; // Attach user info to request
      next();
    });
  };
  

  export default roleAuth;