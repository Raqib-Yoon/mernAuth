import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Authenticate, isAuth } from "../auth/Helpers";
import Cookies from "js-cookie";
function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

const User = () => {
  const [values, setValues] = React.useState({
    name: "",
    password: "",
    role: "",
    email: "",
  });

  React.useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const user = await axios.get(
      `http://localhost:8000/api/user/${isAuth()._id}`,
      {
        headers: {
          token: Cookies.get("token"),
        },
      }
    );

    //
    const { name, role, hashed_password, email } = user.data.user;
    console.log(user.data.user);
    setValues({ ...values, email, name, role });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setValues({ ...values, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const { name, password, role } = values;
    // Send Data to the backend
    axios
      .put(
        `http://localhost:8000/api/user/update`,
        { name, password, role },
        {
          headers: {
            token: Cookies.get("token"),
          },
        }
      )
      .then((res) => {
        const { _id, name, email, role } = res.data.user;

        if (res.data) {
          localStorage.removeItem("user");
          localStorage.setItem(
            "user",
            JSON.stringify({ _id, name, email, role })
          );
          toast.success(res.data.message);
        } else if (res.response.data) {
          toast.success(res.response.data.message);
          localStorage.removeItem("user");
          localStorage.setItem("user", JSON.stringify(res.data.user));
        }
      })
      .catch((error) => {
        if (error.response.data) {
          toast.error(error?.response?.data?.error);
        } else if (error.data) {
          toast.error(error?.data?.error);
        } else {
          toast.error(error.message);
        }
      });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <ToastContainer />
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            User Update
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Name"
              name="name"
              autoFocus
              onChange={handleChange}
              value={values.name}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              value={values.password}
              onChange={handleChange}
            />{" "}
            <TextField
              margin="normal"
              required
              fullWidth
              id="role"
              label="Role"
              name="role"
              onChange={handleChange}
              value={values.role}
              disabled
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              onChange={handleChange}
              value={values.email}
              disabled
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onChange={handleSubmit}
            >
              Update
            </Button>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
};

export default User;
