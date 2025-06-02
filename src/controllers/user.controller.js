import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool  from "../db/index.js"; 
dotenv.config();

const generateAccessAndRefreshTokens = (user) => {
    const accessToken = jwt.sign({
        id: user.id,
        email: user.email,
        name: user.name,
    }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });

    const refreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY });

    return { accessToken, refreshToken };
};

// Register User
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password} = req.body;

    if (!name || !email || !password) {
        throw new ApiError(400, "All fields are required.");
    }

    // Check if email already exists
    const [existing] = await pool.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
    );

    if (existing.length > 0) {
        return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [name, email, hashedPassword]
    );

    res.status(201).json(new ApiResponse(201, {}, "User registered successfully."));
});

// Login User
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, "Email and Password are required.");
  }

  const [rows] = await pool.query(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );

  if (rows.length === 0) {
    return res.status(404).json({ message: "User not found." });
  }

  const user = rows[0];
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const { accessToken, refreshToken } = generateAccessAndRefreshTokens(user);

  const options = {
    httpOnly: true,
    secure: false, //true if production
    sameSite: "none",
    path: "/",
    expires: new Date(Date.now() + 3600000),
  };

  res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, {
      user: { id: user.id, name: user.name, username: user.username, email: user.email },
      accessToken,
      refreshToken
    }, "Logged in successfully."));
});

// Logout User
const logoutUser = asyncHandler(async (req, res) => {
    // Clear cookies
    const options = {
        httpOnly: true,
        secure: false, // Set to true in production
        sameSite: "strict",
    };

    res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully."));
});

// Get Profile
const getProfile = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const [rows] = await pool.query("SELECT name FROM users WHERE id = ?", [userId]);
    if (rows.length === 0) {
        throw new ApiError(404, "User not found.");
    }

    res.status(200).json(new ApiResponse(200, { name: rows[0].name }, "Profile fetched successfully."));
});

export { registerUser, loginUser, logoutUser, getProfile };
