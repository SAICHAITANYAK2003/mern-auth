import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axiosApi from "../utils/axiosApi.jsx";

export const AppContent = createContext();

const AppContextProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  const getAuthState = async () => {
    try {
      const { data } = await axiosApi.get("/users-auth/user-auth");

      if (data.success) {
        setUserData(data.userData);
        setIsLoggedIn(true);
        await getUserData();
      } else {
        toast(data.message);
      }
    } catch (error) {
      toast(error.message);
    }
  };

  useEffect(() => {
    getAuthState();
  }, []);

  const getUserData = async () => {
    try {
      const { data } = await axiosApi.get("/users-info/user-details");

      data.success ? setUserData(data.userData) : toast(data.message);
    } catch (error) {
      toast(error.message);
    }
  };

  const value = {
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData,
  };
  return (
    <>
      <AppContent.Provider value={value}>{props.children}</AppContent.Provider>
    </>
  );
};

export default AppContextProvider;
