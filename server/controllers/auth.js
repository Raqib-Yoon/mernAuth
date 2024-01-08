const User = require("../models/user");
const sgMail = require("@sendgrid/mail");
const JWT = require("jsonwebtoken");
const { expressJwt: jwt } = require("express-JWT");

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

  const token = await JWT.sign(
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

      const isTokenVerify = await JWT.verify(
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

      const { name, email, password } = JWT.decode(token);

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

    const token = JWT.sign({ _id: User._id }, process.env.JWT_SECRET);

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

exports.requiredSignin = jwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});
