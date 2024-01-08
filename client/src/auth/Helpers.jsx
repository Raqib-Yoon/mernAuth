import cookie from "js-cookie";

const Authenticate = (response, next) => {
  localStorage.setItem("user", JSON.stringify(response.data.user));
  cookie.set("token", response.data.token);
  next();
};

const isAuth = () => {
  const cookieChecked = cookie.get("token");

  if (cookieChecked) {
    if (localStorage.getItem("user")) {
      return JSON.parse(localStorage.getItem("user"));
    } else {
      return false;
    }
  }
};

const Signup = (next) => {

  localStorage.removeItem('user')
  cookie.remove('token')

};

export { Signup, Authenticate, isAuth };
