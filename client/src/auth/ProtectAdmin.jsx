import React from "react";
import { isAuth } from "./Helpers";
import { useNavigate } from "react-router";
import Signin from "./Signin";
import { Link } from "react-router-dom";
const Protected = ({ Admin }) => {

  return <>{isAuth() && isAuth().role === "admin" ? <Admin /> : <Signin />}</>;
};

export default Protected;
