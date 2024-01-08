import React, { useEffect, useState } from "react";
import { Button, Stack, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const Activate = () => {
  const { token } = useParams();

  const [values, setValues] = useState({
    name: "",
    token: "",
    show: true,
  });
  useEffect(() => {
    const decode = jwtDecode(token);
    const { name } = decode;

    console.log(name);

    setValues({ ...values, name, token });
  }, []);

  const handleSubmit = async () => {
    const { token } = values;
    try {
      const response = await axios.post(
        "http://localhost:8000/api/account-activation",
        { token }
      );

      console.log("email activation client sucess ", response);

      if (response.data) {
        toast.success(response.data.message);
        setValues({ ...values, show: false });
      } else if (response.response.data.message) {
        toast.success(response.response.data.message);
        setValues({ ...values, show: false });
      }
    } catch (error) {
      console.log("Email Activation client error ", error);
    }
  };

  return (
    <>
      <Stack mt={10} alignItems={"center"}>
        <ToastContainer />
        <Typography align="center">
          {values.show ?`Hey ${values.name}, Ready to activate your account?`:`Hey ${values.name}, your account activated!` }
      
        </Typography>
        <Stack mt={10} width="10rem">
          {values.show && (
            <Button variant="outlined" mt={10} onClick={handleSubmit}>
              Activate
            </Button>
          )}
        </Stack>
      </Stack>
    </>
  );
};

export default Activate;
