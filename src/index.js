import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import authRoutes from "./routes/authRoutes.js";
import connectDB from "./utils/db.js";
import paymentRoutes from "./routes/paymentRoutes.js";

const app = express();
dotenv.config();
connectDB()
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

const port = process.env.PORT;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api", authRoutes);
app.use("/api", paymentRoutes);

app.listen(port, () => {
  console.log(`server lms listening at http://localhost:${port}`);
});
