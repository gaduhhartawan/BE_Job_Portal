require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const express = require("express");
const connectDB = require("./config/dbConn");

// Route - Import
const testRoute = require("./routes/test.route");
const userRoute = require("./routes/user.route");
const jobRoute = require("./routes/job.route");
const authRoute = require("./routes/auth.route");

connectDB();
const app = express();

// Cookie Parser
app.use(cookieParser());

// Express Json
app.use(express.json())

// Cors
app.use(
  cors({
    origin: ["http://localhost:8800"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Route
app.use("/api", testRoute);
app.use("/api/users", userRoute);
app.use("/api/jobs", jobRoute);
app.use("/api", authRoute);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
