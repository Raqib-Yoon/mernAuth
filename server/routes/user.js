const express = require("express");
const router = express.Router();

// import validator

// import controllers

const { read, update } = require("../controllers/user");
const { requiredSignin, adminMiddleware } = require("../controllers/auth");

router.get("/user/:id", requiredSignin, read);
router.put("/user/update", requiredSignin, update);
router.put("/admin/update", requiredSignin, adminMiddleware, update);

module.exports = router;
