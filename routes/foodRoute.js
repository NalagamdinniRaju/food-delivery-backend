import express from "express";
import { addFood,listFood,removeFood } from "../controllers/foodController.js"; // Correct path with .js
import multer from "multer";

const foodRouter = express.Router();

// Image storage engine
const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Remove extra spaces
    },
});

const upload = multer({ storage: storage });

// Add food route
foodRouter.post("/add", upload.single("image"), addFood);
foodRouter.get("/list", listFood)
foodRouter.post("/remove",removeFood)

export default foodRouter;
