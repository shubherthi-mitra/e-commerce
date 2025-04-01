import express from "express";
import cors from "cors";
import { connectDB } from "./config/mongodb.js";
import { config } from "dotenv";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/user.js";
import productRouter from "./routes/product.js";
import cartRouter from "./routes/cart.js";
import orderRouter from "./routes/order.js";

//App Config
const app = express();

config({
  path: "./config/.env",
});

const port = process.env.PORT;
connectDB();
connectCloudinary();

//Middlewares
app.use(express.json());
// app.use(
//   cors({
//     origin: [
//       process.env.FRONTEND_URL, // User frontend
//       process.env.ADMIN_URL, // Admin frontend
//     ],
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true, // Allow cookies & auth headers
//   })
// );

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

//API endpoints
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

app.get("/", (req, res) => {
  res.send("API WORKING");
});

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
