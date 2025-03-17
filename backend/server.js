import express from "express";
import cors from "cors";
import { connectDB } from "./config/mongodb.js";
import dotenv from "dotenv";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/user.js";
import productRouter from "./routes/product.js";
import cartRouter from "./routes/cart.js";
import orderRouter from "./routes/order.js";

//App Config
const app = express();

dotenv.config();

const port = process.env.PORT;
connectDB();
connectCloudinary();

//Middlewares
app.use(express.json());
app.use(
  cors({
    origin: [
      "https://e-commerce-frontend-virid-theta.vercel.app/", // User frontend
      "https://e-commerce-admin-six-bice.vercel.app/", // Admin frontend
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Allow cookies & auth headers
  })
);

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
