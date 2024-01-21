const User = require("../models/user");
const sgMail = require("@sendgrid/mail");
const jwt = require("jsonwebtoken");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  const userExist = await User.findOne({ email });

  console.log(userExist);

  if (userExist) {
    return res.status(400).json({
      error: "Email is already taken.",
    });
  }

  const token = await jwt.sign(
    { name, email, password },
    process.env.JWT_ACCOUNT_ACTIVATION
  );

  const msg = {
    from: "raqibyoon2020@gmail.com",
    to: email,
    subject: "Account activation link",
    html: `
    <p>Please use the following link to activate your account</p>
    <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
    <hr/>

    <p>This email contain sensetive information</p>
    <p>${process.env.CLIENT_URL}</p>
    `,
  };

  try {
    const response = await sgMail.send(msg);

    console.log(`THis is email response ${response}`);

    res.status(200).json({
      message: `Email has been sent to ${email} follow the instruction to activate your account.`,
    });
  } catch (error) {
    console.log(`Email sending error $${error}`);

    res.status(400).json({
      error: error.message,
    });
  }
};

// account activation

exports.accountActivation = async (req, res) => {
  console.log(req.body);
  const { token } = req.body;

  console.log(token);

  try {
    // check if is the token exist or not
    if (token) {
      // verify the token

      const isTokenVerify = await jwt.verify(
        token,
        process.env.JWT_ACCOUNT_ACTIVATION
      );

      // check expiry date of the token

      if (!isTokenVerify) {
        return res.status(401).json({
          error: "Expired link. signup again.",
        });
      }

      // decode name email and password from the token

      const { name, email, password } = jwt.decode(token);

      // now save user in the database

      const newUser = new User({ name, email, password });

      newUser.save();

      return res.status(201).json({
        message: "user sucessfully saved in the database.",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

//
//
//
//
//
//
//
//

// signin

exports.signin = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  // console.log(user)

  if (!user) {
    return res.status(400).json({
      error: "User with this email does not exist. please signup first.",
    });
  }

  console.log(user.authenticate(password));
  if (!user.authenticate(password)) {
    return res.status(400).json({
      error: "Email and password do not match.",
    });
  } else {
    // generate a token and send to client

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    let { _id, name, email, role } = user;

    return res.status(200).json({
      token,
      user: {
        _id,
        name,
        email,
        role,
      },
    });
  }
};

// middleware for user verifing

exports.requiredSignin = async (req, res, next) => {
  // get token that is sended from the frontend

  const token = req.headers["token"];

  try {
    // verify the token if it is a valid token
    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(verifyToken._id).select({
      hashed_password: 0,
      salt: 0,
    });

    req.user = user;
    req.userId = user.id;

    next();
  } catch (error) {
    return res.status(400).json({
      error: "user not found from required signin.",
    });
  }
};

// middleware for checking if this user is admin

exports.adminMiddleware = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (user.role !== "admin") {
      return res.status(400).json({
        error: "your not admin. access denied",
      });
    }

    req.profile = user;
    next();
  } catch (error) {
    return res.status(400).json({
      error: "user not found.",
    });
  }
};

//
//
//
// forgot password

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  // check if user entered a valid email

  if (!email) {
    return res.status(400).json({
      error: "Must be a valid email.",
    });
  }
  //

  try {
    const user = await User.findOne({ email });

    const token = jwt.sign({ id: user._id }, process.env.JWT_RESET_PASSWORD);

    console.log(user._id);

    console.log(token);

    const msg = {
      from: "raqibyoon2020@gmail.com",
      to: email,
      subject: "Reset password link",
      html: `
      <p>Please use the following link to activate your account</p>
      <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
      <hr/>
  
      <p>This email contain sensetive information</p>
      <p>${process.env.CLIENT_URL}</p>
      `,
    };

    await sgMail
      .send(msg)
      .then((res) => {
        res.status(200).json({
          message: `Email has been sent to ${email} follow the instruction to activate your account.`,
        });
      })
      .catch((err) => {
        // console.log(err);
        return res.status(400).json({
          error: "Something went wrong email not send.",
        });
      });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: "User with this email not found.",
    });
  }
};

// reset password function

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token) {
    return res.status(400).json({
      error: "Token is expired.",
    });
  }

  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({
      error: "password must be at least 6 character long.",
    });
  }
  try {
    const { id } = jwt.verify(token, process.env.JWT_RESET_PASSWORD);

    const user = await User.findById(id);

    user.password = newPassword;
    user.save();

    return res.json({
      message: "Greate ❤! new password successfully created.",
    });
  } catch (error) {
    return res.status(400).json({
      error: "Invalid token. Please try again"
    });
  }
};
