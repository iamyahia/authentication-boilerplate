const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const {
  register,
  login,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth");

router.post(
  "/register",
  [
    check("password", "password must be more than 6 charechter")
      .exists()
      .isLength({ min: 6 }),
  ],
  register
);

router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:resetToken", resetPassword);

module.exports = router;
