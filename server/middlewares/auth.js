import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token = req.headers.authorization;
  
  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized, no token" });
  }
  
  // Extract token from "Bearer <token>" format
  if (token.startsWith("Bearer ")) {
    token = token.slice(7); // Remove "Bearer " (7 characters)
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    
    if (!req.user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }
    
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
}
