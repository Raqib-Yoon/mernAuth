const express = require("express");
const router = express.Router();

// import validator

const { userSignupValidator,userSigninValidator } = require("../validators/auth");
const { runValidation } = require("../validators");

// import controllers

const { signup } = require("../controllers/auth");
const { signin } = require("../controllers/auth");
const { accountActivation } = require("../controllers/auth");

router.post("/signup", userSignupValidator, runValidation, signup);
router.post("/account-activation", accountActivation);
router.post("/signin", userSigninValidator, runValidation, signin);

module.exports = router;
