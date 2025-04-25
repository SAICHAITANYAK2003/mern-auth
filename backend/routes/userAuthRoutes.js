import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  sendVerifyOtp,
  verifyEmail,
  userAuthenticated,
  passResetOtp,
  resetPassword,
} from "../controller/userAuthController.js";
import userAuth from "../middleware/userAuth.js";

const userAuthRouter = express.Router();

//USER AUTHENTICATI0N
userAuthRouter.post("/create-user", registerUser);
userAuthRouter.post("/login-user", loginUser);
userAuthRouter.post("/logout-user", logoutUser);
userAuthRouter.post("/send-otp", userAuth, sendVerifyOtp);
userAuthRouter.post("/verify-otp", userAuth, verifyEmail);
userAuthRouter.get("/user-auth", userAuth, userAuthenticated);
userAuthRouter.post("/pass-reset-otp", passResetOtp);
userAuthRouter.post("/reset-password", resetPassword);

export default userAuthRouter;
