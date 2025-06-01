import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import pool from "../db/index.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (!decodedToken || !decodedToken.id) {
      throw new ApiError(401, "Invalid Access Token");
    }

    const [rows] = await pool.query(
      "SELECT id, name, email, username FROM users WHERE id = ?",
      [decodedToken.id]
    );

    if (!rows.length) {
      throw new ApiError(404, "Invalid Access Token");
    }

    req.user = rows[0];
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error);
    throw new ApiError(401, "Invalid Access Token");
  }
});

