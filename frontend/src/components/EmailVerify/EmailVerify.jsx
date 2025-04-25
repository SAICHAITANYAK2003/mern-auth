import React, { useContext, useState, useEffect } from "react";
import { AppContent } from "../../context/AppContext.jsx";
import "../../App.css";
import { toast } from "react-toastify";
import axiosApi from "../../utils/axiosApi.jsx";
import { useNavigate } from "react-router-dom";

const EmailVerify = () => {
  const navigate = useNavigate();
  const { getUserData, isLoggedIn, userData } = useContext(AppContent);
  const [verifyOtp, setVerifyOtp] = useState("");

  const onHandleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axiosApi.post("/users-auth/verify-otp", {
        otp: verifyOtp,
      });

      if (data.success) {
        navigate("/");
        getUserData();
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (isLoggedIn && userData && userData.isAccountVerified) {
      navigate("/");
    }
  }, [userData, navigate]);

  return (
    <>
      <div className="email-verify-page">
        <form className="email-verify-form" onSubmit={onHandleSubmit}>
          <h2 className="email-verify-title">Email verification</h2>
          <p className="email-verify-subtitle">
            Enter your 6 digits OTP code send to your email.
          </p>
          <div className="verify-email-input-box">
            <label htmlFor="otp">Enter OTP :</label>
            <input
              type="text"
              placeholder="Enter your OTP"
              id="otp"
              name="otp"
              onChange={(event) => setVerifyOtp(event.target.value)}
              value={verifyOtp}
            />
          </div>

          <button type="submit" className="send-otp-btn">
            Verify Email
          </button>
        </form>
      </div>
    </>
  );
};

export default EmailVerify;
