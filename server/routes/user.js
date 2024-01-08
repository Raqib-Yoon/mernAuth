const express = require("express");
const router = express.Router();

// import validator

// import controllers

const { read } = require("../controllers/user");
const{userSignin} =require('../controllers/auth')

router.get("/user/:id",userSignin, read);

module.exports = router;
