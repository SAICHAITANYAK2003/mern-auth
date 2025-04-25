import express from "express";
import { userDetails } from "../controller/userController.js";
import userAuth from "../middleware/userAuth.js";
const userRouter = express.Router();
//GET USER DATA

userRouter.get("/user-details", userAuth, userDetails);

export default userRouter;
