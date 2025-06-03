# 🛠️ Sensor Dashboard Backend

A robust Node.js + Express backend powering a real-time sensor dashboard. Built with secure user authentication, AWS integration, and scheduled data generation, it supports dynamic sensor data processing and file management.

---

## ⚙️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** AWS RDS (SQL)
- **File Storage:** AWS S3
- **Server Hosting:** AWS EC2
- **Authentication:** JWT-based auth middleware
- **Scheduler:** Cron job (every 15 mins) for auto data generation

---

## 📁 Project Structure

```

📦 sensor-dashboard-backend
├── public/
│   └── temp/              # Temp file storage before upload
├── src/
│   ├── controllers/       # Request handlers
│   │   ├── data.controller.js
│   │   └── user.controller.js
│   ├── db/                # DB config & connection
│   │   └── index.js
│   ├── middlewares/       # Middleware (e.g., auth)
│   │   └── auth.middleware.js
│   ├── models/            # SQL schema or queries
│   │   └── sql.txt
│   ├── routes/            # API route definitions
│   │   ├── data.routes.js
│   │   └── user.routes.js
│   ├── utils/             # Helpers
│   │   ├── ApiError.js
│   │   ├── ApiResponse.js
│   │   ├── asyncHandler.js
│   │   ├── generate.mjs         # Data generation logic
│   │   └── process.mjs          # File processing logic
│   ├── app.js             # Express app setup
│   └── index.js           # Entry point
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── README.md

````

---

## 🚀 Features

- ✅ User signup & login with JWT
- 📈 Upload and fetch sensor data
- ☁️ Uploads to **AWS S3**
- 🧠 Store metadata in **AWS RDS**
- 🔁 Auto data generation every **15 minutes** via cron job
- 🌐 Hosted on **AWS EC2**

---

## 📦 Installation

```bash
git clone https://github.com/adiijha/n0c-Assignment-backend.git
cd n0c-Assignment-backend
npm install
````

---

## 🔐 Environment Variables

Create a `.env` file in the root:

```env
PORT=5000

# AWS RDS
DB_HOST=your-rds-endpoint
DB_USER=your-username
DB_PASS=your-password
DB_NAME=your-database

# AWS S3
AWS_BUCKET_NAME=your-bucket-name
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_REGION=your-region

#TOKENS
ACCESS_TOKEN_SECRET=123456
REFRESH_TOKEN_SECRET=123456
ACCESS_TOKEN_EXPIRY=1h
REFRESH_TOKEN_EXPIRY=7d
```

---

## 🧪 Running Locally

### Development

```bash
npm run dev
```

### Production

```bash
npm start
```

---

## 🕒 Cron Job: Data Generation

The file `generate.mjs` contains the logic to auto-generate sensor data.

The file  `process.mjs` contains the logic to process the auto generated data and calculate average.

To run it every 15 minutes on a Linux EC2 instance:

```bash
crontab -e
```

Add:

```bash
#generate.mjs 15 min
*/15 * * * * cd /home/ubuntu/n0c-Assignment/n0c-Assignment-backend && /usr/bin/>

#process.mjs 15 min
*/15 * * * * cd /home/ubuntu/n0c-Assignment/n0c-Assignment-backend && /usr/bin/>

```

> Make sure the script runs independently using Node and is executable.

---

## 📡 Deployment (AWS EC2)

1. Set up a Linux EC2 instance.
2. Install Node.js and clone the repo.
3. Add `.env` and install dependencies.
4. Use `pm2` or `forever` to keep server alive:

```bash
pm2 start src/index.js --name backend
```

---

## 🔐 API Routes

### Auth

| Method | Route                | Description                  |
| ------ | -------------------- | ---------------------------- |
| POST   | `/api/user/register`  | Register new user            |
| POST   | `/api/user/login`   | Login & get token            |
| POST   | `/api/user/logout`   | Logout           |
| GET    | `/api/user/profile` | Get user profile (protected) |

### Sensor Data

| Method | Route              | Description                     |
| ------ | ------------------ | ------------------------------- |         
| GET    | `/api/average`        | Fetch all sensor average data           |


---

## 📝 Notes

* `generate.mjs` can also simulate live data for testing.
*  files (JSON) are being uploaded to S3.
* Ensure proper IAM permissions for S3 access in production.

---

## 📄 License

MIT License © \[Adiijha]