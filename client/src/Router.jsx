import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Navbar from "./core/Navbar";
import Signup from "./auth/Signup";
import Signin from "./auth/Signin";
import App from "./App";
import Activate from "./auth/Activate";
import Protected from "./auth/Protected";
import ProtectAdmin from "./auth/ProtectAdmin.jsx";
import About from "./core/About.jsx";
import Admin from "./core/Admin.jsx"
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
          <Route path="/about" element={<Protected Component={About} />} />
          <Route path="/admin" element={<ProtectAdmin Admin={Admin} />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default Router;
