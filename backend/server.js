import express from "express";
import "dotenv/config";
import connectDb from "./config/mongodb.js";
import userAuthRouter from "./routes/userAuthRoutes.js";
import userRouter from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
connectDb();

const allowedOrigin = ["https://mern-auth-frontend-qghz.onrender.com"];

const port = process.env.PORT || 4000;
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigin, credentials: true }));
app.use("/users-auth", userAuthRouter);
app.use("/users-info", userRouter);

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});

app.get("/", (request, response) => response.json("Mern Authentication Prac"));
