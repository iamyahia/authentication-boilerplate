const User = require("../models/User");
const bcrypt = require("bcrypt");
const ErrorRes = require("../utils/Errors");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const { check, validationResult } = require("express-validator");

const register = async (req, res, next) => {
  const { userName, email } = req.body;
  let { password } = req.body;
  console.log(password.length);
  const user = await User.findOne({ email });

  if (user) {
    return next(new ErrorRes("this email is already in use", 404));
  }

  //  i need ot use package for this thing
  // if (password.length < 6) {
  //   return next(new ErrorRes("password must be more than 6"));
  // }
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).jsonp(errors.array());
  }

  try {
    // hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    password = hashedPassword;
    const user = new User({
      userName,
      email,
      password,
    });

    sendToken(user, 201, res);

    await user.save();
  } catch (err) {
    next(err);
  }
};
const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorRes("please provide an email and password", 400));
  }

  try {
    const user = await User.findOne({ email }).select("+password"); // we use .select('password') this code will return a user with email and Id and everithing and the password so we want to compare the password

    if (!user) {
      return next(new ErrorRes("invalid credentials", 401));
    }

    // chechk if the user password is match
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return next(new ErrorRes("invalid credentials", 401));
    }

    // if email and password is correct, we want ot respond a token, c
    sendToken(user, 200, res);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `we have err in login ${err}`,
    });
  }
};
const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return next(new ErrorRes("Email could not be sent !", 404));
    }

    const resetToken = user.resetPassToken();

    await user.save();

    /*
        1-  we send this link by the meail to the user .
        2-  before now, we created ( /reset-password ) route .
    */
    const resetUrl = `http://localhost:5000/reset-password/${resetToken}`;

    /*
        - after seting up link, we need to send amessage to the client with te the email
        - we can create a nice template with ( pug ), but we send it normaly without any design 
        - clicktracking=off:  when we use an emailing services like (sandgrid), the add a wierd link it takes you to the same route but tehy reroute it to them, so we dnn't want that  .
    */

    const em_message = `
      <h1>You have requested a password reset </h1>
      <p>Plese go to this link to reset your password </p>
      <a href=${resetUrl} clicktracking=off>${resetUrl} </a>
    `;

    //  now we send the email, for that we use NodeMailer/sandgrid package .
    try {
      await sendEmail({
        to: user.email,
        subject: "Reset Password",
        html: em_message,
      });

      res.status(200).json({
        success: true,
        data: "Email sent",
      });
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save();
      return next(new ErrorRes("Error, the email could not be sent", 500));
    }
  } catch (err) {
    next(err);
  }
};
const resetPassword = async (req, res, next) => {
  let { password } = req.body;
  //  we going to reCreate the resetToken
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return next(new ErrorRes("Invalid reset token", 400));
    }

    //  i need ot use package for this thing
    if (password.length < 6) {
      return next(new ErrorRes("password must be more than 6 charechter"));
    }
    // hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    password = hashedPassword;
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(201).json({
      success: true,
      data: "password reset success",
    });
  } catch (err) {
    next(err);
  }
};

const sendToken = (user, statusCode, res) => {
  const token = user.signedToken();

  res.status(statusCode).json({
    success: true,
    token,
    message: "success babe",
  });
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
};
