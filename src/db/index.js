import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: false,
  },
});

export async function connectDB() {
  try {
    const connection = await pool.getConnection();
    connection.release();
    console.log('Connected to AWS RDS MySQL database');
  } catch (err) {
    console.error('MySQL connection error:', err);
    throw err;
  }
}

export const query = (sql, params) => pool.query(sql, params);
export default pool;
