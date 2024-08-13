import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import asynchHandler from "./asyncHandler.js";

const authenticate = asynchHandler(async (req, res, next) => {
  let token;

  // Read the JWT from 'jwt' cookie
  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select("-password");
      next();
    } catch (eror) {
      res.status(401);
      throw new Error("Not authorised, token failed");
    }
  } else {
    res.status(401);
    throw new Error("Not authorised, no token");
  }
});

// Check for the admin
const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).send("Not authorized as an admin");
  }
};

export { authenticate, authorizeAdmin };
