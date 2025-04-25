import userModel from "../models/userModel.js";
import bycrpt from "bcryptjs";
import mailTransporter from "../config/nodemailer.js";
import crytpo from "crypto";
import jwt from "jsonwebtoken";

//CREATE  API

export const registerUser = async (request, response) => {
  const { name, email, password } = request.body;

  if (!name || !email || !password) {
    return response.json({ success: false, message: "Missing User details" });
  }

  try {
    const user = await userModel.findOne({ email });

    if (user) {
      return response.json({ success: false, message: "User already exists" });
    }

    //hashing the password
    const hashedPassword = await bycrpt.hash(password, 10);

    //creating new user
    const newUser = await userModel({ name, email, password: hashedPassword });
    await newUser.save();

    //create jwt-token
    const jwtToken = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET_TOKEN,
      {
        expiresIn: "7d",
      }
    );

    response.cookie("token", jwtToken, {
      httpOnly: true,
      secure: process.env.WEB_ENV === "production",
      sameSite: process.env.WEB_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "User Registration",
      text: `Hey user! Your account is successfully created with this email :${email}`,
    };

    await mailTransporter.sendMail(mailOptions);

    return response.json({
      success: true,
      message: "User successfully registered",
    });
  } catch (error) {
    return response.json({ success: false, message: error.message });
  }
};

//LOGIN API

export const loginUser = async (request, response) => {
  const { email, password } = request.body;

  if (!email || !password) {
    return response.json({
      success: false,
      message: "Email and password are not found",
    });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return response.json({ success: false, message: "Invalid email" });
    }

    const isMatch = await bycrpt.compare(password, user.password);

    if (!isMatch) {
      return response.json({ success: false, message: "Invalid password" });
    }

    //create jwt-token
    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET_TOKEN, {
      expiresIn: "7d",
    });

    response.cookie("token", jwtToken, {
      httpOnly: true,
      secure: process.env.WEB_ENV === "production",
      sameSite: process.env.WEB_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "User login",
      text: `Hey user! welcome to our workplace`,
    };

    await mailTransporter.sendMail(mailOptions);

    return response.json({ success: true, message: "login successful" });
  } catch (error) {
    return response.json({ success: false, message: error.message });
  }
};

//LOGOUT API

export const logoutUser = async (request, response) => {
  try {
    response.clearCookie("token", {
      httpOnly: true,
      secure: process.env.WEB_ENV === "production",
      sameSite: process.env.WEB_ENV === "production" ? "none" : "strict",
      maxAge: 0,
    });

    return response.json({ message: true, message: "Logout Successful" });
  } catch (error) {
    return response.json({ success: true, message: error.message });
  }
};

//Send  otp for verification of email

export const sendVerifyOtp = async (request, response) => {
  const userId = request.userId;
  try {
    const user = await userModel.findById(userId);

    if (user.isAccountVerified) {
      return response.json({
        success: false,
        message: "Account already Verified",
      });
    }

    const generateOtp = () => {
      const buffer = crytpo.randomBytes(3); // 8 bits -> 3 bytes = 24 bits
      const otp = parseInt(buffer.toString("hex"), 16).toString().slice(0, 6);
      return otp;
    };

    const otp = generateOtp();

    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
    user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "OTP Verification",
      text: `Your otp is ${otp},`,
    };

    await mailTransporter.sendMail(mailOptions);

    return response.json({
      success: true,
      message: "OTP sent successfully to your email",
    });
  } catch (error) {
    return response.json({ success: true, message: error.message });
  }
};

export const verifyEmail = async (request, response) => {
  const userId = request.userId;
  const { otp } = request.body;

  if (!userId || !otp) {
    return response.json({
      success: false,
      message: "Missing verification details",
    });
  }
  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return response.json({ success: false, message: "User not found" });
    }

    if (user.otp === "" || user.verifyOtp !== otp) {
      return response.json({ success: false, message: "Invalid OTP " });
    }

    if (user.verifyOtpExpireAt < Date.now()) {
      return response.json({ success: false, message: "OTP Expired" });
    }

    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;
    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Email Verification",
      text: `Your Email is verified successfully`,
    };

    await mailTransporter.sendMail(mailOptions);

    return response.json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    return response.json({ success: false, message: error.message });
  }
};

export const userAuthenticated = async (request, response) => {
  try {
    return response.json({ success: true });
  } catch (error) {
    return response.json({ success: false, message: error.message });
  }
};

//reset OTP for password-reset

export const passResetOtp = async (request, response) => {
  const { email } = request.body;

  if (!email) {
    return response.json({
      success: false,
      message: "Invalid email for reset password",
    });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return response.json({ success: false, message: "user not authorized" });
    }

    const generateOtp = () => {
      const buffer = crytpo.randomBytes(3);
      const otp = parseInt(buffer.toString("hex"), 16).toString().slice(0, 6);

      return otp;
    };

    const otp = generateOtp();

    user.resetOtpPass = otp;
    user.resetOtpPassExpireAt = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "OTP - Resetting the password",
      text: `Your otp is ${otp}, for reset the password`,
    };

    await mailTransporter.sendMail(mailOptions);

    return response.json({
      success: true,
      message: "OTP sent successfully for resetting the password",
    });
  } catch (error) {
    return response.json({ success: false, message: error.message });
  }
};

//RESET Password

export const resetPassword = async (request, response) => {
  const { email, password, otp } = request.body;

  if (!email || !password || !otp) {
    return response.json({
      success: false,
      message:
        "email, password, otp - Missing details for reseting the password",
    });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return response.json({
        success: false,
        message: "Invalid user",
      });
    }

    if (user.resetOtpPass === "" || user.resetOtpPass !== otp) {
      return response.json({
        success: false,
        message: "Invalid Reset Otp",
      });
    }

    if (user.resetOtpPassExpireAt < Date.now()) {
      return response.json({
        success: false,
        message: "OTP Expires",
      });
    }

    const hashedPassword = await bycrpt.hash(password, 10);

    user.password = hashedPassword;
    user.resetOtpPass = "";
    user.resetOtpPassExpireAt = 0;
    await user.save();
    return response.json({
      success: true,
      message: "Successfuly password done",
    });
  } catch (error) {
    return response.json({
      success: false,
      message: error.message,
    });
  }
};
