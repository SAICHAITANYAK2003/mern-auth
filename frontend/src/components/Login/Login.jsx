import React, { useState, useContext } from "react";
import assets from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../../context/AppContext.jsx";
import axiosApi from "../../utils/axiosApi";
import { toast } from "react-toastify";

const Login = () => {
  const { setIsLoggedIn, getUserData } = useContext(AppContent);

  const navigate = useNavigate();
  const [islogin, setisLogin] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (event) => {
    try {
      event.preventDefault();

      if (!islogin) {
        const userData = {
          name,
          email,
          password,
        };
        const { data } = await axiosApi.post(
          "/users-auth/create-user",
          userData
        );

        if (data.success) {
          setIsLoggedIn(true);
          getUserData();
          navigate("/");
        } else {
          toast(data.message);
        }
      } else {
        const userData = {
          email,
          password,
        };
        const { data } = await axiosApi.post(
          "/users-auth/login-user",
          userData
        );

        if (data.success) {
          setIsLoggedIn(true);
          getUserData();
          navigate("/");
        } else {
          toast(data.message);
        }
      }
    } catch (error) {
      toast(error.message);
    }
  };

  const renderLoginForm = () => (
    <form onSubmit={onSubmitHandler}>
      <h3 className="login-form-title">Login your account</h3>

      <div className="input-box">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="Enter your email"
          required
          onChange={(event) => setEmail(event.target.value)}
          value={email}
        />
      </div>

      <div className="input-box">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          required
          onChange={(event) => setPassword(event.target.value)}
          value={password}
        />
      </div>

      <p onClick={() => navigate("/reset-password")} className="fg-pass-link">
        Forgot password?
      </p>
      <button className="login-btn" type="submit">
        Login
      </button>
      <p className="sigup-page-link">
        Doesn't have an account?{" "}
        <span
          onClick={() => setisLogin(false)}
          style={{
            textDecoration: "underline",
            color: "#8093f1",
            cursor: "pointer",
          }}
        >
          SignUp
        </span>
      </p>
    </form>
  );

  const renderSignUpForm = () => (
    <form onSubmit={onSubmitHandler}>
      <h3 className="login-form-title">Create your account</h3>

      <div className="input-box">
        <label htmlFor="name">Username</label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Enter your name"
          required
          onChange={(event) => setName(event.target.value)}
          value={name}
        />
      </div>

      <div className="input-box">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="Enter your email"
          required
          onChange={(event) => setEmail(event.target.value)}
          value={email}
        />
      </div>

      <div className="input-box">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="Enter your password"
          required
          onChange={(event) => setPassword(event.target.value)}
          value={password}
        />
      </div>

      <p className="fg-pass-link">Forgot password?</p>
      <button className="login-btn" type="submit">
        Signup
      </button>
      <p className="sigup-page-link">
        Already have an account?{" "}
        <span
          onClick={() => setisLogin(true)}
          style={{
            textDecoration: "underline",
            color: "#8093f1",
            cursor: "pointer",
          }}
        >
          Login
        </span>
      </p>
    </form>
  );

  return (
    <div className="login-page">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        className="login-logo"
        alt="App Logo"
      />
      <div className="form-box">
        {islogin ? renderLoginForm() : renderSignUpForm()}
      </div>
    </div>
  );
};

export default Login;
