import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../../context/AppContext.jsx";
import assets from "../../assets/assets.js";
import "../../App.css";
import { toast } from "react-toastify";
import axiosApi from "../../utils/axiosApi.jsx";

const Navbar = () => {
  const navigate = useNavigate();
  const { userData, setUserData, setIsLoggedIn, isLoggedIn } =
    useContext(AppContent);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const sendVerifyOtp = async () => {
    try {
      const { data } = await axiosApi.post("/users-auth/send-otp");

      if (data.success) {
        navigate("/email-verify");
        toast.success(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const onHandleLogout = async () => {
    try {
      const { data } = await axiosApi.post("/users-auth/logout-user");

      if (data.success) {
        setIsLoggedIn(false);
        setUserData(null);
        navigate("/");
      } else {
        toast(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const profileBox = () => {
    return (
      <div
        className="profile-box"
        onMouseEnter={() => setDropdownVisible(true)}
        onMouseLeave={() => setDropdownVisible(false)}
      >
        <span className="profile-icon">{userData.name[0]}</span>
        {dropdownVisible && (
          <div className="dropdown-menu">
            {!userData.isAccountVerified && (
              <p onClick={sendVerifyOtp}>Verify Email</p>
            )}

            <p onClick={onHandleLogout}>Logout</p>
          </div>
        )}
      </div>
    );
  };
  return (
    <>
      <nav className="navbar-box">
        <img src={assets.logo} alt="mern logo" className="mern-logo" />
        {isLoggedIn && userData ? (
          profileBox()
        ) : (
          <button onClick={() => navigate("/login")} className="nav-login-btn">
            Login
          </button>
        )}
      </nav>
    </>
  );
};

export default Navbar;
