import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Navbar from "./core/Navbar";
import Signup from "./auth/Signup";
import Signin from "./auth/Signin";
import ForgotPassword from "./auth/ForgotPassword";
import App from "./App";
import Activate from "./auth/Activate";
import Protected from "./auth/Protected";
import ProtectAdmin from "./auth/ProtectAdmin.jsx";
import User from "./core/User";
import Admin from "./core/Admin.jsx";
import ResetPassword from "./auth/ResetPassword";
const Router = ({ children }) => {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/auth/activate/:token" element={<Activate />} />
          <Route path="/user" element={<Protected Component={User} />} />
          <Route path="/admin" element={<ProtectAdmin Admin={Admin} />} />
          <Route path="/password/forgot" element={<ForgotPassword />} />
          <Route path="/password/reset/:token" element={<ResetPassword />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default Router;
