const express = require("express");
const router = express.Router();

// import validator

const {
  userSignupValidator,
  userSigninValidator,
} = require("../validators/auth");
const { runValidation } = require("../validators");

// import controllers

const {
  signup,
  signin,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth");

const { accountActivation } = require("../controllers/auth");

router.post("/signup", userSignupValidator, runValidation, signup);
router.post("/account-activation", accountActivation);
router.post("/signin", userSigninValidator, runValidation, signin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
