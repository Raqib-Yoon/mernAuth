import React from "react";
import { isAuth } from "./Helpers";
import Signin from "./Signin";
const Protected = ({ Component }) => {
  return (
    <>
      {isAuth() && isAuth().role === "subscriber" ? <Component /> : <Signin />}
    </>
  );
};

export default Protected;
