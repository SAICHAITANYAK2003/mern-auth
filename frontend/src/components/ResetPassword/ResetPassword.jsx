import React, { useState } from "react";
import "../../App.jsx";
import axiosApi from "../../utils/axiosApi.jsx";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [verifyOtp, setVerifyOtp] = useState("");
  const [passowrd, setPassword] = useState("");
  const sendResetPasswordOtp = async () => {
    try {
      const { data } = await axiosApi.post("/users-auth/pass-reset-otp", {
        email,
      });

      if (data.success) {
        toast.success(data.message);
        setOtpSent(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const onHandleSendOtp = async (event) => {
    event.preventDefault();
    sendResetPasswordOtp();
  };

  const resetPasswordOtpForm = () => {
    return (
      <>
        <form className="reset-passwd-form" onSubmit={onHandleSendOtp}>
          <h3 className="reset-passwd-title">Reset Forgotten Password</h3>
          <div className="reset-passwd-email-box">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              onChange={(event) => setEmail(event.target.value)}
              value={email}
            />
          </div>

          <button type="submit" className="reset-passwd-otp-btn">
            Send Otp
          </button>
        </form>
      </>
    );
  };

  const onHandleChangePassword = async (event) => {
    event.preventDefault();

    const resetPasswordDetails = {
      email,
      otp: verifyOtp,
      passowrd: passowrd,
    };
    try {
      const { data } = await axiosApi.post("/users-auth/reset-password", {
        email,
        otp: verifyOtp,
        password: passowrd,
      });

      if (data.success) {
        navigate("/login");
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const resetPasswordForm = () => {
    return (
      <>
        <form className="passwd-change-form" onSubmit={onHandleChangePassword}>
          <h3 className="passwd-change-title">Change Password</h3>
          <div className="passwd-change-email-box">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              onChange={(event) => setEmail(event.target.value)}
              value={email}
            />
          </div>

          <div className="passwd-change-otp-box">
            <label htmlFor="otp">Otp</label>
            <input
              type="text"
              id="otp"
              name="otp"
              placeholder="Enter your otp"
              onChange={(event) => setVerifyOtp(event.target.value)}
              value={verifyOtp}
            />
          </div>

          <div className="passwd-change-box">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              onChange={(event) => setPassword(event.target.value)}
              value={passowrd}
            />
          </div>

          <button type="submit" className="reset-passwd-otp-btn">
            Reset Password
          </button>
        </form>
      </>
    );
  };
  return (
    <>
      <div className="reset-passwd-page">
        {otpSent ? resetPasswordForm() : resetPasswordOtpForm()}
      </div>
    </>
  );
};

export default ResetPassword;
