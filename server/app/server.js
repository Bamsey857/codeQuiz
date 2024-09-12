import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import express from "express";
import cookieParser from "cookie-parser";
import AuthRoutes from "./routes/authRoutes.js";
import CourseRoutes from "./routes/courseRoutes.js";
import publicRoutes from "./routes/publicRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;
const baseURL = process.env.BASE_URL || `http://localhost:${PORT}/api/v1`;

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(
  express.json({
    limit: "50mb",
  })
);
app.use(cookieParser());
app.use(morgan("dev"));

app.get("/api/v1", (req, res) => {
  return res.status(200).json({
    success: true,
    name: "Code Quiz API",
    version: "1.0.0",
    status: "200",
  });
});

app.use("/api/v1/", publicRoutes);
app.use("/api/v1/", AuthRoutes);
app.use("/api/v1/", CourseRoutes);

app.use("*", (req, res) => {
  return res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.listen(PORT, () => console.log(`Server running on ${baseURL} `));
