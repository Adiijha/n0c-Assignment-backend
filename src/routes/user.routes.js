import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getProfile
} from "../controllers/user.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Public Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser); 

// Protected Routes (Require Authentication)
router.get("/profile", verifyJWT, getProfile);

export default router;