import express from "express";
import cors from "cors";
import { connectDB } from "./config/database.js";
import foodRouter from "./routes/foodRoute.js"; // Correct import
import userRouter from "./routes/userRoute.js"; // Correct import
import 'dotenv/config'
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";


// App config
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Connect to database
connectDB();

// API endpoints
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"))
app.use("/api/user",userRouter);
app.use("/api/cart", cartRouter)
app.use("/api/orders", orderRouter)

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
